import React, { useState } from 'react';
import { X, Activity, TrendingUp, Users, HeartPulse, GraduationCap, Clock, Leaf, IndianRupee, Zap } from 'lucide-react';
import { DemandHotspot } from '../../types';
import { SDGBadges } from '../common/SDGBadges';

interface DigitalTwinModalProps {
  hotspot: DemandHotspot | null;
  onClose: () => void;
}

export const DigitalTwinModal: React.FC<DigitalTwinModalProps> = ({ hotspot, onClose }) => {
  const [fundingPercent, setFundingPercent] = useState(100);

  if (!hotspot) return null;

  const basePop = hotspot.totalAffectedPopulation;
  const simulatedPopServed = Math.round((basePop * fundingPercent) / 100);
  const healthBoostPercent = Math.round(18 * (fundingPercent / 100));
  const schoolAttendanceIncrease = Math.round(24 * (fundingPercent / 100));
  const travelTimeSavedMins = Math.round(35 * (fundingPercent / 100));
  const allocatedLakhs = (hotspot.estimatedCostLakhs * fundingPercent) / 100;
  const roiMultiplier = hotspot.economicROIMultiplier || 4.5;
  const economicReturnLakhs = Math.round(allocatedLakhs * roiMultiplier * (fundingPercent / 100));
  const co2Saved = Math.round((hotspot.co2SavedTonsPerYear || 20) * (fundingPercent / 100));
  const gdpUpliftLakhs = Math.round(simulatedPopServed * 0.12);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base">Digital Twin Impact Simulator</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Simulating Allocation for:</span>
          <h4 className="font-bold text-slate-100 text-sm">{hotspot.title}</h4>
        </div>

        {/* Funding Slider */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Budget Allocation Slider</span>
            <span className="font-extrabold text-amber-400 text-sm">{fundingPercent}% (₹{((hotspot.estimatedCostLakhs * fundingPercent) / 100).toFixed(1)} Lakhs)</span>
          </div>
          <input
            type="range"
            min={25}
            max={100}
            step={25}
            value={fundingPercent}
            onChange={(e) => setFundingPercent(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* SDG Goals */}
        {hotspot.sdgGoals && hotspot.sdgGoals.length > 0 && (
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3">
            <p className="text-[10px] text-slate-500 font-semibold mb-1.5 uppercase tracking-wider">UN SDG Alignment</p>
            <SDGBadges goals={hotspot.sdgGoals} size="sm" />
          </div>
        )}

        {/* Impact Projection Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Users className="w-4 h-4" /> Beneficiaries Reached
            </div>
            <p className="text-xl font-black text-white">{simulatedPopServed.toLocaleString()}</p>
            <span className="text-[10px] text-slate-400">Citizens gaining direct access</span>
          </div>

          <div className="p-4 bg-blue-950/40 border border-blue-800/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
              <GraduationCap className="w-4 h-4" /> School Attendance
            </div>
            <p className="text-xl font-black text-white">+{schoolAttendanceIncrease}%</p>
            <span className="text-[10px] text-slate-400">Student enrollment uplift</span>
          </div>

          <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 font-bold">
              <HeartPulse className="w-4 h-4" /> Health Outbreak Reduction
            </div>
            <p className="text-xl font-black text-white">-{healthBoostPercent}%</p>
            <span className="text-[10px] text-slate-400">Lower disease incidence rate</span>
          </div>

          <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Clock className="w-4 h-4" /> Commute Time Saved
            </div>
            <p className="text-xl font-black text-white">{travelTimeSavedMins} mins/day</p>
            <span className="text-[10px] text-slate-400">Average round-trip savings</span>
          </div>

          <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <IndianRupee className="w-4 h-4" /> Economic Return (ROI)
            </div>
            <p className="text-xl font-black text-white">₹{economicReturnLakhs.toLocaleString()} L</p>
            <span className="text-[10px] text-slate-400">{roiMultiplier}x multiplier on investment</span>
          </div>

          <div className="p-4 bg-green-950/40 border border-green-800/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-green-400 font-bold">
              <Leaf className="w-4 h-4" /> CO₂ Emissions Saved
            </div>
            <p className="text-xl font-black text-white">{co2Saved} T/yr</p>
            <span className="text-[10px] text-slate-400">Climate co-benefit projection</span>
          </div>
        </div>

        {/* GDP Uplift callout */}
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Zap className="w-4 h-4" />
            Projected GDP Uplift (Village/Ward Level)
          </div>
          <span className="font-black text-amber-400 text-base">₹{gdpUpliftLakhs.toLocaleString()} Lakhs</span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium"
          >
            Close Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
