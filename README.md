# JanSetu (जनसेतु) — Bridge of the People

**Multilingual AI Digital Public Infrastructure (DPI) for India**

JanSetu is a Digital Public Good (DPG) that enables citizens to report local infrastructure needs — broken roads, contaminated water, power outages, healthcare gaps, school deficiencies — via voice, text, photo, WhatsApp, or toll-free IVR in **13 Indian languages**. Reports are geospatially clustered, priority-scored with a transparent algorithm, and surfaced to policymakers with AI-assisted decision tools.

> "Aapki awaaz, desh ki priority." — Your voice, the nation's priority.

---

## Features

### Citizen Ingestion Channels
- **PWA Voice & Photo** — On-device speech-to-text + computer vision severity analysis
- **WhatsApp Bot Simulator** — Webhook-based grievance intake
- **SMS / IVR Feature Phone Fallback** — Toll-free 1800-JAN-SETU for non-smartphone users
- **Diaspora Proxy Filing** — Migrant workers file for their home village with micro-funding pledges
- **Participatory Micro-Budgeting** — Resident token allocation to rank local priorities

### Policymaker Dashboard
- **Live Leaflet Map** — DBSCAN geo-clustered demand hotspots with priority-scored markers
- **Transparent Priority Scoring Engine** — Adjustable weight sliders for population, severity, infra gap, equity, cost efficiency, and duplicate discount
- **Equity Lens Mode** — +35% multiplier for low-HDI / tribal / marginalized census blocks
- **Disaster Triage Mode** — Re-weights formula for emergency response prioritization
- **Cost-of-Inaction Live Ledger** — Ticking counter showing accrued economic cost of delay
- **AI DPR Brief Generator** — Automated Detailed Project Report drafts
- **AI Steelman Debate** — Adversarial dual-agent argumentation over project trade-offs
- **Digital Twin Impact Simulator** — Budget allocation slider with projected outcomes
- **RAG Policymaker Copilot** — Grounded chatbot over fused citizen + census + scheme data
- **Panchayat Elder Audio Mode** — Vernacular oral-story copilot for local governance

### Governance & Transparency
- **Public Transparency Portal** — Open aggregate view of all hotspots, budgets, and status
- **Constituency Report Cards** — MP / MLA / Ward Councillor responsiveness scorecards
- **Corruption X-Ray Auditor** — AI cross-check of contractor photos vs. satellite imagery
- **Tamper-Evident Audit Trail** — Cryptographic hash-chained ledger of every system action

### Privacy & Compliance
- **DPDP Act 2023 Compliant** — Edge-device PII scrubbing (phone, Aadhaar, PAN, name redaction)
- **On-Device Audio Processing** — Voice data minimized at source

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS 3 (dark mode, custom gov/India color tokens) |
| Build | Vite 5 |
| Maps | Leaflet (CartoDB Dark Matter tiles) |
| Icons | Lucide React |
| Linter | Oxlint |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/jansetu-dpi.git
cd jansetu-dpi

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── assets/              # Static assets (hero image)
├── components/
│   ├── common/          # Shared components (Header)
│   ├── dashboard/       # Policymaker dashboard & AI tools
│   ├── governance/      # Public portal, audit trail, scorecards, corruption
│   └── ingestion/       # Citizen intake forms & channel simulators
├── data/                # Seed data (hotspots, reports, schemes, corruption cases)
├── services/
│   ├── ai/              # Language pipeline, CV, RAG copilot, steelman debate, elder story
│   ├── audit/           # Hash chain audit trail
│   ├── clustering/      # DBSCAN spatial clustering & priority scoring engine
│   └── storage/         # Offline queue (localStorage)
├── types/               # TypeScript interfaces & type definitions
├── App.tsx              # Root application component
├── main.tsx             # Entry point
└── index.css            # Global styles & Leaflet overrides
```

---

## Architecture Overview

1. **Ingest** — Citizens submit reports via PWA, WhatsApp, SMS/IVR, or diaspora proxy in their native language
2. **Scrub** — DPDP Act 2023 PII scrubber removes phone, Aadhaar, PAN, and name entities on-device
3. **Translate** — Multilingual NLP pipeline detects language, translates to English, and extracts intent (category, urgency, sentiment, affected population)
4. **Cluster** — DBSCAN spatial fusion engine groups nearby reports into demand hotspots
5. **Prioritize** — Transparent weighted scoring formula ranks hotspots by population, severity, infrastructure gap, equity, cost efficiency, and duplicate discount
6. **Decide** — Policymakers use AI DPR briefs, steelman debates, digital twins, and a RAG copilot to make evidence-based funding decisions
7. **Verify** — Corruption X-ray auditor cross-references contractor claims against satellite imagery
8. **Audit** — Every action is hash-chained in a tamper-evident ledger

---

## Seed Data

The prototype ships with realistic sample data covering:
- **4 citizen reports** across Hindi, Marathi, Malayalam, and Hinglish
- **4 demand hotspots** in Madhya Pradesh, Maharashtra (Mumbai & Pune), and Kerala
- **5 government schemes** (PMGSY III, Jal Jeevan Mission, Ayushman Bharat, Samagra Shiksha, BharatNet III)
- **2 corruption cases** with satellite verification flags
- **3 constituency scorecards** (MP, MLA, Ward Councillor)

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

JanSetu is built as a **Digital Public Good** aligned with the UNDP Digital Public Goods standard and India's DPI framework.

---

## Acknowledgments

- Built for the India Stack / DPI ecosystem
- Inspired by PMGSY, Jal Jeevan Mission, and NITI Aayog's open data initiatives
- Leaflet map tiles by CartoDB (OpenStreetMap contributors)
