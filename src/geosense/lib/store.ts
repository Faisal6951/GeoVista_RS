import { create } from 'zustand';
import type {
  MapStore,
  LayerState,
  AQStation,
  WeatherData,
  FirePoint,
} from '@/geosense/types';

export const useMapStore = create<MapStore>((set) => ({
  layers: {
    satellite: true,
    fires: true,
    airQuality: true,
    ndvi: false,
    weather: false,
  },
  selectedDate: new Date().toISOString().split('T')[0],
  activeWeather: null,
  activeStation: null,
  activeFire: null,
  mapCenter: [30.3753, 69.3451], // Pakistan centre
  mapZoom: 6,
  toggleLayer: (key: keyof LayerState) =>
    set((s) => ({ layers: { ...s.layers, [key]: !s.layers[key] } })),
  setDate: (d) => set({ selectedDate: d }),
  setActiveWeather: (w) =>
    set({ activeWeather: w, activeStation: null, activeFire: null }),
  setActiveStation: (st) =>
    set({ activeStation: st, activeWeather: null, activeFire: null }),
  setActiveFire: (f) =>
    set({ activeFire: f, activeStation: null, activeWeather: null }),
  setMapView: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
}));
