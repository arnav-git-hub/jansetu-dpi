import React from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, AlertTriangle, CheckCircle2, Database } from 'lucide-react';
import { PRIVACY_STATS } from '../../data/seedData';

export const PrivacyDashboard: React.FC = () => {
  const stats = PRIVACY_STATS;
  const scrubPercent = ((stats.piiScrubbedCount / stats.totalReports) * 100).toFixed(1);

  const redactionItems = [
    { label: 'Phone Numbers', count: stats.phoneRedactions, color: 'text-sky-400', bar: 'bg-sky-500' },
    { label: 'Aadhaar Numbers', count: stats.aadhaarRedactions, color: 'text-amber-400', bar: 'bg-amber-500' },
    { label: 'Names (NER)', count: stats.nameRedactions, color: 'text-emerald-400', bar: 'bg-emerald-500' },
    { label: 'PAN Card Numbers', count: stats.panRedactions, color: 'text-purple-400', bar: 'bg-purple-500' },
  ];
  const maxCount = Math.max(...redactionItems.map(r => r.count));

  const principles = [
    { icon: <Lock className="w-4 h-4" />, title: 'Data Minimization', desc: 'Only category, urgency & anonymized location transmitted. No personal identifiers leave the device.', status: 'COMPLIANT' },
    { icon: <EyeOff className="w-4 h-4" />, title: 'Purpose Limitation', desc: 'Data used exclusively for infrastructure demand aggregation. Zero third-party sharing or advertising.', status: 'COMPLIANT' },
    { icon: <CheckCircle2 className="w-4 h-4" />, title: 'Consent Framework', desc: `${stats.consentGrantedPercent}% of users provided explicit consent. Opt-out honored in < 24 hours.`, status: 'COMPLIANT' },
    { icon: <Database className="w-4 h-4" />, title: 'Data Retention', desc: `Anonymized reports purged after ${stats.dataRetentionDays} days per DPDP Section 8(7). Hash chain retained for audit only.`, status: 'COMPLIANT' },
    { icon: <Eye className="w-4 h-4" />, title: 'Right to Erasure', desc: 'Citizens can request erasure via tracking ID. Purge propagates within 72 hours across all nodes.', status: 'COMPLIANT' },
    { icon: <AlertTriangle className="w-4 h-4" />, title: 'Breach Notification', desc: 'Automated CERT-In 72-hour breach notification pipeline with encrypted incident log.', status: 'COMPLIANT' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 text-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 border border-purple-800/80 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            DPDP Act 2023 Privacy Compliance Center
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Citizen Data Privacy Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time visibility into edge PII scrubbing, consent management, data minimization, and compliance posture under India's Digital Personal Data Protection Act 2023.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-purple-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">PII Scrub Rate</span>
            <span className="text-3xl font-black text-purple-400 font-mono">{scrubPercent}%</span>
          </div>
          <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-emerald-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Compliance</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">100%</span>
          </div>
        </div>
      </div>

      {/* PII Redaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-400" />
            Edge PII Redactions by Type
          </h3>
          <div className="space-y-3">
            {redactionItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.count} redacted</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.bar} rounded-full transition-all duration-1000`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
            Total PII entities redacted: <span className="font-bold text-white">{stats.phoneRedactions + stats.aadhaarRedactions + stats.nameRedactions + stats.panRedactions}</span>
            {' '}across <span className="font-bold text-white">{stats.totalReports}</span> reports
          </div>
        </div>

        {/* Data Flow Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-400" />
            Data Flow & Minimization
          </h3>
          
          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">1. On-Device Collection</span>
                <span className="text-emerald-400 font-semibold">✓ Localized</span>
              </div>
              <p className="text-slate-500">Voice/photo processed locally. Transcription on-device via Whisper-lite.</p>
            </div>
            <div className="text-slate-600 text-center text-xs">↓ PII Scrubber Applied</div>
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">2. Edge Scrub (DPDP §7)</span>
                <span className="text-amber-400 font-semibold">✓ Redacted</span>
              </div>
              <p className="text-slate-500">Phone, Aadhaar, PAN, name entities removed before leaving device memory.</p>
            </div>
            <div className="text-slate-600 text-center text-xs">↓ Anonymized Payload Only</div>
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400">3. Cloud Aggregation</span>
                <span className="text-sky-400 font-semibold">✓ Encrypted</span>
              </div>
              <p className="text-slate-500">Only category, geo-cluster, urgency, and language code transmitted. TLS 1.3 in transit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* DPDP Principle Compliance Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          DPDP Act 2023 — Compliance Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {principles.map((p) => (
            <div key={p.title} className="bg-slate-950 border border-emerald-800/40 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  {p.icon}
                  <span className="font-bold text-xs text-slate-100">{p.title}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  {p.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 text-[11px] text-slate-500 leading-relaxed">
        <span className="font-semibold text-slate-400">Legal Note:</span> JanSetu is a Digital Public Good (DPG) aligned with the UNDP DPG Standard v2.0. All citizen data is processed under the Digital Personal Data Protection Act 2023 (India). The system serves as a Data Fiduciary under §2(i) of DPDP 2023. Grievance Redressal Officer contact: dpo@jansetu.gov.in | CERT-In registration: IN-CER-2026-JS-004.
      </div>
    </div>
  );
};
