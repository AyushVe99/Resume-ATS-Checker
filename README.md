# ATS Resume Checker

An enterprise-grade, deterministic ATS (Applicant Tracking System) Resume Checker. This platform analyzes a candidate's resume against a job description, scores it transparently based on strict rules, and uses AI (Google Gemini) to provide qualitative grammar and bullet point rewriting suggestions.

## Philosophy & Architecture

The architecture of this project strictly follows a **Deterministic Engine First** philosophy, isolating AI from the core grading mechanics to ensure 100% reproducible and trustworthy evaluations:

1. **Parser Engine**: Extracts text using robust regex and heuristics (no LLM hallucination).
2. **JD Intelligence Engine**: A deterministic heuristic parser that scans Job Descriptions, mapping extracted keywords to **Required (70%)**, **Preferred (20%)**, and **Bonus (10%)** weighted classifications.
3. **8-Category ATS Scoring Engine**: Calculates the 100-point ATS Match score using a massive set of mathematically clamped rules evaluating Formatting (20), Keywords (25), Experience (15), Projects (10), Skills (10), Education (5), Grammar (5), and ATS Compatibility (10).
4. **Recruiter Confidence Simulator**: Calculates a separate, secondary 100-point metric simulating how a human recruiter would perceive the candidate based purely on impact metrics, technical match, and leadership signals (ignoring ATS mechanics).
5. **AI Suggestions**: Google Gemini operates entirely in parallel to analyze grammar and rewrite bullets. It has **no** influence over the ATS score or Recruiter Confidence score.

## Key Features

- **Advanced Data Visualizations**: Actionable insights generated through Engineering DNA diagrams, Complexity vs Impact matrices, Risk Maps, and Readiness Trees built with d3 and React Flow.
- **Action Plan Dashboard**: Prioritizes the top 3 highest-impact fixes a user can make to their resume to boost their score immediately.
- **Multi-API Key Load Balancing**: The backend accepts a comma-separated list of Gemini API keys, automatically distributing requests to avoid rate limits.
- **Automated CI/CD**: A unified GitHub Actions pipeline automatically lints, builds, tests, and triggers deployments to Render (Backend) and Vercel (Frontend) upon pushing to the `main` branch.

## Architecture & Tech Stack

This project is a Monorepo managed via npm workspaces.

- **Frontend (`apps/frontend`)**: Next.js 16, React 19, Tailwind CSS, Shadcn UI, Mantine Form, Zustand state management.
- **Backend (`apps/backend`)**: Node.js, Express, TypeScript, Multer (Memory Storage), Jest.
- **AI Integration**: `@google/genai` (Gemini 2.5 Flash).
- **Security**: `helmet`, `express-rate-limit`, exponential backoff with AbortControllers.
- **Infrastructure**: Fully Dockerized.

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Google Gemini API Key

### Installation (Local Development)

1. **Clone the repository**
2. **Install dependencies** from the root workspace:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create an `.env` file in `apps/backend/.env`. You can provide multiple API keys separated by commas for load balancing:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_key_1,your_key_2,your_key_3
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```
4. **Run the Application**:
   You can start both frontend and backend concurrently from the root directory:
   ```bash
   npm start
   ```

### Running with Docker

To spin up the entire application using Docker Compose:

1. Ensure your `.env` file exists in `apps/backend/.env`.
2. Run the following command from the root directory:
   ```bash
   docker compose up --build -d
   ```
3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## Unit Testing

The backend is fully verified with a 100% test pass rate using Jest. To run the tests:

```bash
cd apps/backend
npm test
```

## CI/CD Pipeline & Deployment

This repository includes a robust GitHub Actions CI/CD pipeline (`.github/workflows/main.yml`) that triggers on any push or PR to `main`. 

The pipeline:
1. **CI Phase**: Runs `npm ci`, enforces strict ESLint rules, builds the Next.js frontend, and verifies backend functionality with Jest.
2. **CD Phase (Backend)**: If the CI phase passes, triggers an automated deployment to Render via a secure webhook hook (`RENDER_DEPLOY_HOOK_URL`).
3. **CD Phase (Frontend)**: Vercel automatically deploys the frontend directly from the GitHub repository `main` branch when it updates.

To set this up, add `RENDER_DEPLOY_HOOK_URL` to your GitHub Repository Secrets.

## Contributing
Follow the standard PR process. Ensure that any additions to the ATS scoring logic remain 100% deterministic and strictly typed.
