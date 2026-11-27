import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  MapPin,
  Droplets,
  CloudRain,
  AlertTriangle,
  Building2,
  PhoneCall,
  CheckCircle,
  Clock,
  Sparkles,
  Locate,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { MapComponent } from '../components/MapComponent';
import { CategoryBadge, StatusBadge, RiskBadge } from '../components/HazardBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { getLiveCurrentPosition, searchPlaces, PlaceSuggestion } from '../services/geocoding';

export const ExplorePage: React.FC = () => {
  const [locality, setLocality] = useState('My Current Location');
  const [coords, setCoords] = useState<[number, number]>([77.2167, 28.6315]);
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  // Search places
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setLocatingUser(true);
    try {
      const pos = await getLiveCurrentPosition();
      setCoords(pos.coords);
      setLocality(`${pos.address.split(',')[0]} (${pos.city})`);
      fetchIntel(pos.coords[0], pos.coords[1], pos.city);
    } catch (e) {
      setLocality('Central Sector');
      fetchIntel(coords[0], coords[1], 'Central Sector');
    } finally {
      setLocatingUser(false);
    }
  };

  const fetchIntel = async (lng = coords[0], lat = coords[1], loc = locality) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAreaIntelligence(lng, lat, loc, 4);
      setIntel(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to load area intelligence.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length >= 3) {
      const res = await searchPlaces(val);
      setSuggestions(res);
    } else {
      setSuggestions([]);
    }
  };

  const selectPlace = (place: PlaceSuggestion) => {
    setCoords(place.coords);
    setLocality(place.label.split(',')[0]);
    setSearchQuery('');
    setSuggestions([]);
    fetchIntel(place.coords[0], place.coords[1], place.label.split(',')[0]);
  };

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerBanner variant="independent" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Real-Time Location & Sector Safety Index</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore Your Locality
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Live civic reports, rainfall index, and nearest emergency response facilities for your area.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={detectLocation}
              disabled={locatingUser}
              className="flex items-center space-x-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover shadow-xs transition-all"
            >
              {locatingUser ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Locate className="w-3.5 h-3.5" />}
              <span>Detect My GPS</span>
            </button>
          </div>
        </div>

        {/* Search Bar for Any City */}
        <div className="max-w-7xl mx-auto mt-4 relative">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search any locality, city or sector in India (e.g. Noida, Delhi, Mumbai, Jaipur)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent border-none text-xs text-slate-900 focus:outline-none font-medium"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 max-w-lg w-full bg-white rounded-xl shadow-xl border border-slate-200 divide-y divide-slate-100 z-30 max-h-56 overflow-y-auto">
              {suggestions.map((p, i) => (
                <button
                  key={i}
                  onClick={() => selectPlace(p)}
                  className="w-full text-left p-2.5 hover:bg-slate-50 text-xs flex items-center space-x-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="line-clamp-1 text-slate-800">{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loading && !intel ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-text-muted space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            <span>Loading locality intelligence...</span>
          </div>
        ) : error ? (
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => fetchIntel()} className="font-bold text-rose-700 hover:underline">
              Retry
            </button>
          </div>
        ) : intel ? (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] text-text-muted block font-medium">Area Safety Index</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">{intel.areaRiskScore}/100</span>
                  <span className={`text-xs font-bold ${
                    intel.areaRiskScore > 65 ? 'text-rose-600' : (intel.areaRiskScore > 35 ? 'text-amber-600' : 'text-emerald-600')
                  }`}>
                    {intel.riskLevel}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] text-text-muted block font-medium">Monsoon Rainfall</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-primary">{intel.weather?.rainfallMmPerHour || 0} mm/h</span>
                  <span className="text-xs font-bold text-amber-600 uppercase">{intel.weather?.warningLevel} Alert</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] text-text-muted block font-medium">Active Waterlogged Points</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-blue-700">{intel.statistics.waterloggingCount}</span>
                  <span className="text-xs text-text-muted">points</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-[11px] text-text-muted block font-medium">Potholes & Broken Roads</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-secondary">{intel.statistics.potholesCount}</span>
                  <span className="text-xs text-text-muted">flagged</span>
                </div>
              </div>
            </div>

            {/* Map and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Interactive Area Map */}
              <div className="lg:col-span-7 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft h-[500px]">
                <MapComponent
                  reports={intel.nearbyReports}
                  hazardZones={intel.hazardZones}
                  center={coords}
                  userLocation={coords}
                  zoom={13.5}
                  showSearchBar={true}
                  showLocateButton={true}
                  className="w-full h-full"
                />
              </div>

              {/* Right Column: Emergency Facilities & Historical Layers */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Emergency Response Facilities */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>Nearest Emergency Response Units</span>
                  </h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {intel.emergencyFacilities.map((f: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{f.name}</div>
                          <div className="text-[11px] text-text-muted">{f.type} • ~{f.distanceMeters}m away</div>
                        </div>
                        <a
                          href={`tel:${f.phone.split('/')[0].trim()}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-mono font-bold text-[11px] flex items-center space-x-1"
                        >
                          <PhoneCall className="w-3 h-3 text-secondary" />
                          <span>{f.phone.split('/')[0].trim()}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weather Alert */}
                <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <CloudRain className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary">{intel.weather?.warningTitle || 'Weather Nowcast'}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {intel.weather?.warningDescription}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    Feed source: {intel.weather?.source}
                  </div>
                </div>

              </div>

            </div>
          </>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-text-muted">
            No locality data available. Try searching another city or area.
          </div>
        )}

      </div>
    </div>
  );
};
