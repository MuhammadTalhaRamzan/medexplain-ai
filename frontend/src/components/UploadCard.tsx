import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, X, Sparkles, Lock, GitCompare, Pill } from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';
import { AppLanguage } from '../types/report';

interface UploadCardProps {
  onAnalyzeFile: (options: {
    file: File | null;
    textContent: string;
    fileName: string;
    previousFile?: File | null;
    previousTextContent?: string;
    previousFileName?: string;
  }) => void;
  isComparisonMode?: boolean;
  language?: AppLanguage;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  onAnalyzeFile,
  isComparisonMode = false,
  language = 'en',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // Compare mode second file/text states
  const [selectedPrevFile, setSelectedPrevFile] = useState<File | null>(null);
  const [pastedPrevText, setPastedPrevText] = useState('');

  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevFileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File, isPrevious = false) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      alert('Supported formats: PDF, PNG, JPG, JPEG, TXT');
      return;
    }

    if (isPrevious) {
      setSelectedPrevFile(file);
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => setPastedPrevText(e.target?.result as string);
        reader.readAsText(file);
      }
    } else {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewDataUrl(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => setPastedText(e.target?.result as string);
        reader.readAsText(file);
        setPreviewDataUrl(null);
      } else {
        setPreviewDataUrl(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, isPrevious = false) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], isPrevious);
    }
  };

  const handleSubmit = () => {
    onAnalyzeFile({
      file: selectedFile,
      textContent: pastedText,
      fileName: selectedFile ? selectedFile.name : 'After_Medicine_Report.txt',
      previousFile: selectedPrevFile,
      previousTextContent: pastedPrevText,
      previousFileName: selectedPrevFile ? selectedPrevFile.name : 'Before_Medicine_Report.txt',
    });
  };

  return (
    <div id="upload-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 max-w-4xl mx-auto my-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            {isComparisonMode ? (
              <>
                <GitCompare className="w-5 h-5 text-emerald-600 mr-2" />
                <span>Compare Before & After Medicine Reports</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-blue-600 mr-2" />
                <span>Upload Medical Report</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isComparisonMode
              ? 'Upload initial lab report (Before Medicine) and follow-up report (After Medicine) to compare results and evaluate treatment progress.'
              : 'PDFs, Lab Scans, PNG, JPG, or raw text are supported.'}
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Analysis</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-2 mb-6 bg-slate-100/80 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'file' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Browse or Drop Documents
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'text' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Paste Raw Report Text
        </button>
      </div>

      {/* File Upload Section */}
      {activeTab === 'file' ? (
        <div className={isComparisonMode ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'block'}>
          {/* Compare Mode Input 1: Before Medicine */}
          {isComparisonMode && (
            <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-800 flex items-center">
                  <Pill className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  1. INITIAL REPORT (Before Medicine)
                </span>
                {selectedPrevFile && (
                  <button
                    onClick={() => setSelectedPrevFile(null)}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {!selectedPrevFile ? (
                <div
                  onDrop={(e) => handleDrop(e, true)}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => prevFileInputRef.current?.click()}
                  className="border-2 border-dashed border-amber-300 hover:border-amber-400 bg-white rounded-xl p-6 text-center cursor-pointer"
                >
                  <input
                    ref={prevFileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg,.txt"
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0], true)}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-amber-900">Upload Report BEFORE Medicine</p>
                  <p className="text-[10px] text-amber-700 mt-1">PDF, PNG, JPG, or TXT</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-3 border border-amber-200 flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-amber-600" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{selectedPrevFile.name}</p>
                    <p className="text-[10px] text-slate-500">{(selectedPrevFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Input: Current / Follow-Up Report */}
          <div className={isComparisonMode ? 'bg-emerald-50/40 rounded-2xl p-4 border border-emerald-200' : 'block'}>
            {isComparisonMode && (
              <span className="text-xs font-bold text-emerald-800 flex items-center mb-3">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                2. FOLLOW-UP REPORT (After Medicine)
              </span>
            )}

            {!selectedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg,.txt"
                  onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0], false)}
                  className="hidden"
                />
                <Upload className="w-10 h-10 mx-auto text-blue-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-800">
                  {isComparisonMode
                    ? 'Upload Follow-Up Report (AFTER Medicine)'
                    : 'Drag & drop your medical report here'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">or click to browse files</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-8 h-8 text-blue-600" />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-600" />
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {previewDataUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 max-h-32 flex justify-center bg-black/5">
                    <img src={previewDataUrl} alt="Preview" className="object-contain max-h-32" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Textarea + Voice Input */
        <div className="space-y-4">
          {isComparisonMode && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-amber-800 flex items-center">
                  <Pill className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  INITIAL REPORT TEXT (Before Medicine)
                </label>
                <VoiceInputButton
                  language={language}
                  onTranscript={(text) => setPastedPrevText((prev) => (prev ? `${prev} ${text}` : text))}
                  label="Voice Input (Before)"
                />
              </div>
              <textarea
                value={pastedPrevText}
                onChange={(e) => setPastedPrevText(e.target.value)}
                placeholder="Paste or dictate report BEFORE taking medicine (e.g., Total Cholesterol: 245 mg/dL)..."
                rows={4}
                className="w-full p-3 text-xs rounded-xl border border-amber-300 focus:border-amber-500 focus:outline-none bg-amber-50/20 text-slate-800 font-mono"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
                {isComparisonMode ? 'FOLLOW-UP REPORT TEXT (After Medicine)' : 'REPORT TEXT'}
              </label>
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setPastedText((prev) => (prev ? `${prev} ${text}` : text))}
                label="Voice Input (Mic)"
              />
            </div>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste or dictate report text (e.g., Total Cholesterol: 185 mg/dL)..."
              rows={5}
              className="w-full p-3.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none bg-slate-50/50 text-slate-800 font-mono"
            />
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          <span>Target Language: </span>
          <strong className="text-blue-700 uppercase">{language === 'ur-roman' ? 'Roman Urdu' : 'English'}</strong>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedFile && !pastedText.trim()}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            selectedFile || pastedText.trim()
              ? isComparisonMode
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          <span>{isComparisonMode ? 'Compare Before & After Reports' : 'Analyze Report'}</span>
        </button>
      </div>
    </div>
  );
};
