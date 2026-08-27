import React, { useState, useEffect } from 'react';
import {
  LanguageCode,
  CitizenReport,
  DemandHotspot,
  PriorityWeights,
  AuditLogEntry
} from './types';
import {
  SEEDED_HOTSPOTS,
  INITIAL_SCHEMES,
  INITIAL_AUDIT_LOGS
} from './data/seedData';
import { DEFAULT_WEIGHTS, calculatePriorityScore, clusterNewReport } from './services/clustering/scoringEngine';
import { appendAuditLog } from './services/audit/hashChain';
import { getOfflineQueuedReports, saveOfflineReport, clearOfflineQueue } from './services/storage/offlineQueue';

// Components
import { Header } from './components/common/Header';
import { CitizenPortal } from './components/ingestion/CitizenPortal';
import { PolicymakerDashboard } from './components/dashboard/PolicymakerDashboard';
import { PublicPortal } from './components/governance/PublicPortal';
import { ConstituencyReportCard } from './components/governance/ConstituencyReportCard';
import { AuditTrailModal } from './components/governance/AuditTrailModal';
import { PrivacyDashboard } from './components/governance/PrivacyDashboard';
import { NationalImpactBanner } from './components/common/NationalImpactBanner';
import { LiveActivityFeed } from './components/common/LiveActivityFeed';

type TabType = 'CITIZEN' | 'POLICYMAKER' | 'PUBLIC_PORTAL' | 'REPORT_CARDS' | 'AUDIT_LEDGER' | 'PRIVACY_DASHBOARD';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('POLICYMAKER');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('hi');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  // Core Data States
  const [hotspots, setHotspots] = useState<DemandHotspot[]>(SEEDED_HOTSPOTS);
  const [weights, setWeights] = useState<PriorityWeights>(DEFAULT_WEIGHTS);
  const [isEquityLensActive, setIsEquityLensActive] = useState<boolean>(false);
  const [isDisasterMode, setIsDisasterMode] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Monitor network online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto flush offline queue when coming back online
      const queued = getOfflineQueuedReports();
      if (queued.length > 0) {
        queued.forEach((r) => handleAddNewReport(r));
        clearOfflineQueue();
        setOfflineQueueCount(0);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setOfflineQueueCount(getOfflineQueuedReports().length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Recalculate priority scores whenever weights, equity lens, or disaster mode changes
  useEffect(() => {
    setHotspots((prev) =>
      prev
        .map((h) => ({
          ...h,
          priorityScore: calculatePriorityScore(h, weights, isEquityLensActive, isDisasterMode)
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore)
    );
  }, [weights, isEquityLensActive, isDisasterMode]);

  // Handler for new citizen report submission
  const handleAddNewReport = async (report: CitizenReport) => {
    if (!isOnline) {
      saveOfflineReport(report);
      setOfflineQueueCount((prev) => prev + 1);
      return;
    }

    // 1. Cluster report into DBSCAN demand hotspots
    const { updatedHotspots, targetHotspotId } = clusterNewReport(report, hotspots, weights);
    
    // Sort hotspots by recalculated priority score
    const sorted = [...updatedHotspots].sort((a, b) => b.priorityScore - a.priorityScore);
    setHotspots(sorted);

    // 2. Append SHA-256 Hash Chain Audit Entry
    const newLogs = await appendAuditLog(
      auditLogs,
      'REQUEST_CREATED',
      report.id,
      `New citizen report (${report.language}) fused into Hotspot ${targetHotspotId}. PII scrubbed: ${report.piiScrubbed}`,
      `Device ${report.channel}`
    );
    setAuditLogs(newLogs);
  };

  // Handler for weights adjustment
  const handleWeightChange = async (newWeights: PriorityWeights) => {
    setWeights(newWeights);

    // Append Audit Entry for Weight recalculation
    const updatedAudit = await appendAuditLog(
      auditLogs,
      'PRIORITY_RECALCULATED',
      'ENGINE-KERNEL',
      `Weights adjusted: w1=${newWeights.w1_population.toFixed(2)}, w2=${newWeights.w2_severity.toFixed(2)}, w3=${newWeights.w3_infraGap.toFixed(2)}, w4=${newWeights.w4_equityWeight.toFixed(2)}`,
      'Policymaker Console'
    );
    setAuditLogs(updatedAudit);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab as any}
        setActiveTab={setActiveTab as any}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        isOnline={isOnline}
        offlineQueueCount={offlineQueueCount}
        isDisasterMode={isDisasterMode}
        setIsDisasterMode={setIsDisasterMode}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'CITIZEN' && (
          <div className="max-w-4xl mx-auto px-4 pt-5 pb-2">
            <NationalImpactBanner hotspots={hotspots} />
          </div>
        )}
        {activeTab === 'CITIZEN' && (
          <CitizenPortal
            selectedLang={selectedLang}
            onSubmitNewReport={handleAddNewReport}
            hotspots={hotspots}
          />
        )}

        {activeTab === 'POLICYMAKER' && (
          <PolicymakerDashboard
            hotspots={hotspots}
            weights={weights}
            onWeightChange={handleWeightChange}
            isEquityLensActive={isEquityLensActive}
            onToggleEquityLens={() => setIsEquityLensActive(!isEquityLensActive)}
            isDisasterMode={isDisasterMode}
            schemes={INITIAL_SCHEMES}
          />
        )}

        {activeTab === 'PUBLIC_PORTAL' && (
          <>
            <PublicPortal hotspots={hotspots} />
            <div className="max-w-7xl mx-auto px-4 pb-6">
              <LiveActivityFeed maxItems={12} />
            </div>
          </>
        )}

        {activeTab === 'REPORT_CARDS' && <ConstituencyReportCard />}

        {activeTab === 'AUDIT_LEDGER' && <AuditTrailModal logs={auditLogs} />}

        {activeTab === 'PRIVACY_DASHBOARD' && <PrivacyDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>
            JanSetu (जनसेतु) — AI for Digital Public Infrastructure · UNDP DPG #IND-2026-JS · DPDP Act 2023 Compliant · SDG-Aligned · Apache 2.0
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-400 italic">"Aapki awaaz, desh ki priority."</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400 font-semibold">🏆 Hackathon Track 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
