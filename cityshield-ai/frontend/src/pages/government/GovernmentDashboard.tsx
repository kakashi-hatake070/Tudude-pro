import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  FileText,
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { StatusBadge, CategoryBadge, RiskBadge } from '../../components/HazardBadge';

export const GovernmentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [officer, setOfficer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawOfficer = localStorage.getItem('cs_officer');
    if (!rawOfficer) {
      navigate('/government/login');
      return;
    }
    setOfficer(JSON.parse(rawOfficer));

    api.getGovernmentStats().then(res => {
      setStats(res.stats);
    }).catch(e => {
      console.error(e);
      // If unauthorized, redirect to login
      if (e.message?.includes('credentials')) navigate('/government/login');
    }).finally(() => setLoading(false));
  }, []);

  if (!officer) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Officer Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-bold text-xl">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">{officer.role.replace('_', ' ')}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-mono">{officer.officialId}</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">{officer.name}</h1>
              <p className="text-xs text-slate-400 mt-1">{officer.jurisdictionName}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/government/reports"
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all"
            >
              Manage Complaints
            </Link>
            <Link
              to="/government/map"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
            >
              Command Map
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-[11px] text-text-muted block font-bold uppercase tracking-wider">Total Reports</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalReports}</div>
              <span className="text-xs text-primary font-semibold mt-1 block">City-wide cumulative</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-[11px] text-text-muted block font-bold uppercase tracking-wider">Pending Action</span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{stats.pendingReports}</div>
              <span className="text-xs text-amber-700 font-semibold mt-1 block">Awaiting resolution</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-[11px] text-text-muted block font-bold uppercase tracking-wider">High Risk Critical</span>
              <div className="text-3xl font-extrabold text-rose-600 mt-1">{stats.highRiskReports}</div>
              <span className="text-xs text-rose-700 font-semibold mt-1 block">Waterlogging & craters</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-[11px] text-text-muted block font-bold uppercase tracking-wider">Resolution Rate</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.resolutionPercentage}%</div>
              <span className="text-xs text-emerald-700 font-semibold mt-1 block">{stats.resolvedReports} completed</span>
            </div>
          </div>
        )}

        {/* Performance & Critical Reports */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Department SLAs */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">Department Performance & SLAs</h3>
                <Link to="/government/departments" className="text-xs font-bold text-primary hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-4">
                {stats.departmentPerformance?.map((dept: any) => (
                  <div key={dept.id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{dept.name}</span>
                      <span className="text-primary font-mono">{dept.resolutionRate}% ({dept.resolvedCount}/{dept.assignedCount})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${dept.resolutionRate || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ward-wise Incidents */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">Ward Vulnerability Metrics</h3>
                <Link to="/government/wards" className="text-xs font-bold text-primary hover:underline">
                  Ward Maps &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {stats.wardStats?.map((w: any) => (
                  <div key={w._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">Ward {w.wardNumber}: {w.name}</div>
                      <div className="text-[11px] text-text-muted">{w.zone} • {w.statistics.totalReports} total reports</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                        w.statistics.riskIndex > 65 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Risk Index {w.statistics.riskIndex}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Critical Reports Queue */}
        {stats && stats.criticalReports?.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Priority High-Risk Incident Queue</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {stats.criticalReports.map((report: any) => (
                <div key={report.trackingId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700">{report.trackingId}</span>
                      <CategoryBadge category={report.category} />
                      <StatusBadge status={report.status} />
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{report.title}</div>
                    <div className="text-[11px] text-text-muted">{report.address}</div>
                  </div>

                  <Link
                    to="/government/reports"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg self-start sm:self-auto"
                  >
                    Action Issue &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
