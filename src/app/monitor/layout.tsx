import type { Metadata } from 'next';
import '@/geosense/globals.css';
import { ToolRouteCleanup } from '@/components/ToolShell';

export const metadata: Metadata = {
  title: 'GeoSense Monitor',
  description: 'Live environmental monitoring for Pakistan.',
  icons: {
    icon: [{ url: '/icons/pulsearch.svg', type: 'image/svg+xml' }],
    apple: '/icons/pulsearch.svg',
  },
};

export default function MonitorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="geosense-tool-root">
      <ToolRouteCleanup />
      {children}
    </div>
  );
}
