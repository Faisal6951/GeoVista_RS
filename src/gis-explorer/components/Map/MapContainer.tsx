'use client';
// components/Map/MapContainer.tsx — Core interactive map with MapLibre GL JS

import React, { useEffect, useRef, useCallback } from 'react';
import maplibregl, { Map, MapMouseEvent, Popup } from 'maplibre-gl';
import { useAppState, useDispatch } from '@/gis-explorer/lib/store';
import { useMapInstance } from '@/gis-explorer/lib/MapContext';
import { BASE_MAPS } from '@/gis-explorer/lib/layers';
import { applyGisLayers } from '@/gis-explorer/lib/mapLayers';
import { gibsTileUrl, RS_LAYER_ID, RS_SOURCE_ID, RS_OVERLAYS } from '@/gis-explorer/lib/rsOverlays';
import { haversineDistance, calcPolygonArea, fetchElevationProfile } from '@/gis-explorer/lib/utils';
import {
  resolveUserLocation,
  getIpApproxLocation,
  reverseGeocode,
  geolocationErrorMessage,
  zoomFromAccuracy,
  formatAccuracy,
} from '@/gis-explorer/lib/geolocation';

function parseStyleUrl(styleUrl: string): string | object {
  try {
    return JSON.parse(styleUrl);
  } catch {
    return styleUrl;
  }
}

function addMarker(map: Map, lng: number, lat: number, color: string, markers: maplibregl.Marker[]) {
  const el = document.createElement('div');
  el.style.cssText = `width:10px;height:10px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 6px ${color}88`;
  const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
  markers.push(marker);
}

