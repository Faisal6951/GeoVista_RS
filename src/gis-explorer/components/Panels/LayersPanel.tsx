'use client';
// components/Panels/LayersPanel.tsx

import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronRight, Search, Layers } from 'lucide-react';
import { useAppState, useDispatch } from '@/gis-explorer/lib/store';
import { BASE_MAPS, CATEGORY_META, GISLayer, LayerCategory } from '@/gis-explorer/lib/layers';

const CATEGORY_ORDER: LayerCategory[] = ['hydrology', 'infrastructure', 'landuse', 'geology'];

const LAYER_ICONS: Record<string, string> = {
  'water-bodies': '💧', rivers: '🌊', 'roads-major': '🛣️', 'roads-minor': '🛤️',
  buildings: '🏗️', greenery: '🌳', industrial: '🏭', residential: '🏘️',
  agricultural: '🌾', rocks: '🪨',
};

export default function LayersPanel() {
  const state = useAppState();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const toggleCategory = (cat: string) => {
    setCollapsed(p => {
      const next = new Set(p);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const byCategory = CATEGORY_ORDER.reduce<Record<string, GISLayer[]>>((acc, cat) => {
    acc[cat] = state.layers.filter(l =>
      l.category === cat &&
      (!search || l.label.toLowerCase().includes(search.toLowerCase()))
    );
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Base Maps */}
      <div className="flex-shrink-0 p-3 border-b border-border">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Base Map</p>
        <div className="grid grid-cols-2 gap-1.5">
          {BASE_MAPS.map(bm => (
            <button
              key={bm.id}
              onClick={() => dispatch({ type: 'SET_BASE_MAP', id: bm.id })}
              className={`
                flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-[11px] transition-all border
                ${state.activeBaseMap === bm.id
                  ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan'
                  : 'bg-surface-2 border-border text-gray-400 hover:text-gray-200 hover:border-border-light'
                }
              `}
            >
              <span className="text-base leading-none">{bm.thumbnail}</span>
              <div>
                <div className="font-medium">{bm.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {state.activeBaseMap === 'satellite' && (
        <div className="mx-3 mt-2 bg-amber-500/5 border border-amber-500/25 rounded-md px-2.5 py-2 text-[10px] text-amber-400/90 leading-relaxed">
          Feature layers apply to vector basemaps (Topographic, Dark, Light). Switch base map to toggle OSM layers.
        </div>
      )}

      {/* Search */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-md px-2.5 py-1.5">
          <Search size={11} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search layers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-[11px] text-gray-300 placeholder-gray-600 outline-none w-full"
          />
        </div>
      </div>

      {/* Layer List */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2">
        {CATEGORY_ORDER.map(cat => {
          const layers = byCategory[cat];
          if (!layers?.length) return null;
          const meta = CATEGORY_META[cat];
          const isCollapsed = collapsed.has(cat);
          const visCount = layers.filter(l => l.visible).length;

          return (
            <div key={cat} className="mb-2">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-surface-3 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? <ChevronRight size={11} className="text-gray-500" /> : <ChevronDown size={11} className="text-gray-500" />}
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{meta.label}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-mono">{visCount}/{layers.length}</span>
              </button>

              {/* Layers */}
              {!isCollapsed && (
                <div className="ml-2 mt-0.5 space-y-0.5">
                  {layers.map(layer => (
                    <LayerRow
                      key={layer.id}
                      layer={layer}
                      onToggle={() => dispatch({ type: 'TOGGLE_LAYER', id: layer.id })}
                      onOpacity={(op) => dispatch({ type: 'SET_LAYER_OPACITY', id: layer.id, opacity: op })}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* All hidden notice */}
        {state.layers.filter(l => l.visible).length === 0 && (
          <div className="text-center py-8 text-gray-600 text-[11px]">
            <Layers size={20} className="mx-auto mb-2 opacity-30" />
            <p>All layers hidden</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 p-3 border-t border-border bg-surface-2">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Legend</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {state.layers.filter(l => l.visible).map(l => (
            <div key={l.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: l.color }} />
              <span className="text-[10px] text-gray-500 truncate">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LayerRow({
  layer, onToggle, onOpacity,
}: { layer: GISLayer; onToggle: () => void; onOpacity: (v: number) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-md transition-colors ${layer.visible ? 'bg-surface-2/50' : ''}`}>
      <div className="layer-item flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer group">
        {/* Color swatch */}
        <div
          className="w-3 h-3 rounded-sm flex-shrink-0 transition-opacity"
          style={{ background: layer.color, opacity: layer.visible ? 1 : 0.3 }}
        />

        {/* Icon + Label */}
        <span className="text-sm leading-none">{LAYER_ICONS[layer.id] ?? '📍'}</span>
        <button
          onClick={onToggle}
          className={`flex-1 text-left text-[11px] transition-colors ${layer.visible ? 'text-gray-200' : 'text-gray-600'}`}
        >
          {layer.label}
        </button>

        {/* Expand */}
        <button
          onClick={() => setExpanded(p => !p)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-gray-400"
        >
          {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        </button>

        {/* Eye toggle */}
        <button
          onClick={onToggle}
          className={`transition-colors ${layer.visible ? 'text-gray-400 hover:text-gray-200' : 'text-gray-700 hover:text-gray-500'}`}
        >
          {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
        </button>
      </div>

      {/* Expanded opacity */}
      {expanded && (
        <div className="px-3 pb-2 pt-0.5 fade-in">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 w-14">Opacity</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={layer.defaultOpacity}
              onChange={e => onOpacity(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
              {Math.round(layer.defaultOpacity * 100)}%
            </span>
          </div>
          <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">{layer.description}</p>
        </div>
      )}
    </div>
  );
}
