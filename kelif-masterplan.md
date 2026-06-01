# Kelif Creator HQ — Masterplan

> Stand: Juni 2026 | Elfi & Ken / Kelif

---

## Phase 1 — Web-App (läuft auf Vercel)

### ✅ Erledigt
- [x] iOS Bottom Navigation (Sidebar → Bottom Nav, 7 Tabs)
- [x] viewport-fit=cover für Dynamic Island / Notch
- [x] Checkliste-Status in Supabase speichern (sync zwischen Geräten)
- [x] Follower-Verlauf als Sparkline-Chart pro Plattform
- [x] Wachstumsdelta (Differenz zur letzten Eintragung, grün/rot)
- [x] Video-Timeline: Views, Likes, Kommentare pro Video
- [x] „Bestes Format" Analyse-Tab (Ø Views nach Kategorie, Ranking)
- [x] Kanban-Pipeline horizontal scrollbar (Trello-Style auf iPhone)
- [x] YouTube Analytics Dashboard

### Fixes die noch offen sind
- [ ] PWA Icons generieren (icon-192.png, icon-512.png) — Home Screen Icon fehlt noch
- [ ] Vision Board Bild-Upload (Fotos aus Bibliothek)
- [ ] Ziel-Fortschrittsbalken mit aktuellem Wert (manuell eintragen)

### Features die noch kommen
- [ ] Upload-Konsistenz-Tracker mit Streak (wie viele Wochen in Folge gepostet)
- [ ] Bester Upload-Zeitpunkt Analyse (welcher Wochentag/Uhrzeit läuft am besten)
- [ ] Titel A/B Tester (Claude-powered)
- [ ] Hook-Generator (Claude-powered) — Top-Priorität, hoher Nutzen
- [ ] Script-Builder (Claude-powered)
- [ ] Thumbnail-Bewertung (Claude Vision)
- [ ] Pre-Upload Checkliste (Titel, Tags, Beschreibung, Thumbnail, End-Screen)
- [ ] Kommentar-Analyse (YouTube API — was wollen Zuschauer sehen)
- [ ] Kooperations-Pitch Generator (Claude-powered)
- [ ] Shorts-Ideen Generator (Claude-powered)
- [ ] Einnahmen-Schätzer (AdSense basierend auf Views)
- [ ] Monats-Report automatisch
- [ ] KI Content-Berater Chat im Dashboard

---

## Phase 2 — Native iOS App (Xcode + SwiftUI)

### Grundlage
- Dieselbe Supabase-Datenbank wie Web-App
- Ken nutzt native App, Elif kann Web-App nutzen
- Alles synchron in Echtzeit

### Apple-Integrationen
- [ ] Apple Kalender — Drehtag erstellen → landet in Kalender
- [ ] Apple Reminders — Erinnerungen direkt aus der App
- [ ] Apple Freeform — Vision Board Integration
- [ ] Apple Watch Widget — Subscriber-Zahl, nächster Drehtag
- [ ] Live Activity — Drehtag auf Lock Screen
- [ ] Siri — "Hey Siri, neuen Drehtag in Kelif eintragen"
- [ ] Home Screen Widget — Stats auf einen Blick

### APIs in der nativen App
- [ ] YouTube Data API (gleich wie Web-App)
- [ ] Claude API für alle KI-Features
- [ ] Supabase Swift SDK
- [ ] Instagram Basis (Apify)
- [ ] TikTok Basis (Apify)

### App-Struktur
```
Kelif iOS App
├── Home        — Live Stats, Streak, nächster Termin
├── Drehen      — Checkliste + → Apple Kalender
├── Ideen       — Pipeline + Hook-Generator
├── Analyse     — YouTube Analytics
├── Vision      — Moodboard + Freeform
└── Watch App   — Subscriber, Drehtag
```

---

## Tech Stack gesamt

| Bereich | Technologie |
|---|---|
| Web-App | Next.js 14, Tailwind, Vercel |
| iOS App | SwiftUI, Xcode |
| Datenbank | Supabase (PostgreSQL + Realtime) |
| KI | Claude API |
| YouTube | YouTube Data API v3 |
| Social | Apify (Instagram, TikTok Basis) |
| Apple | EventKit, WidgetKit, ActivityKit, App Intents |

---

## Reihenfolge als nächstes

1. **PWA Icons** — icon-192.png + icon-512.png generieren (dann sieht das App-Icon auf dem Homescreen richtig aus)
2. **Upload-Konsistenz-Tracker** — Streak-Anzeige, Heatmap, Ziel setzen
3. **Hook-Generator** (Claude) — Thema eingeben → 5 Hooks raus
4. **Vision Board Bild-Upload** — Fotos aus der Galerie
5. **Ziel-Fortschrittsbalken** — manuellen aktuellen Wert eintragen
6. **iOS App Grundgerüst** — SwiftUI + Supabase

---

*Kelif Creator HQ — Elfi & Ken | Stuttgart / Ludwigsburg*