function createPlaceMarker(type: 'search' | 'user'): HTMLElement {
  const wrap = document.createElement('div');
  if (type === 'user') {
    wrap.innerHTML = `
      <div style="position:relative;width:28px;height:28px">
        <div style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.25);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></div>
        <div style="position:absolute;inset:6px;border-radius:50%;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 12px rgba(59,130,246,0.8)"></div>
      </div>`;
  } else {
    wrap.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:14px;height:14px;background:#22d3ee;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(34,211,238,0.5)"></div>
        <div style="width:6px;height:3px;background:rgba(0,0,0,0.25);border-radius:50%;margin-top:2px"></div>
      </div>`;
  }
  return wrap;
}

const USER_ACCURACY_SOURCE = 'user-accuracy-source';
const USER_ACCURACY_FILL = 'user-accuracy-fill';
const USER_ACCURACY_LINE = 'user-accuracy-line';

/** Approximate accuracy ring in WGS84 (metres). */
function accuracyCircleGeoJson(lng: number, lat: number, radiusM: number): GeoJSON.Feature<GeoJSON.Polygon> {
  const radiusKm = Math.max(radiusM, 25) / 1000;
  const points = 64;
  const coords: [number, number][] = [];
  const latRad = (lat * Math.PI) / 180;
  const degPerKmLng = 1 / (111.32 * Math.cos(latRad));
  const degPerKmLat = 1 / 110.574;

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    coords.push([
      lng + Math.cos(angle) * radiusKm * degPerKmLng,
      lat + Math.sin(angle) * radiusKm * degPerKmLat,
    ]);
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [coords] },
  };
}

function setUserAccuracyCircle(map: Map, lng: number, lat: number, accuracyM: number) {
  const geojson = accuracyCircleGeoJson(lng, lat, accuracyM);

  const existing = map.getSource(USER_ACCURACY_SOURCE);
  if (existing && 'setData' in existing) {
    (existing as maplibregl.GeoJSONSource).setData(geojson);
    return;
  }

  map.addSource(USER_ACCURACY_SOURCE, { type: 'geojson', data: geojson });
  map.addLayer({
    id: USER_ACCURACY_FILL,
    type: 'fill',
    source: USER_ACCURACY_SOURCE,
    paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.12 },
  });
  map.addLayer({
    id: USER_ACCURACY_LINE,
    type: 'line',
    source: USER_ACCURACY_SOURCE,
    paint: { 'line-color': '#3b82f6', 'line-width': 2, 'line-opacity': 0.45 },
  });
}

function clearUserAccuracyCircle(map: Map) {
  try {
    if (map.getLayer(USER_ACCURACY_LINE)) map.removeLayer(USER_ACCURACY_LINE);
    if (map.getLayer(USER_ACCURACY_FILL)) map.removeLayer(USER_ACCURACY_FILL);
    if (map.getSource(USER_ACCURACY_SOURCE)) map.removeSource(USER_ACCURACY_SOURCE);
  } catch {
    /* style reloading */
  }
}

export default function MapContainer() {
  const state = useAppState();
  const dispatch = useDispatch();
  const { setMap } = useMapInstance();
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);
  const searchMarkerRef = useRef<maplibregl.Marker | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const prevBaseMap = useRef<string>('');
  const measurePointsRef = useRef(state.measurePoints);
  const drawPointsRef = useRef(state.drawPoints);

  measurePointsRef.current = state.measurePoints;
  drawPointsRef.current = state.drawPoints;

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  }, []);

  const waitForMapReady = useCallback((map: Map) => {
    return new Promise<void>(resolve => {
      if (map.loaded()) resolve();
      else map.once('load', () => resolve());
    });
  }, []);

  const showUserLocationOnMap = useCallback(
    async (
      map: Map,
      lng: number,
      lat: number,
      accuracy: number,
      meta: { source?: string; placeName?: string; coordNote?: string }
    ) => {
      await waitForMapReady(map);

      dispatch({
        type: 'SET_USER_LOCATION',
        lng,
        lat,
        accuracy,
        source: meta.source,
        placeName: meta.placeName,
      });

      map.flyTo({
        center: [lng, lat],
        zoom: zoomFromAccuracy(accuracy),
        duration: 1600,
        essential: true,
      });

      searchMarkerRef.current?.remove();
      searchMarkerRef.current = null;

      userMarkerRef.current?.remove();
      userMarkerRef.current = new maplibregl.Marker({
        element: createPlaceMarker('user'),
        anchor: 'center',
      })
        .setLngLat([lng, lat])
        .addTo(map);

      if (map.isStyleLoaded()) setUserAccuracyCircle(map, lng, lat, accuracy);
      else map.once('idle', () => setUserAccuracyCircle(map, lng, lat, accuracy));

      let placeLabel = meta.placeName;
      if (!placeLabel) {
        try {
          placeLabel = await reverseGeocode(lat, lng);
        } catch {
          placeLabel = '';
        }
      }

      if (popupRef.current) popupRef.current.remove();
      const sourceNote =
        meta.source === 'ip'
          ? '<p style="color:#fbbf24;font-size:10px;margin-top:6px">Network-based estimate (city-level). Use “Set on map” for exact spot.</p>'
          : meta.source === 'manual'
            ? '<p style="color:#a78bfa;font-size:10px;margin-top:6px">You placed this pin on the map.</p>'
            : accuracy > 500
              ? `<p style="color:#fbbf24;font-size:10px;margin-top:6px">GPS fix ${formatAccuracy(accuracy)} — may be approximate on PC.</p>`
              : `<p style="color:#6e7681;font-size:10px;margin-top:4px">Accuracy ${formatAccuracy(accuracy)}</p>`;

      const coordNote = meta.coordNote
        ? `<p style="color:#4ade80;font-size:10px;margin-top:4px">${meta.coordNote}</p>`
        : '';

      popupRef.current = new maplibregl.Popup({ closeButton: true, offset: 14, maxWidth: '280px' })
        .setLngLat([lng, lat])
        .setHTML(`
          <div style="font-family:var(--font-body),sans-serif;font-size:12px;color:#e6edf3">
            <div style="font-weight:600;color:#3b82f6;margin-bottom:4px">Your location</div>
            ${placeLabel ? `<div style="color:#8b949e;font-size:11px;margin-bottom:4px">${placeLabel}</div>` : ''}
            <div style="font-family:monospace;font-size:11px;color:#6e7681">
              ${lat.toFixed(6)}°, ${lng.toFixed(6)}°
            </div>
            ${coordNote}
            ${sourceNote}
          </div>
        `)
        .addTo(map);
    },
    [dispatch, waitForMapReady]
  );

  const applyRsOverlay = useCallback((map: Map) => {
    try {
      if (map.getLayer(RS_LAYER_ID)) map.removeLayer(RS_LAYER_ID);
      if (map.getSource(RS_SOURCE_ID)) map.removeSource(RS_SOURCE_ID);
    } catch {
      /* ignore */
    }

    if (!state.activeRSIndex) return;

    const config = RS_OVERLAYS[state.activeRSIndex];
    if (!config) return;

    map.addSource(RS_SOURCE_ID, {
      type: 'raster',
      tiles: [gibsTileUrl(config)],
      tileSize: 256,
      attribution: '© NASA GIBS',
      maxzoom: config.maxZoom,
    });

    const beforeId = map.getStyle()?.layers?.find(l => l.type === 'symbol')?.id;
    map.addLayer(
      {
        id: RS_LAYER_ID,
        type: 'raster',
        source: RS_SOURCE_ID,
        paint: {
          'raster-opacity': config.opacity,
          'raster-fade-duration': 0,
        },
      },
      beforeId
    );
  }, [state.activeRSIndex]);

  // ─── Init Map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const activeStyle = BASE_MAPS.find(b => b.id === state.activeBaseMap)!;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: parseStyleUrl(activeStyle.styleUrl) as string,
      center: [25, 25],
      zoom: 3,
      maxZoom: 20,
      minZoom: 1,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    map.on('mousemove', (e: MapMouseEvent) => {
      dispatch({ type: 'SET_COORDS', coords: { lng: e.lngLat.lng, lat: e.lngLat.lat } });
    });

    map.on('zoom', () => {
      dispatch({ type: 'SET_ZOOM', zoom: map.getZoom() });
    });

    const onStyleReady = () => {
      applyGisLayers(map, state.layers);
      applyRsOverlay(map);
    };

    map.on('load', onStyleReady);
    map.on('styledata', () => {
      if (map.isStyleLoaded()) onStyleReady();
    });

    mapRef.current = map;
    setMap(map);
    prevBaseMap.current = state.activeBaseMap;

    return () => {
      map.remove();
      mapRef.current = null;
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Reset view ───────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || state.mapResetToken === 0) return;
    searchMarkerRef.current?.remove();
    searchMarkerRef.current = null;
    userMarkerRef.current?.remove();
    userMarkerRef.current = null;
    clearUserAccuracyCircle(map);
    map.flyTo({ center: [25, 25], zoom: 3, duration: 1200 });
  }, [state.mapResetToken]);

  // ─── Fly to search / place ────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const target = state.flyToTarget;
    if (!map || !target || state.flyToToken === 0) return;

    const { lng, lat, zoom, label } = target;
    map.flyTo({ center: [lng, lat], zoom, duration: 1600, essential: true });

    searchMarkerRef.current?.remove();
    searchMarkerRef.current = new maplibregl.Marker({
      element: createPlaceMarker('search'),
      anchor: 'bottom',
    })
      .setLngLat([lng, lat])
      .addTo(map);

    if (label) {
      if (popupRef.current) popupRef.current.remove();
      popupRef.current = new maplibregl.Popup({ closeButton: true, offset: 16, maxWidth: '240px' })
        .setLngLat([lng, lat])
        .setHTML(`
          <div style="font-family:var(--font-body),sans-serif;font-size:12px;color:#e6edf3">
            <div style="font-weight:600;color:#22d3ee;margin-bottom:4px">Destination</div>
            <div style="color:#8b949e;font-size:11px">${label}</div>
            <div style="color:#6e7681;font-size:10px;margin-top:4px;font-family:monospace">
              ${lat.toFixed(5)}°, ${lng.toFixed(5)}°
            </div>
          </div>
        `)
        .addTo(map);
    }
  }, [state.flyToToken, state.flyToTarget]);

  // ─── Geolocation (GPS + coordinate fix + IP fallback) ─────────────────────
  useEffect(() => {
    if (state.geolocateToken === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const pos = await resolveUserLocation();
        if (cancelled || !mapRef.current) return;

        await showUserLocationOnMap(
          mapRef.current,
          pos.longitude,
          pos.latitude,
          pos.accuracy,
          { source: pos.source, placeName: pos.placeName }
        );
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof GeolocationPositionError
            ? geolocationErrorMessage(err.code)
            : err instanceof Error
              ? err.message
              : 'Could not determine your location.';
        dispatch({ type: 'SET_LOCATION_ERROR', message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.geolocateToken, dispatch, showUserLocationOnMap]);

  // ─── Network (IP) location estimate ───────────────────────────────────────
  useEffect(() => {
    if (state.useNetworkLocationToken === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const pos = await getIpApproxLocation();
        if (cancelled || !mapRef.current) return;
        await showUserLocationOnMap(
          mapRef.current,
          pos.longitude,
          pos.latitude,
          pos.accuracy,
          { source: 'ip', placeName: pos.placeName }
        );
      } catch {
        if (!cancelled) {
          dispatch({
            type: 'SET_LOCATION_ERROR',
            message: 'Network location unavailable. Try “Set on map” instead.',
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.useNetworkLocationToken, dispatch, showUserLocationOnMap]);

  // ─── Handle Base Map Change ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || state.activeBaseMap === prevBaseMap.current) return;
    prevBaseMap.current = state.activeBaseMap;

    const bm = BASE_MAPS.find(b => b.id === state.activeBaseMap);
    if (!bm) return;

    mapRef.current.setStyle(parseStyleUrl(bm.styleUrl) as string);
  }, [state.activeBaseMap]);

  // ─── Sync GIS layers ──────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sync = () => applyGisLayers(map, state.layers);
    if (map.isStyleLoaded()) sync();
    else map.once('styledata', sync);
  }, [state.layers, state.activeBaseMap]);

  // ─── RS index overlay ─────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sync = () => applyRsOverlay(map);
    if (map.isStyleLoaded()) sync();
    else map.once('styledata', sync);
  }, [state.activeRSIndex, state.activeBaseMap, applyRsOverlay]);

  // ─── Restore user accuracy ring after basemap style reload ────────────────
  useEffect(() => {
    const map = mapRef.current;
    const loc = state.userLocation;
    if (!map || !loc) return;

    const sync = () => setUserAccuracyCircle(map, loc.lng, loc.lat, loc.accuracy);
    if (map.isStyleLoaded()) sync();
    else map.once('idle', sync);
  }, [state.activeBaseMap, state.userLocation]);

  // ─── Map clicks (spatial tools) ───────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = async (e: MapMouseEvent) => {
      const point: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      if (state.pickLocationOnMap) {
        await showUserLocationOnMap(map, point[0], point[1], 15, {
          source: 'manual',
          placeName: 'Selected on map',
        });
        return;
      }

      const tool = state.activeTool;
      if (!tool) return;

      if (tool === 'measure-distance') {
        dispatch({ type: 'ADD_MEASURE_POINT', point });
        addMarker(map, point[0], point[1], '#22d3ee', markersRef.current);

        const allPts = [...measurePointsRef.current, point];
        if (allPts.length >= 2) {
          let dist = 0;
          for (let i = 1; i < allPts.length; i++) {
            dist += haversineDistance(allPts[i - 1][1], allPts[i - 1][0], allPts[i][1], allPts[i][0]);
          }
          dispatch({ type: 'SET_MEASURE_RESULT', result: { distance: dist } });
        }
      }

      if (tool === 'measure-area') {
        dispatch({ type: 'ADD_MEASURE_POINT', point });
        addMarker(map, point[0], point[1], '#4ade80', markersRef.current);

        const allPts = [...measurePointsRef.current, point];
        if (allPts.length >= 3) {
          dispatch({ type: 'SET_MEASURE_RESULT', result: { area: calcPolygonArea(allPts) } });
        }
      }

      if (tool === 'draw-polygon') {
        dispatch({ type: 'ADD_DRAW_POINT', point });
        addMarker(map, point[0], point[1], '#a78bfa', markersRef.current);

        const allPts = [...drawPointsRef.current, point];
        if (allPts.length >= 3) {
          dispatch({ type: 'SET_MEASURE_RESULT', result: { area: calcPolygonArea(allPts) } });
        }
      }

      if (tool === 'profile') {
        const existing = measurePointsRef.current;
        if (existing.length >= 2) {
          dispatch({ type: 'CLEAR_MEASURE' });
          clearMarkers();
        }

        dispatch({ type: 'ADD_MEASURE_POINT', point });
        addMarker(map, point[0], point[1], '#fbbf24', markersRef.current);

        const pts = existing.length >= 2 ? [point] : [...existing, point];
        if (pts.length === 2) {
          dispatch({ type: 'SET_PROFILE_LOADING', loading: true });
          try {
            const profile = await fetchElevationProfile(pts[0], pts[1]);
            dispatch({ type: 'SET_PROFILE_RESULT', result: profile });
            const dist = haversineDistance(pts[0][1], pts[0][0], pts[1][1], pts[1][0]);
            dispatch({ type: 'SET_MEASURE_RESULT', result: { distance: dist } });
          } catch {
            dispatch({ type: 'SET_PROFILE_LOADING', loading: false });
            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new maplibregl.Popup({ closeButton: true })
              .setLngLat(point)
              .setHTML('<p style="font-size:11px;color:#f87171">Could not load elevation data.</p>')
              .addTo(map);
          }
        }
      }

      if (tool === 'identify') {
        if (popupRef.current) popupRef.current.remove();
        const features = map.queryRenderedFeatures(e.point);
        const layerNames = Array.from(
          new Set(features.slice(0, 8).map(f => f.layer?.id ?? 'unknown'))
        );

        popupRef.current = new maplibregl.Popup({ closeButton: true, maxWidth: '260px' })
          .setLngLat(point)
          .setHTML(`
            <div style="font-family:monospace;font-size:11px;color:#e6edf3">
              <div style="font-weight:600;margin-bottom:6px;color:#22d3ee">Feature Info</div>
              <div style="color:#8b949e;margin-bottom:4px">Coordinates</div>
              <div>${point[1].toFixed(5)}, ${point[0].toFixed(5)}</div>
              <div style="color:#8b949e;margin-top:6px;margin-bottom:4px">Layers</div>
              <div>${layerNames.join(', ') || 'None detected'}</div>
              <div style="color:#8b949e;margin-top:6px;margin-bottom:4px">Features</div>
              <div>${features.length} at click</div>
            </div>
          `)
          .addTo(map);
      }
    };

    const handleDblClick = (e: MapMouseEvent) => {
      if (state.activeTool === 'measure-area' || state.activeTool === 'draw-polygon') {
        e.preventDefault();
        const pts =
          state.activeTool === 'draw-polygon' ? drawPointsRef.current : measurePointsRef.current;
        if (pts.length >= 3) {
          dispatch({
            type: 'SET_MEASURE_RESULT',
            result: { area: calcPolygonArea(pts) },
          });
        }
      }
    };

    if (state.pickLocationOnMap || state.activeTool) {
      map.getCanvas().style.cursor = 'crosshair';
      if (state.activeTool) map.doubleClickZoom.disable();
    } else {
      map.getCanvas().style.cursor = '';
      map.doubleClickZoom.enable();
      clearMarkers();
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    }

    map.on('click', handleClick);
    map.on('dblclick', handleDblClick);
    return () => {
      map.off('click', handleClick);
      map.off('dblclick', handleDblClick);
    };
  }, [state.activeTool, state.pickLocationOnMap, dispatch, clearMarkers, showUserLocationOnMap]);

  // ─── Draw measurement / AOI geometries ────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const SOURCE_ID = 'measure-source';
    const LINE_ID = 'measure-line';
    const FILL_ID = 'measure-fill';

    const cleanup = () => {
      try { if (map.getLayer(LINE_ID)) map.removeLayer(LINE_ID); } catch { /* */ }
      try { if (map.getLayer(FILL_ID)) map.removeLayer(FILL_ID); } catch { /* */ }
      try { if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID); } catch { /* */ }
    };

    cleanup();

    const pts =
      state.activeTool === 'draw-polygon' ? state.drawPoints : state.measurePoints;
    if (pts.length < 2) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: pts as number[][] },
      }],
    };

    const isAreaTool =
      state.activeTool === 'measure-area' || state.activeTool === 'draw-polygon';

    if (isAreaTool && pts.length >= 3) {
      geojson.features.push({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[...pts, pts[0]] as number[][]],
        },
      });
    }

    const lineColor =
      state.activeTool === 'draw-polygon'
        ? '#a78bfa'
        : state.activeTool === 'measure-area'
          ? '#4ade80'
          : '#22d3ee';

    try {
      map.addSource(SOURCE_ID, { type: 'geojson', data: geojson });
      map.addLayer({
        id: LINE_ID,
        type: 'line',
        source: SOURCE_ID,
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': lineColor,
          'line-width': 2,
          'line-dasharray': [4, 2],
          'line-opacity': 0.9,
        },
      });
      if (isAreaTool) {
        map.addLayer({
          id: FILL_ID,
          type: 'fill',
          source: SOURCE_ID,
          filter: ['==', '$type', 'Polygon'],
          paint: {
            'fill-color': state.activeTool === 'draw-polygon' ? '#a78bfa' : '#4ade80',
            'fill-opacity': 0.15,
          },
        });
      }
    } catch {
      /* style reloading */
    }

    return cleanup;
  }, [state.measurePoints, state.drawPoints, state.activeTool]);

  // ─── Keyboard: Esc clears active tool ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.activeTool) {
        dispatch({ type: 'SET_TOOL', tool: null });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.activeTool, dispatch]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {state.activeRSIndex && RS_OVERLAYS[state.activeRSIndex] && (
        <div className="gis-map-chip-warn absolute top-14 right-3 z-10 text-[10px] font-mono px-2.5 py-1.5 rounded-md max-w-[200px]">
          {RS_OVERLAYS[state.activeRSIndex].label}
        </div>
      )}

      {state.pickLocationOnMap && (
        <div className="gis-map-chip-warn absolute top-[4.5rem] left-1/2 -translate-x-1/2 z-10 text-[11px] font-mono px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap max-w-[90vw] text-center">
          <span className="cursor-blink mr-1">▶</span>
          CLICK THE MAP WHERE YOU ARE
        </div>
      )}

      {state.activeTool && !state.pickLocationOnMap && (
        <div className="gis-map-chip-accent absolute top-[4.5rem] left-1/2 -translate-x-1/2 z-10 text-[11px] font-mono px-3 py-1.5 rounded-full pointer-events-none animate-fade-in whitespace-nowrap max-w-[90vw] text-center">
          <span className="cursor-blink mr-1">▶</span>
          {state.activeTool === 'measure-distance' && 'MEASURE DISTANCE — Click to add points'}
          {state.activeTool === 'measure-area' && 'MEASURE AREA — Click vertices, double-click to finish'}
          {state.activeTool === 'draw-polygon' && 'DRAW AOI — Click vertices, double-click to close'}
          {state.activeTool === 'identify' && 'IDENTIFY — Click to inspect features'}
          {state.activeTool === 'profile' && 'ELEVATION PROFILE — Click start and end point'}
        </div>
      )}
    </div>
  );
}
