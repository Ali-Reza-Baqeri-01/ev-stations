# EV Stations

Applicazione full stack per la consultazione di una rete di colonnine di ricarica per veicoli elettrici in Italia: lista con ricerca e mappa, più una pagina di dettaglio per ogni stazione.

> Versione in inglese: [README.en.md](./README.en.md)

---

## Opzione scelta

**Opzione B — Sviluppo Full Stack con NestJS + MongoDB.**

Il backend è stato realizzato da zero: database MongoDB via Docker, applicazione NestJS strutturata in Controller / Service / Module e collegata al database tramite `@nestjs/mongoose`, con CORS configurato per il client Vue.

---

## Stack

| Ambito   | Tecnologie                                                    |
| -------- | ------------------------------------------------------------- |
| Frontend | Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, Vue Router 4, Leaflet |
| Backend  | NestJS, TypeScript, Mongoose (`@nestjs/mongoose`)              |
| Database | MongoDB 7 (Docker)                                             |

---

## Prerequisiti

- [Node.js](https://nodejs.org) 20 o superiore
- [Docker](https://www.docker.com/products/docker-desktop/) con Docker Compose

---

## Avvio in locale

Tre passaggi, da eseguire in tre terminali distinti (o i primi due in background).

### 1. Avviare il database

Dalla radice del progetto:

```bash
docker compose up -d
```

Solleva un'istanza MongoDB sulla porta `27017`. Per verificare che sia attiva:

```bash
docker compose ps
```

### 2. Avviare il server

```bash
cd server
npm install
npm run start:dev
```

Il server risponde su `http://localhost:3000`.

Al primo avvio, se la collezione è vuota, vengono inseriti automaticamente 52 record di prova (seed). Non è necessario eseguire alcuno script aggiuntivo.

### 3. Avviare il client

```bash
cd client
npm install
npm run dev
```

L'applicazione è disponibile su `http://localhost:5173`.

Per fermare il database al termine: `docker compose down` (aggiungere `-v` per eliminare anche i dati).

---

## API

Base URL: `http://localhost:3000`

| Metodo | Rotta            | Descrizione                                          |
| ------ | ---------------- | ---------------------------------------------------- |
| `GET`  | `/stations`      | Restituisce l'elenco completo delle stazioni         |
| `GET`  | `/stations/:id`  | Restituisce il dettaglio di una stazione             |

Un `id` inesistente restituisce `404 Not Found` con un messaggio descrittivo.

### Parametri di query (facoltativi)

`GET /stations` accetta due parametri opzionali, validati tramite DTO e `class-validator`:

| Parametro | Valori                                  | Descrizione                                      |
| --------- | --------------------------------------- | ------------------------------------------------ |
| `search`  | testo libero (max 100 caratteri)        | Filtra per nome, operatore o città               |
| `status`  | `available`, `occupied`, `offline`      | Filtra per stato della stazione                  |

Esempio: `GET /stations?search=roma&status=available`

Un valore non ammesso restituisce `400 Bad Request` con un messaggio descrittivo. Il filtro di ricerca del frontend resta lato client, come da traccia; i parametri di query sono un'aggiunta lato API.

### Nota sul naming delle rotte

La traccia indicava `GET /posts` e `GET /posts/:id`, denominazione ereditata dall'Opzione A (JSONPlaceholder). Poiché il dominio applicativo è quello delle colonnine di ricarica, le rotte sono state rinominate in `/stations` e `/stations/:id`: la struttura e il comportamento richiesti restano invariati, cambia solo il nome della risorsa in modo coerente con i dati esposti.

### Esempio di risposta

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

Le coordinate seguono la convenzione GeoJSON: `[longitudine, latitudine]`.

---

## Funzionalità

### Pagina lista (`/`)

- Recupero dell'elenco via HTTP con gestione esplicita degli stati di caricamento, errore e risultato vuoto
- Filtro di ricerca testuale **lato client** su nome, operatore e città
- Layout responsive: su desktop lista e mappa affiancate (50/50), su mobile una sola vista alla volta con pulsante di scambio
- Mappa Leaflet con marker colorati per stato; la ricerca filtra contemporaneamente lista e marker
- Popup sul marker con collegamento alla pagina di dettaglio

### Pagina dettaglio (`/detail/:id`)

- Vue Router con parametro dinamico
- Recupero del dettaglio via HTTP tramite ID
- Dati organizzati in blocchi distinti: intestazione, metriche di sintesi, tabella connettori, tabella dettagli, mappa
- Collegamento esterno per aprire la posizione su Google Maps
- Pulsante "Torna alla lista"

### Gestione degli errori

- **404 di rotta**: URL non riconosciuti mostrano una pagina dedicata
- **404 di risorsa**: un ID inesistente mostra un messaggio nella pagina di dettaglio, con possibilità di riprovare
- **Errore di rete**: se il server non è raggiungibile viene mostrato un messaggio dedicato con pulsante di ripetizione

---

## Struttura del progetto

```
ev-stations/
├── docker-compose.yml          # MongoDB locale
├── server/                     # API NestJS
│   ├── .env.example
│   └── src/
│       ├── main.ts             # bootstrap, CORS
│       ├── app.module.ts       # modulo radice, connessione Mongoose
│       └── stations/
│           ├── stations.module.ts
│           ├── stations.controller.ts
│           ├── stations.service.ts
│           ├── schemas/        # schema Mongoose
│           └── data/           # dati di seed
└── client/                     # applicazione Vue 3
    ├── .env.example
    └── src/
        ├── api/                # chiamate HTTP
        ├── composables/        # logica riutilizzabile (fetch, stato, filtro)
        ├── components/         # componenti di presentazione
        ├── views/              # pagine associate alle rotte
        ├── router/
        ├── types/              # interfacce TypeScript
        └── utils/
```

### Scelte architetturali

**Separazione tra viste e componenti.** Le viste orchestrano (recuperano i dati, scelgono quale stato mostrare); i componenti ricevono props ed emettono eventi, senza conoscere né rotte né chiamate HTTP.

**Composables per lo stato asincrono.** `useStations` e `useStation` incapsulano fetch, stato di caricamento, errore e — per la lista — il filtro di ricerca come `computed`. La stessa logica non viene duplicata tra le pagine.

**Il service come punto di astrazione.** Il controller NestJS non conosce Mongoose: espone le rotte e delega al service, che è l'unico punto in cui il database viene interrogato.

---

## Configurazione (facoltativa)

L'applicazione funziona senza alcuna configurazione: tutti i valori hanno un default coerente con l'ambiente locale descritto sopra.

Per personalizzarli, copiare i file di esempio:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

| Variabile      | Ambito | Default                                  |
| -------------- | ------ | ---------------------------------------- |
| `PORT`         | server | `3000`                                   |
| `MONGODB_URI`  | server | `mongodb://localhost:27017/ev-stations`  |
| `CORS_ORIGIN`  | server | `http://localhost:5173`                  |
| `VITE_API_URL` | client | `http://localhost:3000`                  |

---

## Note

- I dati di seed sono fittizi e generati a scopo dimostrativo.
- Le tile della mappa provengono da [OpenStreetMap](https://www.openstreetmap.org/copyright) e non richiedono chiave API.
- Il seed è idempotente: viene eseguito solo se la collezione è vuota, quindi i riavvii non duplicano i record.