"use client";

import { useEffect, useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { useMapStore } from "@/geosense/lib/store";
import { CATEGORY_COLOR } from "@/geosense/lib/colors";
import type { AQStation } from "@/geosense/types";

export default function AirQualityLayer() {
  const enabled = useMapStore((s) => s.layers.airQuality);
  const setActiveStation = useMapStore((s) => s.setActiveStation);
  const [stations, setStations] = useState<AQStation[]>([]);
  useEffect(() => {
    if (!enabled) return;
    fetch("/api/airquality")
      .then((r) => r.json())
      .then((d) => {
        const list = (d.stations ?? []).filter((s: AQStation) => s.pm25 !== null);
        setStations(list);
      })
      .catch(() => setStations([]));
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {stations.map((s) => (
        <CircleMarker
          key={s.id}
          center={[s.lat, s.lng]}
          radius={10}
          pathOptions={{
            color: CATEGORY_COLOR[s.category],
            fillColor: CATEGORY_COLOR[s.category],
            fillOpacity: 0.75,
            weight: 2,
          }}
          eventHandlers={{ click: () => setActiveStation(s) }}
        >
          <Popup>
            <div style={{ padding: "12px 14px", minWidth: 190, fontFamily: "'DM Sans',sans-serif" }}>
              <p
                style={{
                  fontWeight: 700,
                  color: CATEGORY_COLOR[s.category],
                  marginBottom: 8,
                  fontSize: 13,
                }}
              >
                {s.name}
              </p>
              <div style={{ display: "grid", gap: 4 }}>
                {[
                  ["City", s.city],
                  ["AQI", `${s.aqi} (${s.category})`],
                  ["PM2.5", s.pm25 !== null ? `${s.pm25.toFixed(1)} µg/m³` : "N/A"],
                  ["Updated", s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12 }}>
                    <span style={{ color: "#64748b" }}>{k}</span>
                    <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}
