import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  PhoneCall, 
  Plane, 
  Vote, 
  MapPin, 
  Check, 
  AlertCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { LanguageCode, CitizenReport } from '../../types';
import { processCitizenInput } from '../../services/ai/languagePipeline';
import { AudioRecorder } from './AudioRecorder';
import { PhotoUploader } from './PhotoUploader';
import { CVAnalysisResult } from '../../services/ai/computerVision';
import { WhatsAppSimulatorModal } from './WhatsAppSimulatorModal';
import { SMSIVRSimulatorModal } from './SMSIVRSimulatorModal';
import { DiasporaProxyForm } from './DiasporaProxyForm';
import { MicroBudgetingModal } from './MicroBudgetingModal';
import { DemandHotspot } from '../../types';

interface CitizenPortalProps {
  selectedLang: LanguageCode;
  onSubmitNewReport: (report: CitizenReport) => void;
  hotspots: DemandHotspot[];
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  selectedLang,
  onSubmitNewReport,
  hotspots
}) => {
  const [inputText, setInputText] = useState('');
  const [cvResult, setCvResult] = useState<CVAnalysisResult | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [villageName, setVillageName] = useState('Village Pipariya');
  const [districtName, setDistrictName] = useState('Hoshangabad (Narmadapuram)');
  const [stateName, setStateName] = useState('Madhya Pradesh');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  // Modals
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showSMSIVR, setShowSMSIVR] = useState(false);
  const [showDiaspora, setShowDiaspora] = useState(false);
  const [showMicroBudget, setShowMicroBudget] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !cvResult) return;

    // Process via Language Intelligence & DPDP scrubber
    const processed = processCitizenInput(
      inputText || cvResult?.visualSummary || 'Broken Road Infrastructure',
      selectedLang
    );

    const reportId = `REP-${Math.floor(100 + Math.random() * 900)}`;
    const trackingId = `JS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport: CitizenReport = {
      id: reportId,
      trackingId,
      timestamp: new Date().toISOString(),
      originalText: inputText || processed.originalText,
      language: processed.detectedLanguage,
      translatedText: processed.translatedText,
      photoUrl: photoUrl || undefined,
      cvAnalysis: cvResult || undefined,
      piiScrubbed: processed.piiScrubbed,
      scrubbedEntities: processed.scrubbedEntities,
      intent: {
        category: cvResult?.suggestedCategory || processed.intent.category,
        urgency: cvResult && cvResult.severityRating > 8 ? 'CRITICAL' : processed.intent.urgency,
        sentiment: processed.intent.sentiment,
        estimatedAffectedPop: processed.intent.estimatedAffectedPop
      },
      location: {
        lat: 22.7196 + (Math.random() - 0.5) * 0.05,
        lng: 78.3512 + (Math.random() - 0.5) * 0.05,
        address: `${villageName}, ${districtName}, ${stateName}`,
        villageOrWard: villageName,
        district: districtName,
        state: stateName
      },
      channel: 'PWA',
      status: 'SUBMITTED',
      hash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
      previousHash: '00000000000000000000000000000000'
    };

    onSubmitNewReport(newReport);
    setLastSubmittedId(trackingId);
    setIsSubmitted(true);
    setInputText('');
    setCvResult(null);
    setPhotoUrl(null);
  };

  const handleSimulateChannelWebhook = (rawText: string, channel: 'WHATSAPP' | 'SMS_IVR') => {
    const processed = processCitizenInput(rawText, selectedLang);
    const newReport: CitizenReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      trackingId: `JS-${channel}-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      originalText: rawText,
      language: processed.detectedLanguage,
      translatedText: processed.translatedText,
      piiScrubbed: true,
      scrubbedEntities: ['[PHONE_REDACTED]'],
      intent: processed.intent,
      location: {
        lat: 19.0402,
        lng: 72.8509,
        address: 'Ward 14 Dharavi, Mumbai',
        villageOrWard: 'Ward 14 - Dharavi',
        district: 'Mumbai Suburban',
        state: 'Maharashtra'
      },
      channel,
      status: 'SUBMITTED',
      hash: Math.random().toString(36).substring(2),
      previousHash: '00000000000000000000000000000000'
    };
    onSubmitNewReport(newReport);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-gov-slate to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute right-0 top-0 opacity-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Multilingual Voice & Photo Ingestion
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Report Infrastructure & Development Needs
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Roads, clean water, electricity, healthcare, schools, or digital connectivity. Voice, text, or photo in your native Indian language — processed with DPDP Act 2023 edge privacy.
            </p>
          </div>

          {/* Alternate Ingestion Channels */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowWhatsApp(true)}
              className="bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Bot
            </button>
            <button
              onClick={() => setShowSMSIVR(true)}
              className="bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              SMS / IVR Call
            </button>
            <button
              onClick={() => setShowDiaspora(true)}
              className="bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <Plane className="w-3.5 h-3.5" />
              Migrant Proxy
            </button>
            <button
              onClick={() => setShowMicroBudget(true)}
              className="bg-cyan-600/90 hover:bg-cyan-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              <Vote className="w-3.5 h-3.5" />
              Micro-Vote
            </button>
          </div>
        </div>
      </div>

      {/* Submission Success Toast */}
      {isSubmitted && (
        <div className="bg-emerald-950/80 border border-emerald-700/80 p-4 rounded-2xl flex items-center justify-between text-white animate-fade-in shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-300">Request Successfully Registered!</h4>
              <p className="text-xs text-slate-300">
                Tracking ID: <span className="font-mono text-amber-300 font-bold">{lastSubmittedId}</span> • Anonymized & Fused into Demand Hotspot
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-900 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            Submit New Infrastructure Need
          </h3>
          <span className="text-xs text-slate-400">Step 1 of 2 • Instant Geo-Clustering</span>
        </div>

        {/* Location Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">State</label>
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">District</label>
            <input
              type="text"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Village / Ward</label>
            <input
              type="text"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Dual Input Options: Voice & Photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice Component */}
          <AudioRecorder
            selectedLang={selectedLang}
            onTranscriptComplete={(transcript) => setInputText(transcript)}
          />

          {/* Photo Component */}
          <PhotoUploader
            onCVComplete={(result, url) => {
              setCvResult(result);
              setPhotoUrl(url);
            }}
          />
        </div>

        {/* Manual Text Input Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Or Type Details in Your Native Language / Hinglish
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your development request here... (e.g., मुख्य सड़क खड्डों से भरी है, स्कूल बच्चों को परेशानी हो रही है)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>

        {/* DPDP Compliance Notice & Submit */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>DPDP 2023: Phone numbers & Aadhaar are automatically redacted on device before sync.</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Submit Infrastructure Request
          </button>
        </div>
      </form>

      {/* Simulator Modals */}
      <WhatsAppSimulatorModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        onSimulateWebhook={handleSimulateChannelWebhook}
      />
      <SMSIVRSimulatorModal
        isOpen={showSMSIVR}
        onClose={() => setShowSMSIVR(false)}
        onSimulateWebhook={handleSimulateChannelWebhook}
      />
      <DiasporaProxyForm
        isOpen={showDiaspora}
        onClose={() => setShowDiaspora(false)}
        onSubmitProxyReport={(report) => {
          onSubmitNewReport(report as CitizenReport);
        }}
      />
      <MicroBudgetingModal
        isOpen={showMicroBudget}
        onClose={() => setShowMicroBudget(false)}
        hotspots={hotspots}
      />
    </div>
  );
};
