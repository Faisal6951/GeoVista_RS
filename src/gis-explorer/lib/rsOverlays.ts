// lib/rsOverlays.ts — NASA GIBS raster overlays for spectral indices

export interface RSOverlayConfig {
  gibsLayer: string;
  tileMatrixSet: string;
  opacity: number;
  maxZoom: number;
  label: string;
}

/** GIBS WMTS tile URL template (EPSG:3857, "default" time = latest) */
export function gibsTileUrl(config: RSOverlayConfig): string {
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${config.gibsLayer}/default/default/${config.tileMatrixSet}/{z}/{y}/{x}.png`;
}

export const RS_OVERLAYS: Record<string, RSOverlayConfig> = {
  ndvi: {
    gibsLayer: 'MODIS_Terra_NDVI_8Day',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    opacity: 0.82,
    maxZoom: 9,
    label: 'MODIS Terra NDVI (8-day)',
  },
  ndwi: {
    gibsLayer: 'MODIS_Water_Mask',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    opacity: 0.75,
    maxZoom: 9,
    label: 'MODIS Water Mask',
  },
  ndbi: {
    gibsLayer: 'VIIRS_Night_Lights',
    tileMatrixSet: 'GoogleMapsCompatible_Level8',
    opacity: 0.85,
    maxZoom: 8,
    label: 'VIIRS Night Lights (built-up proxy)',
  },
  evi: {
    gibsLayer: 'MODIS_Terra_EVI_8Day',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    opacity: 0.82,
    maxZoom: 9,
    label: 'MODIS Terra EVI (8-day)',
  },
  savi: {
    gibsLayer: 'MODIS_Terra_NDVI_8Day',
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    opacity: 0.65,
    maxZoom: 9,
    label: 'MODIS Terra NDVI (SAVI-style view)',
  },
};

export const RS_SOURCE_ID = 'rs-overlay-source';
export const RS_LAYER_ID = 'rs-overlay-layer';
