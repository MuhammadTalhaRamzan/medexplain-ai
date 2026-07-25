import React from 'react';
import { ShieldCheck, Cpu, Lock } from 'lucide-react';

interface PrivacyCardProps {
  isLocalGemmaMode?: boolean;
}

export const PrivacyCard: React.FC<PrivacyCardProps> = () => {
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden border border-gray-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Secure Cloud Analysis
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-300 rounded border border-green-500/30">
                Gemma Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
              Report analyzed via OpenRouter with Gemma 4 AI model. Temporary processing only—no data stored on external servers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 flex-shrink-0">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>Engine: Gemma 4 26B</span>
        </div>
      </div>
    </div>
  );
};

