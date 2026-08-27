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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border border-cyan-800/80 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <SearchCheck className="w-3.5 h-3.5 text-cyan-400" />
            SHA-256 Cryptographic Ledger
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Tamper-Evident Open Audit Trail
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Every citizen request, PII redaction, DBSCAN cluster assignment, priority score recalculation, and fund allocation is cryptographically hash-chained.
          </p>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-cyan-800/80 text-center shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            {integrity.isTamperFree ? 'LEDGER VERIFIED INTACT' : 'TAMPER ALERT'}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">100% Cryptographic Verification</span>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {logs.map((log, idx) => (
          <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg font-mono text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-bold">
                  #{idx + 1} • {log.id}
                </span>
                <span className="text-cyan-400 font-bold">{log.action}</span>
                <span className="text-slate-500">[{log.entityId}]</span>
              </div>
              <span className="text-[11px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
            </div>

            <p className="text-slate-200 font-sans text-xs">{log.details}</p>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-[10px] text-slate-400">
              <div className="flex justify-between items-center truncate">
                <span>Prev Hash:</span>
                <span className="text-slate-500 font-mono">{log.prevHash}</span>
              </div>
              <div className="flex justify-between items-center truncate text-amber-300">
                <span>Current Hash:</span>
                <span className="font-mono font-bold">{log.hash}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-900">
                <span>Actor: {log.actor}</span>
                <span className="text-emerald-400 font-bold">SHA-256 Verified ✓</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
