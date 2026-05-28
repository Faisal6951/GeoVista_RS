/** Central copy — edit names & photos before submission */

export const SITE = {
  name: 'GeoVista',
  tagline: 'RS & GIS Final Year Platform',
  heroLine1: 'Earth observation,',
  heroLine2: 'engineered for the web.',
  description:
    'GeoVista unifies TerraScope (spatial GIS) and PulseEarth (environmental monitoring) into one deployable Next.js platform built for our Remote Sensing & GIS degree.',
  programme: 'BS Remote Sensing & GIS',
  university: 'Faisal Adnan',
  year: '2025–2026',
  copyrightYear: 2026,
} as const;

export const MODULES = {
  terrascope: {
    brand: 'TerraScope',
    codename: 'GIS Explorer',
    tagline: 'Spatial analysis workspace',
    desc: 'MapLibre GL map with OSM layers, spectral index references, measure/area/AOI tools, and export.',
    href: '/terrascope',
    launch: '/explorer',
    repo: 'https://github.com/Faisal6951/GIS_Explorer',
    color: '#2563eb',
    whyBuilt:
      'Desktop GIS is powerful but awkward in a viva room. We built TerraScope so supervisors can watch live layer toggling, index interpretation, and distance/area analysis in a browser — the same workflows we document in our report, without installing ArcGIS on every machine.',
  },
  pulsearch: {
    brand: 'PulseEarth',
    codename: 'GeoSense',
    tagline: 'Environmental monitor',
    desc: 'Leaflet dashboard for NASA FIRMS fires, OpenAQ air quality, GIBS NDVI, and click-to-weather over Pakistan.',
    href: '/pulsearch',
    launch: '/monitor',
    repo: 'https://github.com/Faisal6951/geosense_RS_GIS_project',
    color: '#059669',
    whyBuilt:
      'Punjab faces recurring crop-residue fires and air-quality stress that are invisible in a static map. PulseEarth pulls operational NASA and OpenAQ feeds into one monitor so we can correlate fires, PM stations, vegetation health, and weather in real time during field-season case studies.',
  },
} as const;

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Platform', path: '/platform' },
  { name: MODULES.terrascope.brand, path: MODULES.terrascope.href },
  { name: MODULES.pulsearch.brand, path: MODULES.pulsearch.href },
  { name: 'Methodology', path: '/methodology' },
  { name: 'Study Area', path: '/study-area' },
  { name: 'Results', path: '/results' },
] as const;

export const LAUNCH_LINKS = {
  terrascope: MODULES.terrascope.launch,
  pulsearch: MODULES.pulsearch.launch,
} as const;

export const REPOS = {
  terrascope: MODULES.terrascope.repo,
  pulsearch: MODULES.pulsearch.repo,
} as const;

export const BUILT_ITEMS = [
  {
    title: 'Unified portal',
    text: 'Server-rendered documentation, shared design system, and one URL for supervisors.',
  },
  {
    title: 'TerraScope at /explorer',
    text: 'Full GIS_Explorer codebase — MapLibre, Turf.js, indices panel, analysis toolbar.',
  },
  {
    title: 'PulseEarth at /monitor',
    text: 'Full GeoSense stack — FIRMS, OpenAQ, GIBS NDVI, weather API routes.',
  },
  {
    title: 'Production build',
    text: 'Verified `next build` for Vercel with env-based API keys.',
  },
] as const;

export const TEAM = {
  lead: {
    name: 'Faisal Adnan',
    id: 'FYP-2026-001',
    titles: ['Software Engineer', 'Remote Sensing Analyst', 'Portal Lead'],
    bio: 'Designed and developed GeoVista, integrated both map applications, and led NDVI/fire case-study analysis for Punjab. Focus: web GIS, API pipelines, and FYP documentation.',
    email: 'raifaisaladnan69@gmail.com',
    portfolio: 'github.com/Faisal6951',
    image: '/images/team/lead.jpg',
  },
  teammate: {
    name: 'Teammate Name',
    id: 'FYP-2026-002',
    titles: ['GIS Developer', 'Data Visualization'],
    bio: 'Built TerraScope layer controls and PulseEarth data layers. Maintained OpenAQ/FIRMS ingestion and map styling for presentation demos.',
    email: 'teammate@university.edu.pk',
    image: '/images/team/teammate.jpg',
  },
  supervisor: {
    name: 'Mr. Inam Ul Haq',
    id: 'Faculty — Computer Sc.',
    titles: ['Project Supervisor', 'Associate Professor'],
    bio: 'Guided study design, data-source selection, and evaluation criteria for the final-year submission.',
    email: 'inamulhaq@uo.edu.pk',
    image:
      'https://res.cloudinary.com/dyqxb7uex/image/upload/v1736707044/Profile/fhsk52o2oxije4ivld5r.jpg',
  },
} as const;

