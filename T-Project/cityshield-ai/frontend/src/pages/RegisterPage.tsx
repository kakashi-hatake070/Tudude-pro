import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { api } from '../services/api';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedUser, setGeneratedUser] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.register(password, email || undefined);
      if (res.success) {
        localStorage.setItem('cs_token', res.token);
        localStorage.setItem('cs_user', JSON.stringify(res.user));
        setGeneratedUser(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (generatedUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-soft-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Your Identity Is Active!</h2>
            <p className="text-xs text-text-muted mt-1">
              Save your unique pseudonym. You will use this to sign in and track your reports.
            </p>
          </div>

          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Your Anonymous Citizen ID</span>
            <div className="text-xl font-mono font-extrabold text-primary">
              {generatedUser.anonymousId}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-emerald-700 font-bold bg-emerald-50 py-2 rounded-xl">
            <Award className="w-4 h-4" />
            <span>+25 Welcome Civic Points Credited!</span>
          </div>

          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Go to Citizen Dashboard &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center mx-auto shadow-md shadow-secondary/25">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Join CityShield AI
        </h2>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Create an anonymous citizen account. We never reveal your real name or contact details to the public.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-soft-lg space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Set Account Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Private Recovery Email (Optional)
              </label>
              <input
                type="email"
                placeholder="citizen@example.com (Kept strictly confidential)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 space-y-1">
              <span className="font-bold flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Public Exposure Guarantee</span>
              </span>
              <p>Your unique handle (e.g. UrbanWatcher_2048) is generated randomly upon registration.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-secondary/25 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{loading ? 'Generating Protected Identity...' : 'Generate My Anonymous Shield'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
