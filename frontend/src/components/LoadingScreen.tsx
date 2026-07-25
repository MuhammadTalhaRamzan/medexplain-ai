import React, { useEffect, useState } from 'react';
import { Loader2, Check, Sparkles, FileText, Cpu, Heart, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  fileName?: string;
  onComplete?: () => void;
}

const STEPS = [
  { id: 1, label: 'Reading Report', detail: 'Parsing document structure & formatting' },
  { id: 2, label: 'Extracting Text', detail: 'Isolating test names, values & lab reference boundaries' },
  { id: 3, label: 'Analyzing Report', detail: 'Evaluating findings with local privacy-first AI' },
  { id: 4, label: 'Generating Explanation', detail: 'Translating medical terms into calm, plain language' },
  { id: 5, label: 'Preparing Dashboard', detail: 'Structuring questions for your healthcare professional' },
];

const TIPS = [
  'Reference ranges vary between laboratories depending on equipment and regional calibration.',
  'Your medical data is processed locally with local Gemma privacy standards.',
  'Slightly abnormal lab numbers often reflect transient factors like hydration, sleep, or recent meals.',
  'MedExplain AI organizes your test results so you can have informed, confident conversations with your doctor.'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ fileName }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(5);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    // Fine progress bar timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        return prev + 2;
      });
    }, 80);

    // Tip rotater
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200/80 shadow-lg text-center">
      {/* Animated Glowing Spinner */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Analyzing Medical Report
      </h2>
      <p className="text-xs text-slate-500 mt-1 font-mono">
        {fileName ? `File: ${fileName}` : 'Processing report content'}
      </p>

      {/* Main Progress Bar */}
      <div className="mt-6 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
          <span>{STEPS[currentStepIndex].label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 shadow-2xs"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Vertical Steps Checklist */}
      <div className="mt-8 text-left max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.id} className="flex items-start space-x-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <div className="flex-1">
                <p
                  className={`text-xs font-bold transition-colors ${
                    isCurrent
                      ? 'text-blue-700 font-extrabold'
                      : isDone
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-[11px] text-slate-500 mt-0.5 animate-fade-in">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reassuring Educational Banner */}
      <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-left flex items-start space-x-3">
        <Heart className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-blue-900">Did you know?</p>
          <p className="text-xs text-blue-800/80 mt-0.5 leading-relaxed">
            {TIPS[tipIndex]}
          </p>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-slate-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Local Gemma Privacy active • Estimated time: 2–4 seconds</span>
      </div>
    </div>
  );
};
