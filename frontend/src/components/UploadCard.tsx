import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, X, AlertCircle, FileCode, CheckCircle, Sparkles, Lock } from 'lucide-react';
import { SAMPLE_REPORTS } from '../data/sampleReports';

interface UploadCardProps {
  onAnalyzeFile: (file: File | null, textContent: string, fileName: string) => void;
  onSelectPreset: (presetId: string) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onAnalyzeFile, onSelectPreset }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      alert('Supported formats: PDF, PNG, JPG, JPEG, TXT');
      return;
    }
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
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'file' && selectedFile) {
      onAnalyzeFile(selectedFile, pastedText, selectedFile.name);
    } else if (activeTab === 'text' && pastedText.trim().length > 0) {
      onAnalyzeFile(null, pastedText, 'Pasted_Medical_Report.txt');
    }
  };

  return (
    <div id="upload-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 max-w-4xl mx-auto my-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Upload className="w-5 h-5 text-blue-600 mr-2" />
            Upload Medical Report
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            PDFs, Lab Scans, PNG, JPG, or raw text are supported.
          </p>
        </div>

        {/* Local Privacy Callout */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local Gemma Analysis</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-slate-100/80 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'file'
              ? 'bg-white text-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Browse or Drop Document
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-white text-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Paste Raw Report Text
        </button>
      </div>

      {activeTab === 'file' ? (
        <div>
          {/* File Dropzone */}
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
                <Upload className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-slate-800">
                Drag & drop your medical report here
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                or <span className="text-blue-600 font-semibold underline">browse files</span> from your device
              </p>

              {/* Supported formats pills */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['PDF', 'PNG', 'JPG', 'JPEG', 'TXT'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 bg-white border border-slate-200/80 rounded-md text-[11px] font-semibold text-slate-600 shadow-2xs"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* Selected File Preview Box */
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    {selectedFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {previewDataUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 max-h-48 flex justify-center bg-black/5">
                  <img src={previewDataUrl} alt="Report Preview" className="object-contain max-h-48" />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Textarea for pasting raw text */
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Paste Report or Lab Results Text Below
          </label>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="e.g., METROPOLITAN DIAGNOSTICS - White Blood Cell: 11.8 x10^3/uL (Ref 4.5-11.0)... Hemoglobin: 10.8 g/dL..."
            rows={7}
            className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-slate-50/50 text-slate-800 font-mono"
          />
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 flex items-center">
          <CheckCircle className="w-4 h-4 text-emerald-500 mr-1.5 flex-shrink-0" />
          <span>Local AI engine translates clinical values into patient-friendly language.</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedFile && !pastedText.trim()}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            selectedFile || pastedText.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          <span>Analyze Report</span>
        </button>
      </div>

      {/* Preset Pickers */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Or load a sample medical report
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_REPORTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-transparent transition-colors cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
