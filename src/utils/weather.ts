import { DateWeather } from '../types/date';

export async function fetchWeatherForLocation(location: string): Promise<DateWeather | null> {
  if (!location || location.trim().length < 2) return null;
  try {
    const res = await fetch(`/api/weather?location=${encodeURIComponent(location.trim())}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.temp !== undefined) {
      return {
        temp: data.temp,
        condition: data.condition,
        icon: data.icon,
        rainProbability: data.precip ? Math.min(100, Math.round(data.precip * 30)) : 0,
        advisory: data.advisory,
      };
    }
  } catch (err) {
    console.warn('Could not fetch weather:', err);
  }
  return null;
}
