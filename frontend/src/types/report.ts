export type TestStatus = 'normal' | 'borderline' | 'abnormal';
export type TestTrend = 'improved' | 'stable' | 'worsened';
export type AppLanguage = 'en' | 'ur-roman';

export interface LabTestItem {
  id: string;
  testName: string;
  result: string;
  beforeResult?: string; // Result from initial report (before medicine)
  referenceRange: string; // Range provided by report or "Not specified in report"
  unit?: string;
  status: TestStatus;
  trend?: TestTrend; // Improvement or deterioration after medicine
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

export interface RelatedMedication {
  id: string;
  category: string;
  medicationClass: string;
  purpose: string;
  disclaimer?: string;
}

export interface AnalysisResult {
  reportTitle: string;
  reportDate?: string;
  overallSummary: string;
  comparisonSummary?: string;
  importantFindings: ImportantFinding[];
  detectedTests: LabTestItem[];
  medicalExplanations: MedicalTermExplanation[];
  relatedMedications?: RelatedMedication[];
  doctorQuestions: string[];
  lifestyleGuidance: string[];
  rawExtractedText?: string;
  analyzedAt: string;
  isLocalGemmaMode?: boolean;
  isComparison?: boolean;
  language?: AppLanguage;
}

export interface SampleReportPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  fileContent: string;
  isComparisonPreset?: boolean;
  previousFileName?: string;
  previousFileContent?: string;
  presetResult: AnalysisResult;
}
