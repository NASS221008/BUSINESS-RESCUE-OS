import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Boxes, 
  DollarSign, 
  Globe, 
  Workflow, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  Layers,
  MapPin,
  Clock,
  Printer
} from 'lucide-react';
import { RecoveryReportData } from '../types/data';
import { formatINR } from './MetricCards';
import { ScenarioSimulator } from './ScenarioSimulator';
import { sound } from '../utils/audio';

interface AgentWarRoomModalProps {
  report: RecoveryReportData | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (problemId: number) => Promise<void>;
  onOpenMemo: () => void;
  isApproving: boolean;
}

export const AgentWarRoomModal: React.FC<AgentWarRoomModalProps> = ({
  report,
  isOpen,
  onClose,
  onApprove,
  onOpenMemo,
  isApproving,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'finance' | 'web' | 'strategy'>('overview');

  if (!isOpen || !report) return null;

  const problem = report.problem;
  const plan = report.recovery_plan;
  const isApproved = report.approved;
  const pid = problem.id || 1;

  const handleApproveClick = async () => {
    sound.playSuccess();
    // Fire festive hackathon confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#06B6D4', '#F43F5E', '#F59E0B']
    });
    await onApprove(pid);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl bg-cyber-dark border border-cyber-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/95 border-b border-cyber-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Agent War Room — Incident #{pid}
                </h3>
                {isApproved ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    HUMAN AUTHORIZED
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    PENDING OPERATOR SIGN-OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {problem.product || problem.product_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenMemo();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Executive Memo</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-slate-900/60 border-b border-cyber-border flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Recovery Strategy', icon: <Workflow className="w-3.5 h-3.5" /> },
            { id: 'sales', label: 'Sales Agent', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'inventory', label: 'Inventory Agent', icon: <Boxes className="w-3.5 h-3.5" /> },
            { id: 'finance', label: 'Finance Agent', icon: <DollarSign className="w-3.5 h-3.5" /> },
            { id: 'web', label: 'DuckDuckGo Research', icon: <Globe className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Incident Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Units At Risk</span>
              <span className="text-lg font-black text-white font-mono">{problem.units_at_risk.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-rose-400 uppercase block">Capital At Risk</span>
              <span className="text-lg font-black text-rose-300 font-mono">{formatINR(problem.value_at_risk)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-emerald-400 uppercase block">Projected Recovery</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{formatINR(plan.expected_recovery)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 uppercase block">Residual Loss</span>
              <span className="text-lg font-black text-amber-400 font-mono">{formatINR(plan.remaining_risk)}</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & SYNTHESIZED RECOVERY PLAN */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recommended Approach Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  ⭐ Strategy Agent Recommended Action Matrix
                </span>
                <h4 className="text-base font-extrabold text-white">
                  {report.recommended_option}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Synthesized after cross-referencing sales velocity, inter-branch transit logistics, and live DuckDuckGo liquidation quotes.
                </p>
              </div>

              {/* Action Plan Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                  Authorized Execution Steps
                </h4>
                <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 w-24">Allocation</th>
                        <th className="py-2.5 px-4">Action Description & Target Channel</th>
                        <th className="py-2.5 px-4 w-28 text-right">Channel Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {plan.actions.map((act, i) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                            {act.units} units
                          </td>
                          <td className="py-3 px-4 text-white font-medium">
                            {act.action}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {act.type || 'Strategy'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Web Research Discovered Buyers */}
              {report.external_options && report.external_options.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    AI-Discovered Real B2B Wholesale Buyers (Live DuckDuckGo Scraping)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.external_options.map((opt, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-white text-xs">{opt.name}</span>
                          {opt.tag && (
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                              {opt.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                          {opt.reason}
                        </p>
                        {opt.source_url && (
                          <a
                            href={opt.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:underline"
                          >
                            <span>Verify Source Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Embedded What-If Simulator */}
              <ScenarioSimulator
                totalUnits={problem.units_at_risk}
                totalValue={problem.value_at_risk}
                baseRecovery={plan.expected_recovery}
              />
            </div>
          )}

          {/* TAB 2: SALES AGENT */}
          {activeTab === 'sales' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-bold text-white">Sales Agent Assessment (Groq LPU)</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Sell-Through Forecast</span>
                    <div className="text-xl font-extrabold text-blue-400 font-mono mt-0.5">
                      {report.sales_assessment?.sell_through_estimate_pct ?? 45}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Predicted Units Sold</span>
                    <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                      {report.sales_assessment?.estimated_units_sold ?? Math.round(problem.units_at_risk * 0.45)} units
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">Demand & Velocity Rationale:</span>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    {report.sales_assessment?.sales_reason || "Evaluated historical category velocity against local branch footfall patterns."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY AGENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Boxes className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Inventory Agent Assessment (Groq LPU)</h4>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">Identified Inventory Bottleneck:</span>
                    <p className="text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      {report.inventory_assessment?.inventory_issue || "Stock accumulation exceeds 60-day safety cover."}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">Branch Redistribution Target:</span>
                    <p className="text-cyan-300 font-medium bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      {report.inventory_assessment?.transfer_candidate || "Inter-branch transfer to high-velocity IT corridors recommended."}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">Logistics & Handling Notes:</span>
                    <p className="text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      {report.inventory_assessment?.inventory_notes || "Consolidate into palletized ground shipments to minimize transit overhead."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE AGENT */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Finance Risk Agent Assessment (Groq LPU)</h4>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Assessed Risk Tier</span>
                    <div className="text-base font-bold text-amber-400 mt-0.5">
                      {report.finance_assessment?.risk_level || "High Working Capital"}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Expected Recovery</span>
                    <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                      {formatINR(plan.expected_recovery)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-rose-400 uppercase">Residual Risk</span>
                    <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                      {formatINR(plan.remaining_risk)}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">Financial Rationale & Net Yield:</span>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    {report.finance_assessment?.finance_notes || "Structured mitigation plan yields ~80% capital retention compared to total write-off."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WEB RESEARCH AGENT */}
          {activeTab === 'web' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">Live Web Research Leads (DuckDuckGo Live Search)</h4>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  The Web Research Agent queries live search engines without requiring expensive API keys, discovering authentic wholesale buyers, liquidators, and B2B corporate customers in India.
                </p>
                <div className="space-y-3">
                  {report.external_options.map((opt, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm">{opt.name}</span>
                        <a 
                          href={opt.source_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Visit Web Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{opt.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Human Governance Action Gate */}
        <div className="px-6 py-4 bg-slate-900/95 border-t border-cyber-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Human-in-the-Loop Safe Guard: AI recommendations require human sign-off.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
            >
              Close
            </button>

            {isApproved ? (
              <div className="px-5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Authorized & Logged in DB</span>
              </div>
            ) : (
              <button
                onClick={handleApproveClick}
                disabled={isApproving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-103"
              >
                {isApproving ? (
                  <>
                    <ShieldCheck className="w-4 h-4 animate-spin" />
                    <span>Signing Authorization...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Plan (Human Sign-off)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
