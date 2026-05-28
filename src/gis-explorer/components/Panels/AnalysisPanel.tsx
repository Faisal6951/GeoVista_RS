'use client';
// components/Panels/AnalysisPanel.tsx

import React from 'react';
import { Ruler, Square, Pentagon, Info, TrendingUp, Trash2, CheckCircle } from 'lucide-react';
import { useAppState, useDispatch } from '@/gis-explorer/lib/store';
import { formatDistance, formatArea } from '@/gis-explorer/lib/utils';
import { ANALYSIS_TOOLS } from '@/gis-explorer/lib/layers';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'measure-distance': <Ruler size={15} />,
  'measure-area':     <Square size={15} />,
  'draw-polygon':     <Pentagon size={15} />,
  'identify':         <Info size={15} />,
  'profile':          <TrendingUp size={15} />,
};

export default function AnalysisPanel() {
  const state = useAppState();
  const dispatch = useDispatch();

  const hasPoints =
    state.measurePoints.length > 0 ||
    state.drawPoints.length > 0 ||
    state.profileResult !== null;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto overscroll-contain">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Spatial Analysis Tools
        </h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Select a tool and interact with the map</p>
      </div>

      {/* Tools Grid */}
      <div className="p-3 border-b border-border">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Tools</p>
        <div className="space-y-1">
          {ANALYSIS_TOOLS.map(tool => {
            const isActive = state.activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => dispatch({ type: 'SET_TOOL', tool: isActive ? null : tool.id })}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all border
                  ${isActive
                    ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan'
                    : 'bg-surface-2 border-border text-gray-400 hover:text-gray-200 hover:border-border-light'
                  }
                `}
              >
                <span className={isActive ? 'text-accent-cyan' : 'text-gray-500'}>
                  {TOOL_ICONS[tool.id]}
                </span>
                <div className="flex-1">
                  <div className="text-[12px] font-medium">{tool.label}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{tool.description}</div>
                </div>
                <div className={`
                  text-[10px] font-mono px-1.5 py-0.5 rounded border
                  ${isActive ? 'border-accent-cyan/30 text-accent-cyan/60' : 'border-border text-gray-600'}
                `}>
                  {tool.shortcut}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {hasPoints && (
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Results</p>
            <button
              onClick={() => dispatch({ type: 'CLEAR_MEASURE' })}
              className="text-gray-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </div>

          <div className="gradient-border bg-surface-2 p-3 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={12} className="text-accent-green" />
              <span className="text-[11px] text-gray-400">
                {state.measurePoints.length + state.drawPoints.length} point
                {state.measurePoints.length + state.drawPoints.length !== 1 ? 's' : ''} plotted
              </span>
            </div>

            {state.measureResult?.distance !== undefined && (
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">Total Distance</p>
                <p className="text-lg font-mono text-accent-cyan mt-0.5">
                  {formatDistance(state.measureResult.distance)}
                </p>
              </div>
            )}

            {state.measureResult?.area !== undefined && (
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">Total Area</p>
                <p className="text-lg font-mono text-accent-green mt-0.5">
                  {formatArea(state.measureResult.area)}
                </p>
              </div>
            )}

            {state.profileLoading && (
              <p className="text-[11px] text-amber-400">Loading elevation profile…</p>
            )}

            {state.profileResult && (
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">Elevation Profile</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Min {state.profileResult.min.toFixed(0)} m · Max {state.profileResult.max.toFixed(0)} m ·
                  Relief {(state.profileResult.max - state.profileResult.min).toFixed(0)} m
                </p>
                <div className="mt-2 h-16 flex items-end gap-px bg-surface-3 rounded p-1">
                  {state.profileResult.points.map((p, i) => {
                    const range = state.profileResult!.max - state.profileResult!.min || 1;
                    const h = ((p.elevationM - state.profileResult!.min) / range) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-amber-400/80 rounded-t-sm min-h-[2px]"
                        style={{ height: `${Math.max(4, h)}%` }}
                        title={`${p.distanceKm.toFixed(2)} km: ${p.elevationM.toFixed(0)} m`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Point list */}
          {(state.measurePoints.length > 0 || state.drawPoints.length > 0) && (
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {(state.activeTool === 'draw-polygon' ? state.drawPoints : state.measurePoints).map(([lng, lat], i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                  <span className="text-accent-cyan/50">{String(i + 1).padStart(2, '0')}</span>
                  <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {state.activeTool && (
        <div className="p-3 flex-1">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-md p-3">
            <p className="text-[11px] text-amber-400 font-medium mb-1">Active Tool</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {state.activeTool === 'measure-distance' && 'Click on the map to add measurement points. The total distance will be calculated automatically.'}
              {state.activeTool === 'measure-area' && 'Click to add polygon vertices. Close the polygon (click first point or press Enter) to calculate area.'}
              {state.activeTool === 'draw-polygon' && 'Define your Area of Interest by clicking to add vertices. Press Enter or click the first point to close.'}
              {state.activeTool === 'identify' && 'Click any location on the map to identify features and get coordinates.'}
              {state.activeTool === 'profile' && 'Click two points to extract an elevation profile along the line.'}
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_TOOL', tool: null })}
              className="mt-2 text-[10px] text-gray-500 hover:text-red-400 transition-colors"
            >
              Cancel tool (Esc)
            </button>
          </div>
        </div>
      )}

      {!state.activeTool && !hasPoints && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Ruler size={28} className="mx-auto mb-3 text-gray-700" />
            <p className="text-[12px] text-gray-600 leading-relaxed">
              Select a tool above to begin<br />spatial analysis on the map
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
