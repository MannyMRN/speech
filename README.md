# Speech — Shark Tank Pitch Form

A no-login digital version of the "Bossmoves: Shark Tank Finale Pitch" worksheet. Student teams open a link, fill in the blanks, and submit — every submission is appended as a row to a Google Sheet so it can be exported/analyzed as a dataset.

## Tech Stack

- Next.js (App Router), TypeScript
- Tailwind CSS
- Google Sheets API via a service account (server-side only, no student auth)
- Deploy target: Vercel

## 1. Create the destination Google Sheet

1. Create a new Google Sheet, e.g. "Speech — Pitch Responses."
2. Set row 1 to these headers, in this exact order:

   ```
   Timestamp, Team Name, Project Name, Hook, Problem, Proof Count, Proof Quote, Speaker 1, Solution, MVP, What We'll Show, Speaker 2, Who Pays, Money Model, Cost to Build, Price Charged, Num Customers, Revenue Estimate, Speaker 3, How We Grow, The Ask, Speaker 4
   ```

3. Copy the Sheet ID from its URL — the long string between `/d/` and `/edit`.

## 2. Create a Google Cloud service account

1. In [Google Cloud Console](https://console.cloud.google.com/), create/select a project and enable the **Google Sheets API**.
2. Create a Service Account, then create and download a JSON key for it.
3. Open the Sheet from step 1, click **Share**, and share it with the service account's email (looks like `something@project-id.iam.gserviceaccount.com`) as **Editor**.

## 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from the downloaded JSON key:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=the_sheet_id_from_the_url
```

The private key has literal `\n` characters — `lib/sheets.ts` already handles converting them to real newlines before use. Never commit `.env.local` or the service account JSON key to the repo.

## 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the form.

## 5. Viewing responses

No admin page is needed — open the Google Sheet directly. Every submission appears as a new row in real time. Share the Sheet as Viewer or Editor with anyone who needs to see the data, and export to CSV from Sheets whenever you want.

## 6. Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new).
3. Add the same three environment variables in the Vercel project settings (Settings → Environment Variables):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (paste with the `\n` characters intact, as a single-line string)
   - `GOOGLE_SHEET_ID`
4. Deploy, then share the Vercel URL with students.

> If you rename the Sheet's tab from the default "Sheet1", update the `range` in `lib/sheets.ts` (`Sheet1!A:V`) to match.

## Project structure

- `app/page.tsx` — the multi-section pitch form (client component)
- `app/api/submit/route.ts` — validates the submission and appends a row to the Sheet
- `lib/sheets.ts` — Google Sheets API helper (service account auth + append)
- `lib/pitch.ts` — shared form field types, required-field list, and row-builder
- `components/` — reusable form field + section UI pieces
