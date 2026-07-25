import React from 'react';
import { AlertTriangle, CheckCircle2, Calendar, GitCompare, Globe } from 'lucide-react';
import { AnalysisResult } from '../types/report';

interface SummaryCardProps {
  result: AnalysisResult;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ result }) => {
  const abnormalCount = result.detectedTests.filter((t) => t.status === 'abnormal').length;
  const borderlineCount = result.detectedTests.filter((t) => t.status === 'borderline').length;
  const improvedCount = result.detectedTests.filter((t) => t.trend === 'improved').length;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Overall Summary
          </h2>
          {result.language === 'ur-roman' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
              <Globe className="w-3 h-3 mr-1" />
              Roman Urdu
            </span>
          )}
          {result.isComparison && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <GitCompare className="w-3 h-3 mr-1 text-emerald-600" />
              Compare Mode
            </span>
          )}
        </div>

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

      {/* Comparison Detailed Callout Box */}
      {result.isComparison && result.comparisonSummary && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs leading-relaxed text-emerald-950 font-medium">
          <div className="flex items-center space-x-1.5 font-bold text-emerald-900 mb-1">
            <GitCompare className="w-4 h-4 text-emerald-600" />
            <span>Medication & Treatment Progress Analysis</span>
            {improvedCount > 0 && (
              <span className="ml-auto bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {improvedCount} Test(s) Improved
              </span>
            )}
          </div>
          <p>{result.comparisonSummary}</p>
        </div>
      )}

      {/* Status Pill */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
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
