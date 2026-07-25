import React from 'react';
import { AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { ImportantFinding } from '../types/report';

interface FindingsCardProps {
  findings: ImportantFinding[];
}

export const FindingsCard: React.FC<FindingsCardProps> = ({ findings }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          box: 'p-1.5 bg-red-50 rounded-lg mr-3 text-red-600 flex-shrink-0',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case 'warning':
        return {
          box: 'p-1.5 bg-amber-50 rounded-lg mr-3 text-amber-600 flex-shrink-0',
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case 'success':
        return {
          box: 'p-1.5 bg-green-50 rounded-lg mr-3 text-green-600 flex-shrink-0',
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      default:
        return {
          box: 'p-1.5 bg-blue-50 rounded-lg mr-3 text-blue-600 flex-shrink-0',
          icon: <Info className="w-4 h-4" />,
        };
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200/80 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Important Findings
        </h2>
        <span className="text-[11px] font-semibold text-gray-400 font-mono">
          {findings.length} OBSERVED
        </span>
      </div>

      <ul className="space-y-4">
        {findings.map((item) => {
          const badge = getSeverityBadge(item.severity);
          return (
            <li key={item.id} className="flex items-start">
              <div className={badge.box}>{badge.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {item.finding}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

