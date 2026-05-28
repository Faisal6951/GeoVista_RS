import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  transpilePackages: ['maplibre-gl'],
  async redirects() {
    return [
      { source: '/tools', destination: '/platform', permanent: true },
      { source: '/gis-explorer', destination: '/terrascope', permanent: true },
      { source: '/geosense', destination: '/pulsearch', permanent: true },
      { source: '/dashboard', destination: '/platform', permanent: true },
    ];
  },
};

export default nextConfig;
