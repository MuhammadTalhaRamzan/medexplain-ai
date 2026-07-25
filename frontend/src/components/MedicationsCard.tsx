import React from 'react';
import { Pill, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { RelatedMedication, AppLanguage } from '../types/report';

interface MedicationsCardProps {
  medications?: RelatedMedication[];
  language?: AppLanguage;
}

export const MedicationsCard: React.FC<MedicationsCardProps> = ({
  medications,
  language = 'en',
}) => {
  if (!medications || medications.length === 0) return null;

  const isUrdu = language === 'ur-roman';

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-50 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              {isUrdu ? 'Taleemi Dawaiyan Aur Class Info' : 'Related Medication Classes (Educational Context)'}
            </h2>
            <p className="text-[11px] text-gray-400">
              {isUrdu
                ? 'Ye maloomat sirf taleemi aagahi ke liye hai. Doctor ki ijazat ke bina dawai mat lein.'
                : 'Educational information on general treatment classes commonly prescribed by physicians.'}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-50 text-purple-700 rounded-full border border-purple-200 uppercase tracking-wider">
          Prescription Required
        </span>
      </div>

      {/* Warning Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">
            {isUrdu ? 'DOCTOR SE MASHWARA ZAROORI HAI:' : 'DOCTOR PRESCRIPTION MANDATORY:'}
          </strong>
          <span>
            {isUrdu
              ? 'Koi bhi dawai shuru karne ya tabdeel karne se pehle hamesha apne registered doctor se zaroor mashwara karein.'
              : 'Do not start, stop, or change any medication without consulting your qualified prescribing physician.'}
          </span>
        </div>
      </div>

      {/* Medication List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {medications.map((med, idx) => (
          <div
            key={med.id || idx}
            className="bg-purple-50/40 rounded-xl p-4 border border-purple-100/80 hover:border-purple-200 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-purple-900">{med.category}</span>
              <span className="text-[10px] font-mono text-purple-600 bg-white px-2 py-0.5 rounded border border-purple-200">
                {med.medicationClass}
              </span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed font-medium mb-2">{med.purpose}</p>

            {med.disclaimer && (
              <p className="text-[10px] text-gray-400 italic flex items-center">
                <Info className="w-3 h-3 mr-1 text-gray-400" />
                {med.disclaimer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
