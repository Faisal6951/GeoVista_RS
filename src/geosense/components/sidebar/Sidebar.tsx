"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Satellite, Flame, Wind, Leaf, CloudRain, X } from "lucide-react";
import { useMapStore } from "@/geosense/lib/store";
import type { LayerState } from "@/geosense/types";
import { CATEGORY_COLOR } from "@/geosense/lib/colors";

const LAYERS: {
  key: keyof LayerState;
  label: string;
  icon: React.ReactNode;
  color: string;
  source: string;
}[] = [
  { key: "satellite", label: "Satellite", icon: <Satellite size={13} />, color: "#3b82f6", source: "NASA GIBS MODIS" },
  { key: "fires", label: "Fire Hotspots", icon: <Flame size={13} />, color: "#ef4444", source: "NASA FIRMS VIIRS" },
  { key: "airQuality", label: "Air Quality", icon: <Wind size={13} />, color: "#f97316", source: "OpenAQ v3" },
  { key: "ndvi", label: "Vegetation", icon: <Leaf size={13} />, color: "#16a34a", source: "NASA GIBS NDVI" },
  { key: "weather", label: "Weather", icon: <CloudRain size={13} />, color: "#64748b", source: "Click map" },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
  mobile?: boolean;
};

function SidebarPanel({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const { layers, toggleLayer, selectedDate, setDate } = useMapStore();

  return (
    <aside
      className={`geosense-sidebar ${open ? "geosense-sidebar-open" : ""}`}
      aria-hidden={!open}
    >
      {onClose && (
        <div className="geosense-sidebar-head">
          <p className="geosense-sidebar-title">Layers &amp; controls</p>
          <button type="button" className="geosense-sidebar-close" onClick={onClose} aria-label="Close panel">
            <X size={18} />
          </button>
        </div>
      )}

      <div style={{ padding: "12px 12px 8px" }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9,
            color: "var(--sub)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Layers
        </p>
        {LAYERS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => toggleLayer(l.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              marginBottom: 2,
              cursor: "pointer",
              background: layers[l.key] ? "rgba(255,255,255,0.06)" : "transparent",
              border: `1px solid ${layers[l.key] ? "var(--border)" : "transparent"}`,
            }}
          >
            <div
              className={`geosense-layer-toggle-track ${layers[l.key] ? "is-on" : ""}`}
              style={{ ["--toggle-color" as string]: l.color }}
            >
              <div
                className="geosense-layer-toggle-knob"
                style={{ left: layers[l.key] ? "calc(100% - 13px)" : 3 }}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: layers[l.key] ? "var(--text)" : "var(--sub)",
                }}
              >
                <span style={{ color: layers[l.key] ? l.color : "var(--sub)" }}>{l.icon}</span>
                {l.label}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 9,
                  color: "var(--sub)",
                  marginTop: 1,
                }}
              >
                {l.source}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "0 12px" }} />

      <div style={{ padding: "12px" }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9,
            color: "var(--sub)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Date
        </p>
        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          min="2022-01-01"
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            height: 32,
            padding: "0 8px",
            borderRadius: 8,
            fontSize: 12,
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontFamily: "'JetBrains Mono',monospace",
            colorScheme: "dark",
            outline: "none",
          }}
        />
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9,
            color: "var(--sub)",
            marginTop: 4,
          }}
        >
          Fires &amp; NDVI data date
        </p>
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "0 12px" }} />

      <div style={{ padding: "12px" }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9,
            color: "var(--sub)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Legend
        </p>
        <p style={{ fontSize: 10, color: "var(--sub)", marginBottom: 4 }}>Fire intensity</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          {[5, 8, 12, 18].map((r, i) => (
            <div
              key={i}
              style={{
                width: r,
                height: r,
                borderRadius: "50%",
                background: "#ef4444",
                opacity: 0.4 + i * 0.15,
                flexShrink: 0,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              color: "var(--sub)",
              marginLeft: 4,
            }}
          >
            Low→High
          </span>
        </div>
        <p style={{ fontSize: 10, color: "var(--sub)", marginBottom: 4 }}>Air quality</p>
        {(Object.entries(CATEGORY_COLOR) as [string, string][]).map(([cat, col]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: col, flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
                color: "var(--sub)",
                textTransform: "capitalize",
              }}
            >
              {cat}
            </span>
          </div>
        ))}
        <p style={{ fontSize: 10, color: "var(--sub)", margin: "8px 0 4px" }}>Vegetation (NDVI)</p>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: "linear-gradient(to right, #8B4513, #facc15, #16a34a, #14532d)",
            marginBottom: 2,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--sub)" }}>
            Barren
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--sub)" }}>
            Dense
          </span>
        </div>
      </div>

      <div style={{ marginTop: "auto", padding: "12px", borderTop: "1px solid var(--border)" }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9,
            color: "var(--sub)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          Data Sources
        </p>
        {["NASA FIRMS", "NASA GIBS", "OpenAQ v3", "Open-Meteo", "Nominatim"].map((s) => (
          <p
            key={s}
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              color: "var(--sub)",
              marginBottom: 2,
            }}
          >
            · {s}
          </p>
        ))}
      </div>
    </aside>
  );
}

export default function Sidebar({ open = true, onClose, mobile = false }: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mobile) {
    if (!mounted || !open) return null;
    return createPortal(
      <div className="geosense-sidebar-portal">
        <button
          type="button"
          className="geosense-sidebar-backdrop"
          aria-label="Close layers panel"
          onClick={onClose}
        />
        <SidebarPanel open onClose={onClose} />
      </div>,
      document.body
    );
  }

  return <SidebarPanel open={open} />;
}
