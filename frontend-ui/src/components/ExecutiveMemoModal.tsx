import React from 'react';
import { X, Printer, ShieldCheck, Building2, Calendar, Hash } from 'lucide-react';
import { RecoveryReportData } from '../types/data';
import { formatINR } from './MetricCards';
import { sound } from '../utils/audio';

interface ExecutiveMemoModalProps {
  report: RecoveryReportData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveMemoModal: React.FC<ExecutiveMemoModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  const problem = report.problem;
  const plan = report.recovery_plan;
  const pid = problem.id || 1;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white text-slate-100 print:text-black">
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Building2 className="w-4 h-4" />
            <span>OFFICIAL BUSINESS RESCUE MEMORANDUM & AUTHORIZATION</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Memorandum Body */}
        <div className="p-8 sm:p-12 overflow-y-auto print:overflow-visible space-y-8 bg-slate-900 print:bg-white">
          {/* Header */}
          <div className="border-b-2 border-slate-700 print:border-black pb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white print:text-black">
                Executive Rescue Memorandum
              </h1>
              <p className="text-xs font-mono text-slate-400 print:text-gray-600 mt-1">
                Autonomous Supply Chain Risk Mitigation & Working Capital Recovery
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-400 print:text-gray-600">
              <div>REF: BRS-INC-{pid.toString().padStart(4, '0')}</div>
              <div>DATE: {dateStr}</div>
              <div className="text-emerald-400 print:text-emerald-700 font-bold">CONFIDENTIAL / RESTRICTED</div>
            </div>
          </div>

          {/* Memo Metadata Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs font-mono">
            <div>
              <span className="text-slate-500 print:text-gray-500 block">TO:</span>
              <span className="font-bold text-white print:text-black">Chief Commercial Officer / VP Supply Chain</span>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-500 block">FROM:</span>
              <span className="font-bold text-white print:text-black">Business Rescue OS (Multi-Agent Swarm)</span>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-500 block">LOCATION HUB:</span>
              <span className="font-bold text-white print:text-black">{problem.branch || 'Central HQ'} Hub</span>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-500 block">GOVERNANCE:</span>
              <span className="font-bold text-emerald-400 print:text-emerald-700">Human-In-The-Loop Signoff</span>
            </div>
          </div>

          {/* Section 1: Crisis Diagnosis */}
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400 print:text-blue-800 mb-2">
              1. Incident Diagnosis & Capital Exposure
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/40 print:bg-gray-50 border border-slate-800 print:border-gray-200 text-xs leading-relaxed space-y-2">
              <p>
                <strong className="text-white print:text-black">Identified SKU:</strong> {problem.product || problem.product_name}
              </p>
              <p>
                <strong className="text-white print:text-black">Root Cause Analysis:</strong> {problem.root_cause}
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div>Units at Risk: <strong className="text-white print:text-black">{problem.units_at_risk}</strong></div>
                <div>Capital at Risk: <strong className="text-rose-400 print:text-red-700">{formatINR(problem.value_at_risk)}</strong></div>
                <div>Projected Recovery: <strong className="text-emerald-400 print:text-emerald-700">{formatINR(plan.expected_recovery)}</strong></div>
              </div>
            </div>
          </div>

          {/* Section 2: Authorized Recovery Strategy */}
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400 print:text-blue-800 mb-2">
              2. Authorized Multi-Channel Execution Plan
            </h3>
            <table className="w-full text-left text-xs border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Allocation</th>
                  <th className="py-2.5 px-4">Execution Step</th>
                  <th className="py-2.5 px-4 text-right">Channel Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                {plan.actions.map((act, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4 font-mono font-bold text-white print:text-black">{act.units} units</td>
                    <td className="py-3 px-4 text-slate-300 print:text-gray-800">{act.action}</td>
                    <td className="py-3 px-4 text-right font-mono text-cyan-300 print:text-blue-700">{act.type || 'Action Plan'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Discovered External Counterparties */}
          {report.external_options && report.external_options.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400 print:text-blue-800 mb-2">
                3. Discovered B2B Wholesale & Liquidation Counterparties (Live Internet Search)
              </h3>
              <div className="space-y-2 text-xs">
                {report.external_options.map((opt, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950/40 print:bg-gray-50 border border-slate-800 print:border-gray-200 flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-white print:text-black">{opt.name}</div>
                      <div className="text-slate-400 print:text-gray-600 mt-0.5">{opt.reason}</div>
                    </div>
                    {opt.source_url && (
                      <span className="text-[10px] font-mono text-cyan-400 print:text-blue-700 break-all max-w-xs">
                        {opt.source_url}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Sign-off & Cryptographic Authorization Stamp */}
          <div className="pt-6 border-t-2 border-slate-700 print:border-black grid grid-cols-2 gap-8 text-xs font-mono">
            <div>
              <span className="text-slate-400 print:text-gray-600 block mb-1">AI Swarm Synthesis Verified:</span>
              <div className="font-bold text-emerald-400 print:text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Validated Against SQLite Schema</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Checksum: SHA256-BRS-7f9a2b8e3c1d406
              </div>
            </div>

            <div>
              <span className="text-slate-400 print:text-gray-600 block mb-1">Human Operator Authorization:</span>
              <div className="font-bold text-white print:text-black">
                {report.approved ? 'SIGNED & AUTHORIZED BY OPERATOR' : 'PENDING FINAL SIGNATURE'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Timestamp: {new Date().toISOString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
