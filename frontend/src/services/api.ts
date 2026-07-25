import { AnalysisResult, AppLanguage } from '../types/report';

const API_BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

export interface UploadResponse {
  success: boolean;
  data?: {
    uploadId: string;
    fileName: string;
    originalName: string;
    sizeBytes: number;
    mimeType: string;
    status: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: {
    code: string;
    message: string;
  };
}

export interface AnalyzeOptions {
  file?: File | null;
  textContent?: string;
  fileName?: string;
  previousFile?: File | null;
  previousTextContent?: string;
  previousFileName?: string;
  language?: AppLanguage;
  isComparison?: boolean;
}

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Check AI provider status
 */
export async function checkAiStatus(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/ai/status`);
  if (!response.ok) {
    throw new Error(`AI status check failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Upload a file to backend POST /upload
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

/**
 * Analyze a medical report file or raw text via backend POST /analyze
 */
export async function analyzeReport(options: AnalyzeOptions): Promise<AnalyzeResponse> {
  const formData = new FormData();

  if (options.file) {
    formData.append('file', options.file);
  }

  if (options.textContent) {
    formData.append('text', options.textContent);
  }

  if (options.fileName) {
    formData.append('fileName', options.fileName);
  }

  if (options.previousFile) {
    formData.append('previousFile', options.previousFile);
  }

  if (options.previousTextContent) {
    formData.append('previousText', options.previousTextContent);
  }

  if (options.previousFileName) {
    formData.append('previousFileName', options.previousFileName);
  }

  formData.append('language', options.language || 'en');
  if (options.isComparison) {
    formData.append('isComparison', 'true');
  }

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();

  if (!response.ok && !json.error) {
    return {
      success: false,
      error: {
        code: `HTTP_${response.status}`,
        message: `Server returned status ${response.status}`,
      },
    };
  }

  return json;
}
