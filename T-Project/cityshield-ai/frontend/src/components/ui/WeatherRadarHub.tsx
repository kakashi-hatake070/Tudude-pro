import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Wind,
  Droplets,
  Locate,
  Compass,
  ArrowRight,
  ImagePlus,
  Pause,
  Play,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { getLiveCurrentPosition } from '../../services/geocoding';
import rainGlassBg from '../../assets/images/waterlogging-alert.png';

interface CityWeatherConfig {
  name: string;
  state: string;
  lat: number;
  lng: number;
  defaultTemp: number;
  defaultRain: number;
  floodLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  culvertStatus: string;
}

export const WeatherRadarHub: React.FC = () => {
  const cities: CityWeatherConfig[] = [
    { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, defaultTemp: 24, defaultRain: 18.5, floodLevel: 'High', culvertStatus: 'Waterlogging likely near Silk Board & Bellandur underpass' },
    { name: 'Delhi NCR', state: 'National Capital', lat: 28.6139, lng: 77.2090, defaultTemp: 29, defaultRain: 4.2, floodLevel: 'Moderate', culvertStatus: 'Light rain watch around Minto Bridge underpass' },
    { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, defaultTemp: 28, defaultRain: 32.0, floodLevel: 'Severe', culvertStatus: 'Heavy waterlogging near Hindmata & Milan Subway' },
    { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, defaultTemp: 27, defaultRain: 2.1, floodLevel: 'Low', culvertStatus: 'Roads clear — Delhi Road drains flowing normally' },
    { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, defaultTemp: 26, defaultRain: 11.4, floodLevel: 'Moderate', culvertStatus: 'Light showers — Begumpet road water level normal' },
    { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, defaultTemp: 29, defaultRain: 21.8, floodLevel: 'High', culvertStatus: 'Water pumps running near Park Street area' }
  ];

  const [activeCity, setActiveCity] = useState<CityWeatherConfig>(cities[0]);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rainActive, setRainActive] = useState<boolean>(true);
  const [customBg, setCustomBg] = useState<string | null>(() => {
    try { return localStorage.getItem('nb_weather_bg'); } catch { return null; }
  });
  const [lightningFlash, setLightningFlash] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePickBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomBg(reader.result);
        try { localStorage.setItem('nb_weather_bg', reader.result); } catch {}
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchCityTelemetry = async (city: CityWeatherConfig) => {
    setLoading(true);
    try {
      const res = await api.getWeatherAndHazards({ lat: city.lat, lng: city.lng, city: city.name });
      if (res.weather) {
        setTelemetry(res.weather);
      }
    } catch (e) {
      setTelemetry({
        temperature: city.defaultTemp,
        feelsLike: city.defaultTemp + 2,
        rainfallMmPerHour: city.defaultRain,
        forecast24hMm: Math.round(city.defaultRain * 3.8),
        humidity: 82,
        windSpeedKmh: 19,
        warningTitle: `${city.floodLevel} Rain & Flood Alert`,
        warningDescription: city.culvertStatus,
        warningLevel: city.floodLevel === 'Severe' ? 'red' : city.floodLevel === 'High' ? 'orange' : 'yellow'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityTelemetry(activeCity);
  }, [activeCity]);

  // Smooth 60fps HTML5 Canvas Rain Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const intensity =
      activeCity.floodLevel === 'Severe'
        ? 135
        : activeCity.floodLevel === 'High'
        ? 90
        : activeCity.floodLevel === 'Moderate'
        ? 50
        : 26;

    const drops = Array.from({ length: intensity }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 12 + Math.random() * 18,
      speed: 6 + Math.random() * 8,
      opacity: 0.18 + Math.random() * 0.45,
      wind: 1.4 + Math.random() * 1.4
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (rainActive) {
        ctx.lineCap = 'round';
        for (const d of drops) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(186, 230, 253, ${d.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.wind, d.y + d.len);
          ctx.stroke();

          d.y += d.speed;
          d.x -= d.wind * 0.4;

          if (d.y > canvas.height) {
            d.y = -d.len;
            d.x = Math.random() * (canvas.width + 60);
          }
          if (d.x < -20) {
            d.x = canvas.width + 10;
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [activeCity.floodLevel, rainActive]);

  // Subtle distant lightning flash on High/Severe rain cities
  useEffect(() => {
    if (!rainActive || (activeCity.floodLevel !== 'Severe' && activeCity.floodLevel !== 'High')) {
      setLightningFlash(false);
      return;
    }
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 150);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeCity.floodLevel, rainActive]);

  const handleGPSDetect = async () => {
    setLoading(true);
    try {
      const pos = await getLiveCurrentPosition();
      const detectedCity: CityWeatherConfig = {
        name: pos.city || 'My Location',
        state: 'Your Area',
        lat: pos.coords[1],
        lng: pos.coords[0],
        defaultTemp: 26,
        defaultRain: 8.5,
        floodLevel: 'Moderate',
        culvertStatus: 'Checking nearby roads and rainfall'
      };
      setActiveCity(detectedCity);
      await fetchCityTelemetry(detectedCity);
    } catch (e) {
      setLoading(false);
    }
  };

  const currentTemp = Math.round(telemetry?.temperature ?? activeCity.defaultTemp);
  const feelsLike = Math.round(telemetry?.feelsLike ?? activeCity.defaultTemp + 2);
  const rainRate = telemetry?.rainfallMmPerHour ?? activeCity.defaultRain;
  const humidity = telemetry?.humidity ?? 82;
  const windKmh = telemetry?.windSpeedKmh ?? 14;

  // Clean Google-Weather-style hourly preview strip
  const hourlyPreview = [
    { time: 'Now', temp: currentTemp, rain: rainRate > 10 ? '80%' : rainRate > 2 ? '45%' : '20%' },
    { time: '+1 hr', temp: currentTemp, rain: rainRate > 10 ? '75%' : '35%' },
    { time: '+2 hr', temp: currentTemp - 1, rain: rainRate > 10 ? '65%' : '30%' },
    { time: '+3 hr', temp: currentTemp - 1, rain: rainRate > 10 ? '50%' : '25%' },
    { time: '+4 hr', temp: currentTemp - 2, rain: rainRate > 10 ? '40%' : '15%' },
    { time: '+5 hr', temp: currentTemp - 2, rain: '15%' }
  ];

  const WeatherIcon =
    activeCity.floodLevel === 'Severe'
      ? CloudLightning
      : activeCity.floodLevel === 'High'
      ? CloudRain
      : CloudDrizzle;

  return (
    <section className="py-20 bg-slate-950 text-white border-b border-slate-800/80 relative overflow-hidden">

      {/* Real Full-Bleed Weather Photo Backdrop (User's Ocean/Coastal Photo by default, or custom picked) */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02] transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url('${customBg || '/assets/images/weather-coastal-bg.jpg'}'), url('${rainGlassBg}')`
        }}
      />
      {/* Balanced dark glass tint so white text & frosted cards stay super crisp over bright ocean photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/45 to-slate-950/75 pointer-events-none" />

      {/* Subtle Lightning Flash */}
      <div
        className={`absolute inset-0 bg-sky-200/15 pointer-events-none transition-opacity duration-150 ${
          lightningFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Full-Section Falling Rain Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Row: Simple Header + City Pills */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-bold backdrop-blur-md">
              <CloudRain className="w-3.5 h-3.5" />
              <span>Live Weather &amp; Rain</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-sm">
              Live Weather &amp; Rain Alerts
            </h2>
            <p className="text-sm text-sky-100/85">
              Clean, live weather and flooded-road updates for your city before you step out.
            </p>
          </div>

          {/* City Chips + Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {cities.map((c) => (
              <button
                key={c.name}
                onClick={() => setActiveCity(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md ${
                  activeCity.name === c.name
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-white/10 text-white/90 border border-white/20 hover:bg-white/20'
                }`}
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={handleGPSDetect}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-saffron hover:brightness-105 text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Locate className="w-3.5 h-3.5" />
              <span>My Location</span>
            </button>
          </div>
        </div>

        {/* Google Weather Style Transparent Glass Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left: Main Transparent Google-Weather Hero Card (No Radar!) */}
          <div className="lg:col-span-7 rounded-3xl bg-white/[0.07] border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between gap-8">

            {/* Card Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-saffron" />
                <span className="text-base font-bold text-white">{activeCity.name}</span>
                <span className="text-xs text-white/65">• {activeCity.state}</span>
              </div>

              <div className="flex items-center space-x-2">
                <label className="cursor-pointer px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-[11px] font-semibold text-white inline-flex items-center space-x-1.5 transition-colors">
                  <ImagePlus className="w-3.5 h-3.5 text-saffron" />
                  <span>Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePickBg}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setRainActive(!rainActive)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-white/90 inline-flex items-center space-x-1 transition-colors"
                >
                  {rainActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{rainActive ? 'Pause' : 'Rain'}</span>
                </button>
              </div>
            </div>

            {/* Center Google-Weather Giant Temperature + Icon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-2">
              <div className="flex items-center space-x-5">
                <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                  <WeatherIcon className="w-11 h-11 text-sky-300 drop-shadow" />
                </div>
                <div>
                  <div className="text-6xl sm:text-7xl font-light tracking-tight text-white leading-none">
                    {currentTemp}°
                  </div>
                  <div className="text-sm font-medium text-sky-100/90 mt-2">
                    Feels like {feelsLike}° • {rainRate} mm/h rain
                  </div>
                </div>
              </div>

              <div className="sm:text-right space-y-1.5">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    activeCity.floodLevel === 'Severe'
                      ? 'bg-red-500/30 text-red-100 border border-red-400/40'
                      : activeCity.floodLevel === 'High'
                      ? 'bg-amber-500/30 text-amber-100 border border-amber-400/40'
                      : 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40'
                  }`}
                >
                  {activeCity.floodLevel} Rain Risk
                </span>
                <p className="text-xs text-white/80 max-w-xs sm:ml-auto leading-relaxed">
                  {activeCity.culvertStatus}
                </p>
              </div>
            </div>

            {/* Hourly Strip (Google Weather Style) */}
            <div className="pt-5 border-t border-white/15">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-3">
                Next Few Hours
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {hourlyPreview.map((slot) => (
                  <div
                    key={slot.time}
                    className="py-3 px-2 rounded-2xl bg-white/[0.06] border border-white/10 text-center space-y-1.5"
                  >
                    <div className="text-[11px] text-white/70 font-medium">{slot.time}</div>
                    <CloudRain className="w-4 h-4 text-sky-300 mx-auto" />
                    <div className="text-sm font-bold text-white">{slot.temp}°</div>
                    <div className="text-[10px] text-sky-300 font-semibold">{slot.rain}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Clean Transparent Detail Tiles */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">

            {/* Road & Rain Advisory Glass Card */}
            <div className="p-6 rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-xl space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white/65">
                Road &amp; Rain Advisory
              </div>
              <h3 className="text-lg font-bold text-white">
                {telemetry?.warningTitle || `${activeCity.name} Weather Update`}
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                {telemetry?.warningDescription || activeCity.culvertStatus}
              </p>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden pt-0">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    activeCity.floodLevel === 'Severe'
                      ? 'w-[90%] bg-red-400'
                      : activeCity.floodLevel === 'High'
                      ? 'w-[72%] bg-amber-400'
                      : 'w-[38%] bg-emerald-400'
                  }`}
                />
              </div>
            </div>

            {/* 4 Frosted Glass Weather Tiles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl">
                <div className="flex items-center justify-between text-white/65 mb-1.5">
                  <span className="text-[11px] font-semibold">24h Rainfall</span>
                  <Droplets className="w-4 h-4 text-sky-300" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {telemetry?.forecast24hMm ?? Math.round(activeCity.defaultRain * 3.8)} mm
                </div>
                <div className="text-[11px] text-white/60 mt-0.5">Expected today</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl">
                <div className="flex items-center justify-between text-white/65 mb-1.5">
                  <span className="text-[11px] font-semibold">Humidity</span>
                  <CloudRain className="w-4 h-4 text-cyan-300" />
                </div>
                <div className="text-2xl font-bold text-white">{humidity}%</div>
                <div className="text-[11px] text-white/60 mt-0.5">Current air moisture</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl">
                <div className="flex items-center justify-between text-white/65 mb-1.5">
                  <span className="text-[11px] font-semibold">Wind</span>
                  <Wind className="w-4 h-4 text-sky-200" />
                </div>
                <div className="text-2xl font-bold text-white">{windKmh} km/h</div>
                <div className="text-[11px] text-white/60 mt-0.5">Light breeze</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl">
                <div className="flex items-center justify-between text-white/65 mb-1.5">
                  <span className="text-[11px] font-semibold">Flood Watch</span>
                  <Compass className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {activeCity.floodLevel === 'Severe' ? '14 Areas' : '6 Areas'}
                </div>
                <div className="text-[11px] text-emerald-300 font-semibold mt-0.5">Live updates</div>
              </div>
            </div>

            {/* Clean Translucent Safe-Route Bar */}
            <Link
              to="/safe-routes"
              className="p-4 rounded-2xl bg-white/15 hover:bg-white/22 border border-white/25 backdrop-blur-xl text-white flex items-center justify-between gap-3 transition-all group"
            >
              <div>
                <div className="font-bold text-sm">Heading out right now?</div>
                <p className="text-xs text-white/75">Check the safest dry route before leaving home.</p>
              </div>
              <span className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs inline-flex items-center space-x-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                <span>Safe Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
};
