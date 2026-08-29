import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { DemandHotspot, SchemeInfo } from '../../types';
import { INITIAL_SCHEMES } from '../../data/seedData';
import { queryPolicymakerCopilot } from '../../services/ai/ragCopilot';

interface CopilotChatDrawerProps {
  isOpen?: boolean;
  onClose: () => void;
  hotspots: DemandHotspot[];
  schemes?: SchemeInfo[];
}

export const CopilotChatDrawer: React.FC<CopilotChatDrawerProps> = ({
  isOpen = true,
  onClose,
  hotspots,
  schemes = INITIAL_SCHEMES
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
              ? <strong key={j} className="text-on-surface">{part.slice(2, -2)}</strong>
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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#142034] border-l border-white/10 shadow-2xl flex flex-col text-on-surface">
      {/* Header */}
      <div className="bg-[#071327] px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight font-headline-lg text-on-surface">RAG Policymaker Copilot</h3>
            <p className="text-[10px] text-on-surface-variant font-mono">Grounded on fused census & citizen dataset</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto terminal-scroll space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3 shadow leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-primary-container text-on-primary-container font-medium rounded-tr-none'
                  : 'bg-[#0D1B2A] border border-white/10 text-on-surface rounded-tl-none'
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
            <div className="bg-[#0D1B2A] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-[#0D1B2A] border-t border-white/10 space-y-1.5">
        <span className="text-[10px] text-on-surface-variant font-semibold block uppercase font-mono">Quick Questions:</span>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto terminal-scroll">
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              disabled={isTyping}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface border border-white/5 text-[10px] px-2.5 py-1 rounded-lg text-left transition disabled:opacity-40"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-[#071327] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Policymaker Copilot..."
          className="flex-1 bg-[#0D1B2A] border border-white/10 text-on-surface text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 bg-primary-container text-on-primary-container rounded-lg hover:opacity-90 transition font-bold"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
