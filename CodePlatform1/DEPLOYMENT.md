# VEXOR Deployment Guide

## Production Build

### Option 1: Using the Build Script (Recommended)

```bash
# Run the production build script
./scripts/build-production.sh
```

This script will:
1. Build the frontend with Vite
2. Build the backend with esbuild
3. Copy necessary data files to the dist directory

### Option 2: Manual Build

If you need to manually run the build steps:

```bash
# Build frontend
vite build

# Build backend
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Copy data files
mkdir -p dist/seeds/data
cp -r server/seeds/data/* dist/seeds/data/
```

### Option 3: Update package.json (If Allowed)

Replace the build script in package.json with:

```json
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist && mkdir -p dist/seeds/data && cp -r server/seeds/data/* dist/seeds/data/"
```

## Code Changes Made

The following file was updated to handle both development and production environments:

- `server/seeds/playbookLibrarySeed.ts` - Now checks multiple locations for playbooks.json:
  1. Bundled production path (`dist/seeds/data/playbooks.json`)
  2. Development path (`server/seeds/data/playbooks.json`)
  3. Alternative production path

This ensures the application works correctly whether running in development or production mode.

## Starting Production

After building, start the production server:

```bash
npm start
```

## Environment Variables

Make sure the following environment variables are set in production:

- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `SESSION_SECRET` - Session encryption key
- `INTEGRATION_ENCRYPTION_KEY` - Integration credentials encryption key (generate with: `openssl rand -hex 32`)

## Deployment Checklist

- [ ] Build the application using one of the methods above
- [ ] Verify `dist/seeds/data/playbooks.json` exists
- [ ] Set all required environment variables
- [ ] Run database migrations if needed (`npm run db:push`)
- [ ] Start the production server
- [ ] Verify the application starts without errors
- [ ] Test that all 7 demos are accessible and working
