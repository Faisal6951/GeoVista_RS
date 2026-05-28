import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) return NextResponse.json({ error: "q param required" }, { status: 400 });

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
    const res  = await fetch(url, {
      headers: { "User-Agent": "GeoSense-RSGIS/1.0 (finalyearproject)" },
      cache: "no-store",
    });
    const data = await res.json();
    if (!data.length) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    return NextResponse.json({
      lat:         parseFloat(data[0].lat),
      lng:         parseFloat(data[0].lon),
      displayName: data[0].display_name,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
