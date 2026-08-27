import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { DemandHotspot, SchemeInfo } from '../../types';
import { queryPolicymakerCopilot } from '../../services/ai/ragCopilot';

interface CopilotChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: DemandHotspot[];
  schemes: SchemeInfo[];
}

export const CopilotChatDrawer: React.FC<CopilotChatDrawerProps> = ({
  isOpen,
  onClose,
  hotspots,
  schemes
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Namaste Minister / Commissioner! I am your RAG-grounded Policymaker Copilot.\n\nAsk me about: **hotspot priorities, water/roads/health/education/digital**, **SDG alignment**, **economic ROI**, **corruption cases**, **scheme budgets**, or **disaster triage**.'
    }
  ]);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const sampleQueries = [
    'Show #1 prioritized hotspot',
    'Water sanitation + Jal Jeevan Mission',
    'What is the economic ROI across projects?',
    'SDG & climate co-benefits summary',
    'Which hotspots have highest equity weight?',
    'Corruption flagged cases status',
    'Total scheme budget pool available',
    'Disaster triage mode explained',
  ];

  const renderBotText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className={i > 0 ? 'mt-0.5' : ''}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="text-white">{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    });
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setIsTyping(true);

    const botResponse = queryPolicymakerCopilot(q, hotspots, schemes);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800 + Math.random() * 400);

    setQuery('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col text-white">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gov-accent/20 text-gov-accent flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">RAG Policymaker Copilot</h3>
            <p className="text-[10px] text-slate-400">Grounded on fused census & citizen dataset</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3 shadow leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gov-blue text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {m.sender === 'bot'
                ? <div className="space-y-0.5">{renderBotText(m.text)}</div>
                : <p>{m.text}</p>
              }
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 space-y-1.5">
        <span className="text-[10px] text-slate-400 font-semibold block">Quick Questions:</span>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              disabled={isTyping}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2.5 py-1 rounded-lg text-left transition disabled:opacity-40"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Policymaker Copilot..."
          className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-gov-accent"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 bg-gov-accent text-slate-950 rounded-xl hover:bg-sky-400 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
