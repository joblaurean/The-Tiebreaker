# The Tiebreaker: Enterprise Edition

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Quantitative Decision Support System (DSS) engineered for Data Analysts, Technical Leads, and Project Managers.** Transforms high-stakes strategic dilemmas into structured, multi-criteria weighted matrices backed by verifiable data sources, dynamic sensitivity (*what-if*) stress testing, and stakeholder-ready executive dossiers.

---

## 📋 Executive Overview

In enterprise architecture and corporate strategy, critical choices cannot rely on subjective intuition or superficial pros and cons lists. **The Tiebreaker: Enterprise Edition** introduces a rigorous mathematical framework grounded in **Multi-Criteria Decision Analysis (MCDA)**.

The platform empowers teams to:
- Formulate technical, financial, operational, and strategic criteria with strict percentage weighting ($\sum W_i = 100\%$).
- Ground evaluations in empirical telemetry (SLA commitments, TCO, latency benchmarks, CAC) and verifiable sources of truth (Data Warehouses, APMs, ERPs).
- Evaluate decision resilience under shifting business priorities via interactive what-if simulations and tipping-point detection.
- Deliver defensible recommendations to executive committees, boards, and Architecture Review Boards (ARBs) through automated executive briefs.

---

## ⚡ Core Features

### 1. Multi-Criteria Decision Analysis (MCDA) Weighted Matrix
- **Customizable Dimension Taxonomy:** Categorize evaluation criteria into strategic buckets (*Financial, Technical, Operational, Strategic*).
- **Real-Time Weight Normalization:** Interactive weighting distribution dynamically balanced to guarantee a strict 100% total.
- **Deterministic Scoring Engine:** Standardized [1–10] performance rating per criterion with automated composite weighted calculations:
  $$\text{Score}(A_j) = \sum_{i=1}^{n} \left( W_i \times S_{ij} \right)$$
- **Governance Metrics:** Instant calculation of the **Stability Index** and **Margin of Victory** against runner-up alternatives.

### 2. Sensitivity Analysis Module (*What-If Scenarios*)
- **Dynamic Criterion Stress-Testing:** Real-time sliders that redistribute remaining weights proportionally to simulate shifts in corporate priority.
- **Tipping Point Detection:** Algorithmic calculation of the precise weight threshold where a competitor overtakes the recommended leader.
- **Delta Impact Visualization:** Visual telemetry of score sensitivity ($\Delta\%$) across market fluctuations or budget reallocations.

### 3. Quantitative Evidence & Data Grounding
- **Operational Metrics Association:** Direct linkage of verifiable key metrics (e.g., *99.99% Availability SLA*, *12,500 ops/sec Throughput*, *Annual TCO*).
- **Declared Systems of Record:** Audit-ready citation of source platforms (*Snowflake, Datadog, Jira, AWS Cost Explorer, Salesforce, FinOps Dashboards*).
- **Metrological Confidence Ratings:** Data credibility classification (*High, Medium, Low*), eliminating confirmation bias and stale data.

### 4. Executive Dossier & Stakeholder Reporting
- **Boardroom-Ready Brief:** Structured executive memo containing:
  - Definitive strategic recommendation with quantitative justification.
  - Mitigated risk analysis and key architectural trade-offs.
  - Comparative criteria scorecard and audit trail.
- **Clean Print & PDF Export:** Dedicated print stylesheet (`@media print`) designed for one-click executive PDF generation.

### 5. Global Enterprise Multi-Language Support (i18n)
- **6 Supported Languages:** English (`en`, default), Spanish (`es`), Portuguese (`pt`), French (`fr`), German (`de`), and Simplified Chinese (`zh`).
- **Seamless UI Selector:** Accessible dropdown in the navigation bar with flag badges, language codes, and active checkmarks.
- **Instant Global Reactivity:** Immediate component re-rendering powered by React Context and persistent user preference storage in `localStorage`.
- **Multilingual AI Inference:** Backend Gemini inference prompts automatically align with the selected language for localized corporate rationale.

---

## 🛠️ Technology Stack

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Concurrent UI rendering and high-performance reactive state management. |
| **Type Safety** | **TypeScript 5.x** | Strict typings across decision matrices, sensitivity algorithms, and schema definitions. |
| **Styling & Design System** | **Tailwind CSS v4** | Clean, high-density Business Intelligence (BI) dashboard design tokens. |
| **Iconography** | **Lucide React** | Analytical and enterprise-grade UI icons. |
| **Server & Proxy** | **Express 4.21 + TSX** | Secure backend proxy routing and static asset delivery. |
| **AI Inference** | **@google/genai (Gemini 2.5 Flash)** | Contextual domain modeling with structured JSON output constraints. |
| **Build & Bundler** | **Vite 8** | High-velocity build pipeline with optimized production bundling. |
| **Unit Testing** | **Node.js Native Test Runner** (`node:test`) | Sub-second unit test execution for core mathematical engines. |

