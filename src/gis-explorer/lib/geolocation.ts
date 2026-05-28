// lib/geolocation.ts — Reliable browser positioning (WGS84)

export interface UserPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  source?: 'gps' | 'ip' | 'manual';
  placeName?: string;
}

function isValidWgs84(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(Math.abs(lat) < 0.0001 && Math.abs(lng) < 0.0001)
  );
}

/**
 * Fix lat/lng swap — common on some Windows / browser location stacks
 * (e.g. Thailand reported as lat≈100, lng≈13 instead of lat≈13, lng≈100).
 */
export function normalizeCoordinates(
  latitude: number,
  longitude: number
): { lat: number; lng: number; swapped: boolean } {
  let lat = latitude;
  let lng = longitude;
  let swapped = false;

  const trySwap = () => {
    [lat, lng] = [lng, lat];
    swapped = true;
  };

  if (Math.abs(lat) > 90) trySwap();

  // Mid-latitude countries: latitude should not be > 60 when longitude is smaller
  if (Math.abs(lat) > 60 && Math.abs(lng) <= 60 && Math.abs(lng) < Math.abs(lat)) {
    trySwap();
  }

  return { lat, lng, swapped };
}

/** Pick zoom level from reported accuracy (metres). */
export function zoomFromAccuracy(accuracyM: number): number {
  if (accuracyM <= 25) return 17;
  if (accuracyM <= 80) return 16;
  if (accuracyM <= 250) return 15;
  if (accuracyM <= 800) return 14;
  if (accuracyM <= 2500) return 12;
  return 10;
}

export function formatAccuracy(accuracyM: number): string {
  if (accuracyM < 1000) return `±${Math.round(accuracyM)} m`;
  return `±${(accuracyM / 1000).toFixed(1)} km`;
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 30000,
};

export function geolocationErrorMessage(code: number): string {
  const messages: Record<number, string> = {
    1: 'Location permission denied. Allow location for this site in browser settings (lock icon in address bar).',
    2: 'Location unavailable. In Windows: Settings → Privacy → Location → On, and allow your browser.',
    3: 'Location request timed out. Try again, or use "Set on map" below.',
  };
  return messages[code] ?? 'Could not determine your location.';
}

/** Network-based approximate location (no GPS). */
export async function getIpApproxLocation(): Promise<UserPosition> {
  const res = await fetch('https://ipwho.is/');
  if (!res.ok) throw new Error('Network location service unavailable');

  const data = (await res.json()) as {
    success: boolean;
    latitude: number;
    longitude: number;
    city?: string;
    region?: string;
    country?: string;
  };

  if (!data.success) throw new Error('Could not resolve network location');

  const norm = normalizeCoordinates(data.latitude, data.longitude);
  const place = [data.city, data.region, data.country].filter(Boolean).join(', ');

  return {
    latitude: norm.lat,
    longitude: norm.lng,
    accuracy: 25_000,
    source: 'ip',
    placeName: place || 'Network estimate',
  };
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString(), { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) return '';
  const data = (await res.json()) as { display_name?: string };
  return data.display_name ?? '';
}

/**
 * Browser GPS / Windows location with coordinate normalization.
 */
export function getAccuratePosition(): Promise<UserPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported in this browser.'));
      return;
    }

    let settled = false;
    let watchId: number | null = null;
    let best: UserPosition | null = null;

    const finish = (pos: UserPosition) => {
      if (settled) return;
      settled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      const norm = normalizeCoordinates(pos.latitude, pos.longitude);
      resolve({
        ...pos,
        latitude: norm.lat,
        longitude: norm.lng,
        source: 'gps',
      });
    };

    const fail = (err: GeolocationPositionError | Error) => {
      if (settled) return;
      if (best) {
        finish(best);
        return;
      }
      settled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      reject(err);
    };

    const onPosition = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const norm = normalizeCoordinates(latitude, longitude);
      if (!isValidWgs84(norm.lat, norm.lng)) return;

      const reading: UserPosition = {
        latitude: norm.lat,
        longitude: norm.lng,
        accuracy: Number.isFinite(accuracy) ? accuracy : 9999,
        source: 'gps',
      };

      if (!best || reading.accuracy < best.accuracy) best = reading;
      if (reading.accuracy <= 100) finish(reading);
    };

    const timer = setTimeout(() => {
      if (best) finish(best);
      else fail(new Error('GPS timed out. Try "Network estimate" or "Set on map".'));
    }, 28000);

    watchId = navigator.geolocation.watchPosition(
      onPosition,
      () => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        watchId = null;
        navigator.geolocation.getCurrentPosition(onPosition, err => fail(err), GEO_OPTIONS);
      },
      GEO_OPTIONS
    );
  });
}

/** GPS first; if missing or very inaccurate, fall back to IP geolocation. */
export async function resolveUserLocation(): Promise<UserPosition> {
  try {
    const gps = await getAccuratePosition();
    if (gps.accuracy <= 5_000) return gps;

    try {
      const ip = await getIpApproxLocation();
      const distKm = haversineKm(gps.latitude, gps.longitude, ip.latitude, ip.longitude);
      if (distKm > 50 && gps.accuracy > 10_000) {
        return {
          ...ip,
          placeName: `${ip.placeName} (browser fix was ${Math.round(distKm)} km off)`,
        };
      }
    } catch {
      /* keep GPS */
    }
    return gps;
  } catch {
    return getIpApproxLocation();
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
