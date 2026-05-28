// lib/utils.ts — Utility functions for GIS operations

/**
 * Convert decimal degrees to degrees, minutes, seconds format
 */
export function toDMS(decimal: number, isLat: boolean): string {
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const minDecimal = (abs - deg) * 60;
  const min = Math.floor(minDecimal);
  const sec = ((minDecimal - min) * 60).toFixed(1);
  const dir = isLat ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W');
  return `${deg}°${min}'${sec}" ${dir}`;
}

/**
 * Format coordinate for display
 */
export function formatCoord(lng: number, lat: number): string {
  return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
}

/**
 * Calculate distance between two points in kilometers (Haversine formula)
 */
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calculate area of a polygon (approximate) in km²
 * Uses the Shoelace formula on geographic coordinates
 */
export function calcPolygonArea(coords: [number, number][]): number {
  if (coords.length < 3) return 0;
  const R = 6371; // km
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const [lon1, lat1] = coords[i];
    const [lon2, lat2] = coords[j];
    area +=
      ((lon2 - lon1) * Math.PI) / 180 *
      (2 + Math.sin((lat1 * Math.PI) / 180) + Math.sin((lat2 * Math.PI) / 180));
  }
  return Math.abs((area * R * R) / 2);
}

/**
 * Format distance in human-readable form
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`;
  return `${km.toFixed(2)} km`;
}

/**
 * Format area in human-readable form
 */
export function formatArea(km2: number): string {
  if (km2 < 1) return `${(km2 * 1_000_000).toFixed(0)} m²`;
  if (km2 < 1000) return `${km2.toFixed(2)} km²`;
  return `${(km2 / 1000).toFixed(2)} × 10³ km²`;
}

/**
 * Format zoom level to scale
 */
export function zoomToScale(zoom: number): string {
  const scale = Math.round(591657550.5 / (Math.pow(2, zoom) * 96 / 25.4 * 1000));
  if (scale >= 1_000_000) return `1:${(scale / 1_000_000).toFixed(1)}M`;
  if (scale >= 1_000) return `1:${(scale / 1000).toFixed(0)}K`;
  return `1:${scale}`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Get map scale denominator from zoom
 */
export function getScaleFromZoom(zoom: number): number {
  return Math.round(591657550.5 / Math.pow(2, zoom));
}

/**
 * Generate a unique ID
 */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export interface ElevationSample {
  distanceKm: number;
  elevationM: number;
}

/**
 * Sample elevation along a line using the Open-Elevation API
 */
export async function fetchElevationProfile(
  start: [number, number],
  end: [number, number],
  samples = 24
): Promise<{ points: ElevationSample[]; min: number; max: number }> {
  const locations: { lat: number; lng: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    locations.push({
      lat: start[1] + (end[1] - start[1]) * t,
      lng: start[0] + (end[0] - start[0]) * t,
    });
  }

  const locParam = locations.map(l => `${l.lat},${l.lng}`).join('|');
  const res = await fetch(
    `https://api.open-elevation.com/api/v1/lookup?locations=${encodeURIComponent(locParam)}`
  );

  if (!res.ok) throw new Error('Elevation service unavailable');

  const data = (await res.json()) as {
    results: { elevation: number }[];
  };

  let totalDist = 0;
  const points: ElevationSample[] = data.results.map((r, i) => {
    if (i > 0) {
      totalDist += haversineDistance(
        locations[i - 1].lat,
        locations[i - 1].lng,
        locations[i].lat,
        locations[i].lng
      );
    }
    return { distanceKm: totalDist, elevationM: r.elevation ?? 0 };
  });

  const elevations = points.map(p => p.elevationM);
  return {
    points,
    min: Math.min(...elevations),
    max: Math.max(...elevations),
  };
}
