# Kelif Creator HQ — Feature Roadmap

> Vollständige Übersicht aller geplanten Features für das Kelif Social Media Dashboard.
> Stand: Juni 2026 | Elfi & Ken / Kelif

---

## ✅ Bereits live

- Übersicht mit Subscriber-Tracker (YouTube, Instagram, TikTok)
- Subscriber-Fortschrittsbalken mit Ziel
- **Sparkline-Chart pro Plattform** — Follower-Verlauf auf einen Blick
- **Wachstumsdelta** — Differenz zur letzten Eintragung (grün/rot)
- Video-Pipeline (Kanban: Idee → Produktion → Schnitt → Live)
- **Kanban scrollt horizontal auf iPhone** (Trello-Style)
- Kalender (Drehtage, Schnitttage, Upload-Termine)
- Vision Board (Emoji + Text + Deadline)
- Ziele & KPIs (mit Zielwert und Deadline)
- Video-Timeline (alle Videos mit Datum, Kategorie, Location, YouTube-Link)
- **Video-Performance** — Views, Likes, Kommentare pro Video eintragen
- **„Bestes Format"-Analyse** — Ø Views nach Kategorie, Ranking mit Balken
- Dreh-Checkliste (Equipment, Audio, Settings, Content)
- **Checkliste-Status in Supabase** — sync zwischen Elfi & Ken in Echtzeit
- YouTube Analytics Dashboard
- Meilenstein-Tracker
- **iOS Bottom Navigation** — 7 Tabs, frosted glass, roter Dot
- **viewport-fit=cover** — Dynamic Island & Notch sauber abgedeckt
- PWA — als App auf iPhone & Mac installierbar
- Supabase Echtzeit-Sync (Ken & Elif sehen dieselben Daten)

---

## 🔴 Priorität 1 — Noch offen (kritisch)

### PWA Icons
- icon-192.png und icon-512.png generieren
- Ohne diese erscheint auf dem iPhone-Homescreen kein richtiges Icon
- Kann z.B. mit Canva oder einem Online-Tool gemacht werden (1024×1024 → export in 192 + 512)

### Vision Board — Bild-Upload
- Fotos aus der Fotobibliothek hochladen
- In Supabase Storage ablegen und auf der Karte anzeigen
- Macht das Vision Board zu einem echten Moodboard

### Ziel-Fortschrittsbalken
- Aktuellen Wert manuell eintragen (z.B. 3.200 von Ziel 10.000)
- Fortschrittsbalken mit Prozent in der Ziele-Liste

---

## 🟡 Priorität 2 — Direkt mehr Wachstum

### Upload-Konsistenz-Tracker
- Streak-Anzeige: wie viele Wochen in Folge gepostet
- Kalender-Heatmap der Upload-Tage (wie GitHub)
- Ziel setzen (z.B. 1x pro Woche) mit Warnung wenn Lücke entsteht
- **Warum:** YouTube-Algorithmus belohnt Konsistenz stärker als Qualität

### Bester Upload-Zeitpunkt
- Analysiert bisherige Videos: wann gepostet, wie viele Views in ersten 48h
- Empfiehlt den optimalen Wochentag und Uhrzeit
- **Warum:** Die ersten 2h nach Upload entscheiden ob YouTube ein Video pusht

### Titel A/B Tester (Claude-powered)
- Zwei Titel-Varianten eingeben
- Claude bewertet: CTR-Potenzial, Emotion, Keyword-Stärke, Länge
- Klare Empfehlung welcher Titel besser performen wird
- **Warum:** Thumbnail + Titel bestimmen 80% der Klickrate

### Trend-Radar
- Zeigt was gerade auf YouTube DE trending ist
- Gefiltert nach Kategorien: Food, Couple, Reise, Stuttgart/Ludwigsburg
- **Warum:** Trend-Videos in ersten 24-48h bekommen 3-5x mehr organische Reichweite

---

## 🟢 Priorität 3 — Content-Qualität

### Hook-Generator (Claude-powered)
- Thema eingeben → 5 Hook-Varianten generieren
- Typen: Frage, Schock, Geheimnis, Emotion, Humor
- Angepasst an Kelif-Stil und Zielgruppe
- **Warum:** Die ersten 3 Sekunden entscheiden ob jemand bleibt

### Script-Builder (Claude-powered)
- Story-Struktur für jeden Vlog
- Aufbau: Hook → Setup → Konflikt → Höhepunkt → Auflösung → CTA
- Angepasst an Couple-Vlog-Stil von Elfi & Ken
- **Warum:** Vlogs mit klarer Story halten Zuschauer 40-60% länger

### Thumbnail-Bewertung (Claude Vision)
- Thumbnail hochladen → Claude analysiert:
  - Text-Lesbarkeit auf kleinem Screen
  - Emotionsstärke der Gesichter
  - Kontrast und Farben
  - Klick-Potenzial im Vergleich zur Konkurrenz
- **Warum:** Schlechte Thumbnails kosten täglich Klicks

### Pre-Upload Checkliste
- Interaktive Checkliste vor jedem Upload:
  - [ ] Titel optimiert und A/B getestet?
  - [ ] Beschreibung mit Keywords?
  - [ ] Kapitel-Marker gesetzt?
  - [ ] Thumbnail hochgeladen?
  - [ ] Tags eingefügt?
  - [ ] End-Screen konfiguriert?
  - [ ] Premiere oder sofort?
  - [ ] Community-Post geplant?
