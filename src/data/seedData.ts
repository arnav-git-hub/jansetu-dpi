import {
  CitizenReport,
  DemandHotspot,
  SchemeInfo,
  CorruptionCase,
  ConstituencyCard,
  AuditLogEntry,
  LiveActivityItem,
  PrivacyStats
} from '../types';

export const INITIAL_SCHEMES: SchemeInfo[] = [
  {
    id: 'SCH-01',
    name: 'PM Gram Sadak Yojana (PMGSY III)',
    nameHindi: 'प्रधानमंत्री ग्राम सड़क योजना',
    category: 'ROADS_BRIDGES',
    ministry: 'Ministry of Rural Development',
    description: 'Provides all-weather road connectivity to eligible unconnected habitations in rural areas.',
    budgetAllocatedCrores: 19000,
    eligibilityCriteria: ['Rural habitation population > 250', 'Connects to nearest market hub or healthcare center']
  },
  {
    id: 'SCH-02',
    name: 'Jal Jeevan Mission (Har Ghar Jal)',
    nameHindi: 'जल जीवन मिशन',
    category: 'WATER_SANITATION',
    ministry: 'Ministry of Jal Shakti',
    description: 'Aims to provide Functional Tap Connections (FHTC) to every rural household.',
    budgetAllocatedCrores: 70000,
    eligibilityCriteria: ['Piped supply water quality testing', '55 liters per capita per day (lpcd)']
  },
  {
    id: 'SCH-03',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    nameHindi: 'आयुष्मान भारत',
    category: 'HEALTHCARE',
    ministry: 'Ministry of Health and Family Welfare',
    description: 'Health coverage of ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
    budgetAllocatedCrores: 7200,
    eligibilityCriteria: ['SECC 2011 vulnerable households', 'Rural primary health center deficit']
  },
  {
    id: 'SCH-04',
    name: 'Samagra Shiksha Abhiyan',
    nameHindi: 'समग्र शिक्षा अभियान',
    category: 'EDUCATION',
    ministry: 'Ministry of Education',
    description: 'Overarching programme for school education from pre-school to class 12 level focusing on digital classrooms and toilet facilities.',
    budgetAllocatedCrores: 37500,
    eligibilityCriteria: ['Government school infrastructure enhancement', 'Separate girls toilets and clean drinking water']
  },
  {
    id: 'SCH-05',
    name: 'BharatNet Phase III',
    nameHindi: 'भारतनेट चरण 3',
    category: 'DIGITAL_CONNECTIVITY',
    ministry: 'Ministry of Communications (DoT)',
    description: 'High-speed broadband optical fiber network connecting all 2.5 Lakh Gram Panchayats.',
    budgetAllocatedCrores: 139375,
    eligibilityCriteria: ['Gram Panchayat village center', 'Public Wi-Fi hotspot setup at CSC']
  }
];

