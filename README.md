# MedExplain AI

**AI-Powered Medical Report Explainer** — Upload lab reports (PDF, PNG, JPG) or paste text, and get a plain-language explanation of your test results in English or Roman Urdu. Supports single report analysis and Before/After medicine comparison with trend tracking.

> ⚠️ **Not a diagnostic tool.** Educational explanations only — always consult a qualified healthcare professional for medical decisions.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [AI Analysis Pipeline](#ai-analysis-pipeline)
- [Language Support](#language-support)
- [Comparison Mode](#comparison-mode)
- [Privacy & Security](#privacy--security)
- [Development Plan](#development-plan)
- [License](#license)

---

## Overview

MedExplain AI is a full-stack application that bridges the gap between complex medical lab reports and patient understanding. It extracts text from uploaded medical documents (PDFs or images), cleans the extracted text, sends it to an AI model for analysis, and presents the results in a clear, organized dashboard with:

- **Overall Summary** — A plain-language overview of the report
- **Important Findings** — Key abnormalities or noteworthy results highlighted
- **Detected Tests** — All lab tests with results, reference ranges, and status indicators
- **Medical Explanations** — Each test explained in simple terms with educational context
- **Related Medications** — Educational information about medications commonly prescribed for abnormal results
- **Doctor Questions** — Suggested questions to ask your healthcare provider
- **Lifestyle Guidance** — General wellness recommendations

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Port 3000)                         │
│  React 19 + TypeScript + Vite + Tailwind CSS 4                      │
│  Express server (server.ts) for API proxy & SSR                     │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐   │
│  │ Upload   │→ │ Loading  │→ │Dashboard │  │ Settings/About/   │   │
│  │ Card     │  │ Screen   │  │(Results) │  │ Privacy Pages     │   │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP (POST /analyze)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Port 5000)                          │
│  Node.js + Express                                                  │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐   │
│  │ Upload   │→ │ Extract  │→ │ Clean    │→ │ AI Analysis        │   │
│  │ Middleware│  │ OCR/PDF  │  │ Text     │  │ (OpenRouter API)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┬──────────┘   │
│                                                        │              │
│  ┌──────────────────────────────────────────────────────┘              │
│  ▼                                                                     │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────────┐    │
│  │ Validate &   │→ │ Format Response  │→ │ Return to Frontend    │    │
│  │ Fallback     │  │ (JSON Schema)    │  │ + Cleanup Temp Files  │    │
│  └──────────────┘  └──────────────────┘  └───────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
   ┌────────────┐      ┌──────────────┐     ┌──────────────┐
   │ EasyOCR    │      │ pdf-parse    │     │ OpenRouter   │
   │ (Python)   │      │ (Node.js)    │     │ API (Cloud)  │
   │ Local OCR  │      │ PDF Text     │     │ Gemma 4      │
   │ for Images │      │ Extraction   │     │ AI Analysis  │
   └────────────┘      └──────────────┘     └──────────────┘
```

### AI Provider Fallback Chain

The frontend server (`server.ts`) implements a fallback chain for AI analysis:

1. **OpenRouter API** (primary) — Uses the configured Gemma model via OpenRouter's chat completions endpoint
2. **Google Gemini API** (fallback) — Uses `@google/genai` SDK with structured JSON output schema
3. **Local Pattern-Based Parser** (last resort) — Regex-based test detection and status classification, runs entirely offline

---

## Features

### ✅ Implemented

| Feature | Details |
|---------|---------|
| **File Upload** | PDF, PNG, JPG via drag-and-drop or file picker (up to 20 MB) |
| **Text Paste** | Directly paste report text for analysis |
| **OCR Extraction** | EasyOCR (Python) for image-based reports |
| **PDF Parsing** | pdf-parse for PDF documents with encrypted/corrupted handling |
| **Text Cleaning** | OCR noise removal, duplicate line deduplication, character fixes |
| **AI Analysis** | OpenRouter API with Gemma 4 model |
| **Multi-Language** | English and Roman Urdu (Urdu written in Latin script) |
| **Comparison Mode** | Before/After medicine report comparison with trend analysis |
| **Educational Medications** | Related medication classes for abnormal results |
| **Sample Reports** | Pre-loaded demo reports for 1-click testing |
| **Dashboard UI** | Summary, Findings, Lab Results Table, Explanations, Medications, Questions, Guidance |
| **Error Handling** | Friendly error screens with retry for unsupported files, unreadable reports, OCR failures, AI unavailability |
| **Settings** | OpenRouter API key and model configuration (persisted to localStorage) |
| **Privacy Pages** | About, Privacy Policy, and Settings views |
| **File Cleanup** | Temporary uploaded files deleted after processing |
| **Structured Logging** | Timestamped logs with metadata (never report contents) |

### 🚧 Planned (per Development Plan)

- Accessibility pass (contrast, focus states, keyboard nav)
- Security hardening (path traversal, MIME sniffing)
- End-to-end testing with sample reports

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | Runtime |
| **Express 4.19** | HTTP server & routing |
| **Multer** | File upload handling with MIME validation |
| **pdf-parse** | PDF text extraction |
| **node-fetch** | HTTP requests to OpenRouter API |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |
| **Python 3.9+** | EasyOCR runtime |
| **EasyOCR** | Optical character recognition for images |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Lucide React** | Icon library |
| **Motion** | Animation library (Framer Motion) |
| **Express** | Production server & API proxy |
| **@google/genai** | Google Gemini API SDK |
| **esbuild** | Production build bundling |

---

## Project Structure

```
medexplain-ai/
├── README.md                          # This file
├── .gitignore
│
├── backend/                           # Express API server
│   ├── app.js                         # Express app setup (CORS, routes, error handling)
│   ├── server.js                      # Server entry point
│   ├── package.json
│   ├── .env                           # Environment variables
│   ├── config/
│   │   └── config.js                  # Centralized configuration
│   ├── controllers/
│   │   └── analyzeController.js       # Orchestrates full analysis pipeline
│   ├── middleware/
│   │   ├── upload.js                  # Multer file upload with validation
│   │   └── errorHandler.js            # Centralized error handling
│   ├── routes/
│   │   ├── analyze.js                 # POST /analyze
│   │   ├── health.js                  # GET /health, GET /ai/status
│   │   └── upload.js                  # POST /upload
│   ├── services/
│   │   ├── ocrService.js              # EasyOCR integration (child_process)
│   │   ├── pdfService.js              # PDF text extraction
│   │   ├── textCleaner.js             # OCR noise removal & text cleaning
│   │   ├── openRouterService.js       # OpenRouter API integration
│   │   └── responseValidator.js       # JSON schema validation & fallback
│   ├── prompts/
│   │   └── systemPrompt.js            # AI system prompt builder
│   ├── utils/
│   │   ├── logger.js                  # Structured logging
│   │   └── fileCleaner.js             # Temporary file deletion
│   ├── services/ocr/
│   │   └── ocr_script.py              # Python EasyOCR script
│   └── uploads/                       # Temporary upload directory
│
├── frontend/                          # React SPA
│   ├── index.html                     # HTML entry point
│   ├── server.ts                      # Express server (API proxy + AI analysis)
│   ├── vite.config.ts                 # Vite configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── package.json
│   ├── .env                           # Environment variables
│   ├── metadata.json
│   ├── src/
│   │   ├── main.tsx                   # React entry point
│   │   ├── App.tsx                    # Main app component with state management
│   │   ├── index.css                  # Global styles (Tailwind)
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Top navigation bar
│   │   │   ├── HeroSection.tsx        # Landing hero with CTA
│   │   │   ├── UploadCard.tsx         # File upload & text paste card
│   │   │   ├── LoadingScreen.tsx      # Analysis progress animation
│   │   │   ├── Dashboard.tsx          # Results dashboard container
│   │   │   ├── SummaryCard.tsx        # Overall summary display
│   │   │   ├── FindingsCard.tsx       # Important findings list
│   │   │   ├── LabResultsTable.tsx    # Detected tests table
│   │   │   ├── TermExplanations.tsx   # Medical term explanations
│   │   │   ├── MedicationsCard.tsx    # Related medications info
│   │   │   ├── DoctorQuestions.tsx    # Suggested doctor questions
│   │   │   ├── LifestyleGuidance.tsx  # Wellness recommendations
│   │   │   ├── DisclaimerCard.tsx     # Medical disclaimer
│   │   │   ├── PrivacyCard.tsx        # Privacy information
│   │   │   ├── ErrorScreen.tsx        # Error display with retry
│   │   │   ├── EmptyState.tsx         # Empty state placeholder
│   │   │   ├── ModalsAndPages.tsx     # About, Privacy, Settings views
│   │   │   └── VoiceInputButton.tsx   # Voice input component
│   │   ├── services/
│   │   │   └── api.ts                 # Backend API client
│   │   ├── types/
│   │   │   └── report.ts              # TypeScript type definitions
│   │   └── data/
│   │       └── sampleReports.ts       # Sample report presets for demo
│   └── assets/                        # Static assets
│
├── docs/
│   └── DEVELOPMENT_PLAN.md            # Detailed development plan & task tracking
│
└── sample-reports/                    # Demo medical reports
    ├── before-med.jpeg                # Before medicine report (image)
    ├── after-med.jpeg                 # After medicine report (image)
    └── MedicsPlanAI_Hepatitis_Report.pdf  # Sample PDF report
```

---

## Prerequisites

- **Node.js 18+** (with npm)
- **Python 3.9+** (for EasyOCR — required for image-based reports)
- **OpenRouter API key** (free tier available at [openrouter.ai/keys](https://openrouter.ai/keys))
- **(Optional) Google Gemini API key** — for fallback AI provider

---

## Setup & Installation

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set your OPENROUTER_API_KEY

# Install Python dependencies (for OCR — required for image uploads)
pip install -r services/ocr/requirements.txt

# Start development server (with auto-reload)
npm run dev
```

The backend server starts on **http://localhost:5000**.

Verify it's running:

```bash
curl http://localhost:5000/health
# → {"status":"ok","app":"MedExplain AI","timestamp":"..."}

curl http://localhost:5000/ai/status
# → {"configured":true,"model":"google/gemma-4-31b-it:free","reachable":true}
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment
# Edit frontend/.env with your API keys (optional — can also be set in-app)

# Start development server
npm run dev
```

The frontend server starts on **http://localhost:3000**.

For production build:

```bash
npm run build
npm start
```

---

## Configuration

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `NODE_ENV` | `development` | Environment mode |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | CORS allowed origin |
| `OPENROUTER_API_KEY` | — | **Required.** OpenRouter API key |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` | OpenRouter API base URL |
| `OPENROUTER_MODEL` | `google/gemma-4-31b-it:free` | AI model for analysis |
| `OPENROUTER_TIMEOUT_MS` | `25000` | AI request timeout (ms) |
| `OPENROUTER_SITE_URL` | `http://localhost:5173` | OpenRouter attribution URL |
| `OPENROUTER_SITE_NAME` | `MedExplain AI` | OpenRouter attribution name |
| `MAX_UPLOAD_SIZE_MB` | `20` | Maximum file upload size (MB) |
| `UPLOAD_DIR` | `./uploads` | Temporary upload directory |
| `PYTHON_PATH` | `python` | Python executable path |
| `EASYOCR_LANGUAGES` | `en` | OCR language codes (comma-separated) |
| `OCR_TIMEOUT_MS` | `20000` | OCR process timeout (ms) |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENROUTER_API_KEY` | — | OpenRouter API key (can also be set in-app via Settings) |
| `OPENROUTER_MODEL` | `google/gemma-2-9b-it` | Default OpenRouter model |
| `GEMINI_API_KEY` | — | Google Gemini API key (fallback provider) |
| `NODE_ENV` | `development` | Environment mode |
| `VITE_BACKEND_URL` | `http://localhost:5000` | Backend API URL (for direct frontend→backend communication) |

---

## API Reference

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "app": "MedExplain AI",
  "timestamp": "2026-07-25T10:00:00.000Z"
}
```

### `GET /ai/status`

Check AI provider configuration and reachability.

**Response:**
```json
{
  "configured": true,
  "model": "google/gemma-4-31b-it:free",
  "reachable": true
}
```

### `POST /upload`

Upload a medical report file.

**Request:** `multipart/form-data`
- `file`: PDF, PNG, or JPG file (max 20 MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "uuid",
    "fileName": "timestamp-random-filename.pdf",
    "originalName": "my_report.pdf",
    "sizeBytes": 123456,
    "mimeType": "application/pdf",
    "status": "uploaded"
  }
}
```

### `POST /analyze`

Analyze a medical report — accepts file upload, text paste, or both. Supports single report and Before/After comparison mode.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | No | Current report file (PDF/PNG/JPG) |
| `text` | String | No | Raw report text (alternative to file) |
| `fileName` | String | No | Custom filename for display |
| `previousFile` | File | No | Previous report file (comparison mode) |
| `previousText` | String | No | Previous report text (comparison mode) |
| `previousFileName` | String | No | Custom filename for previous report |
| `language` | String | No | `"en"` (default) or `"ur-roman"` |
| `isComparison` | String | No | `"true"` to enable comparison mode |

**Response (success):**
```json
{
  "success": true,
  "data": {
    "reportTitle": "Complete Blood Count (CBC) Report",
    "reportDate": "7/25/2026",
    "overallSummary": "Your report shows...",
    "comparisonSummary": "Comparison between initial and follow-up reports...",
    "importantFindings": [
      {
        "id": "f1",
        "finding": "Hemoglobin level is below the normal reference range.",
        "severity": "warning",
        "iconType": "alert"
      }
    ],
    "detectedTests": [
      {
        "id": "t1",
        "testName": "Hemoglobin (HGB)",
        "result": "10.2",
        "beforeResult": "9.8",
        "referenceRange": "12.0 - 16.0",
        "unit": "g/dL",
        "status": "abnormal",
        "trend": "improved",
        "category": "Hematology"
      }
    ],
    "medicalExplanations": [
      {
        "id": "e1",
        "testName": "Hemoglobin (HGB)",
        "purpose": "Measures oxygen-carrying capacity of blood",
        "plainLanguageExplanation": "Hemoglobin is a protein in red blood cells...",
        "educationalContext": "Low hemoglobin (anemia) can cause fatigue..."
      }
    ],
    "relatedMedications": [
      {
        "id": "m1",
        "category": "Anemia Management",
        "medicationClass": "Iron Supplements",
        "purpose": "Iron supplements help increase hemoglobin production...",
        "disclaimer": "Must be prescribed by a physician"
      }
    ],
    "doctorQuestions": [
      "What do these specific lab test results indicate regarding my current health status?"
    ],
    "lifestyleGuidance": [
      "Maintain adequate hydration throughout the day."
    ],
    "rawExtractedText": "...",
    "analyzedAt": "2026-07-25T10:00:00.000Z",
    "modelUsed": "OpenRouter (google/gemma-4-31b-it:free)",
    "language": "en",
    "isComparison": false
  }
}
```

**Response (error):**
```json
{
  "success": false,
  "error": {
    "code": "UNREADABLE_REPORT",
    "message": "We could not read any text from this file. Please try a clearer image or PDF."
  }
}
```

#### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NO_INPUT` | 400 | No file or text provided |
| `UNSUPPORTED_FILE_TYPE` | 400 | File format not supported |
| `UNREADABLE_REPORT` | 422 | No text could be extracted |
| `OCR_TIMEOUT` | 504 | OCR process timed out |
| `OCR_FAILED` | 422 | OCR could not read the image |
| `OCR_SERVICE_ERROR` | 500 | OCR service unavailable |
| `PDF_ENCRYPTED` | 422 | PDF is password-protected |
| `PDF_CORRUPTED` | 422 | PDF file is corrupted |
| `PDF_PARSE_ERROR` | 422 | Could not parse PDF |
| `AI_NOT_CONFIGURED` | 503 | No API key configured |
| `AI_TIMEOUT` | 504 | AI analysis timed out |
| `AI_API_ERROR` | 502 | AI service returned an error |
| `ANALYSIS_FAILED` | 500 | Unexpected error |

---

## AI Analysis Pipeline

The analysis follows a 6-step pipeline:

### Step 1: Upload & Validation
Files are validated for MIME type (PDF, PNG, JPG), extension, and size (max 20 MB). Filenames are sanitized to prevent path traversal. Files are stored temporarily in `backend/uploads/`.

### Step 2: Text Extraction
- **PDF files** → `pdfService.js` uses `pdf-parse` to extract text. Handles encrypted and corrupted PDFs with specific error codes.
- **Image files** (PNG/JPG) → `ocrService.js` spawns a Python child process running EasyOCR. Supports configurable languages (default: English). Returns extracted text with per-item confidence scores.
- **Raw text** → Used directly without extraction.

### Step 3: Text Cleaning
`textCleaner.js` processes the extracted text:
- Removes null bytes and control characters
- Collapses multiple spaces and excessive newlines
- Filters out lines that are only whitespace or punctuation
- Removes single-character OCR artifacts
- Deduplicates consecutive identical lines
- Fixes common OCR character swaps (pipe → I, removes ® symbols)
- Trims all lines

### Step 4: AI Analysis
`openRouterService.js` sends the cleaned text to OpenRouter's `/chat/completions` endpoint:
- **System Prompt**: Built by `systemPrompt.js` — configures the AI's role as a compassionate medical explainer, sets language (English/Roman Urdu), and enables comparison mode if applicable.
- **User Prompt**: Contains the report text with instructions to return valid JSON matching the required schema.
- **Model**: Configurable via `OPENROUTER_MODEL` (default: `google/gemma-4-31b-it:free`)
- **Temperature**: 0.3 (low creativity for consistent structured output)
- **Max Tokens**: 4096
- **Response Format**: `json_object` (enforced via API parameter)

### Step 5: Validation & Formatting
`responseValidator.js` validates the AI response:
- Checks for all required top-level fields
- Validates `detectedTests` array structure and required sub-fields
- Ensures arrays for `importantFindings`, `medicalExplanations`, `relatedMedications`
- Provides default `doctorQuestions` and `lifestyleGuidance` if missing (in both English and Roman Urdu)
- Appends medical disclaimer to `overallSummary` if not present
- Sanitizes `status` values to `normal`/`borderline`/`abnormal`
- Sanitizes `trend` values to `improved`/`stable`/`worsened`
- Falls back to a safe `buildFallbackResponse()` if validation fails

### Step 6: Cleanup & Response
Temporary uploaded files are deleted. The validated result is returned to the frontend as JSON.

---

## Language Support

### English (`language: "en"`)
All output text (summary, findings, explanations, questions, guidance) is produced in clear, simple, reassuring English. Medical test names and medication drug names remain in standard Latin alphabet.

### Roman Urdu (`language: "ur-roman"`)
All output text is produced in Roman Urdu — Urdu written using Latin script (e.g., "Cholesterol kam karne ke liye Statins dawaiyan di jaati hain."). Medical test names and medication drug names remain in standard Latin alphabet. This makes medical information accessible to Urdu speakers who may not be comfortable with the Urdu script or English medical terminology.

---

## Comparison Mode

When enabled, the system accepts **two** reports:
1. **Initial Report** (Before Medicine/Treatment)
2. **Follow-up Report** (After Medicine/Treatment)

The AI compares both reports and:
- Matches test items across both reports by name
- Compares Before vs After values for each test
- Assigns a **trend** to each test:
  - `"improved"` — Value moved toward healthy normal range
  - `"stable"` — No significant change
  - `"worsened"` — Value moved further into abnormal territory
- Generates a **comparisonSummary** evaluating treatment efficacy
- Includes `beforeResult` in each test item for side-by-side comparison

---

## Privacy & Security

### Data Handling
- **OCR runs locally** — Image text extraction happens on your machine via EasyOCR (Python). No image data leaves your device.
- **AI analysis is cloud-based** — Extracted report text is sent to OpenRouter's API for analysis. This is a necessary trade-off for using cloud AI models.
- **Temporary files are deleted** — Uploaded files are stored temporarily in `backend/uploads/` and deleted immediately after processing (success or error).
- **No database storage** — The application does not store reports, analysis results, or user data in any database. All data exists only in memory during the request lifecycle.
- **Logging is metadata-only** — The structured logger (`utils/logger.js`) records timestamps, durations, file names, and error codes — never the contents of a medical report.

### Security Measures
- **Filename sanitization** — Uploaded filenames are sanitized to remove path separators, null bytes, and dangerous characters.
- **MIME type validation** — Only PDF, PNG, and JPG files are accepted.
- **File size limits** — Maximum upload size is configurable (default: 20 MB).
- **CORS protection** — Only the configured frontend origin is allowed.
- **No eval or dynamic code execution** — AI responses are parsed as JSON only.

---

## Development Plan

See [`docs/DEVELOPMENT_PLAN.md`](docs/DEVELOPMENT_PLAN.md) for the full task breakdown, build order, and implementation status. The plan is organized into phases:

| Phase | Description | Status |
|-------|-------------|--------|
| **A** | Backend Foundation (Express, health routes) | ✅ Complete |
| **B** | Upload Pipeline (Multer, validation, file cleanup) | ✅ Complete |
| **C** | Text Extraction (PDF parser, OCR, text cleaning) | ✅ Complete |
| **D** | AI Integration (Prompts, OpenRouter, validation) | ✅ Complete |
| **E** | Analyze Endpoint (Controller, error handling) | ✅ Complete |
| **F** | Frontend Foundation (Vite, React, Tailwind, API layer) | ✅ Complete |
| **G** | Results Experience (Dashboard, cards, error screens) | ✅ Complete |
| **H** | Hardening & Polish (Accessibility, security, testing) | 🔄 In Progress |

---

## Sample Reports

The `sample-reports/` directory contains demo medical reports for testing:

- **`before-med.jpeg`** — Initial report image (Before Medicine)
- **`after-med.jpeg`** — Follow-up report image (After Medicine)
- **`MedicsPlanAI_Hepatitis_Report.pdf`** — Sample PDF report

These can be loaded directly from the frontend's "Try a Sample Report" feature for a 1-click demo experience.

---

## License

This project is for educational purposes. See the repository for license details.