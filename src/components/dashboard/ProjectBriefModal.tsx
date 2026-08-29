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
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 text-on-surface max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-container" />
            <h3 className="font-bold text-base font-headline-lg text-on-surface">AI-Drafted Detailed Project Report (DPR) Brief</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable DPR Content */}
        <div className="flex-1 overflow-y-auto terminal-scroll space-y-4 pr-1 text-xs">
          {/* Government Watermark Header */}
          <div className="bg-[#0D1B2A] p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary-container" />
              <div>
                <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider font-headline-lg">
                  Government of India — Ministry of Panchayati Raj & NITI Aayog
                </h4>
                <p className="text-[10px] text-on-surface-variant font-mono">JanSetu Automated DPR Brief Ref: #DPR-2026-JS-{hotspot.id}</p>
              </div>
            </div>
            <span className="bg-primary-container/20 text-primary-container border border-primary-container/30 text-[10px] font-bold px-2 py-1 rounded font-mono">
              CONFIDENTIAL PLANNING BRIEF
            </span>
          </div>

          {/* Title & Core Meta */}
          <div className="space-y-1 bg-[#1B263B] p-4 rounded-xl border border-white/10">
            <h3 className="text-base font-bold text-on-surface font-headline-lg">{hotspot.title}</h3>
            <p className="text-on-surface-variant">
              Location: <strong className="text-on-surface">{hotspot.villageOrWard}, District {hotspot.district}, {hotspot.state}</strong>
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-on-surface-variant">
              <span>Priority Score: <strong className="text-primary-container font-mono text-sm">{hotspot.priorityScore.toFixed(1)} / 100</strong></span>
              <span>Target Beneficiaries: <strong className="text-tertiary font-mono text-sm">{hotspot.totalAffectedPopulation.toLocaleString()} citizens</strong></span>
              <span>Estimated Cost: <strong className="text-on-surface font-mono text-sm">₹{hotspot.estimatedCostLakhs} Lakhs</strong></span>
            </div>
          </div>

          {/* Executive Rationale */}
          <div className="p-4 bg-[#0D1B2A] rounded-xl border border-white/10 space-y-2">
            <h4 className="font-bold text-primary-container text-xs uppercase tracking-wider font-headline-lg">1. Executive Summary & Need Rationale</h4>
            <p className="text-on-surface-variant leading-relaxed">
              Synthesized from {hotspot.reportCount} on-ground citizen voice and photo submissions in local languages. The primary infrastructure deficit gap stands at {hotspot.infraDeficitGapScore}/10 compared to state benchmarks. High severity risk ({hotspot.avgSeverityIndex}/10) warrants immediate capital expenditure approval.
            </p>
          </div>

          {/* Matched Scheme & Budget Alignment */}
          <div className="p-4 bg-[#0D1B2A] rounded-xl border border-white/10 space-y-2">
            <h4 className="font-bold text-primary-container text-xs uppercase tracking-wider font-headline-lg">2. Scheme Alignment & Funding Source</h4>
            <p className="text-on-surface-variant">
              Auto-matched to: <strong className="text-secondary">{hotspot.matchedScheme?.schemeName || 'State Infrastructure Pool'}</strong> under {hotspot.matchedScheme?.ministry || 'Ministry of Rural Development'}.
            </p>
            <p className="text-on-surface-variant/80">Available District Allocation: {hotspot.matchedScheme?.fundingPoolAvailableINR || '₹10 Crores'}.</p>
          </div>

          {/* SDG Alignment */}
          {hotspot.sdgGoals && hotspot.sdgGoals.length > 0 && (
            <div className="p-4 bg-[#0D1B2A] rounded-xl border border-white/10 space-y-2">
              <h4 className="font-bold text-primary-container text-xs uppercase tracking-wider font-headline-lg">3. UN Sustainable Development Goal (SDG) Alignment</h4>
              <SDGBadges goals={hotspot.sdgGoals} size="sm" />
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                This project directly contributes to India's Voluntary National Review (VNR) SDG commitments. Completion will be logged in the National SDG Monitoring Framework (NITI Aayog SDG Index).
              </p>
            </div>
          )}

          {/* Economic ROI & Environmental Co-Benefit */}
          <div className="p-4 bg-[#0D1B2A] rounded-xl border border-white/10 space-y-3">
            <h4 className="font-bold text-primary-container text-xs uppercase tracking-wider font-headline-lg">4. Economic ROI & Environmental Co-Benefit Analysis</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-surface-container-low border border-white/5 rounded-xl p-3 text-center">
                <IndianRupee className="w-4 h-4 text-tertiary mx-auto mb-1" />
                <p className="font-bold text-tertiary text-base font-headline-lg">{hotspot.economicROIMultiplier || 4.5}x</p>
                <span className="text-[10px] text-on-surface-variant">Economic ROI</span>
              </div>
              <div className="bg-surface-container-low border border-white/5 rounded-xl p-3 text-center">
                <Leaf className="w-4 h-4 text-secondary mx-auto mb-1" />
                <p className="font-bold text-secondary text-base font-headline-lg">{hotspot.co2SavedTonsPerYear || 0}T</p>
                <span className="text-[10px] text-on-surface-variant">CO₂ Saved/Year</span>
              </div>
              <div className="bg-surface-container-low border border-white/5 rounded-xl p-3 text-center">
                <TrendingUp className="w-4 h-4 text-primary-container mx-auto mb-1" />
                <p className="font-bold text-primary-container text-base font-headline-lg">₹{Math.round((hotspot.estimatedCostLakhs * (hotspot.economicROIMultiplier || 4.5))).toLocaleString()}L</p>
                <span className="text-[10px] text-on-surface-variant">Total Economic Return</span>
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant">Source: NITI Aayog DPI Impact Framework v3.2 — Infrastructure ROI multipliers calibrated to district-level GSDP data.</p>
          </div>

          {/* Implementation Timeline & Milestones */}
          <div className="p-4 bg-[#0D1B2A] rounded-xl border border-white/10 space-y-2">
            <h4 className="font-bold text-primary-container text-xs uppercase tracking-wider font-headline-lg">5. Execution Milestones & Audit Triggers</h4>
            <ul className="list-disc list-inside text-on-surface-variant space-y-1 font-mono text-[11px]">
              <li>Month 1: Tender Award & SHA-256 Audit Chain Ledger Init</li>
              <li>Month 2: Foundation & Local Panchayat Verification (30% Disbursement)</li>
              <li>Month 4: Main Structural Work & Citizen Photo Submissions (50% Disbursement)</li>
              <li>Month 6: Satellite Optical Change Verification & Final Audit (20% Release)</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-3 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-tertiary">
            <ShieldCheck className="w-4 h-4" />
            <span>Ready for Planning Committee Review</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-white/10"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-container hover:opacity-90 text-on-primary-container rounded-lg text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