export const SEEDED_REPORTS: CitizenReport[] = [
  {
    id: 'REP-101',
    trackingId: 'JS-2026-88101',
    timestamp: '2026-08-22T09:15:00Z',
    originalText: 'हमारे गाँव पीपरिया में पिछले ६ महीने से मुख्य संपर्क पुलिया टूट गई है। स्कूली बच्चे नाला तैरकर पार करते हैं, बहुत खतरा है।',
    language: 'hi',
    translatedText: 'In our village Pipariya, the main access culvert bridge broke 6 months ago. Schoolchildren cross the flooded stream by swimming, which is extremely dangerous.',
    piiScrubbed: true,
    scrubbedEntities: ['[PHONE_REDACTED]', '[NAME_REDACTED]'],
    cvAnalysis: {
      detectedObjects: ['Broken Concrete Culvert', 'Flooded Stream', 'Eroded Embankment'],
      severityRating: 9,
      hazardType: 'Structural Collapse Risk',
      confidence: 0.94,
      visualSummary: 'Severely damaged culvert with exposed rebar over 4m deep ravine.'
    },
    intent: {
      category: 'ROADS_BRIDGES',
      urgency: 'CRITICAL',
      sentiment: 'DESPERATE',
      estimatedAffectedPop: 4200
    },
    location: {
      lat: 22.7196,
      lng: 78.3512,
      address: 'Near Government Middle School, Village Pipariya',
      villageOrWard: 'Village Pipariya',
      district: 'Hoshangabad (Narmadapuram)',
      state: 'Madhya Pradesh'
    },
    channel: 'VOICE',
    status: 'CLUSTERED',
    hash: '8f9a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000'
  },
  {
    id: 'REP-102',
    trackingId: 'JS-2026-88102',
    timestamp: '2026-08-22T10:30:00Z',
    originalText: 'धारावी प्रभाग १४ में पीने के पानी की मुख्य पाइपलाइन फट गई है। गंदा नाले का पानी नलों में आ रहा है, हैजा फैलने का डर है।',
    language: 'mr',
    translatedText: 'Main drinking water pipeline burst in Dharavi Ward 14. Sewage water mixing in tap supply, cholera outbreak risk high.',
    piiScrubbed: true,
    scrubbedEntities: ['[AADHAAR_REDACTED]'],
    cvAnalysis: {
      detectedObjects: ['Burst Pipe Water Leak', 'Contaminated Puddle', 'High Density Housing'],
      severityRating: 8,
      hazardType: 'Waterborne Pathogen Outbreak',
      confidence: 0.91,
      visualSummary: 'Clean water pipeline compromised by adjacent open drain overflow.'
    },
    intent: {
      category: 'WATER_SANITATION',
      urgency: 'HIGH',
      sentiment: 'FRUSTRATED',
      estimatedAffectedPop: 18500
    },
    location: {
      lat: 19.0402,
      lng: 72.8509,
      address: '90 Feet Road, Ward 14 Dharavi',
      villageOrWard: 'Ward 14 - Dharavi',
      district: 'Mumbai Suburban',
      state: 'Maharashtra'
    },
    channel: 'WHATSAPP',
    status: 'CLUSTERED',
    hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    previousHash: '8f9a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
  },
  {
    id: 'REP-103',
    trackingId: 'JS-2026-88103',
    timestamp: '2026-08-22T11:05:00Z',
    originalText: 'വയനാട് മേപ്പാടി വില്ലേജിൽ പ്രാഥമിക ആരോഗ്യ കേന്ദ്രത്തിൽ ഓക്സിജൻ സിലിണ്ടറുകളും ആംബുലൻസും ഇല്ല. രോഗികൾ കിലോമീറ്ററുകൾ പോകേണ്ടി വരുന്നു.',
    language: 'ml',
    translatedText: 'In Wayanad Meppadi village Primary Health Center, there are no oxygen cylinders or emergency ambulance. Patients forced to travel 35 km.',
    piiScrubbed: true,
    scrubbedEntities: ['[PHONE_REDACTED]'],
    intent: {
      category: 'HEALTHCARE',
      urgency: 'HIGH',
      sentiment: 'DESPERATE',
      estimatedAffectedPop: 9800
    },
    location: {
      lat: 11.5511,
      lng: 76.1264,
      address: 'PHC Meppadi, Wayanad',
      villageOrWard: 'Meppadi Panchayat',
      district: 'Wayanad',
      state: 'Kerala'
    },
    channel: 'PWA',
    status: 'CLUSTERED',
    hash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    previousHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    id: 'REP-104',
    trackingId: 'JS-2026-88104',
    timestamp: '2026-08-22T11:45:00Z',
    originalText: 'Bro, Hamare area Khedgaon me High Voltage Transformer jal gaya hai. Last 4 days se zero electricity. Board exams ongoing!',
    language: 'hinglish',
    translatedText: 'In our area Khedgaon, the high voltage transformer burned out. Zero electricity for past 4 days. Board examinations ongoing!',
    piiScrubbed: true,
    scrubbedEntities: [],
    cvAnalysis: {
      detectedObjects: ['Burned Electrical Transformer', 'Blackened Cables'],
      severityRating: 7,
      hazardType: 'Grid Failure',
      confidence: 0.88,
      visualSummary: 'Substation pole transformer charred with severed drop wires.'
    },
    intent: {
      category: 'ELECTRICITY_POWER',
      urgency: 'HIGH',
      sentiment: 'FRUSTRATED',
      estimatedAffectedPop: 6500
    },
    location: {
      lat: 18.8415,
      lng: 73.9102,
      address: 'Khedgaon Main Bazar',
      villageOrWard: 'Khedgaon Village',
      district: 'Pune',
      state: 'Maharashtra'
    },
    channel: 'DIASPORA_PROXY',
    isProxyFiling: true,
    proxyMetadata: {
      migrantName: 'Ramesh Sonawane (Dubai GCC Worker)',
      currentCity: 'Dubai, UAE',
      microFundPledgeINR: 15000
    },
    status: 'CLUSTERED',
    hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    previousHash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d'
  }
];

