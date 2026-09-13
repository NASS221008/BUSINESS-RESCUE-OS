import React, { useEffect, useState } from 'react';
import { X, PackagePlus, Loader2 } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { ProblemItem } from '../types/data';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (problem: ProblemItem) => void;
  editingProblem?: ProblemItem | null;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({ isOpen, onClose, onCreated, editingProblem }) => {
  const isEditing = Boolean(editingProblem);

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('General Merchandise');
  const [branch, setBranch] = useState('');
  const [unitsInStock, setUnitsInStock] = useState('');
  const [unitsAtRisk, setUnitsAtRisk] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [problemType, setProblemType] = useState('Excess Inventory');
  const [rootCause, setRootCause] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Prefill the form whenever we're opened in "edit" mode for a specific incident
  useEffect(() => {
    if (editingProblem) {
      setProductName(editingProblem.product_name || '');
      setCategory(editingProblem.category || 'General Merchandise');
      setBranch(editingProblem.branch || '');
      setUnitsInStock(String((editingProblem as any).units_in_stock ?? ''));
      setUnitsAtRisk(String(editingProblem.units_at_risk ?? ''));
      setUnitPrice(String((editingProblem as any).unit_price ?? ''));
      setProblemType(editingProblem.problem_type || 'Excess Inventory');
      setRootCause(editingProblem.root_cause || '');
    } else if (isOpen) {
      // fresh "New Incident" open — start blank
      setProductName('');
      setCategory('General Merchandise');
      setBranch('');
      setUnitsInStock('');
      setUnitsAtRisk('');
      setUnitPrice('');
      setProblemType('Excess Inventory');
      setRootCause('');
    }
    setErrorMsg(null);
  }, [editingProblem, isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setProductName('');
    setCategory('General Merchandise');
    setBranch('');
    setUnitsInStock('');
    setUnitsAtRisk('');
    setUnitPrice('');
    setProblemType('Excess Inventory');
    setRootCause('');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);

    try {
      const path = isEditing ? `/api/problems/${editingProblem!.id}` : '/api/problems';
      const method = isEditing ? 'PUT' : 'POST';

      const resp = await apiFetch(path, {
        method,
        body: JSON.stringify({
          product_name: productName,
          category,
          branch: branch || 'Central Warehouse',
          units_in_stock: Number(unitsInStock) || 0,
          units_at_risk: Number(unitsAtRisk) || 0,
          unit_price: Number(unitPrice) || 0,
          problem_type: problemType,
          root_cause: rootCause || 'Not specified.',
        }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.detail || `Server returned ${resp.status}`);
      }

      const saved: ProblemItem = await resp.json();
      onCreated(saved);
      resetForm();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not save this incident. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-cyber-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              {isEditing ? 'Edit Stock Incident' : 'Register a New Stock Incident'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Product name *</label>
            <input
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM4 Wireless Headphones"
              className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Consumer Electronics"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Branch / Location</label>
              <input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Chennai"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Units in stock</label>
              <input
                type="number"
                min={0}
                value={unitsInStock}
                onChange={(e) => setUnitsInStock(e.target.value)}
                placeholder="500"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Units at risk *</label>
              <input
                required
                type="number"
                min={0}
                value={unitsAtRisk}
                onChange={(e) => setUnitsAtRisk(e.target.value)}
                placeholder="300"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Unit price (₹) *</label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="1000"
                className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Problem type</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option>Excess Inventory</option>
              <option>Slow Moving</option>
              <option>Expiry Risk</option>
              <option>Overstock</option>
              <option>Seasonal Markdown</option>
              <option>Competitor Pricing</option>
              <option>Quality Defect</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Root cause (optional)</label>
            <textarea
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              rows={2}
              placeholder="e.g. Demand shifted after a newer model launched."
              className="w-full bg-slate-950 border border-cyber-border rounded-xl py-2.5 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-lg px-3 py-2">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackagePlus className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Save Incident'}
          </button>
          <p className="text-[11px] text-slate-500 text-center">
            {isEditing
              ? 'Saving will clear any existing analysis for this incident — re-run "Analyze" afterward.'
              : 'After saving, click "Analyze" on its card to have the AI agents research it and build a recovery plan.'}
          </p>
        </form>
      </div>
    </div>
  );
};
