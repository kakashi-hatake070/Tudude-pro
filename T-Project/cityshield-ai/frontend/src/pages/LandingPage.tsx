import React, { useState, useEffect, useRef } from 'react';
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
  CloudRain,
  MessageSquare,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Play,
  Pause,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import { IssueReport, HazardZone } from '../types';
import { Marquee } from '../components/ui/Marquee';
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid';
import { NumberTicker } from '../components/ui/NumberTicker';
import { MetricCard } from '../components/ui/TremorMetrics';
import { TeamSection } from '../components/ui/TeamSection';
import { FAQSection } from '../components/ui/FAQSection';
import { DatasetShowcase } from '../components/ui/DatasetShowcase';
import { WeatherRadarHub } from '../components/ui/WeatherRadarHub';
import { CitizenReviews } from '../components/ui/CitizenReviews';
import { HorizontalIncidentScroll } from '../components/ui/HorizontalIncidentScroll';
import { EmergencyHelplineScroll } from '../components/ui/EmergencyHelplineScroll';
import { Badge } from '../components/ui/Badge';
import waterloggingImg from '../assets/images/waterlogging-alert.png';
import safeRoutingImg from '../assets/images/safe-routing.png';
import aiVisionImg from '../assets/images/ai-vision-scan.png';
import bentoPrivacyImg from '../assets/images/bento-privacy.png';
import bentoGovImg from '../assets/images/bento-government.png';
import bentoDedupImg from '../assets/images/bento-deduplication.png';

