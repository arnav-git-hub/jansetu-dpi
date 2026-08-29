import React, { useState, useEffect, useRef } from 'react';
import { Zap, ShieldCheck, Wifi } from 'lucide-react';
import { LiveActivityItem } from '../../types';
import { INITIAL_LIVE_ACTIVITY } from '../../data/seedData';
import { getLanguageName } from '../../services/ai/languagePipeline';

const CHANNEL_ICON: Record<string, string> = {
  PWA: '📱',
  VOICE: '🎤',
  WHATSAPP: '💬',
  SMS_IVR: '📞',
  DIASPORA_PROXY: '✈️',
};

const CATEGORY_ICON: Record<string, string> = {
  ROADS_BRIDGES: '🛣️',
  WATER_SANITATION: '💧',
  ELECTRICITY_POWER: '⚡',
  HEALTHCARE: '🏥',
  EDUCATION: '🏫',
  DIGITAL_CONNECTIVITY: '📡',
  FLOOD_DISASTER: '🌊',
};

const URGENCY_COLOR: Record<string, string> = {
  CRITICAL: 'text-error bg-error-container/20 border-error/40',
  HIGH: 'text-primary-container bg-primary-container/20 border-primary-container/40',
  MEDIUM: 'text-secondary bg-secondary-container/20 border-secondary/40',
  LOW: 'text-tertiary bg-tertiary-container/20 border-tertiary-container/40',
};

function timeAgo(iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  return `${Math.floor(diffSec / 3600)}h ago`;
}

const MOCK_DISTRICTS = ['Bhopal', 'Nagpur', 'Jaipur', 'Patna', 'Lucknow', 'Chandigarh', 'Srinagar', 'Dehradun', 'Agartala', 'Panaji'];
const MOCK_STATES = ['MP', 'MH', 'RJ', 'BR', 'UP', 'PB', 'JK', 'UK', 'TR', 'GA'];
const CATEGORIES = ['ROADS_BRIDGES', 'WATER_SANITATION', 'ELECTRICITY_POWER', 'HEALTHCARE', 'EDUCATION', 'DIGITAL_CONNECTIVITY'] as const;
const CHANNELS = ['PWA', 'VOICE', 'WHATSAPP', 'SMS_IVR'] as const;
const URGENCIES = ['HIGH', 'MEDIUM', 'CRITICAL', 'LOW'] as const;
const LANGUAGES = ['hi', 'mr', 'ta', 'te', 'bn', 'ml', 'pa', 'as', 'hinglish'] as const;

let activityCounter = 100;

function generateRandomActivity(): LiveActivityItem {
  const idx = Math.floor(Math.random() * MOCK_DISTRICTS.length);
  activityCounter++;
  return {
    id: `ACT-${activityCounter}`,
    timestamp: new Date().toISOString(),
    channel: CHANNELS[Math.floor(Math.random() * CHANNELS.length)],
    language: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)] as any,
    district: MOCK_DISTRICTS[idx],
    state: MOCK_STATES[idx],
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    urgency: URGENCIES[Math.floor(Math.random() * URGENCIES.length)],
    piiScrubbed: true,
    anonymizedHash: Math.random().toString(36).substring(2, 10),
  };
}

interface LiveActivityFeedProps {
  maxItems?: number;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ maxItems = 10 }) => {
  const [items, setItems] = useState<LiveActivityItem[]>(INITIAL_LIVE_ACTIVITY);
  const [newArrivalId, setNewArrivalId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newItem = generateRandomActivity();
      setNewArrivalId(newItem.id);
      setItems((prev) => [newItem, ...prev.slice(0, maxItems - 1)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [maxItems]);

  return (
    <div className="bg-[#1B263B] border border-white/10 rounded-xl p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary-container animate-pulse" />
          <h4 className="font-bold text-sm font-headline-lg text-on-surface">
            Live Multilingual Citizen Ingestion Stream
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-mono">
          <span className="w-2 h-2 bg-tertiary-container rounded-full animate-ping" />
          <span>Real-time DPDP PII Scrubbing Active</span>
        </div>
      </div>

      <div ref={feedRef} className="space-y-2 max-h-80 overflow-y-auto terminal-scroll pr-1 text-xs">
        {items.map((item) => {
          const isNew = item.id === newArrivalId;
          const urgencyCls = URGENCY_COLOR[item.urgency] || URGENCY_COLOR.MEDIUM;
          const chIcon = CHANNEL_ICON[item.channel] || '📱';
          const catIcon = CATEGORY_ICON[item.category] || '🏛️';
          const langLabel = getLanguageName(item.language);

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                isNew
                  ? 'bg-surface-container-high border-primary-container ring-1 ring-primary-container animate-fade-in'
                  : 'bg-surface-container-low border-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base shrink-0">{chIcon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-on-surface">
                      {catIcon} {item.district}, {item.state}
                    </span>
                    <span className="text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-mono">
                      {langLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    Hash: #{item.anonymizedHash} · Channel: {item.channel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${urgencyCls}`}>
                  {item.urgency}
                </span>
                <span className="text-[10px] text-on-surface-variant/80 font-mono">
                  {timeAgo(item.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
