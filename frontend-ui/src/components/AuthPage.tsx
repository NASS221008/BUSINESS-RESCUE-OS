import React, { useState } from 'react';
import { Activity, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // If email confirmations are enabled in Supabase, there's no session yet.
        if (!data.session) {
          setInfoMsg('Account created! Check your email to confirm, then sign in.');
          setMode('signin');
        }
        // If confirmations are disabled, onAuthStateChange in AuthGate takes it from here.
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center px-4 bg-grid-pattern">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-500 rounded-xl blur-sm opacity-70"></div>
            <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Activity className="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            RESCUE<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">OS</span>
          </h1>
        </div>

        <div className="bg-slate-900/70 border border-cyber-border rounded-2xl p-7 shadow-2xl">
          <div className="flex bg-slate-950/80 border border-cyber-border rounded-xl p-1 mb-6 text-sm">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(null); setInfoMsg(null); }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                mode === 'signin' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); setInfoMsg(null); }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                mode === 'signup' ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white' : 'text-slate-400'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-lg px-3 py-2">
                {errorMsg}
              </div>
            )}
            {infoMsg && (
              <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-3 py-2">
                {infoMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-5">
          Each account gets its own private business data and dashboard.
        </p>
      </div>
    </div>
  );
};
