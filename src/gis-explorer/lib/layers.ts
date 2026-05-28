// lib/layers.ts — GIS Layer definitions and configurations

export type LayerCategory = 'hydrology' | 'infrastructure' | 'landuse' | 'geology' | 'rs-indices';

export interface GISLayer {
  id: string;
  label: string;
  description: string;
  category: LayerCategory;
  color: string;
  icon: string;
  osmLayerIds: string[];       // MapLibre layer IDs to show/hide
  defaultOpacity: number;
  visible: boolean;
  paintOverride?: Record<string, unknown>;
}

export interface BaseMap {
  id: string;
  label: string;
  description: string;
  styleUrl: string;
  thumbnail: string;
}

export interface RSIndex {
  id: string;
  label: string;
  fullName: string;
  description: string;
  formula: string;
  range: string;
  colorRamp: string[];
  wmsUrl?: string;
}

// ─── Base Maps ────────────────────────────────────────────────────────────────
export const BASE_MAPS: BaseMap[] = [
  {
    id: 'liberty',
    label: 'Topographic',
    description: 'Detailed topographic style with labels',
    styleUrl: 'https://tiles.openfreemap.org/styles/liberty',
    thumbnail: '🗺️',
  },
  {
    id: 'dark',
    label: 'Dark Canvas',
    description: 'Dark basemap for thematic overlays',
    styleUrl: 'https://tiles.openfreemap.org/styles/dark',
    thumbnail: '🌑',
  },
  {
    id: 'positron',
    label: 'Light Canvas',
    description: 'Minimal light style for analysis',
    styleUrl: 'https://tiles.openfreemap.org/styles/positron',
    thumbnail: '🌕',
  },
  {
    id: 'satellite',
    label: 'Satellite',
    description: 'ESRI World Imagery satellite tiles',
    styleUrl: JSON.stringify({
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: '© Esri, Maxar, Earthstar Geographics',
          maxzoom: 19,
        },
      },
      layers: [{ id: 'satellite-layer', type: 'raster', source: 'satellite' }],
    }),
    thumbnail: '🛰️',
  },
];

// ─── GIS Feature Layers ──────────────────────────────────────────────────────
export const GIS_LAYERS: GISLayer[] = [
  // Hydrology
  {
    id: 'water-bodies',
    label: 'Water Bodies',
    description: 'Lakes, reservoirs, and standing water',
    category: 'hydrology',
    color: '#3b82f6',
    icon: 'droplet',
    osmLayerIds: ['water', 'landcover_wetland'],
    defaultOpacity: 0.8,
    visible: true,
  },
  {
    id: 'rivers',
    label: 'Rivers & Canals',
    description: 'Major and minor waterways',
    category: 'hydrology',
    color: '#06b6d4',
    icon: 'waves',
    osmLayerIds: ['waterway_river', 'waterway_other', 'waterway_tunnel', 'waterway_line_label'],
    defaultOpacity: 1,
    visible: true,
  },
  // Infrastructure
  {
    id: 'roads-major',
    label: 'Major Roads',
    description: 'Motorways, highways and primary roads',
    category: 'infrastructure',
    color: '#f97316',
    icon: 'car',
    osmLayerIds: [
      'road_motorway', 'road_motorway_link', 'road_motorway_casing', 'road_motorway_link_casing',
      'road_trunk_primary', 'road_trunk_primary_casing',
      'bridge_motorway', 'bridge_motorway_link', 'bridge_trunk_primary',
      'bridge_motorway_casing', 'bridge_motorway_link_casing', 'bridge_trunk_primary_casing',
      'tunnel_motorway', 'tunnel_motorway_link', 'tunnel_trunk_primary',
    ],
    defaultOpacity: 1,
    visible: true,
  },
  {
    id: 'roads-minor',
    label: 'Minor Roads',
    description: 'Secondary, residential and local roads',
    category: 'infrastructure',
    color: '#fb923c',
    icon: 'route',
    osmLayerIds: [
      'road_secondary_tertiary', 'road_secondary_tertiary_casing',
      'road_minor', 'road_minor_casing', 'road_service_track', 'road_service_track_casing',
      'road_link', 'road_link_casing', 'road_path_pedestrian',
      'bridge_secondary_tertiary', 'bridge_street', 'bridge_link', 'bridge_service_track',
    ],
    defaultOpacity: 0.8,
    visible: true,
  },
  {
    id: 'buildings',
    label: 'Buildings',
    description: '3D building footprints',
    category: 'infrastructure',
    color: '#8b5cf6',
    icon: 'building',
    osmLayerIds: ['building', 'building-3d'],
    defaultOpacity: 0.85,
    visible: true,
  },
  // Landuse
  {
    id: 'greenery',
    label: 'Vegetation / Parks',
    description: 'Parks, forests and green spaces',
    category: 'landuse',
    color: '#22c55e',
    icon: 'tree-pine',
    osmLayerIds: ['park', 'park_outline', 'landcover_wood', 'landcover_grass', 'landuse_pitch'],
    defaultOpacity: 0.75,
    visible: true,
  },
  {
    id: 'industrial',
    label: 'Industrial Areas',
    description: 'Factories, warehouses, commercial zones',
    category: 'landuse',
    color: '#ef4444',
    icon: 'factory',
    osmLayerIds: ['landuse_hospital', 'landuse_school', 'aeroway_fill', 'aeroway_runway', 'aeroway_taxiway'],
    defaultOpacity: 0.7,
    visible: true,
  },
  {
    id: 'residential',
    label: 'Residential Areas',
    description: 'Housing and residential zones',
    category: 'landuse',
    color: '#f59e0b',
    icon: 'home',
    osmLayerIds: ['landuse_residential'],
    defaultOpacity: 0.6,
    visible: false,
  },
  {
    id: 'agricultural',
    label: 'Agricultural Land',
    description: 'Farmland, orchards and cropland',
    category: 'landuse',
    color: '#84cc16',
    icon: 'wheat',
    osmLayerIds: ['landuse_cemetery', 'landuse_track', 'landcover_grass'],
    defaultOpacity: 0.65,
    visible: false,
  },
  // Geology
  {
    id: 'rocks',
    label: 'Bare Rock / Quarry',
    description: 'Rocky outcrops, quarries and bare land',
    category: 'geology',
    color: '#a8a29e',
    icon: 'mountain',
    osmLayerIds: ['landcover_sand', 'landcover_ice'],
    defaultOpacity: 0.7,
    visible: false,
  },
];

