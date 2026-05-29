<div align="center">

<!-- BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1d4ed8,100:06b6d4&height=220&section=header&text=GeoVista&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Earth%20Observation%2C%20Engineered%20for%20the%20Web&descAlignY=60&descSize=20&animation=fadeIn" width="100%"/>

<!-- BADGES -->
<p>
  <a href="https://geo-vista-rs.vercel.app/">
    <img src="https://img.shields.io/badge/🌍%20Live%20Demo-geo--vista--rs.vercel.app-0ea5e9?style=for-the-badge&logoColor=white" alt="Live Demo"/>
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/BS%20RS%26GIS-Final%20Year%20Project-10b981?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Session-2025--2026-f59e0b?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge"/>
</p>

<br/>

> **GeoVista** is a production-grade, server-rendered Next.js portal that unifies two live geospatial applications —  
> **TerraScope** (spatial GIS analysis) and **PulseEarth** (real-time environmental monitoring) —  
> into a single, deployment-ready platform built as a final year capstone for the **BS Remote Sensing & GIS** program.

<br/>

[![TerraScope](https://img.shields.io/badge/🗺️%20Launch-TerraScope-1d4ed8?style=for-the-badge)](https://geo-vista-rs.vercel.app/explorer)
[![PulseEarth](https://img.shields.io/badge/🛰️%20Launch-PulseEarth-059669?style=for-the-badge)](https://geo-vista-rs.vercel.app/monitor)
[![Documentation](https://img.shields.io/badge/📖%20Read-Documentation-7c3aed?style=for-the-badge)](https://geo-vista-rs.vercel.app/about)

</div>

---

## 🌐 Table of Contents

- [🔭 Project Overview](#-project-overview)
- [⚡ Integrated Applications](#-integrated-applications)
  - [🗺️ TerraScope — Spatial Analysis Workspace](#%EF%B8%8F-terrascope--spatial-analysis-workspace)
  - [🛰️ PulseEarth — Environmental Monitor](#%EF%B8%8F-pulsearth--environmental-monitor)
- [🏗️ Architecture & Tech Stack](#%EF%B8%8F-architecture--tech-stack)
- [📁 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [☁️ Deployment](#%EF%B8%8F-deployment)
- [📸 Live Routes](#-live-routes)
- [👨‍💻 About the Developer](#-about-the-developer)
- [🎓 Academic Info](#-academic-info)
- [📄 License](#-license)

---

## 🔭 Project Overview

**The Problem:** Powerful RS/GIS work often lives trapped in disconnected repositories and desktop software — impossible to demo meaningfully in a 15-minute viva presentation without installing ArcGIS on every machine in the room.

**The Solution:** GeoVista is a unified web portal — one URL, two live applications, fully documented methodology — that lets supervisors and evaluators open a browser and interact with _real running tools_, not static screenshots or PDFs.

**The Standard:** This project targets deployable engineering quality — Next.js 15 SSR, fully typed TypeScript APIs, and reproducible open-data pipelines from NASA, OpenAQ, and OpenFreeMap.

```
GeoVista = TerraScope (GIS Explorer) + PulseEarth (GeoSense) + Unified Portal Layer
```

---

## ⚡ Integrated Applications

### 🗺️ TerraScope — Spatial Analysis Workspace

> _"Desktop GIS is powerful but awkward in a viva room."_

TerraScope brings full GIS analytical capability into the browser. Built on the **GIS Explorer** codebase, it provides everything needed for live spatial demonstrations without requiring any desktop GIS software.

| Feature              | Technology                                              | Purpose                                   |
| -------------------- | ------------------------------------------------------- | ----------------------------------------- |
| **Map Engine**       | MapLibre GL + 4 basemaps (OpenFreeMap + ESRI Satellite) | WebGL pan/zoom without ArcGIS             |
| **Vector Layers**    | Hydrology · Roads · 3D Buildings · Land Use             | Thematic context for Areas of Interest    |
| **Spectral Indices** | NDVI · NDWI · NDBI · EVI · SAVI                         | Theory-to-map interpretation in one panel |
| **Analysis Toolbar** | Distance · Area · AOI · Identify · Profile              | Reproducible field measurements           |
| **Export**           | Layer export support                                    | Shareable outputs                         |

🔗 **Live:** [geo-vista-rs.vercel.app/explorer](https://geo-vista-rs.vercel.app/explorer)  
📦 **Source:** [github.com/Faisal6951/GIS_Explorer](https://github.com/Faisal6951/GIS_Explorer)

---

### 🛰️ PulseEarth — Environmental Monitor

> _"Punjab's crop-residue fires and air-quality stress are invisible in a static map."_

PulseEarth is a live Leaflet dashboard that pulls operational satellite and ground-station feeds into a single monitor — enabling real-time correlation of fires, air quality, vegetation health, and weather events during field-season case studies over Pakistan.

| Data Layer           | Source                          | Purpose                                   |
| -------------------- | ------------------------------- | ----------------------------------------- |
| **GIBS Imagery**     | NASA MODIS tiles                | Authoritative regional satellite backdrop |
| **FIRMS VIIRS**      | NASA Near-Real-Time fire pixels | Active burn detection over Punjab         |
| **Air Quality**      | OpenAQ ground stations          | In-situ PM/pollutant validation           |
| **NDVI**             | GIBS vegetation index           | Crop health and vegetation stress mapping |
| **Click-to-Weather** | Open-Meteo API                  | Link weather events to field observations |

🔗 **Live:** [geo-vista-rs.vercel.app/monitor](https://geo-vista-rs.vercel.app/monitor)  
📦 **Source:** [github.com/Faisal6951/geosense_RS_GIS_project](https://github.com/Faisal6951/geosense_RS_GIS_project)

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     GeoVista Portal                         │
│              Next.js 15 · TypeScript · SSR                  │
│                                                             │
│  ┌──────────────────┐     ┌──────────────────────────────┐  │
│  │   /explorer      │     │         /monitor             │  │
│  │   TerraScope     │     │         PulseEarth           │  │
│  │                  │     │                              │  │
│  │  MapLibre GL     │     │  Leaflet · react-leaflet     │  │
│  │  Turf.js         │     │  NASA FIRMS (VIIRS)          │  │
│  │  OSM Layers      │     │  OpenAQ · Open-Meteo         │  │
│  │  Spectral Index  │     │  GIBS NDVI · MODIS           │  │
│  └──────────────────┘     └──────────────────────────────┘  │
│                                                             │
│         Shared: Zustand · Framer Motion · Recharts          │
│         Fonts: Plus Jakarta Sans + IBM Plex Mono            │
│         Theme: Zinc dark/light · Tailwind CSS               │
└─────────────────────────────────────────────────────────────┘
                            │
                     Vercel (Edge)
```

### Core Dependencies

| Category              | Package                    | Version         |
| --------------------- | -------------------------- | --------------- |
| **Framework**         | Next.js                    | ^15.1.0         |
| **Language**          | TypeScript                 | ^5.7.0          |
| **UI**                | React + React DOM          | ^19.0.0         |
| **Mapping (GIS)**     | MapLibre GL + react-map-gl | ^4.5.2          |
| **Mapping (Monitor)** | Leaflet + react-leaflet    | ^1.9.4 / ^5.0.0 |
| **Spatial Analysis**  | @turf/turf                 | ^6.5.0          |
| **State**             | Zustand                    | ^4.5.4          |
| **Animation**         | Framer Motion              | ^11.15.0        |
| **Charts**            | Recharts                   | ^2.12.7         |
| **Styling**           | Tailwind CSS               | ^3.4.1          |
| **Analytics**         | @vercel/analytics          | ^2.0.1          |

---

## 📁 Repository Structure

```
GeoVista_RS/
├── public/                  # Static assets (images, icons)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Homepage (portal landing)
│   │   ├── about/           # Project & team info
│   │   ├── platform/        # Platform overview
│   │   ├── methodology/     # RS/GIS methodology docs
│   │   ├── study-area/      # Study area documentation
│   │   ├── results/         # Project results
│   │   ├── terrascope/      # TerraScope info page
│   │   ├── pulsearch/       # PulseEarth info page
│   │   ├── explorer/        # 🗺️ TerraScope live app
│   │   └── monitor/         # 🛰️ PulseEarth live app
│   ├── components/          # Shared UI components
│   └── styles/              # Global CSS
├── .env.example             # Environment variable template
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind theme
├── tsconfig.json            # TypeScript config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- API keys for FIRMS and OpenAQ (see [Environment Variables](#-environment-variables))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Faisal6951/GeoVista_RS.git
cd GeoVista_RS

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# → Fill in your API keys (see section below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Tip for demos:** Open `/explorer` and `/monitor` in separate browser tabs — maps load on demand so the documentation pages stay fast.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root (reference `.env.example`):

```env
# NASA FIRMS — for PulseEarth fire detection layer
FIRMS_API_KEY=your_firms_api_key_here

# OpenAQ — for PulseEarth air quality stations
OPENAQ_API_KEY=your_openaq_api_key_here
```

| Variable         | Source                                                                         | Required For           |
| ---------------- | ------------------------------------------------------------------------------ | ---------------------- |
| `FIRMS_API_KEY`  | [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/area/) | PulseEarth fire layer  |
| `OPENAQ_API_KEY` | [openaq.org](https://openaq.org)                                               | PulseEarth air quality |

> **Note:** TerraScope uses public OpenFreeMap and ESRI tiles — no API key required.

---

## ☁️ Deployment

### Vercel (Recommended)

```bash
# Build for production
npm run build

# Start production server
npm start
```

The project is optimized for **Vercel** deployment. Simply connect the repository and set environment variables in your Vercel project dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Faisal6951/GeoVista_RS)

**Performance notes:**

- Portal/documentation pages: ~107 kB first load (SSR)
- Map applications load **only** when navigating to `/explorer` or `/monitor`
- Fonts served via `next/font` — zero layout shift

---

## 📸 Live Routes

| Route          | Description                        |
| -------------- | ---------------------------------- |
| `/`            | Portal homepage                    |
| `/about`       | Project team & objectives          |
| `/platform`    | Integrated platform overview       |
| `/methodology` | RS/GIS methodology documentation   |
| `/study-area`  | Study area details                 |
| `/results`     | Project analysis results           |
| `/terrascope`  | TerraScope feature page            |
| `/pulsearch`   | PulseEarth feature page            |
| `/explorer`    | 🗺️ **TerraScope live application** |
| `/monitor`     | 🛰️ **PulseEarth live application** |

---

## 👨‍💻 About the Developer

<table>
  <tr>
    <td align="center">
      <strong>Faisal Adnan</strong><br/>
      <em>Lead Developer · Remote Sensing Analyst · Portal Architect</em><br/><br/>
      Designed and developed the GeoVista portal, integrated both map applications (TerraScope & PulseEarth), and led NDVI/fire case-study analysis for Punjab.<br/><br/>
      Focus areas: Web GIS · API pipelines · FYP documentation<br/><br/>
      📧 <a href="mailto:raifaisaladnan69@gmail.com">raifaisaladnan69@gmail.com</a><br/>
      🐙 <a href="https://github.com/Faisal6951">github.com/Faisal6951</a>
    </td>
  </tr>
</table>

**Supervisor:** Mr. Inam Ul Haq — Associate Professor, Faculty of Computer Science

---

## 🎓 Academic Info

| Field            | Detail                  |
| ---------------- | ----------------------- |
| **Student Name** | Faisal Adnan            |
| **Roll Number**  | F22-BSRS&GIS-5019       |
| **Program**      | BS Remote Sensing & GIS |
| **Session**      | 2022 – 2026             |
| **Supervisor**   | Mr. Inam Ul Haq         |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**Source Repositories**

[![GIS Explorer](<https://img.shields.io/badge/GitHub-GIS__Explorer%20(TerraScope)-181717?style=for-the-badge&logo=github>)](https://github.com/Faisal6951/GIS_Explorer)
[![GeoSense](<https://img.shields.io/badge/GitHub-GeoSense%20(PulseEarth)-181717?style=for-the-badge&logo=github>)](https://github.com/Faisal6951/geosense_RS_GIS_project)

<br/>

_Built with Next.js 15 · TypeScript · MapLibre GL · Leaflet · Deployed on Vercel_

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06b6d4,50:1d4ed8,100:0f172a&height=120&section=footer" width="100%"/>

</div>
