import React from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, AlertTriangle, CheckCircle2, Database } from 'lucide-react';
import { PRIVACY_STATS } from '../../data/seedData';

export const PrivacyDashboard: React.FC = () => {
  const stats = PRIVACY_STATS;
  const scrubPercent = ((stats.piiScrubbedCount / stats.totalReports) * 100).toFixed(1);

  const redactionItems = [
    { label: 'Phone Numbers', count: stats.phoneRedactions, color: 'text-secondary', bar: 'bg-secondary' },
    { label: 'Aadhaar Numbers', count: stats.aadhaarRedactions, color: 'text-primary-container', bar: 'bg-primary-container' },
    { label: 'Names (NER)', count: stats.nameRedactions, color: 'text-tertiary-container', bar: 'bg-tertiary-container' },
    { label: 'PAN Card Numbers', count: stats.panRedactions, color: 'text-primary', bar: 'bg-primary' },
  ];
  const maxCount = Math.max(...redactionItems.map(r => r.count));

  const principles = [
    { icon: <Lock className="w-4 h-4" />, title: 'Data Minimization', desc: 'Only category, urgency & anonymized location transmitted. No personal identifiers leave the client device.', status: 'COMPLIANT' },
    { icon: <EyeOff className="w-4 h-4" />, title: 'Purpose Limitation', desc: 'Data used exclusively for infrastructure demand aggregation. Zero third-party sharing or commercial ads.', status: 'COMPLIANT' },
    { icon: <CheckCircle2 className="w-4 h-4" />, title: 'Consent Framework', desc: `${stats.consentGrantedPercent}% of users provided explicit consent. Instant opt-out honored without penalty.`, status: 'COMPLIANT' },
    { icon: <Database className="w-4 h-4" />, title: 'Data Retention', desc: `Anonymized reports purged after ${stats.dataRetentionDays} days per DPDP Section 8(7). Hash chain retained for audit only.`, status: 'COMPLIANT' },
    { icon: <Eye className="w-4 h-4" />, title: 'Right to Erasure', desc: 'Citizens can request erasure via tracking ID. Purge propagates cryptographically within 72 hours.', status: 'COMPLIANT' },
    { icon: <AlertTriangle className="w-4 h-4" />, title: 'Breach Notification', desc: 'Automated CERT-In 72-hour breach notification pipeline with tamper-evident incident logging.', status: 'COMPLIANT' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6 text-on-surface">
      {/* Hero Banner */}
      <div className="bg-[#1B263B] border border-white/10 rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-tertiary/15 text-tertiary border border-tertiary/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDP Act 2023 Privacy Compliance Center
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-headline-lg text-on-surface">
            Citizen Data Privacy & Edge Scrubbing Dashboard
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
            Real-time visibility into edge PII scrubbing, consent management, data minimization, and compliance posture under India's Digital Personal Data Protection Act 2023.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-surface-container-lowest px-4 py-3 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] text-on-surface-variant font-mono block uppercase">PII Scrub Rate</span>
            <span className="text-3xl font-black text-secondary font-headline-lg">{scrubPercent}%</span>
          </div>
          <div className="bg-surface-container-lowest px-4 py-3 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] text-on-surface-variant font-mono block uppercase">Compliance</span>
            <span className="text-3xl font-black text-tertiary-container font-headline-lg">100%</span>
          </div>
        </div>
      </div>

      {/* PII Redaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1B263B] border border-white/10 rounded-xl p-5 space-y-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <h3 className="font-bold text-sm font-headline-lg text-on-surface flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-primary-container" />
            Edge PII Redactions by Type
          </h3>
          <div className="space-y-3">
            {redactionItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface">{item.label}</span>
                  <span className={`font-bold font-mono ${item.color}`}>{item.count} redacted</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.bar} rounded-full transition-all duration-1000`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-white/5 text-xs text-on-surface-variant">
            Total PII entities redacted: <span className="font-bold text-on-surface font-mono">{stats.phoneRedactions + stats.aadhaarRedactions + stats.nameRedactions + stats.panRedactions}</span>
            {' '}across <span className="font-bold text-on-surface font-mono">{stats.totalReports}</span> reports
          </div>
        </div>

        {/* Data Flow Summary */}
        <div className="bg-[#1B263B] border border-white/10 rounded-xl p-5 space-y-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <h3 className="font-bold text-sm font-headline-lg text-on-surface flex items-center gap-2">
            <Database className="w-4 h-4 text-secondary" />
            Data Flow & Edge Minimization
          </h3>
          
          <div className="space-y-2.5 text-xs">
            <div className="bg-surface-container-low rounded-lg p-3 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-on-surface font-medium">1. On-Device Collection</span>
                <span className="text-tertiary font-semibold">✓ Localized</span>
              </div>
              <p className="text-on-surface-variant">Voice/photo processed locally. Transcription on-device via Whisper-lite.</p>
            </div>
            <div className="text-on-surface-variant text-center text-xs opacity-60">↓ PII Scrubber Applied</div>
            <div className="bg-surface-container-low rounded-lg p-3 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-on-surface font-medium">2. Anonymized Ingestion Gateway</span>
                <span className="text-secondary font-semibold">✓ Zero PII Stored</span>
              </div>
              <p className="text-on-surface-variant">Names, phone numbers, and Aadhaar numbers replaced with cryptographic tokens.</p>
            </div>
            <div className="text-on-surface-variant text-center text-xs opacity-60">↓ DBSCAN Clustering Engine</div>
            <div className="bg-surface-container-low rounded-lg p-3 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-on-surface font-medium">3. Aggregate Public Good</span>
                <span className="text-primary-container font-semibold">✓ Open DPI</span>
              </div>
              <p className="text-on-surface-variant">Only clustered demand hotspots visible to policymakers and public observatory.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 DPDP Core Principles Grid */}
      <div className="bg-[#1B263B] border border-white/10 rounded-xl p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] space-y-4">
        <h3 className="font-bold text-sm font-headline-lg text-on-surface flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-tertiary" />
          DPDP Act 2023 Statutory Compliance Framework
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {principles.map((p, i) => (
            <div key={i} className="bg-surface-container-low p-4 rounded-lg border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-secondary font-semibold text-xs font-headline-lg">
                  {p.icon}
                  {p.title}
                </div>
                <span className="text-[10px] bg-tertiary/20 text-tertiary px-1.5 py-0.5 rounded font-mono font-bold">
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
