import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Shield, MapPin, Loader2, AlertTriangle, RefreshCw, FilePlus } from 'lucide-react';
import { api } from '../../services/api';
import { IssueReport } from '../../types';
import { StatusBadge, CategoryBadge, RiskBadge } from '../../components/HazardBadge';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async (anonymousId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: { reports: IssueReport[] } = await api.getReports({ limit: 50 });
      const userReports = (res.reports || []).filter(
        (r: IssueReport) => r.reporterAnonymousId === anonymousId
      );
      setReports(userReports);
    } catch (e: any) {
      setError(e.message || 'Failed to load your civic reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rawUser = localStorage.getItem('cs_user');
    if (!rawUser) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(rawUser);
    setUser(parsed);
    loadDashboard(parsed.anonymousId);
  }, []);

  if (!user) return null;

  const userBadges: string[] = Array.isArray(user.badges) ? user.badges : [];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-xl">
              <Shield className="w-9 h-9" />
            </div>
            <div>
              <div className="text-xs text-text-muted font-bold uppercase tracking-wider">Citizen Shield</div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-mono">{user.anonymousId}</h1>
              <p className="text-xs text-text-muted mt-0.5">Anonymous Civic Contributor</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[110px]">
              <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">Civic Points</span>
              <div className="text-2xl font-extrabold text-secondary flex items-center justify-center space-x-1">
                <Award className="w-5 h-5 text-secondary" />
                <span>{user.citizenPoints ?? 0}</span>
              </div>
            </div>

            <Link
              to="/report"
              className="px-5 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-primary/25 transition-all"
            >
              Report New Issue
            </Link>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Earned Civic Badges
          </h2>
          {userBadges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {userBadges.map((b) => (
                <div key={b} className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-slate-800">
                  <Award className="w-4 h-4 text-secondary" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">
              No badges earned yet. Submit or verify civic reports to unlock badges.
            </p>
          )}
        </div>

        {/* My Reports */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              My Civic Reports ({reports.length})
            </h2>
            <Link to="/citizen/reports" className="text-xs font-bold text-primary hover:underline">
              View All History &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center text-xs text-text-muted flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Loading your civic reports...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadDashboard(user.anonymousId)}
                className="font-bold text-rose-700 hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-10 text-center text-xs text-text-muted space-y-3">
              <p>You haven&apos;t submitted any civic hazard reports under {user.anonymousId} yet.</p>
              <Link
                to="/report"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-hover transition-colors"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>Submit Your First Report</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reports.map((report) => (
                <div key={report.trackingId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700">{report.trackingId}</span>
                      <CategoryBadge category={report.category} />
                      <StatusBadge status={report.status} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{report.title}</h4>
                    <p className="text-text-muted flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-start sm:self-auto">
                    <RiskBadge score={report.riskScore} />
                    <Link
                      to="/live-map"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                    >
                      View on Map
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
