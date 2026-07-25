# MedExplain AI — Development Plan

Derived from PRD v1.0 (Parts 1, 2, 3, 5). Tasks are ordered so each one
builds on a working previous task without breaking it. We implement,
verify, then move to the next.

> **Architecture change from the original PRD:** OCR is now **EasyOCR**
> (Python, invoked from Node via `child_process`) instead of Tesseract.js,
> and report explanation now calls **OpenRouter's cloud API** (Gemma 4)
> instead of a local Ollama instance. This means the app is no longer
> fully offline — extracted report text is sent to OpenRouter for
> analysis. OCR itself still runs locally. PRD sections describing an
> "offline-first" / "no data leaves the device" architecture (§9, §36,
> §51, Feature 9) should be read with this exception in mind.

## Phase A — Backend Foundation
- [x] **A1. Project scaffold** — folder structure per §38, root `package.json`
  scripts, `.env.example`, `.gitignore`, README stub.
- [ ] **A2. Express app skeleton** — `app.js`/`server.js`, JSON body parsing,
  CORS, centralized error handler, request logger (`utils/logger.js`).
- [x] **A3. Health & AI status routes** — `GET /health`, `GET /ai/status`
  (§48, §90, adapted) with an `aiService` that checks the OpenRouter API
  key and reachability instead of a local Ollama daemon.

## Phase B — Upload Pipeline
- [ ] **B1. Upload middleware** — multer config, MIME/type/size validation,
  filename sanitization, temp storage in `backend/uploads/` (§19, §26, §30, §50).
- [ ] **B2. `POST /upload` route + controller** — returns Upload ID, filename,
  status; rejects disallowed formats with the exact error copy from §27.
- [ ] **B3. File Cleaner utility** — deletes temp files after processing
  or on error (§29, §30, §47).

## Phase C — Text Extraction
- [ ] **C1. PDF Parser service** — `pdf-parse` based extraction, page
  concatenation, corrupted/encrypted PDF handling (§21, §26).
- [ ] **C2. OCR service** — EasyOCR (Python) integration for JPG/PNG, called
  from Node via `child_process`; handles rotated/low-quality images (§20).
  Requires `pip install -r backend/services/ocr/requirements.txt`.
- [ ] **C3. Text Cleaning Engine** — strips extra spaces, broken characters,
  duplicate lines, OCR noise (§6 of Part 2, §17 Step 6).

## Phase D — AI Integration
- [ ] **D1. Medical Report Analyzer / Parser** — detects report type
  (CBC, Lipid, LFT, KFT, Thyroid, etc.) and candidate lab values (§17 Step 4).
- [ ] **D2. Prompt Builder** — assembles the Master System Prompt (§83) +
  Medical Report Prompt (§85) with role/task/rules/report/format/safety
  sections (§43).
- [ ] **D3. OpenRouter Service** — calls OpenRouter's `/chat/completions`
  with the configured Gemma 4 model (`OPENROUTER_MODEL`), JSON-only
  output, timeout handling, and `OPENROUTER_API_KEY` from env.
- [ ] **D4. Response Formatter & Validator** — validates the model's JSON
  against the required schema (§86), enforces disclaimer presence,
  hallucination-prevention fallback text (§88).

## Phase E — Analyze Endpoint (ties B+C+D together)
- [ ] **E1. `POST /analyze` route + controller** — orchestrates
  extract → clean → parse → prompt → Ollama → validate → respond (§41, §42).
- [ ] **E2. Error handling pass** — maps OCR/PDF/Ollama/timeout failures to
  the standard `{ success:false, error:{code,message} }` shape (§45, §91).

## Phase F — Frontend Foundation
- [ ] **F1. Vite + React + Tailwind scaffold** — base layout, router, design
  tokens (per frontend-design principles, grounded in a calm/clinical-trust
  visual identity rather than generic templates).
- [ ] **F2. API service layer** — `services/api.js` wrapping `/upload` and
  `/analyze` with Axios.
- [ ] **F3. Landing + Upload pages** — drag/drop upload card, supported
  formats, privacy notice (§17 Step 1–2).

## Phase G — Results Experience
- [ ] **G1. Loading screen** — progress states (uploading → extracting →
  analyzing).
- [ ] **G2. Dashboard + cards** — Summary, Important Findings, Abnormal
  Values, Medical Terms, Doctor Questions, Lifestyle, Disclaimer (§23, §39).
- [ ] **G3. Error screen** — friendly messages per §27/§91, retry action.

## Phase H — Hardening & Polish
- [ ] **H1. Accessibility pass** — contrast, focus states, keyboard nav,
  responsive check (§31).
- [ ] **H2. Security pass** — path traversal checks, MIME sniffing, file
  cleanup verification (§30, §50).
- [ ] **H3. End-to-end demo pass** — sample reports in `sample-reports/`,
  full offline run-through, timing against §32 performance targets.

---
**Working agreement:** each task above is implemented fully, kept runnable,
and never silently breaks a prior task. If a later task requires changing
earlier code, that change is called out explicitly rather than made
incidentally.
