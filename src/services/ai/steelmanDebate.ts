import { DemandHotspot, SteelmanDebateTurn } from '../../types';

export function generateSteelmanDebate(hotspot: DemandHotspot): SteelmanDebateTurn[] {
  return [
    {
      id: 'turn-1',
      speaker: 'ADVOCATE',
      agentName: 'Agent 1: Citizen Equity Advocate (AI)',
      text: `We must immediately approve funding for "${hotspot.title}". Over ${hotspot.totalAffectedPopulation.toLocaleString()} citizens are directly affected by this ${hotspot.category.replace('_', ' ')} crisis. With a severity index of ${hotspot.avgSeverityIndex}/10 and an Equity Gap score of ${hotspot.equityWeightScore}/10, delaying this project exacerbates hardship in an underserved region. The cost of inaction is already accruing at ₹${hotspot.costOfInactionAccruedPerDayINR.toLocaleString()}/day!`,
      citedMetrics: [
        `Affected Pop: ${hotspot.totalAffectedPopulation}`,
        `Severity: ${hotspot.avgSeverityIndex}/10`,
        `Daily Inaction Cost: ₹${hotspot.costOfInactionAccruedPerDayINR}`
      ]
    },
    {
      id: 'turn-2',
      speaker: 'SKEPTIC',
      agentName: 'Agent 2: Fiscal & Feasibility Skeptic (AI)',
      text: `While the hardship is clear, we must scrutinize the ₹${hotspot.estimatedCostLakhs} Lakh expenditure. Is there an existing scheme alignment? The matched scheme "${hotspot.matchedScheme?.schemeName || 'State Infrastructure Fund'}" already has pending pipeline allocations in neighboring wards. Approving a standalone DPR risks double-allocating budget when regional contractor capacity is bottlenecked.`,
      citedMetrics: [
        `Estimated Cost: ₹${hotspot.estimatedCostLakhs} Lakhs`,
        `Matched Scheme: ${hotspot.matchedScheme?.schemeName}`,
        `Duplicate Discount: ${(hotspot.duplicateOrLowConfidenceDiscount * 100).toFixed(1)}%`
      ]
    },
    {
      id: 'turn-3',
      speaker: 'ADVOCATE',
      agentName: 'Agent 1: Citizen Equity Advocate (AI)',
      text: `Respectfully, the cost-efficiency ratio stands at ${hotspot.costEfficiencyRatio}/10 — serving over ${(hotspot.totalAffectedPopulation / hotspot.estimatedCostLakhs).toFixed(0)} people per ₹ Lakh spent. Furthermore, 38+ verified audio and photo reports cross-referenced by local PWA devices prove that current scheme pipelines have not reached this specific village in over 6 months. This is an acute bottleneck!`,
      citedMetrics: [
        `Cost Efficiency: ${hotspot.costEfficiencyRatio}/10`,
        `Reports Count: ${hotspot.reportCount}`,
        `Population per Lakh: ${(hotspot.totalAffectedPopulation / hotspot.estimatedCostLakhs).toFixed(0)}`
      ]
    },
    {
      id: 'turn-4',
      speaker: 'SKEPTIC',
      agentName: 'Agent 2: Fiscal & Feasibility Skeptic (AI)',
      text: `If funded, we strongly recommend attaching strict milestone-based smart contracts. Funds should be disbursed in 3 phases (Foundation 30%, Construction 50%, Final Satellite Verification 20%), with mandatory Corruption X-Ray audit checks to prevent contractor photo spoofing.`,
      citedMetrics: [
        'Phase 1: 30% Foundation',
        'Phase 2: 50% On-Ground Work',
        'Phase 3: 20% Satellite Verification'
      ]
    }
  ];
}
