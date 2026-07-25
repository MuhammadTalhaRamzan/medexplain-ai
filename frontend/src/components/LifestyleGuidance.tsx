import React from 'react';
import { Utensils, Droplets, Activity, Moon, UserCheck, ShieldAlert } from 'lucide-react';

interface LifestyleGuidanceProps {
  guidance: string[];
}

export const LifestyleGuidance: React.FC<LifestyleGuidanceProps> = ({ guidance }) => {
  const getIcon = (index: number) => {
    switch (index % 5) {
      case 0:
        return <Utensils className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
      case 1:
        return <Droplets className="w-4 h-4 text-cyan-600 flex-shrink-0" />;
      case 2:
        return <Activity className="w-4 h-4 text-indigo-600 flex-shrink-0" />;
      case 3:
        return <Moon className="w-4 h-4 text-purple-600 flex-shrink-0" />;
      default:
        return <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="pb-3 border-b border-gray-100 mb-4">
        <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Wellness & Lifestyle Guidance
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          General, non-diagnostic wellness strategies to support everyday vitality
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {guidance.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start space-x-3"
          >
            <div className="p-1.5 rounded-lg bg-white shadow-2xs mt-0.5">{getIcon(idx)}</div>
            <p className="text-xs font-medium text-gray-800 leading-relaxed">
              {item}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-center space-x-2 text-[11px] text-amber-900">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>
          Educational suggestions only. Always consult your physician before starting significant dietary or wellness regimens.
        </span>
      </div>
    </div>
  );
};

