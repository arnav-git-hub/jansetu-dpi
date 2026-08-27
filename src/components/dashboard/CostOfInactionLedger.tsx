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
    <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border border-red-800/80 rounded-2xl p-4 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold animate-pulse">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-red-300 uppercase tracking-wider">
              Cost-of-Inaction Live Ledger
            </h4>
            <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
              Ticking Counter
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Accrued cost of delay across unfunded hotspots (medical care, lost work hours, student dropouts)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-red-900/60 shrink-0">
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Cumulative Delay Cost</span>
          <span className="font-black text-2xl font-mono text-red-400 tracking-tight">
            ₹{totalAccruedCost.toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-slate-300 border-l border-slate-800 pl-3">
          <span>Daily Rate:</span>
          <p className="font-bold text-amber-400">₹{totalBaseCostPerDay.toLocaleString()}/day</p>
        </div>
      </div>
    </div>
  );
});

CostOfInactionLedger.displayName = 'CostOfInactionLedger';
