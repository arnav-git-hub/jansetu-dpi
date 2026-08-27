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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 border border-purple-800/80 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            Public Government Responsiveness Index
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Constituency Report Cards (MP / MLA / Ward Councillor)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Transparent scorecards showing actual requests resolved, fund utilization, turnaround days, and citizen satisfaction ratings.
          </p>
        </div>

        <div className="bg-slate-950 px-5 py-3 rounded-2xl border border-purple-800/80 text-center shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">National Responsiveness Index</span>
          <span className="text-3xl font-black text-purple-400 font-mono">88.6 %</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              {/* Profile Header */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                <img
                  src={c.photoUrl}
                  alt={c.representativeName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/60 shadow"
                />
                <div>
                  <span className="bg-purple-500/20 text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                    {c.title}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1 leading-tight">{c.representativeName}</h3>
                  <p className="text-xs text-slate-400">{c.constituencyName}, {c.state}</p>
                </div>
              </div>

              {/* Core Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Resolution Rate</span>
                  <span className="font-black text-emerald-400 text-lg">
                    {((c.totalRequestsResolved / c.totalRequestsReceived) * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">{c.totalRequestsResolved} / {c.totalRequestsReceived} requests</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Avg Turnaround</span>
                  <span className="font-black text-amber-400 text-lg">{c.avgTurnaroundDays} Days</span>
                  <span className="text-[10px] text-slate-400 block">Target: &lt; 15 days</span>
                </div>
              </div>

              {/* Fund Utilization Bar */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Funds Utilized</span>
                  <span className="font-bold text-slate-200">
                    ₹{(c.fundsUtilizedLakhs / 100).toFixed(1)} Cr / ₹{(c.fundsAllocatedLakhs / 100).toFixed(1)} Cr
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                    style={{ width: `${(c.fundsUtilizedLakhs / c.fundsAllocatedLakhs) * 100}%` }}
                  />
                </div>
              </div>

              {/* Top Categories Addressed */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 block font-semibold mb-1">Top Addressed Needs:</span>
                <div className="flex flex-wrap gap-1">
                  {c.topCategoriesAddressed.map((cat, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                      {cat.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 1-Tap Feedback Closed Loop */}
            <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl text-center space-y-2 pt-3 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-bold">Citizen Satisfaction</span>
                <span className="font-black text-amber-400 flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {c.citizenSatisfactionRating} / 5.0
                </span>
              </div>

              {feedbackGiven[c.id] ? (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1 py-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Rating Submitted to Responsiveness Index!
                </div>
              ) : (
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">Rate representative responsiveness:</p>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(c.id, star)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition"
                      >
                        <Star className="w-4 h-4 hover:fill-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
