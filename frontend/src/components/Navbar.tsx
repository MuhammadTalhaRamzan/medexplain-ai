import React from 'react';
import { FileSpreadsheet, Home, Info, Shield, Settings, Activity } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'about' | 'privacy' | 'settings';
  setCurrentTab: (tab: 'home' | 'about' | 'privacy' | 'settings') => void;
  onLoadSampleReport: (sampleId: string) => void;
  isLocalGemmaMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onLoadSampleReport,
  isLocalGemmaMode,
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

      {/* Nav Links & Status Badge */}
      <div className="flex items-center space-x-3 sm:space-x-6 text-sm font-medium text-gray-500">
        <button
          onClick={() => setCurrentTab('home')}
          className={`py-5 text-sm font-semibold transition-colors cursor-pointer ${
            currentTab === 'home'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'hover:text-gray-900'
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setCurrentTab('about')}
          className={`py-5 text-sm font-semibold transition-colors cursor-pointer hidden sm:block ${
            currentTab === 'about'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'hover:text-gray-900'
          }`}
        >
          About
        </button>

        <button
          onClick={() => setCurrentTab('privacy')}
          className={`py-5 text-sm font-semibold transition-colors cursor-pointer hidden sm:block ${
            currentTab === 'privacy'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'hover:text-gray-900'
          }`}
        >
          Privacy
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`py-5 text-sm font-semibold transition-colors cursor-pointer hidden sm:block ${
            currentTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'hover:text-gray-900'
          }`}
        >
          Settings
        </button>

        {/* Demo Button */}
        <button
          onClick={() => onLoadSampleReport('cbc-report')}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
          <span>Demo CBC Report</span>
        </button>

        {/* Local AI Gemma Badge */}
        <div className="flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
          <span>{isLocalGemmaMode ? 'LOCAL AI: GEMMA ACTIVE' : 'PRIVACY GUARANTEE'}</span>
        </div>
      </div>
    </nav>
  );
};

