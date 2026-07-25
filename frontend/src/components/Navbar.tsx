import React from 'react';
import { FileSpreadsheet, Globe, GitCompare, FileText } from 'lucide-react';
import { AppLanguage } from '../types/report';

interface NavbarProps {
  currentTab: 'home' | 'about' | 'privacy' | 'settings';
  setCurrentTab: (tab: 'home' | 'about' | 'privacy' | 'settings') => void;
  onLoadSampleReport: (sampleId: string) => void;
  isLocalGemmaMode: boolean;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isComparisonMode: boolean;
  setIsComparisonMode: (comp: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onLoadSampleReport,
  isLocalGemmaMode,
  language,
  setLanguage,
  isComparisonMode,
  setIsComparisonMode,
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-8 h-16 flex items-center justify-between shadow-xs">
      {/* Brand Logo */}
      <div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => setCurrentTab('home')}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 3 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          MedExplain <span className="text-blue-600 font-extrabold">AI</span>
        </span>
      </div>

      {/* Center Mode Controls: Single vs Compare */}
      <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
        <button
          onClick={() => {
            setIsComparisonMode(false);
            setCurrentTab('home');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            !isComparisonMode
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Single Report</span>
        </button>

        <button
          onClick={() => {
            setIsComparisonMode(true);
            setCurrentTab('home');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            isComparisonMode
              ? 'bg-white text-emerald-700 shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Compare (Before / After Medicine)</span>
        </button>
      </div>

      {/* Right Controls & Nav Links */}
      <div className="flex items-center space-x-2 sm:space-x-4 text-sm font-medium text-gray-500">
        {/* Language Selector */}
        <div className="flex items-center space-x-1 bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1 text-xs font-bold text-blue-800">
          <Globe className="w-3.5 h-3.5 text-blue-600 mr-0.5" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as AppLanguage)}
            className="bg-transparent font-bold focus:outline-none cursor-pointer text-blue-900"
          >
            <option value="en">🇬🇧 English</option>
            <option value="ur-roman">🇵🇰 Roman Urdu</option>
          </select>
        </div>

        {/* Demo Preset Selector */}
        <button
          onClick={() => onLoadSampleReport(isComparisonMode ? 'lipid-compare-preset' : 'cbc-report')}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
          <span>{isComparisonMode ? 'Demo Compare' : 'Demo Single'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('home')}
          className={`py-2 text-xs font-bold transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-900'
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setCurrentTab('about')}
          className={`py-2 text-xs font-bold transition-colors cursor-pointer hidden sm:block ${
            currentTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-900'
          }`}
        >
          About
        </button>

        {/* Local AI Badge */}
        <div className="hidden xl:flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
          <span>{isLocalGemmaMode ? 'LOCAL AI ACTIVE' : 'PRIVACY SECURE'}</span>
        </div>
      </div>
    </nav>
  );
};
