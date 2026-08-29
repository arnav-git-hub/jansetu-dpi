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

  return (
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 text-on-surface space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-base font-headline-lg text-on-surface">Digital Twin Impact Simulator</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#0D1B2A] p-3 rounded-xl border border-white/10 text-xs shrink-0">
          <span className="text-on-surface-variant">Simulating Allocation for:</span>
          <h4 className="font-bold text-on-surface text-sm font-headline-lg">{hotspot.title}</h4>
        </div>

        <div className="flex-1 overflow-y-auto terminal-scroll space-y-3 pr-1">
          {/* Funding Slider */}
          <div className="p-4 bg-[#0D1B2A] rounded-xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-on-surface">Budget Allocation Slider</span>
              <span className="font-bold text-primary-container text-sm font-mono">{fundingPercent}% (₹{((hotspot.estimatedCostLakhs * fundingPercent) / 100).toFixed(1)} Lakhs)</span>
            </div>
            <input
              type="range"
              min={25}
              max={100}
              step={25}
              value={fundingPercent}
              onChange={(e) => setFundingPercent(Number(e.target.value))}
              className="w-full accent-primary-container cursor-pointer h-2 bg-surface-container-highest rounded-lg"
            />
          </div>

          {/* SDG Goals */}
          {hotspot.sdgGoals && hotspot.sdgGoals.length > 0 && (
            <div className="bg-[#0D1B2A] rounded-xl border border-white/10 p-3">
              <p className="text-[10px] text-on-surface-variant font-semibold mb-1.5 uppercase tracking-wider font-mono">UN SDG Alignment</p>
              <SDGBadges goals={hotspot.sdgGoals} size="sm" />
            </div>
          )}

          {/* Impact Projection Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-surface-container-low border border-tertiary/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-tertiary font-bold">
                <Users className="w-4 h-4" /> Beneficiaries Reached
              </div>
              <p className="text-xl font-bold text-on-surface font-headline-lg">{simulatedPopServed.toLocaleString()}</p>
              <span className="text-[10px] text-on-surface-variant">Citizens gaining direct access</span>
            </div>

            <div className="p-4 bg-surface-container-low border border-secondary/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-secondary font-bold">
                <IndianRupee className="w-4 h-4" /> Est. Economic Value
              </div>
              <p className="text-xl font-bold text-secondary font-headline-lg">₹{economicReturnLakhs.toLocaleString()}L</p>
              <span className="text-[10px] text-on-surface-variant">{roiMultiplier}x capital multiplier</span>
            </div>

            <div className="p-4 bg-surface-container-low border border-primary-container/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-primary-container font-bold">
                <Clock className="w-4 h-4" /> Daily Transit Saved
              </div>
              <p className="text-xl font-bold text-on-surface font-headline-lg">{travelTimeSavedMins} Mins</p>
              <span className="text-[10px] text-on-surface-variant">Per commuter / student trip</span>
            </div>

            <div className="p-4 bg-surface-container-low border border-tertiary-container/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-tertiary-container font-bold">
                <Leaf className="w-4 h-4" /> Carbon Offset
              </div>
              <p className="text-xl font-bold text-on-surface font-headline-lg">{co2Saved} Tons/yr</p>
              <span className="text-[10px] text-on-surface-variant">Via optimized transit routing</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg text-xs hover:opacity-90 transition"
          >
            Apply to Planning Board
          </button>
        </div>
      </div>
    </div>
  );
};
