# Deploying to Vercel

This project uses Vercel's container deployment with FrankenPHP. Production data must live in an external PostgreSQL database; the local SQLite file is intentionally excluded from the container.

## 1. Connect the GitHub repository

In Vercel, create a project and import `dev-francis60/Activity-Tracker`. Keep the project root set to the repository root. The checked-in `vercel.json` and `Dockerfile.vercel` provide the container setup. Do not set a static output directory or replace the build settings.

## 2. Create a production PostgreSQL database

Create a PostgreSQL database through a Vercel Marketplace integration or another hosted PostgreSQL provider. Add these variables to Vercel's **Production** environment. Use the credentials supplied by the provider:

| Variable | Value |
| --- | --- |
| `APP_NAME` | `Activity Tracker` |
| `APP_KEY` | A stable key generated with `php artisan key:generate --show` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | The deployed Vercel URL, including `https://` |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | Database host |
| `DB_PORT` | `5432` unless the provider says otherwise |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_SSLMODE` | `require` when required by the provider |
| `SESSION_DRIVER` | `database` |
| `SESSION_SECURE_COOKIE` | `true` |
| `CACHE_STORE` | `database` |
| `QUEUE_CONNECTION` | `sync` |
| `LOG_CHANNEL` | `stderr` |

Never commit `.env` or put secrets in `vercel.json`. Keep the production `APP_KEY` unchanged between deployments.

## 3. Initialize the production database

The first production database starts empty; local SQLite data is not copied automatically. Once the project is linked with `vercel link` and its production variables and database are ready, run the migration command against that production database before relying on the deployment. Migrations should run as a separate release step, not when Vercel starts an application instance.

```powershell
vercel env run -e production -- php artisan migrate --force
```

This uses Vercel's production environment variables directly and requires the local PHP CLI to have its PostgreSQL PDO extension enabled. The session-table migration is included because this app uses database-backed sessions. Re-run migrations after deploying any future migration files.

## 4. Deploy

Push the deployment configuration to GitHub, then deploy the connected `main` branch from Vercel. Vercel will build the FrankenPHP container and create a production URL. Check the deployment logs if the container fails to start.

Activity data, accounts, sessions, and cache will use PostgreSQL. Files written to the container are temporary; configure external object storage before adding persistent uploads.
