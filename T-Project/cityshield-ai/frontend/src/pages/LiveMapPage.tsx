import React, { useState, useEffect } from 'react';
import {
  ThumbsUp,
  ShieldCheck,
  AlertCircle,
  MapPin,
  RefreshCw,
  Loader2,
  Mail,
  AlertTriangle,
  CloudRain
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { CategoryBadge, StatusBadge } from '../components/HazardBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import { IssueReport, HazardZone } from '../types';
import { getLiveCurrentPosition } from '../services/geocoding';

export const LiveMapPage: React.FC = () => {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [isDemoWeather, setIsDemoWeather] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [upvoting, setUpvoting] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);

  // Live Location State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentLocationName, setCurrentLocationName] = useState<string>('Detecting live location...');
  const [locatingUser, setLocatingUser] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([77.6200, 12.9400]);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setLocatingUser(true);
    try {
      const pos = await getLiveCurrentPosition();
      setUserLocation(pos.coords);
      setCurrentLocationName(pos.address);
      setMapCenter(pos.coords);
    } catch (err: any) {
      console.warn('Auto location failed or denied, using defaults:', err.message);
      setCurrentLocationName('Central Sector (Click "Locate Me" or search any city/street)');
    } finally {
      setLocatingUser(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, weatherRes] = await Promise.all([
        api.getReports({
          category: selectedCategory,
          status: selectedStatus,
          priority: selectedPriority,
          limit: 100
        }),
        api.getWeatherAndHazards()
      ]);
      setReports(res.reports || []);
      setHazardZones(weatherRes.floodZones || []);
      if (weatherRes.weather) {
        setWeather(weatherRes.weather);
        setIsDemoWeather(Boolean(weatherRes.isDemoData ?? weatherRes.weather.isDemoData));
      }
    } catch (err: any) {
      console.error('Failed to load reports:', err);
      setError(err.message || 'Unable to fetch issue records from the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedCategory, selectedStatus, selectedPriority]);

  const handleMarkerClick = (report: IssueReport) => {
    setSelectedReport(report);
    setFeedback(null);
    const coords = report.location?.coordinates || report.approximateLocation?.coordinates;
    if (coords) setMapCenter(coords);
  };

  const handleLocationSelect = (coords: [number, number], address?: string) => {
    setMapCenter(coords);
    if (address) setCurrentLocationName(address);
    fetchReports();
  };

  const handleUpvote = async (trackingId: string) => {
    if (upvoting) return;
    setUpvoting(true);
    setFeedback(null);
    try {
      const res = await api.upvoteReport(trackingId);
      if (res.success) {
        setReports(prev => prev.map(r => r.trackingId === trackingId ? { ...r, upvotes: res.upvotes } : r));
        if (selectedReport && selectedReport.trackingId === trackingId) {
          setSelectedReport(prev => prev ? { ...prev, upvotes: res.upvotes } : null);
        }
        setFeedback({ type: 'success', text: 'Upvote recorded. Thank you for corroborating!' });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', text: e.message || 'Already upvoted or unable to upvote.' });
    } finally {
      setUpvoting(false);
    }
  };

  const handleVerify = async (trackingId: string) => {
    if (verifying) return;
    setVerifying(true);
    setFeedback(null);
    try {
      const res = await api.verifyReport(trackingId, 'confirmed', 'Corroborated by commuter on live map.');
      if (res.success) {
        setFeedback({ type: 'success', text: 'Community verification recorded (+5 Civic Points).' });
        fetchReports();
      }
    } catch (e: any) {
      setFeedback({ type: 'error', text: e.message || 'Could not verify report.' });
    } finally {
      setVerifying(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] bg-background">
      <DisclaimerBanner variant="independent" />

      {/* Top Filter & Live Location Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 z-20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Live Detected Location Pill */}
        <div className="flex items-center space-x-2 bg-blue-50/80 border border-blue-200 rounded-xl px-3 py-1.5 text-xs max-w-full">
          {locatingUser ? (
            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin flex-shrink-0" />
          ) : (
            <div className="relative flex items-center justify-center flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping absolute"></span>
              <span className="w-2 h-2 rounded-full bg-primary relative"></span>
            </div>
          )}
          <span className="font-bold text-slate-800 line-clamp-1 max-w-[180px] sm:max-w-xs md:max-w-md">
            📍 {currentLocationName}
          </span>
          <button
            onClick={detectLocation}
            title="Update Live Location"
            className="text-primary hover:underline font-bold text-[11px] ml-1 pl-2 border-l border-blue-200 flex-shrink-0"
          >
            Locate Me
          </button>
        </div>

        {/* Live Weather Telemetry Pill */}
        {weather && (
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <CloudRain className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="font-semibold text-slate-800">
              {weather.temperature}°C • {weather.rainfallMmPerHour} mm/h
            </span>
            <span className="text-text-muted hidden sm:inline">
              ({weather.humidity}% RH)
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              isDemoWeather ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isDemoWeather ? 'Demo' : 'Live'}
            </span>
          </div>
        )}

        {/* Hazard Category, Status & Priority Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by hazard category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Hazards</option>
            <option value="waterlogging">Waterlogging</option>
            <option value="potholes">Potholes</option>
            <option value="garbage">Garbage Hotspots</option>
            <option value="damaged_roads">Damaged Roads</option>
            <option value="streetlights">Dark Streetlights</option>
            <option value="drainage">Drainage &amp; Culverts</option>
            <option value="accidents">Accident Blackspots</option>
          </select>

          <select
            aria-label="Filter by report status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted (Unverified)</option>
            <option value="verified">Verified</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            aria-label="Filter by priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={fetchReports}
            className="p-1.5 text-slate-500 hover:text-primary rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Refresh map data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>

      </div>

      {/* Main Map & Drawer Area */}
      <div className="flex-1 relative overflow-hidden flex min-h-[520px]">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-slate-200 flex items-center space-x-2 text-xs font-bold text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Syncing live issue markers...</span>
          </div>
        )}

        {/* Error Banner */}
        {error && !loading && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-rose-50 px-4 py-2.5 rounded-xl shadow-md border border-rose-200 flex items-center space-x-3 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={fetchReports} className="font-bold text-rose-700 hover:underline">
              Retry
            </button>
          </div>
        )}

        {/* Empty State Banner */}
        {!loading && !error && reports.length === 0 && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md border border-slate-200 flex items-center space-x-3 text-xs text-slate-700">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>No issue records match the selected filters.</span>
            {(selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all') && (
              <button onClick={resetFilters} className="font-bold text-primary hover:underline">
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Full Interactive Map */}
        <div className="flex-1 h-full w-full">
          <MapComponent
            reports={reports}
            hazardZones={hazardZones}
            center={mapCenter}
            userLocation={userLocation}
            showSearchBar={true}
            showLocateButton={true}
            selectedReportId={selectedReport?.trackingId}
            onMarkerClick={handleMarkerClick}
            onLocationSelect={handleLocationSelect}
            className="w-full h-full min-h-[520px]"
          />
        </div>

        {/* Issue Detail Drawer / Panel */}
        {selectedReport && (
          <div className="absolute top-4 right-4 bottom-4 w-96 max-w-[92vw] bg-white/95 backdrop-blur-md rounded-2xl shadow-soft-lg border border-slate-200 z-30 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-700">{selectedReport.trackingId}</span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                aria-label="Close issue details"
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <CategoryBadge category={selectedReport.category} />
                  {selectedReport.status === 'submitted' && (selectedReport.upvotes || 0) === 0 && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Unverified Report
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                  {selectedReport.title}
                </h3>
                <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.media && selectedReport.media.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={
                      selectedReport.media[0].url.startsWith('http') || selectedReport.media[0].url.startsWith('/assets/')
                        ? selectedReport.media[0].url
                        : `${(import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '')}${selectedReport.media[0].url}`
                    }
                    alt="Hazard Evidence"
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Reported Location</span>
                </div>
                <p className="text-slate-600">{selectedReport.address}</p>
                <div className="text-[11px] text-text-muted font-mono pt-1">
                  Coordinates: {selectedReport.location.coordinates[1].toFixed(4)}° N, {selectedReport.location.coordinates[0].toFixed(4)}° E
                </div>
              </div>

              {selectedReport.aiAnalysis && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>AI Hazard Assessment</span>
                    </span>
                    <span className="text-[11px] font-semibold text-primary">
                      {Math.round((selectedReport.aiAnalysis.confidence || 0.85) * 100)}% Confidence
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Damage Level: </span>
                      <strong className="text-slate-800 capitalize">{selectedReport.aiAnalysis.severity?.level || 'Medium'}</strong>
                    </div>
                    {selectedReport.aiAnalysis.severity?.depthEstimateCm ? (
                      <div>
                        <span className="text-slate-500">Est. Water Depth: </span>
                        <strong className="text-primary">{selectedReport.aiAnalysis.severity.depthEstimateCm} cm</strong>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {selectedReport.status === 'resolved' && selectedReport.resolutionProof && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                  <span className="font-bold text-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Resolution Proof</span>
                  </span>
                  <p className="text-emerald-700">{selectedReport.resolutionProof.remarks}</p>
                </div>
              )}

              {feedback && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] font-semibold ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => handleUpvote(selectedReport.trackingId)}
                  disabled={upvoting}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-60"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                  <span>Upvote ({selectedReport.upvotes})</span>
                </button>

                <button
                  onClick={() => handleVerify(selectedReport.trackingId)}
                  disabled={verifying}
                  className="flex-1 py-2 px-3 bg-primary-light hover:bg-primary/20 text-primary rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-60"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Verify (+5 pts)</span>
                </button>
              </div>

              {/* Direct Email to Government Officer */}
              {(() => {
                const deptEmail = selectedReport.category === 'waterlogging'
                  ? 'drainage@cityshield.gov.in'
                  : selectedReport.category === 'garbage'
                  ? 'waste@cityshield.gov.in'
                  : selectedReport.category === 'streetlights'
                  ? 'lighting@cityshield.gov.in'
                  : 'roads@cityshield.gov.in';

                const mailSubject = encodeURIComponent(`[OFFICIAL CIVIC COMPLAINT] ${selectedReport.trackingId}: ${selectedReport.title}`);
                const mailBody = encodeURIComponent(
                  `Respected Municipal Officer,\n\nI am lodging an official escalation regarding civic hazard ${selectedReport.trackingId}.\n\n` +
                  `HAZARD: ${selectedReport.title}\n` +
                  `CATEGORY: ${selectedReport.category}\n` +
                  `LOCATION: ${selectedReport.address}\n` +
                  `COORDINATES: ${selectedReport.location.coordinates[1]} N, ${selectedReport.location.coordinates[0]} E\n` +
                  `SEVERITY RISK SCORE: ${selectedReport.riskScore}/100\n` +
                  `COMMUNITY UPVOTES: ${selectedReport.upvotes}\n\n` +
                  `DESCRIPTION:\n${selectedReport.description}\n\n` +
                  `We request immediate inspection and work order assignment.\n\nRegards,\nCitizen Reporter\nDispatched via CityShield AI`
                );

                return (
                  <a
                    href={`mailto:${deptEmail}?subject=${mailSubject}&body=${mailBody}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full mt-2.5 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
                  >
                    <Mail className="w-4 h-4 text-secondary" />
                    <span>Direct Email to Dept ({deptEmail})</span>
                  </a>
                );
              })()}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
