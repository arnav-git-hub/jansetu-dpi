import { LanguageCode, CategoryType } from '../../types';
import { scrubPII } from './dpdpScrubber';

export interface ProcessedLanguageResult {
  detectedLanguage: LanguageCode;
  originalText: string;
  translatedText: string;
  piiScrubbed: boolean;
  scrubbedEntities: string[];
  intent: {
    category: CategoryType;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    sentiment: 'NEUTRAL' | 'FRUSTRATED' | 'DESPERATE' | 'HOPEFUL';
    estimatedAffectedPop: number;
  };
}

const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  hi: 'Hindi (हिंदी)',
  mr: 'Marathi (मराठी)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  bn: 'Bengali (বাংলা)',
  kn: 'Kannada (ಕನ್ನಡ)',
  gu: 'Gujarati (ગુજરાતી)',
  ml: 'Malayalam (മലയാളം)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  or: 'Odia (ଓଡ଼ିଆ)',
  as: 'Assamese (অসমীয়া)',
  en: 'English',
  hinglish: 'Hinglish (Code-Mixed)'
};

export function getLanguageName(code: LanguageCode): string {
  return LANGUAGE_NAMES[code] || code;
}

export function processCitizenInput(text: string, selectedLang: LanguageCode): ProcessedLanguageResult {
  // 1. Scrub PII (DPDP 2023 Compliance)
  const scrubResult = scrubPII(text);
  const cleanText = scrubResult.scrubbedText;

  // 2. Language Auto-Detection heuristic if set to auto/hi
  let detectedLanguage: LanguageCode = selectedLang;
  const lower = cleanText.toLowerCase();

  if (/[\u0900-\u097F]/.test(cleanText)) {
    if (lower.includes('पुला') || lower.includes('पाणी') || lower.includes('रस्ता') || lower.includes('प्रभाग')) {
      detectedLanguage = 'mr';
    } else {
      detectedLanguage = 'hi';
    }
  } else if (/[\u0D00-\u0D7F]/.test(cleanText)) {
    detectedLanguage = 'ml';
  } else if (/[\u0B80-\u0BFF]/.test(cleanText)) {
    detectedLanguage = 'ta';
  } else if (/[\u0C00-\u0C7F]/.test(cleanText)) {
    detectedLanguage = 'te';
  } else if (/[\u0980-\u09FF]/.test(cleanText)) {
    detectedLanguage = 'bn';
  } else if (lower.includes('bro') || lower.includes('area') || lower.includes('voltage') || lower.includes('urgent')) {
    detectedLanguage = 'hinglish';
  }

  // 3. Simulated Translation & Intent Analysis
  let category: CategoryType = 'ROADS_BRIDGES';
  let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
  let sentiment: 'NEUTRAL' | 'FRUSTRATED' | 'DESPERATE' | 'HOPEFUL' = 'FRUSTRATED';
  let translatedText = cleanText;
  let estimatedAffectedPop = 3500;

  if (lower.includes('पानी') || lower.includes('जल') || lower.includes('water') || lower.includes('pipe') || lower.includes('नाले') || lower.includes('പൈപ്പ്')) {
    category = 'WATER_SANITATION';
    urgency = 'HIGH';
    sentiment = 'FRUSTRATED';
    estimatedAffectedPop = 12500;
    if (detectedLanguage !== 'en') {
      translatedText = `[Translated from ${getLanguageName(detectedLanguage)}]: Drinking water pipeline leaking contaminated water near household line. Immediate repair needed.`;
    }
  } else if (lower.includes('hospital') || lower.includes('डॉक्टर') || lower.includes('health') || lower.includes('ambulance') || lower.includes('രോഗികൾ')) {
    category = 'HEALTHCARE';
    urgency = 'CRITICAL';
    sentiment = 'DESPERATE';
    estimatedAffectedPop = 9200;
    if (detectedLanguage !== 'en') {
      translatedText = `[Translated from ${getLanguageName(detectedLanguage)}]: Primary Health Center lacks basic medical supplies, oxygen cylinders, and emergency ambulance. Patients stranded.`;
    }
  } else if (lower.includes('बिजली') || lower.includes('light') || lower.includes('transformer') || lower.includes('voltage') || lower.includes('power')) {
    category = 'ELECTRICITY_POWER';
    urgency = 'HIGH';
    sentiment = 'FRUSTRATED';
    estimatedAffectedPop = 5800;
    if (detectedLanguage !== 'en') {
      translatedText = `[Translated from ${getLanguageName(detectedLanguage)}]: Local power transformer burned out causing total blackout for past several days.`;
    }
  } else if (lower.includes('school') || lower.includes('स्कूल') || lower.includes('toilet') || lower.includes('teacher') || lower.includes('विद्यार्थी')) {
    category = 'EDUCATION';
    urgency = 'MEDIUM';
    sentiment = 'HOPEFUL';
    estimatedAffectedPop = 2400;
    if (detectedLanguage !== 'en') {
      translatedText = `[Translated from ${getLanguageName(detectedLanguage)}]: Primary school boundary wall collapsed and lacks functional toilets for girl students.`;
    }
  } else if (lower.includes('internet') || lower.includes('tower') || lower.includes('range') || lower.includes('network') || lower.includes('csc')) {
    category = 'DIGITAL_CONNECTIVITY';
    urgency = 'LOW';
    sentiment = 'NEUTRAL';
    estimatedAffectedPop = 4100;
    if (detectedLanguage !== 'en') {
      translatedText = `[Translated from ${getLanguageName(detectedLanguage)}]: Panchayat office lacks high-speed optical fiber internet connection, blocking online pension distribution.`;
    }
  } else {
    // Default road/bridge
    category = 'ROADS_BRIDGES';
    urgency = lower.includes('danger') || lower.includes('टूट') || lower.includes('खतरा') ? 'CRITICAL' : 'HIGH';
    sentiment = urgency === 'CRITICAL' ? 'DESPERATE' : 'FRUSTRATED';
    estimatedAffectedPop = 6200;
    if (detectedLanguage !== 'en') {
      translatedText = `[Translated from ${getLanguageName(detectedLanguage)}]: Main village culvert access bridge broken causing severe commute hazard and isolation.`;
    }
  }

  return {
    detectedLanguage,
    originalText: text,
    translatedText,
    piiScrubbed: scrubResult.piiFound,
    scrubbedEntities: scrubResult.redactedEntities,
    intent: {
      category,
      urgency,
      sentiment,
      estimatedAffectedPop
    }
  };
}
