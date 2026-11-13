# Jubiläumsfest Bietzen 2027

Webseite zum Jubiläumsfest **120 Jahre Musik · 100 Jahre Sport**
(M.V. Cäcilia Bietzen 1907 & SF 1927 Bi-Ha), 23.–26. Juli 2027, Sportplatz Bietzen.

Statische Seite (HTML/CSS/JS), ohne Build-Schritt und ohne externe Dienste:
Schriften (Bebas Neue, Poppins, Permanent Marker, SIL Open Font License) liegen lokal in `schriften/`.

## Struktur
| Datei / Ordner | Inhalt |
| --- | --- |
| `index.html` | Startseite: Highlight, Programm, Vereine, Anfahrt, Tickets, FAQ |
| `style.css` | Gestaltung – Farben aus dem Logo stehen oben unter `:root` |
| `script.js` | Countdown (`FEST_DATUM`), Menü, Animationen, Formular |
| `bilder/` | Logo (hell/dunkel), Wappen, Bandfoto, Vorschaubild zum Teilen |
| `404.html` | Eigene Fehlerseite für nicht vorhandene Adressen (Netlify nutzt sie automatisch) |
| `impressum.html`, `datenschutz.html` | Rechtliches – Platzhalter in `[eckigen Klammern]` noch ausfüllen |

## Programm ergänzen
In `index.html` beim jeweiligen Tag den Eintrag `Programm wird in Kürze bekanntgegeben` ersetzen durch z. B.:
```html
<li><time>18:00</time><span><strong>Fassanstich</strong><br>mit Musik</span></li>
```

## Ansehen & Veröffentlichen
Lokal: `index.html` im Browser öffnen.

Online: **https://jubilaeum2027.de** – Netlify-Projekt `jubilaeum2027`, verbunden mit dem Branch `main`.
Automatisches Veröffentlichen ist **gesperrt**: Ein Push auf `main` erzeugt nur einen neuen Deploy,
live geht er erst nach Klick auf **Publish deploy** im Netlify-Dashboard (Deploys).

Testseite: **https://test.jubilaeum2027.de** – zeigt automatisch den Branch `test`
(nur mit Netlify-Team-Login sichtbar).

Ablauf für Änderungen:
1. Änderungen auf den Branch `test` pushen.
2. Auf https://test.jubilaeum2027.de prüfen.
3. Passt alles: `test` in `main` übernehmen (Pull Request `test` → `main`).
4. Im Netlify-Dashboard unter Deploys den neuen Deploy mit **Publish deploy** live schalten.

Bei jedem Deploy hängt Netlify an `style.css` und `script.js` das aktuelle Datum als Version an
(`?v=JJJJMMTT-HHMM`, siehe `netlify.toml`), damit Besucher immer die neue Fassung laden.
Neue HTML-Seiten binden die Dateien daher mit `style.css?v=lokal` bzw. `script.js?v=lokal` ein.

Einträge des Formulars „Ticket-Info“ stehen im Netlify-Dashboard unter **Forms**.
