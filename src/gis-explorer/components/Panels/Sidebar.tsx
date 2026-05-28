'use client';
// components/Panels/Sidebar.tsx

import React from 'react';
import { useAppState } from '@/gis-explorer/lib/store';
import LayersPanel from './LayersPanel';
import AnalysisPanel from './AnalysisPanel';
import RSIndicesPanel from './RSIndicesPanel';

export default function Sidebar() {
  const { activePanel } = useAppState();

  return (
    <aside className="w-72 h-full min-h-0 bg-surface-1 border-r border-border flex flex-col overflow-hidden panel-animate">
      <div className="flex-1 min-h-0 overflow-hidden">
        {activePanel === 'layers' && <LayersPanel />}
        {activePanel === 'analysis' && <AnalysisPanel />}
        {activePanel === 'indices' && <RSIndicesPanel />}
      </div>
    </aside>
  );
}
