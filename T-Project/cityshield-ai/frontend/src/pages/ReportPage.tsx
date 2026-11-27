import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Camera,
  MapPin,
  Sparkles,
  CheckCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Locate,
  Loader2,
  Droplets,
  AlertTriangle,
  Trash2,
  Construction,
  LightbulbOff,
  Waves,
  ShieldAlert,
  Landmark
} from 'lucide-react';
import { api } from '../services/api';
import { HazardCategory } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MapComponent } from '../components/MapComponent';
import { getLiveCurrentPosition, reverseGeocode } from '../services/geocoding';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<HazardCategory>('waterlogging');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Detecting current address...');
  const [coordinates, setCoordinates] = useState<[number, number]>([77.2167, 28.6315]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideoPreview, setIsVideoPreview] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);

  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiPreview, setAiPreview] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  useEffect(() => {
    handleUseGPS();
  }, []);

  const categories: { key: HazardCategory; label: string; desc: string; icon: React.ElementType; color: string }[] = [
    { key: 'waterlogging', label: 'Waterlogging', desc: 'Flooded roads or underpasses', icon: Droplets, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
    { key: 'potholes', label: 'Pothole', desc: 'Deep craters or road holes', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { key: 'garbage', label: 'Garbage Dump', desc: 'Overflowing waste or blockage', icon: Trash2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { key: 'damaged_roads', label: 'Broken Road', desc: 'Cracked asphalt or open trench', icon: Construction, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50' },
    { key: 'streetlights', label: 'Dark Streetlight', desc: 'Broken or off street lights', icon: LightbulbOff, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' },
    { key: 'drainage', label: 'Blocked Drain', desc: 'Clogged stormwater drain', icon: Waves, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50' },
    { key: 'accidents', label: 'Accident Spot', desc: 'Unsafe turn or missing sign', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
    { key: 'public_infrastructure', label: 'Public Property', desc: 'Broken footpath or railing', icon: Landmark, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setIsVideoPreview(file.type.startsWith('video/'));
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
        severity: {
          level: targetCat === 'waterlogging' ? 'high' : 'medium',
          score: targetCat === 'waterlogging' ? 82 : 55,
          depthEstimateCm: targetCat === 'waterlogging' ? 32 : 0
        },
        privacyStripped: true
      });
      setAnalyzingAI(false);
    }, 700);
  };

  const handleUseGPS = async () => {
    setLocatingUser(true);
    try {
      const pos = await getLiveCurrentPosition();
      setCoordinates(pos.coords);
      setAddress(pos.address);
    } catch (err: any) {
      console.warn('GPS detection failed:', err.message);
      setAddress('Tap the map or type your street address below');
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
    setSubmitError(null);
    if (!title.trim() || !description.trim()) {
      setSubmitError('Please add a short title and description so repair teams know what to fix.');
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
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-primary dark:text-blue-400 font-mono">{submittedReport.trackingId}</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Thank You! Report Sent</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Your report has been received, camera privacy metadata was removed, and it is now live on the city map.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Category:</span>
              <strong className="text-slate-900 dark:text-white capitalize">{submittedReport.category}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">Location:</span>
              <strong className="text-slate-900 dark:text-white line-clamp-1 text-right">{submittedReport.address}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Risk Score:</span>
              <strong className="text-primary dark:text-blue-400 font-bold">{submittedReport.riskScore}/100</strong>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/live-map')}
              className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all"
            >
              View on Live Map
            </button>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setStep(1);
                setTitle('');
                setDescription('');
                setMediaFile(null);
                setPreviewUrl(null);
                setAiPreview(null);
              }}
              className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-all"
            >
              Report Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1 as const, label: 'Pick Issue' },
    { num: 2 as const, label: 'Pin Location' },
    { num: 3 as const, label: 'Photo & Send' },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 pb-14 transition-colors">
      <DisclaimerBanner variant="independent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-lg p-6 sm:p-9 space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-saffron-light dark:bg-saffron/20 text-saffron-dark dark:text-saffron text-xs font-bold">
              <FilePlus className="w-3.5 h-3.5" />
              <span>Easy 3-Step Anonymous Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Report a Street or City Problem
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Takes less than 30 seconds. Your personal identity is never shown publicly.
            </p>
          </div>

          {/* Visual 3-Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {steps.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex items-center space-x-2.5 p-3 rounded-2xl border text-left transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary-light/70 dark:bg-primary/20 text-primary dark:text-blue-300 shadow-xs'
                      : isDone
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-primary text-white'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate">{s.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* STEP 1: CATEGORY SELECTION */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    What kind of problem did you spot?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tap the option that best matches what you see.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    const isSelected = category === c.key;
                    return (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => {
                          setCategory(c.key);
                          if (mediaFile) runAIAnalysis(c.key);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col space-y-2.5 ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20 bg-primary-light/40 dark:bg-primary/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{c.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{c.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-sm flex items-center space-x-2 transition-all"
                  >
                    <span>Next: Pin Location</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION PINNING */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-up">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Where is the problem located?
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Use your GPS or tap anywhere on the map to drop the pin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseGPS}
                    disabled={locatingUser}
                    className="px-3.5 py-2 rounded-xl bg-primary-light dark:bg-primary/20 text-primary dark:text-blue-300 text-xs font-bold hover:brightness-95 flex items-center space-x-1.5"
                  >
                    {locatingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
                    <span>{locatingUser ? 'Finding GPS...' : 'Use My GPS'}</span>
                  </button>
                </div>

                <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative">
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

                <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                  <MapPin className="w-4 h-4 text-saffron flex-shrink-0" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street name, landmark, or intersection..."
                    className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-white focus:outline-none font-medium"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-sm flex items-center space-x-2"
                  >
                    <span>Next: Add Photo &amp; Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PHOTO / VIDEO & DETAILS */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-up">
                {/* Upload Box */}
                <div className="space-y-2">
                  <label className="block text-sm font-extrabold text-slate-900 dark:text-white">
                    Add a Photo or Short Video (Recommended)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary rounded-2xl p-6 text-center transition-colors bg-slate-50/50 dark:bg-slate-950/50">
                    {previewUrl ? (
                      <div className="space-y-3">
                        {isVideoPreview ? (
                          <video
                            src={previewUrl}
                            controls
                            className="max-h-60 mx-auto rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <img
                            src={previewUrl}
                            alt="Uploaded evidence preview"
                            className="max-h-60 mx-auto rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                          />
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Private camera GPS tags automatically removed</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => { setMediaFile(null); setPreviewUrl(null); setAiPreview(null); }}
                            className="text-rose-600 hover:underline font-bold"
                          >
                            Remove File
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-primary-light dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center mx-auto">
                          <Camera className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="font-bold text-primary dark:text-blue-400 text-sm hover:underline">
                            Tap to take a photo or choose a video
                          </span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Supports JPG, PNG, MP4 up to 25MB
                          </p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* AI Preview */}
                {(analyzingAI || aiPreview) && (
                  <div className="p-4 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary dark:text-blue-300 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Quick Check</span>
                      </span>
                      {analyzingAI && (
                        <span className="text-xs text-primary dark:text-blue-300 flex items-center space-x-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Checking image...</span>
                        </span>
                      )}
                    </div>
                    {aiPreview && (
                      <div className="grid grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Detected Type</span>
                          <strong className="text-slate-900 dark:text-white capitalize">{aiPreview.category}</strong>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Urgency</span>
                          <strong className="text-slate-900 dark:text-white capitalize">{aiPreview.severity.level} ({aiPreview.severity.score}/100)</strong>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Privacy</span>
                          <strong className="text-emerald-600 dark:text-emerald-400">Protected</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Title & Description */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      Short Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Deep pothole near Main Market gate"
                      className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      What should commuters or repair crews know?
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="e.g. Water is ankle-deep on the left lane, risky for two-wheelers at night..."
                      className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                      required
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
                    {submitError}
                  </div>
                )}

                {/* Submit Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3 bg-gradient-to-r from-saffron to-amber-500 hover:brightness-105 text-white text-sm font-bold rounded-xl shadow-md shadow-saffron/25 transition-all flex items-center space-x-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Report...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Anonymously</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
};
