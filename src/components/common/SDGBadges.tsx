import React from 'react';
import { SDGGoal } from '../../types';

const SDG_META: Record<string, { label: string; color: string; number: number }> = {
  SDG1_NO_POVERTY:          { number: 1,  label: 'No Poverty',          color: 'bg-red-600 text-white' },
  SDG3_GOOD_HEALTH:         { number: 3,  label: 'Good Health',          color: 'bg-emerald-600 text-white' },
  SDG4_QUALITY_EDUCATION:   { number: 4,  label: 'Quality Education',    color: 'bg-red-700 text-white' },
  SDG5_GENDER_EQUALITY:     { number: 5,  label: 'Gender Equality',      color: 'bg-orange-500 text-white' },
  SDG6_CLEAN_WATER:         { number: 6,  label: 'Clean Water',          color: 'bg-sky-600 text-white' },
  SDG7_AFFORDABLE_ENERGY:   { number: 7,  label: 'Clean Energy',         color: 'bg-yellow-500 text-slate-900' },
  SDG9_INDUSTRY_INNOVATION: { number: 9,  label: 'Industry & Innovation',color: 'bg-orange-600 text-white' },
  SDG10_REDUCED_INEQUALITIES:{ number: 10, label: 'Reduced Inequalities', color: 'bg-pink-600 text-white' },
  SDG11_SUSTAINABLE_CITIES: { number: 11, label: 'Sustainable Cities',   color: 'bg-amber-500 text-slate-900' },
  SDG13_CLIMATE_ACTION:     { number: 13, label: 'Climate Action',       color: 'bg-green-700 text-white' },
  SDG16_PEACE_JUSTICE:      { number: 16, label: 'Peace & Justice',      color: 'bg-blue-700 text-white' },
  SDG17_PARTNERSHIPS:       { number: 17, label: 'Partnerships',         color: 'bg-blue-900 text-white' },
};

interface SDGBadgesProps {
  goals: SDGGoal[];
  size?: 'sm' | 'xs';
}

export const SDGBadges: React.FC<SDGBadgesProps> = ({ goals, size = 'xs' }) => {
  if (!goals || goals.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1" title="UN Sustainable Development Goals">
      {goals.map((goal) => {
        const meta = SDG_META[goal as string];
        if (!meta) return null;
        return (
          <span
            key={goal}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-bold leading-none ${meta.color} ${
              size === 'xs' ? 'text-[9px]' : 'text-[11px]'
            }`}
            title={`SDG ${meta.number}: ${meta.label}`}
          >
            <span>SDG{meta.number}</span>
            <span className="hidden md:inline opacity-80">·{meta.label}</span>
          </span>
        );
      })}
    </div>
  );
};
