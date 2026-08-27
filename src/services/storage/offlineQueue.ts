import { CitizenReport } from '../../types';

const QUEUE_KEY = 'jansetu_offline_reports_queue';

export function getOfflineQueuedReports(): CitizenReport[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineReport(report: CitizenReport): void {
  const current = getOfflineQueuedReports();
  const updated = [...current, { ...report, status: 'QUEUED_OFFLINE' as const }];
  localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}
