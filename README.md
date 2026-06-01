# Kelif Creator HQ

YouTube & Social Media Dashboard für Elfi & Ken — gebaut mit Next.js, Supabase und Vercel.

## Features

- **Übersicht** — Subscriber-Tracker für YouTube, Instagram & TikTok mit Fortschrittsbalken
- **Video-Pipeline** — Kanban-Board von Idee bis Upload
- **Kalender** — Drehtage, Schnitttage, Upload-Termine
- **Vision & Ziele** — Vision Board + KPI-Tracker
- **Video-Timeline** — Alle Videos mit Datum, Kategorie, Location & YouTube-Link
- **Dreh-Checkliste** — Equipment-Checkliste vor jedem Dreh

## Setup

### 1. Repo klonen

```bash
git clone https://github.com/Kelif3010/Social-Media-Dashboard.git
cd Social-Media-Dashboard
npm install
```

### 2. Umgebungsvariablen

Erstelle eine `.env.local` Datei:

```
NEXT_PUBLIC_SUPABASE_URL=https://sgsiybvyvvskymkrxwdh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein_anon_key
```

### 3. Lokal starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

### 4. Deployment auf Vercel

1. Repo auf GitHub pushen
2. In Vercel: "New Project" → GitHub Repo verbinden
3. Environment Variables in Vercel eintragen (gleiche wie .env.local)
4. Deploy

## Als PWA auf iPhone/Mac installieren

**iPhone (Safari):**
1. Dashboard im Safari öffnen
2. Teilen-Button → "Zum Home-Bildschirm"
3. Kelif HQ erscheint als App-Icon

**Mac (Safari/Chrome):**
1. Dashboard öffnen
2. In der Adressleiste das Download-Icon klicken
3. "Als App installieren"

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Datenbank:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