export const SEEDED_HOTSPOTS: DemandHotspot[] = [
  {
    id: 'HOTSPOT-01',
    title: 'Pipariya Stream Culvert Reconstruction & All-Weather Connectivity',
    category: 'ROADS_BRIDGES',
    district: 'Hoshangabad (Narmadapuram)',
    state: 'Madhya Pradesh',
    villageOrWard: 'Village Pipariya',
    centerLat: 22.7196,
    centerLng: 78.3512,
    reportCount: 38,
    reports: [SEEDED_REPORTS[0]],
    totalAffectedPopulation: 8500,
    avgSeverityIndex: 9.2,
    infraDeficitGapScore: 8.5,
    equityWeightScore: 9.0,
    costEfficiencyRatio: 8.8,
    estimatedCostLakhs: 45,
    duplicateOrLowConfidenceDiscount: 0.02,
    priorityScore: 88.4,
    matchedScheme: {
      schemeName: 'PM Gram Sadak Yojana (PMGSY III)',
      ministry: 'Ministry of Rural Development',
      matchingConfidence: 0.96,
      fundingPoolAvailableINR: '₹12.4 Crores in District Rural Fund'
    },
    status: 'IDENTIFIED',
    costOfInactionAccruedPerDayINR: 14500,
    sdgGoals: ['SDG9_INDUSTRY_INNOVATION', 'SDG11_SUSTAINABLE_CITIES', 'SDG10_REDUCED_INEQUALITIES'],
    co2SavedTonsPerYear: 42,
    economicROIMultiplier: 4.8,
    trendingVelocity: 3.2
  },
  {
    id: 'HOTSPOT-02',
    title: 'Dharavi Ward 14 Water Mains Overhaul & Sewage Separation',
    category: 'WATER_SANITATION',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    villageOrWard: 'Ward 14 - Dharavi',
    centerLat: 19.0402,
    centerLng: 72.8509,
    reportCount: 142,
    reports: [SEEDED_REPORTS[1]],
    totalAffectedPopulation: 42000,
    avgSeverityIndex: 8.7,
    infraDeficitGapScore: 7.8,
    equityWeightScore: 8.5,
    costEfficiencyRatio: 9.4,
    estimatedCostLakhs: 120,
    duplicateOrLowConfidenceDiscount: 0.05,
    priorityScore: 86.9,
    matchedScheme: {
      schemeName: 'Jal Jeevan Mission (Urban Sanitation)',
      ministry: 'Ministry of Jal Shakti',
      matchingConfidence: 0.93,
      fundingPoolAvailableINR: '₹45.0 Crores in State Municipal Water Grant'
    },
    status: 'SHORTLISTED',
    costOfInactionAccruedPerDayINR: 48000,
    sdgGoals: ['SDG6_CLEAN_WATER', 'SDG3_GOOD_HEALTH', 'SDG11_SUSTAINABLE_CITIES'],
    co2SavedTonsPerYear: 18,
    economicROIMultiplier: 6.2,
    trendingVelocity: 8.7
  },
  {
    id: 'HOTSPOT-03',
    title: 'Meppadi High-Altitude PHC Emergency ICU & Ambulance Hub',
    category: 'HEALTHCARE',
    district: 'Wayanad',
    state: 'Kerala',
    villageOrWard: 'Meppadi Panchayat',
    centerLat: 11.5511,
    centerLng: 76.1264,
    reportCount: 29,
    reports: [SEEDED_REPORTS[2]],
    totalAffectedPopulation: 14200,
    avgSeverityIndex: 8.4,
    infraDeficitGapScore: 8.9,
    equityWeightScore: 8.8,
    costEfficiencyRatio: 8.2,
    estimatedCostLakhs: 65,
    duplicateOrLowConfidenceDiscount: 0.01,
    priorityScore: 84.1,
    matchedScheme: {
      schemeName: 'Ayushman Bharat Health Infrastructure Mission',
      ministry: 'Ministry of Health',
      matchingConfidence: 0.91,
      fundingPoolAvailableINR: '₹8.5 Crores NHM Allocation'
    },
    status: 'APPROVED_FUNDED',
    fundedAmountINR: 6500000,
    contractorName: 'Western Ghats BioMed Infra Ltd',
    expectedCompletionDate: '2026-11-30',
    costOfInactionAccruedPerDayINR: 22000,
    sdgGoals: ['SDG3_GOOD_HEALTH', 'SDG10_REDUCED_INEQUALITIES', 'SDG1_NO_POVERTY'],
    co2SavedTonsPerYear: 8,
    economicROIMultiplier: 7.5,
    trendingVelocity: 2.1
  },
  {
    id: 'HOTSPOT-04',
    title: 'Khedgaon Substation 250kVA Transformer Upgrade & Smart Metering',
    category: 'ELECTRICITY_POWER',
    district: 'Pune',
    state: 'Maharashtra',
    villageOrWard: 'Khedgaon Village',
    centerLat: 18.8415,
    centerLng: 73.9102,
    reportCount: 56,
    reports: [SEEDED_REPORTS[3]],
    totalAffectedPopulation: 11000,
    avgSeverityIndex: 7.5,
    infraDeficitGapScore: 6.2,
    equityWeightScore: 6.0,
    costEfficiencyRatio: 9.1,
    estimatedCostLakhs: 28,
    duplicateOrLowConfidenceDiscount: 0.03,
    priorityScore: 74.8,
    matchedScheme: {
      schemeName: 'RDSS (Revamped Distribution Sector Scheme)',
      ministry: 'Ministry of Power',
      matchingConfidence: 0.89,
      fundingPoolAvailableINR: '₹18.0 Crores MSEDCL Fund'
    },
    status: 'IDENTIFIED',
    costOfInactionAccruedPerDayINR: 12000,
    sdgGoals: ['SDG7_AFFORDABLE_ENERGY', 'SDG9_INDUSTRY_INNOVATION', 'SDG13_CLIMATE_ACTION'],
    co2SavedTonsPerYear: 95,
    economicROIMultiplier: 5.1,
    trendingVelocity: 4.4
  },
  {
    id: 'HOTSPOT-05',
    title: 'Kokrajhar Tribal Girls School Boundary Wall, Toilets & Digital Classroom',
    category: 'EDUCATION',
    district: 'Kokrajhar',
    state: 'Assam',
    villageOrWard: 'Majorgaon Panchayat',
    centerLat: 26.4033,
    centerLng: 90.2730,
    reportCount: 47,
    reports: [],
    totalAffectedPopulation: 6200,
    avgSeverityIndex: 7.8,
    infraDeficitGapScore: 9.1,
    equityWeightScore: 9.5,
    costEfficiencyRatio: 9.2,
    estimatedCostLakhs: 38,
    duplicateOrLowConfidenceDiscount: 0.01,
    priorityScore: 81.3,
    matchedScheme: {
      schemeName: 'Samagra Shiksha Abhiyan Phase III',
      ministry: 'Ministry of Education',
      matchingConfidence: 0.94,
      fundingPoolAvailableINR: '₹6.8 Crores Tribal Sub-Plan Fund'
    },
    status: 'SHORTLISTED',
    costOfInactionAccruedPerDayINR: 9800,
    sdgGoals: ['SDG4_QUALITY_EDUCATION', 'SDG10_REDUCED_INEQUALITIES', 'SDG5_GENDER_EQUALITY'],
    co2SavedTonsPerYear: 12,
    economicROIMultiplier: 9.3,
    trendingVelocity: 5.8
  },
  {
    id: 'HOTSPOT-06',
    title: 'Barmer Desert Gram Panchayat BharatNet Optical Fiber & CSC Hub',
    category: 'DIGITAL_CONNECTIVITY',
    district: 'Barmer',
    state: 'Rajasthan',
    villageOrWard: 'Dhorimanna Block',
    centerLat: 25.7450,
    centerLng: 71.3940,
    reportCount: 33,
    reports: [],
    totalAffectedPopulation: 18400,
    avgSeverityIndex: 6.8,
    infraDeficitGapScore: 9.3,
    equityWeightScore: 8.7,
    costEfficiencyRatio: 9.6,
    estimatedCostLakhs: 55,
    duplicateOrLowConfidenceDiscount: 0.02,
    priorityScore: 77.2,
    matchedScheme: {
      schemeName: 'BharatNet Phase III',
      ministry: 'Ministry of Communications (DoT)',
      matchingConfidence: 0.97,
      fundingPoolAvailableINR: '₹22.0 Crores Universal Service Obligation Fund'
    },
    status: 'IDENTIFIED',
    costOfInactionAccruedPerDayINR: 16500,
    sdgGoals: ['SDG9_INDUSTRY_INNOVATION', 'SDG17_PARTNERSHIPS', 'SDG10_REDUCED_INEQUALITIES'],
    co2SavedTonsPerYear: 28,
    economicROIMultiplier: 11.2,
    trendingVelocity: 6.1
  }
];

