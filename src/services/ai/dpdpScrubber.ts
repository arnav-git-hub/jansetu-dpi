/**
 * DPDP Act 2023 Compliance & Data Minimization Service
 * Performs local edge redaction of personally identifiable information (PII)
 * before submitting citizen data upstream.
 */

export interface DPDPScrubResult {
  scrubbedText: string;
  piiFound: boolean;
  redactedEntities: string[];
  anonymizedDeviceId: string;
}

export function scrubPII(text: string): DPDPScrubResult {
  let scrubbed = text;
  const redactedEntities: string[] = [];
  let piiFound = false;

  // 1. Indian Phone Numbers (10 digits, +91, 0 prefix)
  const phoneRegex = /(\+91[\-\s]?)?[6-9]\d{9}/g;
  if (phoneRegex.test(scrubbed)) {
    piiFound = true;
    redactedEntities.push('[PHONE_REDACTED]');
    scrubbed = scrubbed.replace(phoneRegex, '[PHONE_REDACTED]');
  }

  // 2. Aadhaar Numbers (12 digits with or without space/dash)
  const aadhaarRegex = /\b[2-9]\d{3}[\s\-]?[0-9]{4}[\s\-]?[0-9]{4}\b/g;
  if (aadhaarRegex.test(scrubbed)) {
    piiFound = true;
    redactedEntities.push('[AADHAAR_REDACTED]');
    scrubbed = scrubbed.replace(aadhaarRegex, '[AADHAAR_REDACTED]');
  }

  // 3. Indian PAN Numbers
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;
  if (panRegex.test(scrubbed)) {
    piiFound = true;
    redactedEntities.push('[PAN_REDACTED]');
    scrubbed = scrubbed.replace(panRegex, '[PAN_REDACTED]');
  }

  // 4. Common Indian Name Honorifics
  const nameRegex = /\b(Shri|Smt|Mr|Mrs|Kumari|Dr)\.?\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g;
  if (nameRegex.test(scrubbed)) {
    piiFound = true;
    redactedEntities.push('[NAME_REDACTED]');
    scrubbed = scrubbed.replace(nameRegex, '[NAME_REDACTED]');
  }

  // Generate anonymous pseudorandom device hash
  const deviceId = 'ANON-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  return {
    scrubbedText: scrubbed,
    piiFound,
    redactedEntities,
    anonymizedDeviceId: deviceId
  };
}
