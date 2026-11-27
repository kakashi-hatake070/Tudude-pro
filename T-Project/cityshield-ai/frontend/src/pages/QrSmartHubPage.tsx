import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Navigation,
  Trash2,
  Lightbulb,
  CheckCircle2,
  Fuel,
  Route,
  Sliders,
  ExternalLink,
  Printer,
  Sparkles,
  RotateCcw,
  Truck,
  MapPin
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  SmartAsset,
  DEPOT_COORDS,
  DEFAULT_SMART_ASSETS,
  loadSmartAssets,
  saveSmartAssets,
  updateSmartAsset,
  subscribeSmartAssets,
  computeShortestTspOrder
} from '../data/smartAssets';
import { IssueReport } from '../types';

// Deterministic offline SVG QR-style matrix visual for asset stickers
const AssetQrSvg: React.FC<{ value: string; size?: number }> = ({ value, size = 144 }) => {
  const cells = 21;
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, cells - 7) || inBox(cells - 7, 0);
  };
  const finderFill = (r: number, c: number) => {
    const check = (br: number, bc: number) => {
      const dr = r - br;
      const dc = c - bc;
      if (dr < 0 || dr >= 7 || dc < 0 || dc >= 7) return false;
      if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
      return dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
    };
    return check(0, 0) || check(0, cells - 7) || check(cells - 7, 0);
  };

  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const rects: React.ReactNode[] = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      let filled = false;
      if (isFinder(r, c)) {
        filled = finderFill(r, c);
      } else {
        const bit = Math.imul(hash ^ (r * 31 + c * 17), 2654435761) >>> 0;
        filled = bit % 2 === 0;
      }
      if (filled) {
        rects.push(<rect key={`${r}-${c}`} x={c + 1} y={r + 1} width={1} height={1} rx={0.12} />);
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cells + 2} ${cells + 2}`}
      className="fill-slate-900 bg-white rounded-xl"
      role="img"
      aria-label={`QR Code for ${value}`}
    >
      {rects}
    </svg>
  );
};

export const QrSmartHubPage: React.FC = () => {
  const [assets, setAssets] = useState<SmartAsset[]>(() => loadSmartAssets());
  const [selectedAssetId, setSelectedAssetId] = useState<string>('BIN_101');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeSmartAssets((updated) => setAssets(updated));
    return unsub;
  }, []);

  const dustbins = useMemo(() => assets.filter((a) => a.type === 'dustbin'), [assets]);
  const urgentDustbins = useMemo(() => dustbins.filter((d) => d.fillLevel >= 80), [dustbins]);

  const { ordered: optimizedStops, totalKm: optimizedKm } = useMemo(
    () => computeShortestTspOrder(DEPOT_COORDS, urgentDustbins),
    [urgentDustbins]
  );

  const { totalKm: regularAllKm } = useMemo(
    () => computeShortestTspOrder(DEPOT_COORDS, dustbins),
    [dustbins]
  );

  const distanceSavedKm = Math.max(0, Number((regularAllKm - optimizedKm).toFixed(1)));
  const dieselSavedLiters = Number((distanceSavedKm / 3.5).toFixed(1));
  const moneySavedInr = Math.round(dieselSavedLiters * 90);

  const routeGeometry = useMemo(() => {
    if (optimizedStops.length === 0) return null;
    return {
      type: 'LineString',
      coordinates: [
        DEPOT_COORDS,
        ...optimizedStops.map((s) => s.coordinates),
        DEPOT_COORDS
      ]
    };
  }, [optimizedStops]);

  const mapMarkers: IssueReport[] = useMemo(() => {
    return assets.map((a) => ({
      _id: a.id,
      trackingId: a.id,
      title: `${a.name} (${a.type === 'dustbin' ? `${a.fillLevel}% Full` : a.status})`,
      description: `${a.area} • Assigned: ${a.assignedTo}`,
      category: a.type === 'dustbin' ? 'garbage' : a.type === 'streetlight' ? 'streetlights' : 'public_infrastructure',
      status: a.status === 'OK' ? 'resolved' : 'submitted',
      priority: a.status === 'OK' ? 'low' : 'critical',
      riskScore: a.type === 'dustbin' ? a.fillLevel : a.status === 'OK' ? 15 : 85,
      address: `${a.area}, ${a.ward}`,
      wardNumber: Number(a.ward.replace(/\D/g, '')) || 112,
      location: { type: 'Point', coordinates: a.coordinates },
      reporterAnonymousId: 'QR_Asset_Monitor',
      media: [],
      upvotes: a.status === 'OK' ? 2 : 12,
      createdAt: new Date().toISOString()
    }));
  }, [assets]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleSliderChange = (id: string, val: number) => {
    setAssets(updateSmartAsset(id, { fillLevel: val }));
  };

  const handleMarkCleaned = (asset: SmartAsset) => {
    setAssets(
      updateSmartAsset(asset.id, {
        fillLevel: 0,
        status: 'OK',
        lastCleaned: 'Just now (Verified)'
      })
    );
    setToast(`${asset.name} marked emptied (0%) — driver route recalculated!`);
    setTimeout(() => setToast(null), 3500);
  };

  const handleResetDemo = () => {
    saveSmartAssets(DEFAULT_SMART_ASSETS);
    setAssets(DEFAULT_SMART_ASSETS);
    setToast('Demo assets reset to default state.');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      <DisclaimerBanner variant="independent" />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-saffron-light dark:bg-saffron/20 border border-saffron/30 text-saffron-dark dark:text-saffron text-xs font-bold">
              <QrCode className="w-3.5 h-3.5" />
              <span>Zero-Login QR + Smart Truck Route Optimizer</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Smart QR Assets &amp; Shortest-Route Driver Map
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Scan any ₹10 QR sticker on a dustbin, streetlight, or public toilet to report in 2 seconds. Dustbins above <strong>80%</strong> automatically enter the garbage truck&apos;s shortest TSP route.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleResetDemo}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulator</span>
            </button>
            <Link
              to={`/scan/${selectedAsset.id}`}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-white text-xs font-bold shadow-md shadow-saffron/25 hover:brightness-105 inline-flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test 1-Tap Scan ({selectedAsset.id})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Toast */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-5 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center space-x-2 animate-fade-up">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Live Fuel & Distance Savings Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <span>PICKUPS NEEDED (80%+)</span>
              <Truck className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {urgentDustbins.length} <span className="text-sm font-semibold text-slate-400">/ {dustbins.length} bins</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {dustbins.length - urgentDustbins.length} empty/low bins skipped
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <span>OPTIMIZED ROUTE</span>
              <Route className="w-4 h-4 text-primary dark:text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-primary dark:text-blue-400">
              {optimizedKm} km
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Regular all-bin loop: {regularAllKm} km
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <span>DISTANCE SAVED</span>
              <Navigation className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {distanceSavedKm} km
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Shortest TSP dispatch order
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <span>EST. FUEL SAVED</span>
              <Fuel className="w-4 h-4 text-saffron" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-saffron">
              ₹{moneySavedInr}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              ~{dieselSavedLiters} L diesel saved per shift
            </p>
          </div>
        </div>

        {/* Main 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* Left Column: QR Sticker + Simulator */}
          <div className="lg:col-span-5 space-y-6">

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-saffron flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Asset QR Sticker Preview</span>
                </span>
                <button
                  onClick={() => window.print()}
                  className="text-xs font-bold text-primary dark:text-blue-400 hover:underline inline-flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sticker</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                  <AssetQrSvg value={`${selectedAsset.id}:${selectedAsset.area}`} size={136} />
                </div>
                <div className="space-y-2 text-center sm:text-left min-w-0">
                  <span className="inline-block font-mono text-xs font-black px-2 py-0.5 rounded bg-navy text-white">
                    {selectedAsset.id}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {selectedAsset.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedAsset.area} ({selectedAsset.ward})
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono break-all">
                    /scan/{selectedAsset.id}
                  </p>
                  <Link
                    to={`/scan/${selectedAsset.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary dark:text-blue-400 hover:underline pt-1"
                  >
                    <span>Open 2-Second Scan Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-primary dark:text-blue-400" />
                  <span>Live Fill-Level Simulator</span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Slide any dustbin past 80% to watch the truck route update live.
                </p>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {assets.map((asset) => {
                  const isSelected = asset.id === selectedAsset.id;
                  const isUrgent = asset.status !== 'OK';
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/15 bg-primary-light/30 dark:bg-primary/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isUrgent
                                ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'
                                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {asset.type === 'dustbin' ? (
                              <Trash2 className="w-4 h-4" />
                            ) : asset.type === 'streetlight' ? (
                              <Lightbulb className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {asset.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {asset.area} • {asset.id}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                            isUrgent
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {asset.type === 'dustbin' ? `${asset.fillLevel}%` : asset.status === 'OK' ? 'OK' : 'Alert'}
                        </span>
                      </div>

                      {asset.type === 'dustbin' && (
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={asset.fillLevel}
                            onChange={(e) => handleSliderChange(asset.id, Number(e.target.value))}
                            aria-label={`Fill level for ${asset.name}`}
                            className="flex-1 accent-saffron cursor-pointer"
                          />
                          {isUrgent && (
                            <button
                              onClick={() => handleMarkCleaned(asset)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shrink-0"
                            >
                              Mark Emptied
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Driver Shortest-Route Map */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Driver Shortest-Route Map (TSP Auto-Optimizer)</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Red = 80%+ Pickup • Green = Skipped
                </span>
              </div>

              <div className="h-[420px] sm:h-[460px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <MapComponent
                  reports={mapMarkers}
                  routeGeometry={routeGeometry}
                  center={DEPOT_COORDS}
                  zoom={12}
                  interactive={true}
                  showSearchBar={false}
                  showLocateButton={true}
                  showLegend={false}
                  selectedReportId={selectedAsset.id}
                  onMarkerClick={(r) => setSelectedAssetId(r.trackingId)}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Optimized Driver Stop Order ({optimizedStops.length} Active Stops)
                </h3>
                <span className="text-xs font-mono text-primary dark:text-blue-400 font-bold">
                  Depot → Stops → Depot
                </span>
              </div>

              {optimizedStops.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  All dustbins are below 80% — no truck dispatch needed right now! Slide any bin above 80% to trigger a live route.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {optimizedStops.map((stop, idx) => (
                    <div
                      key={stop.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {stop.name} — <span className="text-rose-600 dark:text-rose-400">{stop.fillLevel}% Full</span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {stop.area} • {stop.ward}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleMarkCleaned(stop)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors"
                      >
                        Mark Emptied ✓
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