---

## 📂 Project Structure

```text
├── server.ts                   # Express server, secure Gemini proxy, Vite middleware integration
├── index.html                  # HTML entry point with metadata, fonts, and OpenGraph tags
├── metadata.json               # Applet capabilities and runtime permissions
├── package.json                # Dependencies, lifecycle scripts, and test definitions
├── vite.config.ts              # Vite 8 and Tailwind CSS v4 compiler configuration
│
├── src/
│   ├── main.tsx                # React application bootstrapping
│   ├── App.tsx                 # Core application controller, state management, and tab routing
│   ├── index.css               # Global CSS and Tailwind CSS v4 imports
│   │
│   ├── components/
│   │   └── enterprise/
│   │       ├── EnterpriseNavbar.tsx        # Responsive navigation bar (Desktop/Mobile optimized)
│   │       ├── EnterpriseForm.tsx          # Quantitative decision form & preset industry scenarios
│   │       ├── EnterpriseHeaderKpis.tsx    # High-level BI KPI cards (Leader, Stability, Margin)
│   │       ├── WeightedMatrixView.tsx      # Interactive weighted decision matrix
│   │       ├── SensitivityView.tsx         # What-If scenario simulator & tipping-point charts
│   │       ├── DataEvidenceView.tsx        # Metric traceability grid and systems of record
│   │       ├── ExecutiveReportView.tsx     # Stakeholder executive dossier with PDF export
│   │       └── EnterpriseHistoryDrawer.tsx # Local session evaluation history and recovery
│   │
│   ├── types/
│   │   ├── enterprise.ts       # Domain contracts for criteria, alternatives, metrics, and dossiers
│   │   └── decision.ts         # Base legacy decision types
│   │
│   └── utils/
│       ├── enterpriseDecision.ts       # Mathematical MCDA algorithms and weight normalization
│       ├── enterpriseDecision.test.ts  # Test suite verifying MCDA formulas and tie detection
│       ├── decisionCalculations.ts     # Sensitivity modeling and stability calculations
│       └── decisionCalculations.test.ts # Test suite verifying tipping points and deltas
```

---

## 🚀 Local Installation & Setup

### Prerequisites
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0

### Step-by-Step Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/the-tiebreaker-enterprise.git
   cd the-tiebreaker-enterprise
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create your local `.env` configuration from the provided template:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   APP_URL="http://localhost:3000"
   ```

4. **Run automated unit tests:**
   ```bash
   npm test
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` in your web browser.

6. **Build for production deployment:**
   ```bash
   npm run build
   ```

---

## 💡 Quick Start Guide

1. **Frame the Dilemma & Candidates:**
   - Define the decision topic (e.g., *«Data Lakehouse Migration: Snowflake vs. Databricks vs. BigQuery»*).
   - Enter strategic context, target OKRs, and candidate alternatives.
   - *Pro-Tip:* Select one of the built-in **Industry Presets** to immediately explore pre-populated models.

2. **Calibrate the Weighted Matrix:**
   - Adjust criterion weights based on corporate priorities (normalized dynamically to 100%).
   - Score each alternative's performance from 1 to 10 across all dimensions.

3. **Simulate What-If Scenarios:**
   - Open the **Sensitivity Analysis** tab and stress-test individual criteria weights with the sliders.
   - Observe whether the leader holds or crosses a tipping point under budget or operational constraints.

4. **Verify Metrics & Grounding:**
   - Inspect the **Data Evidence** tab to validate empirical metrics, declared sources, and confidence levels.

5. **Export the Executive Brief:**
   - Review the synthesized executive recommendation and generate a clean committee handout using **Print / Save as PDF**.

---

## 🧪 Automated Testing

The codebase employs Node.js's native test runner (`node:test`) for instantaneous validation of mathematical functions and scoring integrity without overhead:

```bash
npm run test
```

Test coverage includes:
- Strict normalization and preservation of criteria weight totals ($\sum W_i = 100\%$).
- Mathematical accuracy of multi-criteria composite scores.
- Threshold detection for technical ties ($\Delta \le 0.35$).
- Tipping point convergence calculations under sensitivity variations.

---

## 🤝 Contributing

Contributions to advance the quantitative decision framework are welcome. To contribute:

1. Fork the repository.
2. Create a dedicated feature branch (`git checkout -b feature/ahp-pairwise-matrices`).
3. Implement your changes, ensuring all unit tests pass (`npm test && npm run lint`).
4. Commit your work following [Conventional Commits](https://www.conventionalcommits.org/) standards:
   ```bash
   git commit -m "feat: add analytic hierarchy process (AHP) pairwise comparison"
   ```
5. Push the branch (`git push origin feature/ahp-pairwise-matrices`).
6. Submit a detailed Pull Request outlining the problem solved and test validation.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
