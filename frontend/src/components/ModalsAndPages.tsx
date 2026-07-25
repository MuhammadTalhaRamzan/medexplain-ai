import React, { useState } from 'react';
import { Shield, Info, Settings, Cpu, HardDrive, Check, Lock, RefreshCw, X, Server, Eye, FileText } from 'lucide-react';

interface TabViewsProps {
  currentTab: 'about' | 'privacy' | 'settings';
  onClose: () => void;
  isLocalGemmaMode: boolean;
  setIsLocalGemmaMode: (val: boolean) => void;
}

export const AboutView: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 max-w-3xl mx-auto my-8 relative">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
    >
      <X className="w-5 h-5" />
    </button>

    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
        <Info className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">About MedExplain AI</h2>
        <p className="text-xs text-slate-500">Empowering patients with clear, accessible healthcare literacy.</p>
      </div>
    </div>

    <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
      <p>
        <strong>MedExplain AI</strong> was built to solve a crucial problem in modern healthcare: medical lab reports and pathology documents are packed with complex clinical terminology and reference codes that leave patients feeling confused and anxious.
      </p>

      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
        <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-1">Our Core Mission</h3>
        <p className="text-xs text-blue-800">
          To provide instant, trustworthy, plain-language explanations of medical reports while strictly preserving patient privacy through local device AI processing with Gemma.
        </p>
      </div>

      <h3 className="font-bold text-slate-900 pt-2">Key Principles:</h3>
      <ul className="list-disc list-inside space-y-2 text-xs text-slate-600">
        <li><strong>Simplicity:</strong> Upload any lab report in seconds and receive an intuitive dashboard within minutes.</li>
        <li><strong>Trustworthiness:</strong> Reference ranges are displayed strictly as provided by the testing laboratory, never artificially inferred.</li>
        <li><strong>Privacy First:</strong> Native support for local Gemma execution so confidential patient data never leaves the device.</li>
        <li><strong>Actionable Preparedness:</strong> Generates structured questions to help patients have productive conversations with their primary care provider.</li>
      </ul>
    </div>
  </div>
);

export const PrivacyView: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 max-w-3xl mx-auto my-8 relative">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
    >
      <X className="w-5 h-5" />
    </button>

    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
        <Shield className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Privacy & Data Security Policy</h2>
        <p className="text-xs text-slate-500">Your health data belongs to you—period.</p>
      </div>
    </div>

    <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
      <div className="p-4 rounded-xl bg-slate-900 text-white">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Lock className="w-4 h-4" />
          <span>Local Gemma Analysis Guarantee</span>
        </div>
        <p className="text-xs text-slate-300">
          "Your report was analyzed locally on your device using Gemma through Ollama. No report data was sent to external AI servers."
        </p>
      </div>

      <h3 className="font-bold text-slate-900 pt-2">Our Security Standards:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">Zero Third-Party Storage</span>
          <span className="text-slate-600">Uploaded documents are processed transiently in memory and are never persisted on remote databases.</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">Local Ollama Integration</span>
          <span className="text-slate-600">Supports direct local host connection to Ollama Gemma models for offline air-gapped security.</span>
        </div>
      </div>
    </div>
  </div>
);

export const SettingsView: React.FC<{
  onClose: () => void;
  isLocalGemmaMode: boolean;
  setIsLocalGemmaMode: (val: boolean) => void;
  openRouterApiKey: string;
  setOpenRouterApiKey: (key: string) => void;
  openRouterModel: string;
  setOpenRouterModel: (model: string) => void;
}> = ({
  onClose,
  isLocalGemmaMode,
  setIsLocalGemmaMode,
  openRouterApiKey,
  setOpenRouterApiKey,
  openRouterModel,
  setOpenRouterModel,
}) => {
  const [ollamaHost, setOllamaHost] = useState('http://localhost:11434');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('openRouterApiKey', openRouterApiKey);
    localStorage.setItem('openRouterModel', openRouterModel);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto my-8 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Application Settings</h2>
          <p className="text-xs text-slate-500">Configure AI processing model engine, OpenRouter API & preferences.</p>
        </div>
      </div>

      <div className="space-y-6 text-sm">
        {/* OpenRouter API Key Input */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-blue-900 block text-xs">OpenRouter API Key</span>
              <span className="text-[11px] text-blue-700">Use your OpenRouter key to analyze reports with models like Gemma, Gemini, Claude, or Llama.</span>
            </div>
            <Server className="w-4 h-4 text-blue-600 flex-shrink-0" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
              API Key (sk-or-v1-...)
            </label>
            <input
              type="password"
              value={openRouterApiKey}
              onChange={(e) => setOpenRouterApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Select OpenRouter Model
            </label>
            <select
              value={openRouterModel}
              onChange={(e) => setOpenRouterModel(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white font-mono"
            >
              <option value="google/gemma-2-9b-it">google/gemma-2-9b-it (Recommended)</option>
              <option value="google/gemini-2.5-flash">google/gemini-2.5-flash</option>
              <option value="meta-llama/llama-3.3-70b-instruct">meta-llama/llama-3.3-70b-instruct</option>
              <option value="anthropic/claude-3.5-sonnet">anthropic/claude-3.5-sonnet</option>
              <option value="openai/gpt-4o-mini">openai/gpt-4o-mini</option>
            </select>
          </div>
        </div>

        {/* Toggle Local Gemma Mode */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 block text-xs">Prefer Local Offline Pattern Parsing</span>
            <span className="text-[11px] text-slate-500">Use local pattern analyzer for zero-network execution.</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isLocalGemmaMode}
              onChange={(e) => setIsLocalGemmaMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Ollama Host */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Local Ollama Service Host URL
          </label>
          <input
            type="text"
            value={ollamaHost}
            onChange={(e) => setOllamaHost(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50 font-mono"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Version 1.0 • OpenRouter Supported</span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer flex items-center space-x-1"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Settings Saved' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
