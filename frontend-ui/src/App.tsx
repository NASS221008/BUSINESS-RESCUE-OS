import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Sparkles,
  RefreshCw,
  FolderOpen,
  PackagePlus
} from 'lucide-react';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { AgentFlowVisualizer } from './components/AgentFlowVisualizer';
import { ProblemCard } from './components/ProblemCard';
import { ProblemTable } from './components/ProblemTable';
import { AgentWarRoomModal } from './components/AgentWarRoomModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { ExecutiveMemoModal } from './components/ExecutiveMemoModal';
import { NewIncidentModal } from './components/NewIncidentModal';
import { ProblemItem, SystemStats, RecoveryReportData } from './types/data';
import { PRESET_REPORTS } from './data/mockScenarios';
import { sound } from './utils/audio';
import { apiFetch } from './lib/api';
import { supabase } from './lib/supabaseClient';

interface AppProps {
  businessName?: string;
  userEmail?: string;
  onSignOut?: () => void;
}

export const App: React.FC<AppProps> = ({ businessName, userEmail, onSignOut }) => {
  // State
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modes & Toggles
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('risk_desc');

  // Active Pipeline Execution State
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [activeAnalyzingProduct, setActiveAnalyzingProduct] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Modals
  const [selectedReport, setSelectedReport] = useState<RecoveryReportData | null>(null);
  const [isWarRoomOpen, setIsWarRoomOpen] = useState<boolean>(false);
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState<boolean>(false);
  const [editingProblem, setEditingProblem] = useState<ProblemItem | null>(null);

  // 1. Fetch initial problems & stats
  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [resProb, resStats] = await Promise.all([
        apiFetch(`/api/problems`),
        apiFetch(`/api/stats`).catch(() => null),
      ]);

      if (!resProb.ok) {
        throw new Error(`Server returned status ${resProb.status}`);
      }

      const probData: ProblemItem[] = await resProb.json();
      setProblems(probData);

      if (resStats && resStats.ok) {
        const statsData: SystemStats = await resStats.json();
        setStats(statsData);
      }
    } catch (err: any) {
      console.warn('Backend API connection note:', err.message);
      // If backend is not currently running, automatically populate with mock presets so user can preview immediately!
      setErrorMsg(`Backend server not detected on port 8000. Running in Pitch Mode.`);
      setIsDemoMode(true);
      generateFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackData = () => {
    // Generate full set of 20 realistic problems from seed definitions
    const mockList: ProblemItem[] = [
      { id: 1, product_name: "Sony WH-1000XM4 Wireless Headphones", category: "electronics", branch: "Bengaluru", units_in_stock: 150, unit_price: 24990, problem_type: "overstock", units_at_risk: 60, value_at_risk: 1499400, root_cause: "Launch of the WH-1000XM5 shifted customer demand away from this SKU.", status: "analyzed", has_report: true, expected_recovery: 1245000 },
      { id: 2, product_name: "Samsung Galaxy Buds2", category: "electronics", branch: "Mumbai", units_in_stock: 300, unit_price: 9999, problem_type: "competitor_pricing", units_at_risk: 120, value_at_risk: 1199880, root_cause: "A competitor is bundling free earbuds with phone purchases, undercutting standalone sales.", status: "detected" },
      { id: 3, product_name: "Nike Air Zoom Pegasus 40", category: "footwear", branch: "Chennai", units_in_stock: 200, unit_price: 11995, problem_type: "seasonal_slowdown", units_at_risk: 85, value_at_risk: 1019575, root_cause: "Inventory was built up ahead of a community marathon that was later cancelled.", status: "analyzed", has_report: true, expected_recovery: 890000 },
      { id: 4, product_name: "Adidas Ultraboost 22", category: "footwear", branch: "Delhi", units_in_stock: 180, unit_price: 15999, problem_type: "overstock", units_at_risk: 70, value_at_risk: 1119930, root_cause: "Release of the Ultraboost 23 successor model is cannibalizing sales of this SKU.", status: "detected" },
      { id: 5, product_name: "Prestige Induction Cooktop PIC 3.1", category: "home_appliances", branch: "Pune", units_in_stock: 400, unit_price: 2499, problem_type: "slow_moving", units_at_risk: 150, value_at_risk: 374850, root_cause: "Regional power-cut schedules reduced customer interest in induction cooktops this quarter.", status: "detected" },
      { id: 6, product_name: "Philips Air Fryer HD9252", category: "home_appliances", branch: "Hyderabad", units_in_stock: 90, unit_price: 8995, problem_type: "quality_defect", units_at_risk: 35, value_at_risk: 314825, root_cause: "A batch was flagged after several units were returned for a faulty heating element.", status: "detected" },
      { id: 7, product_name: "Fabindia Men's Cotton Kurta", category: "apparel", branch: "Jaipur", units_in_stock: 500, unit_price: 1799, problem_type: "seasonal_markdown", units_at_risk: 220, value_at_risk: 395780, root_cause: "End-of-season summer stock with the wedding-season demand window already passed.", status: "detected" },
      { id: 8, product_name: "Levi's 511 Slim Fit Jeans", category: "apparel", branch: "Mumbai", units_in_stock: 350, unit_price: 3499, problem_type: "overstock", units_at_risk: 140, value_at_risk: 489860, root_cause: "Bulk order was placed ahead of a promotional campaign that was later cancelled.", status: "detected" },
      { id: 9, product_name: "Amul Butter 500g", category: "grocery_fmcg", branch: "Ahmedabad", units_in_stock: 5000, unit_price: 265, problem_type: "expiry_risk", units_at_risk: 1200, value_at_risk: 318000, root_cause: "Distribution center over-ordered ahead of a festival that saw lower footfall than forecast.", status: "analyzed", has_report: true, expected_recovery: 265000 },
      { id: 10, product_name: "Nescafe Classic Instant Coffee 200g", category: "grocery_fmcg", branch: "Kolkata", units_in_stock: 3000, unit_price: 449, problem_type: "expiry_risk", units_at_risk: 800, value_at_risk: 359200, root_cause: "Retail sell-through has been slower than forecast; stock is approaching its shelf-life window.", status: "detected" },
      { id: 11, product_name: "boAt Rockerz 450 Bluetooth Headphones", category: "electronics", branch: "Chennai", units_in_stock: 600, unit_price: 1499, problem_type: "overstock", units_at_risk: 250, value_at_risk: 374750, root_cause: "A flash sale on a competing e-commerce platform diverted customers away from in-store stock.", status: "detected" },
      { id: 12, product_name: "Milton Thermosteel Flask 1L", category: "home_kitchen", branch: "Pune", units_in_stock: 700, unit_price: 899, problem_type: "slow_moving", units_at_risk: 300, value_at_risk: 269700, root_cause: "Overordered for a corporate gifting season that underperformed expectations.", status: "detected" },
      { id: 13, product_name: "Cadbury Dairy Milk Silk Festive Pack", category: "grocery_fmcg", branch: "Delhi", units_in_stock: 2000, unit_price: 499, problem_type: "seasonal_markdown", units_at_risk: 900, value_at_risk: 449100, root_cause: "Diwali festive packaging is losing relevance now that the festival has passed.", status: "detected" },
      { id: 14, product_name: "Decathlon Quechua Yoga Mat", category: "fitness", branch: "Bengaluru", units_in_stock: 450, unit_price: 999, problem_type: "slow_moving", units_at_risk: 180, value_at_risk: 179820, root_cause: "New Year fitness-resolution demand has tapered off earlier than usual this year.", status: "detected" },
      { id: 15, product_name: "Lakme Absolute Matte Lipstick", category: "beauty", branch: "Mumbai", units_in_stock: 800, unit_price: 550, problem_type: "slow_moving", units_at_risk: 320, value_at_risk: 176000, root_cause: "The shade has been discontinued by the brand, and remaining stock has limited marketing support.", status: "detected" },
      { id: 16, product_name: "Whirlpool 190L Single Door Refrigerator", category: "home_appliances", branch: "Hyderabad", units_in_stock: 60, unit_price: 16990, problem_type: "overstock", units_at_risk: 25, value_at_risk: 424750, root_cause: "A model-year transition means customers now prefer the newer, better energy-rated model.", status: "detected" },
      { id: 17, product_name: "HP DeskJet 2331 All-in-One Printer", category: "electronics", branch: "Pune", units_in_stock: 120, unit_price: 3199, problem_type: "slow_moving", units_at_risk: 55, value_at_risk: 175945, root_cause: "A shift back to office work has reduced home-printer demand post-pandemic.", status: "detected" },
      { id: 18, product_name: "Bata Men's Formal Leather Shoes", category: "footwear", branch: "Chennai", units_in_stock: 300, unit_price: 1899, problem_type: "seasonal_markdown", units_at_risk: 130, value_at_risk: 246870, root_cause: "Wedding and interview season demand has passed, and remaining sizes skew toward less popular ranges.", status: "detected" },
      { id: 19, product_name: "Godrej Interio Study Table", category: "furniture", branch: "Delhi", units_in_stock: 80, unit_price: 5999, problem_type: "slow_moving", units_at_risk: 30, value_at_risk: 179970, root_cause: "The back-to-school demand window has closed, and remaining stock is in a less popular finish.", status: "detected" },
      { id: 20, product_name: "Patanjali Aloe Vera Gel 200ml", category: "personal_care", branch: "Lucknow", units_in_stock: 4000, unit_price: 99, problem_type: "expiry_risk", units_at_risk: 1500, value_at_risk: 148500, root_cause: "Overstocked ahead of the summer skincare season; stock is approaching expiry within 4 months.", status: "detected" }
    ];
    setProblems(mockList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh just the summary stats (used after analyze/approve/reset so top cards stay accurate)
  const refreshStats = async () => {
    try {
      const resStats = await apiFetch(`/api/stats`);
      if (resStats.ok) {
        const statsData: SystemStats = await resStats.json();
        setStats(statsData);
      }
    } catch {
      // non-fatal — top cards will just show slightly stale numbers until next full refresh
    }
  };

  // 2. Run AI Rescue Pipeline for a Problem
  const handleAnalyze = async (id: number) => {
    const targetProblem = problems.find(p => p.id === id);
    setAnalyzingId(id);
    setActiveAnalyzingProduct(targetProblem?.product_name || `SKU #${id}`);
    sound.playAgentPulse();

    // Animate visualizer DAG through the 7 steps
    for (let step = 0; step < 7; step++) {
      setActiveStep(step);
      await new Promise(r => setTimeout(r, isDemoMode ? 350 : 1200));
    }

    try {
      if (!isDemoMode) {
        const resp = await apiFetch(`/api/analyze/${id}`, { method: 'POST' });
        if (resp.ok) {
          const reportData: RecoveryReportData = await resp.json();
          // Update local list
          setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'analyzed', has_report: true, expected_recovery: reportData.recovery_plan?.expected_recovery } : p));
          setSelectedReport(reportData);
          setIsWarRoomOpen(true);
          sound.playSuccess();
          refreshStats();
          return;
        }
      }
      
      // Pitch/Demo mode or fallback:
      const preset = PRESET_REPORTS[id] || {
        problem: {
          id: targetProblem?.id,
          product: targetProblem?.product_name,
          category: targetProblem?.category,
          branch: targetProblem?.branch,
          units_at_risk: targetProblem?.units_at_risk || 50,
          value_at_risk: targetProblem?.value_at_risk || 500000,
          root_cause: targetProblem?.root_cause || "Inventory buildup requiring multi-agent mitigation.",
          status: "analyzed"
        },
        sales_assessment: {
          sell_through_estimate_pct: 40,
          estimated_units_sold: Math.round((targetProblem?.units_at_risk || 50) * 0.4),
          sales_reason: "Targeted regional demand analysis indicates moderate secondary market uptake with promotional support."
        },
        inventory_assessment: {
          inventory_issue: "Stock volume exceeds normal turnover rate for this quadrant.",
          transfer_recommended: true,
          transfer_candidate: "High-density retail corridors in Pune / Mumbai.",
          inventory_notes: "Consolidate into secondary retail outlets before write-off window closes."
        },
        finance_assessment: {
          risk_level: "High",
          expected_recovery: Math.round((targetProblem?.value_at_risk || 500000) * 0.8),
          remaining_risk: Math.round((targetProblem?.value_at_risk || 500000) * 0.2),
          finance_notes: "Recovers ~80% of invested capital through strategic multi-channel redistribution."
        },
        external_options: [
          {
            name: "IndiaMart Verified B2B Wholesale Liquidator",
            reason: "Active bulk buyer for surplus retail lots with 48h settlement.",
            source_url: "https://www.indiamart.com",
            tag: "B2B Liquidation"
          },
          {
            name: "DealShare Regional Distribution Network",
            reason: "Accepts fast-moving inventory lots for community bulk group-buying.",
            source_url: "https://dealshare.in",
            tag: "Off-Price Retail"
          }
        ],
        recommended_option: "Combined Inter-Branch Transfer & Verified Wholesale Offload",
        recovery_plan: {
          expected_recovery: Math.round((targetProblem?.value_at_risk || 500000) * 0.8),
          remaining_risk: Math.round((targetProblem?.value_at_risk || 500000) * 0.2),
          actions: [
            { units: Math.round((targetProblem?.units_at_risk || 50) * 0.5), action: "Inter-branch transfer to high-velocity metropolitan outlets", type: "transfer" },
            { units: Math.round((targetProblem?.units_at_risk || 50) * 0.3), action: "Direct wholesale offload to verified B2B distributor", type: "distributor" },
            { units: Math.round((targetProblem?.units_at_risk || 50) * 0.2), action: "In-store flash markdown weekend promotion", type: "discount" }
          ]
        }
      };

      setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'analyzed', has_report: true, expected_recovery: preset.recovery_plan.expected_recovery } : p));
      setSelectedReport(preset);
      setIsWarRoomOpen(true);
      sound.playSuccess();
    } catch (err: any) {
      alert(`Pipeline error: ${err.message}`);
    } finally {
      setAnalyzingId(null);
      setActiveAnalyzingProduct(null);
    }
  };

  // 3. Open War Room report for already analyzed problem
  const handleOpenReport = async (id: number) => {
    sound.playClick();
    try {
      if (!isDemoMode) {
        const resp = await apiFetch(`/api/reports/${id}`);
        if (resp.ok) {
          const rep: RecoveryReportData = await resp.json();
          setSelectedReport(rep);
          setIsWarRoomOpen(true);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Preset or synthetic
    const targetProblem = problems.find(p => p.id === id);
    const preset = PRESET_REPORTS[id] || {
      problem: {
        id: targetProblem?.id,
        product: targetProblem?.product_name,
        category: targetProblem?.category,
        branch: targetProblem?.branch,
        units_at_risk: targetProblem?.units_at_risk || 60,
        value_at_risk: targetProblem?.value_at_risk || 600000,
        root_cause: targetProblem?.root_cause || "Inventory bottleneck requiring rescue.",
        status: targetProblem?.status || "analyzed"
      },
      external_options: [
        { name: "SurplusTech B2B Liquidators", reason: "Accepts brand new inventory with quick turnaround.", source_url: "https://www.surplustech.in", tag: "Liquidator" },
        { name: "Reliance Retail Secondary Wholesale", reason: "Off-price placement for prior generation models.", source_url: "https://www.relianceretail.com", tag: "Wholesaler" }
      ],
      recommended_option: "Multi-branch rebalancing combined with institutional bulk offload",
      recovery_plan: {
        expected_recovery: Math.round((targetProblem?.value_at_risk || 600000) * 0.82),
        remaining_risk: Math.round((targetProblem?.value_at_risk || 600000) * 0.18),
        actions: [
          { units: Math.round((targetProblem?.units_at_risk || 60) * 0.6), action: "Transfer stock to high-demand Western zone retail hubs", type: "transfer" },
          { units: Math.round((targetProblem?.units_at_risk || 60) * 0.4), action: "Bulk supply to verified institutional wholesale buyer", type: "distributor" }
        ]
      },
      approved: targetProblem?.status === 'approved'
    };

    setSelectedReport(preset);
    setIsWarRoomOpen(true);
  };

  // 4. Human-in-the-Loop Plan Approval
  const handleApprove = async (id: number) => {
    setIsApproving(true);
    try {
      if (!isDemoMode) {
        await apiFetch(`/api/approve/${id}`, { method: 'POST' });
      }
      setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'approved', approved: true } : p));
      if (selectedReport) {
        setSelectedReport({ ...selectedReport, approved: true });
      }
      refreshStats();
    } catch (err: any) {
      console.error("Approval error:", err);
    } finally {
      setIsApproving(false);
    }
  };

  // 5. Reset Database
  const handleResetDb = async () => {
    try {
      if (!isDemoMode) {
        await apiFetch(`/api/reset`, { method: 'POST' });
      }
      fetchData();
      sound.playClick();
    } catch {
      fetchData();
    }
  };

  // 6. Edit an existing incident (opens the modal pre-filled)
  const handleEditProblem = (problem: ProblemItem) => {
    sound.playClick();
    setEditingProblem(problem);
    setIsNewIncidentOpen(true);
  };

  // 7. Delete an incident
  const handleDeleteProblem = async (id: number) => {
    const target = problems.find(p => p.id === id);
    const confirmed = window.confirm(
      `Delete "${target?.product_name || 'this incident'}"? This cannot be undone.`
    );
    if (!confirmed) return;

    sound.playClick();
    try {
      if (!isDemoMode) {
        const resp = await apiFetch(`/api/problems/${id}`, { method: 'DELETE' });
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          throw new Error(body.detail || `Server returned ${resp.status}`);
        }
      }
      setProblems(prev => prev.filter(p => p.id !== id));
      refreshStats();
    } catch (err: any) {
      alert(`Could not delete this incident: ${err.message}`);
    }
  };

  // Filter & Search Logic
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = (p.product_name || '').toLowerCase().includes(query);
        const matchesCause = (p.root_cause || '').toLowerCase().includes(query);
        const matchesCategory = (p.category || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCause && !matchesCategory) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && p.status !== selectedStatus) {
        return false;
      }

      // Branch filter
      if (selectedBranch !== 'all' && p.branch !== selectedBranch) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'risk_desc') return (b.value_at_risk || 0) - (a.value_at_risk || 0);
      if (sortBy === 'risk_asc') return (a.value_at_risk || 0) - (b.value_at_risk || 0);
      if (sortBy === 'units_desc') return (b.units_at_risk || 0) - (a.units_at_risk || 0);
      return (a.product_name || '').localeCompare(b.product_name || '');
    });
  }, [problems, searchQuery, selectedCategory, selectedStatus, selectedBranch, sortBy]);

  // Unique list of categories and branches for filter dropdowns
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [problems]);

  const uniqueBranches = useMemo(() => {
    const set = new Set<string>();
    problems.forEach(p => { if (p.branch) set.add(p.branch); });
    return Array.from(set);
  }, [problems]);

  const totalAtRiskFallback = problems.reduce((acc, p) => acc + (p.value_at_risk || 0), 0);
  const analyzedCountFallback = problems.filter(p => p.status === 'analyzed' || p.status === 'approved').length;
  const approvedCountFallback = problems.filter(p => p.status === 'approved').length;

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col bg-grid-pattern selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onOpenPitch={() => setIsPitchOpen(true)}
        onResetDb={handleResetDb}
        onRefresh={fetchData}
        isLoading={isLoading}
        activeAnalyzingProduct={activeAnalyzingProduct}
        businessName={businessName}
        userEmail={userEmail}
        onSignOut={onSignOut ?? (() => supabase.auth.signOut())}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pitch Mode Alert Banner */}
        {isDemoMode && (
          <div className="mb-5 p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>Pitch Mode Active:</strong> High-performance instant responses enabled for hackathon demonstrations.
              </span>
            </div>
            <button
              onClick={() => setIsDemoMode(false)}
              className="text-purple-300 hover:text-white underline font-semibold text-[11px] shrink-0"
            >
              Switch to Live Groq API
            </button>
          </div>
        )}

        {/* Global Metric Cards */}
        <MetricCards
          stats={stats}
          totalAtRiskFallback={totalAtRiskFallback}
          analyzedCountFallback={analyzedCountFallback}
          approvedCountFallback={approvedCountFallback}
        />

        {/* Interactive Multi-Agent DAG Visualizer */}
        <AgentFlowVisualizer
          isAnalyzing={analyzingId !== null}
          activeStep={activeStep}
        />

        {/* Search, Filter & Control Toolbar */}
        <div className="mb-6 p-4 rounded-2xl bg-cyber-card border border-cyber-border shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by product name, SKU, or root cause..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Switcher: Grid vs Dense Table */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setEditingProblem(null);
                  setIsNewIncidentOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>New Incident</span>
              </button>

              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
                <button
                  onClick={() => {
                    sound.playClick();
                    setViewMode('grid');
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setViewMode('table');
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'table' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="High-Density Executive Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Triage Count */}
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Showing <strong>{filteredProblems.length}</strong> of {problems.length} incidents
              </span>
            </div>
          </div>

          {/* Filter Dropdowns & Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase().replace('_', ' ')}
                </option>
              ))}
            </select>

            {/* Branch Hub Dropdown */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Regional Branches</option>
              {uniqueBranches.map((b) => (
                <option key={b} value={b}>
                  📍 {b} Hub
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Incident Statuses</option>
              <option value="detected">🔴 Detected (Action Required)</option>
              <option value="analyzed">🟡 Analyzed (Ready to Approve)</option>
              <option value="approved">🟢 Approved (Human Authorized)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 ml-auto"
            >
              <option value="risk_desc">Sort: Highest Capital at Risk</option>
              <option value="risk_asc">Sort: Lowest Capital at Risk</option>
              <option value="units_desc">Sort: Highest Units at Risk</option>
              <option value="name_asc">Sort: Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Problems List or Grid */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-cyber-card border border-cyber-border p-8">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Matching Retail Crises Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or clearing selected category and branch filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBranch('all');
                setSelectedStatus('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onAnalyze={handleAnalyze}
                onOpenReport={handleOpenReport}
                onEdit={handleEditProblem}
                onDelete={handleDeleteProblem}
                isAnalyzingThis={analyzingId === problem.id}
              />
            ))}
          </div>
        ) : (
          <ProblemTable
            problems={filteredProblems}
            onAnalyze={handleAnalyze}
            onOpenReport={handleOpenReport}
            onEdit={handleEditProblem}
            onDelete={handleDeleteProblem}
            analyzingId={analyzingId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-cyber-border bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Business Rescue OS — Autonomous Multi-Agent Retail Supply Chain Recovery</span>
          </div>
          <div>
            Built with Groq LPUs, DuckDuckGo Live Search, FastAPI & React
          </div>
        </div>
      </footer>

      {/* Flagship Agent War Room Inspection Modal */}
      <AgentWarRoomModal
        report={selectedReport}
        isOpen={isWarRoomOpen}
        onClose={() => setIsWarRoomOpen(false)}
        onApprove={handleApprove}
        onOpenMemo={() => setIsMemoOpen(true)}
        isApproving={isApproving}
      />

      {/* 3-Minute Hackathon Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

      {/* Executive Printable Memorandum Modal */}
      <ExecutiveMemoModal
        report={selectedReport}
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
      />

      {/* Register New Stock Incident Modal (doubles as Edit form) */}
      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        editingProblem={editingProblem}
        onClose={() => {
          setIsNewIncidentOpen(false);
          setEditingProblem(null);
        }}
        onCreated={(saved) => {
          sound.playClick();
          setEditingProblem(null);
          fetchData();
        }}
      />
    </div>
  );
};

export default App;
