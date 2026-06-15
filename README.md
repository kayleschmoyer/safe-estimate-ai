# 🛡️ Safe Estimate AI

**Safety-first AI estimate drafting for home service companies.**

> AI assists. You decide. No estimate reaches a customer without contractor approval.

Safe Estimate AI is a modern web application that turns messy job notes, voice memo transcripts, and photo observations into structured draft estimates — then requires a licensed professional to review and approve before anything is shared with a customer.

---

## Product Overview

Contractors in HVAC, roofing, plumbing, landscaping, and general contracting spend significant time writing estimates from scattered notes. This tool accelerates that process while keeping safety and professional accountability at the center of every workflow.

**Core workflow:**
1. Contractor enters job notes, voice memo transcript, and photo observations
2. AI generates a structured draft with scope of work, line items, assumptions, exclusions, and safety flags
3. Contractor reviews the draft, addresses safety flags, and explicitly approves
4. Approved estimate is exported for customer delivery

**What this is not:**
- Not a final quote generator
- Not a code compliance tool
- Not a permit advisory service
- Not an auto-send solution

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript (strict mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v3 |
| Form handling | [React Hook Form](https://react-hook-form.com/) |
| Validation | [Zod](https://zod.dev/) |
| Components | Custom primitives (shadcn/ui-inspired) |
| State | React `useState` + `sessionStorage` (MVP) |

---

## Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Install & run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

This MVP does not require any environment variables. All estimate generation is deterministic and runs entirely in the browser — no external AI API calls are made.

When extending this project for production, you would add:

```env
# .env.local (never commit this file)

# AI provider (e.g., OpenAI)
OPENAI_API_KEY=sk-...

# Database connection
DATABASE_URL=******host:5432/safe_estimate

# Auth provider (e.g., Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Storage (e.g., S3-compatible)
S3_BUCKET_NAME=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=...
```

**Never commit `.env` or `.env.local` files.** They are excluded in `.gitignore`.

---

## Safety-First Design Principles

Safe Estimate AI was built around these principles — they are not features, they are the foundation:

### 1. Human-in-the-loop required
Every estimate remains a **DRAFT** until a licensed contractor explicitly reviews it and checks the approval box. This is not optional or configurable.

### 2. No automatic sending
The system will never send an estimate to a customer automatically. Export only becomes available after contractor approval.

### 3. Prices are estimates, not guarantees
Every price shown is labeled as an estimate. The app surfaces a confidence level (low/medium/high) and explains why. No binding quotes are generated.

### 4. No permit or code conclusions
The AI flags jobs that likely require permits or inspections — but it never states whether a permit is or is not required. That determination belongs to the contractor and local authorities.

### 5. Safety flags are prominent, not buried
Risk flags appear before line items, not in footnotes. Contractors see concerns before pricing.

### 6. No safety-critical language
Generated estimates never include phrases like "structurally sound," "meets code," "no permit needed," or "guaranteed." These are blocked at the generation level.

### 7. Privacy-minded
In this MVP, all data stays in the browser (sessionStorage). A production implementation would use server-side encryption, row-level access controls, and clear data retention policies.

### 8. Audit trail by design
Every estimate includes a unique ID, timestamp, confidence level, and rationale — so every number can be explained and defended.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Nav and footer
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Tailwind base styles
│   ├── estimate/
│   │   ├── page.tsx        # Estimate form page
│   │   └── result/
│   │       └── page.tsx    # Estimate output + approval page
│   └── safety/
│       └── page.tsx        # Safety center page
├── components/
│   ├── nav.tsx             # Navigation bar
│   ├── estimate-form.tsx   # Form with Zod validation
│   ├── estimate-output.tsx # Output display + approval gate
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── badge.tsx
│       ├── alert.tsx
│       └── select.tsx
└── lib/
    ├── schema.ts           # Zod schemas and TypeScript types
    ├── estimate-generator.ts # Mock AI estimate generation logic
    └── utils.ts            # cn(), formatCurrency(), generateEstimateId()
```

---

## Roadmap

### Near-term (v0.2)
- [ ] PDF export via `@react-pdf/renderer`
- [ ] Estimate history list (localStorage or IndexedDB)
- [ ] Editable line items before approval
- [ ] Confidence level explanation modal

### Production readiness (v1.0)
- [ ] User authentication (Clerk or Auth.js)
- [ ] Database persistence (Postgres + Drizzle ORM)
- [ ] Server-side AI integration (OpenAI with structured outputs)
- [ ] Voice memo transcription (Whisper API)
- [ ] Photo upload and analysis (vision model)
- [ ] Audit log for all AI generations and approvals
- [ ] PDF export with contractor branding
- [ ] Multi-user / company accounts
- [ ] Customer portal for estimate review

### Safety enhancements
- [ ] AI output moderation layer (filter unsafe claims)
- [ ] Per-trade pricing calibration from historical data
- [ ] Permit lookup integration by zip code
- [ ] Insurance certificate attachment workflow

---

## Testing

This MVP does not include automated tests. For production, the following would be added:

- Unit tests for `estimate-generator.ts` (Zod schema validation, flag detection, line item logic)
- Integration tests for the form → estimate flow
- Accessibility tests (axe-core or Playwright)

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

## Disclaimer

Safe Estimate AI generates draft estimates for informational purposes only. Generated estimates are not final quotes, are not legally binding, do not constitute code compliance opinions, and do not guarantee permit requirements or pricing. All estimates require review and approval by a licensed professional before being shared with customers.
