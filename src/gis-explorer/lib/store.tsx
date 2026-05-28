'use client';
// lib/store.tsx — Application state management

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GISLayer, GIS_LAYERS, BASE_MAPS } from './layers';

export interface AppState {
  activeBaseMap: string;
  layers: GISLayer[];
  activePanel: 'layers' | 'analysis' | 'indices' | 'info';
  activeTool: string | null;
  coordinates: { lng: number; lat: number } | null;
  zoom: number;
  measurePoints: [number, number][];
  drawPoints: [number, number][];
  measureResult: { distance?: number; area?: number } | null;
  profileResult: { points: { distanceKm: number; elevationM: number }[]; min: number; max: number } | null;
  profileLoading: boolean;
  mapResetToken: number;
  sidebarOpen: boolean;
  activeRSIndex: string | null;
  searchQuery: string;
  flyToToken: number;
  flyToTarget: { lng: number; lat: number; zoom: number; label?: string; marker?: 'search' | 'user' } | null;
  geolocateToken: number;
  locationError: string | null;
  userLocation: { lng: number; lat: number; accuracy: number; source?: string; placeName?: string } | null;
  pickLocationOnMap: boolean;
  useNetworkLocationToken: number;
}

type Action =
  | { type: 'SET_BASE_MAP'; id: string }
  | { type: 'TOGGLE_LAYER'; id: string }
  | { type: 'SET_LAYER_OPACITY'; id: string; opacity: number }
  | { type: 'SET_PANEL'; panel: AppState['activePanel'] }
  | { type: 'SET_TOOL'; tool: string | null }
  | { type: 'SET_COORDS'; coords: { lng: number; lat: number } }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'ADD_MEASURE_POINT'; point: [number, number] }
  | { type: 'CLEAR_MEASURE' }
  | { type: 'SET_MEASURE_RESULT'; result: AppState['measureResult'] }
  | { type: 'ADD_DRAW_POINT'; point: [number, number] }
  | { type: 'CLEAR_DRAW' }
  | { type: 'SET_PROFILE_RESULT'; result: AppState['profileResult'] }
  | { type: 'SET_PROFILE_LOADING'; loading: boolean }
  | { type: 'RESET_MAP_VIEW' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_RS_INDEX'; id: string | null }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'FLY_TO'; lng: number; lat: number; zoom?: number; label?: string; marker?: 'search' | 'user' }
  | { type: 'REQUEST_GEOLOCATION' }
  | { type: 'SET_LOCATION_ERROR'; message: string | null }
  | { type: 'SET_USER_LOCATION'; lng: number; lat: number; accuracy: number; source?: string; placeName?: string }
  | { type: 'SET_PICK_LOCATION_ON_MAP'; active: boolean }
  | { type: 'REQUEST_NETWORK_LOCATION' };

const initialState: AppState = {
  activeBaseMap: BASE_MAPS[0].id,
  layers: GIS_LAYERS,
  activePanel: 'layers',
  activeTool: null,
  coordinates: null,
  zoom: 4,
  measurePoints: [],
  drawPoints: [],
  measureResult: null,
  profileResult: null,
  profileLoading: false,
  mapResetToken: 0,
  sidebarOpen: true,
  activeRSIndex: null,
  searchQuery: '',
  flyToToken: 0,
  flyToTarget: null,
  geolocateToken: 0,
  locationError: null,
  userLocation: null,
  pickLocationOnMap: false,
  useNetworkLocationToken: 0,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_BASE_MAP':
      return { ...state, activeBaseMap: action.id };
    case 'TOGGLE_LAYER':
      return {
        ...state,
        layers: state.layers.map(l =>
          l.id === action.id ? { ...l, visible: !l.visible } : l
        ),
      };
    case 'SET_LAYER_OPACITY':
      return {
        ...state,
        layers: state.layers.map(l =>
          l.id === action.id ? { ...l, defaultOpacity: action.opacity } : l
        ),
      };
    case 'SET_PANEL':
      return { ...state, activePanel: action.panel };
    case 'SET_TOOL': {
      if (action.tool === state.activeTool) {
        return {
          ...state,
          activeTool: null,
          measurePoints: [],
          drawPoints: [],
          measureResult: null,
          profileResult: null,
          profileLoading: false,
        };
      }
      return {
        ...state,
        activeTool: action.tool,
        measurePoints: [],
        drawPoints: [],
        measureResult: null,
        profileResult: null,
        profileLoading: false,
      };
    }
    case 'SET_COORDS':
      return { ...state, coordinates: action.coords };
    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom };
    case 'ADD_MEASURE_POINT':
      return { ...state, measurePoints: [...state.measurePoints, action.point] };
    case 'CLEAR_MEASURE':
      return {
        ...state,
        measurePoints: [],
        drawPoints: [],
        measureResult: null,
        profileResult: null,
        profileLoading: false,
      };
    case 'SET_MEASURE_RESULT':
      return { ...state, measureResult: action.result };
    case 'ADD_DRAW_POINT':
      return { ...state, drawPoints: [...state.drawPoints, action.point] };
    case 'CLEAR_DRAW':
      return { ...state, drawPoints: [] };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_PROFILE_RESULT':
      return { ...state, profileResult: action.result, profileLoading: false };
    case 'SET_PROFILE_LOADING':
      return { ...state, profileLoading: action.loading };
    case 'RESET_MAP_VIEW':
      return { ...state, mapResetToken: state.mapResetToken + 1 };
    case 'SET_RS_INDEX':
      return { ...state, activeRSIndex: action.id };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'FLY_TO':
      return {
        ...state,
        flyToTarget: {
          lng: action.lng,
          lat: action.lat,
          zoom: action.zoom ?? 12,
          label: action.label,
          marker: action.marker ?? 'search',
        },
        flyToToken: state.flyToToken + 1,
        locationError: null,
      };
    case 'REQUEST_GEOLOCATION':
      return { ...state, geolocateToken: state.geolocateToken + 1, locationError: null };
    case 'SET_LOCATION_ERROR':
      return { ...state, locationError: action.message };
    case 'SET_USER_LOCATION':
      return {
        ...state,
        userLocation: {
          lng: action.lng,
          lat: action.lat,
          accuracy: action.accuracy,
          source: action.source,
          placeName: action.placeName,
        },
        locationError: null,
        pickLocationOnMap: false,
        coordinates: { lng: action.lng, lat: action.lat },
      };
    case 'SET_PICK_LOCATION_ON_MAP':
      return {
        ...state,
        pickLocationOnMap: action.active,
        locationError: action.active ? null : state.locationError,
      };
    case 'REQUEST_NETWORK_LOCATION':
      return {
        ...state,
        useNetworkLocationToken: state.useNetworkLocationToken + 1,
        locationError: null,
      };
    default:
      return state;
  }
}

const StateContext = createContext<AppState>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export const useAppState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext);
