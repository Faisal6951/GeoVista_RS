export interface FirePoint {
  lat: number;
  lng: number;
  brightness: number;
  frp: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  daynight: "D" | "N";
  confidence: string;
}

export interface AQStation {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  pm25: number | null;
  aqi: number;
  category: "good" | "moderate" | "unhealthy" | "hazardous";
  lastUpdated: string;
}

export interface WeatherCurrent {
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  weatherCode: number;
  description: string;
}

export interface WeatherForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
}

export interface LayerState {
  satellite: boolean;
  fires: boolean;
  airQuality: boolean;
  ndvi: boolean;
  weather: boolean;
}

export interface MapStore {
  layers: LayerState;
  selectedDate: string;
  activeWeather: WeatherData | null;
  activeStation: AQStation | null;
  activeFire: FirePoint | null;
  mapCenter: [number, number];
  mapZoom: number;
  toggleLayer: (key: keyof LayerState) => void;
  setDate: (d: string) => void;
  setActiveWeather: (w: WeatherData | null) => void;
  setActiveStation: (s: AQStation | null) => void;
  setActiveFire: (f: FirePoint | null) => void;
  setMapView: (center: [number, number], zoom: number) => void;
}
