import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Presentation, 
  Sparkles, 
  AlertOctagon, 
  Cpu, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle,
  Users
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      badge: "SLIDE 1 / 4 — THE PROBLEM",
      title: "The $1.2 Trillion Dead Inventory Crisis",
      subtitle: "Retailers and supply chains bleed billions when products stagnate in warehouses.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-900/40">
            <div className="text-3xl font-black text-rose-500 font-mono mb-2">₹10 Lakhs+</div>
            <h4 className="text-sm font-bold text-white mb-1">Locked Working Capital per SKU</h4>
            <p className="text-xs text-slate-400">
              When new products launch or seasons change, previous models become deadweight with zero automated recovery recourse.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/40">
            <div className="text-3xl font-black text-amber-500 font-mono mb-2">60 Days</div>
            <h4 className="text-sm font-bold text-white mb-1">Perishable Shelf-Life Clocks</h4>
            <p className="text-xs text-slate-400">
              FMCG, dairy, and cosmetics face ticking expiration windows. Manual wholesale negotiation takes weeks, causing total write-offs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40">
            <div className="text-3xl font-black text-blue-500 font-mono mb-2">Siloed Teams</div>
            <h4 className="text-sm font-bold text-white mb-1">Disconnected Decisions</h4>
            <p className="text-xs text-slate-400">
              Sales, warehouse logistics, and finance rarely communicate in real time, leading to panic discounting and brand erosion.
            </p>
          </div>
        </div>
      )
    },
    {
      badge: "SLIDE 2 / 4 — THE SOLUTION",
      title: "Business Rescue OS: Autonomous Agent Swarm",
      subtitle: "Detects inventory crises, scrapes live internet buyers, and synthesizes optimal human-approved recovery plans.",
      content: (
        <div className="space-y-4 my-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 h-fit">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">1. Multi-Agent Domain Swarm</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Sales, Inventory, and Finance agents reason in parallel on Groq LPUs, evaluating real-world velocity and margin impact.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 h-fit">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">2. Live Internet Market Discovery</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Web Research Agent uses DuckDuckGo live search to find authentic B2B liquidators and corporate buyers across India in real time.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 h-fit">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">3. 80%+ Capital Recovery Yield</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Rather than fire-selling at 10%, our optimizer balances inter-branch transfer, corporate gifting, and strategic wholesale.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 h-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">4. Responsible Human-in-the-Loop</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Strict non-autonomous safeguard: AI proposes, human authorizes. No supplier is ever contacted without operator sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      badge: "SLIDE 3 / 4 — TECHNICAL ARCHITECTURE",
      title: "World-Class Hackathon Engineering",
      subtitle: "Lightning-fast inference, zero-cost search APIs, and production-grade software craftsmanship.",
      content: (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyber-border my-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-cyan-400 block font-bold mb-1">GROQ INFERENCE</span>
              <p className="text-slate-400 text-[11px]">Sub-second LLM reasoning via Groq LPU (gpt-oss-120b & llama-3.3-70b)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-amber-400 block font-bold mb-1">DUCKDUCKGO SEARCH</span>
              <p className="text-slate-400 text-[11px]">Free, zero-signup real-time web scraping via python ddgs package</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 block font-bold mb-1">FASTAPI & SQLITE</span>
              <p className="text-slate-400 text-[11px]">High-concurrency async Python server with typed SQLAlchemy models</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-purple-400 block font-bold mb-1">REACT & TAILWIND</span>
              <p className="text-slate-400 text-[11px]">Executive command center with interactive SVG visualizer & simulator</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>PIPELINE: Telemetry ➔ Sales ➔ Inventory ➔ Finance ➔ Web Scraping ➔ Strategy ➔ Human Gate</span>
            <span className="text-emerald-400 font-bold">18.2s Latency</span>
          </div>
        </div>
      )
    },
    {
      badge: "SLIDE 4 / 4 — TEAM & BUSINESS IMPACT",
      title: "Immediate Enterprise Value & Scalability",
      subtitle: "Designed to deploy into Walmart, Reliance Retail, Croma, or D-Mart in hours.",
      content: (
        <div className="my-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400 font-mono">10x ROI</div>
              <p className="text-xs text-slate-400 mt-1">
                Recovers an average of ₹12 Lakhs per incident that would otherwise be liquidated at cents on the dollar.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-cyan-400 font-mono">Zero Hallucinations</div>
              <p className="text-xs text-slate-400 mt-1">
                Strict Pydantic JSON schema contracts guarantee financial numbers match database units perfectly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-black text-purple-400 font-mono">Enterprise Ready</div>
              <p className="text-xs text-slate-400 mt-1">
                Plugs directly into existing SAP, Oracle NetSuite, and Shopify Plus inventory webhooks.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Engineered by: <strong>Nidhi</strong> (AI/ML), <strong>Adithya</strong> (Backend), <strong>Shubh</strong> (Database), <strong>Shreesh</strong> (UI/UX)</span>
            </div>
            <span className="font-mono text-cyan-400 font-semibold">Hackathon 2026</span>
          </div>
        </div>
      )
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-cyber-dark border border-cyber-border shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white text-sm">
              Hackathon 3-Minute Presentation Deck
            </span>
          </div>
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

        {/* Slide Canvas */}
        <div className="p-8 sm:p-12 flex-1 flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {slide.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
              {slide.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {slide.subtitle}
            </p>

            {slide.content}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              disabled={currentSlide === 0}
              onClick={() => {
                sound.playClick();
                setCurrentSlide(prev => Math.max(0, prev - 1));
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Slide
            </button>

            {/* Indicator dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    sound.playClick();
                    setCurrentSlide(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                    currentSlide === i ? 'bg-purple-400 w-6' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => {
                sound.playClick();
                setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center gap-1 transition shadow-md shadow-purple-900/30"
            >
              Next Slide
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
