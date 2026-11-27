import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Droplets,
  Trash2,
  LightbulbOff,
  PawPrint,
  Building,
  ArrowUpRight,
  ScanLine
} from 'lucide-react';
import { Badge } from './Badge';

interface DatasetSample {
  id: string;
  title: string;
  category: 'Roads & Potholes' | 'Flooding' | 'Garbage' | 'Streetlights' | 'Public Toilets' | 'Stray Animals';
  image: string;
  aiLabel: string;
  confidence: number;
  riskScore: number;
  department: string;
  summary: string;
}

export const DatasetShowcase: React.FC = () => {
  const [activeCat, setActiveCat] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const samples: DatasetSample[] = [
    {
      id: 'road-1',
      title: 'Pothole-Riddled Commuter Street',
      category: 'Roads & Potholes',
      image: '/assets/dataset/road-tuktuk.png',
      aiLabel: 'Severe Pothole Cluster',
      confidence: 95,
      riskScore: 86,
      department: 'Roads & Infrastructure',
      summary: 'Deep multi-lane craters slowing auto-rickshaws and endangering two-wheelers.'
    },
    {
      id: 'flood-1',
      title: 'Monsoon Underpass Waterlogging',
      category: 'Flooding',
      image: '/assets/dataset/flood-1.png',
      aiLabel: 'Deep Waterlogging (30cm+)',
      confidence: 96,
      riskScore: 92,
      department: 'Stormwater Drainage',
      summary: 'High-depth flood zone flagged for Safe Route diversion and pump dispatch.'
    },
    {
      id: 'garbage-1',
      title: 'Overflowing Roadside Dumpsters',
      category: 'Garbage',
      image: '/assets/dataset/garbage-1.png',
      aiLabel: 'Solid Waste Overflow',
      confidence: 93,
      riskScore: 78,
      department: 'Solid Waste & Smart QR',
      summary: 'Overflowing street bins routed to the garbage truck shortest TSP loop.'
    },
    {
      id: 'light-1',
      title: 'Unlit Nighttime Roadside Stretch',
      category: 'Streetlights',
      image: '/assets/dataset/light-1.png',
      aiLabel: 'Dark Spot / Light Fault',
      confidence: 91,
      riskScore: 74,
      department: 'Street Lighting & Safety',
      summary: 'Zero-visibility pedestrian path flagged for urgent electrical repair.'
    },
    {
      id: 'toilet-1',
      title: 'Neglected Public Restroom',
      category: 'Public Toilets',
      image: '/assets/dataset/toilet-1.png',
      aiLabel: 'Sanitation & Leakage Alert',
      confidence: 90,
      riskScore: 68,
      department: 'Swachh Sanitation Wing',
      summary: 'Public toilet reported via 2-second QR scan for immediate maintenance.'
    },
    {
      id: 'animal-1',
      title: 'Stray Animals on Active Roadway',
      category: 'Stray Animals',
      image: '/assets/dataset/animal-1.png',
      aiLabel: 'Stray Animal Bio-Hazard',
      confidence: 92,
      riskScore: 76,
      department: 'Veterinary & Health Wing',
      summary: 'Routed to Municipal Veterinary & Traffic teams to prevent road collisions.'
    },
    {
      id: 'road-2',
      title: 'Two-Wheeler Skid Hazard Crater',
      category: 'Roads & Potholes',
      image: '/assets/dataset/road-bike.png',
      aiLabel: 'Deep Asphalt Crater',
      confidence: 94,
      riskScore: 84,
      department: 'Roads & Infrastructure',
      summary: 'Water-filled pothole hidden on a busy commuter stretch.'
    },
    {
      id: 'flood-2',
      title: 'Submerged Residential Street',
      category: 'Flooding',
      image: '/assets/dataset/flood-2.png',
      aiLabel: 'Flooded Corridor',
      confidence: 95,
      riskScore: 89,
      department: 'Stormwater Drainage',
      summary: 'Active waterlogging polygon synced with live weather alerts.'
    },
    {
      id: 'garbage-2',
      title: 'Wet Waste & Stray Cattle Hazard',
      category: 'Garbage',
      image: '/assets/dataset/garbage-2.png',
      aiLabel: 'Bio-Hazard Dump',
      confidence: 91,
      riskScore: 80,
      department: 'Solid Waste & Health',
      summary: 'Open garbage pile attracting stray animals during monsoon rain.'
    },
    {
      id: 'light-2',
      title: 'Blind Curve Nighttime Risk Zone',
      category: 'Streetlights',
      image: '/assets/dataset/light-3.png',
      aiLabel: 'Accident Blackspot',
      confidence: 89,
      riskScore: 82,
      department: 'Traffic & Electrical',
      summary: 'Unlit sharp bend flagged for floodlight & reflector installation.'
    },
    {
      id: 'toilet-2',
      title: 'Public Toilet Water Leakage',
      category: 'Public Toilets',
      image: '/assets/dataset/toilet-2.png',
      aiLabel: 'Plumbing & Hygiene Fault',
      confidence: 88,
      riskScore: 66,
      department: 'Swachh Sanitation Wing',
      summary: 'Leaking pipe and flooded entrance reported by citizens.'
    },
    {
      id: 'road-3',
      title: 'Nighttime Pothole Reflections',
      category: 'Roads & Potholes',
      image: '/assets/dataset/road-night.png',
      aiLabel: 'Night Hazard Crater',
      confidence: 92,
      riskScore: 85,
      department: 'Roads & Infrastructure',
      summary: 'Dangerous after-dark craters invisible to approaching headlights.'
    }
  ];

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Roads & Potholes', icon: AlertTriangle },
    { name: 'Flooding', icon: Droplets },
    { name: 'Garbage', icon: Trash2 },
    { name: 'Streetlights', icon: LightbulbOff },
    { name: 'Public Toilets', icon: Building },
    { name: 'Stray Animals', icon: PawPrint }
  ];

  const filtered = activeCat === 'All' ? samples : samples.filter((s) => s.category === activeCat);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((p) => (p !== null ? (p + 1) % filtered.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex((p) => (p !== null ? (p - 1 + filtered.length) % filtered.length : null));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filtered.length]);

  const activeSample = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <Badge variant="saffron" className="px-3.5 py-1 font-bold inline-flex items-center space-x-1.5">
            <ScanLine className="w-3.5 h-3.5" />
            <span>Nav Bharat AI Vision Dataset</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Real Indian City Problems Our{' '}
            <span className="bg-gradient-to-r from-saffron via-primary to-cyan-500 bg-clip-text text-transparent">
              AI Detects Instantly
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Hover over any scene to preview the live AI vision scan, or tap a photo to inspect severity and department routing.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCat === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCat(cat.name);
                  setLightboxIndex(null);
                }}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-blue-700 text-white shadow-md shadow-primary/25 scale-105'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Animated AI Vision Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightboxIndex(idx);
                }
              }}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
            >
              {/* Image + Animated AI Laser Scan Overlay */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Animated AI Scan Sweep Line on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_14px_rgba(34,211,238,0.9)] animate-scan-sweep" />
                  <div className="absolute inset-4 border border-cyan-400/70 rounded-xl">
                    <span className="absolute -top-2.5 left-2 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono text-[10px] font-black shadow">
                      {item.aiLabel} • {item.confidence}%
                    </span>
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/15">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black backdrop-blur-md ${
                      item.riskScore >= 80
                        ? 'bg-rose-500/90 text-white'
                        : 'bg-saffron/90 text-white'
                    }`}
                  >
                    Risk {item.riskScore}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                  <h3 className="text-sm font-bold leading-snug line-clamp-1">{item.title}</h3>
                  <Eye className="w-4 h-4 text-cyan-300 shrink-0 ml-2 opacity-80 group-hover:opacity-100" />
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="p-4 bg-white dark:bg-slate-900 flex-1 flex flex-col justify-between space-y-2.5">
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-primary dark:text-blue-400 truncate">
                    {item.department}
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {item.confidence}% AI
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full-Screen AI Inspection Lightbox */}
      {activeSample && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-950">
              <img
                src={activeSample.image}
                alt={activeSample.title}
                className="w-full max-h-[62vh] object-cover"
              />
              <button
                onClick={() => setLightboxIndex(null)}
                aria-label="Close preview"
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/75 text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/75 text-white hover:bg-slate-800 border border-white/15"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxIndex((lightboxIndex + 1) % filtered.length)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/75 text-white hover:bg-slate-800 border border-white/15"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/90 text-slate-950 font-mono text-xs font-black">
                <ScanLine className="w-3.5 h-3.5" />
                <span>{activeSample.aiLabel} • {activeSample.confidence}% Match</span>
              </div>
            </div>

            <div className="p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-saffron font-bold">
                  <span>{activeSample.category}</span>
                  <span>•</span>
                  <span>Routed to {activeSample.department}</span>
                </div>
                <h3 className="text-lg font-black">{activeSample.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{activeSample.summary}</p>
              </div>
              <Link
                to="/report"
                onClick={() => setLightboxIndex(null)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 shrink-0 shadow-lg"
              >
                <span>Report Similar Issue</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
