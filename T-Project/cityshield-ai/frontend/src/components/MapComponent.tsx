import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { IssueReport, HazardZone } from '../types';
import { Locate, Search, MapPin, X, Loader2 } from 'lucide-react';
import { searchPlaces, reverseGeocode, PlaceSuggestion, getLiveCurrentPosition } from '../services/geocoding';

interface MapComponentProps {
  reports?: IssueReport[];
  hazardZones?: HazardZone[];
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  interactive?: boolean;
  onMarkerClick?: (report: IssueReport) => void;
  onMapClick?: (coords: [number, number]) => void;
  onLocationSelect?: (coords: [number, number], address?: string) => void;
  selectedReportId?: string;
  routeGeometry?: any; // GeoJSON LineString
  showFloodLayers?: boolean;
  heatmapEnabled?: boolean;
  showSearchBar?: boolean;
  showLocateButton?: boolean;
  showLegend?: boolean;
  userLocation?: [number, number] | null;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  reports = [],
  hazardZones = [],
  center = [77.6200, 12.9400],
  zoom = 13,
  interactive = true,
  onMarkerClick,
  onMapClick,
  onLocationSelect,
  selectedReportId,
  routeGeometry,
  showFloodLayers = true,
  heatmapEnabled = false,
  showSearchBar = true,
  showLocateButton = true,
  showLegend = true,
  userLocation = null,
  className = 'w-full h-full min-h-[450px]'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker[]>([]);
  const customPinMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  // Watch global dark/light mode changes
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selectedAddressLabel, setSelectedAddressLabel] = useState<string | null>(null);

  const buildTileStyle = (dark: boolean): maplibregl.StyleSpecification => ({
    version: 8,
    sources: {
      basemap: {
        type: 'raster',
        tiles: dark
          ? [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ]
          : ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: dark
          ? '&copy; OpenStreetMap &copy; CARTO'
          : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
      }
    },
    layers: [
      {
        id: 'basemap-tiles',
        type: 'raster',
        source: 'basemap',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  });

  // Initialize Map with MapLibre GL JS & Light/Dark Tiles
  useEffect(() => {
    if (!mapContainer.current) return;

    const customStyleUrl = import.meta.env.VITE_MAPLIBRE_STYLE;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: customStyleUrl || buildTileStyle(document.documentElement.classList.contains('dark')),
      center,
      zoom,
      interactive,
      attributionControl: { compact: true }
    });

    // Navigation and Scale
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    // Built-in Geolocate Control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserLocation: true
    });
    map.addControl(geolocate, 'top-right');

    geolocate.on('geolocate', (e: any) => {
      const coords: [number, number] = [e.coords.longitude, e.coords.latitude];
      if (onLocationSelect) onLocationSelect(coords, 'My Live Current Location');
    });

    map.on('load', () => {
      setMapLoaded(true);
      if (routeGeometry) {
        addRouteLayer(map, routeGeometry);
      }
      if (hazardZones.length > 0 && showFloodLayers) {
        addHazardZonesLayer(map, hazardZones);
      }
    });

    // Map Click Listener
    map.on('click', async (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      
      // Place a custom pin on click
      if (customPinMarkerRef.current) {
        customPinMarkerRef.current.remove();
      }

      const pinEl = document.createElement('div');
      pinEl.className = 'w-6 h-6 rounded-full bg-secondary border-2 border-white shadow-lg flex items-center justify-center text-white';
      pinEl.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>`;

      customPinMarkerRef.current = new maplibregl.Marker({ element: pinEl })
        .setLngLat(coords)
        .addTo(map);

      if (onMapClick) onMapClick(coords);

      try {
        const addr = await reverseGeocode(coords[0], coords[1]);
        setSelectedAddressLabel(addr.address);
        if (onLocationSelect) onLocationSelect(coords, addr.address);
      } catch (err) {}
    });

    mapRef.current = map;

    return () => {
      setMapLoaded(false);
      markersRef.current.forEach(m => m.remove());
      userMarkerRef.current.forEach(m => m.remove());
      if (customPinMarkerRef.current) customPinMarkerRef.current.remove();
      map.remove();
    };
  }, []);

  // Switch map tiles live when dark/light theme changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const customStyleUrl = import.meta.env.VITE_MAPLIBRE_STYLE;
    if (customStyleUrl) return;
    const map = mapRef.current;
    map.setStyle(buildTileStyle(isDark));
    map.once('styledata', () => {
      if (routeGeometry) addRouteLayer(map, routeGeometry);
      if (hazardZones.length > 0 && showFloodLayers) addHazardZonesLayer(map, hazardZones);
    });
  }, [isDark]);

  // Update hazard zones dynamically when loaded asynchronously
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    if (hazardZones.length > 0 && showFloodLayers) {
      addHazardZonesLayer(mapRef.current, hazardZones);
    } else if (mapRef.current.getSource('hazard-zones-source')) {
      if (mapRef.current.getLayer('hazard-zones-fill')) mapRef.current.removeLayer('hazard-zones-fill');
      if (mapRef.current.getLayer('hazard-zones-line')) mapRef.current.removeLayer('hazard-zones-line');
      mapRef.current.removeSource('hazard-zones-source');
    }
  }, [hazardZones, showFloodLayers, mapLoaded]);

  // Update center when center prop changes
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.flyTo({ center, duration: 1200, essential: true });
    }
  }, [center[0], center[1]]);

  // User live location pulsing marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    userMarkerRef.current.forEach(m => m.remove());
    userMarkerRef.current = [];

    const userEl = document.createElement('div');
    userEl.className = 'relative flex items-center justify-center cursor-pointer';
    userEl.innerHTML = `
      <div class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></div>
      <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
        <div class="w-2 h-2 rounded-full bg-white"></div>
      </div>
    `;

    const userPopup = new maplibregl.Popup({ offset: 15 })
      .setHTML(`<div class="p-2 text-xs font-sans font-bold text-slate-800">📍 You are here (Live GPS)</div>`);

    const marker = new maplibregl.Marker({ element: userEl })
      .setLngLat(userLocation)
      .setPopup(userPopup)
      .addTo(mapRef.current);

    userMarkerRef.current.push(marker);
  }, [userLocation]);

  // Update route line
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
    if (routeGeometry) {
      addRouteLayer(mapRef.current, routeGeometry);
    } else if (mapRef.current.getSource('route-source')) {
      if (mapRef.current.getLayer('route-line')) mapRef.current.removeLayer('route-line');
      if (mapRef.current.getLayer('route-line-casing')) mapRef.current.removeLayer('route-line-casing');
      mapRef.current.removeSource('route-source');
    }
  }, [routeGeometry]);

  // Update hazard report markers
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    reports.forEach((report) => {
      const coords = report.location?.coordinates || report.approximateLocation?.coordinates;
      if (!coords || coords.length !== 2) return;

      let markerColor = '#1769D2'; // Blue
      if (report.status === 'resolved') {
        markerColor = '#10B981'; // Green
      } else if (report.riskScore >= 70 || report.priority === 'critical') {
        markerColor = '#EF4444'; // Red
      } else if (report.riskScore >= 40 || report.priority === 'high') {
        markerColor = '#F28C28'; // Orange
      } else if (report.status === 'submitted' && report.upvotes === 0) {
        markerColor = '#64748B'; // Grey
      }

      const el = document.createElement('div');
      el.className = 'group cursor-pointer relative';
      const isSelected = selectedReportId === report.trackingId;

      el.innerHTML = `
        <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 transform hover:scale-125 ${isSelected ? 'ring-4 ring-offset-2 ring-primary scale-110' : ''}" style="background-color: ${markerColor}">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
              report.category === 'waterlogging'
                ? 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z'
                : report.category === 'potholes'
                ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                : 'M13 10V3L4 14h7v7l9-11h-7z'
            }"></path>
          </svg>
        </div>
      `;

      const popupHtml = `
        <div class="p-3 max-w-xs text-xs font-sans">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
            <span class="font-bold text-slate-900">${report.trackingId}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style="background: ${markerColor}20; color: ${markerColor}">
              ${report.status.replace('_', ' ')}
            </span>
          </div>
          <p class="font-semibold text-slate-800 text-sm mb-1">${report.title}</p>
          <p class="text-slate-500 mb-2 line-clamp-2">${report.description}</p>
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span>Risk Score: <strong class="text-slate-700">${report.riskScore}/100</strong></span>
            <span>Upvotes: <strong class="text-primary">${report.upvotes}</strong></span>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: true }).setHTML(popupHtml);

      const map = mapRef.current;
      if (!map) return;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        if (onMarkerClick) onMarkerClick(report);
      });

      markersRef.current.push(marker);
    });
  }, [reports, selectedReportId]);

  // Handle Search Input
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 3) {
      setSearching(true);
      const res = await searchPlaces(val);
      setSuggestions(res);
      setSearching(false);
    } else {
      setSuggestions([]);
    }
  };

  // Select Place Suggestion
  const handleSelectPlace = (place: PlaceSuggestion) => {
    setSearchQuery(place.label.split(',')[0]);
    setSuggestions([]);
    setSelectedAddressLabel(place.label);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: place.coords,
        zoom: 14.5,
        duration: 1500,
        essential: true
      });
    }

    if (onLocationSelect) {
      onLocationSelect(place.coords, place.label);
    }
  };

  // Locate User Automatically
  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const pos = await getLiveCurrentPosition();
      setSelectedAddressLabel(pos.address);
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: pos.coords,
          zoom: 15,
          duration: 1500,
          essential: true
        });
      }
      if (onLocationSelect) {
        onLocationSelect(pos.coords, pos.address);
      }
    } catch (err: any) {
      alert(err.message || 'Could not retrieve your current location.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-soft bg-slate-100 dark:bg-slate-950">
      <div ref={mapContainer} className={className} />

      {/* Floating Place / City Search Bar */}
      {showSearchBar && (
        <div className="absolute top-4 left-4 z-20 w-72 sm:w-84 max-w-[85vw]">
          <div className="relative">
            <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search any city or street (e.g. Delhi, Mumbai, Noida)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full text-xs bg-transparent border-none pl-2.5 pr-2 py-0.5 text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 font-medium"
              />
              {searching ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : searchQuery ? (
                <button onClick={() => { setSearchQuery(''); setSuggestions([]); }}>
                  <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white" />
                </button>
              ) : null}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 z-30">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPlace(s)}
                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs flex items-start space-x-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{s.label.split(',')[0]}</span>
                      <span className="text-[11px] text-text-muted dark:text-slate-400 line-clamp-1">{s.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Locate Me GPS Button */}
      {showLocateButton && (
        <div className="absolute top-4 right-14 z-10">
          <button
            onClick={handleLocateMe}
            disabled={locating}
            title="Detect My Live Current Location"
            className="flex items-center space-x-1.5 px-3 py-2 bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 text-primary dark:text-blue-400 text-xs font-bold rounded-xl shadow-md border border-slate-200 dark:border-slate-700 backdrop-blur-md transition-all active:scale-95"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary dark:text-blue-400" />
            ) : (
              <Locate className="w-4 h-4 text-primary dark:text-blue-400" />
            )}
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>
      )}

      {/* Selected Address Banner at Bottom */}
      {selectedAddressLabel && (
        <div className="absolute bottom-4 left-4 z-10 max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs text-slate-800 dark:text-slate-100 flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
          <span className="line-clamp-1 font-medium">{selectedAddressLabel}</span>
        </div>
      )}

      {/* Floating Legend */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs space-y-1.5 z-10 hidden sm:block">
          <div className="font-bold text-slate-800 dark:text-white text-[11px] uppercase tracking-wider mb-1">Hazard Legend</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-slate-600 dark:text-slate-300">High Risk (&gt;70)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-600 dark:text-slate-300">Moderate Risk (40-69)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-slate-600 dark:text-slate-300">Normal Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-300">Verified Resolved</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span className="text-slate-600 dark:text-slate-300">Unverified / Stale</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Add Route Line
function addRouteLayer(map: maplibregl.Map, routeGeo: any) {
  if (map.getSource('route-source')) {
    (map.getSource('route-source') as maplibregl.GeoJSONSource).setData(routeGeo);
    return;
  }

  map.addSource('route-source', {
    type: 'geojson',
    data: routeGeo
  });

  map.addLayer({
    id: 'route-line-casing',
    type: 'line',
    source: 'route-source',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#0E448A', 'line-width': 8, 'line-opacity': 0.6 }
  });

  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route-source',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#1769D2', 'line-width': 5 }
  });
}

// Helper: Add Hazard Zones
function addHazardZonesLayer(map: maplibregl.Map, zones: HazardZone[]) {
  if (map.getSource('hazard-zones-source')) return;

  const features = zones.map(z => ({
    type: 'Feature' as const,
    properties: { name: z.name, risk: z.riskLevel, type: z.type },
    geometry: z.geometry
  }));

  map.addSource('hazard-zones-source', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features }
  });

  map.addLayer({
    id: 'hazard-zones-fill',
    type: 'fill',
    source: 'hazard-zones-source',
    paint: {
      'fill-color': [
        'match',
        ['get', 'risk'],
        'extreme', '#EF4444',
        'high', '#F28C28',
        '#3B82F6'
      ],
      'fill-opacity': 0.22
    }
  });

  map.addLayer({
    id: 'hazard-zones-line',
    type: 'line',
    source: 'hazard-zones-source',
    paint: {
      'line-color': [
        'match',
        ['get', 'risk'],
        'extreme', '#DC2626',
        'high', '#D97706',
        '#2563EB'
      ],
      'line-width': 2,
      'line-dasharray': [2, 2]
    }
  });
}
