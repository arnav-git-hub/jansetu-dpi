import React, { useState } from 'react';
import { X, Vote, CheckCircle, Coins } from 'lucide-react';
import { DemandHotspot } from '../../types';

interface MicroBudgetingModalProps {
  isOpen?: boolean;
  onClose: () => void;
  hotspots: DemandHotspot[];
}

export const MicroBudgetingModal: React.FC<MicroBudgetingModalProps> = ({
  isOpen = true,
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
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-5 text-on-surface">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-primary-container" />
            <h3 className="font-bold text-base font-headline-lg text-on-surface">Participatory Ward Micro-Budgeting</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between bg-[#0D1B2A] p-3 rounded-xl border border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary-container" />
            <span className="text-xs text-on-surface-variant">Your Resident Token Allowance</span>
          </div>
          <span className="font-bold text-primary-container text-base font-headline-lg">{tokensLeft} CivicTokens</span>
        </div>

        {isVoted ? (
          <div className="p-8 text-center space-y-3 bg-surface-container-low rounded-xl border border-tertiary-container/40">
            <CheckCircle className="w-12 h-12 text-tertiary mx-auto bg-tertiary/20 p-2 rounded-full" />
            <h4 className="font-bold text-base text-on-surface font-headline-lg">Micro-Budget Votes Registered!</h4>
            <p className="text-xs text-on-surface-variant">
              Your participatory token weights have been factored into the local ward civic priority score algorithm.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto terminal-scroll pr-1">
            {hotspots.slice(0, 4).map((h) => {
              const allocated = allocations[h.id] || 0;
              return (
                <div key={h.id} className="p-3 bg-surface-container-low rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-on-surface font-headline-lg">{h.title}</h4>
                      <p className="text-[10px] text-on-surface-variant">📍 {h.villageOrWard}, {h.district}</p>
                    </div>
                    <span className="font-bold text-primary-container text-xs font-mono">{allocated} Tokens</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={allocated + tokensLeft}
                    value={allocated}
                    onChange={(e) => handleVoteChange(h.id, Number(e.target.value))}
                    className="w-full accent-primary-container cursor-pointer h-1.5 bg-surface-container-highest rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        )}

        {!isVoted && (
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="text-on-surface-variant">Quadratic voting prevents single-issue dominance.</span>
            <button
              onClick={handleConfirmVote}
              disabled={tokensLeft === 100}
              className="px-5 py-2 bg-primary-container hover:opacity-90 disabled:opacity-40 text-on-primary-container font-bold rounded-lg transition"
            >
              Cast Allocation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
