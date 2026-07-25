import React from 'react';
import { BookOpen } from 'lucide-react';
import { MedicalTermExplanation } from '../types/report';

interface TermExplanationsProps {
  explanations: MedicalTermExplanation[];
}

export const TermExplanations: React.FC<TermExplanationsProps> = ({ explanations }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="pb-3 border-b border-gray-100 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Medical Term Explanations
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Plain-language summaries to help you understand what each test measures
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {explanations.map((exp) => (
          <div
            key={exp.id}
            className="p-4 rounded-xl bg-gray-50/80 hover:bg-gray-50 border border-gray-100 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <h4 className="text-sm font-bold text-gray-900">{exp.testName}</h4>
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Purpose
                </span>
                <p className="text-xs font-semibold text-gray-800 mt-1">{exp.purpose}</p>
              </div>

              <div className="mb-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {exp.plainLanguageExplanation}
                </p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200/60 text-[11px] text-gray-500">
              <span className="font-bold text-gray-700">Context: </span>
              {exp.educationalContext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

