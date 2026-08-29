import React, { useState } from 'react';
import { X, Plane, Heart, ShieldCheck, Check } from 'lucide-react';
import { CitizenReport } from '../../types';

interface DiasporaProxyFormProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmitProxyReport: (report: any) => void;
}

export const DiasporaProxyForm: React.FC<DiasporaProxyFormProps> = ({
  isOpen = true,
  onClose,
  onSubmitProxyReport
}) => {
  const [migrantName, setMigrantName] = useState('Ramesh Sonawane');
  const [currentCity, setCurrentCity] = useState('Dubai, UAE (GCC Migrant)');
  const [homeVillage, setHomeVillage] = useState('Village Khedgaon, Pune, Maharashtra');
  const [grievanceText, setGrievanceText] = useState('High Voltage Electrical Transformer burned out in my home village Khedgaon. My family and school students have zero power for 4 days.');
  const [pledgeINR, setPledgeINR] = useState(15000);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reportId = `REP-${Math.floor(100 + Math.random() * 900)}`;
    const trackingId = `JS-DIASPORA-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport: CitizenReport = {
      id: reportId,
      trackingId,
      timestamp: new Date().toISOString(),
      originalText: grievanceText,
      language: 'hinglish',
      translatedText: `[Migrant Proxy Filing]: ${grievanceText}`,
      piiScrubbed: true,
      scrubbedEntities: ['[NAME_REDACTED]'],
      isProxyFiling: true,
      proxyMetadata: {
        migrantName,
        currentCity,
        microFundPledgeINR: pledgeINR
      },
      intent: {
        category: 'ELECTRICITY_POWER',
        urgency: 'HIGH',
        sentiment: 'CONCERNED',
        estimatedAffectedPop: 2500
      },
      channel: 'DIASPORA_PROXY',
      location: {
        lat: 18.8415,
        lng: 73.9102,
        address: homeVillage,
        villageOrWard: 'Khedgaon Village',
        district: 'Pune',
        state: 'Maharashtra'
      },
      status: 'SUBMITTED',
      hash: Math.random().toString(36).substring(2),
      previousHash: '00000000000000000000000000000000'
    };

    onSubmitProxyReport(newReport);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030e22]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#142034] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-5 text-on-surface">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary-container" />
            <h3 className="font-bold text-base font-headline-lg text-on-surface">Diaspora & Migrant Family Proxy Filing</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          Allows overseas or domestic urban migrant workers to submit civic infrastructure needs for their elderly parents and home villages, with optional micro-matching pledges.
        </p>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3 bg-surface-container-low rounded-xl border border-tertiary-container/40">
            <Check className="w-12 h-12 text-tertiary mx-auto bg-tertiary/20 p-2 rounded-full" />
            <h4 className="font-bold text-base text-on-surface font-headline-lg">Proxy Grievance Registered!</h4>
            <p className="text-xs text-on-surface-variant">
              Fused into Maharashtra regional demand cluster with matched ₹{pledgeINR.toLocaleString()} co-funding pledge.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-on-surface-variant font-mono uppercase block mb-1">Your Name & City</label>
                <input
                  type="text"
                  value={migrantName}
                  onChange={(e) => setMigrantName(e.target.value)}
                  className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg p-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant font-mono uppercase block mb-1">Current Work Location</label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg p-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-on-surface-variant font-mono uppercase block mb-1">Home Village / Panchayat</label>
              <input
                type="text"
                value={homeVillage}
                onChange={(e) => setHomeVillage(e.target.value)}
                className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg p-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-on-surface-variant font-mono uppercase block mb-1">Infrastructure Issue in Home Village</label>
              <textarea
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                rows={3}
                className="w-full bg-[#0D1B2A] border border-white/10 rounded-lg p-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container text-xs resize-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface font-medium flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-primary-container" /> Optional Community Co-Fund Pledge
                </span>
                <span className="font-bold text-primary-container font-mono">₹{pledgeINR.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={2500}
                value={pledgeINR}
                onChange={(e) => setPledgeINR(Number(e.target.value))}
                className="w-full accent-primary-container cursor-pointer h-1.5 bg-surface-container-highest rounded-lg"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-lg text-xs font-medium border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary-container hover:opacity-90 text-on-primary-container font-bold rounded-lg text-xs"
              >
                Submit Proxy Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
