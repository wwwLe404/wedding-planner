# Wedding Planner 💍

Eine Webanwendung zur Planung und Verwaltung von Hochzeiten. Brautpaare können Hochzeiten anlegen, ihre Gästeliste verwalten, Aufgaben organisieren und das Wetter für den Hochzeitsort abrufen.

---

## Architekturübersicht

```
┌─────────────────┐        API        ┌──────────────────────┐        API        ┌─────────────────────┐
│   FRONTEND      │ ◄───────────────► │   BACKEND            │ ◄───────────────► │   DRITTANBIETER     │
│   (React/Vite)  │                   │   (Spring Boot)      │                   │   (Open-Meteo API)  │
└─────────────────┘                   │          │           │                   └─────────────────────┘
                                      │          ▼           │
                                      │   ┌─────────────┐   │
                                      │   │     DB      │   │
                                      │   │ (PostgreSQL)│   │
                                      │   └─────────────┘   │
                                      └──────────────────────┘
```

### Komponenten

- **Frontend** — React (Vite), kommuniziert ausschließlich über REST-API mit dem Backend, läuft auf Port 3000
- **Backend** — Java 21, Spring Boot 3.4.5, REST-API mit Spring Data JPA, läuft auf Port 8080
- **Datenbank** — PostgreSQL 16 (läuft via Docker), wird ausschließlich vom Backend angesprochen
- **Drittanbieter** — [Open-Meteo](https://open-meteo.com/) für kostenlose Wettervorhersagen, wird vom Backend aufgerufen (kein API-Key nötig)

### Entitäten & Beziehungen

- `WeddingPlan` — Hochzeitsplan mit Partnernamen, Paarname, Ort und Datum
- `Guest` — Gast mit Zusagestatus (`ATTENDING` / `NOT_ATTENDING` / `PENDING`), Verhältnis, Essenswünschen und Unterkunftsbedarf *(ManyToOne → WeddingPlan)*
- `Task` — Aufgabe mit Titel, Notizen und Erledigungsstatus *(ManyToOne → WeddingPlan)*

---

## Voraussetzungen

- Java 21
- Maven (oder mitgeliefertes `mvnw` / `mvnw.cmd`)
- Node.js 18+
- Docker (für PostgreSQL)

---

## Lokale Anwendung starten

### 1. Datenbank starten

**Windows (PowerShell):**
```powershell
docker-compose up -d
```

**Mac / Linux:**
```bash
docker-compose up -d
```

Startet PostgreSQL 16 auf Port `5432` mit:
- Datenbank: `weddingplanner`
- Benutzer: `wedding`
- Passwort: `wedding`

---

### 2. Backend starten

**Windows (PowerShell):**
```powershell
.\mvnw spring-boot:run
```

**Mac / Linux:**
```bash
./mvnw spring-boot:run
```

Das Backend läuft auf `http://localhost:8080`.
Swagger UI ist erreichbar unter: `http://localhost:8080/swagger-ui/index.html`

---

### 3. Frontend starten

**Windows (PowerShell):**
```powershell
cd wedding-frontend
npm install
npm run dev
```

**Mac / Linux:**
```bash
cd wedding-frontend
npm install
npm run dev
```

Das Frontend läuft auf `http://localhost:3000` und leitet alle `/api`-Anfragen automatisch an das Backend weiter.

---

## Tests ausführen

**Windows (PowerShell):**
```powershell
.\mvnw test
```

**Mac / Linux:**
```bash
./mvnw test
```

Die Tests verwenden eine H2 In-Memory-Datenbank — es wird kein laufendes PostgreSQL benötigt.

---

## API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|--------|----------|--------------|
| GET | `/api/wedding-plans` | Alle Hochzeiten abrufen |
| POST | `/api/wedding-plans` | Neue Hochzeit anlegen |
| GET | `/api/wedding-plans/{id}` | Einzelne Hochzeit abrufen |
| PUT | `/api/wedding-plans/{id}` | Hochzeit aktualisieren |
| DELETE | `/api/wedding-plans/{id}` | Hochzeit löschen |
| GET | `/api/wedding-plans/{id}/guests` | Gäste einer Hochzeit abrufen |
| GET | `/api/wedding-plans/{id}/tasks` | Aufgaben einer Hochzeit abrufen |
| GET | `/api/guests` | Alle Gäste abrufen |
| POST | `/api/guests` | Neuen Gast anlegen |
| GET | `/api/guests/{id}` | Einzelnen Gast abrufen |
| PUT | `/api/guests/{id}` | Gast aktualisieren |
| DELETE | `/api/guests/{id}` | Gast löschen |
| POST | `/api/guests/wedding-plan/{id}` | Gast direkt zu einer Hochzeit anlegen |
| GET | `/api/tasks` | Alle Aufgaben abrufen |
| POST | `/api/tasks` | Neue Aufgabe anlegen |
| GET | `/api/tasks/{id}` | Einzelne Aufgabe abrufen |
| PUT | `/api/tasks/{id}` | Aufgabe aktualisieren |
| DELETE | `/api/tasks/{id}` | Aufgabe löschen |
| POST | `/api/tasks/wedding-plan/{id}` | Aufgabe direkt zu einer Hochzeit anlegen |
| GET | `/api/weather?city={city}` | Wettervorhersage für einen Ort abrufen |

Die vollständige API-Dokumentation ist über Swagger UI verfügbar:
`http://localhost:8080/swagger-ui/index.html`

---

## Verwendete Drittanbieter-API

### Open-Meteo
- **URL:** https://open-meteo.com/
- **Kosten:** Kostenlos, kein API-Key erforderlich
- **Verwendung:** Das Backend ruft Open-Meteo auf um Wettervorhersagen für den Hochzeitsort abzurufen (aktuelle Temperatur, Luftfeuchtigkeit, Windgeschwindigkeit, 5-Tage-Vorschau)
- **Geocoding:** `https://geocoding-api.open-meteo.com/v1/search` — Stadtname → Koordinaten
- **Wetterdaten:** `https://api.open-meteo.com/v1/forecast` — Koordinaten → Wetterdaten

---

## Für die Abgabe: Frontend in Backend integrieren

**Windows (PowerShell):**
```powershell
cd wedding-frontend
npm run build
xcopy /E /I dist ..\src\main\resources\static
```

**Mac / Linux:**
```bash
cd wedding-frontend
npm run build
cp -r dist/* ../src/main/resources/static/
```

Danach ist die gesamte Anwendung unter `http://localhost:8080` erreichbar — kein separates Frontend nötig.
