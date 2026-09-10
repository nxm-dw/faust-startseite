# Faust GmbH — Startseiten-Entwurf

Konzeptentwurf einer neuen Startseite für die **Faust GmbH**, Pflaster-, Straßen- und Tiefbau,
Hünstetten-Görsroth. Erstellt von **NEXAS Media** als Entscheidungsgrundlage: Der Kunde ist noch
unentschieden, ob eine neue Website kommen soll.

## Stand
Statischer Prototyp, keine Abstimmung mit dem Kunden. Inhalte stammen aus der bestehenden Website
faustgmbh.de (Firmengeschichte, Leistungen, Maschinenliste, Kontaktdaten) und aus der dortigen
Bildergalerie.

## Bewusst gesetzte Platzhalter
- Projekt-Bildunterschriften beschreiben nur, was auf dem Foto zu sehen ist. Echte Projektnamen,
  Orte, Bauzeiten und Auftraggeber fehlen und müssen vom Kunden kommen.
- Impressum und Datenschutz sind nicht hinterlegt.
- Das Kontaktformular öffnet das E-Mail-Programm (`mailto:`). Für den Livegang braucht es einen
  serverseitigen Versand.
- Keine Kundenstimmen, weil keine belegten vorliegen.

## Technik
Reines HTML, CSS und JavaScript ohne Framework und ohne Build. Schriften über Google Fonts
(Archivo, IBM Plex Sans, IBM Plex Mono), Bilder als WebP.

- `index.html` — gesamte Seite
- `styles.css` — Gestaltung
- `app.js` — Schichtaufbau, Projektfilter, Navigation, Zeitstrahl
- `assets/` — Bilder aus dem Bestand des Kunden

Lokal ansehen: `python3 -m http.server 8000` im Projektordner, dann http://localhost:8000

Die Seite ist per `robots.txt` und `noindex` von Suchmaschinen ausgenommen.
