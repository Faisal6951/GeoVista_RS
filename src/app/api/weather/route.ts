import { NextRequest, NextResponse } from "next/server";

const WMO: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle",
  55: "Dense drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 80: "Rain showers", 81: "Heavy showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code` +
      `&timezone=auto&forecast_days=7`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Open-Meteo request failed" }, { status: 500 });
    }

    const data = await res.json();
    const c    = data.current;
    const d    = data.daily;

    return NextResponse.json({
      current: {
        lat:           parseFloat(lat),
        lng:           parseFloat(lng),
        temperature:   Math.round(c.temperature_2m),
        humidity:      c.relative_humidity_2m,
        windSpeed:     Math.round(c.wind_speed_10m),
        windDirection: c.wind_direction_10m,
        precipitation: c.precipitation,
        weatherCode:   c.weather_code,
        description:   WMO[c.weather_code] ?? "Unknown",
      },
      forecast: (d.time as string[]).map((date, i) => ({
        date,
        maxTemp:       Math.round(d.temperature_2m_max[i]),
        minTemp:       Math.round(d.temperature_2m_min[i]),
        precipitation: d.precipitation_sum[i] ?? 0,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
