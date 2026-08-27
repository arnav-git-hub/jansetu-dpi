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
    <div className="space-y-4 text-white">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          Prioritized Demand Hotspot Rankings ({hotspots.length} Clusters)
        </h3>
        <span className="text-xs text-slate-400">Sorted dynamically by Priority Score</span>
      </div>

      <div className="space-y-3">
        {hotspots.map((h, index) => {
          const isSelected = selectedHotspot?.id === h.id;
          const scoreColor = h.priorityScore >= 85 ? 'text-red-400 bg-red-950 border-red-800' : h.priorityScore >= 75 ? 'text-amber-400 bg-amber-950 border-amber-800' : 'text-emerald-400 bg-emerald-950 border-emerald-800';
          const isTrending = (h.trendingVelocity || 0) > 5;

          return (
            <div
              key={h.id}
              onClick={() => onSelectHotspot(h)}
              className={`p-4 rounded-2xl border transition cursor-pointer shadow-lg relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-850 border-amber-500/80 ring-2 ring-amber-500/20'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Rank Pill + Title Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center border border-slate-700 shrink-0">
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white hover:text-amber-300 transition truncate">
                      {h.title}
                    </h4>
                    {isTrending && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-orange-400 font-bold">
                        <TrendingUp className="w-3 h-3" /> Trending · {h.trendingVelocity?.toFixed(1)} reports/hr
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className={`px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-1 ${scoreColor}`}>
                    <span>Score:</span>
                    <span className="text-sm">{h.priorityScore.toFixed(1)}</span>
                  </div>
                  {/* Priority score mini bar */}
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        h.priorityScore >= 85 ? 'bg-red-500' : h.priorityScore >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-300 my-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 block">Location</span>
                  <span className="font-medium text-slate-200 truncate block">📍 {h.villageOrWard}, {h.district}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Affected Population</span>
                  <span className="font-bold text-amber-400">{h.totalAffectedPopulation.toLocaleString()} citizens</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Est. Budget</span>
                  <span className="font-bold text-slate-100">₹{h.estimatedCostLakhs} Lakhs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Daily Inaction Cost</span>
                  <span className="font-bold text-red-400">₹{h.costOfInactionAccruedPerDayINR.toLocaleString()}/day</span>
                </div>
              </div>

              {/* ROI & CO2 row */}
              {(h.economicROIMultiplier || h.co2SavedTonsPerYear) && (
                <div className="flex gap-2 text-xs mb-2">
                  {h.economicROIMultiplier && (
                    <span className="flex items-center gap-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 px-2 py-1 rounded-lg">
                      <IndianRupee className="w-3 h-3" />
                      <span>{h.economicROIMultiplier}x ROI</span>
                    </span>
                  )}
                  {h.co2SavedTonsPerYear && (
                    <span className="flex items-center gap-1 bg-green-950/40 text-green-400 border border-green-800/50 px-2 py-1 rounded-lg">
                      <Leaf className="w-3 h-3" />
                      <span>CO₂ -{h.co2SavedTonsPerYear}T/yr</span>
                    </span>
                  )}
                </div>
              )}

              {/* Matched Scheme Badge */}
              {h.matchedScheme && (
                <div className="flex items-center justify-between text-xs mb-3 bg-blue-950/40 border border-blue-800/60 px-3 py-1.5 rounded-xl">
                  <span className="text-blue-300 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Auto-Matched: <strong>{h.matchedScheme.schemeName}</strong>
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold hidden md:inline">{h.matchedScheme.fundingPoolAvailableINR}</span>
                </div>
              )}

              {/* Action Buttons for Policymakers */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Reports Fused: <strong className="text-slate-200">{h.reportCount} verified</strong>
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onOpenProjectBrief(h)}
                    className="px-2.5 py-1.5 bg-gov-blue hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                    AI DPR Brief
                  </button>

                  <button
                    onClick={() => onOpenSteelmanDebate(h)}
                    className="px-2.5 py-1.5 bg-amber-600/90 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    Debate
                  </button>

                  <button
                    onClick={() => onOpenDigitalTwin(h)}
                    className="px-2.5 py-1.5 bg-purple-600/90 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow"
                  >
                    <Activity className="w-3.5 h-3.5 text-purple-300" />
                    Sim
                  </button>

                  <button
                    onClick={() => onOpenProjectBrief(h)}
                    className="px-2.5 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow"
                    title="ROI & SDG Analysis"
                  >
                    <Users className="w-3.5 h-3.5" />
                    ROI
                  </button>

                  {h.status === 'APPROVED_FUNDED' && (
                    <button
                      onClick={onOpenCorruptionXRay}
                      className="px-2.5 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow animate-pulse"
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
