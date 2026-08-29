import React, { useState } from 'react';
import { Award, Star, TrendingUp, CheckCircle, Clock, ShieldCheck, ThumbsUp } from 'lucide-react';
import { SEEDED_CONSTITUENCY_CARDS } from '../../data/seedData';
import { ConstituencyCard } from '../../types';

export const ConstituencyReportCard: React.FC = () => {
  const [cards, setCards] = useState<ConstituencyCard[]>(SEEDED_CONSTITUENCY_CARDS);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  const handleRating = (id: string, stars: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newRating = Number(((c.citizenSatisfactionRating * 10 + stars) / 11).toFixed(1));
          return { ...c, citizenSatisfactionRating: newRating };
        }
        return c;
      })
    );
    setFeedbackGiven((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6 text-on-surface">
      {/* Hero Banner */}
      <div className="bg-[#1B263B] border border-white/10 rounded-xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-primary-container/20 text-primary-container border border-primary-container/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 font-mono">
            <Award className="w-3.5 h-3.5" />
            Public Government Responsiveness Index
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-headline-lg text-on-surface">
            Constituency Report Cards (MP / MLA / Ward Councillor)
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
            Transparent civic performance scorecards tracking verified requests resolved, fund utilization, turnaround days, and citizen satisfaction ratings.
          </p>
        </div>

        <div className="bg-surface-container-lowest px-5 py-3 rounded-xl border border-white/10 text-center shrink-0">
          <span className="text-[10px] text-on-surface-variant uppercase font-mono block">National Responsiveness Index</span>
          <span className="text-3xl font-black text-secondary font-headline-lg">88.6 %</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.id} className="bg-[#1B263B] border border-white/10 rounded-xl p-5 space-y-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col justify-between">
            <div>
              {/* Profile Header */}
              <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-3">
                <img
                  src={c.photoUrl}
                  alt={c.representativeName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-container shadow"
                />
                <div>
                  <span className="bg-primary-container/20 text-primary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                    {c.title}
                  </span>
                  <h3 className="font-bold text-base text-on-surface mt-1 leading-tight font-headline-lg">{c.representativeName}</h3>
                  <p className="text-xs text-on-surface-variant">{c.constituencyName}, {c.state}</p>
                </div>
              </div>

              {/* Core Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-3 bg-surface-container-low rounded-lg border border-white/5">
                  <span className="text-[10px] text-on-surface-variant block uppercase">Resolution Rate</span>
                  <span className="font-bold text-tertiary text-lg font-headline-lg">
                    {((c.totalRequestsResolved / c.totalRequestsReceived) * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-on-surface-variant block">{c.totalRequestsResolved} / {c.totalRequestsReceived} requests</span>
                </div>

                <div className="p-3 bg-surface-container-low rounded-lg border border-white/5">
                  <span className="text-[10px] text-on-surface-variant block uppercase">Avg Turnaround</span>
                  <span className="font-bold text-primary-container text-lg font-headline-lg">{c.avgTurnaroundDays} Days</span>
                  <span className="text-[10px] text-on-surface-variant block">Target: &lt; 15 days</span>
                </div>
              </div>

              {/* Fund Utilization Bar */}
              <div className="p-3 bg-surface-container-low rounded-lg border border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-on-surface-variant">Funds Utilized</span>
                  <span className="font-bold text-on-surface">
                    ₹{(c.fundsUtilizedLakhs / 100).toFixed(1)} Cr / ₹{(c.fundsAllocatedLakhs / 100).toFixed(1)} Cr
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full"
                    style={{ width: `${(c.fundsUtilizedLakhs / c.fundsAllocatedLakhs) * 100}%` }}
                  />
                </div>
              </div>

              {/* Top Categories Addressed */}
              <div className="mt-3">
                <span className="text-[10px] text-on-surface-variant uppercase font-mono block mb-1.5">Top Sectors Delivered</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.topCategoriesAddressed.map((cat, i) => (
                    <span key={i} className="text-[11px] bg-surface-container text-on-surface px-2 py-0.5 rounded border border-white/5">
                      ✓ {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Citizen Feedback & Star Rating */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-on-surface-variant block">Citizen Rating</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-primary-container font-headline-lg">{c.citizenSatisfactionRating}</span>
                  <div className="flex text-primary-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => handleRating(c.id, star)}
                        className={`w-3.5 h-3.5 cursor-pointer transition ${
                          star <= Math.round(c.citizenSatisfactionRating)
                            ? 'fill-primary-container text-primary-container'
                            : 'text-surface-bright'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {feedbackGiven[c.id] && (
                <span className="text-[11px] text-tertiary flex items-center gap-1 font-medium">
                  <ThumbsUp className="w-3 h-3" /> Feedback Recorded!
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
