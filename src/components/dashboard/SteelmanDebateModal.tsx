import React, { useState } from 'react';
import { X, Swords, Bot, Play, Pause } from 'lucide-react';
import { DemandHotspot, SteelmanDebateTurn } from '../../types';
import { generateSteelmanDebate } from '../../services/ai/steelmanDebate';

interface SteelmanDebateModalProps {
  hotspot: DemandHotspot | null;
  onClose: () => void;
}

export const SteelmanDebateModal: React.FC<SteelmanDebateModalProps> = ({ hotspot, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!hotspot) return null;

  const debateTurns: SteelmanDebateTurn[] = generateSteelmanDebate(hotspot);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 text-on-surface max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-primary-container" />
            <div>
              <h3 className="font-bold text-base font-headline-lg text-on-surface">AI Steelman Debate Mode</h3>
              <p className="text-[11px] text-on-surface-variant">Adversarial dual-agent argument over trade-offs & fiscal feasibility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Context Summary */}
        <div className="bg-[#0D1B2A] p-3 rounded-xl border border-white/10 mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-on-surface-variant">Debating Project:</span>
            <h4 className="font-bold text-on-surface font-headline-lg">{hotspot.title}</h4>
          </div>
          <button
            onClick={toggleAudio}
            className="px-3 py-1.5 bg-primary-container hover:opacity-90 text-on-primary-container font-bold rounded-lg flex items-center gap-1.5 transition text-xs"
          >
            {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlayingAudio ? 'Pause Audio Debate' : 'Listen Audio Debate'}
          </button>
        </div>

        {/* Debate Transcript Body */}
        <div className="flex-1 overflow-y-auto terminal-scroll space-y-4 pr-1 text-xs">
          {debateTurns.map((turn, idx) => {
            const isAdvocate = turn.speaker === 'ADVOCATE';
            return (
              <div
                key={turn.id}
                className={`p-4 rounded-xl border transition shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] ${
                  isAdvocate
                    ? 'bg-surface-container-low border-tertiary-container/60 mr-6 border-l-4 border-l-tertiary-container'
                    : 'bg-surface-container-low border-primary-container/60 ml-6 border-l-4 border-l-primary-container'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold flex items-center gap-1.5 font-headline-lg ${isAdvocate ? 'text-tertiary-container' : 'text-primary-container'}`}>
                    <Bot className="w-4 h-4" />
                    {turn.agentName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">Turn {idx + 1} of 4</span>
                </div>

                <p className="text-on-surface leading-relaxed text-xs">{turn.text}</p>

                <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-on-surface-variant font-semibold mr-1">Data Citations:</span>
                  {turn.citedMetrics.map((m, i) => (
                    <span key={i} className="bg-surface-container text-on-surface border border-white/10 text-[10px] px-2 py-0.5 rounded font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <span className="text-on-surface-variant italic">"Policymakers receive transparent adversarial evidence, not a black-box AI verdict."</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-lg font-medium border border-white/10"
          >
            Close Debate
          </button>
        </div>
      </div>
    </div>
  );
};
