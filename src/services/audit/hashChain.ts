import { AuditLogEntry } from '../../types';

export async function generateHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function appendAuditLog(
  existingLogs: AuditLogEntry[],
  action: AuditLogEntry['action'],
  entityId: string,
  details: string,
  actor: string
): Promise<AuditLogEntry[]> {
  const lastLog = existingLogs[existingLogs.length - 1];
  const prevHash = lastLog ? lastLog.hash : '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = new Date().toISOString();
  
  const payload = `${prevHash}|${timestamp}|${action}|${entityId}|${details}|${actor}`;
  const hash = await generateHash(payload);

  const newEntry: AuditLogEntry = {
    id: `AUDIT-${String(existingLogs.length + 1).padStart(3, '0')}`,
    timestamp,
    action,
    entityId,
    details,
    hash,
    prevHash,
    actor
  };

  return [...existingLogs, newEntry];
}

export function verifyAuditLedgerIntegrity(logs: AuditLogEntry[]): { isTamperFree: boolean; brokenAtIndex?: number } {
  for (let i = 0; i < logs.length; i++) {
    const current = logs[i];
    const prev = i > 0 ? logs[i - 1] : null;

    if (prev && current.prevHash !== prev.hash) {
      return { isTamperFree: false, brokenAtIndex: i };
    }
  }
  return { isTamperFree: true };
}
