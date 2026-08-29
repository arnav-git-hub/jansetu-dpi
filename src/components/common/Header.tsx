import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  Globe, 
  Layers,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { getLanguageName } from '../../services/ai/languagePipeline';

interface HeaderProps {
  activeTab: 'CITIZEN' | 'POLICYMAKER' | 'PUBLIC_PORTAL' | 'REPORT_CARDS' | 'AUDIT_LEDGER' | 'PRIVACY_DASHBOARD';
  setActiveTab: (tab: 'CITIZEN' | 'POLICYMAKER' | 'PUBLIC_PORTAL' | 'REPORT_CARDS' | 'AUDIT_LEDGER' | 'PRIVACY_DASHBOARD') => void;
  selectedLang: LanguageCode;
  setSelectedLang: (lang: LanguageCode) => void;
  isOnline: boolean;
  offlineQueueCount: number;
  isDisasterMode: boolean;
  setIsDisasterMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedLang,
  setSelectedLang,
  isOnline,
  offlineQueueCount,
  isDisasterMode,
  setIsDisasterMode
}) => {
  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English (EN)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'hinglish', label: 'Hinglish (Colloquial)' }
  ];

  return (
    <header className="bg-surface-container border-b border-white/10 sticky top-0 z-50 text-on-surface shadow-2xl backdrop-blur-md">
      {/* Top Banner for DPI & DPDP Compliance */}
      <div className="bg-surface-container-lowest px-4 md:px-8 py-1.5 text-xs border-b border-white/5 flex items-center justify-between text-on-surface-variant">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="flex items-center gap-1.5 text-tertiary font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDP Act 2023 Compliant · Edge Privacy
          </span>
          <span className="hidden md:inline-block text-white/20">•</span>
          <span className="hidden md:inline-block text-on-surface/70 whitespace-nowrap">
            UNDP DPG #IND-2026-JS
          </span>
          <span className="hidden lg:inline-block text-white/20">•</span>
          <span className="hidden lg:flex items-center gap-1 bg-primary-container/10 text-primary-container border border-primary-container/30 px-2 py-0.5 rounded-full whitespace-nowrap font-medium text-[11px]">
            <Sparkles className="w-3 h-3" /> Digital Public Infrastructure
          </span>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          {/* Disaster Triage Toggle */}
          <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded-full border border-white/10">
            <span className={`text-[11px] uppercase tracking-wider font-bold ${isDisasterMode ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
              Disaster Triage
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDisasterMode}
                onChange={() => setIsDisasterMode(!isDisasterMode)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-surface-container-low peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-error-container peer-checked:after:bg-white"></div>
            </label>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs">
            {isOnline ? (
              <span className="flex items-center gap-1 text-tertiary">
                <Wifi className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-primary-container font-bold">
                <WifiOff className="w-3.5 h-3.5" /> Offline ({offlineQueueCount})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Stitch TopNavBar Web */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none shrink-0" 
          onClick={() => setActiveTab('CITIZEN')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container via-primary to-secondary p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-surface-container-lowest rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary-container" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-lg font-bold text-xl text-primary-container tracking-tight">
                JanSetu
              </span>
              <span className="text-sm font-normal text-on-surface-variant">(जनसेतु)</span>
              <span className="bg-secondary/15 text-secondary border border-secondary/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                DPI v1.0
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-mono">Aapki awaaz, desh ki priority</p>
          </div>
        </div>

        {/* Navigation Links matching Stitch Design */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
          <button
            onClick={() => setActiveTab('CITIZEN')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'CITIZEN'
                ? 'text-primary-container font-bold border-b-2 border-primary-container'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Citizen Portal
          </button>
          
          <button
            onClick={() => setActiveTab('POLICYMAKER')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'POLICYMAKER'
                ? 'text-primary-container font-bold border-b-2 border-primary-container'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Policymaker Dashboard
          </button>

          <button
            onClick={() => setActiveTab('PUBLIC_PORTAL')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'PUBLIC_PORTAL'
                ? 'text-primary-container font-bold border-b-2 border-primary-container'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Public Portal
          </button>

          <button
            onClick={() => setActiveTab('REPORT_CARDS')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'REPORT_CARDS'
                ? 'text-primary-container font-bold border-b-2 border-primary-container'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Report Cards
          </button>

          <button
            onClick={() => setActiveTab('AUDIT_LEDGER')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'AUDIT_LEDGER'
                ? 'text-primary-container font-bold border-b-2 border-primary-container'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Audit Ledger
          </button>

          <button
            onClick={() => setActiveTab('PRIVACY_DASHBOARD')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'PRIVACY_DASHBOARD'
                ? 'text-primary-container font-bold border-b-2 border-primary-container'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Privacy
          </button>
        </nav>

        {/* Language Switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-surface-container-high border border-white/10 rounded-lg px-2.5 py-1.5">
            <Globe className="w-4 h-4 text-primary-container shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
              className="bg-transparent text-on-surface text-xs focus:outline-none cursor-pointer pr-1"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-surface-container text-on-surface">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
