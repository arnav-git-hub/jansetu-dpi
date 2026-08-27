import React, { useState } from 'react';
import { X, Send, CheckCheck, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';
import { CitizenReport } from '../../types';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateWebhook: (rawMessage: string, channel: 'WHATSAPP' | 'SMS_IVR') => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulateWebhook
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to JanSetu WhatsApp Bot. Please send your grievance or voice message in any Indian language.',
      time: '10:14 AM'
    }
  ]);
  const [inputText, setInputText] = useState('ग्राम पिपरिया में नाले का पुल बह गया है, बच्चे स्कूल नहीं जा पा रहे हैं। फोटो और लोकेशन संलग्न है।');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: inputText, time };
    
    setMessages((prev) => [...prev, userMsg]);
    onSimulateWebhook(inputText, 'WHATSAPP');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '✓ JanSetu Webhook Triggered!\nYour voice/text report was anonymized (DPDP 2023) and fused into Hotspot #HOTSPOT-01 (Pipariya Bridge). Priority score updated to 88.4/100.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);

    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* WhatsApp Header */}
        <div className="bg-emerald-700 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              JS
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">JanSetu Official (+91 8000-JANSETU)</h3>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                Govt Verified Business Bot
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-300">
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type WhatsApp message..."
            className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
