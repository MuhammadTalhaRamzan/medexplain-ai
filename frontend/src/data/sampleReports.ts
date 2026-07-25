import { SampleReportPreset } from '../types/report';

export const SAMPLE_REPORTS: SampleReportPreset[] = [
  {
    id: 'lipid-compare-preset',
    title: 'Lipid Profile — Before vs After Statin Medication',
    category: 'Medication Comparison',
    description: 'Compares initial cholesterol levels before medicine with follow-up levels 3 months after starting Statin treatment.',
    fileName: 'FollowUp_Lipid_Panel_After_Medicine.pdf',
    fileContent: `CARDIO HEALTH CLINIC - FOLLOW-UP REPORT (AFTER MEDICINE)
Date: 2026-07-20
Total Cholesterol: 178 mg/dL (Ref: < 200) NORMAL
LDL Cholesterol: 92 mg/dL (Ref: < 100) NORMAL
HDL Cholesterol: 54 mg/dL (Ref: > 40) OPTIMAL
Triglycerides: 125 mg/dL (Ref: < 150) NORMAL`,
    isComparisonPreset: true,
    previousFileName: 'Initial_Lipid_Panel_Before_Medicine.pdf',
    previousFileContent: `CARDIO HEALTH CLINIC - INITIAL REPORT (BEFORE MEDICINE)
Date: 2026-04-10
Total Cholesterol: 245 mg/dL (Ref: < 200) HIGH
LDL Cholesterol: 165 mg/dL (Ref: < 100) HIGH
HDL Cholesterol: 48 mg/dL (Ref: > 40) NORMAL
Triglycerides: 160 mg/dL (Ref: < 150) BORDERLINE`,
    presetResult: {
      reportTitle: 'Lipid Profile — Before vs After Statin Medication',
      reportDate: '2026-07-20',
      overallSummary: 'Great progress! Comparing your report BEFORE taking medicine with your FOLLOW-UP report AFTER treatment shows significant improvement across all cholesterol markers. Your LDL ("bad") cholesterol has dropped into the ideal target range.',
      comparisonSummary: 'Medication Efficacy Analysis: Total Cholesterol decreased from 245 to 178 mg/dL (Improved). LDL Cholesterol dropped from 165 to 92 mg/dL (Improved to normal). Triglycerides reduced from 160 to 125 mg/dL (Improved). HDL protective cholesterol increased slightly from 48 to 54 mg/dL.',
      importantFindings: [
        {
          id: 'f1',
          finding: 'LDL Cholesterol dropped dramatically from 165 mg/dL to 92 mg/dL, returning to normal healthy range.',
          severity: 'success',
          iconType: 'check',
        },
        {
          id: 'f2',
          finding: 'Total Cholesterol decreased by 67 points (245 → 178 mg/dL), confirming effective medication response.',
          severity: 'success',
          iconType: 'check',
        },
        {
          id: 'f3',
          finding: 'Triglycerides improved from 160 mg/dL (borderline) down to 125 mg/dL (normal).',
          severity: 'success',
          iconType: 'check',
        },
      ],
      detectedTests: [
        {
          id: 't1',
          testName: 'LDL Cholesterol (Bad)',
          result: '92',
          beforeResult: '165',
          unit: 'mg/dL',
          referenceRange: '< 100',
          status: 'normal',
          trend: 'improved',
          category: 'Cardiovascular',
        },
        {
          id: 't2',
          testName: 'Total Cholesterol',
          result: '178',
          beforeResult: '245',
          unit: 'mg/dL',
          referenceRange: '< 200',
          status: 'normal',
          trend: 'improved',
          category: 'Cardiovascular',
        },
        {
          id: 't3',
          testName: 'Triglycerides',
          result: '125',
          beforeResult: '160',
          unit: 'mg/dL',
          referenceRange: '< 150',
          status: 'normal',
          trend: 'improved',
          category: 'Cardiovascular',
        },
        {
          id: 't4',
          testName: 'HDL Cholesterol (Good)',
          result: '54',
          beforeResult: '48',
          unit: 'mg/dL',
          referenceRange: '> 40',
          status: 'normal',
          trend: 'improved',
          category: 'Cardiovascular',
        },
      ],
      medicalExplanations: [
        {
          id: 'e1',
          testName: 'LDL Cholesterol',
          purpose: 'Measures bad cholesterol carrying fats to blood vessels.',
          plainLanguageExplanation: 'Your LDL level reduced from 165 to 92 mg/dL. This shows your cholesterol medicine worked effectively.',
          educationalContext: 'Maintaining LDL below 100 mg/dL protects arterial health over the long term.',
        },
        {
          id: 'e2',
          testName: 'Triglycerides',
          purpose: 'Measures blood fats from dietary energy.',
          plainLanguageExplanation: 'Decreased from 160 to 125 mg/dL into normal territory.',
          educationalContext: 'Lower triglycerides reduce metabolic and cardiovascular strain.',
        },
      ],
      relatedMedications: [
        {
          id: 'm1',
          category: 'Cholesterol Lowering',
          medicationClass: 'HMG-CoA Reductase Inhibitors (Statins e.g., Atorvastatin 20mg, Rosuvastatin)',
          purpose: 'Reduces liver cholesterol synthesis, lowering LDL cholesterol and blood vessel plaque build-up.',
          disclaimer: 'Must be prescribed and monitored by a licensed physician.',
        },
        {
          id: 'm2',
          category: 'Triglyceride Support',
          medicationClass: 'Omega-3 Fatty Acids / Dietary Support',
          purpose: 'Supports normal triglyceride clearance alongside heart-healthy diet.',
          disclaimer: 'Requires doctor advice for appropriate dosage.',
        },
      ],
      doctorQuestions: [
        'Should I continue my current statin dosage given this excellent response?',
        'When should we schedule our next routine lipid follow-up test?',
        'Are any lifestyle modifications recommended alongside my medication?',
      ],
      lifestyleGuidance: [
        'Continue taking your prescribed medication consistently as directed by your physician.',
        'Maintain a heart-healthy diet with oats, olive oil, and fresh vegetables.',
        'Engage in 30 minutes of daily physical activity like brisk walking.',
        'Schedule your routine follow-up appointment with your doctor.',
      ],
      rawExtractedText: `Cardio Health Clinic Follow Up Report... LDL 92 (before 165)... Total Cholesterol 178 (before 245)...`,
      analyzedAt: new Date().toISOString(),
      isLocalGemmaMode: true,
      isComparison: true,
      language: 'en',
    },
  },
  {
    id: 'cbc-report',
    title: 'Complete Blood Count (CBC) with Differential',
    category: 'Hematology',
    description: 'Standard blood test evaluating red/white blood cells and hemoglobin levels.',
    fileName: 'CBC_Report_Patient_2026.pdf',
    fileContent: `METROPOLITAN GENERAL DIAGNOSTICS
PATIENT LAB REPORT - CONFIDENTIAL
Patient ID: 940218
Date of Collection: 2026-06-12

TEST NAME                   RESULT    UNIT      REFERENCE RANGE     STATUS
-------------------------------------------------------------------------
White Blood Cell (WBC)      11.8      x10^3/uL  4.5 - 11.0          HIGH
Red Blood Cell (RBC)        4.65      x10^6/uL  4.2 - 5.8           NORMAL
Hemoglobin (HGB)            10.8      g/dL      12.0 - 16.0         LOW
Hematocrit (HCT)            33.2      %         37.0 - 48.0         LOW
Platelets                   245       x10^3/uL  150 - 450           NORMAL
Mean Corpuscular Volume (MCV) 72.1    fL        80.0 - 100.0        LOW
RDW                         15.8      %         11.5 - 14.5         HIGH
Neutrophils                 72        %         40 - 70             BORDERLINE
Lymphocytes                 22        %         20 - 40             NORMAL

NOTES: Microcytic hypochromic red blood cells noted. Slightly elevated WBC count. Follow up with physician.`,
    presetResult: {
      reportTitle: 'Complete Blood Count (CBC) with Differential',
      reportDate: '2026-06-12',
      overallSummary: 'Most values are close to normal, but your report shows mild anemia indicators (low Hemoglobin and MCV) alongside a slightly elevated White Blood Cell count. Two specific values require follow-up discussion with your healthcare professional.',
      importantFindings: [
        {
          id: 'f1',
          finding: 'Hemoglobin (10.8 g/dL) and Hematocrit (33.2%) are below the lab reference range, which may indicate mild anemia.',
          severity: 'alert',
          iconType: 'alert'
        },
        {
          id: 'f2',
          finding: 'White Blood Cell count (11.8 x10^3/uL) is slightly elevated above 11.0, often seen during mild body responses or mild stress.',
          severity: 'warning',
          iconType: 'info'
        },
        {
          id: 'f3',
          finding: 'Platelet count and Red Blood Cell total counts are within normal, healthy reference limits.',
          severity: 'success',
          iconType: 'check'
        }
      ],
      detectedTests: [
        {
          id: 't1',
          testName: 'White Blood Cell (WBC)',
          result: '11.8',
          unit: 'x10^3/uL',
          referenceRange: '4.5 - 11.0',
          status: 'borderline',
          category: 'Hematology'
        },
        {
          id: 't2',
          testName: 'Hemoglobin (HGB)',
          result: '10.8',
          unit: 'g/dL',
          referenceRange: '12.0 - 16.0',
          status: 'abnormal',
          category: 'Hematology'
        },
        {
          id: 't3',
          testName: 'Hematocrit (HCT)',
          result: '33.2',
          unit: '%',
          referenceRange: '37.0 - 48.0',
          status: 'abnormal',
          category: 'Hematology'
        },
        {
          id: 't4',
          testName: 'Mean Corpuscular Volume (MCV)',
          result: '72.1',
          unit: 'fL',
          referenceRange: '80.0 - 100.0',
          status: 'abnormal',
          category: 'Hematology'
        },
        {
          id: 't5',
          testName: 'Platelets',
          result: '245',
          unit: 'x10^3/uL',
          referenceRange: '150 - 450',
          status: 'normal',
          category: 'Hematology'
        },
        {
          id: 't6',
          testName: 'Red Blood Cell (RBC)',
          result: '4.65',
          unit: 'x10^6/uL',
          referenceRange: '4.2 - 5.8',
          status: 'normal',
          category: 'Hematology'
        }
      ],
      medicalExplanations: [
        {
          id: 'e1',
          testName: 'Hemoglobin & Hematocrit',
          purpose: 'Measures the oxygen-carrying protein in red blood cells and the percentage of blood composed of red cells.',
          plainLanguageExplanation: 'Your hemoglobin is slightly below the standard threshold. Hemoglobin carries oxygen from your lungs to the rest of your body.',
          educationalContext: 'Slightly lower hemoglobin can be related to low iron intake, dietary factors, or recent blood loss. Your doctor can determine if dietary adjustments or supplements are helpful.'
        },
        {
          id: 'e2',
          testName: 'White Blood Cell (WBC)',
          purpose: 'Checks the primary defense cells of the immune system.',
          plainLanguageExplanation: 'White blood cells fight off infections and respond to inflammation or temporary stress.',
          educationalContext: 'An 11.8 value is just above the standard 11.0 upper limit. It often reflects minor inflammation or active immune protection.'
        },
        {
          id: 'e3',
          testName: 'Mean Corpuscular Volume (MCV)',
          purpose: 'Measures the average size of your red blood cells.',
          plainLanguageExplanation: 'Smaller red blood cell size (72.1 fL) is frequently linked with low iron stores.',
          educationalContext: 'Doctors frequently evaluate MCV alongside Hemoglobin to understand the cellular cause of mild fatigue or low energy.'
        }
      ],
      doctorQuestions: [
        'Could my low Hemoglobin and MCV be related to iron levels or dietary intake?',
        'Should we recheck this CBC test in 4 to 8 weeks to see if values stabilize?',
        'Are any additional blood tests (like serum ferritin or iron panel) recommended?',
        'What mild dietary or lifestyle changes would you advise based on these results?'
      ],
      lifestyleGuidance: [
        'Maintain a well-balanced diet rich in green leafy vegetables, legumes, or iron-dense foods.',
        'Pair iron-containing foods with Vitamin C (such as citrus or bell peppers) to assist natural nutrient absorption.',
        'Stay consistently hydrated with 8-10 glasses of water daily.',
        'Ensure 7-8 hours of restful sleep every night to support cellular energy.',
        'Schedule a routine follow-up with your primary physician to review these results in full clinical context.'
      ],
      rawExtractedText: `Metropolitan General Diagnostics... WBC 11.8, HGB 10.8, HCT 33.2...`,
      analyzedAt: new Date().toISOString(),
      isLocalGemmaMode: true
    }
  },
  {
    id: 'lipid-panel',
    title: 'Lipid & Cholesterol Profile',
    category: 'Cardiovascular',
    description: 'Evaluates cardiovascular wellness, LDL, HDL, and total cholesterol levels.',
    fileName: 'Lipid_Panel_Report.pdf',
    fileContent: `CARDIO HEALTH CLINIC
LIPID PANEL RESULTS
Date: 2026-05-18

Total Cholesterol:    215 mg/dL    (Ref: < 200 mg/dL)    BORDERLINE HIGH
Triglycerides:        142 mg/dL    (Ref: < 150 mg/dL)    NORMAL
HDL Cholesterol:      52 mg/dL     (Ref: > 40 mg/dL)     OPTIMAL / NORMAL
LDL Cholesterol:      135 mg/dL    (Ref: < 100 mg/dL)    ELEVATED
Non-HDL Cholesterol:  163 mg/dL    (Ref: < 130 mg/dL)    HIGH`,
    presetResult: {
      reportTitle: 'Lipid & Cholesterol Profile',
      reportDate: '2026-05-18',
      overallSummary: 'Your lipid panel shows optimal HDL ("good") cholesterol and normal triglycerides, but Total Cholesterol and LDL ("bad") cholesterol are mildly above optimal reference limits.',
      importantFindings: [
        {
          id: 'f1',
          finding: 'HDL Cholesterol (52 mg/dL) is in a healthy, protective range above 40 mg/dL.',
          severity: 'success',
          iconType: 'check'
        },
        {
          id: 'f2',
          finding: 'LDL Cholesterol (135 mg/dL) is mildly elevated above the recommended optimal cutoff (<100 mg/dL).',
          severity: 'warning',
          iconType: 'alert'
        },
        {
          id: 'f3',
          finding: 'Triglycerides (142 mg/dL) are within standard desirable boundaries (<150 mg/dL).',
          severity: 'success',
          iconType: 'check'
        }
      ],
      detectedTests: [
        {
          id: 't1',
          testName: 'Total Cholesterol',
          result: '215',
          unit: 'mg/dL',
          referenceRange: '< 200',
          status: 'borderline',
          category: 'Cardiovascular'
        },
        {
          id: 't2',
          testName: 'LDL Cholesterol (Bad)',
          result: '135',
          unit: 'mg/dL',
          referenceRange: '< 100',
          status: 'borderline',
          category: 'Cardiovascular'
        },
        {
          id: 't3',
          testName: 'HDL Cholesterol (Good)',
          result: '52',
          unit: 'mg/dL',
          referenceRange: '> 40',
          status: 'normal',
          category: 'Cardiovascular'
        },
        {
          id: 't4',
          testName: 'Triglycerides',
          result: '142',
          unit: 'mg/dL',
          referenceRange: '< 150',
          status: 'normal',
          category: 'Cardiovascular'
        }
      ],
      medicalExplanations: [
        {
          id: 'e1',
          testName: 'LDL Cholesterol',
          purpose: 'Transports cholesterol through blood vessels.',
          plainLanguageExplanation: 'Often referred to as "bad" cholesterol. Higher levels can gradually build up in artery walls over long periods.',
          educationalContext: 'Mild elevations are very responsive to heart-healthy meal plans, soluble fiber, and regular daily walking.'
        },
        {
          id: 'e2',
          testName: 'HDL Cholesterol',
          purpose: 'Helps remove excess cholesterol from blood vessels back to the liver.',
          plainLanguageExplanation: 'Known as "good" cholesterol. Your 52 mg/dL level is protective.',
          educationalContext: 'Aerobic physical activity and healthy fats (like olive oil and nuts) help maintain solid HDL levels.'
        }
      ],
      doctorQuestions: [
        'What overall cardiovascular risk assessment score do these lipid numbers reflect for my age group?',
        'Would dietary adjustments and aerobic routine be sufficient as a first step for 3-6 months?',
        'When should we re-test this lipid panel to assess progress?'
      ],
      lifestyleGuidance: [
        'Incorporate high-fiber foods such as oats, chia seeds, apples, and lentils into daily meals.',
        'Choose healthy unsaturated fats (avocados, olive oil, almonds) over saturated animal fats.',
        'Engage in 150 minutes per week of moderate cardiovascular exercise (like brisk walking or cycling).',
        'Limit refined sugars and processed snacks.',
        'Discuss these blood lipids during your upcoming doctor appointment.'
      ],
      rawExtractedText: `Cardio Health Clinic... Total Cholesterol 215, LDL 135, HDL 52...`,
      analyzedAt: new Date().toISOString(),
      isLocalGemmaMode: true
    }
  }
];