export const SEEDED_CORRUPTION_CASES: CorruptionCase[] = [
  {
    id: 'CORRUPT-01',
    projectId: 'PROJ-MUM-901',
    projectTitle: 'Kurla West Drainage Canal Desilting & Concrete Wall Reinforcement',
    location: 'Ward 16, Kurla West, Mumbai',
    contractorName: 'Apex Urban Infra & Civil Works Pvt Ltd',
    amountDisbursedLakhs: 85,
    claimedStatus: 'Work 100% Completed & Verified by Engineer',
    contractorPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    satellitePhotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    aiFraudProbabilityPercent: 94.2,
    detectedDiscrepancies: [
      'Contractor photo metadata shows 2022 timestamp (Reused Old Stock Image)',
      'High-resolution Sentinel-2 satellite thermal radar detects uncleared silt embankment',
      '87 citizen follow-up complaints report zero excavation machinery deployed on site'
    ],
    auditFlagStatus: 'FUNDS_FROZEN'
  },
  {
    id: 'CORRUPT-02',
    projectId: 'PROJ-MP-402',
    projectTitle: 'Chhindwara Rural Drinking Water Overhead Tank Construction',
    location: 'Chhindwara Block 4, MP',
    contractorName: 'Narmada Valley Builders',
    amountDisbursedLakhs: 110,
    claimedStatus: '90% Construction Complete',
    contractorPhotoUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
    satellitePhotoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    aiFraudProbabilityPercent: 88.7,
    detectedDiscrepancies: [
      'Satellite optical change analysis reveals bare forest canopy with no foundation shadow',
      'GPS coordinates of contractor submitted photo belong to a different district (Seoni)'
    ],
    auditFlagStatus: 'UNDER_INVESTIGATION'
  }
];

