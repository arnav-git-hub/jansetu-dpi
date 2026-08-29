import React, { useState } from 'react';
import { X, Send, CheckCheck, MessageSquare } from 'lucide-react';

interface WhatsAppSimulatorModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSimulateWebhook?: (rawMessage: string, channel: 'WHATSAPP' | 'SMS_IVR') => void;
  onSimulateReport?: (rawMessage: string) => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen = true,
  onClose,
  onSimulateWebhook,
  onSimulateReport
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to JanSetu WhatsApp Bot. Please send your civic grievance or voice note in any Indian language.',
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
    if (onSimulateReport) {
      onSimulateReport(inputText);
    } else if (onSimulateWebhook) {
      onSimulateWebhook(inputText, 'WHATSAPP');
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '✓ JanSetu Webhook Triggered!\nYour voice/text report was anonymized under DPDP Act 2023 and fused into Live Demand Hotspots. Thank you for building your community!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);

    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* WhatsApp Header */}
        <div className="bg-[#005c4b] px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              JS
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight font-headline-lg">JanSetu Official (+91 8000-JANSETU)</h3>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                Govt Verified DPI Bot
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-emerald-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 bg-[#0b141a] p-4 overflow-y-auto terminal-scroll space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-2.5 shadow text-white leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#005c4b] rounded-tr-none'
                    : 'bg-[#202c33] rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-[#202c33] p-3 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type message in Hindi, Tamil, Telugu..."
            className="flex-1 bg-[#2a3942] border-none text-white text-xs rounded-lg px-3 py-2 focus:outline-none placeholder-slate-400"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
