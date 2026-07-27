# Train Detector

Next.js dashboard that polls a Supabase `detections` table and displays live train detection events logged by a Raspberry Pi.

---

## Project structure

```
app/
  api/detections/route.ts   ← API route, queries Supabase
  page.tsx                  ← Main page
  layout.tsx
  globals.css
components/
  DetectionFeed.tsx         ← Polling UI component
lib/
  supabase.ts               ← Supabase client + Detection type
```

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

Find these in your Supabase dashboard under:
**Project Settings → API → Project URL / anon public key**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Adjust the `Detection` type

Open `lib/supabase.ts` and update the `Detection` type to match your actual table columns. For example, if your Pi inserts a `camera_id` or `confidence` column, add those fields.

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).


## Changing the poll interval

In `components/DetectionFeed.tsx`, adjust:

```ts
const POLL_INTERVAL_MS = 10_000; // 10 seconds
```

---
