import React, { useState } from 'react';
import { X, PhoneCall, Radio, Check, Volume2 } from 'lucide-react';

interface SMSIVRSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateWebhook: (rawMessage: string, channel: 'SMS_IVR') => void;
}

export const SMSIVRSimulatorModal: React.FC<SMSIVRSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulateWebhook
}) => {
  const [callActive, setCallActive] = useState(false);
  const [ivrMessage, setIvrMessage] = useState('');
  const [ivrStatus, setIvrStatus] = useState<'IDLE' | 'DIALING' | 'RECORDING' | 'DONE'>('IDLE');

  if (!isOpen) return null;

  const startIVRCall = () => {
    setIvrStatus('DIALING');
    setCallActive(true);

    setTimeout(() => {
      setIvrStatus('RECORDING');
      setTimeout(() => {
        const text = 'IVR Feature Phone Voice Input: ग्राम खेडगांव में ट्रांसफार्मर जल जाने के कारण ४ दिन से बिजली बंद है। (Toll-Free 1800-JAN-SETU IVR Call recorded)';
        setIvrMessage(text);
        setIvrStatus('DONE');
        onSimulateWebhook(text, 'SMS_IVR');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 text-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-base">SMS / IVR Feature Phone Fallback</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          For non-smartphone citizens without internet access, JanSetu operates a zero-cost toll-free IVR line (1800-11-2026) and 2-way SMS shortcode system.
        </p>

        {ivrStatus === 'IDLE' && (
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <button
              onClick={startIVRCall}
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
            >
              <PhoneCall className="w-8 h-8 text-white" />
            </button>
            <p className="text-xs font-bold text-emerald-400 mt-3">Simulate Toll-Free IVR Call (1800-11-2026)</p>
            <p className="text-[11px] text-slate-400 mt-1">Simulates incoming IVR voice recording from Jio/Airtel/BSNL tower</p>
          </div>
        )}

        {ivrStatus === 'DIALING' && (
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center animate-pulse">
            <PhoneCall className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-amber-300">Connecting Toll-Free IVR Channel...</p>
            <p className="text-[11px] text-slate-400">Playing language prompt: "Press 1 for Hindi, 2 for Marathi, 3 for Tamil..."</p>
          </div>
        )}

        {ivrStatus === 'RECORDING' && (
          <div className="p-6 bg-slate-950 rounded-xl border border-amber-500/40 text-center">
            <Volume2 className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
            <p className="text-xs font-bold text-red-400">Recording Citizen Voice Message...</p>
            <p className="text-[11px] text-slate-400">"बीप के बाद अपनी समस्या बोलें..."</p>
          </div>
        )}

        {ivrStatus === 'DONE' && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              IVR Voice Call Converted to Data Schema
            </div>
            <p className="text-slate-200 italic font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              "{ivrMessage}"
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Channel: IVR Telecom Webhook</span>
              <span className="text-emerald-400">Fused into JanSetu Hotspot</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
