import React, { useState } from 'react';
import { X, Swords, User, Bot, Play, Pause, Sparkles, CheckCircle2 } from 'lucide-react';
import { DemandHotspot, SteelmanDebateTurn } from '../../types';
import { generateSteelmanDebate } from '../../services/ai/steelmanDebate';

interface SteelmanDebateModalProps {
  hotspot: DemandHotspot | null;
  onClose: () => void;
}

export const SteelmanDebateModal: React.FC<SteelmanDebateModalProps> = ({ hotspot, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);

  if (!hotspot) return null;

  const debateTurns: SteelmanDebateTurn[] = generateSteelmanDebate(hotspot);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">AI Steelman Debate Mode</h3>
              <p className="text-[11px] text-slate-400">Adversarial dual-agent argument over trade-offs & fiscal feasibility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Context Summary */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Debating Project:</span>
            <h4 className="font-bold text-slate-100">{hotspot.title}</h4>
          </div>
          <button
            onClick={toggleAudio}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition text-xs"
          >
            {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlayingAudio ? 'Pause Voice Debate' : 'Listen Voice Audio'}
          </button>
        </div>

        {/* Debate Transcript Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {debateTurns.map((turn, idx) => {
            const isAdvocate = turn.speaker === 'ADVOCATE';
            return (
              <div
                key={turn.id}
                className={`p-4 rounded-2xl border transition shadow ${
                  isAdvocate
                    ? 'bg-emerald-950/40 border-emerald-800/80 mr-6'
                    : 'bg-amber-950/40 border-amber-800/80 ml-6'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold flex items-center gap-1.5 ${isAdvocate ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <Bot className="w-4 h-4" />
                    {turn.agentName}
                  </span>
                  <span className="text-[10px] text-slate-500">Turn {idx + 1} of 4</span>
                </div>

                <p className="text-slate-200 leading-relaxed text-xs">{turn.text}</p>

                <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Data Citations:</span>
                  {turn.citedMetrics.map((m, i) => (
                    <span key={i} className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 italic">"Policymakers get transparent adversarial evidence, not a single black-box AI opinion."</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium"
          >
            Close Debate
          </button>
        </div>
      </div>
    </div>
  );
};
