import { DemandHotspot, PriorityWeights, CitizenReport } from '../../types';

export const DEFAULT_WEIGHTS: PriorityWeights = {
  w1_population: 0.25,
  w2_severity: 0.25,
  w3_infraGap: 0.20,
  w4_equityWeight: 0.15,
  w5_costEfficiency: 0.15,
  w6_duplicateDiscount: 0.10
};

export const DISASTER_MODE_WEIGHTS: PriorityWeights = {
  w1_population: 0.35,
  w2_severity: 0.45, // Extreme focus on immediate emergency severity
  w3_infraGap: 0.05,
  w4_equityWeight: 0.10,
  w5_costEfficiency: 0.05,
  w6_duplicateDiscount: 0.00
};

export function calculatePriorityScore(
  hotspot: DemandHotspot,
  weights: PriorityWeights,
  isEquityLensActive: boolean = false,
  isDisasterMode: boolean = false
): number {
  const currentWeights = isDisasterMode ? DISASTER_MODE_WEIGHTS : weights;

  // Normalize Population (0 - 10 scale, max cap at 50,000)
  const normPop = Math.min(10, (hotspot.totalAffectedPopulation / 50000) * 10);
  
  // Severity Index (0 - 10)
  const normSev = hotspot.avgSeverityIndex;

  // Infra Deficit Gap (0 - 10)
  const normGap = hotspot.infraDeficitGapScore;

  // Equity Weight (0 - 10) - apply extra 1.3 multiplier when Equity Lens is toggled on
  let normEquity = hotspot.equityWeightScore;
  if (isEquityLensActive) {
    normEquity = Math.min(10, normEquity * 1.35);
  }

  // Cost Efficiency Ratio (0 - 10)
  const normCostEff = hotspot.costEfficiencyRatio;

  // Duplicate / Low Confidence Discount
  const discount = hotspot.duplicateOrLowConfidenceDiscount * 10;

  // Weighted Sum calculation normalized to 0 - 100
  const rawScore = 
    (currentWeights.w1_population * normPop) +
    (currentWeights.w2_severity * normSev) +
    (currentWeights.w3_infraGap * normGap) +
    (currentWeights.w4_equityWeight * normEquity) +
    (currentWeights.w5_costEfficiency * normCostEff) -
    (currentWeights.w6_duplicateDiscount * discount);

  // Scale raw weighted average (which is out of 1.0 sum of weights) to 0 - 100
  const totalWeightSum = currentWeights.w1_population + currentWeights.w2_severity + currentWeights.w3_infraGap + currentWeights.w4_equityWeight + currentWeights.w5_costEfficiency;
  
  const finalScore = Math.max(0, Math.min(100, (rawScore / (totalWeightSum || 1)) * 10));
  return Number(finalScore.toFixed(1));
}

/**
 * Cluster a new report into an existing nearby hotspot (within ~5km) or create a new cluster
 */
export function clusterNewReport(
  report: CitizenReport,
  existingHotspots: DemandHotspot[],
  weights: PriorityWeights
): { updatedHotspots: DemandHotspot[]; targetHotspotId: string } {
  let matchedHotspot = existingHotspots.find(h => {
    // Distance check (~0.05 degrees ~ 5.5 km)
    const latDiff = Math.abs(h.centerLat - report.location.lat);
    const lngDiff = Math.abs(h.centerLng - report.location.lng);
    return latDiff < 0.08 && lngDiff < 0.08 && h.category === report.intent.category;
  });

  let updatedHotspots: DemandHotspot[];
  let targetHotspotId = '';

  if (matchedHotspot) {
    targetHotspotId = matchedHotspot.id;
    updatedHotspots = existingHotspots.map(h => {
      if (h.id === matchedHotspot!.id) {
        const newReportCount = h.reportCount + 1;
        const newAffectedPop = h.totalAffectedPopulation + (report.intent.estimatedAffectedPop / 2);
        const newAvgSev = Number(((h.avgSeverityIndex * h.reportCount + (report.cvAnalysis?.severityRating || 8)) / newReportCount).toFixed(1));
        
        const updated = {
          ...h,
          reportCount: newReportCount,
          reports: [report, ...h.reports],
          totalAffectedPopulation: Math.round(newAffectedPop),
          avgSeverityIndex: newAvgSev
        };
        return {
          ...updated,
          priorityScore: calculatePriorityScore(updated, weights)
        };
      }
      return h;
    });
  } else {
    // Create new Hotspot
    const newHotspotId = `HOTSPOT-${String(existingHotspots.length + 1).padStart(2, '0')}`;
    targetHotspotId = newHotspotId;

    const newHotspot: DemandHotspot = {
      id: newHotspotId,
      title: `${report.location.villageOrWard} ${report.intent.category.replace('_', ' ')} Urgent Development Project`,
      category: report.intent.category,
      district: report.location.district,
      state: report.location.state,
      villageOrWard: report.location.villageOrWard,
      centerLat: report.location.lat,
      centerLng: report.location.lng,
      reportCount: 1,
      reports: [report],
      totalAffectedPopulation: report.intent.estimatedAffectedPop,
      avgSeverityIndex: report.cvAnalysis?.severityRating || 8,
      infraDeficitGapScore: 7.5,
      equityWeightScore: 8.0,
      costEfficiencyRatio: 8.5,
      estimatedCostLakhs: 35,
      duplicateOrLowConfidenceDiscount: 0.02,
      priorityScore: 0,
      matchedScheme: {
        schemeName: 'National Infrastructure Mission Pool',
        ministry: 'Ministry of Panchayati Raj',
        matchingConfidence: 0.88,
        fundingPoolAvailableINR: '₹15.0 Crores District Grant'
      },
      status: 'IDENTIFIED',
      costOfInactionAccruedPerDayINR: 9500
    };

    newHotspot.priorityScore = calculatePriorityScore(newHotspot, weights);
    updatedHotspots = [newHotspot, ...existingHotspots];
  }

  return { updatedHotspots, targetHotspotId };
}
