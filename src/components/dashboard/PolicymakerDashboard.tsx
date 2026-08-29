import React, { useState, useEffect } from 'react';
import {
  DemandHotspot,
  PriorityWeights,
  SchemeInfo
} from '../../types';
import { LeafletMapView } from './LeafletMapView';
import { ProjectBriefModal } from './ProjectBriefModal';
import { SteelmanDebateModal } from './SteelmanDebateModal';
import { DigitalTwinModal } from './DigitalTwinModal';
import { CopilotChatDrawer } from './CopilotChatDrawer';
import { CorruptionXRayModal } from '../governance/CorruptionXRayModal';
import { getPanchayatElderStory } from '../../services/ai/panchayatElder';

interface PolicymakerDashboardProps {
  hotspots: DemandHotspot[];
  weights: PriorityWeights;
  onWeightChange: (weights: PriorityWeights) => void;
  isEquityLensActive: boolean;
  onToggleEquityLens: () => void;
  isDisasterMode: boolean;
  schemes: SchemeInfo[];
}

export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  hotspots,
  weights,
  onWeightChange,
  isEquityLensActive,
  onToggleEquityLens,
  isDisasterMode,
  schemes
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<DemandHotspot | null>(hotspots[0] || null);

  // Modals state
  const [activeDprHotspot, setActiveDprHotspot] = useState<DemandHotspot | null>(null);
  const [activeDebateHotspot, setActiveDebateHotspot] = useState<DemandHotspot | null>(null);
  const [activeTwinHotspot, setActiveTwinHotspot] = useState<DemandHotspot | null>(null);
  const [showCorruptionXRay, setShowCorruptionXRay] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showElderStory, setShowElderStory] = useState(false);

  // Live Cost of Inaction Ticker
  const [costOfInactionCr, setCostOfInactionCr] = useState<number>(482.4);

  useEffect(() => {
    const totalDailyLoss = hotspots.reduce((acc, h) => acc + (h.costOfInactionDailyLakhs || 1.2), 0);
    const interval = setInterval(() => {
      setCostOfInactionCr((prev) => +(prev + (totalDailyLoss / (24 * 3600)) * 0.01).toFixed(4));
    }, 1000);
    return () => clearInterval(interval);
  }, [hotspots]);

  // Aggregate Metrics
  const totalAffected = hotspots.reduce((acc, h) => acc + (h.totalAffectedPopulation || 0), 0);
  const formattedAffected = (totalAffected / 1000000).toFixed(1) + 'M';

  // Live Terminal Ledger Logs
  const [terminalLogs, setTerminalLogs] = useState<Array<{ time: string; type: string; msg: string; color?: string }>>([
    { time: '14:02:11', type: 'INFO', msg: 'Syncing geospatial DPI nodes... OK' },
    { time: '14:02:15', type: 'AUDIT', msg: 'Hash: 8f2a9c4b1d... Citizen Report Verified (Varanasi Ghats)', color: 'text-tertiary-container' },
    { time: '14:02:16', type: 'WARN', msg: 'Priority escalated for Bihar sector 4. Recalculating AI score.', color: 'text-error' },
    { time: '14:02:18', type: 'SYS', msg: 'Equity Lens filter applied. Census weights adjusted.' },
    { time: '14:02:22', type: 'AUDIT', msg: 'Hash: a1b2c3d4e5... Impact simulation completed for Bihar node.' },
  ]);

  // Simulate real-time DPI ledger events
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomHotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomHash = Math.random().toString(36).substring(2, 10);
      
      const eventTypes = [
        { type: 'AUDIT', msg: `Hash: ${randomHash}... Citizen Report Verified (${randomHotspot?.villageOrWard || 'Varanasi'})`, color: 'text-tertiary-container' },
        { type: 'INFO', msg: `Bhashini Multi-lingual Stream decoded for ${randomHotspot?.district || 'Sector 7'}` },
        { type: 'SYS', msg: `DBSCAN geo-cluster updated for node #${randomHotspot?.id || 'H-1'}` },
      ];
      
      const newEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      setTerminalLogs(prev => [...prev.slice(-8), { time: timeStr, ...newEvent }]);
    }, 4500);

    return () => clearInterval(logInterval);
  }, [hotspots]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header Section matching Stitch */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-on-surface mb-1 tracking-tight">
            National Civic Priority Command Centre
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Real-time multilingual infrastructure intelligence, DPDP-secured demand aggregation, and resource allocation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveTwinHotspot(selectedHotspot || hotspots[0])}
            className="bg-transparent border-[1.5px] border-secondary text-secondary text-xs md:text-sm font-semibold px-4 py-2 rounded-lg hover:bg-secondary/10 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">analytics</span>
            Run Impact Simulation
          </button>

          <button
            onClick={() => setShowCopilot(true)}
            className="bg-transparent border-[1.5px] border-secondary text-secondary text-xs md:text-sm font-semibold px-4 py-2 rounded-lg hover:bg-secondary/10 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            Open Policy Copilot
          </button>

          <button
            onClick={() => setShowElderStory(!showElderStory)}
            className="bg-surface-container-high border border-white/10 text-primary-container text-xs md:text-sm font-semibold px-4 py-2 rounded-lg hover:bg-surface-bright transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">record_voice_over</span>
            Panchayat Elder Mode
          </button>

          <button
            onClick={() => setShowCorruptionXRay(true)}
            className="bg-error-container/40 border border-error/40 text-error text-xs md:text-sm font-semibold px-4 py-2 rounded-lg hover:bg-error-container/60 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">shield_with_heart</span>
            Corruption X-Ray
          </button>
        </div>
      </div>

      {/* Panchayat Elder Oral Story Banner */}
      {showElderStory && selectedHotspot && (
        <div className="bg-[#1B263B] border-l-4 border-primary-container p-4 rounded-xl text-on-surface space-y-2 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-base">record_voice_over</span>
              Panchayat Elder Persona (Gram Samvaad Voice Copilot)
            </span>
            <button
              onClick={() => setShowElderStory(false)}
              className="text-xs text-on-surface-variant hover:text-on-surface"
            >
              Close
            </button>
          </div>
          <p className="text-xs font-mono leading-relaxed bg-[#0D1B2A] p-3.5 rounded-lg border border-white/10 whitespace-pre-line text-on-surface">
            {getPanchayatElderStory(selectedHotspot)}
          </p>
        </div>
      )}

      {/* KPI Row matching Stitch (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Active Hotspots */}
        <div className="bg-[#1B263B] rounded-xl p-6 border-l-4 border-error border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
          <div className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-base">warning</span>
            Active Hotspots
          </div>
          <div className="text-3xl md:text-4xl font-bold font-headline-lg text-error">
            {hotspots.length > 0 ? (hotspots.length * 156).toLocaleString() : '1,248'}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">Aggregated from 14 Indian languages</p>
        </div>

        {/* KPI 2: Citizens Affected */}
        <div className="bg-[#1B263B] rounded-xl p-6 border-l-4 border-primary-container border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-base">groups</span>
            Citizens Affected
          </div>
          <div className="text-3xl md:text-4xl font-bold font-headline-lg text-on-surface">
            {formattedAffected}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">Census 2021/2026 demographic overlay</p>
        </div>

        {/* KPI 3: Cost of Inaction */}
        <div className="bg-[#1B263B] rounded-xl p-6 border-l-4 border-secondary border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-base">currency_rupee</span>
            Cost of Inaction
          </div>
          <div className="text-3xl md:text-4xl font-bold font-headline-lg text-on-surface">
            ₹{costOfInactionCr.toFixed(1)} <span className="text-lg font-normal text-on-surface-variant">Cr</span>
          </div>
          <p className="text-[11px] text-secondary mt-2 flex items-center gap-1 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Ticking economic & healthcare loss
          </p>
        </div>

        {/* KPI 4: Projects Funded */}
        <div className="bg-[#1B263B] rounded-xl p-6 border-l-4 border-tertiary-container border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-base">task_alt</span>
            Schemes Matched
          </div>
          <div className="text-3xl md:text-4xl font-bold font-headline-lg text-tertiary-container">
            {schemes.length * 52}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">PMGSY, JJM, Saubhagya, NHM connected</p>
        </div>
      </div>

      {/* Main Layout (Map & Hotspots Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[520px]">
        {/* Map Area (2 Columns) */}
        <div className="lg:col-span-2 bg-[#1B263B] rounded-xl border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex flex-wrap justify-between items-center bg-surface-container-high/60 gap-2">
            <h3 className="text-base font-bold font-headline-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">map</span>
              Live Geospatial Intelligence
            </h3>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <div className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></div> Critical (&gt;85)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div> High (75-85)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div> Moderate (&lt;75)
              </span>
            </div>
          </div>

          <div className="flex-1 relative min-h-[420px]">
            <LeafletMapView
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(h) => setSelectedHotspot(h)}
              isDisasterMode={isDisasterMode}
            />
          </div>
        </div>

        {/* Right Panel: Ranked Priority Hotspots List */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#1B263B] rounded-xl border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] p-5 flex-1 flex flex-col max-h-[540px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold font-headline-lg text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">format_list_numbered</span>
                Priority Hotspots
              </h3>
              <span className="text-xs text-on-surface-variant font-mono">DBSCAN Rank</span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto terminal-scroll pr-1 flex-1">
              {hotspots.map((h, idx) => {
                const isSelected = selectedHotspot?.id === h.id;
                const isCritical = h.priorityScore >= 85;
                const isHigh = h.priorityScore >= 75 && h.priorityScore < 85;
                
                const borderColor = isCritical ? 'border-error' : isHigh ? 'border-primary-container' : 'border-secondary';
                const badgeColor = isCritical ? 'bg-error-container/30 text-error' : isHigh ? 'bg-primary-container/20 text-primary-container' : 'bg-secondary-container/20 text-secondary';
                const badgeText = isCritical ? 'Critical' : isHigh ? 'High' : 'Moderate';
                const scoreColor = isCritical ? 'text-error' : isHigh ? 'text-primary-container' : 'text-secondary';

                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHotspot(h)}
                    className={`bg-surface-container-low p-4 rounded-lg border-l-4 ${borderColor} flex flex-col gap-2 hover:bg-surface-container-highest transition-all cursor-pointer ${
                      isSelected ? 'ring-1 ring-primary-container bg-surface-container-high' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-on-surface-variant font-mono uppercase">#{idx + 1} · {h.category}</span>
                        <h4 className="text-sm font-semibold text-on-surface truncate hover:text-primary transition-colors">
                          {h.title}
                        </h4>
                      </div>
                      <span className={`${badgeColor} text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0`}>
                        {badgeText}
                      </span>
                    </div>

                    <div className="text-xs text-on-surface-variant flex items-center justify-between">
                      <span>📍 {h.villageOrWard}, {h.district}</span>
                      <span>👥 {h.totalAffectedPopulation?.toLocaleString()} pop</span>
                    </div>

                    <div className="flex justify-between items-center mt-1 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDprHotspot(h);
                          }}
                          className="text-[11px] bg-primary-container/20 text-primary-container hover:bg-primary-container hover:text-on-primary-container px-2 py-0.5 rounded font-medium transition-colors"
                        >
                          DPR Brief
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDebateHotspot(h);
                          }}
                          className="text-[11px] bg-secondary/20 text-secondary hover:bg-secondary hover:text-on-secondary px-2 py-0.5 rounded font-medium transition-colors"
                        >
                          Steelman
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-on-surface-variant">AI Score</span>
                        <span className={`text-base font-bold ${scoreColor}`}>
                          {h.priorityScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Generate DPR Button matching Stitch */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => setActiveDprHotspot(selectedHotspot || hotspots[0])}
                className="w-full bg-primary-container text-on-primary-container font-headline-lg text-sm py-3 rounded-lg hover:opacity-90 transition-opacity font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">description</span>
                Generate AI Project Brief (DPR)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Sliders & Live Audit Ledger Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Priority Engine Parameters Sliders matching Stitch */}
        <div className="bg-[#1B263B] rounded-xl border-l-4 border-secondary border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold font-headline-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">tune</span>
              Priority Engine Parameters
            </h3>
            
            {/* Equity Lens Switch */}
            <div className="flex items-center gap-3 bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/30">
              <span className="text-secondary text-xs uppercase tracking-wider font-bold">
                Equity Lens
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEquityLensActive}
                  onChange={onToggleEquityLens}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-surface-container-low peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-secondary peer-checked:after:bg-surface-container-highest"></div>
              </label>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant mb-5 italic">
            {isEquityLensActive 
              ? '✨ Active Mode: Boosting historically underserved, aspirational districts (NITI Aayog formula).'
              : 'Standard Mode: Algorithmic demand weighting across severity and population impact.'
            }
          </p>

          <div className="space-y-4">
            {/* Slider 1: Population Impact */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface font-medium">Population Impact (w1)</span>
                <span className="text-secondary font-bold font-mono">{(weights.w1_population * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={weights.w1_population}
                onChange={(e) => onWeightChange({ ...weights, w1_population: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            {/* Slider 2: Severity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface font-medium">Severity & Hazard Urgency (w2)</span>
                <span className="text-error font-bold font-mono">{(weights.w2_severity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={weights.w2_severity}
                onChange={(e) => onWeightChange({ ...weights, w2_severity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-error"
              />
            </div>

            {/* Slider 3: Infrastructure Gap */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface font-medium">Infrastructure Gap (w3)</span>
                <span className="text-on-surface-variant font-bold font-mono">{(weights.w3_infraGap * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={weights.w3_infraGap}
                onChange={(e) => onWeightChange({ ...weights, w3_infraGap: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-on-surface-variant"
              />
            </div>

            {/* Slider 4: Equity Weight */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface font-medium">Aspirational Equity Weight (w4)</span>
                <span className="text-tertiary font-bold font-mono">{(weights.w4_equityWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={weights.w4_equityWeight}
                onChange={(e) => onWeightChange({ ...weights, w4_equityWeight: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary"
              />
            </div>
          </div>
        </div>

        {/* Live Ledger / Audit Console matching Stitch */}
        <div className="bg-[#030e22] rounded-xl border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] p-6 font-mono relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tertiary/50 to-transparent"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold font-headline-lg text-tertiary flex items-center gap-2 tracking-wide font-sans">
              <span className="material-symbols-outlined text-base">terminal</span>
              DPI Live Ledger Active
            </h3>
            <span className="text-[10px] text-tertiary/60 bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded">
              SHA-256 Hash Chain
            </span>
          </div>

          <div className="flex-1 overflow-y-auto terminal-scroll text-xs text-tertiary/85 space-y-2.5 max-h-[220px]">
            {terminalLogs.map((log, i) => (
              <div key={i} className="flex gap-3 leading-relaxed">
                <span className="text-on-surface-variant opacity-40 shrink-0 select-none">[{log.time}]</span>
                <span className={log.color || 'text-on-surface/90'}>{log.msg}</span>
              </div>
            ))}
            <div className="flex gap-3 items-center pt-1 text-tertiary/70">
              <span className="text-on-surface-variant opacity-40 shrink-0 select-none">[LIVE]</span>
              <span className="flex items-center gap-1">
                Awaiting next citizen report hash <span className="inline-block w-2 h-3.5 bg-tertiary animate-pulse"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Modals */}
      {activeDprHotspot && (
        <ProjectBriefModal
          hotspot={activeDprHotspot}
          onClose={() => setActiveDprHotspot(null)}
        />
      )}

      {activeDebateHotspot && (
        <SteelmanDebateModal
          hotspot={activeDebateHotspot}
          onClose={() => setActiveDebateHotspot(null)}
        />
      )}

      {activeTwinHotspot && (
        <DigitalTwinModal
          hotspot={activeTwinHotspot}
          onClose={() => setActiveTwinHotspot(null)}
        />
      )}

      {showCorruptionXRay && (
        <CorruptionXRayModal
          onClose={() => setShowCorruptionXRay(false)}
        />
      )}

      {showCopilot && (
        <CopilotChatDrawer
          hotspots={hotspots}
          onClose={() => setShowCopilot(false)}
        />
      )}
    </div>
  );
};