export const LandingPage: React.FC = () => {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [isDemoWeather, setIsDemoWeather] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const liveAlerts = [
    { city: 'Bengaluru', location: 'Silk Board Junction', text: '25cm waterlogging reported • Safer detour available' },
    { city: 'Delhi NCR', location: 'Outer Ring Road (Nehru Place)', text: 'Deep pothole detected • High risk warning' },
    { city: 'Mumbai', location: 'Western Express Highway', text: 'Streetlights restored with photo proof' },
    { city: 'Meerut', location: 'Delhi Road Underpass', text: 'Drainage cleared • Road open for commuters' },
    { city: 'Bengaluru', location: 'Indiranagar 100ft Road', text: 'Garbage hotspot flagged • Assigned to local ward' },
  ];

  const loadLandingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsRes, weatherRes] = await Promise.all([
        api.getReports({ limit: 25 }),
        api.getWeatherAndHazards({ lat: 12.9716, lng: 77.5946, city: 'Bengaluru' })
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
      setError(e.message || 'Unable to connect to Nav Bharat backend services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandingData();
  }, []);

  const toggleHeroVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setVideoPlaying(false);
    }
  };

  const previewReport = selectedReport || reports[0] || null;
  const isUnverifiedPreview =
    previewReport && previewReport.status === 'submitted' && (previewReport.upvotes || 0) === 0;

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-text-main dark:text-slate-100 transition-colors duration-300">
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

      {/* 1. CINEMATIC 16:9 VIDEO HERO SECTION */}
      <section className="relative overflow-hidden min-h-[640px] lg:min-h-[700px] flex items-center py-14 md:py-20 bg-slate-950 text-white border-b border-slate-800">
        {/* Background 16:9 Aerial Indian City Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
          aria-hidden="true"
        >
          <source src="/assets/videos/hero-city-aerial.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Navy Readability Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-navy/70" />

        {/* Ambient Video Play/Pause Accessibility Toggle */}
        <button
          onClick={toggleHeroVideo}
          aria-label={videoPlaying ? 'Pause background video' : 'Play background video'}
          title={videoPlaying ? 'Pause background video' : 'Play background video'}
          className="absolute bottom-5 right-5 z-20 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-950/65 hover:bg-slate-900/90 text-slate-200 border border-white/15 backdrop-blur-md text-xs font-semibold transition-all"
        >
          {videoPlaying ? <Pause className="w-3.5 h-3.5 text-saffron" /> : <Play className="w-3.5 h-3.5 text-saffron" />}
          <span className="hidden sm:inline">{videoPlaying ? 'Pause Video' : 'Play Video'}</span>
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-up">

            {/* Brand Pill */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
              <div className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0 bg-white p-0.5">
                <img src="/assets/nav-bharat-logo.jpg" alt="Nav Bharat" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-black tracking-wider text-white">
                NAV BHARAT <span className="text-saffron">AI</span>
              </span>
              <span className="text-white/30">|</span>
              <span className="text-[11px] font-semibold text-slate-200 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-saffron" />
                <span>Your City. Your Safety. Your Intelligence.</span>
              </span>
            </div>

            {/* Clear, Plain-English Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-sm">
              Safer Roads &amp; Smarter Cities,{' '}
              <span className="bg-gradient-to-r from-saffron via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                Made Simple for Everyone.
              </span>
            </h1>

            {/* Friendly Subtitle */}
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-normal">
              Spot a pothole, flooded street, or broken streetlight? Snap a quick photo anonymously, check live neighborhood hazards, and find the safest route home in seconds.
            </p>

            {/* Trust Micro-Badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-200">
              <span className="inline-flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Anonymous Reporting</span>
              </span>
              <span className="inline-flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-saffron" />
                <span>AI Photo Check in Seconds</span>
              </span>
              <span className="inline-flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Flood-Free Safe Routes</span>
              </span>
            </div>
          </div>

          {/* 3-Card "What Do You Want To Do?" Quick-Action Dock */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <Link
              to="/report"
              className="group p-5 rounded-2xl bg-gradient-to-br from-saffron to-amber-600 text-white shadow-xl shadow-saffron/25 hover:brightness-105 transition-all hover:-translate-y-1 flex items-start space-x-4 border border-white/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base">Report a Problem</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs text-white/90 mt-1 leading-relaxed">
                  Upload a photo or video of potholes, flooding, or garbage in 3 easy steps.
                </p>
              </div>
            </Link>

            <Link
              to="/live-map"
              className="group p-5 rounded-2xl bg-white/12 hover:bg-white/18 backdrop-blur-xl text-white shadow-xl transition-all hover:-translate-y-1 flex items-start space-x-4 border border-white/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/80 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base">See Live City Map</span>
                  <ArrowUpRight className="w-4 h-4 text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  View reported hazards, waterlogged roads, and verified repairs near you.
                </p>
              </div>
            </Link>

            <Link
              to="/safe-routes"
              className="group p-5 rounded-2xl bg-white/12 hover:bg-white/18 backdrop-blur-xl text-white shadow-xl transition-all hover:-translate-y-1 flex items-start space-x-4 border border-white/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/90 flex items-center justify-center shrink-0">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base">Find a Safe Route</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  Compare routes for cars, bikes, or walking to avoid flooded underpasses.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE TICKER & PLATFORM METRICS BAR */}
      <section className="py-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Live Updates Marquee */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="flex items-center px-4 py-2 bg-slate-900 dark:bg-slate-950 text-white text-xs font-bold gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <Radio className="w-3.5 h-3.5 text-saffron" />
              <span className="tracking-wider uppercase">Recent Civic Alerts</span>
            </div>
            <Marquee duration="30s" pauseOnHover={true} className="py-2.5">
              {liveAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  <span className="font-bold text-slate-900 dark:text-white">{alert.city}:</span>
                  <span className="text-primary dark:text-blue-400 font-semibold">{alert.location}</span>
                  <span className="text-slate-400">•</span>
                  <span>{alert.text}</span>
                </div>
              ))}
            </Marquee>
          </div>

          {/* 4 Easy-to-Understand Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <MetricCard
              title="Active Reports"
              className="dark:bg-slate-900 dark:border-slate-800"
              metric={<NumberTicker value={loading ? 0 : reports.length} />}
              subtext="Live civic records currently tracked in the database"
              delta="Live Backend"
              deltaType="positive"
              icon={AlertTriangle}
            />
            <MetricCard
              title="Safe Route Buffer"
              className="dark:bg-slate-900 dark:border-slate-800"
              metric={<NumberTicker value={120} suffix="m" />}
              subtext="Safety zone checked around roads to steer clear of hazards"
              delta="Active Routing"
              deltaType="positive"
              icon={Navigation}
            />
            <MetricCard
              title="Flood Watch Zones"
              className="dark:bg-slate-900 dark:border-slate-800"
              metric={<NumberTicker value={loading ? 0 : hazardZones.length} />}
              subtext="Mapped low-lying waterlogging zones synced with weather"
              delta="Weather Sync"
              deltaType="neutral"
              icon={Droplets}
            />
            <MetricCard
              title="Citizen Privacy"
              className="dark:bg-slate-900 dark:border-slate-800"
              metric={<NumberTicker value={100} suffix="%" />}
              subtext="No real names needed; photo EXIF tags wiped automatically"
              delta="Protected"
              deltaType="positive"
              icon={Lock}
            />
          </div>
        </div>
      </section>

      {/* 1.5 EMERGENCY RAPID DISASTER HELPLINES */}
      <EmergencyHelplineScroll />

      {/* 2. HOW NAV BHARAT HELPS YOU (CLEAN BENTO GRID) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <Badge variant="saffron" className="px-3 py-1 font-bold">
              Built for Everyday Commuters
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Everything You Need for a Safer Commute
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Simple tools powered by smart AI behind the scenes — designed so anyone can use them without a manual.
            </p>
          </div>

          <BentoGrid>
            <BentoCard
              name="Flood & Pothole-Free Safe Routes"
              className="md:col-span-2"
              Icon={Navigation}
              badge="Smart Navigation"
              badgeColor="bg-blue-100 text-primary border border-primary/20"
              description="Regular maps only show the fastest road. Nav Bharat checks 120 meters around every street to help two-wheelers, cars, and pedestrians avoid deep waterlogging and broken roads."
              href="/safe-routes"
              cta="Plan a Safe Route"
              background={
                <img
                  src={safeRoutingImg}
                  alt="Safe Route Navigation"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              }
            />

            <BentoCard
              name="Instant AI Photo Check"
              className="md:col-span-1"
              Icon={Eye}
              badge="YOLO Vision"
              badgeColor="bg-purple-100 text-purple-700 border border-purple-200"
              description="Just upload a photo. Our AI automatically identifies potholes, waterlogging, or garbage and estimates how urgent the repair is."
              href="/report"
              cta="Upload a Photo"
              background={
                <img
                  src={aiVisionImg}
                  alt="AI Photo Scanner"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              }
            />

            <BentoCard
              name="100% Anonymous & Private"
              className="md:col-span-1"
              Icon={Lock}
              badge="Privacy First"
              badgeColor="bg-emerald-100 text-emerald-800 border border-emerald-200"
              description="Report fearlessly with an anonymous handle. Hidden camera location tags (EXIF) are removed automatically before publishing."
              href="/register"
              cta="Create Anonymous ID"
              background={
                <img
                  src={bentoPrivacyImg}
                  alt="Privacy Protection"
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              }
            />

            <BentoCard
              name="Live Monsoon & Flood Alerts"
              className="md:col-span-2"
              Icon={CloudRain}
              badge="Weather Radar"
              badgeColor="bg-saffron-light text-saffron-dark border border-saffron/20"
              description="Combines live rainfall updates with citizen water-depth reports so you know which underpasses and streets are flooded before you step out."
              href="/live-map"
              cta="Check Flood Zones"
              background={
                <img
                  src={waterloggingImg}
                  alt="Monsoon Waterlogging Alert"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              }
            />

            <BentoCard
              name="No Duplicate Spam"
              className="md:col-span-1"
              Icon={ShieldCheck}
              badge="Smart Grouping"
              badgeColor="bg-slate-100 text-slate-700 border border-slate-200"
              description="If multiple people report the same pothole within 80 meters, Nav Bharat merges them and boosts the priority automatically."
              href="/community"
              cta="See Community Feed"
              background={
                <img
                  src={bentoDedupImg}
                  alt="Duplicate Grouping"
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              }
            />

            <BentoCard
              name="Municipal Action & Photo Proof"
              className="md:col-span-2"
              Icon={Building2}
              badge="Official Portal"
              badgeColor="bg-blue-100 text-primary border border-primary/20"
              description="Reports route directly to the right ward department with clear deadlines. Repairs are only marked complete once after-repair photo proof is uploaded."
              href="/government/login"
              cta="Open Municipal Portal"
              background={
                <img
                  src={bentoGovImg}
                  alt="Municipal Command Center"
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              }
            />
          </BentoGrid>

        </div>
      </section>

      {/* 2.5 ANIMATED NAV BHARAT REAL HAZARD DATASET SHOWCASE */}
      <DatasetShowcase />

      {/* 3. INTERACTIVE LIVE MAP PREVIEW */}
      <section id="map-preview" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-5 space-y-6">
              <Badge variant="default" className="px-3 py-1 font-bold">
                Live City Map
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                See What&apos;s Happening on Your Streets Right Now
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Color-coded pins make the map easy to read at a glance: <strong className="text-rose-600">Red</strong> for high risk, <strong className="text-amber-600">Orange</strong> for moderate, <strong className="text-emerald-600">Green</strong> for fixed, and <strong className="text-primary">Blue</strong> for normal updates. Tap any pin to inspect details.
              </p>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <Link
                  to="/live-map"
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:shadow-soft transition-all flex items-center space-x-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Full Live Map</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Filter &amp; search</div>
                  </div>
                </Link>

                <Link
                  to="/safe-routes"
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-saffron hover:shadow-soft transition-all flex items-center space-x-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-saffron-light text-saffron flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Safe Routes</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Avoid hazards</div>
                  </div>
                </Link>

                <Link
                  to="/community"
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-soft transition-all flex items-center space-x-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Community</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Verify &amp; upvote</div>
                  </div>
                </Link>

                <Link
                  to="/government/login"
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:shadow-soft transition-all flex items-center space-x-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Gov Portal</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Officer tools</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Map Preview Container */}
            <div className="lg:col-span-7">
              <div className="relative bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-soft-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3.5 px-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                    <span className="font-bold text-slate-800 dark:text-white">Interactive Hazard Map</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {loading ? 'Syncing...' : error ? 'Offline' : `${reports.length} Active Records`}
                  </span>
                </div>

                <div className="h-[380px] w-full rounded-2xl overflow-hidden relative">
                  {loading ? (
                    <div className="w-full h-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-xs text-slate-500 space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading live city map...</span>
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

                {previewReport && (
                  <div className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-400 font-bold flex-shrink-0">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 dark:text-white truncate">{previewReport.title}</span>
                          {isUnverifiedPreview && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                              Unverified
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                          {previewReport.trackingId} • Risk {previewReport.riskScore}/100 • Status: {previewReport.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <Link to="/live-map" className="text-primary dark:text-blue-400 font-bold hover:underline flex-shrink-0">
                      Inspect &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3.2 LIVE INCIDENT REEL */}
      <HorizontalIncidentScroll
        reports={reports}
        onSelectReport={(report) => {
          setSelectedReport(report);
          const el = document.getElementById('map-preview');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3.5 LIVE MONSOON & DOPPLER RADAR HUB */}
      <div id="weather">
        <WeatherRadarHub />
      </div>

      {/* 4. HOW IT WORKS IN 5 SIMPLE STEPS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge variant="indiaGreen" className="px-3 py-1 font-bold">
              Simple 5-Step Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              From Your Phone to a Fixed Street
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Here is how every report moves cleanly from submission to verified repair.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 text-center">
            {[
              { step: '1', title: 'Snap & Pin', desc: 'Take a photo or video and confirm your GPS pin. Your identity stays private.', color: 'bg-primary' },
              { step: '2', title: 'AI Check', desc: 'Our AI checks the hazard type, estimates severity, and merges duplicates.', color: 'bg-saffron' },
              { step: '3', title: 'Sent to Ward', desc: 'The report is automatically routed to the responsible local municipal team.', color: 'bg-blue-600' },
              { step: '4', title: 'Repair & Proof', desc: 'Field crew fixes the issue and uploads an after-repair photo.', color: 'bg-indigo-600' },
              { step: '5', title: 'You Verify', desc: 'Nearby citizens confirm the repair and the map pin turns green.', color: 'bg-indiaGreen' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-soft-md transition-all"
              >
                <div className={`w-11 h-11 rounded-2xl ${item.color} text-white font-black text-base flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                  {item.step}
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4.5 COMMUNITY USE CASES */}
      <div id="reviews">
        <CitizenReviews />
      </div>

      {/* 5. OFFICIAL 5-MEMBER TEAM SPOTLIGHT */}
      <TeamSection />

      {/* 5.5 FREQUENTLY ASKED QUESTIONS & AI ROADMAP */}
      <FAQSection />

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-navy to-slate-900 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <Badge variant="saffron" className="px-3.5 py-1 font-bold">
            Take Action in 30 Seconds
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Help Make Your Neighborhood Safer Today
          </h2>

          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report a road hazard anonymously, check flood zones before leaving home, or explore your area&apos;s live safety map.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-saffron to-amber-500 hover:brightness-105 text-white text-sm font-bold rounded-2xl shadow-lg shadow-saffron/30 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center space-x-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>Report a Hazard Now</span>
            </Link>

            <Link
              to="/live-map"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold rounded-2xl backdrop-blur-md transition-all hover:-translate-y-0.5"
            >
              Open Live City Map
            </Link>

            <Link
              to="/government/login"
              className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-sm font-semibold rounded-2xl transition-all"
            >
              Municipal Officer Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
