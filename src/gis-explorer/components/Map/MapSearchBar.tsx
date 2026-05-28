'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useDispatch } from '@/gis-explorer/lib/store';
import { searchPlaces, GeocodeResult } from '@/gis-explorer/lib/geocoding';

type MapSearchBarProps = {
  isMobile?: boolean;
};

export default function MapSearchBar({ isMobile = false }: MapSearchBarProps) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const places = await searchPlaces(q);
      setResults(places);
      setOpen(places.length > 0);
    } catch {
      setError('Search unavailable. Try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 380);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const goToPlace = (place: GeocodeResult) => {
    dispatch({
      type: 'FLY_TO',
      lng: place.lng,
      lat: place.lat,
      zoom: place.zoom,
      label: place.displayName.split(',')[0],
    });
    setQuery(place.displayName.split(',')[0]);
    setOpen(false);
    setResults([]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results[0]) goToPlace(results[0]);
    else runSearch(query);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setError(null);
  };

  return (
    <div
      ref={wrapperRef}
      className={`gis-search-bar absolute top-3 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-3 pointer-events-none ${isMobile ? 'gis-search-mobile' : ''}`}
    >
      <form
        onSubmit={onSubmit}
        className="pointer-events-auto group"
      >
        <div
          className={`
            gis-map-control flex items-center gap-2 rounded-lg transition-all duration-200
            ${open ? '!border-accent-cyan' : ''}
          `}
        >
          <div className="pl-3 text-gray-500">
            {loading ? (
              <Loader2 size={15} className="animate-spin text-accent-cyan" />
            ) : (
              <Search size={15} className="group-focus-within:text-accent-cyan transition-colors" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search city, address, or place…"
            className="flex-1 bg-transparent py-2.5 text-[13px] outline-none"
            autoComplete="off"
            spellCheck={false}
          />

          {query && (
            <button
              type="button"
              onClick={clear}
              className="p-1.5 mr-1 rounded-md text-gray-500 hover:text-gray-200 hover:bg-surface-3 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            className="mr-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/25 transition-colors"
          >
            Go
          </button>
        </div>

        {error && (
          <p className="mt-1.5 text-[11px] text-red-400 text-center pointer-events-none">{error}</p>
        )}

        {open && results.length > 0 && (
          <ul
            className="gis-map-control mt-1.5 rounded-lg overflow-hidden max-h-56 overflow-y-auto overscroll-contain"
            role="listbox"
          >
            {results.map(place => (
              <li key={place.id}>
                <button
                  type="button"
                  role="option"
                  onClick={() => goToPlace(place)}
                  className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-accent-cyan/5 border-b border-border/50 last:border-0 transition-colors"
                >
                  <MapPin size={13} className="text-accent-cyan mt-0.5 flex-shrink-0" />
                  <span className="text-[12px] leading-snug" style={{ color: 'var(--gis-panel-text)' }}>
                    {place.displayName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
