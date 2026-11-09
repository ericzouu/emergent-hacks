# Roomsure

**A room you can trust, for 1 to 6 months.**

A project for **Emergent Hacks**, built with my teammates [Eric Ma](https://github.com/ericmxf17), [David Hong](https://github.com/jinghihong) and [Divya Prakash](https://github.com/DivyaPrakash04).

Mid-term housing — internships, travel nursing, short contracts — lives in informal posts that are hard to compare and where scams thrive. Roomsure ranks rooms by **your** trade-offs with the math shown, lets you **walk the room in 3D before you pay**, and scam-checks listings from anywhere.

**Live demo:** <https://roomsure-emergent.vercel.app>

## What it does

- **One-sentence intake** → structured, editable preferences. Claude parses it, deterministic rules are the fallback, and the UI labels which one answered (the hosted demo runs the fallback).
- **Ranked deck with visible math.** Every card explains its score ("#1 because it covers every date and is furnished; you give up $50 on price"). Drag a slider and the deck re-ranks; *near misses* show the one change that brings a room back.
- **Video → walkable 3D room.** A 20–30 second phone pan becomes a first-person room (WASD, mouse look, collision) in about 3.5 minutes for ~$1 — no LiDAR, no GPU reconstruction.
- **Roomsure Passport**: simulated email, ID and card checks that gate matching and payments.
- **Match → chat → reserve**, priced server-side (simulated; wired for Stripe test mode).
- **Scam check**: paste a listing from anywhere, get a risk verdict with the exact suspicious phrases quoted.

## Try it

1. [Open the demo](https://roomsure-emergent.vercel.app) → **Continue as Maya (demo)** → type what you need in one sentence (or tap a sample).
2. Swipe the deck. Open **Show the math** and drag a weight — the ranking and reasons update live.
3. On **Dorm single in Elmhurst**, click the **3D tour** badge: **WASD** to walk, **Shift** to run, **Esc** frees the cursor.
4. Swipe right → simulate the host reply → chat unlocks → **Reserve**; the payment shows in the Passport.
5. **Scam check**: paste the sample listing and watch it quote the red flags.
6. Host side: **Try a 3D scan** on the landing page → download a sample video → upload it → walk the result. Scanning a *new* video runs locally (below).

## How a video becomes a room

```
phone video → ~24 frames → 5 Claude vision agents in parallel
  (architecture · furniture · materials · lighting · props)
→ 1 merge pass → rooms/<id>.json (~10 KB parametric spec)
→ three.js renders it: first-person walk, collision from the spec
```

Rooms are **specs, not meshes** — tiny, instant to load, validatable and editable, no splats or NeRFs. Pipeline, prompts and the schema live in [`website/public/scans/room3d/`](website/public/scans/room3d/).

## Repo map

| Folder | What it is |
|---|---|
| `website/` | The app (TanStack Start, React, Tailwind). `/api` is rewritten to the backend; if none answers, local rules and data take over. |
| `platform/` | Next.js backend: accounts, simulated verification & payments, Claude intake/scam-check, the ranking engine. |
| `website/public/scans/room3d/` | The 3D room engine, room specs, and the scan pipeline + local scan service. |
| `ranking/` | Ranking engine docs, tests and an offline `demo.html`. |

Also: the [demo script](demo-script.md) and the [pitch deck](Roomsure%20Pitch%20Deck.pptx).

## Run locally

The hosted demo covers everything except two things that need local processes: **generating a 3D room from a new video**, and live Claude parsing. For those:

```sh
cd website && npm install --no-package-lock && npx vite dev --port 5173
```

```sh
cd platform && npm ci && APP_URL=http://localhost:5173 npm run dev
```

```sh
node website/public/scans/room3d/scan-pipeline/server.mjs
```

The backend (port 3000, optional) reads `ANTHROPIC_API_KEY` from `platform/.env.local`; the scan service (port 8140) reads the same key and powers new-video scans on the upload pages. Tests: `cd website && npx vitest run` and `cd platform && npm test`.

---

*Demo honesty: all people, rooms, verification, matching, chat and payments are synthetic or simulated — no real ID, card number or payment is ever collected. A 3D scan is an inspection aid, not proof of condition.*
