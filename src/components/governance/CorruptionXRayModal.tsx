import React, { useState } from 'react';
import { X, ShieldAlert, Eye, AlertTriangle, Lock, CheckCircle2 } from 'lucide-react';
import { SEEDED_CORRUPTION_CASES } from '../../data/seedData';
import { CorruptionCase } from '../../types';

interface CorruptionXRayModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const CorruptionXRayModal: React.FC<CorruptionXRayModalProps> = ({ isOpen = true, onClose }) => {
  const [selectedCase, setSelectedCase] = useState<CorruptionCase>(SEEDED_CORRUPTION_CASES[0]);
  const [isFrozen, setIsFrozen] = useState(false);

  if (!isOpen) return null;

  const handleFreezeFunds = () => {
    setIsFrozen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-error/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl p-6 text-on-surface max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-error animate-pulse" />
            <div>
              <h3 className="font-bold text-base text-error font-headline-lg">Corruption X-Ray: AI Forensic Audit</h3>
              <p className="text-[11px] text-on-surface-variant">Cross-checking contractor claimed photos against Sentinel-2 satellite imagery & citizen reports</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Selector */}
        <div className="flex gap-2 mb-4 shrink-0 overflow-x-auto terminal-scroll">
          {SEEDED_CORRUPTION_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCase(c);
                setIsFrozen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border text-left truncate ${
                selectedCase.id === c.id
                  ? 'bg-error-container/30 border-error text-error'
                  : 'bg-[#0D1B2A] border-white/10 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {c.projectTitle}
            </button>
          ))}
        </div>

        {/* Audit Details Body */}
        <div className="flex-1 overflow-y-auto terminal-scroll space-y-4 pr-1 text-xs">
          <div className="bg-[#0D1B2A] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-mono block">Contractor Entity</span>
              <h4 className="font-bold text-on-surface text-sm font-headline-lg">{selectedCase.contractorName}</h4>
              <p className="text-on-surface-variant">District: {selectedCase.district}</p>
            </div>
            <div className="flex gap-3">
              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant uppercase font-mono block">Disbursed Funds</span>
                <span className="font-bold text-on-surface font-mono">₹{selectedCase.fundsDisbursedLakhs} Lakhs</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant uppercase font-mono block">Anomaly Score</span>
                <span className="font-bold text-error text-base font-mono">{selectedCase.anomalyScore} / 100</span>
              </div>
            </div>
          </div>

          {/* Triangulation Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-surface-container-low rounded-xl border border-white/5 space-y-1">
              <span className="text-primary-container font-semibold block text-[11px]">1. Contractor Photo Claim</span>
              <p className="text-on-surface-variant text-[11px]">{selectedCase.contractorClaimPhotoDesc}</p>
              <span className="text-[10px] text-primary-container block font-mono">Submitted: 100% Complete</span>
            </div>

            <div className="p-3 bg-surface-container-low border border-error/30 rounded-xl space-y-1">
              <span className="text-error font-semibold block text-[11px]">2. Sentinel Satellite Pass</span>
              <p className="text-on-surface-variant text-[11px]">{selectedCase.satelliteVerificationResult}</p>
              <span className="text-[10px] text-error block font-mono">Optical match: &lt; 15%</span>
            </div>

            <div className="p-3 bg-surface-container-low border border-secondary/30 rounded-xl space-y-1">
              <span className="text-secondary font-semibold block text-[11px]">3. Ground Citizen Reports</span>
              <p className="text-on-surface-variant text-[11px]">{selectedCase.citizenGroundReportsSummary}</p>
              <span className="text-[10px] text-secondary block font-mono">42 Reports confirming zero road</span>
            </div>
          </div>

          {/* Anomaly Details */}
          <div className="p-4 bg-error-container/10 border border-error/30 rounded-xl text-error space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs font-headline-lg">
              <AlertTriangle className="w-4 h-4" /> Flagged Forensic Discrepancy
            </div>
            <p className="text-[11px] text-on-surface leading-relaxed">{selectedCase.anomalyDetails}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            {isFrozen ? (
              <span className="text-error font-bold flex items-center gap-1 bg-error-container/20 px-3 py-1.5 rounded-lg border border-error/40">
                <Lock className="w-3.5 h-3.5" /> Direct Benefit / Treasury Escrow Frozen!
              </span>
            ) : (
              <span className="text-on-surface-variant">Recommended Action: Instant automated treasury freeze.</span>
            )}
          </div>

          <div className="flex gap-2">
            {!isFrozen && (
              <button
                onClick={handleFreezeFunds}
                className="px-4 py-2 bg-error-container hover:opacity-90 text-on-error-container rounded-lg font-bold flex items-center gap-1.5 transition shadow"
              >
                <Lock className="w-3.5 h-3.5" /> Auto-Freeze Escrow Account
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-lg font-medium border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
