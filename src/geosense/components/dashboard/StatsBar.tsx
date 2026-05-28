"use client";

import { useEffect, useState } from "react";
import { Flame, Wind, Thermometer, MapPin } from "lucide-react";
import { useMapStore } from "@/geosense/lib/store";
import { CATEGORY_COLOR } from "@/geosense/lib/colors";

export default function StatsBar() {
  const { layers, selectedDate, activeWeather, activeStation, activeFire } = useMapStore();
  const [fireInfo, setFireInfo] = useState("—");
  const [aqInfo, setAqInfo] = useState("—");

  useEffect(() => {
    if (!layers.fires) {
      setFireInfo("—");
      return;
    }
    setFireInfo("…");
    fetch(`/api/fires?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setFireInfo("Err");
        else setFireInfo(String(d.count ?? 0));
      })
      .catch(() => setFireInfo("—"));
  }, [layers.fires, selectedDate]);

  useEffect(() => {
    if (!layers.airQuality) {
      setAqInfo("—");
      return;
    }
    setAqInfo("…");
    fetch("/api/airquality")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setAqInfo("Err");
        else setAqInfo(String(d.count ?? 0));
      })
      .catch(() => setAqInfo("—"));
  }, [layers.airQuality]);

  const items = [
    {
      icon: <Flame size={11} />,
      label: layers.fires ? "FIRE HOTSPOTS" : "ACTIVE FIRES",
      value: layers.fires ? fireInfo : "—",
      color: "#ef4444",
      title: layers.fires ? `FIRMS hotspots for ${selectedDate}` : undefined,
    },
    {
      icon: <Wind size={11} />,
      label: layers.airQuality ? "AQ STATIONS" : "AQI",
      value: layers.airQuality
        ? aqInfo
        : activeStation
          ? `${activeStation.aqi} · ${activeStation.category}`
          : "—",
      color: activeStation && !layers.airQuality ? CATEGORY_COLOR[activeStation.category] : "#f97316",
      title: layers.airQuality ? "OpenAQ stations in Pakistan" : undefined,
    },
    {
      icon: <Thermometer size={11} />,
      label: "TEMP",
      value: activeWeather ? `${activeWeather.current.temperature}°C` : "—",
      color: "#3b82f6",
    },
    {
      icon: <MapPin size={11} />,
      label: "REGION",
      value: "Punjab, PK",
      color: "var(--sub)",
    },
  ];

  return (
    <div
      style={{
        height: 40,
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        zIndex: 40,
        overflowX: "auto",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="geosense-stats-item"
          title={item.title}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 14px",
            borderRight: "1px solid var(--border)",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <span style={{ color: item.color }}>{item.icon}</span>
          <div>
            <p
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 8,
                color: "var(--sub)",
                letterSpacing: "0.12em",
                marginBottom: 1,
              }}
            >
              {item.label}
            </p>
            <p style={{ fontSize: 12, fontWeight: 600, color: item.color, lineHeight: 1 }}>{item.value}</p>
          </div>
        </div>
      ))}
      {activeFire && (
        <div style={{ marginLeft: "auto", padding: "0 14px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <Flame size={10} style={{ color: "#ef4444" }} />
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--sub)", whiteSpace: "nowrap" }}>
            {activeFire.lat.toFixed(4)}, {activeFire.lng.toFixed(4)} · FRP {activeFire.frp.toFixed(1)} MW
          </span>
        </div>
      )}
    </div>
  );
}
