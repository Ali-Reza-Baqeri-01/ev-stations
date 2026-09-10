# EV Stations

Full stack application for browsing a network of EV charging stations in Italy: a searchable list with a map, plus a detail page for each station.

> Italian version (main): [README.md](./README.md)

---

## Chosen option

**Option B — Full Stack with NestJS + MongoDB.**

The backend was built from scratch: a MongoDB database via Docker, a NestJS application structured as Controller / Service / Module and connected through `@nestjs/mongoose`, with CORS configured for the Vue client.

---

## Stack

| Layer    | Technologies                                                  |
| -------- | ------------------------------------------------------------- |
| Frontend | Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, Vue Router 4, Leaflet |
| Backend  | NestJS, TypeScript, Mongoose (`@nestjs/mongoose`)             |
| Database | MongoDB 7 (Docker)                                             |

---

## Prerequisites

- [Node.js](https://nodejs.org) 20 or later
- [Docker](https://www.docker.com/products/docker-desktop/) with Docker Compose

---

## Running locally

Three steps, in three separate terminals (or the first two in the background).

### 1. Start the database

From the project root:

```bash
docker compose up -d
```

This brings up a MongoDB instance on port `27017`. To check it is running:

```bash
docker compose ps
```

### 2. Start the server

```bash
cd server
npm install
npm run start:dev
```

The server listens on `http://localhost:3000`.

On first start, if the collection is empty, 52 sample records are inserted automatically. No extra script needs to be run.

### 3. Start the client

```bash
cd client
npm install
npm run dev
```

The application is available at `http://localhost:5173`.

To stop the database afterwards: `docker compose down` (add `-v` to remove the stored data as well).

---

## API

Base URL: `http://localhost:3000`

| Method | Route            | Description                       |
| ------ | ---------------- | --------------------------------- |
| `GET`  | `/stations`      | Returns the full list of stations |
| `GET`  | `/stations/:id`  | Returns a single station          |

An unknown `id` returns `404 Not Found` with a descriptive message.

### Query parameters (optional)

`GET /stations` accepts two optional parameters, validated with a DTO and `class-validator`:

| Parameter | Values                             | Description                          |
| --------- | ---------------------------------- | ------------------------------------ |
| `search`  | free text (max 100 characters)     | Filters by name, operator or city    |
| `status`  | `available`, `occupied`, `offline` | Filters by station status            |

Example: `GET /stations?search=roma&status=available`

An invalid value returns `400 Bad Request` with a descriptive message. The frontend search filter remains client-side as specified in the brief; these query parameters are an API-level addition.

### A note on route naming

The brief specified `GET /posts` and `GET /posts/:id`, a naming inherited from Option A (JSONPlaceholder). Since the domain here is EV charging stations, the routes were renamed to `/stations` and `/stations/:id`. The required structure and behaviour are unchanged — only the resource name differs, to stay consistent with the data being exposed.

### Sample response

```json
{
  "id": "68c1a3f21b4e5d7a9c0f1234",
  "name": "Ostiense Hub",
  "operator": "Be Charge",
  "status": "available",
  "address": {
    "street": "Via Ostiense 82",
    "city": "Roma",
    "postalCode": "00184",
    "country": "IT"
  },
  "location": {
    "type": "Point",
    "coordinates": [12.541886, 41.930462]
  },
  "connectors": [{ "type": "CCS", "powerKw": 350, "count": 4 }],
  "pricePerKwh": 0.65,
  "currency": "EUR",
  "openingHours": "06:00 - 23:00"
}
```

Coordinates follow the GeoJSON convention: `[longitude, latitude]`.

---

## Features

### List page (`/`)

- Fetches the list over HTTP with explicit loading, error and empty states
- **Client-side** text search across name, operator and city
- Responsive layout: list and map side by side (50/50) on desktop, one view at a time on mobile with a toggle button
- Leaflet map with status-coloured markers; the search filters list and markers together
- Marker popup with a link through to the detail page

### Detail page (`/detail/:id`)

- Vue Router with a dynamic parameter
- Fetches the station by ID over HTTP
- Data organised into distinct blocks: header, summary metrics, connectors table, details table, map
- External link to open the location in Google Maps
- "Back to list" button

### Error handling

- **Route 404**: unrecognised URLs render a dedicated page
- **Resource 404**: an unknown ID shows a message on the detail page, with a retry option
- **Network error**: if the server is unreachable, a dedicated message is shown with a retry button

---

## Project structure

```
ev-stations/
├── docker-compose.yml          # local MongoDB
├── server/                     # NestJS API
│   ├── .env.example
│   └── src/
│       ├── main.ts             # bootstrap, CORS
│       ├── app.module.ts       # root module, Mongoose connection
│       └── stations/
│           ├── stations.module.ts
│           ├── stations.controller.ts
│           ├── stations.service.ts
│           ├── schemas/        # Mongoose schema
│           └── data/           # seed data
└── client/                     # Vue 3 application
    ├── .env.example
    └── src/
        ├── api/                # HTTP calls
        ├── composables/        # reusable logic (fetch, state, filtering)
        ├── components/         # presentational components
        ├── views/              # route-level pages
        ├── router/
        ├── types/              # TypeScript interfaces
        └── utils/
```

### Architectural decisions

**Views versus components.** Views orchestrate — they fetch data and decide which state to render; components take props and emit events, knowing nothing about routes or HTTP.

**Composables for async state.** `useStations` and `useStation` encapsulate fetching, loading state, errors and — for the list — the search filter as a `computed`. The same logic is not duplicated across pages.

**The service as the abstraction point.** The NestJS controller knows nothing about Mongoose: it exposes the routes and delegates to the service, which is the only place the database is queried.

---

## Configuration (optional)

The application runs with no configuration: every value has a default matching the local setup described above.

To customise them, copy the example files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

| Variable       | Scope  | Default                                  |
| -------------- | ------ | ---------------------------------------- |
| `PORT`         | server | `3000`                                   |
| `MONGODB_URI`  | server | `mongodb://localhost:27017/ev-stations`  |
| `CORS_ORIGIN`  | server | `http://localhost:5173`                  |
| `VITE_API_URL` | client | `http://localhost:3000`                  |

---

## Notes

- The seed data is fictional and generated for demonstration purposes.
- Map tiles come from [OpenStreetMap](https://www.openstreetmap.org/copyright) and require no API key.
- The seed is idempotent: it only runs when the collection is empty, so restarts do not duplicate records.
