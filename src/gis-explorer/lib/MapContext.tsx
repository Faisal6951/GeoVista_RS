'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Map } from 'maplibre-gl';

interface MapContextValue {
  map: Map | null;
  setMap: (map: Map | null) => void;
}

const MapContext = createContext<MapContextValue>({
  map: null,
  setMap: () => {},
});

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Map | null>(null);
  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapInstance() {
  return useContext(MapContext);
}
