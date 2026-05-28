'use client';
// components/GISApp.tsx — Root application component

import React, { useEffect, useState } from 'react';
import { AppProvider, useAppState, useDispatch } from '@/gis-explorer/lib/store';
import { MapProvider } from '@/gis-explorer/lib/MapContext';
import { useMediaQuery } from '@/gis-explorer/lib/useMediaQuery';
import Header from './UI/Header';
import Sidebar from './Panels/Sidebar';
import MapContainer from './Map/MapContainer';
import StatusBar from './UI/StatusBar';
import Toolbar from './Map/Toolbar';
import MapSearchBar from './Map/MapSearchBar';

const ANALYSIS_TOOLS = new Set([
  'measure-distance',
  'measure-area',
  'draw-polygon',
  'identify',
  'profile',
]);

function GISAppShell() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeTool, activePanel } = useAppState();
  const dispatch = useDispatch();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!activeTool || !ANALYSIS_TOOLS.has(activeTool)) return;
    setSidebarOpen(true);
    if (activePanel !== 'analysis') {
      dispatch({ type: 'SET_PANEL', panel: 'analysis' });
    }
  }, [activeTool, activePanel, dispatch]);

  return (
    <div className="gis-app flex flex-col h-screen bg-surface overflow-hidden">
      <Header onToggleSidebar={() => setSidebarOpen((p) => !p)} sidebarOpen={sidebarOpen} />

      <div className="flex flex-1 min-h-0 relative">
        {isMobile && sidebarOpen && (
          <button
            type="button"
            className="gis-sidebar-backdrop"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`
              flex-shrink-0 h-full min-h-0 transition-all duration-300 ease-in-out
              ${isMobile
                ? `gis-sidebar-drawer ${sidebarOpen ? 'gis-sidebar-open' : ''}`
                : sidebarOpen
                  ? 'w-72'
                  : 'w-0 overflow-hidden'
              }
            `}
        >
          <Sidebar />
        </div>

        <div className="flex-1 min-w-0 min-h-0 relative overflow-hidden">
          <MapSearchBar isMobile={isMobile} />
          <Toolbar isMobile={isMobile} />
          <MapContainer />
        </div>
      </div>

      <StatusBar />
    </div>
  );
}

export default function GISApp() {
  return (
    <AppProvider>
      <MapProvider>
        <GISAppShell />
      </MapProvider>
    </AppProvider>
  );
}
