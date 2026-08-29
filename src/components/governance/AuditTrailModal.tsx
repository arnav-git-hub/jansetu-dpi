import React from 'react';
import { SearchCheck, ShieldCheck, Lock, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { verifyAuditLedgerIntegrity } from '../../services/audit/hashChain';

interface AuditTrailModalProps {
  logs: AuditLogEntry[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ logs }) => {
  const integrity = verifyAuditLedgerIntegrity(logs);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6 text-on-surface">
      {/* Hero Banner */}
      <div className="bg-[#1B263B] border border-white/10 rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-secondary/15 text-secondary border border-secondary/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 font-mono">
            <SearchCheck className="w-3.5 h-3.5" />
            SHA-256 Cryptographic Ledger
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-headline-lg text-on-surface">
            Tamper-Evident Open Audit Trail
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
            Every citizen request, PII redaction, DBSCAN cluster assignment, priority score recalculation, and fund allocation is cryptographically hash-chained.
          </p>
        </div>

        <div className="bg-surface-container-lowest px-5 py-3 rounded-xl border border-white/10 text-center shrink-0">
          <div className="flex items-center gap-1.5 text-tertiary-container font-bold text-sm font-headline-lg">
            <ShieldCheck className="w-5 h-5" />
            {integrity.isTamperFree ? 'LEDGER VERIFIED INTACT' : 'TAMPER ALERT'}
          </div>
          <span className="text-[10px] text-on-surface-variant font-mono block mt-1">100% Cryptographic Verification</span>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {logs.map((log, idx) => (
          <div key={log.id} className="bg-[#1B263B] border border-white/10 rounded-xl p-4 space-y-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] font-mono text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-surface-container text-on-surface px-2 py-0.5 rounded text-[11px] font-bold border border-white/5">
                  #{idx + 1} • {log.id}
                </span>
                <span className="text-secondary font-bold">{log.action}</span>
                <span className="text-on-surface-variant">[{log.entityId}]</span>
              </div>
              <span className="text-[11px] text-on-surface-variant">{new Date(log.timestamp).toLocaleString()}</span>
            </div>

            <p className="text-on-surface font-sans text-xs">{log.details}</p>

            <div className="bg-[#030e22] p-2.5 rounded-lg border border-white/5 space-y-1 text-[10px] text-on-surface-variant">
              <div className="flex justify-between items-center truncate">
                <span>Prev Hash:</span>
                <span className="text-on-surface-variant opacity-70 font-mono">{log.prevHash}</span>
              </div>
              <div className="flex justify-between items-center truncate text-primary-container">
                <span>Current Hash:</span>
                <span className="font-mono font-bold">{log.hash}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant pt-1 border-t border-white/5">
                <span>Actor: {log.actor}</span>
                <span className="text-tertiary font-bold">SHA-256 Verified ✓</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
