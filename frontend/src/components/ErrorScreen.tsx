import React from 'react';
import { AlertOctagon, RotateCcw, Home, Cpu, FileQuestion, WifiOff } from 'lucide-react';

interface ErrorScreenProps {
  errorType?: 'unsupported' | 'unreadable' | 'ocr_failed' | 'gemma_offline' | 'server_error';
  errorMessage?: string;
  onRetry: () => void;
  onReturnHome: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  errorType = 'server_error',
  errorMessage,
  onRetry,
  onReturnHome,
}) => {
  const getErrorContent = () => {
    switch (errorType) {
      case 'unsupported':
        return {
          title: 'Unsupported File Format',
          description: 'The uploaded file format could not be processed. Please upload a valid PDF, PNG, JPG, or TXT medical report file.',
          icon: <FileQuestion className="w-10 h-10 text-amber-500" />,
        };
      case 'unreadable':
        return {
          title: 'Unreadable Medical Document',
          description: 'The document text or image blurriness prevented clear extraction of lab values. Please try re-uploading a higher resolution scan or image.',
          icon: <AlertOctagon className="w-10 h-10 text-rose-500" />,
        };
      case 'ocr_failed':
        return {
          title: 'Text Extraction (OCR) Failed',
          description: 'Could not automatically detect test names or lab numbers in this document image. Try uploading a text PDF or pasting the report text directly.',
          icon: <AlertOctagon className="w-10 h-10 text-rose-500" />,
        };
      case 'gemma_offline':
        return {
          title: 'Gemma Local AI Engine Unreachable',
          description: 'The local Ollama Gemma service is disconnected. Make sure Ollama is running or switch to Cloud Proxy mode in Settings.',
          icon: <WifiOff className="w-10 h-10 text-amber-500" />,
        };
      case 'server_error':
      default:
        return {
          title: 'Processing Error',
          description: errorMessage || 'An unexpected error occurred while analyzing the medical report. Please verify your file and try again.',
          icon: <AlertOctagon className="w-10 h-10 text-rose-500" />,
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-100 shadow-xl text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
        {content.icon}
      </div>

      <h3 className="text-2xl font-bold text-slate-900">{content.title}</h3>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{content.description}</p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          <span>Retry Upload</span>
        </button>

        <button
          onClick={onReturnHome}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4 mr-2" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};
