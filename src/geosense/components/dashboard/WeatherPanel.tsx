"use client";
import { X, Wind, Droplets, Thermometer, Navigation } from "lucide-react";
import { useMapStore } from "@/geosense/lib/store";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeatherPanel() {
  const { activeWeather, setActiveWeather } = useMapStore();
  if (!activeWeather) return null;
  const { current, forecast } = activeWeather;

  return (
    <div style={{ position: "absolute", bottom: 48, right: 12, width: 280, zIndex: 1000,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.7)", animation: "fadeIn .3s ease" }}>
      {/* Header */}
      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{current.description}</p>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--sub)" }}>
            {current.lat.toFixed(3)}, {current.lng.toFixed(3)}
          </p>
        </div>
        <button onClick={() => setActiveWeather(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sub)", padding: 2 }}>
          <X size={14} />
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", borderBottom: "1px solid var(--border)" }}>
        {[
          { icon: <Thermometer size={12} />, label: "Temp",      value: `${current.temperature}°C`, color: "#3b82f6" },
          { icon: <Droplets size={12} />,    label: "Humidity",  value: `${current.humidity}%`,     color: "#38bdf8" },
          { icon: <Wind size={12} />,        label: "Wind",      value: `${current.windSpeed} km/h`, color: "var(--sub)" },
          { icon: <Navigation size={12} />,  label: "Direction", value: `${current.windDirection}°`, color: "var(--sub)" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--surface2)", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: s.color }}>{s.icon}</span>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--sub)", textTransform: "uppercase", marginBottom: 1 }}>{s.label}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 7-day chart */}
      <div style={{ padding: "12px 12px 10px" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--sub)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>7-Day Forecast</p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={forecast} barGap={2} barSize={14}>
            <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en", { weekday: "short" })}
              tick={{ fontSize: 9, fill: "#64748b", fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--text)" }}
              labelFormatter={(d) => new Date(d).toLocaleDateString()}
              formatter={(v: any, name: string) => [name === "maxTemp" ? `${v}°C` : `${v}mm`, name === "maxTemp" ? "Max Temp" : "Rain"]} />
            <Bar dataKey="maxTemp" fill="#3b82f6" radius={[3,3,0,0]} />
            <Bar dataKey="precipitation" fill="#38bdf8" radius={[3,3,0,0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
