import { SampleReportPreset } from '../types/report';

export const SAMPLE_REPORTS: SampleReportPreset[] = [
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
  },
  {
    id: 'metabolic-panel',
    title: 'Comprehensive Metabolic Panel (CMP)',
    category: 'General Health',
    description: 'Evaluates electrolyte balance, kidney function, liver enzymes, and blood glucose.',
    fileName: 'CMP_Report_Lab.pdf',
    fileContent: `METROPOLITAN GENERAL DIAGNOSTICS
COMPREHENSIVE METABOLIC PANEL (CMP)
Date: 2026-07-01

Glucose (Fasting):    104 mg/dL    (Ref: 70 - 99 mg/dL)    BORDERLINE HIGH
BUN:                  16 mg/dL     (Ref: 7 - 20 mg/dL)     NORMAL
Creatinine:           0.9 mg/dL    (Ref: 0.6 - 1.2 mg/dL)  NORMAL
eGFR:                 98 mL/min    (Ref: > 60 mL/min)      NORMAL
Sodium:               139 mmol/L   (Ref: 135 - 145 mmol/L) NORMAL
Potassium:            4.2 mmol/L   (Ref: 3.5 - 5.1 mmol/L) NORMAL
Chloride:             101 mmol/L   (Ref: 96 - 106 mmol/L)  NORMAL
Calcium:              9.4 mg/dL    (Ref: 8.5 - 10.2 mg/dL) NORMAL
ALT (SGPT):           24 U/L       (Ref: 7 - 56 U/L)       NORMAL
AST (SGOT):           22 U/L       (Ref: 8 - 48 U/L)       NORMAL`,
    presetResult: {
      reportTitle: 'Comprehensive Metabolic Panel (CMP)',
      reportDate: '2026-07-01',
      overallSummary: 'Your metabolic panel demonstrates excellent kidney function, normal liver enzymes, and balanced electrolytes. Fasting glucose is slightly above 99 mg/dL in the borderline zone.',
      importantFindings: [
        {
          id: 'f1',
          finding: 'Kidney indicators (Creatinine 0.9 mg/dL, BUN 16 mg/dL, eGFR 98) show healthy filtering capacity.',
          severity: 'success',
          iconType: 'check'
        },
        {
          id: 'f2',
          finding: 'Electrolyte balance (Sodium, Potassium, Chloride, Calcium) is in optimal standard range.',
          severity: 'success',
          iconType: 'check'
        },
        {
          id: 'f3',
          finding: 'Fasting Glucose (104 mg/dL) is slightly above the 99 mg/dL upper threshold for fasting normal limits.',
          severity: 'warning',
          iconType: 'alert'
        }
      ],
      detectedTests: [
        {
          id: 't1',
          testName: 'Fasting Glucose',
          result: '104',
          unit: 'mg/dL',
          referenceRange: '70 - 99',
          status: 'borderline',
          category: 'Metabolic'
        },
        {
          id: 't2',
          testName: 'Creatinine',
          result: '0.9',
          unit: 'mg/dL',
          referenceRange: '0.6 - 1.2',
          status: 'normal',
          category: 'Kidney'
        },
        {
          id: 't3',
          testName: 'eGFR',
          result: '98',
          unit: 'mL/min',
          referenceRange: '> 60',
          status: 'normal',
          category: 'Kidney'
        },
        {
          id: 't4',
          testName: 'Potassium',
          result: '4.2',
          unit: 'mmol/L',
          referenceRange: '3.5 - 5.1',
          status: 'normal',
          category: 'Electrolytes'
        },
        {
          id: 't5',
          testName: 'ALT (Liver Enzyme)',
          result: '24',
          unit: 'U/L',
          referenceRange: '7 - 56',
          status: 'normal',
          category: 'Liver'
        }
      ],
      medicalExplanations: [
        {
          id: 'e1',
          testName: 'Fasting Glucose',
          purpose: 'Measures blood sugar level after fasting.',
          plainLanguageExplanation: 'Blood sugar supply in circulation. 104 mg/dL is slightly above the strict 99 fasting limit.',
          educationalContext: 'Fasting glucose can temporarily fluctuate based on fasting length, stress, hydration, or sleep. An HbA1c test is often used to view 3-month averages.'
        },
        {
          id: 'e2',
          testName: 'Creatinine & eGFR',
          purpose: 'Measures kidney waste clearance effectiveness.',
          plainLanguageExplanation: 'Your kidneys filter waste smoothly.',
          educationalContext: 'A result of 0.9 mg/dL with eGFR 98 indicates very good kidney function.'
        }
      ],
      doctorQuestions: [
        'Does my fasting glucose level of 104 mg/dL warrant an HbA1c test?',
        'Could recent fasting length or evening food intake have influenced this blood glucose reading?',
        'Are there any specific dietary guidelines you suggest for blood sugar stability?'
      ],
      lifestyleGuidance: [
        'Focus on complex carbohydrates with high fiber content (whole grains, vegetables, quinoa).',
        'Maintain regular physical activity after meals to support natural insulin sensitivity.',
        'Stay well hydrated with fresh water throughout the day.',
        'Aim for consistent, restful sleep routines.',
        'Review these CMP results with your healthcare provider.'
      ],
      rawExtractedText: `Comprehensive Metabolic Panel... Glucose 104, Creatinine 0.9, eGFR 98...`,
      analyzedAt: new Date().toISOString(),
      isLocalGemmaMode: true
    }
  }
];
