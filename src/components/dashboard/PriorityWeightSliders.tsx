import React from 'react';
import { Sliders, RefreshCw, HelpCircle, Sparkles } from 'lucide-react';
import { PriorityWeights } from '../../types';
import { DEFAULT_WEIGHTS } from '../../services/clustering/scoringEngine';

interface PriorityWeightSlidersProps {
  weights: PriorityWeights;
  onWeightChange: (newWeights: PriorityWeights) => void;
  isEquityLensActive: boolean;
  onToggleEquityLens: () => void;
}

export const PriorityWeightSliders: React.FC<PriorityWeightSlidersProps> = ({
  weights,
  onWeightChange,
  isEquityLensActive,
  onToggleEquityLens
}) => {
  const handleChange = (key: keyof PriorityWeights, value: number) => {
    onWeightChange({
      ...weights,
      [key]: value
    });
  };

  const handleReset = () => {
    onWeightChange(DEFAULT_WEIGHTS);
  };

  const sliderConfigs: Array<{ key: keyof PriorityWeights; label: string; desc: string }> = [
    { key: 'w1_population', label: 'w1: Affected Population Weight', desc: 'Prioritizes projects serving larger citizen numbers' },
    { key: 'w2_severity', label: 'w2: Severity Index Weight', desc: 'Focuses on critical hazards & life safety risk' },
    { key: 'w3_infraGap', label: 'w3: Infra Deficit Gap Weight', desc: 'Gaps relative to state benchmark averages' },
    { key: 'w4_equityWeight', label: 'w4: Equity Weight (Underserved)', desc: 'Favors low-HDI & marginalized census blocks' },
    { key: 'w5_costEfficiency', label: 'w5: Cost Efficiency (Impact/₹)', desc: 'Maximizes beneficiaries per Lakh spent' },
    { key: 'w6_duplicateDiscount', label: 'w6: Duplicate/Noise Penalty', desc: 'Discount applied for low confidence reports' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base flex items-center gap-2 text-slate-100">
            <Sliders className="w-4 h-4 text-amber-400" />
            Transparent Priority Scoring Engine Weights
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust formula weights below to instantly re-rank all national demand hotspots. Never a black box.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Equity Lens Toggle Button */}
          <button
            onClick={onToggleEquityLens}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              isEquityLensActive
                ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30 animate-pulse'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            {isEquityLensActive ? 'Equity Lens: ACTIVE (+35% Low-HDI)' : 'Enable Equity Lens'}
          </button>

          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
            title="Reset to default weights"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formula Display */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto">
        PriorityScore = {weights.w1_population.toFixed(2)}·(Pop) + {weights.w2_severity.toFixed(2)}·(Sev) + {weights.w3_infraGap.toFixed(2)}·(Gap) + {weights.w4_equityWeight.toFixed(2)}·(Equity) + {weights.w5_costEfficiency.toFixed(2)}·(CostEff) − {weights.w6_duplicateDiscount.toFixed(2)}·(DupDiscount)
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {sliderConfigs.map(({ key, label, desc }) => (
          <div key={key} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-200">{label}</span>
              <span className="text-amber-400 font-bold">{weights[key].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.6}
              step={0.05}
              value={weights[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 italic">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
