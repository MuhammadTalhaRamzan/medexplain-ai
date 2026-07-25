import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerCard: React.FC = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed italic">
      <div className="flex items-start space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-gray-900 not-italic font-bold">DISCLAIMER:</strong> This provides educational explanations only. It does not diagnose diseases, prescribe treatments, or replace professional medical advice. Always consult your healthcare provider.
        </div>
      </div>
    </div>
  );
};