export const SEEDED_CONSTITUENCY_CARDS: ConstituencyCard[] = [
  {
    id: 'CONST-01',
    representativeName: 'Shri Arvind Rao',
    title: 'MP',
    constituencyName: 'Hoshangabad Lok Sabha',
    state: 'Madhya Pradesh',
    party: 'Lok Dal',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    totalRequestsReceived: 1240,
    totalRequestsResolved: 1090,
    avgTurnaroundDays: 14,
    responsivenessScorePercent: 92.5,
    fundsAllocatedLakhs: 1450,
    fundsUtilizedLakhs: 1380,
    citizenSatisfactionRating: 4.7,
    topCategoriesAddressed: ['ROADS_BRIDGES', 'WATER_SANITATION', 'EDUCATION']
  },
  {
    id: 'CONST-02',
    representativeName: 'Smt. Lakshmi Nair',
    title: 'MLA',
    constituencyName: 'Wayanad Assembly',
    state: 'Kerala',
    party: 'Janata Front',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    totalRequestsReceived: 890,
    totalRequestsResolved: 810,
    avgTurnaroundDays: 9,
    responsivenessScorePercent: 95.1,
    fundsAllocatedLakhs: 980,
    fundsUtilizedLakhs: 940,
    citizenSatisfactionRating: 4.8,
    topCategoriesAddressed: ['HEALTHCARE', 'ROADS_BRIDGES', 'DIGITAL_CONNECTIVITY']
  },
  {
    id: 'CONST-03',
    representativeName: 'Shri Vikram Kadam',
    title: 'WARD_COUNCILLOR',
    constituencyName: 'Ward 14 Dharavi, Mumbai',
    state: 'Maharashtra',
    party: 'Progressive Party',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    totalRequestsReceived: 2150,
    totalRequestsResolved: 1680,
    avgTurnaroundDays: 21,
    responsivenessScorePercent: 78.2,
    fundsAllocatedLakhs: 520,
    fundsUtilizedLakhs: 410,
    citizenSatisfactionRating: 3.9,
    topCategoriesAddressed: ['WATER_SANITATION', 'ELECTRICITY_POWER']
  }
];

