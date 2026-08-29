import React from 'react';
import { Sliders, RefreshCw, Sparkles } from 'lucide-react';
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
    { key: 'w1_population', label: 'w1: Population Impact', desc: 'Prioritizes projects serving larger citizen numbers' },
    { key: 'w2_severity', label: 'w2: Severity & Risk', desc: 'Focuses on critical hazards & life safety risk' },
    { key: 'w3_infraGap', label: 'w3: Infrastructure Gap', desc: 'Gaps relative to state benchmark averages' },
    { key: 'w4_equityWeight', label: 'w4: Aspirational Equity', desc: 'Favors low-HDI & marginalized census blocks' },
    { key: 'w5_costEfficiency', label: 'w5: Cost Efficiency (ROI)', desc: 'Maximizes beneficiaries per Lakh spent' },
    { key: 'w6_duplicateDiscount', label: 'w6: Noise Filter Discount', desc: 'Discount applied for low confidence reports' },
  ];

  return (
    <div className="bg-[#1B263B] border-l-4 border-secondary border border-white/10 rounded-xl p-5 text-on-surface space-y-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base flex items-center gap-2 text-on-surface font-headline-lg">
            <Sliders className="w-4 h-4 text-secondary" />
            Transparent Priority Scoring Engine Weights
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Adjust formula weights below to instantly re-rank all national demand hotspots in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Equity Lens Toggle Button */}
          <button
            onClick={onToggleEquityLens}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
              isEquityLensActive
                ? 'bg-secondary text-on-secondary border-secondary shadow-lg animate-pulse'
                : 'bg-surface-container-high border-white/10 hover:bg-surface-bright text-on-surface'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isEquityLensActive ? 'Equity Lens: ACTIVE (+35% Low-HDI)' : 'Enable Equity Lens'}
          </button>

          <button
            onClick={handleReset}
            className="p-2 bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface rounded-lg transition border border-white/10"
            title="Reset to default weights"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formula Display */}
      <div className="bg-surface-container-lowest p-3 rounded-lg border border-white/10 text-[11px] font-mono text-primary-container overflow-x-auto">
        PriorityScore = {weights.w1_population.toFixed(2)}·(Pop) + {weights.w2_severity.toFixed(2)}·(Sev) + {weights.w3_infraGap.toFixed(2)}·(Gap) + {weights.w4_equityWeight.toFixed(2)}·(Equity) + {weights.w5_costEfficiency.toFixed(2)}·(CostEff) − {weights.w6_duplicateDiscount.toFixed(2)}·(DupDiscount)
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        {sliderConfigs.map(({ key, label, desc }) => (
          <div key={key} className="p-3 bg-surface-container-low rounded-lg border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-on-surface">{label}</span>
              <span className="text-secondary font-bold font-mono">{(weights[key] * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.6}
              step={0.05}
              value={weights[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer h-1.5 bg-surface-container-highest rounded-lg"
            />
            <p className="text-[10px] text-on-surface-variant italic">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
