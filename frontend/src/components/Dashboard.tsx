import React, { useState } from 'react';
import { Printer, RotateCcw, Share2, Check, FileText } from 'lucide-react';
import { AnalysisResult } from '../types/report';
import { SummaryCard } from './SummaryCard';
import { FindingsCard } from './FindingsCard';
import { LabResultsTable } from './LabResultsTable';
import { TermExplanations } from './TermExplanations';
import { DoctorQuestions } from './DoctorQuestions';
import { LifestyleGuidance } from './LifestyleGuidance';
import { PrivacyCard } from './PrivacyCard';
import { DisclaimerCard } from './DisclaimerCard';

interface DashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ result, onReset }) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const textToCopy = `MedExplain AI Report Summary:\n${result.reportTitle}\n\nSummary:\n${result.overallSummary}\n\nQuestions for Doctor:\n${result.doctorQuestions.join('\n- ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in print:p-0 print:m-0 print:max-w-none">
      {/* Dashboard Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs print:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">{result.reportTitle}</h1>
            <p className="text-xs text-gray-400 font-mono">SECURE LOCAL GEMMA ANALYSIS</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShareSummary}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-500" />}
            <span>{copiedSummary ? 'Copied' : 'Share Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onReset}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Another Report</span>
          </button>
        </div>
      </div>

      {/* Main 12-Column Sleek Interface Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Summary, Findings & Doctor Questions */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
          {/* 1. Overall Summary */}
          <SummaryCard result={result} />

          {/* 2. Important Findings */}
          <FindingsCard findings={result.importantFindings} />

          {/* 3. Questions for Doctor */}
          <DoctorQuestions questions={result.doctorQuestions} />
        </div>

        {/* Right Column: Lab Results Table, Term Explanations, Lifestyle Guidance & Privacy */}
        <div className="col-span-12 lg:col-span-8 space-y-6 flex flex-col">
          {/* 4. Detected Lab Results Table */}
          <LabResultsTable tests={result.detectedTests} />

          {/* 5. Medical Term Explanations */}
          <TermExplanations explanations={result.medicalExplanations} />

          {/* 6. Educational Lifestyle Guidance */}
          <LifestyleGuidance guidance={result.lifestyleGuidance} />

          {/* 7. Privacy Guarantee */}
          <PrivacyCard isLocalGemmaMode={result.isLocalGemmaMode} />

          {/* 8. Medical Disclaimer */}
          <DisclaimerCard />
        </div>
      </div>
    </div>
  );
};

