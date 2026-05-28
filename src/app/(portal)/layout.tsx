'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

function PortalThemeSync() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('geovista-theme');
      document.documentElement.setAttribute(
        'data-theme',
        saved === 'light' ? 'light' : 'dark'
      );
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    document.documentElement.classList.remove('in-tool-route');
    document.body.classList.remove('in-tool-route');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
  }, []);
  return null;
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PortalThemeSync />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, paddingTop: 'var(--nav-h)' }}>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