// ─── RS Spectral Indices ─────────────────────────────────────────────────────
export const RS_INDICES: RSIndex[] = [
  {
    id: 'ndvi',
    label: 'NDVI',
    fullName: 'Normalized Difference Vegetation Index',
    description: 'Quantifies vegetation health by measuring the difference between near-infrared and red light.',
    formula: 'NDVI = (NIR − Red) / (NIR + Red)',
    range: '-1.0 to +1.0',
    colorRamp: ['#8B0000', '#FF4500', '#FFD700', '#ADFF2F', '#006400'],
  },
  {
    id: 'ndwi',
    label: 'NDWI',
    fullName: 'Normalized Difference Water Index',
    description: 'Highlights water bodies and monitors surface water extent and changes.',
    formula: 'NDWI = (Green − NIR) / (Green + NIR)',
    range: '-1.0 to +1.0',
    colorRamp: ['#8B4513', '#DEB887', '#87CEEB', '#1E90FF', '#00008B'],
  },
  {
    id: 'ndbi',
    label: 'NDBI',
    fullName: 'Normalized Difference Built-up Index',
    description: 'Identifies built-up and urbanized areas using SWIR and NIR bands.',
    formula: 'NDBI = (SWIR − NIR) / (SWIR + NIR)',
    range: '-1.0 to +1.0',
    colorRamp: ['#006400', '#90EE90', '#FFDAB9', '#FF8C00', '#8B0000'],
  },
  {
    id: 'evi',
    label: 'EVI',
    fullName: 'Enhanced Vegetation Index',
    description: 'Improved vegetation index that reduces atmospheric and soil noise.',
    formula: 'EVI = 2.5 × (NIR − Red) / (NIR + 6×Red − 7.5×Blue + 1)',
    range: '-1.0 to +1.0',
    colorRamp: ['#FF4500', '#FFA500', '#FFFF00', '#7CFC00', '#006400'],
  },
  {
    id: 'savi',
    label: 'SAVI',
    fullName: 'Soil Adjusted Vegetation Index',
    description: 'Minimizes the effect of soil brightness on vegetation analysis.',
    formula: 'SAVI = 1.5 × (NIR − Red) / (NIR + Red + 0.5)',
    range: '-1.5 to +1.5',
    colorRamp: ['#8B4513', '#DEB887', '#FFFF00', '#7CFC00', '#006400'],
  },
];

// ─── Layer category metadata ──────────────────────────────────────────────────
export const CATEGORY_META: Record<LayerCategory, { label: string; color: string }> = {
  hydrology:      { label: 'Hydrology',       color: '#3b82f6' },
  infrastructure: { label: 'Infrastructure',  color: '#f97316' },
  landuse:        { label: 'Land Use',         color: '#22c55e' },
  geology:        { label: 'Geology',          color: '#a8a29e' },
  'rs-indices':   { label: 'RS Indices',       color: '#a78bfa' },
};

// ─── Analysis Tools ──────────────────────────────────────────────────────────
export interface AnalysisTool {
  id: string;
  label: string;
  icon: string;
  description: string;
  shortcut: string;
}

export const ANALYSIS_TOOLS: AnalysisTool[] = [
  { id: 'measure-distance', label: 'Measure Distance',  icon: 'ruler',         description: 'Click points to measure distance', shortcut: 'D' },
  { id: 'measure-area',     label: 'Measure Area',      icon: 'vector-square', description: 'Draw polygon to measure area',     shortcut: 'A' },
  { id: 'draw-polygon',     label: 'Draw AOI',          icon: 'pentagon',      description: 'Define area of interest',          shortcut: 'P' },
  { id: 'identify',         label: 'Identify Features', icon: 'info',          description: 'Click to identify features',       shortcut: 'I' },
  { id: 'profile',          label: 'Elevation Profile', icon: 'chart-line',    description: 'Draw line for elevation profile',  shortcut: 'E' },
];
