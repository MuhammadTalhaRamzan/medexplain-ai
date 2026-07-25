import React from 'react';
import { AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { AnalysisResult } from '../types/report';

interface SummaryCardProps {
  result: AnalysisResult;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ result }) => {
  const abnormalCount = result.detectedTests.filter((t) => t.status === 'abnormal').length;
  const borderlineCount = result.detectedTests.filter((t) => t.status === 'borderline').length;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200/80">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Overall Summary
        </h2>
        {result.reportDate && (
          <span className="text-xs text-gray-400 font-mono flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            {result.reportDate}
          </span>
        )}
      </div>

      <p className="text-base sm:text-lg font-medium leading-snug text-gray-800">
        {result.overallSummary}
      </p>

      {/* Status Pill */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-500">{result.reportTitle}</span>
        {abnormalCount > 0 ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-600" />
            {abnormalCount} Attention Needed
          </span>
        ) : borderlineCount > 0 ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            {borderlineCount} Borderline
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-bold border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" />
            Within Normal Limits
          </span>
        )}
      </div>
    </div>
  );
};

