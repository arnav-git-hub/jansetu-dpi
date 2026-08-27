import React, { useState } from 'react';
import { X, Plane, Heart, ShieldCheck, Check } from 'lucide-react';
import { CitizenReport } from '../../types';

interface DiasporaProxyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProxyReport: (report: Partial<CitizenReport>) => void;
}

export const DiasporaProxyForm: React.FC<DiasporaProxyFormProps> = ({
  isOpen,
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

    onSubmitProxyReport({
      originalText: grievanceText,
      language: 'hinglish',
      translatedText: `[Migrant Proxy Filing]: ${grievanceText}`,
      isProxyFiling: true,
      proxyMetadata: {
        migrantName,
        currentCity,
        microFundPledgeINR: pledgeINR
      },
      channel: 'DIASPORA_PROXY',
      location: {
        lat: 18.8415,
        lng: 73.9102,
        address: homeVillage,
        villageOrWard: 'Khedgaon Village',
        district: 'Pune',
        state: 'Maharashtra'
      }
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-5 text-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Diaspora & Migrant Proxy Filing</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Empowers urban migrant workers and overseas diaspora to file infrastructure needs for their ancestral home village, track execution, and co-fund community milestones.
        </p>

        {isSubmitted ? (
          <div className="p-8 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-emerald-400">Proxy Report Filed & Milestone Pledged!</h4>
            <p className="text-xs text-slate-300">
              Track ID: <span className="font-mono text-amber-300 font-bold">JS-PROXY-2026-99</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={migrantName}
                  onChange={(e) => setMigrantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Current Work Location</label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Ancestral Home Village / Panchayat</label>
              <input
                type="text"
                value={homeVillage}
                onChange={(e) => setHomeVillage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Infrastructure Issue Details</label>
              <textarea
                rows={3}
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                  Optional Micro-Funding Pledge for Community Milestone
                </span>
                <span className="font-bold text-white text-sm">₹{pledgeINR.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={2500}
                value={pledgeINR}
                onChange={(e) => setPledgeINR(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Pledged micro-funds are held in a transparent escrow account and matched 4:1 by government scheme funds upon successful on-ground satellite audit verification.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg"
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
