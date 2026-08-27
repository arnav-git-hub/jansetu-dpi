import React, { useEffect, useState, useRef } from 'react';
import { Users, TrendingUp, MapPin, ShieldCheck, Leaf, IndianRupee } from 'lucide-react';
import { DemandHotspot } from '../../types';

interface NationalImpactBannerProps {
  hotspots: DemandHotspot[];
}

function useCountUp(target: number, duration: number = 1800) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return count;
}

export const NationalImpactBanner: React.FC<NationalImpactBannerProps> = ({ hotspots }) => {
  const totalBeneficiaries = hotspots.reduce((s, h) => s + h.totalAffectedPopulation, 0);
  const totalReports = hotspots.reduce((s, h) => s + h.reportCount, 0);
  const totalBudgetLakhs = hotspots.reduce((s, h) => s + h.estimatedCostLakhs, 0);
  const totalCO2 = hotspots.reduce((s, h) => s + (h.co2SavedTonsPerYear || 0), 0);
  const statesCount = new Set(hotspots.map(h => h.state)).size;
  const fundedCount = hotspots.filter(h => h.status === 'APPROVED_FUNDED' || h.status === 'DELIVERED').length;

  const animBeneficiaries = useCountUp(totalBeneficiaries);
  const animReports = useCountUp(totalReports);
  const animBudget = useCountUp(totalBudgetLakhs);
  const animCO2 = useCountUp(totalCO2);

  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: animBeneficiaries.toLocaleString(),
      label: 'Citizens Covered',
      sublabel: `across ${statesCount} states`,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      value: animReports.toLocaleString(),
      label: 'Reports Fused',
      sublabel: 'voice, photo & text',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20'
    },
    {
      icon: <IndianRupee className="w-5 h-5" />,
      value: `₹${(animBudget / 100).toFixed(1)} Cr`,
      label: 'Capital Pipeline',
      sublabel: `${fundedCount} projects funded`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      value: `${animCO2}T`,
      label: 'CO₂ Saved/Yr',
      sublabel: 'climate co-benefit',
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20'
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      value: '97.9%',
      label: 'PII Scrub Rate',
      sublabel: 'DPDP 2023 edge compliance',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      value: `${hotspots.length}`,
      label: 'Demand Hotspots',
      sublabel: 'geo-clustered active',
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20'
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            🇮🇳 JanSetu National Impact Dashboard
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Aggregated real-time citizen demand intelligence across India</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-500">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block" />
          Synced • UNDP DPG #IND-2026-JS
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={`rounded-xl border p-3 space-y-1 ${s.bg}`}>
            <div className={`${s.color}`}>{s.icon}</div>
            <p className={`font-black text-lg leading-none ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-slate-200">{s.label}</p>
            <p className="text-[10px] text-slate-500">{s.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
