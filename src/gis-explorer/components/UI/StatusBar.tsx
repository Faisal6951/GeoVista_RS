'use client';
// components/UI/StatusBar.tsx

import React from 'react';
import { MapPin, ZoomIn, Clock, Wifi } from 'lucide-react';
import { useAppState } from '@/gis-explorer/lib/store';
import { formatCoord, zoomToScale, toDMS } from '@/gis-explorer/lib/utils';

export default function StatusBar() {
  const state = useAppState();
  const now = new Date();

  return (
    <div className="flex items-center justify-between gap-2 px-2 sm:px-4 h-7 bg-surface-1 border-t border-border flex-shrink-0 text-[10px] font-mono overflow-hidden">
      {/* Left */}
      <div className="flex items-center gap-4 text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow" />
          <span className="text-accent-green">LIVE</span>
        </div>

        {state.coordinates ? (
          <>
            <div className="flex items-center gap-1">
              <MapPin size={9} className="text-accent-cyan" />
              <span className="text-gray-400">
                {formatCoord(state.coordinates.lng, state.coordinates.lat)}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-gray-600">
              <span>
                {toDMS(state.coordinates.lat, true)} / {toDMS(state.coordinates.lng, false)}
              </span>
            </div>
          </>
        ) : (
          <span className="text-gray-600">Move cursor over map</span>
        )}
      </div>

      {/* Center */}
      <div className="gis-status-center hidden md:flex items-center gap-4 text-gray-600">
        <div className="flex items-center gap-1">
          <ZoomIn size={9} />
          <span>Zoom: {state.zoom.toFixed(1)}</span>
        </div>
        <span>Scale: {zoomToScale(state.zoom)}</span>
        <span>WGS84 / EPSG:4326</span>
        <span>Tiles: OpenFreeMap</span>
      </div>

      {/* Right */}
      <div className="gis-status-right flex items-center gap-2 sm:gap-3 text-gray-600 shrink-0">
        <div className="flex items-center gap-1">
          <Wifi size={9} className="text-accent-green" />
          <span>Connected</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={9} />
          <span>
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} UTC
          </span>
        </div>
        <span className="text-gray-700">© OpenStreetMap Contributors</span>
      </div>
    </div>
  );
}
