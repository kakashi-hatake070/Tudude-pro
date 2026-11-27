import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  FilePlus,
  Eye,
  AlertTriangle,
  Droplets,
  Lock,
  Sparkles,
  Loader2,
  RefreshCw,
  CloudRain,
  MessageSquare,
  Building2
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import { IssueReport, HazardZone } from '../types';
import waterloggingImg from '../assets/images/waterlogging-alert.png';
import safeRoutingImg from '../assets/images/safe-routing.png';
import aiVisionImg from '../assets/images/ai-vision-scan.png';

export const LandingPage: React.FC = () => {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [isDemoWeather, setIsDemoWeather] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLandingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsRes, weatherRes] = await Promise.all([
        api.getReports({ limit: 25 }),
        api.getWeatherAndHazards()
      ]);

      const fetchedReports = reportsRes.reports || [];
      setReports(fetchedReports);
      if (fetchedReports.length > 0) {
        const sorted = [...fetchedReports].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
        setSelectedReport(sorted[0]);
      } else {
        setSelectedReport(null);
      }

      if (weatherRes.weather) {
        setWeather(weatherRes.weather);
        setIsDemoWeather(Boolean(weatherRes.isDemoData ?? weatherRes.weather.isDemoData));
      }
      setHazardZones(weatherRes.floodZones || []);
    } catch (e: any) {
      console.error('Failed to load landing page data:', e);
      setError(e.message || 'Unable to connect to CityShield backend services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandingData();
  }, []);

  const previewReport = selectedReport || reports[0] || null;
  const isUnverifiedPreview =
    previewReport && previewReport.status === 'submitted' && (previewReport.upvotes || 0) === 0;

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerBanner variant="independent" />
      {weather && (
        <DisclaimerBanner
          variant="weather"
          isDemoData={isDemoWeather}
          source={weather.source}
          message={`${weather.warningTitle}: ${weather.warningDescription}`}
          actionLabel="View Live Map"
          actionTo="/live-map"
        />
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>AI-Powered Urban Safety Platform for Indian Cities</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-main tracking-tight leading-[1.12]">
                Your City Deserves to <br />
                <span className="text-primary underline decoration-secondary decoration-wavy decoration-from-font">
                  Be Safer.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl font-normal">
                Discover urban problems, avoid dangerous roads, report civic issues and help build smarter cities with AI-powered intelligence.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  to="/live-map"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Explore Live Map</span>
                </Link>

                <Link
                  to="/report"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-sm shadow-md shadow-secondary/25 transition-all transform hover:-translate-y-0.5"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Report a Problem</span>
                </Link>
              </div>

              {/* Verified Trust Indicators & Weather Telemetry */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200 text-xs">
                <div>
                  <div className="font-bold text-text-main text-sm">100% Anonymous</div>
                  <div className="text-text-muted">EXIF-stripped privacy</div>
                </div>
                <div>
                  <div className="font-bold text-text-main text-sm">Real Geospatial GIS</div>
                  <div className="text-text-muted">OpenStreetMap + 2dsphere</div>
                </div>
                <div>
                  <div className="font-bold text-text-main text-sm">
                    {weather
                      ? `${weather.temperature}°C • ${weather.rainfallMmPerHour} mm/h`
                      : 'Weather Telemetry'}
                  </div>
                  <div className="text-text-muted">
                    {weather
                      ? `${weather.humidity}% humidity • ${isDemoWeather ? 'Demo feed' : 'Live feed'}`
                      : 'Syncing weather feed...'}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual: Interactive MapLibre + OSM Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-white p-3 rounded-2xl shadow-soft-lg border border-slate-200">
                <div className="flex items-center justify-between pb-3 px-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                    <span className="font-bold text-slate-800">Interactive City Map</span>
                  </div>
                  <span className="text-[11px] text-text-muted font-mono">
                    {loading
                      ? 'Syncing...'
                      : error
                      ? 'Offline'
                      : `${reports.length} active record${reports.length === 1 ? '' : 's'}`}
                  </span>
                </div>

                <div className="h-[360px] w-full rounded-xl overflow-hidden relative">
                  {loading ? (
                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-xs text-text-muted space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading OpenStreetMap &amp; issue markers...</span>
                    </div>
                  ) : (
                    <MapComponent
                      reports={reports}
                      hazardZones={hazardZones}
                      zoom={11.8}
                      interactive={true}
                      showSearchBar={false}
                      showLocateButton={true}
                      showLegend={false}
                      selectedReportId={previewReport?.trackingId}
                      onMarkerClick={(report) => setSelectedReport(report)}
                    />
                  )}
                </div>

                {/* Live Issue Card bound to Backend Record */}
                {error ? (
                  <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-rose-800">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                    <button
                      onClick={loadLandingData}
                      className="text-rose-700 font-bold hover:underline flex items-center space-x-1 ml-2 flex-shrink-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                ) : previewReport ? (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-text-main truncate">{previewReport.title}</span>
                          {isUnverifiedPreview && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold flex-shrink-0">
                              Unverified
                            </span>
                          )}
                        </div>
                        <div className="text-text-muted text-[11px] truncate">
                          {previewReport.trackingId} • Risk {previewReport.riskScore}/100 • {previewReport.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <Link to="/live-map" className="text-primary font-bold hover:underline flex-shrink-0">
                      View &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-text-muted">
                    <span>No active civic hazard records reported yet.</span>
                    <Link to="/report" className="text-primary font-bold hover:underline">
                      Report &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE ICON / LOGO BAR */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <Link
              to="/live-map"
              className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-primary-light/60 border border-slate-200 hover:border-primary/30 transition-all flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-text-main">Live Map</span>
              <span className="text-[11px] text-text-muted mt-0.5 leading-snug">Real-time hazards &amp; markers</span>
            </Link>

            <Link
              to="/safe-routes"
              className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-primary-light/60 border border-slate-200 hover:border-primary/30 transition-all flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-secondary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-text-main">Safe Routes</span>
              <span className="text-[11px] text-text-muted mt-0.5 leading-snug">Avoid potholes &amp; floods</span>
            </Link>

            <Link
              to="/report"
              className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-secondary-light/70 border border-slate-200 hover:border-secondary/30 transition-all flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
                <FilePlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-text-main">Report Issue</span>
              <span className="text-[11px] text-text-muted mt-0.5 leading-snug">Anonymous snap &amp; pin</span>
            </Link>

            <Link
              to="/explore"
              className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-primary-light/60 border border-slate-200 hover:border-primary/30 transition-all flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-text-main">Weather &amp; Area</span>
              <span className="text-[11px] text-text-muted mt-0.5 leading-snug">Rain alerts &amp; safety index</span>
            </Link>

            <Link
              to="/community"
              className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-primary-light/60 border border-slate-200 hover:border-primary/30 transition-all flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-secondary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-text-main">Community</span>
              <span className="text-[11px] text-text-muted mt-0.5 leading-snug">Discuss, upvote &amp; verify</span>
            </Link>

            <Link
              to="/government/login"
              className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-primary-light/60 border border-slate-200 hover:border-primary/30 transition-all flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-extrabold text-text-main">Gov Portal</span>
              <span className="text-[11px] text-text-muted mt-0.5 leading-snug">Official repair &amp; SLAs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIVE CITY INTELLIGENCE HIGHLIGHTS */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main">
              Built for Real Indian Urban Challenges
            </h2>
            <p className="text-sm sm:text-base text-text-muted mt-2">
              From sudden monsoon cloudbursts to hidden craters and uncollected waste, CityShield AI bridges the gap between commuters and civic authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-soft-md transition-all duration-300 overflow-hidden hover:-translate-y-1">
              <div className="relative h-44 w-full overflow-hidden bg-slate-200">
                <img
                  src={waterloggingImg}
                  alt="Monsoon waterlogging street conditions"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/90 text-white flex items-center justify-center shadow-md">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-primary text-[11px] font-bold flex items-center space-x-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>Monsoon Radar</span>
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-text-main mb-2">Waterlogging &amp; Monsoon Warnings</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Aggregates citizen depth observations with weather telemetry to highlight flooded underpasses and impassable low points.
                </p>
              </div>
            </div>

            <div className="group rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-soft-md transition-all duration-300 overflow-hidden hover:-translate-y-1">
              <div className="relative h-44 w-full overflow-hidden bg-slate-200">
                <img
                  src={safeRoutingImg}
                  alt="Safe urban commuter corridor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-secondary/95 text-white flex items-center justify-center shadow-md">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-secondary text-[11px] font-bold shadow-sm">
                    120m Hazard Buffer
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-text-main mb-2">Hazard-Aware Safe Routing</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Unlike standard navigation apps, CityShield penalizes routes passing within 120 meters of severe potholes or waterlogged roads to suggest safer alternatives.
                </p>
              </div>
            </div>

            <div className="group rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-soft-md transition-all duration-300 overflow-hidden hover:-translate-y-1">
              <div className="relative h-44 w-full overflow-hidden bg-slate-200">
                <img
                  src={aiVisionImg}
                  alt="Road damage computer vision scan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_10px_#1769D2] animate-scan-sweep pointer-events-none" />
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-700/90 text-white flex items-center justify-center shadow-md">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-purple-800 text-[11px] font-bold shadow-sm">
                    YOLO AI Scan
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold text-text-main mb-2">Computer Vision &amp; YOLO AI</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Python FastAPI microservice scans reported photos, identifies craters and garbage piles, estimates severity, and flags duplicates automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW THE PLATFORM WORKS */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">End-to-End Civic Cycle</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main mt-1">
              How CityShield AI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-3">1</div>
              <h4 className="font-bold text-sm text-text-main mb-1">Citizen Snaps &amp; Reports</h4>
              <p className="text-xs text-text-muted">Take a photo or upload video. Location is fuzzed for privacy and EXIF is sanitized.</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center mx-auto mb-3">2</div>
              <h4 className="font-bold text-sm text-text-main mb-1">AI Scan &amp; Review</h4>
              <p className="text-xs text-text-muted">AI estimates severity and detects duplicates. You review suggestions before dispatching.</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3">3</div>
              <h4 className="font-bold text-sm text-text-main mb-1">Department Assigned</h4>
              <p className="text-xs text-text-muted">Routed to municipal ward engineers based on geospatial boundary polygons.</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-3">4</div>
              <h4 className="font-bold text-sm text-text-main mb-1">Resolved with Proof</h4>
              <p className="text-xs text-text-muted">Officer uploads photographic proof of repair. Status turns green upon community verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ANONYMOUS PRIVACY PROMISE */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privacy-First Civic Participation</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  No public names. No exposed phone numbers. Total civic safety.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
                  Every citizen is assigned a pseudonym like <span className="text-secondary font-mono font-bold">CityGuardian_4821</span> or <span className="text-secondary font-mono font-bold">UrbanWatcher_2048</span>. EXIF GPS metadata is automatically purged from uploaded photos, and public markers use approximate coordinates to prevent revealing private residences.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs font-bold transition-colors"
                  >
                    Claim Your Citizen Shield
                  </Link>
                  <Link
                    to="/about"
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    Read Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700 font-mono text-slate-400">
                  <span>IDENTITY_PROFILE</span>
                  <span className="text-emerald-400">ENCRYPTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Public Identifier:</span>
                  <span className="font-mono text-white font-bold">RoadObserver_9021</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Real Name / Phone:</span>
                  <span className="text-slate-500 italic">Never stored publicly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Photo EXIF Geo-tag:</span>
                  <span className="text-emerald-400 font-semibold">Stripped on upload</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Public Location Jitter:</span>
                  <span className="text-amber-400 font-semibold">±65m Privacy Fuzz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 bg-background text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main">
            Ready to Make Your Neighborhood Resilient?
          </h2>
          <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto">
            Join citizens mapping hazards, preventing monsoon accidents, and demanding civic accountability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md shadow-primary/25 transition-all"
            >
              Report a Civic Hazard Now
            </Link>
            <Link
              to="/safe-routes"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-text-main border border-slate-200 text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              Check Route Hazards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
