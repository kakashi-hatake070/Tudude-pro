import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [anonymousId, setAnonymousId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(anonymousId.trim(), password);
      if (res.success) {
        localStorage.setItem('cs_token', res.token);
        localStorage.setItem('cs_user', JSON.stringify(res.user));
        navigate('/citizen/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid Anonymous ID or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md shadow-primary/25">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Citizen Shield Sign In
        </h2>
        <p className="text-xs text-text-muted">
          Access your anonymous civic identity, reported issues, and community verification points.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-soft-lg space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Anonymous Citizen ID
              </label>
              <input
                type="text"
                placeholder="e.g. CityGuardian_4821"
                value={anonymousId}
                onChange={(e) => setAnonymousId(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Private Password
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
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-primary/25 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Anonymous ID'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Demo helper */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-text-muted space-y-1">
            <span className="font-bold text-slate-800">Quick Test Credentials:</span>
            <div>ID: <code className="text-primary font-bold">CityGuardian_4821</code></div>
            <div>Password: <code className="text-slate-700 font-bold">Citizen@123</code></div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-600">
            Don't have an anonymous identity yet?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Generate one in 1 click &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
