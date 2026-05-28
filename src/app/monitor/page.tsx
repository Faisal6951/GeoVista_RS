'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/geosense/components/header/Header';
import Sidebar from '@/geosense/components/sidebar/Sidebar';
import StatsBar from '@/geosense/components/dashboard/StatsBar';
import { useMediaQuery } from '@/gis-explorer/lib/useMediaQuery';

const MapContainer = dynamic(() => import('@/geosense/components/map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05080f',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '2px solid #22d3ee',
          borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: '#64748b',
          letterSpacing: '0.12em',
        }}
      >
        INITIALISING GEOSENSE…
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function MonitorPage() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className="geosense-app">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <div className="geosense-body">
        {isMobile ? (
          <Sidebar
            mobile
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        ) : (
          <Sidebar open />
        )}
        <main className="geosense-main">
          <MapContainer />
        </main>
      </div>
      <StatsBar />
    </div>
  );
}
