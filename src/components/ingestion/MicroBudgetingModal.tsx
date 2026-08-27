import React, { useState } from 'react';
import { X, Vote, CheckCircle, Sparkles, Coins } from 'lucide-react';
import { DemandHotspot } from '../../types';

interface MicroBudgetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: DemandHotspot[];
}

export const MicroBudgetingModal: React.FC<MicroBudgetingModalProps> = ({
  isOpen,
  onClose,
  hotspots
}) => {
  const [tokensLeft, setTokensLeft] = useState(100);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isVoted, setIsVoted] = useState(false);

  if (!isOpen) return null;

  const handleVoteChange = (id: string, newAmount: number) => {
    const currentAllocated = allocations[id] || 0;
    const diff = newAmount - currentAllocated;

    if (tokensLeft - diff >= 0 && newAmount >= 0) {
      setAllocations((prev) => ({ ...prev, [id]: newAmount }));
      setTokensLeft((prev) => prev - diff);
    }
  };

  const handleConfirmVote = () => {
    setIsVoted(true);
    setTimeout(() => {
      setIsVoted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-5 text-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Participatory Micro-Budgeting</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-slate-300">Your Ward Resident Token Allowance</span>
          </div>
          <span className="font-extrabold text-amber-400 text-base">{tokensLeft} JanTokens</span>
        </div>

        {isVoted ? (
          <div className="p-8 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-base text-emerald-400">Votes Recorded on Audit Ledger!</h4>
            <p className="text-xs text-slate-300">Your resident preferences directly weight the Ward Priority Score formula.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 text-xs">
            {hotspots.map((h) => {
              const allocated = allocations[h.id] || 0;
              return (
                <div key={h.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{h.title}</span>
                    <span className="text-amber-400 font-bold">{allocated} Tokens</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Est. Cost: ₹{h.estimatedCostLakhs} Lakhs | Affected: {h.totalAffectedPopulation.toLocaleString()} citizens
                  </p>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={allocated}
                    onChange={(e) => handleVoteChange(h.id, Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        )}

        {!isVoted && (
          <div className="mt-4 flex justify-between items-center border-t border-slate-800 pt-3">
            <span className="text-xs text-slate-400">Direct democracy in action</span>
            <button
              onClick={handleConfirmVote}
              disabled={tokensLeft === 100}
              className={`px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition ${
                tokensLeft === 100
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              Confirm Micro-Budget Vote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
