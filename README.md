# GeoVista — RS & GIS Final Year Platform

Professional Next.js hub for our FYP. Integrates:

| Brand name | Original repo | Live route |
|------------|---------------|------------|
| **TerraScope** | [GIS Explorer](https://github.com/Faisal6951/GIS_Explorer) | `/explorer` |
| **PulseEarth** | [GeoSense](https://github.com/Faisal6951/geosense_RS_GIS_project) | `/monitor` |

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
npm start
```

Set `FIRMS_API_KEY` and `OPENAQ_API_KEY` in `.env.local` (see `.env.example`).

## Design

- **Fonts:** Plus Jakarta Sans + IBM Plex Mono (`next/font`, no layout shift)
- **Theme:** Zinc-based dark/light with matched contrast
- **Performance:** Server-rendered portal pages (~107 kB first load); map apps load only on `/explorer` and `/monitor`
