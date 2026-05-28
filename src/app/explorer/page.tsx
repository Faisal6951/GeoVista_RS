'use client';

import dynamic from 'next/dynamic';

const GISApp = dynamic(() => import('@/gis-explorer/components/GISApp'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d1117',
        color: '#94a3b8',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        letterSpacing: '0.1em',
      }}
    >
      LOADING GIS EXPLORER…
    </div>
  ),
});

export default function ExplorerPage() {
  return <GISApp />;
}
