# BloodCare

BloodCare is a Next.js app for connecting blood donors, hospitals, and patients with a modern static-first experience.

## Features

- Static marketing and informational pages with SSG
- Donation registration flow
- Firebase-backed authentication and data handling
- Jest testing setup for API and UI coverage
- Docker support with Redis and Nginx

## Run locally

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Production build

```bash
npm run build
node .next/standalone/server.js
```

## Tests

```bash
npm test -- --runInBand
```

## Docker

```bash
docker compose up --build
```

The app will be available on http://localhost:8080.
