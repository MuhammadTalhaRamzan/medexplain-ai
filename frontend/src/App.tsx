import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { UploadCard } from './components/UploadCard';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './components/Dashboard';
import { ErrorScreen } from './components/ErrorScreen';
import { AboutView, PrivacyView, SettingsView } from './components/ModalsAndPages';
import { AnalysisResult, AppLanguage } from './types/report';
import { analyzeReport } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'privacy' | 'settings'>('home');
  const [viewState, setViewState] = useState<'idle' | 'loading' | 'results' | 'error'>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [isLocalGemmaMode, setIsLocalGemmaMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);

  const [openRouterApiKey, setOpenRouterApiKey] = useState<string>(
    () => localStorage.getItem('openRouterApiKey') || ''
  );
  const [openRouterModel, setOpenRouterModel] = useState<string>(
    () => localStorage.getItem('openRouterModel') || 'google/gemma-2-9b-it'
  );
  const [errorDetails, setErrorDetails] = useState<{
    type: 'unsupported' | 'unreadable' | 'ocr_failed' | 'gemma_offline' | 'server_error';
    message?: string;
  } | null>(null);

  // Scroll to upload card
  const scrollToUpload = () => {
    setCurrentTab('home');
    setTimeout(() => {
      const uploadElem = document.getElementById('upload-section');
      if (uploadElem) {
        uploadElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Analyze uploaded file or pasted text (Single or Compare Mode)
  const handleAnalyzeFile = async (options: {
    file: File | null;
    textContent: string;
    fileName: string;
    previousFile?: File | null;
    previousTextContent?: string;
    previousFileName?: string;
  }) => {
    setCurrentFileName(options.fileName);
    setViewState('loading');

    try {
      const response = await analyzeReport({
        file: options.file,
        textContent: options.textContent,
        fileName: options.fileName,
        previousFile: options.previousFile,
        previousTextContent: options.previousTextContent,
        previousFileName: options.previousFileName,
        language,
        isComparison: isComparisonMode || Boolean(options.previousFile || options.previousTextContent),
      });

      if (response.success && response.data) {
        setAnalysisResult(response.data);
        setViewState('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (response.error) {
        const code = response.error.code;
        let type: 'unsupported' | 'unreadable' | 'ocr_failed' | 'gemma_offline' | 'server_error' = 'server_error';
        if (code === 'UNSUPPORTED_FILE_TYPE') type = 'unsupported';
        else if (code === 'UNREADABLE_REPORT') type = 'unreadable';
        else if (code === 'OCR_FAILED' || code === 'OCR_TIMEOUT') type = 'ocr_failed';
        else if (code === 'AI_NOT_CONFIGURED' || code === 'AI_TIMEOUT') type = 'gemma_offline';

        setErrorDetails({ type, message: response.error.message });
        setViewState('error');
      } else {
        setErrorDetails({ type: 'server_error', message: 'No analysis data returned from the server.' });
        setViewState('error');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorDetails({
        type: 'server_error',
        message: err?.message || 'Failed to connect to the analysis server.',
      });
      setViewState('error');
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setViewState('idle');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isLocalGemmaMode={isLocalGemmaMode}
        language={language}
        setLanguage={setLanguage}
        isComparisonMode={isComparisonMode}
        setIsComparisonMode={setIsComparisonMode}
      />

      {/* View router for About / Privacy / Settings */}
      {currentTab === 'about' && <AboutView onClose={() => setCurrentTab('home')} />}
      {currentTab === 'privacy' && <PrivacyView onClose={() => setCurrentTab('home')} />}
      {currentTab === 'settings' && (
        <SettingsView
          onClose={() => setCurrentTab('home')}
          isLocalGemmaMode={isLocalGemmaMode}
          setIsLocalGemmaMode={setIsLocalGemmaMode}
          openRouterApiKey={openRouterApiKey}
          setOpenRouterApiKey={setOpenRouterApiKey}
          openRouterModel={openRouterModel}
          setOpenRouterModel={setOpenRouterModel}
        />
      )}

      {/* Main Home Content */}
      {currentTab === 'home' && (
        <main className="flex-1 pb-16">
          {viewState === 'idle' && (
            <>
              <HeroSection
                onScrollToUpload={scrollToUpload}
                onLearnMore={() => setCurrentTab('about')}
              />
              <UploadCard
                onAnalyzeFile={handleAnalyzeFile}
                isComparisonMode={isComparisonMode}
                language={language}
              />
            </>
          )}

          {viewState === 'loading' && (
            <LoadingScreen fileName={currentFileName} />
          )}

          {viewState === 'results' && analysisResult && (
            <Dashboard result={analysisResult} onReset={handleReset} />
          )}

          {viewState === 'error' && errorDetails && (
            <ErrorScreen
              errorType={errorDetails.type}
              errorMessage={errorDetails.message}
              onRetry={handleReset}
              onReturnHome={() => {
                handleReset();
                setCurrentTab('home');
              }}
            />
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
        <div className="flex items-center space-x-3 text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
          <div className="flex items-center text-blue-600 font-bold">
            <Shield className="w-3.5 h-3.5 mr-1" />
            SECURE LOCAL ANALYSIS
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <div className="hidden md:block max-w-md text-gray-400">
            MULTILINGUAL (ENGLISH & ROMAN URDU) • BEFORE & AFTER MEDICINE REPORT COMPARISON
          </div>
        </div>
        <div className="bg-gray-100 px-3.5 py-1.5 rounded-lg max-w-sm text-[10px] text-gray-500 leading-tight italic border border-gray-200">
          <strong className="text-gray-700 not-italic font-bold">DISCLAIMER:</strong> Educational explanations only. Does not diagnose diseases or replace medical advice.
        </div>
      </footer>
    </div>
  );
}