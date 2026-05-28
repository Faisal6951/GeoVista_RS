export type AQCategory = "good" | "moderate" | "unhealthy" | "hazardous";

export function pm25ToAqi(pm25: number): number {
  if (pm25 <= 12)   return Math.round(linear(0,   50,  0,    12,   pm25));
  if (pm25 <= 35.4) return Math.round(linear(51,  100, 12.1, 35.4, pm25));
  if (pm25 <= 55.4) return Math.round(linear(101, 150, 35.5, 55.4, pm25));
  if (pm25 <= 150.4)return Math.round(linear(151, 200, 55.5, 150.4,pm25));
  return Math.round(linear(201, 300, 150.5, 250.4, pm25));
}
function linear(iL:number,iH:number,cL:number,cH:number,c:number){
  return ((iH-iL)/(cH-cL))*(c-cL)+iL;
}
export function aqiToCategory(aqi: number): AQCategory {
  if (aqi <= 50)  return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 200) return "unhealthy";
  return "hazardous";
}
export const CATEGORY_COLOR: Record<AQCategory, string> = {
  good:      "#22c55e",
  moderate:  "#facc15",
  unhealthy: "#f97316",
  hazardous: "#ef4444",
};
export function frpToRadius(frp: number): number {
  return Math.min(Math.max(Math.sqrt(frp) * 1.8 + 5, 5), 22);
}
