import React, { useState } from 'react';
import {
  Map,
  Bot,
  Volume2,
  ShieldAlert,
  Building2,
  Zap
} from 'lucide-react';
import { DemandHotspot, PriorityWeights, SchemeInfo } from '../../types';
import { LeafletMapView } from './LeafletMapView';
import { PriorityWeightSliders } from './PriorityWeightSliders';
import { HotspotList } from './HotspotList';
import { CostOfInactionLedger } from './CostOfInactionLedger';
import { ProjectBriefModal } from './ProjectBriefModal';
import { SteelmanDebateModal } from './SteelmanDebateModal';
import { DigitalTwinModal } from './DigitalTwinModal';
import { CopilotChatDrawer } from './CopilotChatDrawer';
import { CorruptionXRayModal } from '../governance/CorruptionXRayModal';
import { getPanchayatElderStory } from '../../services/ai/panchayatElder';
import { LiveActivityFeed } from '../common/LiveActivityFeed';
import { NationalImpactBanner } from '../common/NationalImpactBanner';

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* National Impact Banner */}
      <NationalImpactBanner hotspots={hotspots} />

      {/* Top Banner Actions & Mode Switches */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-accent/20 text-gov-accent border border-gov-accent/30 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
              Policymaker Demand Prioritization Command Center
            </h2>
            <p className="text-xs text-slate-400">
              Cross-referencing citizen voice/photo reports against census demographics & scheme funds.
            </p>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowElderStory(!showElderStory)}
            className="bg-amber-600/90 hover:bg-amber-500 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
          >
            <Volume2 className="w-4 h-4" />
            Panchayat Elder Audio Mode
          </button>

          <button
            onClick={() => setShowCorruptionXRay(true)}
            className="bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
          >
            <ShieldAlert className="w-4 h-4" />
            Corruption X-Ray Auditor
          </button>

          <button
            onClick={() => setShowCopilot(true)}
            className="bg-gov-accent text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow hover:bg-sky-300"
          >
            <Bot className="w-4 h-4" />
            Copilot AI Chat
          </button>
        </div>
      </div>

      {/* Panchayat Elder Oral Story Banner if active */}
      {showElderStory && selectedHotspot && (
        <div className="bg-amber-950/80 border border-amber-700/80 p-4 rounded-2xl text-white space-y-2 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-400" />
              Panchayat Elder Persona (Gram Samvaad Voice Copilot)
            </span>
            <button
              onClick={() => setShowElderStory(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-amber-100 font-mono leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-amber-800/60 whitespace-pre-line">
            {getPanchayatElderStory(selectedHotspot)}
          </p>
        </div>
      )}

      {/* Ticking Cost of Inaction Counter */}
      <CostOfInactionLedger hotspots={hotspots} />

      {/* Transparent Formula Weight Sliders */}
      <PriorityWeightSliders
        weights={weights}
        onWeightChange={onWeightChange}
        isEquityLensActive={isEquityLensActive}
        onToggleEquityLens={onToggleEquityLens}
      />

      {/* Map & Hotspots Dual View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map Column */}
        <div className="lg:col-span-7">
          <LeafletMapView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(h) => setSelectedHotspot(h)}
            isDisasterMode={isDisasterMode}
          />
        </div>

        {/* Hotspot Rankings Column */}
        <div className="lg:col-span-5">
          <HotspotList
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(h) => setSelectedHotspot(h)}
            onOpenProjectBrief={(h) => setActiveDprHotspot(h)}
            onOpenSteelmanDebate={(h) => setActiveDebateHotspot(h)}
            onOpenDigitalTwin={(h) => setActiveTwinHotspot(h)}
            onOpenCorruptionXRay={() => setShowCorruptionXRay(true)}
          />
        </div>
      </div>

      {/* Live Activity Feed */}
      <LiveActivityFeed maxItems={8} />

      {/* Interactive Modals */}
      <ProjectBriefModal
        hotspot={activeDprHotspot}
        onClose={() => setActiveDprHotspot(null)}
      />
      <SteelmanDebateModal
        hotspot={activeDebateHotspot}
        onClose={() => setActiveDebateHotspot(null)}
      />
      <DigitalTwinModal
        hotspot={activeTwinHotspot}
        onClose={() => setActiveTwinHotspot(null)}
      />
      <CorruptionXRayModal
        isOpen={showCorruptionXRay}
        onClose={() => setShowCorruptionXRay(false)}
      />
      <CopilotChatDrawer
        isOpen={showCopilot}
        onClose={() => setShowCopilot(false)}
        hotspots={hotspots}
        schemes={schemes}
      />
    </div>
  );
};
