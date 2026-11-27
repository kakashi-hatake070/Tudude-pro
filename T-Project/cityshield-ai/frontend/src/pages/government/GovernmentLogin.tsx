import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';
import { api } from '../../services/api';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';

export const GovernmentLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.governmentLogin({ email, password });
      if (res.success) {
        localStorage.setItem('cs_gov_token', res.token);
        localStorage.setItem('cs_officer', JSON.stringify(res.officer));
        navigate('/government/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid official credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Government Administration Portal
        </h2>
        <p className="text-xs text-text-muted">
          Restricted access for authorized municipal officers, ward engineers, and department heads.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-soft-lg space-y-6">
          
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <strong>Official Portal Notice:</strong> CityShield AI is an independent civic technology platform. All actions taken by government personnel are cryptographically logged in the municipal audit trail.
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address
              </label>
              <input
                type="email"
                placeholder="admin@cityshield.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{loading ? 'Verifying Credentials...' : 'Sign In as Authorized Official'}</span>
            </button>
          </form>

          {/* Quick Demo Credential Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-text-muted space-y-1">
            <span className="font-bold text-slate-800">Seed Official Credentials:</span>
            <div>Super Admin: <code className="text-primary font-bold">admin@cityshield.gov.in</code></div>
            <div>Municipal Officer: <code className="text-primary font-bold">officer@cityshield.gov.in</code></div>
            <div>Password: <code className="text-slate-700 font-bold">Admin@1234</code></div>
          </div>

        </div>
      </div>
    </div>
  );
};
