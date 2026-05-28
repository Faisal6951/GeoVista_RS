// lib/geocoding.ts — OpenStreetMap Nominatim place search

export interface GeocodeResult {
  id: string;
  displayName: string;
  lng: number;
  lat: number;
  type: string;
  /** Suggested zoom when flying to this place */
  zoom: number;
}

function zoomFromPlaceType(type: string, category: string): number {
  const t = `${type} ${category}`.toLowerCase();
  if (t.includes('country')) return 5;
  if (t.includes('state') || t.includes('region')) return 7;
  if (t.includes('city') || t.includes('town') || t.includes('municipality')) return 11;
  if (t.includes('village') || t.includes('suburb') || t.includes('neighbourhood')) return 13;
  if (t.includes('road') || t.includes('street')) return 15;
  if (t.includes('building') || t.includes('house')) return 17;
  return 12;
}

export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '8');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: { 'Accept-Language': 'en' },
  });

  if (!res.ok) throw new Error('Place search failed');

  const data = (await res.json()) as {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    type?: string;
    class?: string;
  }[];

  return data.map(item => ({
    id: String(item.place_id),
    displayName: item.display_name,
    lng: parseFloat(item.lon),
    lat: parseFloat(item.lat),
    type: item.type ?? item.class ?? 'place',
    zoom: zoomFromPlaceType(item.type ?? '', item.class ?? ''),
  }));
}
