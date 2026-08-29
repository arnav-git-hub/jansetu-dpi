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
      icon: <Users className="w-4 h-4" />,
      value: animBeneficiaries.toLocaleString(),
      label: 'Citizens Impacted',
      sublabel: `across ${statesCount} states`,
      color: 'text-primary-container',
      bg: 'bg-surface-container-low border-l-2 border-primary-container'
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      value: animReports.toLocaleString(),
      label: 'Reports Fused',
      sublabel: 'voice, photo & text',
      color: 'text-secondary',
      bg: 'bg-surface-container-low border-l-2 border-secondary'
    },
    {
      icon: <IndianRupee className="w-4 h-4" />,
      value: `₹${(animBudget / 100).toFixed(1)} Cr`,
      label: 'Capital Pipeline',
      sublabel: `${fundedCount} schemes linked`,
      color: 'text-tertiary-container',
      bg: 'bg-surface-container-low border-l-2 border-tertiary-container'
    },
    {
      icon: <Leaf className="w-4 h-4" />,
      value: `${animCO2}T`,
      label: 'CO₂ Saved/Yr',
      sublabel: 'climate co-benefit',
      color: 'text-tertiary',
      bg: 'bg-surface-container-low border-l-2 border-tertiary'
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      value: '99.2%',
      label: 'PII Scrub Rate',
      sublabel: 'DPDP 2023 compliance',
      color: 'text-secondary-fixed',
      bg: 'bg-surface-container-low border-l-2 border-secondary-fixed'
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      value: `${hotspots.length}`,
      label: 'Demand Hotspots',
      sublabel: 'active geo-clusters',
      color: 'text-error',
      bg: 'bg-surface-container-low border-l-2 border-error'
    },
  ];

  return (
    <div className="bg-[#1B263B] border border-white/10 rounded-xl p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm font-headline-lg text-on-surface flex items-center gap-2">
            JanSetu National DPI Live Aggregation Engine
            <span className="bg-tertiary/20 text-tertiary border border-tertiary/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">Aggregated real-time citizen demand intelligence across India</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-variant font-mono">
          <span className="w-2 h-2 bg-tertiary-container rounded-full animate-pulse inline-block" />
          DPI Node Hash: #IND-2026-JS
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className={`rounded-lg border border-white/5 p-3 space-y-1 ${s.bg}`}>
            <div className={`${s.color}`}>{s.icon}</div>
            <p className={`font-black text-lg leading-none font-headline-lg ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-on-surface">{s.label}</p>
            <p className="text-[10px] text-on-surface-variant">{s.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
