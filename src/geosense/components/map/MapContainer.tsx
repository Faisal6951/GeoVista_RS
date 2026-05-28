"use client";
import { useEffect, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMapStore } from "@/geosense/lib/store";
import FireLayer from "./FireLayer";
import AirQualityLayer from "./AirQualityLayer";
import WeatherPanel from "@/geosense/components/dashboard/WeatherPanel";

/* Fly to location when store changes */
function FlyController() {
  const map       = useMap();
  const center    = useMapStore((s) => s.mapCenter);
  const zoom      = useMapStore((s) => s.mapZoom);
  const prevRef   = useRef<[number,number]>([0,0]);

  useEffect(() => {
    const [pc0, pc1] = prevRef.current;
    if (pc0 !== center[0] || pc1 !== center[1]) {
      map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
      prevRef.current = center;
    }
  }, [map, center, zoom]);
  return null;
}

/* Click map to get weather */
function WeatherClickHandler() {
  const setWeather = useMapStore((s) => s.setActiveWeather);
  const layers     = useMapStore((s) => s.layers);

  useMapEvents({
    async click(e) {
      if (!layers.weather) return;
      const { lat, lng } = e.latlng;
      try {
        const res  = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        if (!data.error) setWeather(data);
      } catch { /* silent */ }
    },
  });
  return null;
}

/* NASA GIBS satellite tiles */
function SatelliteLayer() {
  const on   = useMapStore((s) => s.layers.satellite);
  const date = useMapStore((s) => s.selectedDate);
  if (!on) return null;
  return (
    <TileLayer
      url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible/{z}/{y}/{x}.jpg`}
      attribution="NASA GIBS"
      opacity={0.88}
      maxZoom={9}
      tileSize={256}
    />
  );
}

/* NASA GIBS NDVI tiles */
function NDVILayer() {
  const on   = useMapStore((s) => s.layers.ndvi);
  const date = useMapStore((s) => s.selectedDate);
  if (!on) return null;
  return (
    <TileLayer
      url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/${date}/GoogleMapsCompatible/{z}/{y}/{x}.png`}
      attribution="NASA GIBS NDVI"
      opacity={0.75}
      maxZoom={9}
      tileSize={256}
    />
  );
}

export default function MapContainer() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <LeafletMap
        center={[30.3753, 69.3451]}
        zoom={6}
        style={{ width: "100%", height: "100%", background: "#080a0d" }}
        zoomControl
      >
        {/* Dark CartoDB base */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Data layers */}
        <SatelliteLayer />
        <NDVILayer />
        <FireLayer />
        <AirQualityLayer />

        {/* Behaviour */}
        <FlyController />
        <WeatherClickHandler />
      </LeafletMap>

      {/* Weather panel floats over map */}
      <WeatherPanel />
    </div>
  );
}
