import React, { useState } from 'react';
import { X, ShieldAlert, Eye, AlertTriangle, Lock, CheckCircle2 } from 'lucide-react';
import { SEEDED_CORRUPTION_CASES } from '../../data/seedData';
import { CorruptionCase } from '../../types';

interface CorruptionXRayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorruptionXRayModal: React.FC<CorruptionXRayModalProps> = ({ isOpen, onClose }) => {
  const [selectedCase, setSelectedCase] = useState<CorruptionCase>(SEEDED_CORRUPTION_CASES[0]);
  const [isFrozen, setIsFrozen] = useState(false);

  if (!isOpen) return null;

  const handleFreezeFunds = () => {
    setIsFrozen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-900/60 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl p-6 text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-base text-red-400">Corruption X-Ray: AI Audit Agent</h3>
              <p className="text-[11px] text-slate-400">Cross-checking contractor claimed photos against Sentinel-2 satellite imagery & citizen reports</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Selector */}
        <div className="flex gap-2 mb-4 shrink-0 overflow-x-auto">
          {SEEDED_CORRUPTION_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCase(c);
                setIsFrozen(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border text-left truncate ${
                selectedCase.id === c.id
                  ? 'bg-red-950 border-red-500 text-red-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.projectTitle}
            </button>
          ))}
        </div>

        {/* Audit Details Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-white">{selectedCase.projectTitle}</h4>
              <p className="text-slate-400">Contractor: <strong className="text-slate-200">{selectedCase.contractorName}</strong> ({selectedCase.location})</p>
              <p className="text-slate-400">Disbursed Amount: <strong className="text-amber-400">₹{selectedCase.amountDisbursedLakhs} Lakhs</strong></p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">AI Fraud Probability</span>
              <span className="text-2xl font-black font-mono text-red-500">
                {selectedCase.aiFraudProbabilityPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Side-by-Side Photo & Satellite X-Ray Comparator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contractor Submitted Photo */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span>Contractor Submitted Photo</span>
                <span className="text-red-400 bg-red-950 border border-red-800 px-2 py-0.5 rounded text-[10px]">
                  Claimed: 100% Complete
                </span>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-slate-800 h-44">
                <img
                  src={selectedCase.contractorPhotoUrl}
                  alt="Contractor claim"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/20" />
              </div>
            </div>

            {/* Satellite Imagery Verification */}
            <div className="bg-slate-950 p-3 rounded-xl border border-red-900/60 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-red-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Sentinel-2 Satellite Verification Overlay
                </span>
                <span className="text-amber-400 font-mono text-[10px]">Pass 2026-08-20</span>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-red-800 h-44">
                <img
                  src={selectedCase.satellitePhotoUrl}
                  alt="Satellite pass"
                  className="w-full h-full object-cover"
                />
                {/* Simulated Computer Vision Discrepancy Heatmap Overlay */}
                <div className="absolute inset-0 bg-red-600/30 backdrop-hue-rotate-90 flex items-center justify-center">
                  <span className="bg-red-950/90 text-red-300 border border-red-500 px-3 py-1 rounded-full text-[11px] font-mono font-bold animate-pulse">
                    ⚠️ SATELLITE OPTICAL MISMATCH DETECTED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Discrepancies List */}
          <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-xl space-y-2">
            <h4 className="font-bold text-red-400 text-xs flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Detected Fraud Discrepancies
            </h4>
            <ul className="list-disc list-inside text-slate-200 space-y-1">
              {selectedCase.detectedDiscrepancies.map((disc, idx) => (
                <li key={idx} className="leading-relaxed">{disc}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-3 mt-3 shrink-0">
          <div className="text-xs text-slate-400">
            Status: <strong className="text-amber-400">{isFrozen ? 'FUNDS_FROZEN' : selectedCase.auditFlagStatus}</strong>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFreezeFunds}
              disabled={isFrozen}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isFrozen
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
              }`}
            >
              {isFrozen ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isFrozen ? 'Contractor Escrow Frozen' : 'Trigger Automated Escrow Freeze'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
