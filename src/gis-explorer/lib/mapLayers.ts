// lib/mapLayers.ts — Apply GIS layer visibility to MapLibre styles

import type { Map } from 'maplibre-gl';
import type { GISLayer } from './layers';

/** True when the loaded style includes OpenMapTiles vector layers */
export function isVectorBasemap(map: Map): boolean {
  const ids = (map.getStyle()?.layers ?? []).map(l => l.id);
  return ids.some(id => id.startsWith('road_') || id === 'water' || id.startsWith('landuse_'));
}

/** Resolve style layer IDs that belong to a GIS layer definition */
export function resolveStyleLayerIds(styleLayerIds: string[], gisLayer: GISLayer): string[] {
  const found = new Set<string>();

  for (const osmId of gisLayer.osmLayerIds) {
    if (styleLayerIds.includes(osmId)) found.add(osmId);
  }

  for (const id of styleLayerIds) {
    const norm = id.replace(/-/g, '_');
    for (const osmId of gisLayer.osmLayerIds) {
      const normOsm = osmId.replace(/-/g, '_');
      if (
        id === osmId ||
        norm === normOsm ||
        id.startsWith(`${normOsm}_`) ||
        norm.startsWith(`${normOsm}_`) ||
        norm.includes(normOsm) ||
        normOsm.includes(norm.split('_').slice(0, 2).join('_'))
      ) {
        found.add(id);
      }
    }
  }

  return Array.from(found);
}

export function applyGisLayers(map: Map, layers: GISLayer[]): void {
  if (!map.isStyleLoaded() || !isVectorBasemap(map)) return;

  const styleLayerIds = (map.getStyle()?.layers ?? []).map(l => l.id);
  const styleLayers = map.getStyle()?.layers ?? [];

  for (const gisLayer of layers) {
    const targetIds = resolveStyleLayerIds(styleLayerIds, gisLayer);

    for (const layerId of targetIds) {
      try {
        map.setLayoutProperty(layerId, 'visibility', gisLayer.visible ? 'visible' : 'none');

        const lyrDef = styleLayers.find(l => l.id === layerId) as { type?: string } | undefined;
        const tp = lyrDef?.type;
        const opacity = gisLayer.visible ? gisLayer.defaultOpacity : 0;

        if (tp === 'fill') map.setPaintProperty(layerId, 'fill-opacity', opacity);
        else if (tp === 'line') map.setPaintProperty(layerId, 'line-opacity', opacity);
        else if (tp === 'circle') map.setPaintProperty(layerId, 'circle-opacity', opacity);
        else if (tp === 'symbol') map.setPaintProperty(layerId, 'text-opacity', opacity);
      } catch {
        // Layer may not support the paint property
      }
    }
  }
}