export const INITIAL_LIVE_ACTIVITY: LiveActivityItem[] = [
  { id: 'ACT-001', timestamp: new Date(Date.now() - 120000).toISOString(), channel: 'VOICE', language: 'hi', district: 'Hoshangabad', state: 'MP', category: 'ROADS_BRIDGES', urgency: 'CRITICAL', piiScrubbed: true, hotspotId: 'HOTSPOT-01' },
  { id: 'ACT-002', timestamp: new Date(Date.now() - 240000).toISOString(), channel: 'WHATSAPP', language: 'mr', district: 'Mumbai Suburban', state: 'MH', category: 'WATER_SANITATION', urgency: 'HIGH', piiScrubbed: true, hotspotId: 'HOTSPOT-02' },
  { id: 'ACT-003', timestamp: new Date(Date.now() - 380000).toISOString(), channel: 'PWA', language: 'ml', district: 'Wayanad', state: 'KL', category: 'HEALTHCARE', urgency: 'HIGH', piiScrubbed: true, hotspotId: 'HOTSPOT-03' },
  { id: 'ACT-004', timestamp: new Date(Date.now() - 510000).toISOString(), channel: 'SMS_IVR', language: 'as', district: 'Kokrajhar', state: 'AS', category: 'EDUCATION', urgency: 'MEDIUM', piiScrubbed: true, hotspotId: 'HOTSPOT-05' },
  { id: 'ACT-005', timestamp: new Date(Date.now() - 680000).toISOString(), channel: 'DIASPORA_PROXY', language: 'hinglish', district: 'Pune', state: 'MH', category: 'ELECTRICITY_POWER', urgency: 'HIGH', piiScrubbed: true, hotspotId: 'HOTSPOT-04' },
  { id: 'ACT-006', timestamp: new Date(Date.now() - 820000).toISOString(), channel: 'VOICE', language: 'hi', district: 'Barmer', state: 'RJ', category: 'DIGITAL_CONNECTIVITY', urgency: 'LOW', piiScrubbed: true, hotspotId: 'HOTSPOT-06' },
  { id: 'ACT-007', timestamp: new Date(Date.now() - 960000).toISOString(), channel: 'WHATSAPP', language: 'bn', district: 'Howrah', state: 'WB', category: 'WATER_SANITATION', urgency: 'HIGH', piiScrubbed: true, hotspotId: 'HOTSPOT-02' },
  { id: 'ACT-008', timestamp: new Date(Date.now() - 1100000).toISOString(), channel: 'PWA', language: 'ta', district: 'Tirunelveli', state: 'TN', category: 'ROADS_BRIDGES', urgency: 'MEDIUM', piiScrubbed: true, hotspotId: 'HOTSPOT-01' },
];

