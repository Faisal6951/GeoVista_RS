import type { Metadata } from 'next';
import '@/gis-explorer/globals.css';
import { ToolRouteCleanup } from '@/components/ToolShell';

export const metadata: Metadata = {
  title: 'GIS Explorer',
  description: 'Live GIS Explorer — MapLibre spatial analysis workspace.',
  icons: {
    icon: [{ url: '/icons/terrascope.svg', type: 'image/svg+xml' }],
    apple: '/icons/terrascope.svg',
  },
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gis-tool-root">
      <ToolRouteCleanup />
      {children}
    </div>
  );
}
