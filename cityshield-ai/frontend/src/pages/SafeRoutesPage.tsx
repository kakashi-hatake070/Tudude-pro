import React, { useState, useEffect } from 'react';
import {
  Navigation,
  AlertTriangle,
  Car,
  Bike,
  Footprints,
  ArrowRight,
  Locate,
  MapPin,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import { SafeRouteResponse } from '../types';
import { getLiveCurrentPosition, searchPlaces, PlaceSuggestion } from '../services/geocoding';

export const SafeRoutesPage: React.FC = () => {
  const presetCorridors = [
    {
      city: 'Delhi NCR',
      label: 'Connaught Place to Sector 18 Noida',
      origin: [77.2167, 28.6315] as [number, number],
      destination: [77.3260, 28.5708] as [number, number]
    },
    {
      city: 'Mumbai',
      label: 'Bandra West to Nariman Point',
      origin: [72.8333, 19.0596] as [number, number],
      destination: [72.8223, 18.9256] as [number, number]
    },
    {
      city: 'Bengaluru',
      label: 'Silk Board to Indiranagar (Monsoon Corridor)',
      origin: [77.6234, 12.9175] as [number, number],
      destination: [77.6402, 12.9698] as [number, number]
    }
  ];

  const [originInput, setOriginInput] = useState('Detecting current location...');
  const [destInput, setDestInput] = useState('Sector 18, Noida');
  const [originCoords, setOriginCoords] = useState<[number, number]>([77.2167, 28.6315]);
  const [destCoords, setDestCoords] = useState<[number, number]>([77.3260, 28.5708]);

  const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searchingOrigin, setSearchingOrigin] = useState(false);
  const [searchingDest, setSearchingDest] = useState(false);

  const [travelMode, setTravelMode] = useState<'driving' | 'two-wheeler' | 'walking'>('driving');
  const [riskPreference, setRiskPreference] = useState<'lowest_risk' | 'fastest'>('lowest_risk');
  const [loading, setLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [routePlan, setRoutePlan] = useState<SafeRouteResponse | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  useEffect(() => {
    detectUserGPS();
  }, []);

  const detectUserGPS = async () => {
    setLocatingUser(true);
    try {
      const pos = await getLiveCurrentPosition();
      setOriginCoords(pos.coords);
      setOriginInput(`📍 Current: ${pos.address.split(',')[0]} (${pos.city})`);
      const dCoords: [number, number] = [pos.coords[0] + 0.035, pos.coords[1] + 0.025];
      setDestCoords(dCoords);
      setDestInput(`Destination Sector, ${pos.city}`);
      calculateCustomRoute(pos.coords, dCoords, travelMode, riskPreference);
    } catch (e) {
      setOriginInput('Connaught Place, New Delhi');
      calculateCustomRoute(originCoords, destCoords, travelMode, riskPreference);
    } finally {
      setLocatingUser(false);
    }
  };

  const calculateCustomRoute = async (
    o = originCoords,
    d = destCoords,
    mode: 'driving' | 'two-wheeler' | 'walking' = travelMode,
    pref: 'lowest_risk' | 'fastest' = riskPreference
  ) => {
    setLoading(true);
    setRouteError(null);
    try {
      const res = await api.planSafeRoute(
        o,
        d,
        mode === 'two-wheeler' ? 'driving' : mode,
        pref
      );
      setRoutePlan(res);
      setSelectedRouteIndex(0);
    } catch (e: any) {
      setRouteError(e.message || 'Unable to calculate safe routes right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleOriginSearch = async (val: string) => {
    setOriginInput(val);
    if (val.length >= 3) {
      setSearchingOrigin(true);
      const res = await searchPlaces(val);
      setOriginSuggestions(res);
      setSearchingOrigin(false);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestSearch = async (val: string) => {
    setDestInput(val);
    if (val.length >= 3) {
      setSearchingDest(true);
      const res = await searchPlaces(val);
      setDestSuggestions(res);
      setSearchingDest(false);
    } else {
      setDestSuggestions([]);
    }
  };

  const selectOrigin = (place: PlaceSuggestion) => {
    setOriginCoords(place.coords);
    setOriginInput(place.label.split(',')[0]);
    setOriginSuggestions([]);
    calculateCustomRoute(place.coords, destCoords, travelMode, riskPreference);
  };

  const selectDest = (place: PlaceSuggestion) => {
    setDestCoords(place.coords);
    setDestInput(place.label.split(',')[0]);
    setDestSuggestions([]);
    calculateCustomRoute(originCoords, place.coords, travelMode, riskPreference);
  };

  const activeRoute = routePlan?.routes[selectedRouteIndex];

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerBanner variant="independent" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>Real-Time Hazard Avoidance Routing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Safe Route Planner
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Enter your live location or any destination to evaluate road hazards, potholes, and water depth.
            </p>
          </div>

          {/* Travel Mode Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setTravelMode('driving');
                  calculateCustomRoute(originCoords, destCoords, 'driving', riskPreference);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  travelMode === 'driving' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Four-Wheeler</span>
              </button>
              <button
                onClick={() => {
                  setTravelMode('two-wheeler');
                  calculateCustomRoute(originCoords, destCoords, 'two-wheeler', riskPreference);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  travelMode === 'two-wheeler' ? 'bg-white text-secondary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Two-Wheeler</span>
              </button>
              <button
                onClick={() => {
                  setTravelMode('walking');
                  calculateCustomRoute(originCoords, destCoords, 'walking', riskPreference);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  travelMode === 'walking' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Footprints className="w-4 h-4" />
                <span>Pedestrian</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Live Location Input & Route Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Search Inputs */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Custom Origin &amp; Destination</h3>
                <button
                  onClick={detectUserGPS}
                  disabled={locatingUser}
                  className="text-xs text-primary font-bold hover:underline flex items-center space-x-1"
                >
                  <Locate className="w-3.5 h-3.5" />
                  <span>{locatingUser ? 'Locating...' : 'Use My GPS'}</span>
                </button>
              </div>

              {/* Origin Input */}
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Starting Point (Origin)
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 flex-shrink-0"></span>
                  <input
                    type="text"
                    value={originInput}
                    onChange={(e) => handleOriginSearch(e.target.value)}
                    placeholder="Type starting street, locality or landmark..."
                    className="w-full bg-transparent border-none text-slate-900 font-medium focus:outline-none"
                  />
                  {searchingOrigin && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />}
                </div>

                {originSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 max-h-48 overflow-y-auto z-30 divide-y divide-slate-100">
                    {originSuggestions.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => selectOrigin(p)}
                        className="w-full text-left p-2.5 hover:bg-slate-50 text-xs flex items-center space-x-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="line-clamp-1 text-slate-800">{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Destination
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 flex-shrink-0"></span>
                  <input
                    type="text"
                    value={destInput}
                    onChange={(e) => handleDestSearch(e.target.value)}
                    placeholder="Type destination address or area..."
                    className="w-full bg-transparent border-none text-slate-900 font-medium focus:outline-none"
                  />
                  {searchingDest && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />}
                </div>

                {destSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 max-h-48 overflow-y-auto z-30 divide-y divide-slate-100">
                    {destSuggestions.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => selectDest(p)}
                        className="w-full text-left p-2.5 hover:bg-slate-50 text-xs flex items-center space-x-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span className="line-clamp-1 text-slate-800">{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Risk Preference Toggle */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 font-semibold">Priority:</span>
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setRiskPreference('lowest_risk');
                      calculateCustomRoute(originCoords, destCoords, travelMode, 'lowest_risk');
                    }}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      riskPreference === 'lowest_risk' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Lowest Risk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRiskPreference('fastest');
                      calculateCustomRoute(originCoords, destCoords, travelMode, 'fastest');
                    }}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      riskPreference === 'fastest' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Balanced / Fastest
                  </button>
                </div>
              </div>

              <button
                onClick={() => calculateCustomRoute(originCoords, destCoords, travelMode, riskPreference)}
                disabled={loading}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                <span>{loading ? 'Calculating...' : 'Calculate Real-Time Route'}</span>
              </button>
            </div>

            {/* Error State */}
            {routeError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{routeError}</span>
                </div>
                <button
                  onClick={() => calculateCustomRoute()}
                  className="font-bold text-rose-700 hover:underline flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Quick Metro Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Or Quick Test Major Corridors
              </span>
              <div className="grid grid-cols-1 gap-2">
                {presetCorridors.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => {
                      setOriginCoords(c.origin);
                      setDestCoords(c.destination);
                      setOriginInput(c.label.split('to')[0].trim());
                      setDestInput(c.label.split('to')[1].trim());
                      calculateCustomRoute(c.origin, c.destination, travelMode, riskPreference);
                    }}
                    className="text-left p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between font-medium text-slate-800 shadow-xs"
                  >
                    <div>
                      <span className="font-bold text-primary block text-[11px] uppercase">{c.city}</span>
                      <span>{c.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Route Comparison Cards */}
            {routePlan && routePlan.routes.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Evaluated Routes ({routePlan.routes.length})
                </h3>

                {routePlan.routes.map((route, idx) => {
                  const isSelected = selectedRouteIndex === idx;
                  const isRecommended = route.routeId === routePlan.recommendedRouteId;

                  return (
                    <div
                      key={route.routeId}
                      onClick={() => setSelectedRouteIndex(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20 bg-white shadow-soft-md'
                          : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{route.label}</span>
                          {isRecommended && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                              Safest Option
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          route.riskLevel === 'Low Risk'
                            ? 'bg-emerald-50 text-emerald-700'
                            : route.riskLevel === 'Moderate Risk'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {route.riskLevel} ({route.riskScore}/100)
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-slate-100 text-slate-600">
                        <div>
                          <span className="text-[10px] text-text-muted block">Distance</span>
                          <strong className="text-slate-900">{route.distanceKm} km</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block">Est. Time</span>
                          <strong className="text-slate-900">{route.estimatedMinutes} mins</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block">Hazards in 120m</span>
                          <strong className={route.hazardCount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                            {route.hazardCount} spot(s)
                          </strong>
                        </div>
                      </div>

                      {route.warnings.length > 0 && (
                        <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg flex items-start space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{route.warnings[0]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : !loading && !routeError ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-text-muted">
                Enter an origin and destination to evaluate safe routes.
              </div>
            ) : null}

          </div>

          {/* Right Column: Interactive Map Visualization */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-soft h-[450px] sm:h-[550px] relative">
              {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-30 flex flex-col items-center justify-center text-xs text-primary font-bold space-y-2 rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Evaluating route hazards...</span>
                </div>
              )}
              {activeRoute ? (
                <MapComponent
                  routeGeometry={activeRoute.geometry}
                  center={originCoords}
                  zoom={13}
                  userLocation={originCoords}
                  showSearchBar={true}
                  showLocateButton={true}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                  {routeError ? 'Route preview unavailable.' : 'Calculating live route...'}
                </div>
              )}
            </div>

            {activeRoute && activeRoute.nearbyHazards.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft text-xs space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Detected Hazards along Corridor</span>
                  <span className="text-text-muted text-[11px]">{activeRoute.nearbyHazards.length} within 120m</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {activeRoute.nearbyHazards.map(h => (
                    <div key={h.trackingId} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{h.title}</span>
                        <div className="text-[11px] text-text-muted">
                          {h.category} • ~{h.distanceMeters}m from road path
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Risk {h.riskScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
