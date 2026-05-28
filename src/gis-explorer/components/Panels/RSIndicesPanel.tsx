'use client';
// components/Panels/RSIndicesPanel.tsx

import React from 'react';
import { Satellite, Info, ChevronRight } from 'lucide-react';
import { useAppState, useDispatch } from '@/gis-explorer/lib/store';
import { RS_INDICES } from '@/gis-explorer/lib/layers';

export default function RSIndicesPanel() {
  const state = useAppState();
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Spectral Indices
        </h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Remote sensing band indices for analysis</p>
      </div>

      {/* Info Banner */}
      <div className="flex-shrink-0 mx-3 mt-3 bg-purple-500/5 border border-purple-500/20 rounded-md p-3">
        <div className="flex gap-2">
          <Info size={12} className="text-purple-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Select an index and click <strong className="text-purple-300">Apply to Map</strong> to overlay live NASA GIBS imagery. Satellite basemap is recommended for best contrast.
          </p>
        </div>
      </div>

      {/* Index Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-2 mt-1">
        {RS_INDICES.map(index => {
          const isActive = state.activeRSIndex === index.id;
          return (
            <div
              key={index.id}
              className={`
                rounded-md border transition-all cursor-pointer
                ${isActive
                  ? 'bg-purple-500/10 border-purple-500/40'
                  : 'bg-surface-2 border-border hover:border-border-light'
                }
              `}
              onClick={() => {
                const next = isActive ? null : index.id;
                dispatch({ type: 'SET_RS_INDEX', id: next });
                if (next && state.activeBaseMap !== 'satellite') {
                  dispatch({ type: 'SET_BASE_MAP', id: 'satellite' });
                }
              }}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 p-3">
                {/* Color ramp preview */}
                <div className="flex rounded overflow-hidden w-10 h-10 flex-shrink-0">
                  {index.colorRamp.map((color, i) => (
                    <div key={i} className="flex-1 h-full" style={{ background: color }} />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-bold font-mono ${isActive ? 'text-purple-400' : 'text-gray-200'}`}>
                      {index.label}
                    </span>
                    <span className={`
                      text-[10px] px-1.5 py-0.5 rounded border font-mono
                      ${isActive ? 'border-purple-400/30 text-purple-400/70' : 'border-border text-gray-600'}
                    `}>
                      {index.range}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{index.fullName}</p>
                </div>

                <ChevronRight
                  size={13}
                  className={`text-gray-600 transition-transform flex-shrink-0 ${isActive ? 'rotate-90' : ''}`}
                />
              </div>

              {/* Expanded */}
              {isActive && (
                <div className="px-3 pb-3 space-y-3 border-t border-purple-500/20 pt-2.5">
                  <p className="text-[11px] text-gray-400 leading-relaxed">{index.description}</p>

                  <div className="bg-surface-3 rounded p-2">
                    <p className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">Formula</p>
                    <p className="text-[11px] text-accent-cyan font-mono">{index.formula}</p>
                  </div>

                  {/* Color scale */}
                  <div>
                    <p className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">Color Scale</p>
                    <div className="flex rounded overflow-hidden h-4 w-full">
                      {index.colorRamp.map((color, i) => (
                        <div key={i} className="flex-1" style={{ background: color }} />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-600">
                      <span>{index.range.split(' to ')[0]}</span>
                      <span>0</span>
                      <span>{index.range.split(' to ')[1]}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        dispatch({ type: 'SET_RS_INDEX', id: index.id });
                        if (state.activeBaseMap !== 'satellite') {
                          dispatch({ type: 'SET_BASE_MAP', id: 'satellite' });
                        }
                      }}
                      className="flex-1 text-[11px] bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 rounded px-2.5 py-1.5 transition-colors"
                    >
                      Apply to Map
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        dispatch({ type: 'SET_RS_INDEX', id: null });
                      }}
                      className="flex-1 text-[11px] bg-surface-3 hover:bg-surface-4 text-gray-400 border border-border rounded px-2.5 py-1.5 transition-colors"
                    >
                      Remove Overlay
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Satellite bands info */}
      <div className="flex-shrink-0 p-3 border-t border-border bg-surface-2">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Satellite Bands Reference</p>
        <div className="grid grid-cols-3 gap-1">
          {[
            { b: 'B2', label: 'Blue',   color: '#3b82f6' },
            { b: 'B3', label: 'Green',  color: '#22c55e' },
            { b: 'B4', label: 'Red',    color: '#ef4444' },
            { b: 'B8', label: 'NIR',    color: '#a78bfa' },
            { b: 'B11', label: 'SWIR1', color: '#f59e0b' },
            { b: 'B12', label: 'SWIR2', color: '#f97316' },
          ].map(bd => (
            <div key={bd.b} className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: bd.color }} />
              <span className="text-gray-600 font-mono">{bd.b}</span>
              <span className="text-gray-500">{bd.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 mt-2">Sentinel-2 MSI band designations</p>
      </div>
    </div>
  );
}
