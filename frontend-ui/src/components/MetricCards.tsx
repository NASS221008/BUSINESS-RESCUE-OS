import React from 'react';
import { AlertOctagon, TrendingUp, CheckCircle2, Cpu } from 'lucide-react';
import { SystemStats } from '../types/data';

interface MetricCardsProps {
  stats: SystemStats | null;
  totalAtRiskFallback: number;
  analyzedCountFallback: number;
  approvedCountFallback: number;
}

export const formatINR = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
};

export const MetricCards: React.FC<MetricCardsProps> = ({
  stats,
  totalAtRiskFallback,
  analyzedCountFallback,
  approvedCountFallback,
}) => {
  const totalValueAtRisk = stats?.total_value_at_risk ?? totalAtRiskFallback ?? 0;
  const totalRecovery = stats?.total_expected_recovery ?? (totalValueAtRisk * 0.795);
  const totalProblems = stats?.total_problems ?? 0;
  const approvedCount = stats?.approved_count ?? approvedCountFallback;
  const analyzedCount = stats?.analyzed_count ?? analyzedCountFallback;
  const recoveryPct = totalValueAtRisk > 0 ? Math.round((totalRecovery / totalValueAtRisk) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {/* Card 1: Total Value at Risk */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-900/40 p-5 shadow-xl group hover:border-rose-600/60 transition duration-300">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-600/10 rounded-full blur-xl group-hover:bg-rose-600/20 transition duration-500"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400/90 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Total Capital At Risk
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {formatINR(totalValueAtRisk)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Across {totalProblems} retail SKUs</span>
          <span className="text-rose-400 font-mono font-medium">Critical Triage</span>
        </div>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-amber-500 h-1.5 rounded-full w-full"></div>
        </div>
      </div>

      {/* Card 2: Projected AI Recovery */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-900/40 p-5 shadow-xl group hover:border-emerald-500/60 transition duration-300">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-600/10 rounded-full blur-xl group-hover:bg-emerald-600/20 transition duration-500"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            AI Projected Recovery
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
          <span>{formatINR(totalRecovery)}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {recoveryPct}% Yield
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Saved working capital</span>
          <span className="text-emerald-400 font-mono font-medium">B2B + Wholesale</span>
        </div>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, recoveryPct)}%` }}
          ></div>
        </div>
      </div>

      {/* Card 3: Human Governance & Resolutions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-900/40 p-5 shadow-xl group hover:border-cyan-500/60 transition duration-300">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-600/10 rounded-full blur-xl group-hover:bg-cyan-600/20 transition duration-500"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            Resolution Progress
          </span>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
          <span>{approvedCount}</span>
          <span className="text-sm font-medium text-slate-400">
            / {totalProblems} Authorized
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{analyzedCount} Triaged by Agents</span>
          <span className="text-cyan-400 font-mono font-medium">Human Guard</span>
        </div>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
          <div 
            className="bg-emerald-500 h-1.5 transition-all duration-500" 
            style={{ width: `${(approvedCount / totalProblems) * 100}%` }}
            title="Approved"
          ></div>
          <div 
            className="bg-amber-500 h-1.5 transition-all duration-500" 
            style={{ width: `${(Math.max(0, analyzedCount - approvedCount) / totalProblems) * 100}%` }}
            title="Analyzed"
          ></div>
        </div>
      </div>

      {/* Card 4: Orchestration Engine Speed */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-900/40 p-5 shadow-xl group hover:border-purple-500/60 transition duration-300">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-600/10 rounded-full blur-xl group-hover:bg-purple-600/20 transition duration-500"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400/90 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Multi-Agent Latency
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
          <span>~18.2s</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            5 Parallel Agents
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Live DuckDuckGo Scraping</span>
          <span className="text-purple-400 font-mono font-medium">Groq Inference</span>
        </div>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full w-4/5 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
