import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { DemandHotspot } from '../../types';

interface CostOfInactionLedgerProps {
  hotspots: DemandHotspot[];
}

export const CostOfInactionLedger: React.FC<CostOfInactionLedgerProps> = React.memo(({ hotspots }) => {
  const totalBaseCostPerDay = useMemo(
    () => hotspots.reduce((acc, h) => acc + h.costOfInactionAccruedPerDayINR, 0),
    [hotspots]
  );
  const [totalAccruedCost, setTotalAccruedCost] = useState(148500);
  const costRef = useRef(totalAccruedCost);
  costRef.current = totalAccruedCost;

  useEffect(() => {
    const tick = Math.floor(totalBaseCostPerDay / 86400 * 5) + 12;
    const interval = setInterval(() => {
      setTotalAccruedCost(costRef.current + tick);
    }, 500);

    return () => clearInterval(interval);
  }, [totalBaseCostPerDay]);

  return (
    <div className="bg-[#1B263B] border-l-4 border-error border border-white/10 rounded-xl p-4 text-on-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-error/20 text-error border border-error/30 flex items-center justify-center font-bold animate-pulse">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-error uppercase tracking-wider font-headline-lg">
              Cost-of-Inaction Live Ledger
            </h4>
            <span className="bg-error-container/30 text-error text-[10px] font-bold px-2 py-0.5 rounded-full border border-error/40 font-mono">
              Ticking Counter
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Accrued economic & health loss across unfunded hotspots (medical care, lost work hours, student dropouts)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
        <div className="text-right">
          <span className="text-[10px] text-on-surface-variant block uppercase font-mono">Total Cumulative Delay Cost</span>
          <span className="font-bold text-2xl font-mono text-error tracking-tight font-headline-lg">
            ₹{totalAccruedCost.toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-on-surface-variant border-l border-white/10 pl-3">
          <span>Daily Rate:</span>
          <p className="font-bold text-primary-container font-mono">₹{totalBaseCostPerDay.toLocaleString()}/day</p>
        </div>
      </div>
    </div>
  );
});

CostOfInactionLedger.displayName = 'CostOfInactionLedger';
