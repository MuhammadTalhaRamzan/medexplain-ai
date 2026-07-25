import React from 'react';
import { Upload, ArrowRight, ShieldCheck, Heart, Sparkles, CheckCircle2, FileText, Zap } from 'lucide-react';
import { SAMPLE_REPORTS } from '../data/sampleReports';

interface HeroSectionProps {
  onScrollToUpload: () => void;
  onSelectSample: (sampleId: string) => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToUpload,
  onSelectSample,
  onLearnMore,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-100">
      {/* Background Subtle Medical Grid Graphics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Privacy Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local Gemma AI Engine • Zero Cloud Data Retention Guarantee</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Understand Your Medical Report in <span className="text-blue-600 underline decoration-blue-300 decoration-wavy decoration-2">Minutes</span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-powered explanations running locally with Gemma. Translating lab results, blood work, and pathology terms into calm, plain-language guidance.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onScrollToUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Upload className="w-5 h-5 mr-2" />
            <span>Upload Report</span>
          </button>

          <button
            onClick={onLearnMore}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all hover:border-slate-300 cursor-pointer"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-2 text-slate-500" />
          </button>
        </div>

        {/* Quick Demo Sample Picker Section */}
        <div className="mt-10 p-4 sm:p-5 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs max-w-3xl mx-auto text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Zap className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              Quick Demo Presets (Hackathon Ready)
            </span>
            <span className="text-xs text-blue-600 font-medium">1-Click Instant Analysis</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_REPORTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample.id)}
                className="group flex flex-col p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                    {sample.title}
                  </span>
                  <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 flex-shrink-0 ml-1" />
                </div>
                <span className="text-[11px] text-slate-500 line-clamp-1">{sample.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900">Plain Language</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Translates complex jargon without medical jargon.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900">100% Private</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Runs with local Gemma AI model standards.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900">Calm & Reassuring</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Designed to reduce patient stress & anxiety.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-900">Doctor Prep</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Generates smart questions for your physician.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