export const METHODOLOGY = {
  intro:
    'Our workflow moves from open data ingestion to browser visualization — no proprietary desktop lock-in. Each step maps to a feature in TerraScope or PulseEarth.',
  steps: [
    {
      step: '01',
      title: 'Define extent & CRS',
      body: 'Pakistan bounding box (62–77°E, 23–37°N), WGS84 for APIs, Web Mercator for tile display in TerraScope.',
      tool: 'Both apps',
    },
    {
      step: '02',
      title: 'Load base geography',
      body: 'OpenFreeMap vector tiles + optional ESRI satellite basemap. Toggle hydrology, roads, and land-use layers for context.',
      tool: 'TerraScope',
    },
    {
      step: '03',
      title: 'Interpret spectral indices',
      body: 'Reference NDVI, NDWI, NDBI, EVI, SAVI panels with formulas — link theory to map interpretation before classification.',
      tool: 'TerraScope',
    },
    {
      step: '04',
      title: 'Draw & measure AOIs',
      body: 'Distance (Haversine), polygon area, AOI boundaries, and elevation transects exported for the report.',
      tool: 'TerraScope',
    },
    {
      step: '05',
      title: 'Stream environmental feeds',
      body: 'FIRMS VIIRS fires, OpenAQ stations, GIBS NDVI raster — refreshed via Next.js API routes.',
      tool: 'PulseEarth',
    },
    {
      step: '06',
      title: 'Correlate & report',
      body: 'Click-map weather, compare fire peaks with AQ and NDVI trends; summarize on Results page.',
      tool: 'PulseEarth + portal',
    },
  ],
  indices: [
    {
      id: 'NDVI',
      name: 'Normalized Difference Vegetation Index',
      formula: '(NIR − Red) / (NIR + Red)',
      bands: 'Sentinel-2: B8, B4',
      does: 'Measures green biomass — high values mean healthy vegetation; low values expose bare soil or stress.',
      weUse:
        'PulseEarth GIBS layer + TerraScope reference panel for crop-season monitoring in Punjab.',
    },
    {
      id: 'NDWI',
      name: 'Normalized Difference Water Index',
      formula: '(Green − NIR) / (Green + NIR)',
      bands: 'Sentinel-2: B3, B8',
      does: 'Highlights open water and wet surfaces by contrasting green reflectance with NIR.',
      weUse:
        'TerraScope index guide when delineating canals, floods, or irrigated fields near AOIs.',
    },
    {
      id: 'NDBI',
      name: 'Normalized Difference Built-up Index',
      formula: '(SWIR − NIR) / (SWIR + NIR)',
      bands: 'Sentinel-2: B11, B8',
      does: 'Emphasizes urban and built-up areas where SWIR reflectance exceeds vegetation signal.',
      weUse:
        'Urban corridor analysis — Lahore/Faisalabad fringes vs agricultural periphery.',
    },
    {
      id: 'EVI',
      name: 'Enhanced Vegetation Index',
      formula: '2.5 × ((NIR − Red) / (NIR + 6×Red − 7.5×Blue + 1))',
      bands: 'Sentinel-2: B8, B4, B2',
      does: 'Improves on NDVI in dense canopy and atmospherically noisy scenes.',
      weUse: 'Reference when NDVI saturates during peak crop growth.',
    },
    {
      id: 'SAVI',
      name: 'Soil Adjusted Vegetation Index',
      formula: '((NIR − Red) / (NIR + Red + L)) × (1 + L), L = 0.5',
      bands: 'Sentinel-2: B8, B4',
      does: 'Reduces soil-background influence — useful in arid or sparsely vegetated zones.',
      weUse:
        'Discussed for southern Punjab margins with exposed soil during off-season.',
    },
  ],
} as const;

