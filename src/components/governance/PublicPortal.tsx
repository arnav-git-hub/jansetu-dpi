import React, { useState } from 'react';
import { Globe, Users, CheckCircle2, TrendingUp, Leaf, IndianRupee, Search, Filter } from 'lucide-react';
import { DemandHotspot, CategoryType } from '../../types';
import { SDGBadges } from '../common/SDGBadges';

interface PublicPortalProps {
  hotspots: DemandHotspot[];
}

const CATEGORY_LABELS: Record<CategoryType, string> = {
  ROADS_BRIDGES: '🛣️ Roads & Bridges',
  WATER_SANITATION: '💧 Water & Sanitation',
  ELECTRICITY_POWER: '⚡ Electricity',
  HEALTHCARE: '🏥 Healthcare',
  EDUCATION: '🏫 Education',
  DIGITAL_CONNECTIVITY: '📡 Digital Connectivity',
  FLOOD_DISASTER: '🌊 Flood & Disaster',
};

const STATUS_COLORS: Record<string, string> = {
  IDENTIFIED: 'text-on-surface-variant bg-surface-container border-white/10',
  SHORTLISTED: 'text-primary-container bg-primary-container/20 border-primary-container/40',
  APPROVED_FUNDED: 'text-tertiary-container bg-tertiary-container/20 border-tertiary-container/40',
  UNDER_CONSTRUCTION: 'text-secondary bg-secondary/20 border-secondary/40',
  DELIVERED: 'text-tertiary bg-tertiary/20 border-tertiary/40',
};

export const PublicPortal: React.FC<PublicPortalProps> = ({ hotspots }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<CategoryType | 'ALL'>('ALL');

  const totalBeneficiaries = hotspots.reduce((acc, h) => acc + h.totalAffectedPopulation, 0);
  const totalBudgetLakhs = hotspots.reduce((acc, h) => acc + h.estimatedCostLakhs, 0);
  const totalCO2 = hotspots.reduce((acc, h) => acc + (h.co2SavedTonsPerYear || 0), 0);
  const avgROI = (hotspots.reduce((acc, h) => acc + (h.economicROIMultiplier || 0), 0) / hotspots.length).toFixed(1);
  const fundedCount = hotspots.filter(h => h.status === 'APPROVED_FUNDED' || h.status === 'DELIVERED').length;
  const statesCount = new Set(hotspots.map(h => h.state)).size;

  // Category distribution for mini bar chart
  const categoryDist = hotspots.reduce((acc, h) => {
    acc[h.category] = (acc[h.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filtered list
  const filtered = hotspots.filter(h => {
    const matchesSearch = !searchQuery || 
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || h.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6 text-on-surface">
      {/* Hero Banner */}
      <div className="bg-[#1B263B] border border-white/10 rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <span className="bg-secondary/10 text-secondary border border-secondary/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 font-mono">
              <Globe className="w-3.5 h-3.5" />
              Open Citizen Data & Transparency Portal
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-headline-lg text-on-surface">
              JanSetu Open Infrastructure Observatory
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
              Real-time aggregate public view of citizen-reported infrastructure needs, allocated budgets, delivery status, and SDG impact across India. Privacy guaranteed by DPDP Act 2023.
            </p>
          </div>
          <div className="text-xs text-tertiary flex items-center gap-1.5 bg-surface-container border border-white/10 px-3 py-2 rounded-lg font-mono">
            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse" />
            Live Sync · 14 Indian Languages
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: <Users className="w-4 h-4" />, val: totalBeneficiaries.toLocaleString(), label: 'Citizens Impacted', color: 'text-primary-container' },
            { icon: <IndianRupee className="w-4 h-4" />, val: `₹${(totalBudgetLakhs / 100).toFixed(1)} Cr`, label: 'Capital Pipeline', color: 'text-secondary' },
            { icon: <CheckCircle2 className="w-4 h-4" />, val: `${fundedCount}/${hotspots.length}`, label: 'Projects Funded', color: 'text-tertiary-container' },
            { icon: <TrendingUp className="w-4 h-4" />, val: `${avgROI}x`, label: 'Avg Economic ROI', color: 'text-tertiary' },
            { icon: <Leaf className="w-4 h-4" />, val: `${totalCO2}T`, label: 'CO₂ Saved/Yr', color: 'text-secondary-fixed' },
            { icon: <Globe className="w-4 h-4" />, val: `${statesCount} States`, label: 'Geographic Reach', color: 'text-primary' },
          ].map((s, i) => (
            <div key={i} className="bg-surface-container-low px-3 py-2.5 rounded-lg border border-white/5 text-center">
              <div className={`${s.color} flex justify-center mb-1`}>{s.icon}</div>
              <span className={`text-base font-bold font-headline-lg ${s.color}`}>{s.val}</span>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution Mini Chart */}
      <div className="bg-[#1B263B] border border-white/10 rounded-xl p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
        <h3 className="font-bold text-sm font-headline-lg text-on-surface mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-container" />
          Infrastructure Demand Distribution Across Sectors
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {(Object.keys(CATEGORY_LABELS) as CategoryType[]).map(cat => {
            const count = categoryDist[cat] || 0;
            const pct = hotspots.length > 0 ? ((count / hotspots.length) * 100).toFixed(0) : '0';
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? 'ALL' : cat)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  filterCategory === cat
                    ? 'bg-surface-container-high border-primary-container ring-1 ring-primary-container'
                    : 'bg-surface-container-low border-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-xs block font-semibold text-on-surface truncate">{CATEGORY_LABELS[cat]}</span>
                <span className="text-lg font-bold font-headline-lg text-primary-container">{count}</span>
                <span className="text-[10px] text-on-surface-variant block">{pct}% of total</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by project title, district, or state..."
            className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs md:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value as CategoryType | 'ALL')}
          className="bg-[#0D1B2A] border border-white/10 rounded-lg px-3 py-2.5 text-xs md:text-sm text-on-surface focus:outline-none"
        >
          <option value="ALL">All Categories ({hotspots.length})</option>
          {(Object.keys(CATEGORY_LABELS) as CategoryType[]).map(cat => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]} ({categoryDist[cat] || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(h => (
          <div key={h.id} className="bg-[#1B263B] border border-white/10 rounded-xl p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-secondary">
                  {CATEGORY_LABELS[h.category] || h.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${STATUS_COLORS[h.status] || STATUS_COLORS.IDENTIFIED}`}>
                  {h.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h4 className="font-bold text-sm text-on-surface line-clamp-2">{h.title}</h4>
              <p className="text-xs text-on-surface-variant line-clamp-2">{h.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>📍 {h.villageOrWard}, {h.district}</span>
                <span className="font-bold text-primary-container font-headline-lg">{h.totalAffectedPopulation.toLocaleString()} affected</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Est. Scheme Cost:</span>
                <span className="font-bold text-on-surface">₹{h.estimatedCostLakhs} Lakhs</span>
              </div>
              {h.matchedScheme && (
                <div className="text-[11px] text-secondary bg-surface-container px-2 py-1 rounded truncate">
                  🏛️ {h.matchedScheme.schemeName}
                </div>
              )}
              {h.sdgGoals && h.sdgGoals.length > 0 && (
                <SDGBadges goals={h.sdgGoals} size="xs" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
