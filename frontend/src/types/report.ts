export type TestStatus = 'normal' | 'borderline' | 'abnormal';

export interface LabTestItem {
  id: string;
  testName: string;
  result: string;
  referenceRange: string; // Range provided by report or "Not specified in report"
  unit?: string;
  status: TestStatus;
  category?: string; // e.g., 'Hematology', 'Metabolic', 'Lipids'
}

export interface ImportantFinding {
  id: string;
  finding: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
  iconType?: 'check' | 'alert' | 'heart' | 'hospital' | 'info';
}

export interface MedicalTermExplanation {
  id: string;
  testName: string;
  purpose: string;
  plainLanguageExplanation: string;
  educationalContext: string;
}

export interface AnalysisResult {
  reportTitle: string;
  reportDate?: string;
  overallSummary: string;
  importantFindings: ImportantFinding[];
  detectedTests: LabTestItem[];
  medicalExplanations: MedicalTermExplanation[];
  doctorQuestions: string[];
  lifestyleGuidance: string[];
  rawExtractedText?: string;
  analyzedAt: string;
  isLocalGemmaMode?: boolean;
}

export interface SampleReportPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  fileContent: string;
  presetResult: AnalysisResult;
}