export const STUDY_AREA = {
  intro:
    'Pakistan is our national extent; Punjab is our analytical focus because of dense agriculture, post-harvest burning, and urban air-quality gradients.',
  zones: [
    {
      name: 'National extent',
      coords: '62°E – 77°E · 23°N – 37°N',
      detail:
        'Default map bounds for FIRMS API calls and both application viewports.',
    },
    {
      name: 'Punjab core',
      coords: 'Lahore · Faisalabad · Multan',
      detail:
        'Primary case-study corridor for fire hotspots, AQ stations, and NDVI seasonality.',
    },
    {
      name: 'Urban AQ belts',
      coords: 'Lahore–Sheikhupura · Faisalabad',
      detail:
        'OpenAQ ground stations validate PM narratives against satellite context.',
    },
    {
      name: 'Agricultural belt',
      coords: 'Indus plain croplands',
      detail:
        'Crop-residue burning visible in VIIRS thermal anomalies Oct–Nov.',
    },
  ],
  whyHere:
    'We chose this region because RS data is abundant (free NASA/OpenAQ), socio-environmental issues are documentable, and supervisors can verify findings against known fire and smog seasons.',
} as const;

export const RESULTS = {
  intro:
    'Placeholder summaries below — replace with your exported statistics, maps, and charts before final defense.',
  findings: [
    {
      title: 'Fire hotspot seasonality',
      metric: 'VIIRS detections',
      summary:
        'Dummy: thermal anomalies peak post-harvest weeks in central Punjab. Replace with your FIRMS time-series export.',
      method: 'PulseEarth FIRMS layer · daily pull',
    },
    {
      title: 'NDVI crop curve',
      metric: 'GIBS MODIS NDVI',
      summary:
        'Dummy: vegetation index rises after monsoon, dips before wheat sowing. Insert your seasonal chart.',
      method: 'PulseEarth NDVI toggle · visual trend',
    },
    {
      title: 'AQ vs fire overlap',
      metric: 'OpenAQ PM2.5',
      summary:
        'Dummy: urban stations show elevated PM when fire pixels cluster upwind. Cross-tab your station IDs.',
      method: 'PulseEarth AQ + fire layers',
    },
    {
      title: 'AOI field measurements',
      metric: 'TerraScope tools',
      summary:
        'Dummy: sample polygon area and transect length from TerraScope measure tools for report tables.',
      method: 'TerraScope area/distance export',
    },
  ],
} as const;

export const TERRASCOPE_TOOLS = [
  {
    name: 'Map engine',
    desc: 'Four basemaps via OpenFreeMap + ESRI satellite.',
    why: 'WebGL pan/zoom without desktop GIS.',
  },
  {
    name: 'Vector layers',
    desc: 'Hydrology, roads, 3D buildings, land use.',
    why: 'Thematic context for AOIs.',
  },
  {
    name: 'Spectral indices',
    desc: 'NDVI, NDWI, NDBI, EVI, SAVI reference.',
    why: 'Theory-to-map in one panel.',
  },
  {
    name: 'Analysis toolbar',
    desc: 'Distance, area, AOI, identify, profile.',
    why: 'Reproducible field measurements.',
  },
] as const;

export const PULSEEARTH_TOOLS = [
  {
    name: 'GIBS imagery',
    desc: 'NASA MODIS context tiles.',
    why: 'Authoritative regional backdrop.',
  },
  {
    name: 'FIRMS VIIRS',
    desc: 'Near-real-time fire pixels.',
    why: 'Burn detection for Punjab.',
  },
  {
    name: 'OpenAQ',
    desc: 'Ground station pollutants.',
    why: 'In-situ air-quality validation.',
  },
  {
    name: 'NDVI + weather',
    desc: 'Vegetation + Open-Meteo click.',
    why: 'Link crop health to weather.',
  },
] as const;
