import React, { useState } from 'react';
import { Building2, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface OnboardingFormProps {
  session: Session;
  onComplete: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ session, onComplete }) => {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessType, setBusinessType] = useState('Retail');
  const [location, setLocation] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [primaryChallenge, setPrimaryChallenge] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);

    const { error } = await supabase.from('business_profiles').insert({
      id: session.user.id,
      business_name: businessName.trim(),
      industry: industry.trim(),
      business_type: businessType,
      location: location.trim(),
      employee_count: employeeCount.trim(),
      primary_challenge: primaryChallenge.trim(),
    });

    setIsSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center px-4 bg-grid-pattern py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Tell us about your business</h1>
            <p className="text-xs text-slate-400">
              One-time setup — this personalizes your Rescue OS dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-cyber-border rounded-2xl p-7 shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Business name *</label>
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Chennai Retail Co."
              className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Industry</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Consumer Electronics"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Business type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option>Retail</option>
                <option>Wholesale/Distribution</option>
                <option>Manufacturing</option>
                <option>E-commerce</option>
                <option>Grocery/FMCG</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Chennai, India"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Employee count</label>
              <input
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                placeholder="1-10"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Biggest operational challenge right now
            </label>
            <textarea
              value={primaryChallenge}
              onChange={(e) => setPrimaryChallenge(e.target.value)}
              placeholder="e.g. Excess inventory in one branch, slow-moving SKUs..."
              rows={3}
              className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-lg px-3 py-2">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
