import { NextResponse } from 'next/server';
import { pm25ToAqi, aqiToCategory } from '@/geosense/lib/colors';
import { inPakistanBounds, PK_BBOX_OPENAQ } from '@/geosense/lib/region';

const OPENAQ_HEADERS = (key: string) => ({
  'X-API-Key': key,
  Accept: 'application/json',
});

type OpenAQLocation = {
  id: number;
  name?: string | null;
  locality?: string | null;
  coordinates?: { latitude?: number | null; longitude?: number | null };
  country?: { name?: string };
  datetimeLast?: { local?: string };
};

type OpenAQLatestRow = {
  locationsId: number;
  value: number;
  coordinates?: { latitude?: number; longitude?: number };
  datetime?: { local?: string; utc?: string };
};

export async function GET() {
  const key = process.env.OPENAQ_API_KEY;
  if (!key) {
    return NextResponse.json({
      stations: [],
      count: 0,
      error: 'OPENAQ_API_KEY missing in .env.local',
    });
  }

  try {
    const locationQueries = [
      `https://api.openaq.org/v3/locations?iso=PK&parameters_id=2&limit=100`,
      `https://api.openaq.org/v3/locations?bbox=${PK_BBOX_OPENAQ}&parameters_id=2&limit=100`,
    ];

    const locationMap = new Map<number, OpenAQLocation>();

    for (const url of locationQueries) {
      const res = await fetch(url, {
        headers: OPENAQ_HEADERS(key),
        cache: 'no-store',
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const loc of (data.results ?? []) as OpenAQLocation[]) {
        const lat = loc.coordinates?.latitude;
        const lng = loc.coordinates?.longitude;
        if (lat == null || lng == null || !inPakistanBounds(lat, lng)) continue;
        locationMap.set(loc.id, loc);
      }
    }

    const latestRes = await fetch(
      'https://api.openaq.org/v3/parameters/2/latest?limit=1000',
      { headers: OPENAQ_HEADERS(key), cache: 'no-store' }
    );

    if (!latestRes.ok) {
      const text = await latestRes.text();
      return NextResponse.json({
        stations: [],
        count: 0,
        error: `OpenAQ latest HTTP ${latestRes.status}: ${text.slice(0, 120)}`,
      });
    }

    const latestData = await latestRes.json();
    const latestByLocation = new Map<number, OpenAQLatestRow>();

    for (const row of (latestData.results ?? []) as OpenAQLatestRow[]) {
      const lat = row.coordinates?.latitude;
      const lng = row.coordinates?.longitude;
      if (lat == null || lng == null || !inPakistanBounds(lat, lng)) continue;
      latestByLocation.set(row.locationsId, row);
    }

    if (locationMap.size === 0) {
      for (const [id, row] of latestByLocation) {
        const lat = row.coordinates?.latitude ?? 0;
        const lng = row.coordinates?.longitude ?? 0;
        locationMap.set(id, {
          id,
          name: `Station ${id}`,
          locality: 'Pakistan',
          coordinates: { latitude: lat, longitude: lng },
        });
      }
    }

    const stations = Array.from(locationMap.values())
      .map((loc) => {
        const latest = latestByLocation.get(loc.id);
        const pm25 = latest?.value ?? null;
        const lat = loc.coordinates?.latitude ?? latest?.coordinates?.latitude ?? 0;
        const lng = loc.coordinates?.longitude ?? latest?.coordinates?.longitude ?? 0;
        const aqi = pm25 !== null ? pm25ToAqi(pm25) : 0;

        return {
          id: loc.id,
          name: loc.name ?? `Station ${loc.id}`,
          city: loc.locality ?? loc.country?.name ?? 'Pakistan',
          lat,
          lng,
          pm25,
          aqi,
          category: aqiToCategory(aqi),
          lastUpdated:
            latest?.datetime?.local ??
            loc.datetimeLast?.local ??
            '',
        };
      })
      .filter((s) => s.lat !== 0 && s.lng !== 0 && (s.pm25 !== null || latestByLocation.has(s.id)));

    return NextResponse.json({
      stations,
      count: stations.length,
      source: 'openaq-v3',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('OpenAQ error:', message);
    return NextResponse.json({ stations: [], count: 0, error: message });
  }
}
