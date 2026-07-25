import React from 'react';
import { FileText, Upload, ShieldCheck, HeartPulse } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick }) => {
  return (
    <div className="max-w-xl mx-auto my-12 p-8 sm:p-12 bg-white rounded-2xl border border-slate-200/80 shadow-md text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        <FileText className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-extrabold text-slate-900">
        Upload your first medical report to begin
      </h3>
      <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
        Select a PDF, lab scan image, or paste report text to receive instant, calm, plain-language explanations.
      </p>

      <div className="mt-6">
        <button
          onClick={onUploadClick}
          className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          <span>Upload Report</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Private • Local Gemma Model Standard</span>
      </div>
    </div>
  );
};
