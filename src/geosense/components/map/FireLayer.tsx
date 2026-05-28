"use client";

import { useEffect, useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { useMapStore } from "@/geosense/lib/store";
import type { FirePoint } from "@/geosense/types";

function frpToRadius(frp: number) {
  return Math.min(Math.max(Math.sqrt(frp) * 2 + 4, 4), 22);
}
function brightnessToOpacity(b: number) {
  return Math.min(Math.max(((b - 300) / 200) * 0.4 + 0.55, 0.55), 0.95);
}

export default function FireLayer() {
  const enabled = useMapStore((s) => s.layers.fires);
  const date = useMapStore((s) => s.selectedDate);
  const setActiveFire = useMapStore((s) => s.setActiveFire);
  const [fires, setFires] = useState<FirePoint[]>([]);
  useEffect(() => {
    if (!enabled) return;
    fetch(`/api/fires?date=${date}`)
      .then((r) => r.json())
      .then((d) => setFires(d.fires ?? []))
      .catch(() => setFires([]));
  }, [enabled, date]);

  if (!enabled) return null;

  return (
    <>
      {fires.map((fire, i) => (
        <CircleMarker
          key={`${fire.lat}-${fire.lng}-${i}`}
          center={[fire.lat, fire.lng]}
          radius={frpToRadius(fire.frp)}
          pathOptions={{
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: brightnessToOpacity(fire.brightness),
            weight: 1,
            opacity: 0.9,
          }}
          eventHandlers={{ click: () => setActiveFire(fire) }}
        >
          <Popup>
            <div style={{ padding: "12px 14px", minWidth: 190, fontFamily: "'DM Sans',sans-serif" }}>
              <p style={{ fontWeight: 700, color: "#ef4444", marginBottom: 8, fontSize: 13 }}>Fire Hotspot</p>
              <div style={{ display: "grid", gap: 4 }}>
                {[
                  ["Date", fire.acq_date],
                  ["Time", fire.acq_time],
                  ["Satellite", fire.satellite],
                  ["FRP", `${fire.frp.toFixed(1)} MW`],
                  ["Confidence", fire.confidence],
                  ["Coords", `${fire.lat.toFixed(4)}, ${fire.lng.toFixed(4)}`],
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
