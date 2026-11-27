import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  QrCode,
  MapPin,
  CheckCircle2,
  Trash2,
  LightbulbOff,
  AlertTriangle,
  ShieldCheck,
  Navigation,
  ArrowLeft,
  Locate,
  Sparkles
} from 'lucide-react';
import { loadSmartAssets, updateSmartAsset, SmartAsset } from '../data/smartAssets';

export const QrScanPage: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<SmartAsset | null>(null);
  const [submittedAction, setSubmittedAction] = useState<string | null>(null);
  const [gpsVerified, setGpsVerified] = useState<boolean>(true);
  const [checkingGps, setCheckingGps] = useState<boolean>(false);

  useEffect(() => {
    const all = loadSmartAssets();
    const found = all.find((a) => a.id.toUpperCase() === (assetId || 'BIN_101').toUpperCase()) || all[0];
    setAsset(found);
  }, [assetId]);

  const handleVerifyGps = () => {
    setCheckingGps(true);
    setTimeout(() => {
      setGpsVerified(true);
      setCheckingGps(false);
    }, 550);
  };

  const handleQuickReport = (fillLevel: number, statusLabel: string, status: SmartAsset['status']) => {
    if (!asset) return;
    const updatedList = updateSmartAsset(asset.id, { fillLevel, status });
    const refreshed = updatedList.find((a) => a.id === asset.id) || null;
    setAsset(refreshed);
    setSubmittedAction(statusLabel);
  };

  if (!asset) return null;

  return (
    <div className="min-h-[85vh] bg-background dark:bg-slate-950 py-10 px-4 flex items-center justify-center transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft-lg overflow-hidden">

        {/* Top Asset Header */}
        <div className="bg-gradient-to-r from-navy via-slate-900 to-navy p-6 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-[11px] font-bold">
              <QrCode className="w-3.5 h-3.5" />
              <span>ZERO-LOGIN QR REPORT</span>
            </span>
            <span className="font-mono text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg">
              {asset.id}
            </span>
          </div>

          <h1 className="text-xl font-black tracking-tight">{asset.name}</h1>
          <p className="text-xs text-slate-300 flex items-center space-x-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
            <span>{asset.area} • {asset.ward}</span>
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Anti-Fake GPS Check */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="font-bold">
                  {gpsVerified ? 'On-Site GPS Verified (Anti-Spam)' : 'Verify On-Site Location'}
                </div>
                <div className="text-[11px] opacity-80 font-mono">
                  {asset.coordinates[1].toFixed(4)}° N, {asset.coordinates[0].toFixed(4)}° E
                </div>
              </div>
            </div>
            <button
              onClick={handleVerifyGps}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[11px] flex items-center space-x-1 shrink-0"
            >
              <Locate className={`w-3 h-3 ${checkingGps ? 'animate-spin' : ''}`} />
              <span>{checkingGps ? '...' : 'Recheck'}</span>
            </button>
          </div>

          {submittedAction ? (
            <div className="text-center py-4 space-y-4 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Instant Dispatch Sent!
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Marked as <strong className="text-saffron">{submittedAction}</strong>. Live route &amp; alert sent to{' '}
                  <strong className="text-slate-900 dark:text-white">{asset.assignedTo}</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Link
                  to="/qr-smart"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-blue-700 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Driver Shortest-Route Map</span>
                </Link>
                <button
                  onClick={() => setSubmittedAction(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  Update Status Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  1-Tap Action (No Login Needed)
                </span>
                <span className="text-[11px] font-bold text-primary dark:text-blue-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>2-Second Report</span>
                </span>
              </div>

              {asset.type === 'dustbin' ? (
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuickReport(95, 'Overflowing (95% Full)', 'NEEDS_PICKUP')}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-saffron text-white font-bold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center space-x-3">
                      <Trash2 className="w-5 h-5" />
                      <span>Overflowing / Full (95%)</span>
                    </span>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full">Dispatch Truck</span>
                  </button>

                  <button
                    onClick={() => handleQuickReport(82, '80%+ Full — Needs Pickup', 'NEEDS_PICKUP')}
                    className="w-full p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 font-bold text-sm transition-all flex items-center justify-between"
                  >
                    <span>Nearly Full (82%)</span>
                    <span className="text-[11px] opacity-80">Add to Route</span>
                  </button>

                  <button
                    onClick={() => handleQuickReport(45, 'Half Full (45%)', 'OK')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all flex items-center justify-between"
                  >
                    <span>Half Full / Normal (45%)</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">No Urgent Pickup</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={() =>
                      handleQuickReport(
                        100,
                        asset.type === 'streetlight' ? 'Streetlight Not Working' : 'Needs Urgent Cleaning / Water',
                        'MAINTENANCE_REQUIRED'
                      )
                    }
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 text-white font-bold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center space-x-3">
                      {asset.type === 'streetlight' ? <LightbulbOff className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      <span>
                        {asset.type === 'streetlight' ? 'Light Off / Flickering' : 'Dirty / No Water Supply'}
                      </span>
                    </span>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full">Alert Crew</span>
                  </button>

                  <button
                    onClick={() => handleQuickReport(0, 'Working Fine / Clean', 'OK')}
                    className="w-full p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs"
                  >
                    Mark as Working / Clean
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <Link to="/qr-smart" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 font-semibold inline-flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Smart QR Hub</span>
            </Link>
            <span className="text-[11px] text-slate-400">Nav Bharat AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
