import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Check, 
  Sparkles, 
  HelpCircle,
  Volume2,
  PhoneCall,
  MessageSquare,
  Plane,
  Vote,
  Camera,
  Mic,
  FileText
} from 'lucide-react';
import { LanguageCode, CitizenReport, DemandHotspot } from '../../types';
import { processCitizenInput } from '../../services/ai/languagePipeline';
import { AudioRecorder } from './AudioRecorder';
import { PhotoUploader } from './PhotoUploader';
import { CVAnalysisResult } from '../../services/ai/computerVision';
import { WhatsAppSimulatorModal } from './WhatsAppSimulatorModal';
import { SMSIVRSimulatorModal } from './SMSIVRSimulatorModal';
import { DiasporaProxyForm } from './DiasporaProxyForm';
import { MicroBudgetingModal } from './MicroBudgetingModal';

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
  const [activeInputMode, setActiveInputMode] = useState<'SPEAK' | 'TYPE' | 'PHOTO' | 'WHATSAPP' | 'IVR'>('TYPE');
  const [selectedCategory, setSelectedCategory] = useState<string>('Roads');
  const [urgencyLevel, setUrgencyLevel] = useState<number>(2); // 1 = Low, 2 = Medium, 3 = High
  const [inputText, setInputText] = useState('');
  const [locationText, setLocationText] = useState('Village Pipariya, Hoshangabad (Narmadapuram), MP');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [cvResult, setCvResult] = useState<CVAnalysisResult | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  // Modals
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showSMSIVR, setShowSMSIVR] = useState(false);
  const [showDiaspora, setShowDiaspora] = useState(false);
  const [showMicroBudget, setShowMicroBudget] = useState(false);

  const categories = ['Roads', 'Water', 'Power', 'Health', 'Schools', 'Sanitation', 'Disaster Relief'];

  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationText(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Auto-detected GPS)`);
          setIsDetectingLocation(false);
        },
        () => {
          setLocationText('Ward 12, Narmadapuram, Madhya Pradesh');
          setIsDetectingLocation(false);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setLocationText('Varanasi East Ward 4, Uttar Pradesh');
        setIsDetectingLocation(false);
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !cvResult) return;

    // Process via Language Intelligence & DPDP scrubber
    const processed = processCitizenInput(
      inputText || cvResult?.visualSummary || `${selectedCategory} issue reported`,
      selectedLang
    );

    const reportId = `REP-${Math.floor(100 + Math.random() * 900)}`;
    const trackingId = `JS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const urgencyMap: Record<number, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = {
      1: 'LOW',
      2: 'MEDIUM',
      3: 'CRITICAL'
    };

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
        category: (selectedCategory.toUpperCase() as any) || processed.intent.category,
        urgency: urgencyMap[urgencyLevel] || processed.intent.urgency,
        sentiment: processed.intent.sentiment,
        estimatedAffectedPop: processed.intent.estimatedAffectedPop
      },
      location: {
        lat: 22.7196 + (Math.random() - 0.5) * 0.05,
        lng: 78.3512 + (Math.random() - 0.5) * 0.05,
        address: locationText,
        villageOrWard: locationText.split(',')[0] || 'Village Pipariya',
        district: 'Narmadapuram',
        state: 'Madhya Pradesh'
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
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header & Title Section matching Stitch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-primary-container">
            Tell us what your community needs.
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Voice, text, photo, or messaging — automatically encrypted and clustered into National Civic Priorities.
          </p>
        </div>

        {/* Quick Tools & Modals */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowDiaspora(true)}
            className="px-3.5 py-1.5 bg-surface-container-high hover:bg-surface-bright rounded-lg border border-white/10 text-on-surface text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plane className="w-3.5 h-3.5 text-primary" />
            Diaspora Family Proxy
          </button>
          <button
            onClick={() => setShowMicroBudget(true)}
            className="px-3.5 py-1.5 bg-surface-container-high hover:bg-surface-bright rounded-lg border border-white/10 text-on-surface text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Vote className="w-3.5 h-3.5 text-secondary" />
            Micro-Budgeting Vote
          </button>
        </div>
      </div>

      {/* Input Channel Grid (5 Buttons matching Stitch) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
        {/* Speak */}
        <button
          onClick={() => setActiveInputMode('SPEAK')}
          className={`flex flex-col items-center justify-center p-6 bg-[#1B263B] rounded-xl border-l-2 ${
            activeInputMode === 'SPEAK' ? 'border-primary-container bg-surface-container-high ring-1 ring-primary-container' : 'border-secondary'
          } shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-surface-bright/30 transition-all duration-200 gap-2 group`}
        >
          <span className="material-symbols-outlined text-4xl text-primary-container group-hover:scale-110 transition-transform">
            mic
          </span>
          <span className="font-title-md text-base md:text-lg text-on-surface font-semibold">Speak</span>
          <span className="text-[11px] text-on-surface-variant">Bhashini AI Speech</span>
        </button>

        {/* Type */}
        <button
          onClick={() => setActiveInputMode('TYPE')}
          className={`flex flex-col items-center justify-center p-6 bg-[#1B263B] rounded-xl border-l-2 ${
            activeInputMode === 'TYPE' ? 'border-primary-container bg-surface-container-high ring-1 ring-primary-container' : 'border-secondary'
          } shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-surface-bright/30 transition-all duration-200 gap-2 group`}
        >
          <span className="material-symbols-outlined text-4xl text-primary-container group-hover:scale-110 transition-transform">
            keyboard
          </span>
          <span className="font-title-md text-base md:text-lg text-on-surface font-semibold">Type</span>
          <span className="text-[11px] text-on-surface-variant">Any Indian script</span>
        </button>

        {/* Photo */}
        <button
          onClick={() => setActiveInputMode('PHOTO')}
          className={`flex flex-col items-center justify-center p-6 bg-[#1B263B] rounded-xl border-l-2 ${
            activeInputMode === 'PHOTO' ? 'border-primary-container bg-surface-container-high ring-1 ring-primary-container' : 'border-secondary'
          } shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-surface-bright/30 transition-all duration-200 gap-2 group`}
        >
          <span className="material-symbols-outlined text-4xl text-primary-container group-hover:scale-110 transition-transform">
            photo_camera
          </span>
          <span className="font-title-md text-base md:text-lg text-on-surface font-semibold">Photo</span>
          <span className="text-[11px] text-on-surface-variant">Vision Damage AI</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => {
            setActiveInputMode('WHATSAPP');
            setShowWhatsApp(true);
          }}
          className="flex flex-col items-center justify-center p-6 bg-[#1B263B] rounded-xl border-l-2 border-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-surface-bright/30 transition-all duration-200 gap-2 group"
        >
          <span className="material-symbols-outlined text-4xl text-tertiary group-hover:scale-110 transition-transform">
            forum
          </span>
          <span className="font-title-md text-base md:text-lg text-on-surface font-semibold">WhatsApp</span>
          <span className="text-[11px] text-on-surface-variant">Zero-app chatbot</span>
        </button>

        {/* Call IVR */}
        <button
          onClick={() => {
            setActiveInputMode('IVR');
            setShowSMSIVR(true);
          }}
          className="flex flex-col items-center justify-center p-6 bg-[#1B263B] rounded-xl border-l-2 border-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-surface-bright/30 transition-all duration-200 gap-2 group col-span-2 md:col-span-1"
        >
          <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">
            call
          </span>
          <span className="font-title-md text-base md:text-lg text-on-surface font-semibold">Call IVR</span>
          <span className="text-[11px] text-on-surface-variant">1800 Toll-Free Voice</span>
        </button>
      </div>

      {/* Embedded Audio or Photo capture panels when selected */}
      {activeInputMode === 'SPEAK' && (
        <div className="bg-[#1B263B] p-6 rounded-xl border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
          <AudioRecorder
            selectedLang={selectedLang}
            onTranscriptionComplete={(text) => {
              setInputText(text);
              setActiveInputMode('TYPE');
            }}
          />
        </div>
      )}

      {activeInputMode === 'PHOTO' && (
        <div className="bg-[#1B263B] p-6 rounded-xl border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
          <PhotoUploader
            onAnalysisComplete={(res, url) => {
              setCvResult(res);
              setPhotoUrl(url);
              if (res.suggestedCategory) {
                const matched = categories.find(c => c.toLowerCase() === res.suggestedCategory.toLowerCase());
                if (matched) setSelectedCategory(matched);
              }
              if (res.visualSummary) {
                setInputText(res.visualSummary);
              }
            }}
          />
        </div>
      )}

      {/* Main Form Section matching Stitch layout */}
      <form onSubmit={handleSubmit} className="bg-[#1B263B] p-6 md:p-8 rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col gap-6">
        {/* Category Pills */}
        <div className="flex flex-col gap-2">
          <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            Infrastructure Category
          </label>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-container text-on-primary-container border-primary-container font-bold shadow-md'
                    : 'bg-surface-container border-outline/40 text-on-surface hover:bg-surface-bright'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Location Row with Auto-Detect */}
        <div className="flex flex-col gap-2 relative">
          <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
            Location / Village / Ward
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-xl">
              location_on
            </span>
            <input
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg pl-10 pr-20 py-3 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-shadow"
              placeholder="Enter village, panchayat, ward or pin code..."
            />
            <button
              type="button"
              onClick={handleAutoDetectLocation}
              disabled={isDetectingLocation}
              className="absolute right-3 text-secondary font-semibold text-xs uppercase tracking-wider hover:text-tertiary transition-colors bg-surface-container-high px-2.5 py-1 rounded"
            >
              {isDetectingLocation ? 'Detecting...' : 'Auto GPS'}
            </button>
          </div>
        </div>

        {/* Urgency Level Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Urgency Level
            </label>
            <span className="text-xs font-bold text-primary-container">
              {urgencyLevel === 1 ? 'Standard (Low)' : urgencyLevel === 2 ? 'High Need (Medium)' : 'Critical / Hazardous (High)'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={urgencyLevel}
            onChange={(e) => setUrgencyLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
          />
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Low</span>
            <span>Medium</span>
            <span className="text-error font-semibold">Critical Hazard</span>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Issue Description
            </label>
            <span className="text-[11px] text-tertiary flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> DPDP Edge PII Scrubbing Active
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg p-4 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-shadow resize-none"
            placeholder="Describe the issue in your local language (e.g. गाँव की मुख्य सड़क पिछले 2 महीनों से बारिश की वजह से टूट गई है)..."
          />
        </div>

        {/* Submit & Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveInputMode(activeInputMode === 'PHOTO' ? 'TYPE' : 'PHOTO')}
            className="flex items-center gap-2 px-5 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-on-surface text-sm font-medium hover:bg-surface-bright transition-colors w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            {photoUrl ? 'Photo Attached ✓' : 'Add Image'}
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() && !cvResult}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold text-base hover:opacity-90 transition-opacity w-full sm:w-1/2 disabled:opacity-50 shadow-lg"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            Submit Civic Request
          </button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 text-tertiary/90 text-xs border-t border-white/5 pt-3">
          <span className="material-symbols-outlined text-sm">shield</span>
          <span>Your personal identity and mobile number are stripped under India DPDP Act 2023. Only the civic need is prioritized.</span>
        </div>
      </form>

      {/* Recently Reported Nearby Banner matching Stitch */}
      <div className="bg-[#1B263B] p-4 rounded-xl border-l-4 border-tertiary-container shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
            Recently Reported Nearby · Live Verified
          </span>
          <span className="font-medium text-sm text-on-surface">
            {isSubmitted ? `Your report #${lastSubmittedId} has been added to the Live Ledger!` : 'Pothole cluster fixed on Narmadapuram State Highway 22'}
          </span>
        </div>
        <span className="material-symbols-outlined text-tertiary-container bg-tertiary-container/20 rounded-full p-2 text-xl">
          check_circle
        </span>
      </div>

      {/* Simulator Modals */}
      {showWhatsApp && (
        <WhatsAppSimulatorModal
          onClose={() => setShowWhatsApp(false)}
          onSimulateReport={(msg) => handleSimulateChannelWebhook(msg, 'WHATSAPP')}
        />
      )}

      {showSMSIVR && (
        <SMSIVRSimulatorModal
          onClose={() => setShowSMSIVR(false)}
          onSimulateReport={(msg) => handleSimulateChannelWebhook(msg, 'SMS_IVR')}
        />
      )}

      {showDiaspora && (
        <DiasporaProxyForm
          onClose={() => setShowDiaspora(false)}
          onSubmitProxyReport={(rep) => onSubmitNewReport(rep)}
        />
      )}

      {showMicroBudget && (
        <MicroBudgetingModal
          hotspots={hotspots}
          onClose={() => setShowMicroBudget(false)}
        />
      )}
    </div>
  );
};
