import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Zap, 
  FileText, 
  MapPin, 
  ArrowUpRight,
  Pencil,
  Trash2
} from 'lucide-react';
import { ProblemItem } from '../types/data';
import { formatINR } from './MetricCards';
import { sound } from '../utils/audio';

interface ProblemTableProps {
  problems: ProblemItem[];
  onAnalyze: (id: number) => void;
  onOpenReport: (id: number) => void;
  onEdit: (problem: ProblemItem) => void;
  onDelete: (id: number) => void;
  analyzingId: number | null;
}

export const ProblemTable: React.FC<ProblemTableProps> = ({
  problems,
  onAnalyze,
  onOpenReport,
  onEdit,
  onDelete,
  analyzingId,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-cyber-card border border-cyber-border shadow-xl">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider border-b border-cyber-border text-[10px]">
          <tr>
            <th className="py-3 px-4">SKU / Product</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Branch Hub</th>
            <th className="py-3 px-3">Problem Type</th>
            <th className="py-3 px-3 text-right">Units At Risk</th>
            <th className="py-3 px-3 text-right">Value At Risk</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-4 text-right">Action</th>
            <th className="py-3 px-3 text-right">Manage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {problems.map((problem) => {
            const isAnalyzing = analyzingId === problem.id;
            const isCritical = problem.value_at_risk >= 500000;

            return (
              <tr 
                key={problem.id}
                className="hover:bg-slate-850/50 transition-colors duration-150 group"
              >
                {/* Product Name & Root Cause */}
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                    {problem.product_name}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {problem.root_cause}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {problem.category}
                  </span>
                </td>

                {/* Branch */}
                <td className="py-3 px-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {problem.branch}
                  </span>
                </td>

                {/* Problem Type */}
                <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">
                  {problem.problem_type.replace('_', ' ')}
                </td>

                {/* Units */}
                <td className="py-3 px-3 text-right font-mono font-medium text-white">
                  {problem.units_at_risk.toLocaleString('en-IN')}
                </td>

                {/* Value at Risk */}
                <td className="py-3 px-3 text-right font-mono font-bold">
                  <span className={isCritical ? 'text-rose-400' : 'text-slate-200'}>
                    {formatINR(problem.value_at_risk)}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3 px-3 text-center">
                  {problem.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Approved
                    </span>
                  ) : problem.status === 'analyzed' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                      <CheckCircle className="w-3 h-3 text-amber-400" />
                      Analyzed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/30">
                      <Clock className="w-3 h-3 text-rose-400" />
                      Detected
                    </span>
                  )}
                </td>

                {/* Action CTA */}
                <td className="py-3 px-4 text-right">
                  {problem.status === 'detected' ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onAnalyze(problem.id);
                      }}
                      disabled={isAnalyzing}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow transition"
                    >
                      <Zap className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      <span>{isAnalyzing ? 'Analyzing...' : 'AI Rescue'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenReport(problem.id);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-[11px] font-medium inline-flex items-center gap-1 transition"
                    >
                      <FileText className="w-3 h-3 text-cyan-400" />
                      <span>War Room</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </button>
                  )}
                </td>

                {/* Edit / Delete */}
                <td className="py-3 px-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onEdit(problem);
                      }}
                      title="Edit incident"
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onDelete(problem.id);
                      }}
                      title="Delete incident"
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-300 hover:border-rose-500/50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
