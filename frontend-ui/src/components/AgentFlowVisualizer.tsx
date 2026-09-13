import React, { useState } from 'react';
import { 
  Database, 
  TrendingUp, 
  Boxes, 
  DollarSign, 
  Globe, 
  Workflow, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NodeDetail {
  id: string;
  name: string;
  role: string;
  tech: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  promptSnippet: string;
  outputFormat: string;
}

const AGENT_NODES: NodeDetail[] = [
  {
    id: 'db',
    name: 'Retail Telemetry',
    role: 'Crisis Ingestion',
    tech: 'SQLite + SQLAlchemy',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/30',
    borderColor: 'border-amber-500/30',
    icon: <Database className="w-5 h-5" />,
    promptSnippet: 'Scans ERP inventory records across 7 regional hubs (Bengaluru, Mumbai, Delhi, Chennai, Pune, Ahmedabad, Hyderabad) to detect overstock, expiry windows, or competitor price shocks.',
    outputFormat: '{ product, units_at_risk, value_at_risk, root_cause }'
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    role: 'Sell-Through Forecaster',
    tech: 'Groq LLM (gpt-oss-120b)',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/30',
    borderColor: 'border-blue-500/30',
    icon: <TrendingUp className="w-5 h-5" />,
    promptSnippet: 'Estimates realistic retail demand and sell-through potential without overestimating units. Anchors strictly to historical category velocity.',
    outputFormat: '{ sell_through_estimate_pct, estimated_units_sold, sales_reason }'
  },
  {
    id: 'inventory',
    name: 'Inventory Agent',
    role: 'Rebalancing Engine',
    tech: 'Groq LLM (gpt-oss-120b)',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-950/30',
    borderColor: 'border-indigo-500/30',
    icon: <Boxes className="w-5 h-5" />,
    promptSnippet: 'Determines whether stock should be transferred to higher-demand regional branches or held locally based on transit logistics and perishable constraints.',
    outputFormat: '{ inventory_issue, transfer_recommended, transfer_candidate, inventory_notes }'
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    role: 'Capital Risk Modeler',
    tech: 'Groq LLM (gpt-oss-120b)',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/30',
    borderColor: 'border-emerald-500/30',
    icon: <DollarSign className="w-5 h-5" />,
    promptSnippet: 'Transforms sales and inventory assessments into rigorous INR capital recovery forecasts and remaining write-off risks.',
    outputFormat: '{ risk_level, expected_recovery, remaining_risk, finance_notes }'
  },
  {
    id: 'web_research',
    name: 'Web Research Agent',
    role: 'Live Market Discovery',
    tech: 'DuckDuckGo Live Search',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/30',
    borderColor: 'border-cyan-500/30',
    icon: <Globe className="w-5 h-5" />,
    promptSnippet: 'Executes real-time live queries for B2B liquidation buyers, wholesale distributors, and corporate bulk clients across India.',
    outputFormat: '[ { name, reason, source_url } ]'
  },
  {
    id: 'strategy',
    name: 'Strategy Agent',
    role: 'Action Plan Synthesizer',
    tech: 'Groq LLM (gpt-oss-120b)',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/30',
    borderColor: 'border-purple-500/30',
    icon: <Workflow className="w-5 h-5" />,
    promptSnippet: 'Harmonizes internal branch transfer, clearance discounting, and verified external liquidation into an optimal recovery strategy.',
    outputFormat: '{ recommended_option, recovery_plan: { expected_recovery, actions, remaining_risk } }'
  },
  {
    id: 'human_gate',
    name: 'Human Approval Gate',
    role: 'Governance Safe Guard',
    tech: 'HITL Consent Protocol',
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/30',
    borderColor: 'border-rose-500/30',
    icon: <ShieldCheck className="w-5 h-5" />,
    promptSnippet: 'Enforces strict non-autonomous execution. AI agents propose, but authorized human executive must review and cryptographically authorize before any purchase order or transfer is executed.',
    outputFormat: '{ approved: true, timestamp, operator_audit_hash }'
  }
];

interface AgentFlowVisualizerProps {
  isAnalyzing?: boolean;
  activeStep?: number;
}

export const AgentFlowVisualizer: React.FC<AgentFlowVisualizerProps> = ({
  isAnalyzing = false,
  activeStep = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);

  return (
    <div className="rounded-2xl bg-cyber-card border border-cyber-border mb-7 overflow-hidden transition-all shadow-xl">
      {/* Header Banner */}
      <div 
        onClick={() => {
          sound.playClick();
          setIsExpanded(!isExpanded);
        }}
        className="px-5 py-3.5 bg-slate-900/90 border-b border-cyber-border flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-cyan-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous Orchestration Pipeline Architecture
              {isAnalyzing && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                  PIPELINE EXECUTING
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Multi-Agent DAG: Live telemetry ➔ Parallel domain inference ➔ Live Web Scraping ➔ Human Governance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Click any node for prompt & schema specs
          </span>
          <button className="p-1 rounded-lg text-slate-400 hover:text-white">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5">
          {/* Visual Node Flow Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative">
            {AGENT_NODES.map((node, index) => {
              const isActiveInSimulation = isAnalyzing && activeStep === index;
              const isPassedInSimulation = isAnalyzing && activeStep > index;
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="relative flex flex-col">
                  {/* Node Box */}
                  <div
                    onClick={() => {
                      sound.playClick();
                      setSelectedNode(isSelected ? null : node);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex-1 flex flex-col justify-between ${
                      isSelected
                        ? 'border-white ring-2 ring-cyan-500/50 bg-slate-800 shadow-lg scale-102'
                        : isActiveInSimulation
                        ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20 animate-pulse'
                        : isPassedInSimulation
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : `${node.borderColor} ${node.bgColor} hover:border-slate-400/50 hover:bg-slate-800/40`
                    }`}
                  >
                    {isActiveInSimulation && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent shimmer-bg"></div>
                    )}

                    <div>
                      {/* Step Number & Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          0{index + 1}
                        </span>
                        <div className={`p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 ${node.color}`}>
                          {node.icon}
                        </div>
                      </div>

                      {/* Title & Role */}
                      <div className="text-xs font-bold text-white tracking-tight">
                        {node.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                        {node.role}
                      </div>
                    </div>

                    {/* Tech Badge */}
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400 truncate max-w-[90px]">
                        {node.tech}
                      </span>
                      <Info className="w-3 h-3 text-slate-500 hover:text-cyan-400 transition" />
                    </div>
                  </div>

                  {/* Flow Arrow (Desktop only, between items) */}
                  {index < AGENT_NODES.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600 pointer-events-none">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Node Spec Inspector Drawer */}
          {selectedNode && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs animate-fadeIn">
              <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md bg-slate-800 ${selectedNode.color}`}>
                    {selectedNode.icon}
                  </div>
                  <span className="font-bold text-white text-sm">
                    {selectedNode.name} Specification
                  </span>
                  <span className="px-2 py-0.5 font-mono text-[10px] rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {selectedNode.tech}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white font-mono"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-300 block mb-1">
                    System Responsibility & Logic:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {selectedNode.promptSnippet}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-300 block mb-1 font-mono">
                    Strict JSON Contract Output:
                  </span>
                  <pre className="p-2 rounded bg-slate-950 font-mono text-[10px] text-cyan-300 overflow-x-auto border border-slate-800">
                    {selectedNode.outputFormat}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