- **Warum:** Die meisten Creator vergessen 2-3 Punkte — jeder kostet Reichweite

---

## 🔵 Priorität 4 — Community & Monetarisierung

### Kommentar-Analyse (YouTube API)
- Automatisch Kommentare der letzten Videos abrufen
- Häufige Fragen und Themen-Wünsche extrahieren
- "Das wollen eure Zuschauer sehen"-Zusammenfassung
- **Warum:** Die besten Video-Ideen stecken in den Kommentaren

### Kooperations-Pitch Generator (Claude-powered)
- Brand-Name und Produkt eingeben
- Claude schreibt professionelle Kooperationsanfrage im Kelif-Stil
- Deutsch und Englisch
- **Warum:** Ab 1.000 Abonnenten sind erste Kooperationen realistisch

### Shorts-Ideen aus Videos (Claude-powered)
- Video-Titel und Beschreibung eingeben
- Claude findet die 3 besten Momente für Shorts / Reels
- Mit konkretem Hook und Beschreibung
- **Warum:** Shorts bringen neues Publikum kostenlos aus bestehendem Material

### Einnahmen-Schätzer
- Basierend auf monatlichen Views
- Schätzt AdSense-Verdienst (DE RPM: 3-6€ pro 1.000 Views)
- Zeigt wann Monetarisierungsschwelle erreichbar ist (1.000 Subs + 4.000h Watch Time)
- **Warum:** Macht greifbar wann sich YouTube finanziell lohnt

---

## ⚪ Priorität 5 — Langfristige Strategie

### Monats-Report (automatisch)
- Jeden Monat automatisch generiert:
  - Wachstum vs. Vormonat
  - Beste Videos des Monats
  - Was hat funktioniert, was nicht
  - Empfehlungen für nächsten Monat
- **Warum:** Wer Daten nicht auswertet wiederholt Fehler

### 12-Monats-Roadmap
- Basierend auf aktuellem Wachstum
- Realistische Prognose: wann 1K, 5K, 10K Subs
- Meilenstein-Planung mit Datum
- **Warum:** Konkrete Ziele mit Datum motivieren mehr als abstrakte Wünsche

### KI Content-Berater (Claude im Dashboard)
- Chat direkt im Dashboard
- Kennt alle eure Daten: Views, Upload-Rhythmus, beste Videos, Ziele
- Fragen wie: "Was soll ich diese Woche drehen?" → konkrete Antwort
- **Warum:** Verbindet alle Daten mit KI — Entscheidungen basieren auf echten Zahlen

### Konkurrenz-Analyse
- Ähnliche Couple-Kanäle beobachten
- Welche Formate performen bei denen, welche Themen laufen
- **Warum:** Verstehen was in der Nische funktioniert gibt klaren Vorsprung

---

## 🍎 Apple Ökosystem Integration

### Was als PWA möglich ist (sofort, kein Xcode nötig)

| Feature | Möglich als PWA? | Wie? |
|---|---|---|
| Push-Notifications | ✅ Ja (iOS 16.4+) | Web Push API — z.B. "Heute ist Drehtag!" |
| Offline-Modus | ✅ Ja | Service Worker cacht die App |
| Home Screen Icon | ✅ Ja | Bereits eingebaut (Icons noch generieren!) |
| Vollbild ohne Browser | ✅ Ja | display: standalone — bereits aktiv |
| Kamera-Zugriff | ✅ Ja | Für Thumbnail-Upload |
| Foto-Bibliothek | ✅ Ja | File Input für Vision Board Bilder |

### Was nur mit Xcode / nativer App geht

| Feature | Warum nur nativ? |
|---|---|
| Apple Reminders | Keine Web-API — nur über Apple's EventKit (Swift) |
| Apple Kalender schreiben | Nur lesend via WebCal-Link, schreiben braucht EventKit |
| Apple Notes | Keine öffentliche API |
| Apple Watch Widget | Nur via WatchKit in Xcode |
| Siri Shortcuts | Nur nativ via App Intents |
| Live Activities | Nur nativ (Dynamic Island) |

### Clever-Lösung ohne Xcode: Apple Shortcuts

Mit der Apple Shortcuts App kannst du eigene Automationen bauen die unsere Web-App verbinden:

**Shortcut 1 — "Kelif Drehtag"**
Beim Tippen: Erstellt automatisch einen Termin in Apple Kalender + öffnet die Dreh-Checkliste im Dashboard

**Shortcut 2 — "Video gedreht"**
Beim Tippen: Öffnet eine Eingabemaske → trägt das Video direkt in die Timeline ein via Supabase API

**Shortcut 3 — "Wöchentlicher Check"**
Jeden Montag 9 Uhr: Erinnerung in Apple Reminders + öffnet direkt das Dashboard

**Shortcut 4 — "Subscriber Update"**
Einmal pro Woche: Öffnet YouTube Studio → erinnert daran Zahlen ins Dashboard einzutragen

---

## Technischer Stack

- **Framework:** Next.js 14 (App Router)
- **Datenbank:** Supabase (PostgreSQL + Realtime)
- **Hosting:** Vercel (Auto-Deploy via GitHub)
- **Styling:** Tailwind CSS
- **KI:** Claude API (für alle powered-Features)
- **YouTube:** YouTube Data API v3 + Analytics API
- **PWA:** Web App Manifest + Service Worker
- **Apple-Integration:** Apple Shortcuts (.shortcut Dateien)

---

*Kelif Creator HQ — gebaut für Elfi & Ken | Stuttgart / Ludwigsburg*
