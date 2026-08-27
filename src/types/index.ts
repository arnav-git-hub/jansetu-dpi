export type LanguageCode = 
  | 'hi' // Hindi
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'kn' // Kannada
  | 'gu' // Gujarati
  | 'ml' // Malayalam
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'as' // Assamese
  | 'en' // English
  | 'hinglish'; // Hinglish

export type CategoryType =
  | 'ROADS_BRIDGES'
  | 'WATER_SANITATION'
  | 'ELECTRICITY_POWER'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'DIGITAL_CONNECTIVITY'
  | 'FLOOD_DISASTER';

export type SDGGoal =
  | 'SDG1_NO_POVERTY'
  | 'SDG3_GOOD_HEALTH'
  | 'SDG4_QUALITY_EDUCATION'
  | 'SDG5_GENDER_EQUALITY'
  | 'SDG6_CLEAN_WATER'
  | 'SDG7_AFFORDABLE_ENERGY'
  | 'SDG9_INDUSTRY_INNOVATION'
  | 'SDG10_REDUCED_INEQUALITIES'
  | 'SDG11_SUSTAINABLE_CITIES'
  | 'SDG13_CLIMATE_ACTION'
  | 'SDG16_PEACE_JUSTICE'
  | 'SDG17_PARTNERSHIPS';

export interface CitizenReport {
  id: string;
  trackingId: string;
  timestamp: string;
  originalText: string;
  language: LanguageCode;
  translatedText: string;
  audioUrl?: string;
  photoUrl?: string;
  cvAnalysis?: {
    detectedObjects: string[];
    severityRating: number; // 1 to 10
    hazardType: string;
    confidence: number;
    visualSummary: string;
  };
  piiScrubbed: boolean;
  scrubbedEntities: string[];
  intent: {
    category: CategoryType;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    sentiment: 'NEUTRAL' | 'FRUSTRATED' | 'DESPERATE' | 'HOPEFUL';
    estimatedAffectedPop: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    villageOrWard: string;
    district: string;
    state: string;
  };
  channel: 'PWA' | 'VOICE' | 'WHATSAPP' | 'SMS_IVR' | 'DIASPORA_PROXY';
  isProxyFiling?: boolean;
  proxyMetadata?: {
    migrantName: string;
    currentCity: string;
    microFundPledgeINR?: number;
  };
  status: 'QUEUED_OFFLINE' | 'SUBMITTED' | 'CLUSTERED' | 'FUNDED' | 'IN_PROGRESS' | 'DELIVERED';
  hash: string;
  previousHash: string;
}

export interface DemandHotspot {
  id: string;
  title: string;
  category: CategoryType;
  district: string;
  state: string;
  villageOrWard: string;
  centerLat: number;
  centerLng: number;
  reportCount: number;
  reports: CitizenReport[];
  totalAffectedPopulation: number;
  avgSeverityIndex: number; // 1 to 10
  infraDeficitGapScore: number; // 1 to 10 (Higher means greater gap vs regional benchmark)
  equityWeightScore: number; // 1 to 10 (Higher for low HDI / marginalized regions)
  costEfficiencyRatio: number; // Estimated impact per ₹ Lakh
  estimatedCostLakhs: number;
  duplicateOrLowConfidenceDiscount: number; // 0 to 0.3
  priorityScore: number; // Calculated dynamic score
  matchedScheme?: {
    schemeName: string;
    ministry: string;
    matchingConfidence: number;
    fundingPoolAvailableINR: string;
  };
  status: 'IDENTIFIED' | 'SHORTLISTED' | 'APPROVED_FUNDED' | 'UNDER_CONSTRUCTION' | 'DELIVERED';
  fundedAmountINR?: number;
  contractorName?: string;
  expectedCompletionDate?: string;
  costOfInactionAccruedPerDayINR: number;
  sdgGoals?: SDGGoal[];
  co2SavedTonsPerYear?: number;
  economicROIMultiplier?: number; // ₹ returned per ₹ invested
  trendingVelocity?: number; // reports per hour in last 24h
}

export interface PriorityWeights {
  w1_population: number;      // Default 0.25
  w2_severity: number;        // Default 0.25
  w3_infraGap: number;        // Default 0.20
  w4_equityWeight: number;    // Default 0.15
  w5_costEfficiency: number;  // Default 0.15
  w6_duplicateDiscount: number; // Default 0.10
}

export interface SchemeInfo {
  id: string;
  name: string;
  nameHindi: string;
  category: CategoryType;
  ministry: string;
  description: string;
  budgetAllocatedCrores: number;
  eligibilityCriteria: string[];
}

export interface CorruptionCase {
  id: string;
  projectId: string;
  projectTitle: string;
  location: string;
  contractorName: string;
  amountDisbursedLakhs: number;
  claimedStatus: string;
  contractorPhotoUrl: string;
  satellitePhotoUrl: string;
  aiFraudProbabilityPercent: number;
  detectedDiscrepancies: string[];
  auditFlagStatus: 'UNDER_INVESTIGATION' | 'FUNDS_FROZEN' | 'VERIFIED_LEGAL';
}

export interface ConstituencyCard {
  id: string;
  representativeName: string;
  title: 'MP' | 'MLA' | 'WARD_COUNCILLOR';
  constituencyName: string;
  state: string;
  party: string;
  photoUrl: string;
  totalRequestsReceived: number;
  totalRequestsResolved: number;
  avgTurnaroundDays: number;
  responsivenessScorePercent: number;
  fundsAllocatedLakhs: number;
  fundsUtilizedLakhs: number;
  citizenSatisfactionRating: number; // 1.0 to 5.0
  topCategoriesAddressed: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'REQUEST_CREATED' | 'PII_ANONYMIZED' | 'CLUSTERED' | 'PRIORITY_RECALCULATED' | 'PROJECT_FUNDED' | 'SATISFACTION_RECORDED' | 'CORRUPTION_FLAGGED';
  entityId: string;
  details: string;
  hash: string;
  prevHash: string;
  actor: string;
}

export interface SteelmanDebateTurn {
  id: string;
  speaker: 'ADVOCATE' | 'SKEPTIC';
  agentName: string;
  text: string;
  citedMetrics: string[];
}

export interface LiveActivityItem {
  id: string;
  timestamp: string;
  channel: 'PWA' | 'VOICE' | 'WHATSAPP' | 'SMS_IVR' | 'DIASPORA_PROXY';
  language: LanguageCode;
  district: string;
  state: string;
  category: CategoryType;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  piiScrubbed: boolean;
  hotspotId: string;
}

export interface PrivacyStats {
  totalReports: number;
  piiScrubbedCount: number;
  phoneRedactions: number;
  aadhaarRedactions: number;
  panRedactions: number;
  nameRedactions: number;
  onDeviceScrubRate: number;
  consentGrantedPercent: number;
  dataRetentionDays: number;
}
