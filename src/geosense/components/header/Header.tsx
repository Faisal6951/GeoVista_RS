'use client';

import Link from 'next/link';
import { Search, X, Radio, Menu } from 'lucide-react';
import { useState } from 'react';
import { useMapStore } from '@/geosense/lib/store';
import { ToolHomeButton } from '@/components/ToolShell';

type HeaderProps = {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export default function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setMapView = useMapStore((s) => s.setMapView);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.lat && data.lng) {
        setMapView([data.lat, data.lng], 10);
        setQuery('');
      } else setError('Location not found');
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }

  const searchForm = (
    <form onSubmit={handleSearch} className="geosense-search-form">
      <div
        className="flex items-center gap-2 flex-1 min-w-0 px-3 h-9 rounded-lg"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
      >
        <Search size={14} style={{ color: 'var(--sub)', flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError('');
          }}
          placeholder="Search city…"
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 13,
            color: 'var(--text)',
          }}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
            <X size={12} style={{ color: 'var(--sub)' }} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="geosense-search-go"
        disabled={loading || !query.trim()}
        style={{
          height: 36,
          padding: '0 14px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #22d3ee, #14b8a6)',
          color: '#041016',
          border: 'none',
          cursor: 'pointer',
          opacity: loading || !query.trim() ? 0.5 : 1,
          flexShrink: 0,
        }}
      >
        {loading ? '…' : 'Go'}
      </button>
      {error ? (
        <span className="geosense-search-error-inline" style={{ fontSize: 11, color: 'var(--fire)' }}>
          {error}
        </span>
      ) : null}
    </form>
  );

  return (
    <header
      style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      className="geosense-header"
    >
      <div className="geosense-header-top">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSidebar();
            }}
            className="geosense-menu-btn"
            aria-label={sidebarOpen ? 'Close layers panel' : 'Open layers panel'}
            aria-expanded={sidebarOpen}
          >
            <Menu size={18} />
          </button>
        )}

        <div className="geosense-header-brand">
          <Link
            href="/monitor"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              whiteSpace: 'nowrap',
            }}
          >
            Pulse<span style={{ color: 'var(--sat)' }}>Earth</span>
          </Link>
          <span className="geosense-live-badge">
            <Radio size={12} style={{ color: '#34d399' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--sub)',
                letterSpacing: '0.12em',
              }}
            >
              LIVE
            </span>
          </span>
        </div>

        <div className="geosense-header-divider" style={{ width: 1, height: 22, background: 'var(--border)' }} />

        <div className="geosense-header-search-desktop">{searchForm}</div>

        <div className="geosense-header-tagline">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--sub)',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            PAKISTAN · RS & GIS
          </span>
        </div>

        <div className="geosense-header-home">
          <ToolHomeButton label="Portal" compact />
        </div>
      </div>

      <div className="geosense-header-search-mobile">{searchForm}</div>
    </header>
  );
}
