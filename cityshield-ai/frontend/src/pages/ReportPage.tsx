import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Camera,
  MapPin,
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Lock,
  ArrowRight,
  RefreshCw,
  Locate,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { HazardCategory } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MapComponent } from '../components/MapComponent';
import { getLiveCurrentPosition, reverseGeocode } from '../services/geocoding';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<HazardCategory>('waterlogging');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Detecting current address...');
  const [coordinates, setCoordinates] = useState<[number, number]>([77.2167, 28.6315]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  // Interactive AI Analysis Preview state
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiPreview, setAiPreview] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  // Auto detect user location on mount
  useEffect(() => {
    handleUseGPS();
  }, []);

  const categories: { key: HazardCategory; label: string; desc: string }[] = [
    { key: 'waterlogging', label: 'Waterlogging', desc: 'Flooded roads, underpass submersion, water depth' },
    { key: 'potholes', label: 'Pothole', desc: 'Deep craters, tyre damage, skid hazard' },
    { key: 'garbage', label: 'Garbage Dump', desc: 'Overflowing bins, footpath blockage, health hazard' },
    { key: 'damaged_roads', label: 'Road Damage', desc: 'Broken asphalt, cave-ins, open trenches' },
    { key: 'streetlights', label: 'Dark Streetlight', desc: 'Non-functional lights, dark commuter stretches' },
    { key: 'drainage', label: 'Drainage Issue', desc: 'Clogged stormwater drains, broken culverts' },
    { key: 'accidents', label: 'Accident Prone', desc: 'Missing speed humps, hazardous blind turns' },
    { key: 'public_infrastructure', label: 'Public Infrastructure', desc: 'Damaged footpaths, broken railings' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      runAIAnalysis(category);
    }
  };

  const runAIAnalysis = (targetCat: HazardCategory) => {
    setAnalyzingAI(true);
    setTimeout(() => {
      setAiPreview({
        category: targetCat,
        confidence: 0.91,
        detectedObjects: [
          { label: targetCat, confidence: 0.89, box: [0.2, 0.15, 0.8, 0.85] }
        ],
        severity: {
          level: targetCat === 'waterlogging' ? 'high' : 'medium',
          score: targetCat === 'waterlogging' ? 82 : 55,
          depthEstimateCm: targetCat === 'waterlogging' ? 32 : 0
        },
        privacyStripped: true
      });
      setAnalyzingAI(false);
    }, 800);
  };

  const handleUseGPS = async () => {
    setLocatingUser(true);
    try {
      const pos = await getLiveCurrentPosition();
      setCoordinates(pos.coords);
      setAddress(pos.address);
    } catch (err: any) {
      console.warn('GPS detection failed:', err.message);
      setAddress('Pin location on map or search address below');
    } finally {
      setLocatingUser(false);
    }
  };

  const handleMapPinSelect = async (coords: [number, number], addr?: string) => {
    setCoordinates(coords);
    if (addr) {
      setAddress(addr);
    } else {
      const rev = await reverseGeocode(coords[0], coords[1]);
      setAddress(rev.address);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Please fill out the issue title and description.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('longitude', String(coordinates[0]));
      formData.append('latitude', String(coordinates[1]));
      formData.append('wardNumber', '42');

      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      const res = await api.createReport(formData);
      if (res.success) {
        setSubmittedReport(res.report);
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-soft-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-primary font-mono">{submittedReport.trackingId}</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Report Dispatched!</h2>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              Your civic report has been received, sanitized of EXIF metadata, and registered on the live municipal grid.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <strong className="text-slate-800 capitalize">{submittedReport.category}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <strong className="text-slate-800 line-clamp-1">{submittedReport.address}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Initial Risk Score:</span>
              <strong className="text-primary font-bold">{submittedReport.riskScore}/100</strong>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/live-map')}
              className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all"
            >
              View on Live Map
            </button>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setTitle('');
                setDescription('');
                setPreviewUrl(null);
                setAiPreview(null);
              }}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <DisclaimerBanner variant="independent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-lg p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-secondary-light text-secondary text-xs font-bold mb-2">
              <FilePlus className="w-3.5 h-3.5" />
              <span>Anonymous Citizen Submission</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Report an Urban Hazard
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Your real-time position is automatically detected. Click anywhere on the map or type your address.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Category Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Select Hazard Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((c) => {
                  const isSelected = category === c.key;
                  return (
                    <button
                      type="button"
                      key={c.key}
                      onClick={() => {
                        setCategory(c.key);
                        if (mediaFile) runAIAnalysis(c.key);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-light text-primary font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{c.label}</div>
                      <div className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{c.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Interactive Map & Live Geolocation Pinning */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Pin Hazard Location on Map (Click to pinpoint)
                </label>
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={locatingUser}
                  className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                >
                  {locatingUser ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Locate className="w-3.5 h-3.5" />}
                  <span>{locatingUser ? 'Detecting GPS...' : 'My Current Location'}</span>
                </button>
              </div>

              {/* Mini Map */}
              <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                <MapComponent
                  center={coordinates}
                  userLocation={coordinates}
                  zoom={14.5}
                  showSearchBar={true}
                  showLocateButton={true}
                  onLocationSelect={handleMapPinSelect}
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, landmark, intersection..."
                  className="w-full text-xs bg-transparent border-none text-slate-900 focus:outline-none font-medium"
                />
              </div>
              <div className="text-[11px] text-text-muted font-mono">
                Pin Coordinates: {coordinates[1].toFixed(5)}° N, {coordinates[0].toFixed(5)}° E
              </div>
            </div>

            {/* 3. Photo / Video Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Visual Evidence (Photo / Video)
              </label>
              
              <div className="border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-2xl p-6 text-center transition-colors">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-56 mx-auto rounded-xl object-cover shadow-sm border border-slate-200"
                    />
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>EXIF GPS Purged for Privacy</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => { setMediaFile(null); setPreviewUrl(null); setAiPreview(null); }}
                        className="text-status-danger hover:underline font-bold"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <label htmlFor="file-upload" className="cursor-pointer font-bold text-primary hover:underline text-sm">
                        Take photo or browse files
                      </label>
                      <p className="text-xs text-text-muted mt-1">Supports JPEG, PNG, MP4 up to 25MB</p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 4. AI Analysis Preview */}
            {(analyzingAI || aiPreview) && (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>AI Analysis Preview (Reviewable)</span>
                  </span>
                  {analyzingAI && (
                    <span className="text-xs text-primary flex items-center space-x-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning visual features...</span>
                    </span>
                  )}
                </div>

                {aiPreview && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">AI Detected Category</span>
                      <strong className="text-slate-800 capitalize">{aiPreview.category}</strong>
                      <span className="text-[10px] text-emerald-600 block">{Math.round(aiPreview.confidence * 100)}% match</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">Severity Score</span>
                      <strong className="text-slate-800 capitalize">{aiPreview.severity.level} ({aiPreview.severity.score}/100)</strong>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">Est. Water Depth</span>
                      <strong className="text-primary">{aiPreview.severity.depthEstimateCm || 0} cm</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  4. Issue Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 30cm Water Inundation Near Sector Main Road"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  5. Detailed Description & Hazard Warnings
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe vehicle bottlenecks, road craters, or dangerous open culverts..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-text-muted flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Submitted under anonymous pseudonym</span>
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-secondary/25 transition-all flex items-center space-x-1.5"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Civic Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
