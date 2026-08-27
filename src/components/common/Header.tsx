import React from 'react';
import { 
  ShieldCheck, 
  Map, 
  UserCheck, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  Globe, 
  FileText, 
  Award, 
  SearchCheck,
  Building2,
  Users
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { getLanguageName } from '../../services/ai/languagePipeline';

interface HeaderProps {
  activeTab: 'CITIZEN' | 'POLICYMAKER' | 'PUBLIC_PORTAL' | 'REPORT_CARDS' | 'AUDIT_LEDGER';
  setActiveTab: (tab: 'CITIZEN' | 'POLICYMAKER' | 'PUBLIC_PORTAL' | 'REPORT_CARDS' | 'AUDIT_LEDGER') => void;
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
  const languages: LanguageCode[] = ['hi', 'mr', 'ta', 'te', 'bn', 'kn', 'gu', 'ml', 'pa', 'or', 'as', 'en', 'hinglish'];

  return (
    <header className="bg-gov-slate/95 backdrop-blur border-b border-slate-700/80 sticky top-0 z-40 text-white shadow-xl">
      {/* Top Banner for DPI & DPDP Compliance */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDP Act 2023 Compliant
          </span>
          <span className="hidden md:inline-block text-slate-500">•</span>
          <span className="hidden md:inline-block text-slate-400 whitespace-nowrap">
            UNDP DPG #IND-2026-JS
          </span>
          <span className="hidden lg:inline-block text-slate-500">•</span>
          <span className="hidden lg:flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
            🏆 Track 1: AI for Digital Public Infrastructure
          </span>
          <span className="hidden lg:inline-block text-slate-500">•</span>
          <span className="hidden lg:flex items-center gap-1 text-purple-300 whitespace-nowrap">
            🌍 SDG-Aligned · CC BY 4.0
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setIsDisasterMode(!isDisasterMode)}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              isDisasterMode
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            {isDisasterMode ? 'DISASTER MODE ACTIVE' : 'Disaster Triage'}
          </button>
          
          <div className="flex items-center gap-1">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400 text-xs">
                <Wifi className="w-3.5 h-3.5" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <WifiOff className="w-3.5 h-3.5" /> Offline ({offlineQueueCount} queued)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('CITIZEN')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-emerald-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  JanSetu <span className="text-amber-400 text-base font-normal">(जनसेतु)</span>
                </h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  MVP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">"Aapki awaaz, desh ki priority."</p>
            </div>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('CITIZEN')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap ${
              activeTab === 'CITIZEN'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Citizen PWA
          </button>
          <button
            onClick={() => setActiveTab('POLICYMAKER')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap ${
              activeTab === 'POLICYMAKER'
                ? 'bg-gov-accent text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            Policymaker
          </button>
          <button
            onClick={() => setActiveTab('PUBLIC_PORTAL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap ${
              activeTab === 'PUBLIC_PORTAL'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Public Data
          </button>
          <button
            onClick={() => setActiveTab('REPORT_CARDS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap ${
              activeTab === 'REPORT_CARDS'
                ? 'bg-purple-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Scorecards
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LEDGER')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap ${
              activeTab === 'AUDIT_LEDGER'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SearchCheck className="w-4 h-4" />
            Audit Ledger
          </button>
          <button
            onClick={() => setActiveTab('PRIVACY_DASHBOARD' as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap ${
              activeTab === ('PRIVACY_DASHBOARD' as any)
                ? 'bg-purple-600 text-white font-bold shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy
          </button>
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
          >
            {languages.map((code) => (
              <option key={code} value={code}>
                {getLanguageName(code)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
