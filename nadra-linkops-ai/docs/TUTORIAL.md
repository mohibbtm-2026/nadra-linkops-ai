# NADRA LinkOps AI — Start-to-Finish Tutorial

This tutorial explains how to complete the final project from idea selection to GitHub submission.
It is based on a **real NADRA network engineer workflow in Pakistan**.

---

## Step 1 — Choose the idea

### Original idea
Build an app for a NADRA Network Engineer who handles:
- connectivity complaints from 85 DAUs,
- telecom escalation follow-up,
- disruption reporting,
- OU transfer requests,
- password reset requests,
- account unlock requests.

### Why this is a strong final-project idea
It is:
- original,
- based on a real job,
- clearly useful,
- easy to explain to a teacher,
- rich enough to include a real AI feature.

---

## Step 2 — Define the app features

The app should include:
1. Complaint logging
2. Telecom/provider tracking
3. Disruption timing and monthly report generation
4. Genuine vs non-connectivity classification
5. AD support tracker
6. AI escalation email writer
7. Backup/export/import

---

## Step 3 — Build the frontend

Files used:
- `index.html`
- `styles.css`
- `script.js`

### Frontend sections
- Dashboard
- Complaints tab
- AD Support tab
- Reports tab
- AI Assistant tab
- Documentation tab

### Why vanilla HTML/CSS/JS was chosen
- very simple to understand,
- easy to host,
- no dependency problems,
- perfect for a student final project,
- works on Vercel without build configuration.

---

## Step 4 — Add the AI feature

The AI feature is implemented in:
- `api/ai-draft.js`

### What it does
- reads the selected complaint,
- checks if it looks genuine or not,
- drafts escalation email,
- writes DAU update,
- suggests next steps.

### Why this satisfies the assignment
The assignment requires an AI feature driven by **instructions written by you**.
This project includes a custom system prompt specifically written for NADRA link support.

---

## Step 5 — Add real Pakistan context

This project includes realistic examples such as:
- PTCL DSL
- Wateen Telecom
- VSAT DVBRCS
- DRS
- 3G/4G SIM backup

Sample sites include:
- Quetta
- Pishin
- Chaman
- Zhob
- Loralai
- Nushki
- Mastung
- Kalat
- Khuzdar
- Killa Abdullah

---

## Step 6 — Test locally

### Simple run option
Open `index.html` in a browser.

### Recommended option
Run:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

### What to test
- add a complaint,
- edit a complaint,
- generate monthly report,
- add an AD request,
- export CSV,
- export JSON,
- click AI draft.

---

## Step 7 — Create GitHub repository

### Commands
```bash
git init
git add .
git commit -m "Initial commit - NADRA LinkOps AI"
git branch -M main
git remote add origin https://github.com/your-username/nadra-linkops-ai.git
git push -u origin main
```

### Important
Make the repo **public**.
Then test it in **incognito mode**.

---

## Step 8 — Deploy to Vercel

1. Open Vercel.
2. Import the GitHub repo.
3. Deploy the project.
4. In project settings, add environment variables:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`
   - `PUBLIC_APP_URL`
5. Redeploy.

### Example values
- `OPENROUTER_MODEL = openai/gpt-4.1-mini`
- `PUBLIC_APP_URL = https://your-vercel-project.vercel.app`

---

## Step 9 — Update README

Before submission, update:
- GitHub repository link
- Live URL
- Screenshots if you want your final hosted version shown

Make sure the README contains:
- app name,
- problem statement,
- live URL,
- features,
- AI explanation,
- tools/services/models,
- screenshots,
- run instructions.

---

## Step 10 — Submit correctly

The assignment says submit **ONLY** the public GitHub repository link.
So before submitting:
- repo must be public,
- live app must work,
- README must be complete,
- no secrets should be committed.

---

## Suggested viva / presentation explanation

If your teacher asks what your project does, you can say:

> "My project is NADRA LinkOps AI. It solves a real network operations problem in Pakistan. A NADRA network engineer receives daily complaints from DAUs about primary and secondary links such as PTCL, Wateen, VSAT, DRS, and 3G/4G backup links. My app records complaints, tracks disruption reports, distinguishes genuine connectivity issues from user-side issues, generates monthly reports, tracks AD support requests, and uses AI to draft telecom escalation emails and updates for DAU incharges."

---

## Final note

This project is ready as a complete academic final-project package, but you must still:
- upload it to **your own public GitHub repository**,
- deploy it on **your own Vercel account**,
- and replace placeholder links inside the README.
