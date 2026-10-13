# CinePass — React + Vite + Express + MySQL

CinePass is a single-repository project: the Vite frontend is built by Vercel, while the Express API and MySQL database run on Railway. Both deployments use this repository's root directory; do not set a `frontend/` or `backend/` root directory for this version of the project.

## Project structure

- `src/` — React + TypeScript frontend
- `server/server.js` — Express API
- `sql/schema_seed.sql` — local MySQL schema and demo data (creates `MOVIE_BOOKING_SYSTEM`)
- `sql/railway_schema_seed.sql` — Railway-compatible schema and demo data (uses the database already provisioned by Railway)
- `.env.example` — safe local configuration template; copy it to `.env` for development

## Before deploying

Requirements: Node.js 20.19+ and npm. A MySQL 8-compatible database is required for database-backed features.

1. Copy `.env.example` to `.env` in the repository root.
2. Fill in local MySQL values in `.env`. The `.env` file is ignored by Git; never commit it.
3. Install dependencies and build the frontend:

   ```bash
   npm ci
   npm run build
   ```

4. Load the schema into your local MySQL server by running `sql/schema_seed.sql` only on a disposable/demo database. **It drops and recreates the CinePass tables.**
5. Start the backend in one terminal:

   ```bash
   npm start
   ```

6. Start the Vite dev server in another terminal:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`. API health is at `http://localhost:5000/api/health`; the Railway-style liveness endpoint is `http://localhost:5000/health`.

## Deploy the backend and database on Railway

### 1. Create the MySQL database

1. Create a project on Railway and add a MySQL database service.
2. Wait for it to become healthy.
3. In the MySQL service, identify the variables `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, and `MYSQLDATABASE`.
4. Open the database with Railway's provided connection method or a MySQL client. Select the database named by `MYSQLDATABASE` and run `sql/railway_schema_seed.sql` against that database.

   **Warning:** `sql/railway_schema_seed.sql` drops/recreates the app's tables and inserts demo rows. Run it only against a fresh/demo database. It does not create another database; this is intentional for Railway-managed MySQL permissions.

### 2. Deploy Express

1. In Railway, add a service from the same GitHub repository.
2. Keep the service root directory at the repository root (leave the Root Directory setting blank/default).
3. Set the build command to `npm ci` if not auto-detected.
4. Set the start command to `npm start`.
5. Add these variable references on the **backend service**. If your Railway database service is named `MySQL`, use the sample expressions below; otherwise replace `MySQL` with its exact service name:

   | Variable name | Railway value |
   |---|---|
   | `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
   | `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
   | `DB_USER` | `${{MySQL.MYSQLUSER}}` |
   | `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
   | `DB_NAME` | `${{MySQL.MYSQLDATABASE}}` |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | Add after deploying the frontend, e.g. `https://your-project.vercel.app` |

   You may instead use Railway's `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, and `MYSQLDATABASE` variable references directly, because the server supports both names. Do not paste credentials into the source code or into frontend variables.

6. Set the Railway healthcheck path to `/health` if you want Railway to check the running API process during deployments. The database-aware check is `/api/health`.
7. Deploy and generate a public domain for the backend service.
8. Verify `https://YOUR-RAILWAY-DOMAIN/health` returns `{"status":"ok","service":"cinepass-api"}` and `https://YOUR-RAILWAY-DOMAIN/api/health` reports that the database is connected.

Railway injects the runtime `PORT`; the server listens on `PORT` and binds to `0.0.0.0`. Do not hard-code a production port.

## Deploy the frontend on Vercel

1. Import the same GitHub repository in Vercel.
2. Set the Root Directory to the repository root (do not choose a `frontend` folder; the actual Vite project is at the root).
3. Use these settings:

   | Setting | Value |
   |---|---|
   | Framework preset | Vite |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Output directory | `dist` |

4. In Vercel → Project Settings → Environment Variables, add `VITE_API_URL` with the full Railway backend origin and `/api`, for example `https://YOUR-RAILWAY-DOMAIN/api`.
5. Apply it to Production (and Preview if needed), then deploy/redeploy.
6. Copy the actual Vercel production origin (no trailing slash) into Railway's `FRONTEND_URL` variable, for example `https://your-project.vercel.app`, and redeploy the Railway backend.

`VITE_API_URL` is bundled into browser code. Never put MySQL credentials, private keys, or passwords in any `VITE_*` variable. CORS is limited to the configured frontend origin(s); set `CORS_ORIGINS` to a comma-separated list if you need more than one allowed origin.

## Environment variables

### Local `.env`

Start by copying `.env.example` to `.env`. Change `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT` to your local MySQL settings. `VITE_API_URL=http://localhost:5000/api` and `FRONTEND_URL=http://localhost:3000` are the local defaults.

### Production

Set database credentials on Railway's backend service only. Either use the `DB_*` names with Railway variable references or expose the corresponding Railway `MYSQL*` names. Set `FRONTEND_URL` to the Vercel production origin. Set `VITE_API_URL` on Vercel to the Railway API URL ending in `/api`.

The code also accepts a `DATABASE_URL` or `MYSQL_URL` in `mysql://...` format on the backend. Use one connection method consistently.

## Verification checklist

- `npm ci` completes.
- `npm run build` completes.
- Railway `/health` returns HTTP 200.
- Railway `/api/health` returns database connected.
- Railway `/api/movies` returns the demo movie rows.
- The Vercel homepage loads and browser DevTools → Network shows successful API requests.
- Test booking and cancellation only against the demo database; this project simulates payment and does not charge a real payment provider.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API-process liveness check |
| GET | `/api/health` | MySQL connectivity check |
| GET | `/api/movies` | List movies |
| GET | `/api/movies/:movieId/shows` | Showtimes by movie |
| GET | `/api/shows/:showId/seats` | Seat availability for a show |
| POST | `/api/bookings` | Save a booking, simulated payment, and tickets transactionally |
| DELETE | `/api/bookings/:bookingId` | Cancel a booking and delete related rows |
| GET | `/api/reports/*` | Demo SQL reports |

## Important limitations and safety notes

- Booking payments are simulated; the API does not charge real money. Do not represent this project as a production payment processor.
- The seed scripts include sample records and intentionally drop/recreate tables. Back up real data and do not run the seed on a live database.
- Use Railway's environment variables for secrets. If a real credential was ever stored in or committed from a `.env` file, rotate it.
- The UI includes mock content for some presentation elements even though movies, showtimes, seats, bookings, and report routes are connected to the database.
