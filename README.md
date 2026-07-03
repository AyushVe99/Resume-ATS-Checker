# ATS Resume Checker

An enterprise-grade, deterministic ATS (Applicant Tracking System) Resume Checker. This platform analyzes a candidate's resume against a job description, scores it transparently based on strict rules, and uses AI (Google Gemini) to provide qualitative grammar and bullet point rewriting suggestions.

## Philosophy

The architecture of this project strictly follows a **Deterministic Engine First** philosophy:
1. **Parser Engine**: Extracts text using robust regex and heuristics (no LLM hallucination).
2. **Keyword Engine**: Uses natural language processing (`natural` Porter Stemmer) for deterministic keyword matching.
3. **Scoring Engine**: Calculates the 100-point ATS score using strict, transparent deductions.
4. **AI Suggestions**: Google Gemini operates entirely in parallel to analyze grammar and rewrite bullets. It has **no** influence over the ATS score.

## Architecture & Tech Stack

This project is a Monorepo managed via npm workspaces.

- **Frontend (`apps/frontend`)**: Next.js 15+, React, Tailwind CSS, Shadcn UI, Mantine Form, Zustand state management.
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
   Create an `.env` file in `apps/backend/.env`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_google_gemini_api_key_here
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

## Contributing
Follow the standard PR process. Ensure that any additions to the ATS scoring logic remain 100% deterministic and strictly typed.
