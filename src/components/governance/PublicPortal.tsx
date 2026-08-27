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
  IDENTIFIED: 'text-slate-400 bg-slate-800 border-slate-700',
  SHORTLISTED: 'text-amber-400 bg-amber-950 border-amber-800',
  APPROVED_FUNDED: 'text-emerald-400 bg-emerald-950 border-emerald-800',
  UNDER_CONSTRUCTION: 'text-sky-400 bg-sky-950 border-sky-800',
  DELIVERED: 'text-purple-400 bg-purple-950 border-purple-800',
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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/80 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Open Citizen Data & Transparency Portal
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">
              JanSetu Open Infrastructure Observatory
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Real-time aggregate public view of citizen-reported infrastructure needs, allocated budgets, delivery status, and SDG impact across India. Zero PII exposed.
            </p>
          </div>
          <div className="text-xs text-emerald-400/80 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/50 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live · Updated every 60 seconds
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: <Users className="w-4 h-4" />, val: totalBeneficiaries.toLocaleString(), label: 'Citizens Covered', color: 'text-emerald-400' },
            { icon: <IndianRupee className="w-4 h-4" />, val: `₹${(totalBudgetLakhs / 100).toFixed(1)} Cr`, label: 'Capital Pipeline', color: 'text-amber-400' },
            { icon: <CheckCircle2 className="w-4 h-4" />, val: `${fundedCount}/${hotspots.length}`, label: 'Projects Funded', color: 'text-sky-400' },
            { icon: <TrendingUp className="w-4 h-4" />, val: `${avgROI}x`, label: 'Avg Economic ROI', color: 'text-purple-400' },
            { icon: <Leaf className="w-4 h-4" />, val: `${totalCO2}T`, label: 'CO₂ Saved/Yr', color: 'text-green-400' },
            { icon: <Globe className="w-4 h-4" />, val: `${statesCount} States`, label: 'Geographic Reach', color: 'text-rose-400' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-950/80 px-3 py-2.5 rounded-xl border border-slate-800 text-center">
              <div className={`${s.color} flex justify-center mb-1`}>{s.icon}</div>
              <span className={`text-base font-black font-mono ${s.color}`}>{s.val}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution Mini Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="font-bold text-sm text-slate-100 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          Infrastructure Category Breakdown
        </h3>
        <div className="space-y-2">
          {Object.entries(categoryDist).map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-3 text-xs">
              <span className="w-36 text-slate-300 text-right text-[11px] shrink-0">{CATEGORY_LABELS[cat as CategoryType] || cat}</span>
              <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-sky-500 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                  style={{ width: `${(count / hotspots.length) * 100}%` }}
                >
                  <span className="text-[10px] font-bold text-white">{count}</span>
                </div>
              </div>
              <span className="text-slate-400 text-[10px] w-8">{Math.round((count / hotspots.length) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, district, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-emerald-400"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as CategoryType | 'ALL')}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-400"
        >
          <option value="ALL">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Public Projects Grid */}
      <div>
        <p className="text-xs text-slate-500 mb-3">Showing {filtered.length} of {hotspots.length} projects</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((h) => (
            <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl hover:border-slate-700 transition">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {h.category.replace('_', ' ')}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1.5 leading-snug">{h.title}</h3>
                  <p className="text-xs text-slate-400">📍 {h.villageOrWard}, {h.district}, {h.state}</p>
                </div>

                <span className="bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold px-2.5 py-1 rounded-xl shrink-0 ml-2">
                  {h.priorityScore.toFixed(1)}
                </span>
              </div>

              {/* SDG Goals */}
              {h.sdgGoals && h.sdgGoals.length > 0 && (
                <SDGBadges goals={h.sdgGoals} size="xs" />
              )}

              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 block">Reports Fused</span>
                  <span className="font-bold text-white">{h.reportCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Beneficiaries</span>
                  <span className="font-bold text-emerald-400">{h.totalAffectedPopulation.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Est. Cost</span>
                  <span className="font-bold text-amber-400">₹{h.estimatedCostLakhs}L</span>
                </div>
              </div>

              {/* ROI + CO2 */}
              <div className="flex gap-2 text-xs">
                {h.economicROIMultiplier && (
                  <span className="flex items-center gap-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded">
                    📈 {h.economicROIMultiplier}x ROI
                  </span>
                )}
                {h.co2SavedTonsPerYear && (
                  <span className="flex items-center gap-1 bg-green-950/40 text-green-400 border border-green-800/50 px-2 py-0.5 rounded">
                    🌿 CO₂ -{h.co2SavedTonsPerYear}T/yr
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-400 truncate">
                  Scheme: <strong className="text-blue-300">{h.matchedScheme?.schemeName || 'State Grant'}</strong>
                </span>
                <span className={`font-bold flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${STATUS_COLORS[h.status] || 'text-slate-400'}`}>
                  {h.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Data Note */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 text-[11px] text-slate-500 flex items-center gap-3">
        <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>All data is fully aggregated and anonymized. Zero PII visible to the public. Available under <strong className="text-slate-300">CC BY 4.0</strong> for researchers, journalists, and civil society. API: <code className="text-emerald-400 font-mono">api.jansetu.gov.in/v1/hotspots</code></span>
      </div>
    </div>
  );
};
