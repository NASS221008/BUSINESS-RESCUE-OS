import React, { useState } from 'react';
import { Sliders, RotateCcw, TrendingUp, CheckCircle, Percent, ShieldAlert } from 'lucide-react';
import { formatINR } from './MetricCards';
import { sound } from '../utils/audio';

interface ScenarioSimulatorProps {
  totalUnits: number;
  totalValue: number;
  baseRecovery: number;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  totalUnits,
  totalValue,
  baseRecovery,
}) => {
  // Sliders
  const [transferPct, setTransferPct] = useState<number>(40);
  const [discountPct, setDiscountPct] = useState<number>(15);
  const [liquidationPct, setLiquidationPct] = useState<number>(30);

  const unitPrice = totalUnits > 0 ? totalValue / totalUnits : 0;

  // Calculation formulas
  const transferUnits = Math.round((totalUnits * transferPct) / 100);
  const liquidationUnits = Math.round((totalUnits * liquidationPct) / 100);
  const localRetailUnits = Math.max(0, totalUnits - transferUnits - liquidationUnits);

  // Recovery estimates
  const transferRecovery = transferUnits * unitPrice * 0.95; // 5% transit cost
  const localRecovery = localRetailUnits * unitPrice * (1 - discountPct / 100);
  const liquidationRecovery = liquidationUnits * unitPrice * 0.75; // 25% wholesale discount

  const simulatedRecovery = Math.round(transferRecovery + localRecovery + liquidationRecovery);
  const remainingRisk = Math.max(0, Math.round(totalValue - simulatedRecovery));
  const recoveryRate = totalValue > 0 ? Math.round((simulatedRecovery / totalValue) * 100) : 0;
  const deltaVsBaseline = simulatedRecovery - baseRecovery;

  const handleReset = () => {
    sound.playClick();
    setTransferPct(40);
    setDiscountPct(15);
    setLiquidationPct(30);
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-5 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Interactive "What-If" Recovery Simulator
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                REAL-TIME SIMULATION
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Stress-test different redistribution ratios & promotional discounts
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Defaults
        </button>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sliders */}
        <div className="lg:col-span-2 space-y-4">
          {/* Slider 1: Branch Transfer Allocation */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Inter-Branch Transfer Allocation:</span>
              <span className="font-mono text-cyan-400 font-bold">{transferPct}% ({transferUnits} units)</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={transferPct}
              onChange={(e) => {
                setTransferPct(Number(e.target.value));
                sound.playClick();
              }}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0% Local Hold</span>
              <span>Rebalance to Pune / IT Hubs</span>
              <span>80% Max Transfer</span>
            </div>
          </div>

          {/* Slider 2: Retail Markdown Discount */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Target Retail Markdown Discount:</span>
              <span className="font-mono text-amber-400 font-bold">{discountPct}% Off ({localRetailUnits} units)</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={discountPct}
              onChange={(e) => {
                setDiscountPct(Number(e.target.value));
                sound.playClick();
              }}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Full MSRP (0%)</span>
              <span>15% Sweet Spot</span>
              <span>40% Clearance Fire-Sale</span>
            </div>
          </div>

          {/* Slider 3: External B2B Wholesale Liquidation */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>External Wholesale / Liquidation Share:</span>
              <span className="font-mono text-purple-400 font-bold">{liquidationPct}% ({liquidationUnits} units)</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="5"
              value={liquidationPct}
              onChange={(e) => {
                setLiquidationPct(Number(e.target.value));
                sound.playClick();
              }}
              className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0% Direct Only</span>
              <span>DuckDuckGo Sourced Wholesalers</span>
              <span>70% Bulk Exit</span>
            </div>
          </div>
        </div>

        {/* Right Col: Live Projected Outcome */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Simulated Capital Recovery
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {formatINR(simulatedRecovery)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
              <span className="font-semibold text-white">{recoveryRate}%</span>
              <span>of ₹{totalValue.toLocaleString('en-IN')} total risk</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Remaining Loss Risk:</span>
                <span className="font-mono text-rose-400 font-bold">{formatINR(remainingRisk)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Variance vs Baseline:</span>
                <span className={`font-mono font-bold ${deltaVsBaseline >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {deltaVsBaseline >= 0 ? `+${formatINR(deltaVsBaseline)}` : `-${formatINR(Math.abs(deltaVsBaseline))}`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Optimized mix balances cashflow & brand equity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
