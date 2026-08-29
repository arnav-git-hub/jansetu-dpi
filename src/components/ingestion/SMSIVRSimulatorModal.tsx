import React, { useState } from 'react';
import { X, PhoneCall, Radio, Check, Volume2 } from 'lucide-react';

interface SMSIVRSimulatorModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSimulateWebhook?: (rawMessage: string, channel: 'SMS_IVR') => void;
  onSimulateReport?: (rawMessage: string) => void;
}

export const SMSIVRSimulatorModal: React.FC<SMSIVRSimulatorModalProps> = ({
  isOpen = true,
  onClose,
  onSimulateWebhook,
  onSimulateReport
}) => {
  const [ivrMessage, setIvrMessage] = useState('');
  const [ivrStatus, setIvrStatus] = useState<'IDLE' | 'DIALING' | 'RECORDING' | 'DONE'>('IDLE');

  if (!isOpen) return null;

  const startIVRCall = () => {
    setIvrStatus('DIALING');

    setTimeout(() => {
      setIvrStatus('RECORDING');
      setTimeout(() => {
        const text = 'IVR Feature Phone Voice Input: ग्राम खेडगांव में ट्रांसफार्मर जल जाने के कारण ४ दिन से बिजली बंद है। (Toll-Free 1800-JAN-SETU IVR Call recorded)';
        setIvrMessage(text);
        setIvrStatus('DONE');
        if (onSimulateReport) {
          onSimulateReport(text);
        } else if (onSimulateWebhook) {
          onSimulateWebhook(text, 'SMS_IVR');
        }
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 text-on-surface">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary-container animate-pulse" />
            <h3 className="font-bold text-base font-headline-lg text-on-surface">SMS / IVR Feature Phone Fallback</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          For non-smartphone citizens without internet access, JanSetu operates a zero-cost toll-free IVR line (1800-11-2026) and 2-way SMS shortcode system.
        </p>

        {ivrStatus === 'IDLE' && (
          <div className="p-6 bg-[#0D1B2A] rounded-xl border border-white/10 text-center">
            <button
              onClick={startIVRCall}
              className="w-16 h-16 rounded-full bg-tertiary-container hover:opacity-90 flex items-center justify-center mx-auto shadow-lg transition transform active:scale-95 text-on-tertiary-container"
            >
              <PhoneCall className="w-8 h-8" />
            </button>
            <p className="text-xs font-bold text-tertiary mt-3 font-headline-lg">Simulate Toll-Free IVR Call (1800-11-2026)</p>
            <p className="text-[11px] text-on-surface-variant mt-1">Simulates incoming IVR voice recording from Jio/Airtel/BSNL tower</p>
          </div>
        )}

        {ivrStatus === 'DIALING' && (
          <div className="p-6 bg-[#0D1B2A] rounded-xl border border-white/10 text-center animate-pulse">
            <PhoneCall className="w-10 h-10 text-primary-container mx-auto mb-2" />
            <p className="text-xs font-semibold text-primary-container">Connecting Toll-Free IVR Channel...</p>
            <p className="text-[11px] text-on-surface-variant">Playing language prompt: "Press 1 for Hindi, 2 for Marathi, 3 for Tamil..."</p>
          </div>
        )}

        {ivrStatus === 'RECORDING' && (
          <div className="p-6 bg-[#0D1B2A] rounded-xl border border-error/40 text-center">
            <Volume2 className="w-10 h-10 text-error mx-auto mb-2 animate-bounce" />
            <p className="text-xs font-bold text-error font-headline-lg">Recording Citizen Voice Message...</p>
            <p className="text-[11px] text-on-surface-variant">"बीप के बाद अपनी समस्या बोलें..."</p>
          </div>
        )}

        {ivrStatus === 'DONE' && (
          <div className="p-5 bg-surface-container-low border border-tertiary-container/40 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-tertiary font-bold text-xs font-headline-lg">
              <Check className="w-4 h-4" /> IVR Audio Transcribed & Ingested
            </div>
            <p className="text-xs bg-[#0D1B2A] p-3 rounded-lg text-on-surface border border-white/5 font-mono">
              "{ivrMessage}"
            </p>
            <p className="text-[11px] text-on-surface-variant">
              ✓ Automated Bhashini speech-to-text applied<br />
              ✓ Anonymized & fused into Civic Demand Cluster
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-primary-container text-on-primary-container font-bold rounded-lg text-xs hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
