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
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
  HIGH: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  MEDIUM: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
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
    hotspotId: `HOTSPOT-0${Math.ceil(Math.random() * 6)}`,
  };
}

interface LiveActivityFeedProps {
  maxItems?: number;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ maxItems = 10 }) => {
  const [items, setItems] = useState<LiveActivityItem[]>([...INITIAL_LIVE_ACTIVITY]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newItem = generateRandomActivity();
      setItems((prev) => [newItem, ...prev].slice(0, 50));
    }, 4500 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const displayed = items.slice(0, maxItems);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-sm">Live Citizen Report Feed</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Wifi className="w-3 h-3 text-sky-400" />
          <span>{items.length} reports in pipeline</span>
        </div>
      </div>

      {/* Feed items */}
      <div ref={containerRef} className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
        {displayed.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-2.5 text-xs transition-all ${
              idx === 0 ? 'bg-amber-500/5 border-l-2 border-amber-500' : 'hover:bg-slate-800/40'
            }`}
          >
            {/* Category icon */}
            <span className="text-base shrink-0">{CATEGORY_ICON[item.category]}</span>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-200 truncate">{item.category.replace('_', ' ')}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 truncate">📍 {item.district}, {item.state}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-slate-500">{CHANNEL_ICON[item.channel]} {item.channel.replace('_', ' ')}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">{getLanguageName(item.language as any).split(' ')[0]}</span>
                {item.piiScrubbed && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-emerald-500 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> PII Scrubbed
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Urgency + time */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${URGENCY_COLOR[item.urgency]}`}>
                {item.urgency}
              </span>
              <span className="text-[10px] text-slate-600 font-mono">{timeAgo(item.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
        <span>Auto-clustered via DBSCAN · Edge PII stripped</span>
        <span className="text-slate-600">Scroll for history ↑</span>
      </div>
    </div>
  );
};
