# [Live version](https://vibedrop-backend.cc25.chasacademy.dev/)

# Vibedrop Backend – Användarguide

Den här guiden hjälper dig att installera, konfigurera och köra backend för Vibedrop. Den täcker även arbetsflöde, miljövariabler och vanliga kommandon.

## Innehåll
- [Förutsättningar](#förutsättningar)
- [Installation](#installation)
- [Miljövariabler (.env)](#miljovariabler-env)
- [Utvecklingsläge](#utvecklingsläge)
- [Bygga och köra i produktion](#bygga-och-kora-i-produktion)
- [Struktur och viktiga mappar](#struktur-och-viktiga-mappar)
- [Användbara npm-skript](#anvandbara-npm-skript)
- [Felsökning](#felsokning)
- [Ytterligare dokumentation](#ytterligare-dokumentation)

## Förutsättningar

- Node.js (rekommenderad version: 18.x eller senare)
- npm (medföljer Node.js)
- Git
- PostgreSQL-databas

## Installation

1. Klona repot:
   ```bash
   git clone https://git.chasacademy.dev/chas-challenge-2025/vibedrop/backend.git
   ```
2. Gå in i projektmappen:
   ```bash
   cd backend
   ```
3. Installera beroenden:
   ```bash
   npm install
   ```

## Miljövariabler (.env)

1. Skapa en `.env`-fil i `backend`-mappen.
2. Lägg till variablerna enligt exemplet nedan.
Exempel:
   ```env
   DATABASE_URL=
   JWT_SECRET=
   SUPABASE_BUCKET_NAME=
   SUPABASE_URL=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
3. Spara filen. Miljövariabler används för databas, autentisering, tredjepartstjänster m.m.

## Utvecklingsläge

> **Viktigt:** Backend måste alltid köras på port 3000 för att frontend och andra tjänster ska kunna kommunicera korrekt!

Starta utvecklingsservern:
```bash
npm run dev
```
- Servern körs på [http://localhost:3000](http://localhost:3000) om inget annat anges i `.env`.
- Koden laddas om automatiskt vid ändringar (via nodemon).

## Bygga och köra i produktion

Bygg projektet:
```bash
npm run build
```
Starta produktionen:
```bash
npm start
```

## Struktur och viktiga mappar

- `src/` – All källkod för backend.
  - `controllers/` – API-logik och endpoints.
  - `middleware/` – Express-middleware för autentisering, validering m.m.
  - `routes/` – API-routes.
  - `utilities/` – Hjälpfunktioner och externa integrationer.
- `prisma/` – Prisma schema och migrationer.

## Användbara npm-skript

- `npm run dev` – Startar utvecklingsservern med nodemon.
- `npm run build` – Bygger TypeScript till JavaScript.
- `npm start` – Startar den byggda appen i produktionsläge.
- `npm run lint` – Kör ESLint för att hitta kodproblem.
- `npm run prisma` – Prisma CLI-kommandon (t.ex. migrationer).

## Felsökning

- Kontrollera att `.env`-filen är korrekt ifylld.
- Kontrollera att alla beroenden är installerade (`npm install`).
- Kontrollera att databasen är igång och att `DATABASE_URL` stämmer.
- Läs konsolens felmeddelanden för mer information.
- Vid problem med Prisma, testa:
  ```bash
  npx prisma generate
  npx prisma migrate dev
  ```

## Ytterligare dokumentation

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Chas Academy GitLab](https://git.chasacademy.dev/chas-challenge-2025/vibedrop/backend)
