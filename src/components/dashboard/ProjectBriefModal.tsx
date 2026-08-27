import React from 'react';
import { X, FileText, CheckCircle, ShieldCheck, Building2, Printer, Leaf, IndianRupee, TrendingUp } from 'lucide-react';
import { DemandHotspot } from '../../types';
import { SDGBadges } from '../common/SDGBadges';

interface ProjectBriefModalProps {
  hotspot: DemandHotspot | null;
  onClose: () => void;
}

export const ProjectBriefModal: React.FC<ProjectBriefModalProps> = ({ hotspot, onClose }) => {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 text-white max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">AI-Drafted Detailed Project Report (DPR) Brief</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable DPR Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Government Watermark Header */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-amber-400" />
              <div>
                <h4 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                  Government of India — Ministry of Panchayati Raj & NITI Aayog
                </h4>
                <p className="text-[10px] text-slate-400">JanSetu Automated DPR Brief Ref: #DPR-2026-JS-{hotspot.id}</p>
              </div>
            </div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-1 rounded">
              CONFIDENTIAL PLANNING BRIEF
            </span>
          </div>

          {/* Title & Core Meta */}
          <div className="space-y-1 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
            <h3 className="text-base font-extrabold text-white">{hotspot.title}</h3>
            <p className="text-slate-300">
              Location: <strong>{hotspot.villageOrWard}, District {hotspot.district}, {hotspot.state}</strong>
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-slate-300">
              <span>Priority Score: <strong className="text-amber-400 font-mono text-sm">{hotspot.priorityScore.toFixed(1)} / 100</strong></span>
              <span>Target Beneficiaries: <strong className="text-emerald-400 font-mono text-sm">{hotspot.totalAffectedPopulation.toLocaleString()} citizens</strong></span>
              <span>Estimated Cost: <strong className="text-slate-100 font-mono text-sm">₹{hotspot.estimatedCostLakhs} Lakhs</strong></span>
            </div>
          </div>

          {/* Executive Rationale */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">1. Executive Summary & Need Rationale</h4>
            <p className="text-slate-300 leading-relaxed">
              Synthesized from {hotspot.reportCount} on-ground citizen voice and photo submissions in local languages. The primary infrastructure deficit gap stands at {hotspot.infraDeficitGapScore}/10 compared to state benchmarks. High severity risk ({hotspot.avgSeverityIndex}/10) warrants immediate capital expenditure approval.
            </p>
          </div>

          {/* Matched Scheme & Budget Alignment */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">2. Scheme Alignment & Funding Source</h4>
            <p className="text-slate-300">
              Auto-matched to: <strong className="text-blue-300">{hotspot.matchedScheme?.schemeName || 'State Infrastructure Pool'}</strong> under {hotspot.matchedScheme?.ministry || 'Ministry of Rural Development'}.
            </p>
            <p className="text-slate-400">Available District Allocation: {hotspot.matchedScheme?.fundingPoolAvailableINR || '₹10 Crores'}.</p>
          </div>

          {/* SDG Alignment */}
          {hotspot.sdgGoals && hotspot.sdgGoals.length > 0 && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">3. UN Sustainable Development Goal (SDG) Alignment</h4>
              <SDGBadges goals={hotspot.sdgGoals} size="sm" />
              <p className="text-slate-400 text-[11px] leading-relaxed">
                This project directly contributes to India's Voluntary National Review (VNR) SDG commitments. Completion will be logged in the National SDG Monitoring Framework (NITI Aayog SDG Index).
              </p>
            </div>
          )}

          {/* Economic ROI & Environmental Co-Benefit */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">4. Economic ROI & Environmental Co-Benefit Analysis</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-3 text-center">
                <IndianRupee className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="font-black text-emerald-400 text-base">{hotspot.economicROIMultiplier || 4.5}x</p>
                <span className="text-[10px] text-slate-400">Economic ROI</span>
              </div>
              <div className="bg-green-950/40 border border-green-800/50 rounded-xl p-3 text-center">
                <Leaf className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="font-black text-green-400 text-base">{hotspot.co2SavedTonsPerYear || 0}T</p>
                <span className="text-[10px] text-slate-400">CO₂ Saved/Year</span>
              </div>
              <div className="bg-sky-950/40 border border-sky-800/50 rounded-xl p-3 text-center">
                <TrendingUp className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <p className="font-black text-sky-400 text-base">₹{Math.round((hotspot.estimatedCostLakhs * (hotspot.economicROIMultiplier || 4.5))).toLocaleString()}L</p>
                <span className="text-[10px] text-slate-400">Total Economic Return</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Source: NITI Aayog DPI Impact Framework v3.2 — Infrastructure ROI multipliers calibrated to district-level GSDP data.</p>
          </div>

          {/* Implementation Timeline & Milestones */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">5. Execution Milestones & Audit Triggers</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1 font-mono text-[11px]">
              <li>Month 1: Tender Award & SHA-256 Audit Chain Ledger Init</li>
              <li>Month 2: Foundation & Local Panchayat Verification (30% Disbursement)</li>
              <li>Month 4: Main Structural Work & Citizen Photo Submissions (50% Disbursement)</li>
              <li>Month 6: Satellite Optical Change Verification & Final Audit (20% Release)</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-3 mt-3 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Ready for Planning Committee Review</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
