'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './ToolShell.module.css';

/** Restores portal theme and body styles when leaving /explorer or /monitor */
export function ToolRouteCleanup() {
  useEffect(() => {
    document.documentElement.classList.add('in-tool-route');
    document.body.classList.add('in-tool-route');

    return () => {
      document.documentElement.classList.remove('in-tool-route');
      document.body.classList.remove('in-tool-route');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';

      try {
        const saved = localStorage.getItem('geovista-theme');
        document.documentElement.setAttribute(
          'data-theme',
          saved === 'light' ? 'light' : 'dark',
        );
      } catch {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    };
  }, []);

  return null;
}

type ToolHomeButtonProps = {
  label?: string;
  compact?: boolean;
};

export function ToolHomeButton({
  label = 'Portal',
  compact = false,
}: ToolHomeButtonProps) {
  return (
    <Link
      href='/'
      className={`${styles.homeBtn} ${compact ? styles.homeBtnCompact : ''} min-[960px]:max-[1150px]:py-[0.4rem] min-[960px]:max-[1150px]:px-[0.1rem] min-[960px]:max-[1150px]:text-[0.7rem]`}
      title='Back to GeoVista home'
    >
      <ArrowLeft size={12} strokeWidth={2.5} aria-hidden />
      <span>{label}</span>
    </Link>
  );
}
