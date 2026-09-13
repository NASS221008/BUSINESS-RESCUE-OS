import React from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Zap, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck,
  Tag,
  Boxes,
  FileText,
  Pencil,
  Trash2
} from 'lucide-react';
import { ProblemItem } from '../types/data';
import { formatINR } from './MetricCards';
import { sound } from '../utils/audio';

interface ProblemCardProps {
  problem: ProblemItem;
  onAnalyze: (id: number) => void;
  onOpenReport: (id: number) => void;
  onEdit: (problem: ProblemItem) => void;
  onDelete: (id: number) => void;
  isAnalyzingThis: boolean;
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  electronics: { text: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/30' },
  footwear: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/30' },
  apparel: { text: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-500/30' },
  home_appliances: { text: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-500/30' },
  grocery_fmcg: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/30' },
  beauty: { text: 'text-pink-400', bg: 'bg-pink-950/40', border: 'border-pink-500/30' },
  fitness: { text: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-500/30' },
  furniture: { text: 'text-yellow-400', bg: 'bg-yellow-950/40', border: 'border-yellow-500/30' },
  personal_care: { text: 'text-teal-400', bg: 'bg-teal-950/40', border: 'border-teal-500/30' },
  home_kitchen: { text: 'text-indigo-400', bg: 'bg-indigo-950/40', border: 'border-indigo-500/30' },
};

const formatProblemType = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onAnalyze,
  onOpenReport,
  onEdit,
  onDelete,
  isAnalyzingThis,
}) => {
  const catStyle = CATEGORY_COLORS[problem.category] || {
    text: 'text-slate-300',
    bg: 'bg-slate-800/40',
    border: 'border-slate-700'
  };

  // Severity rating
  const isCritical = problem.value_at_risk >= 500000;
  const isHigh = problem.value_at_risk >= 200000 && problem.value_at_risk < 500000;

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl bg-cyber-card border transition-all duration-300 hover:shadow-2xl overflow-hidden group ${
      problem.status === 'approved' 
        ? 'border-emerald-500/40 shadow-emerald-950/20' 
        : problem.status === 'analyzed'
        ? 'border-amber-500/40 shadow-amber-950/20'
        : 'border-cyber-border hover:border-rose-500/50 hover:shadow-rose-950/30'
    }`}>
      {/* Top Banner Accent */}
      <div className={`h-1.5 w-full ${
        problem.status === 'approved'
          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
          : problem.status === 'analyzed'
          ? 'bg-gradient-to-r from-amber-500 to-orange-400'
          : isCritical
          ? 'bg-gradient-to-r from-rose-600 to-pink-500'
          : 'bg-gradient-to-r from-cyan-600 to-blue-500'
      }`} />

      {/* Edit / Delete — appear on hover, top-right corner */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            onEdit(problem);
          }}
          title="Edit incident"
          className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            onDelete(problem.id);
          }}
          title="Delete incident"
          className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-rose-300 hover:border-rose-500/50 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Metadata: Category, Branch, Severity */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                {problem.category ? problem.category.toUpperCase().replace('_', ' ') : 'RETAIL'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {problem.branch || 'HQ'}
              </span>
            </div>

            {/* Severity Pill */}
            {isCritical ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                CRITICAL RISK
              </span>
            ) : isHigh ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                HIGH RISK
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">
                MODERATE
              </span>
            )}
          </div>

          {/* Product Title & Problem Type */}
          <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition duration-200 line-clamp-2">
            {problem.product_name}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
            <Tag className="w-3 h-3 text-slate-500" />
            <span className="font-medium text-slate-300">
              {formatProblemType(problem.problem_type)}
            </span>
          </div>

          {/* Root Cause Summary */}
          <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            {problem.root_cause}
          </p>
        </div>

        {/* Financial Risk & Units Statistics */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-2 gap-3">
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Units At Risk
            </span>
            <span className="text-base font-extrabold text-white font-mono flex items-center gap-1 mt-0.5">
              <Boxes className="w-3.5 h-3.5 text-cyan-400" />
              {problem.units_at_risk.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-rose-400/90 block">
              Capital At Risk
            </span>
            <span className="text-base font-extrabold text-rose-300 font-mono mt-0.5 block truncate">
              {formatINR(problem.value_at_risk)}
            </span>
          </div>
        </div>

        {/* Status Indicator & Call-To-Action */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {problem.status === 'approved' ? (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Human Approved</span>
            </div>
          ) : problem.status === 'analyzed' ? (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>Plan Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Action Required</span>
            </div>
          )}

          {/* Action Trigger */}
          {problem.status === 'detected' ? (
            <button
              onClick={() => {
                sound.playClick();
                onAnalyze(problem.id);
              }}
              disabled={isAnalyzingThis}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-rose-900/30 transition-all hover:scale-103"
            >
              {isAnalyzingThis ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>Agent Triage...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Run AI Rescue</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenReport(problem.id);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-600 transition-all hover:border-cyan-400"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>War Room</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
