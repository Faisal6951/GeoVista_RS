import { NextRequest, NextResponse } from 'next/server';
import { PK_BBOX_FIRMS } from '@/geosense/lib/region';

const FIRMS_SOURCES = ['VIIRS_SNPP_NRT', 'VIIRS_NOAA20_NRT', 'VIIRS_NOAA21_NRT'] as const;

function parseFirmsCsv(text: string, fallbackDate: string) {
  if (!text?.trim() || text.trim().startsWith('{') || text.trim().startsWith('<')) {
    return { fires: [] as ReturnType<typeof mapFireRow>[], error: text?.slice(0, 200) };
  }

  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    return { fires: [], error: undefined };
  }

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const gi = (name: string) => header.indexOf(name);

  const fires = lines
    .slice(1)
    .filter(Boolean)
    .map((line) => mapFireRow(line.split(','), gi, fallbackDate))
    .filter((f) => !isNaN(f.lat) && !isNaN(f.lng));

  return { fires, error: undefined };
}

function mapFireRow(c: string[], gi: (n: string) => number, fallbackDate: string) {
  return {
    lat: parseFloat(c[gi('latitude')]),
    lng: parseFloat(c[gi('longitude')]),
    brightness: parseFloat(c[gi('bright_ti4')] ?? c[gi('brightness')] ?? '0'),
    frp: parseFloat(c[gi('frp')] ?? '0'),
    acq_date: c[gi('acq_date')] ?? fallbackDate,
    acq_time: c[gi('acq_time')] ?? '',
    satellite: c[gi('satellite')] ?? 'VIIRS',
    daynight: (c[gi('daynight')] ?? 'D') as 'D' | 'N',
    confidence: c[gi('confidence')] ?? 'nominal',
  };
}

async function fetchFirmsCsv(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();
  return { ok: res.ok, text };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get('date') ?? new Date().toISOString().split('T')[0];
  const key = process.env.FIRMS_API_KEY;

  if (!key) {
    return NextResponse.json({
      fires: [],
      count: 0,
      date: dateParam,
      error: 'FIRMS_API_KEY missing in .env.local',
    });
  }

  const today = new Date().toISOString().split('T')[0];
  const selectedMs = new Date(`${dateParam}T12:00:00Z`).getTime();
  const todayMs = new Date(`${today}T12:00:00Z`).getTime();
  const daysAgo = (todayMs - selectedMs) / 86_400_000;
  const isRecent = daysAgo >= 0 && daysAgo <= 5;

  const urls: string[] = [];
  if (isRecent) {
    for (const source of FIRMS_SOURCES) {
      urls.push(
        `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/${source}/${PK_BBOX_FIRMS}/3`
      );
    }
  } else {
    for (const source of FIRMS_SOURCES) {
      urls.push(
        `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/${source}/${PK_BBOX_FIRMS}/1/${dateParam}`
      );
    }
  }

  let lastError: string | undefined;
  const seen = new Set<string>();

  for (const url of urls) {
    try {
      const { ok, text } = await fetchFirmsCsv(url);
      if (!ok && !text) {
        lastError = `HTTP error for ${url}`;
        continue;
      }

      const { fires, error } = parseFirmsCsv(text, dateParam);
      if (error && fires.length === 0) {
        lastError = error;
        continue;
      }

      const unique = fires.filter((f) => {
        const k = `${f.lat.toFixed(4)},${f.lng.toFixed(4)},${f.acq_date}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

      if (unique.length > 0) {
        return NextResponse.json({
          fires: unique,
          count: unique.length,
          date: dateParam,
          source: url.includes('VIIRS') ? url.split('/').slice(-3, -2)[0] : 'FIRMS',
        });
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'Fetch failed';
    }
  }

  return NextResponse.json({
    fires: [],
    count: 0,
    date: dateParam,
    error: lastError ?? 'No fire data for this date. Try a recent date or check FIRMS_API_KEY.',
  });
}
