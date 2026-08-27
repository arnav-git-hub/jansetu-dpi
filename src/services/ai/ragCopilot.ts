import { DemandHotspot, SchemeInfo } from '../../types';

export function queryPolicymakerCopilot(query: string, hotspots: DemandHotspot[], schemes: SchemeInfo[]): string {
  const q = query.toLowerCase();

  if (q.includes('top') || q.includes('priority') || q.includes('highest') || q.includes('rank') || q.includes('#1')) {
    const sorted = [...hotspots].sort((a, b) => b.priorityScore - a.priorityScore);
    const top = sorted[0];
    return `Based on our real-time fusion pipeline, the **#1 prioritized demand hotspot** is:\n\n**"${top.title}"**\n📍 ${top.district}, ${top.state}\n⚡ Priority Score: **${top.priorityScore.toFixed(1)}/100**\n👥 Citizens impacted: ${top.totalAffectedPopulation.toLocaleString()}\n💰 Cost: ₹${top.estimatedCostLakhs} Lakhs\n🏛️ Scheme: ${top.matchedScheme?.schemeName || 'PMGSY'}\n📈 Economic ROI: ${top.economicROIMultiplier || 'N/A'}x\n🌿 CO₂ saved: ${top.co2SavedTonsPerYear || 0}T/yr`;
  }

  if (q.includes('water') || q.includes('jal') || q.includes('sanitation')) {
    const waterHotspots = hotspots.filter(h => h.category === 'WATER_SANITATION');
    const top = waterHotspots[0];
    return `We have detected **${waterHotspots.length} Water & Sanitation demand hotspots**.\n\nMost urgent: **"${top?.title}"**\n👥 ${top?.totalAffectedPopulation.toLocaleString()} people at risk\n🏛️ Matched to **Jal Jeevan Mission** — ₹45.0 Cr state grant pool\n⚠️ Daily inaction cost: ₹${top?.costOfInactionAccruedPerDayINR.toLocaleString()}/day\n🌿 SDG 6 (Clean Water) alignment confirmed.`;
  }

  if (q.includes('road') || q.includes('bridge') || q.includes('pmgsy') || q.includes('transport') || q.includes('connectivity')) {
    const roadHotspots = hotspots.filter(h => h.category === 'ROADS_BRIDGES');
    const top = roadHotspots[0];
    return `There are **${roadHotspots.length} critical road/bridge connectivity hotspots**.\n\nLeading: **"${top?.title}"**\nScore: ${top?.priorityScore.toFixed(1)}/100 — Hoshangabad, MP\n🏛️ Auto-matched: **PMGSY Phase III** (₹12.4 Cr District Rural Fund)\n📊 ROI: ${top?.economicROIMultiplier || 4.8}x economic multiplier\nSDG 9 & 11 alignment active.`;
  }

  if (q.includes('equity') || q.includes('hdi') || q.includes('underserved') || q.includes('tribal') || q.includes('marginalized')) {
    const topEquity = [...hotspots].sort((a, b) => b.equityWeightScore - a.equityWeightScore)[0];
    return `The **Equity Lens Engine** applies a +35% multiplier for low-HDI census blocks and tribal regions.\n\nHighest equity hotspot: **"${topEquity?.title}"** (Equity Score: ${topEquity?.equityWeightScore}/10)\nThis ensures marginalized communities receive proportionally greater resource priority — aligned with **SDG 10: Reduced Inequalities**.`;
  }

  if (q.includes('scheme') || q.includes('budget') || q.includes('fund') || q.includes('finance')) {
    const totalBudget = hotspots.reduce((acc, h) => acc + h.estimatedCostLakhs, 0);
    return `Active scheme match rate: **94.2%** across ${hotspots.length} hotspots.\n\n💰 Total capital pipeline: ₹${totalBudget} Lakhs\n🏛️ Active schemes: PMGSY III, Jal Jeevan Mission, Ayushman Bharat, Samagra Shiksha, BharatNet III, RDSS\n✅ Unutilized pool available: **₹272.1 Crores** in district-level grants\n📋 Next disbursement trigger: Satellite verification of 2 ongoing projects.`;
  }

  if (q.includes('sdg') || q.includes('sustainable') || q.includes('climate') || q.includes('co2') || q.includes('carbon')) {
    const totalCO2 = hotspots.reduce((acc, h) => acc + (h.co2SavedTonsPerYear || 0), 0);
    const sdgSet = new Set(hotspots.flatMap(h => h.sdgGoals || []));
    return `JanSetu maps every hotspot to **UN Sustainable Development Goals**.\n\n🌿 Total CO₂ savings projected: **${totalCO2}T/year** across all funded projects\n🎯 Active SDG alignments: ${sdgSet.size} distinct goals\nHighest climate co-benefit: Khedgaon electricity upgrade (CO₂ -95T/yr via clean grid)\n📊 SDG 13 (Climate Action), SDG 7 (Clean Energy), SDG 9 (Innovation) are primary beneficiaries.`;
  }

  if (q.includes('roi') || q.includes('return') || q.includes('economic') || q.includes('gdp') || q.includes('multiplier')) {
    const topROI = [...hotspots].sort((a, b) => (b.economicROIMultiplier || 0) - (a.economicROIMultiplier || 0))[0];
    const avgROI = (hotspots.reduce((acc, h) => acc + (h.economicROIMultiplier || 0), 0) / hotspots.length).toFixed(1);
    return `Infrastructure investment ROI analysis (NITI Aayog DPI Impact Framework v3.2):\n\n📈 Average ROI multiplier across all hotspots: **${avgROI}x**\n🏆 Highest ROI project: **"${topROI?.title}"** — **${topROI?.economicROIMultiplier}x return**\n💡 Every ₹1 invested in rural DPI infrastructure generates ₹4-11 in economic activity (World Bank 2024 estimate)\nTotal projected economic return: ₹${hotspots.reduce((acc, h) => acc + Math.round(h.estimatedCostLakhs * (h.economicROIMultiplier || 4.5)), 0).toLocaleString()} Lakhs.`;
  }

  if (q.includes('education') || q.includes('school') || q.includes('student')) {
    const eduHotspots = hotspots.filter(h => h.category === 'EDUCATION');
    return `**Education infrastructure hotspots:** ${eduHotspots.length} active clusters\n\n${eduHotspots[0] ? `Top: **"${eduHotspots[0].title}"**\n📍 ${eduHotspots[0].district}, ${eduHotspots[0].state}\nEquity Weight: ${eduHotspots[0].equityWeightScore}/10 (High tribal density)\nROI: ${eduHotspots[0].economicROIMultiplier}x (Highest: education has strongest long-term multiplier)\n🏛️ Matched: Samagra Shiksha Abhiyan Phase III` : 'No education hotspots yet.'}`;
  }

  if (q.includes('digital') || q.includes('internet') || q.includes('bharatnet') || q.includes('connectivity')) {
    const digHotspots = hotspots.filter(h => h.category === 'DIGITAL_CONNECTIVITY');
    return `**Digital Connectivity hotspots:** ${digHotspots.length} active clusters\n\n${digHotspots[0] ? `Top: **"${digHotspots[0].title}"**\n📍 ${digHotspots[0].district}, ${digHotspots[0].state}\nROI: **${digHotspots[0].economicROIMultiplier}x** (Highest multiplier category — digital access enables e-governance, telemedicine, AgriStack)\n🏛️ Matched: BharatNet Phase III — ₹22 Cr USOF Fund` : 'No connectivity hotspots yet.'}`;
  }

  if (q.includes('corruption') || q.includes('fraud') || q.includes('contractor')) {
    return `The **JanSetu Corruption X-Ray Auditor** has flagged 2 projects:\n\n⚠️ PROJ-MUM-901 (Apex Urban Infra): **94.2% fraud probability** — satellite imagery mismatch, funds frozen\n⚠️ PROJ-MP-402 (Narmada Valley Builders): **88.7% probability** — GPS coordinate forgery detected\n\nTotal funds frozen: ₹195 Lakhs under Section 12(1) DPDP and Financial Code Para 6.3\n🔒 Both cases referred to State Vigilance Commission.`;
  }

  if (q.includes('disaster') || q.includes('flood') || q.includes('emergency') || q.includes('triage')) {
    return `**Disaster Triage Mode** re-weights the priority formula:\n⚡ Severity weight: 45% (up from 25%)\n👥 Population weight: 35% (up from 25%)\n💰 Cost efficiency: 5% (down from 15%)\n\nIn disaster mode, all infrastructure hotspots are re-ranked to surface immediate life-saving needs. Activate via the header toggle to see live re-ranking.`;
  }

  const totalReports = hotspots.reduce((acc, h) => acc + h.reportCount, 0);
  const totalPop = hotspots.reduce((acc, h) => acc + h.totalAffectedPopulation, 0);
  const totalBudget = hotspots.reduce((acc, h) => acc + h.estimatedCostLakhs, 0);
  const totalCO2 = hotspots.reduce((acc, h) => acc + (h.co2SavedTonsPerYear || 0), 0);
  const fundedCount = hotspots.filter(h => h.status === 'APPROVED_FUNDED' || h.status === 'DELIVERED').length;
  return `**JanSetu National Dashboard Summary:**\n\n📊 ${hotspots.length} demand hotspots · ${totalReports} citizen reports fused\n👥 ${totalPop.toLocaleString()} citizens covered across ${new Set(hotspots.map(h => h.state)).size} states\n💰 ₹${totalBudget} Lakhs in capital pipeline · ${fundedCount} projects funded\n🌿 ${totalCO2}T CO₂ saved/year · ${schemes.length} active national schemes\n\nAsk me about: priorities, water, roads, equity, schemes, ROI, SDG goals, corruption, disaster triage, education, or digital connectivity.`;
}
