// lib/mapExport.ts — Branded map snapshot export

import type { Map } from 'maplibre-gl';
import { zoomToScale } from './utils';

export interface SnapshotMeta {
  baseMapLabel: string;
  rsIndexLabel?: string;
}

function waitForMapRender(map: Map): Promise<void> {
  return new Promise(resolve => {
    const done = () => {
      map.off('idle', done);
      resolve();
    };
    if (map.loaded() && !map.isMoving()) {
      map.triggerRepaint();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      return;
    }
    map.once('idle', () => {
      map.triggerRepaint();
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  });
}

/**
 * Capture the current map view as a PNG with a professional metadata footer.
 */
export async function exportMapSnapshot(map: Map, meta: SnapshotMeta): Promise<string> {
  await waitForMapRender(map);

  const mapCanvas = map.getCanvas();
  const scale = window.devicePixelRatio || 1;
  const w = mapCanvas.width;
  const h = mapCanvas.height;
  const footerH = Math.max(72, Math.round(h * 0.1));

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h + footerH;
  const ctx = out.getContext('2d');
  if (!ctx) throw new Error('Could not create export canvas');

  ctx.drawImage(mapCanvas, 0, 0, w, h);

  const footerTop = h;
  const grad = ctx.createLinearGradient(0, footerTop - 40, 0, footerTop + footerH);
  grad.addColorStop(0, 'rgba(13, 17, 23, 0)');
  grad.addColorStop(0.35, 'rgba(13, 17, 23, 0.92)');
  grad.addColorStop(1, 'rgba(13, 17, 23, 1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, footerTop - 40, w, footerH + 40);

  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, footerTop + footerH - 2, w, 2);

  const center = map.getCenter();
  const zoom = map.getZoom();
  const scaleStr = zoomToScale(zoom);
  const timestamp = new Date().toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const pad = Math.round(24 * scale);
  const line1Y = footerTop + footerH * 0.38;
  const line2Y = footerTop + footerH * 0.62;
  const line3Y = footerTop + footerH * 0.86;

  ctx.font = `600 ${Math.round(22 * scale)}px Syne, "Segoe UI", sans-serif`;
  ctx.fillStyle = '#e6edf3';
  ctx.fillText('GIS RS Explorer', pad, line1Y);

  ctx.font = `${Math.round(14 * scale)}px "Space Mono", Consolas, monospace`;
  ctx.fillStyle = '#22d3ee';
  const latHem = center.lat >= 0 ? 'N' : 'S';
  const lngHem = center.lng >= 0 ? 'E' : 'W';
  ctx.fillText(
    `${Math.abs(center.lat).toFixed(5)}°${latHem}, ${Math.abs(center.lng).toFixed(5)}°${lngHem}`,
    pad,
    line2Y
  );

  ctx.fillStyle = '#8b949e';
  const detail = [
    `Zoom ${zoom.toFixed(1)}`,
    scaleStr,
    meta.baseMapLabel,
    meta.rsIndexLabel,
    timestamp,
  ]
    .filter(Boolean)
    .join('  ·  ');
  ctx.fillText(detail, pad, line3Y);

  ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, footerTop + 8);
  ctx.lineTo(pad + 48, footerTop + 8);
  ctx.stroke();

  return out.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
