import WeatherObservation from '../models/WeatherObservation.js';
import HazardZone from '../models/HazardZone.js';

export const getCurrentWeatherAndHazards = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 12.9716;
    const lng = parseFloat(req.query.lng) || 77.5946;
    const city = req.query.city || 'Bengaluru';

    let liveWeather = null;
    let isDemoData = false;

    // Attempt real-time weather fetch from Open-Meteo (no API key required)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,cloud_cover&hourly=precipitation&forecast_days=1`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const current = data.current || {};
        const rainMm = Number(current.rain ?? current.precipitation ?? 0);
        const hourlyPrecip = Array.isArray(data.hourly?.precipitation)
          ? data.hourly.precipitation.reduce((sum, val) => sum + (Number(val) || 0), 0)
          : rainMm;

        let warningLevel = 'green';
        let warningTitle = 'Normal Weather Conditions';
        let warningDescription = `Current temperature ${current.temperature_2m ?? '--'}°C with ${rainMm} mm/h rainfall. No active flood advisory from weather feed.`;

        if (rainMm >= 15 || hourlyPrecip >= 50) {
          warningLevel = 'red';
          warningTitle = 'Heavy Rainfall Advisory: High Waterlogging Risk';
          warningDescription = `Live rainfall of ${rainMm} mm/h detected (24h forecast ${hourlyPrecip.toFixed(1)} mm). Avoid low-lying underpasses.`;
        } else if (rainMm >= 5 || hourlyPrecip >= 20) {
          warningLevel = 'orange';
          warningTitle = 'Moderate Rainfall Advisory: Check Route Hazards';
          warningDescription = `Live rainfall of ${rainMm} mm/h (24h forecast ${hourlyPrecip.toFixed(1)} mm). Localized road ponding possible.`;
        } else if (rainMm > 0 || hourlyPrecip >= 5) {
          warningLevel = 'yellow';
          warningTitle = 'Light Rain & Wet Road Advisory';
          warningDescription = `Light precipitation (${rainMm} mm/h, 24h forecast ${hourlyPrecip.toFixed(1)} mm). Watch for slick road surfaces.`;
        }

        liveWeather = {
          city,
          temperature: current.temperature_2m ?? 25,
          feelsLike: current.apparent_temperature ?? current.temperature_2m ?? 25,
          rainfallMmPerHour: rainMm,
          forecast24hMm: Number(hourlyPrecip.toFixed(1)),
          humidity: current.relative_humidity_2m ?? 70,
          windSpeedKmh: current.wind_speed_10m ?? 8,
          cloudCover: current.cloud_cover ?? 25,
          warningLevel,
          warningTitle,
          warningDescription,
          source: 'Open-Meteo Live Weather API',
          isDemoData: false,
          timestamp: new Date()
        };
      }
    } catch (apiErr) {
      console.warn('[Weather] Live Open-Meteo fetch failed, falling back to clearly labeled demo observation:', apiErr.message);
    }

    let observation = liveWeather;

    if (!observation) {
      isDemoData = true;
      let dbObs = await WeatherObservation.findOne().sort({ timestamp: -1 }).lean();
      if (!dbObs) {
        const created = await WeatherObservation.create({
          city,
          temperature: 24.5,
          rainfallMmPerHour: 8.4,
          forecast24hMm: 35.0,
          humidity: 78,
          warningLevel: 'yellow',
          warningTitle: 'Yellow Alert (Demo Data): Moderate Rainfall with Local Inundation Risk',
          warningDescription: 'Simulated monsoon advisory for demonstration. Localized waterlogging may occur in low-lying underpasses.',
          source: 'CityShield Demo Weather Feed (Offline Fallback)',
          timestamp: new Date()
        });
        dbObs = created.toObject();
      }
      observation = {
        ...dbObs,
        city,
        feelsLike: dbObs.temperature,
        windSpeedKmh: 12,
        cloudCover: 65,
        isDemoData: true
      };
    }

    const floodZones = await HazardZone.find({
      type: { $in: ['flood_prone', 'chronic_waterlogging'] }
    });

    res.json({
      success: true,
      weather: observation,
      isDemoData,
      floodZones,
      lastUpdated: observation.timestamp,
      dataNotice: isDemoData
        ? 'Demo weather advisory shown because live weather feed is unavailable.'
        : 'Live weather telemetry fetched from Open-Meteo and paired with verified citizen hazard reports.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
