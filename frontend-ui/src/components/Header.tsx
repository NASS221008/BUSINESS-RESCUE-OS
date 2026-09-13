import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Database, 
  Volume2, 
  VolumeX, 
  Presentation, 
  RotateCcw, 
  RefreshCw,
  Cpu,
  Radio,
  UserCircle2,
  LogOut
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  onOpenPitch: () => void;
  onResetDb: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  activeAnalyzingProduct?: string | null;
  businessName?: string;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDemoMode,
  setIsDemoMode,
  audioEnabled,
  setAudioEnabled,
  onOpenPitch,
  onResetDb,
  onRefresh,
  isLoading,
  activeAnalyzingProduct,
  businessName,
  userEmail,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-cyber-border bg-cyber-dark/90 backdrop-blur-xl transition-all">
      {/* Top Telemetry Ticker */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-cyber-border/50 text-[11px] font-mono text-slate-400 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-5 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM OPERATIONAL
          </span>

          <span className="flex items-center gap-1.5 text-cyan-300">
            <Cpu className="w-3.5 h-3.5" />
            GROQ LPU: Llama-3.3-70B & OSS-120B
          </span>

          <span className="flex items-center gap-1.5 text-amber-300">
            <Globe className="w-3.5 h-3.5" />
            LIVE WEB RESEARCH: DuckDuckGo Active
          </span>

          <span className="flex items-center gap-1.5 text-slate-300">
            <Database className="w-3.5 h-3.5" />
            DATABASE: SQLite Embedded
          </span>

          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            HUMAN-IN-THE-LOOP SAFEGUARD: ENFORCED
          </span>
        </div>

        {activeAnalyzingProduct && (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse shrink-0">
            <Radio className="w-3.5 h-3.5 animate-spin" />
            <span>Autonomous Pipeline Active: {activeAnalyzingProduct}</span>
          </div>
        )}
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-500 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg">
              <Activity className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                RESCUE<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">OS</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Hackathon Ed.
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Multi-Agent Retail Supply Chain Recovery Engine
            </p>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Live vs Instant Demo Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-cyber-border rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setIsDemoMode(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !isDemoMode
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Live API
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setIsDemoMode(true);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                isDemoMode
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Pitch Mode
            </button>
          </div>

          {/* Pitch Deck Presentation Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPitch();
            }}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
          >
            <Presentation className="w-3.5 h-3.5 text-purple-400" />
            <span>Pitch Deck</span>
          </button>

          {/* Audio Chime Toggle */}
          <button
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              sound.enabled = next;
              if (next) sound.playClick();
            }}
            title={audioEnabled ? "Mute audio cues" : "Enable high-tech audio cues"}
            className="p-2 rounded-xl bg-slate-900 border border-cyber-border hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all text-xs"
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={() => {
              sound.playClick();
              onRefresh();
            }}
            disabled={isLoading}
            title="Refresh database records"
            className="p-2 rounded-xl bg-slate-900 border border-cyber-border hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all text-xs"
          >
            <RefreshCw className={`w-4 h-4 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (window.confirm("Reset all problems to initial crisis state and clear saved reports for a fresh demo?")) {
                onResetDb();
              }
            }}
            title="Reset database to fresh crisis state"
            className="px-2.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 hover:text-white transition-all text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {(businessName || userEmail) && (
            <div className="flex items-center gap-2 pl-2.5 ml-1 border-l border-cyber-border">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-cyber-border text-xs text-slate-300">
                <UserCircle2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline max-w-[140px] truncate">
                  {businessName || userEmail}
                </span>
              </div>
              {onSignOut && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onSignOut();
                  }}
                  title="Sign out"
                  className="p-2 rounded-xl bg-slate-900 border border-cyber-border hover:border-rose-700 text-slate-400 hover:text-rose-300 transition-all text-xs"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