export const PRIVACY_STATS: PrivacyStats = {
  totalReports: 345,
  piiScrubbedCount: 338,
  phoneRedactions: 214,
  aadhaarRedactions: 87,
  panRedactions: 12,
  nameRedactions: 156,
  onDeviceScrubRate: 97.9,
  consentGrantedPercent: 98.5,
  dataRetentionDays: 180,
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUDIT-001',
    timestamp: '2026-08-22T09:15:05Z',
    action: 'REQUEST_CREATED',
    entityId: 'REP-101',
    details: 'Citizen voice report received from Village Pipariya via Android PWA offline voice recorder',
    hash: '8f9a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    actor: 'Citizen (Anonymized Device ID: 9a7f-4421)'
  },
  {
    id: 'AUDIT-002',
    timestamp: '2026-08-22T09:15:06Z',
    action: 'PII_ANONYMIZED',
    entityId: 'REP-101',
    details: 'DPDP Act 2023 compliance engine removed 1 Phone number and 1 Aadhaar match on edge node',
    hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    prevHash: '8f9a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    actor: 'Edge DPDP Engine v2.4'
  },
  {
    id: 'AUDIT-003',
    timestamp: '2026-08-22T09:20:00Z',
    action: 'CLUSTERED',
    entityId: 'HOTSPOT-01',
    details: '38 reports in 2.5km radius fused into Demand Hotspot HOTSPOT-01 (Pipariya Bridge)',
    hash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    prevHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    actor: 'Spatial Fusion Engine (DBSCAN)'
  },
  {
    id: 'AUDIT-004',
    timestamp: '2026-08-22T10:00:00Z',
    action: 'PRIORITY_RECALCULATED',
    entityId: 'HOTSPOT-01',
    details: 'Priority Score calculated: 88.4 (w1=0.25, w2=0.25, w3=0.20, w4=0.15, w5=0.15, w6=0.10)',
    hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    prevHash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    actor: 'Scoring Engine Kernel'
  },
  {
    id: 'AUDIT-005',
    timestamp: '2026-08-22T11:15:00Z',
    action: 'PROJECT_FUNDED',
    entityId: 'HOTSPOT-03',
    details: 'Ayushman Bharat allocation of ₹65 Lakhs approved for Meppadi PHC. Contract awarded to Western Ghats BioMed Infra Ltd.',
    hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    prevHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    actor: 'District Collector, Wayanad'
  },
  {
    id: 'AUDIT-006',
    timestamp: '2026-08-22T12:30:00Z',
    action: 'CORRUPTION_FLAGGED',
    entityId: 'CORRUPT-01',
    details: 'AI Corruption X-Ray flagged PROJ-MUM-901 (Apex Urban Infra): 94.2% fraud probability. Satellite timestamp mismatch. Funds frozen pending investigation.',
    hash: '9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
    prevHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    actor: 'JanSetu Corruption X-Ray Engine v1.4'
  },
  {
    id: 'AUDIT-007',
    timestamp: '2026-08-22T14:00:00Z',
    action: 'CLUSTERED',
    entityId: 'HOTSPOT-05',
    details: '47 tribal citizen reports from Kokrajhar Assam fused into Education hotspot HOTSPOT-05. Equity Weight Score: 9.5/10.',
    hash: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    prevHash: '9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
    actor: 'Spatial Fusion Engine (DBSCAN)'
  },
  {
    id: 'AUDIT-008',
    timestamp: '2026-08-22T15:45:00Z',
    action: 'SATISFACTION_RECORDED',
    entityId: 'CONST-02',
    details: 'Citizen satisfaction rating updated for MLA Lakshmi Nair (Wayanad): New weighted average 4.8/5.0 from 890 ratings.',
    hash: 'd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
    prevHash: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    actor: 'Citizen Feedback Aggregator'
  }
];
