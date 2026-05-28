/** Pakistan extent — W,S,E,N for FIRMS; lng/lat bounds for filtering */
export const PK_BBOX_FIRMS = '62,23,77,37';
export const PK_BOUNDS = { west: 62, south: 23, east: 77, north: 37 };
export const PK_BBOX_OPENAQ = '62,23,77,37'; // minLng,minLat,maxLng,maxLat

export function inPakistanBounds(lat: number, lng: number): boolean {
  return (
    lat >= PK_BOUNDS.south &&
    lat <= PK_BOUNDS.north &&
    lng >= PK_BOUNDS.west &&
    lng <= PK_BOUNDS.east
  );
}
