# MindTracker

En digital app för att hantera social ångest genom strukturerade exponeringsövningar. Byggd som del av en mjukvaruutvecklingskurs på Linnéuniversitetet.

## Vad det är

MindTracker är tänkt som ett digitalt alternativ till pappersformulär som används i KBT-behandling för social ångest. Du kan skapa personliga exponeringsövningar, planera utmaningar och följa dina framsteg över tid.

**OBS:** Det här ersätter inte professionell behandling - det är bara ett komplement.

## Funktioner

**Exponeringsmodul:**
- Skapa mallar för övningar med olika svårighetsgrad (1-10)
- Planera konkreta övningar med plats och datum  
- Registrera förväntad och faktisk ångestnivå
- Reflektera över upplevelser efter genomförda övningar

**Användarhantering:**
- Säker registrering och inloggning
- Ta bort konto och data

**Framstegsspårning:**
- Enkla grafer som visar utveckling över tid
- Statistik över genomförda övningar

## Teknik

- **Backend:** Node.js med Express
- **Databas:** MongoDB 
- **Frontend:** EJS-templates med Tailwind CSS
- **Säkerhet:** bcrypt, sessioner, CSRF-skydd
- **Deployment:** Docker på DigitalOcean med NGINX och HTTPS

## Kom igång

### Förutsättningar
- Node.js (v18+)
- MongoDB
- Docker (för containersetup)

### Installation

```bash
git clone https://github.com/jakobher/mindtracker.git
cd mindtracker
npm install
cp .env.example .env
# Redigera .env med dina inställningar
npm run dev
```

### Med Docker
```bash
docker-compose up -d
```

## Status

Applikationen fungerar som tänkt för exponeringsövningar. Kärnfunktionaliteten är klar men det finns förbättringsområden:

**Vad som fungerar:**
- Skapa och hantera exponeringsövningar
- Säker användarhantering  
- Grundläggande framstegsspårning
- HTTPS-deployment på egen domän

**Vad som kan förbättras:**
- Tailwind CSS körs via CDN (borde optimeras)
- Tankeutmanare-modul planerades men hinns inte med
- Prestandaoptimering för större användarbas

Se [detaljerad statusrapport](länk-till-wiki) för mer info.

## Live-demo

Applikationen körs på https://mindtracker.se

## Utveckling

Det här byggdes som ett individuellt projekt i kursen "Mjukvaruutvecklingsprojekt" (1DV613) på Linnéuniversitetet. Utvecklingen följde agila metoder med iterativ utveckling över 8 veckor.

## Licens

MIT License - se [LICENSE](LICENSE) för detaljer.

## Environment-variabler

Kopiera `.env.example` till `.env` och anpassa värdena:

```env
PORT=3000
DB_CONNECTION_STRING=mongodb://localhost:27017/mindtracker
NODE_ENV=development
SESSION_SECRET=din-hemliga-nyckel
SESSION_NAME=mindtracker_session
BASE_URL=/
```

## Testning

```bash
npm test
```

Både manuella testfall och automatiserade Jest-tester finns dokumenterade i projektet.

## Projektstruktur

```
src/
├── config/          # Databas och sessionskonfiguration  
├── controllers/     # Request handlers
├── middleware/      # Authentication och felhantering
├── models/          # MongoDB schemas
├── routes/          # Express routes
├── views/           # EJS templates
└── tests/           # Testfiler
```
