import React from 'react';
import {
  Building2,
  Users,
  FileCheck,
  Swords,
  Activity,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
  Leaf,
  IndianRupee
} from 'lucide-react';
import { DemandHotspot } from '../../types';
import { SDGBadges } from '../common/SDGBadges';

interface HotspotListProps {
  hotspots: DemandHotspot[];
  selectedHotspot: DemandHotspot | null;
  onSelectHotspot: (hotspot: DemandHotspot) => void;
  onOpenProjectBrief: (hotspot: DemandHotspot) => void;
  onOpenSteelmanDebate: (hotspot: DemandHotspot) => void;
  onOpenDigitalTwin: (hotspot: DemandHotspot) => void;
  onOpenCorruptionXRay: () => void;
}

export const HotspotList: React.FC<HotspotListProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onOpenProjectBrief,
  onOpenSteelmanDebate,
  onOpenDigitalTwin,
  onOpenCorruptionXRay
}) => {
  return (
    <div className="space-y-4 text-on-surface">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base font-headline-lg text-on-surface flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary-container" />
          Prioritized Demand Hotspot Rankings ({hotspots.length} Clusters)
        </h3>
        <span className="text-xs text-on-surface-variant font-mono">DBSCAN Clustered</span>
      </div>

      <div className="space-y-3">
        {hotspots.map((h, index) => {
          const isSelected = selectedHotspot?.id === h.id;
          const isCritical = h.priorityScore >= 85;
          const isHigh = h.priorityScore >= 75 && h.priorityScore < 85;

          const borderColor = isCritical ? 'border-error' : isHigh ? 'border-primary-container' : 'border-secondary';
          const scoreColor = isCritical ? 'text-error bg-error-container/20 border-error/40' : isHigh ? 'text-primary-container bg-primary-container/20 border-primary-container/40' : 'text-secondary bg-secondary-container/20 border-secondary/40';
          const isTrending = (h.trendingVelocity || 0) > 5;

          return (
            <div
              key={h.id}
              onClick={() => onSelectHotspot(h)}
              className={`p-4 rounded-xl border transition cursor-pointer shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] relative overflow-hidden border-l-4 ${borderColor} ${
                isSelected
                  ? 'bg-surface-container-high ring-1 ring-primary-container border-white/20'
                  : 'bg-[#1B263B] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Rank Pill + Title Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded bg-surface-container text-on-surface font-bold text-xs flex items-center justify-center border border-white/10 shrink-0 font-mono">
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-on-surface hover:text-primary transition-colors truncate">
                      {h.title}
                    </h4>
                    {isTrending && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-primary-container font-bold">
                        <TrendingUp className="w-3 h-3" /> Trending · {h.trendingVelocity?.toFixed(1)} reports/hr
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className={`px-2.5 py-0.5 rounded text-xs font-bold border flex items-center gap-1 font-mono ${scoreColor}`}>
                    <span>Score:</span>
                    <span className="text-sm">{h.priorityScore.toFixed(1)}</span>
                  </div>
                  {/* Priority score mini bar */}
                  <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCritical ? 'bg-error' : isHigh ? 'bg-primary-container' : 'bg-secondary'
                      }`}
                      style={{ width: `${h.priorityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* SDG Goals */}
              {h.sdgGoals && h.sdgGoals.length > 0 && (
                <div className="mb-2">
                  <SDGBadges goals={h.sdgGoals} size="xs" />
                </div>
              )}

              {/* Location & Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-on-surface-variant my-2.5 bg-surface-container-lowest/80 p-2.5 rounded-lg border border-white/5">
                <div>
                  <span className="text-[10px] text-on-surface-variant opacity-60 block uppercase">Location</span>
                  <span className="font-medium text-on-surface truncate block">📍 {h.villageOrWard}, {h.district}</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant opacity-60 block uppercase">Affected Population</span>
                  <span className="font-bold text-primary-container">{h.totalAffectedPopulation.toLocaleString()} citizens</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant opacity-60 block uppercase">Est. Budget</span>
                  <span className="font-bold text-on-surface">₹{h.estimatedCostLakhs} Lakhs</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant opacity-60 block uppercase">Daily Inaction Loss</span>
                  <span className="font-bold text-error">₹{h.costOfInactionAccruedPerDayINR.toLocaleString()}/day</span>
                </div>
              </div>

              {/* ROI & CO2 row */}
              {(h.economicROIMultiplier || h.co2SavedTonsPerYear) && (
                <div className="flex gap-2 text-xs mb-2">
                  {h.economicROIMultiplier && (
                    <span className="flex items-center gap-1 bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/30 px-2 py-0.5 rounded text-[11px]">
                      <IndianRupee className="w-3 h-3" />
                      <span>{h.economicROIMultiplier}x ROI</span>
                    </span>
                  )}
                  {h.co2SavedTonsPerYear && (
                    <span className="flex items-center gap-1 bg-secondary/10 text-secondary border border-secondary/30 px-2 py-0.5 rounded text-[11px]">
                      <Leaf className="w-3 h-3" />
                      <span>CO₂ -{h.co2SavedTonsPerYear}T/yr</span>
                    </span>
                  )}
                </div>
              )}

              {/* Matched Scheme Badge */}
              {h.matchedScheme && (
                <div className="flex items-center justify-between text-xs mb-2.5 bg-surface-container border border-white/5 px-3 py-1.5 rounded-lg">
                  <span className="text-secondary font-medium flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                    Auto-Matched: <strong>{h.matchedScheme.schemeName}</strong>
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono hidden md:inline">{h.matchedScheme.fundingPoolAvailableINR}</span>
                </div>
              )}

              {/* Action Buttons for Policymakers */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-on-surface-variant">
                  Reports Fused: <strong className="text-on-surface">{h.reportCount} verified</strong>
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onOpenProjectBrief(h)}
                    className="px-2.5 py-1 bg-primary-container text-on-primary-container rounded font-semibold text-xs flex items-center gap-1 hover:opacity-90 transition shadow"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    AI DPR Brief
                  </button>

                  <button
                    onClick={() => onOpenSteelmanDebate(h)}
                    className="px-2.5 py-1 bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary hover:text-on-secondary rounded font-medium text-xs flex items-center gap-1 transition"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    Debate
                  </button>

                  <button
                    onClick={() => onOpenDigitalTwin(h)}
                    className="px-2.5 py-1 bg-tertiary/20 text-tertiary border border-tertiary/40 hover:bg-tertiary hover:text-on-tertiary rounded font-medium text-xs flex items-center gap-1 transition"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Sim
                  </button>

                  {h.status === 'APPROVED_FUNDED' && (
                    <button
                      onClick={onOpenCorruptionXRay}
                      className="px-2.5 py-1 bg-error/20 text-error border border-error/40 hover:bg-error hover:text-on-error rounded font-bold text-xs flex items-center gap-1 transition"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      X-Ray
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
