# Speech — Shark Tank Pitch Form

A no-login digital version of the "Bossmoves: Shark Tank Finale Pitch" worksheet. Student teams open a link, fill in the blanks, and submit — every submission is appended as a row to a Google Sheet so it can be exported/analyzed as a dataset.

## Tech Stack

- Next.js (App Router), TypeScript
- Tailwind CSS
- Google Sheets, written to via a Google Apps Script Web App (server-side only, no student auth, no Google Cloud project needed)
- Deploy target: Vercel

## 1. Create the destination Google Sheet

1. Create a new Google Sheet, e.g. "Speech — Pitch Responses."
2. Set row 1 to these headers, in this exact order:

   ```
   Timestamp, Team Name, Project Name, Hook, Problem, Proof Count, Proof Quote, Speaker 1, Solution, MVP, What We'll Show, Speaker 2, Who Pays, Money Model, Cost to Build, Price Charged, Num Customers, Revenue Estimate, Speaker 3, How We Grow, The Ask, Speaker 4
   ```

3. Rename the tab if you want, and update `SHEET_NAME` in `apps-script/Code.gs` to match (defaults to `Sheet1`).

## 2. Deploy the Apps Script Web App

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the boilerplate `myFunction()` code and paste in the contents of [`apps-script/Code.gs`](./apps-script/Code.gs) from this repo.
3. Replace `SHARED_SECRET` in the script with a long random string (this stops randoms from finding the URL and spamming your sheet). Keep this string safe — you'll paste it into your env vars too.
4. Save the project (any name is fine).
5. Click **Deploy → New deployment**.
6. Click the gear icon next to "Select type" and choose **Web app**.
7. Set:
   - **Execute as:** Me (your account)
   - **Who has access:** Anyone
8. Click **Deploy**, then **Authorize access** and approve the permissions (it's your own script acting on your own sheet).
9. Copy the **Web app URL** it gives you — it ends in `/exec`. That's your `GOOGLE_APPS_SCRIPT_URL`.

> If you ever edit the script, you need to create a **new deployment** (or a new version of the existing one via Deploy → Manage deployments → Edit) for the changes to go live — saving the script alone doesn't update the deployed Web App.

## 3. Configure environment variables

Copy `.env.local.example` to `.env.local`:

```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXXXXXX/exec
GOOGLE_APPS_SCRIPT_SECRET=a-long-random-string-you-make-up
```

`GOOGLE_APPS_SCRIPT_SECRET` must match `SHARED_SECRET` in `apps-script/Code.gs` exactly. Never commit `.env.local` to the repo.

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
3. Add the two environment variables in the Vercel project settings (Settings → Environment Variables):
   - `GOOGLE_APPS_SCRIPT_URL`
   - `GOOGLE_APPS_SCRIPT_SECRET`
4. Deploy, then share the Vercel URL with students.

## Project structure

- `app/page.tsx` — the multi-section pitch form (client component)
- `app/api/submit/route.ts` — validates the submission and appends a row to the Sheet
- `lib/sheets.ts` — posts the row to the Apps Script Web App
- `lib/pitch.ts` — shared form field types, required-field list, and row-builder
- `components/` — reusable form field + section UI pieces
- `apps-script/Code.gs` — the script to paste into the Sheet's Apps Script editor
