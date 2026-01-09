# Railway Deployment Configuration

## Files Created/Modified

1. **`.npmrc`** - Configures npm to use legacy peer deps (handles picomatch conflict)
2. **`package-lock.json`** - Regenerated and synced properly
3. **`.env.example`** - Contains backend API URL

## Railway Configuration

### Option 1: Let Railway auto-detect (RECOMMENDED)
Railway should now work with the `.npmrc` file. The file tells npm to use `legacy-peer-deps=true` which will handle the picomatch dependency conflict.

### Option 2: Manual Configuration on Railway Dashboard
If Option 1 doesn't work, configure Railway manually:

1. Go to your Railway project settings
2. Navigate to **Variables** tab
3. Add these environment variables:
   - `NPM_CONFIG_LEGACY_PEER_DEPS=true`
   - `NEXT_PUBLIC_API_URL=https://owl-app-backend-production.up.railway.app/api`

4. In **Settings** → **Build**, you can optionally change:
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - (This overrides npm ci with npm install)

## What Was Fixed

- ✅ Created `.npmrc` with `legacy-peer-deps=true` to handle picomatch conflict
- ✅ Regenerated `package-lock.json` with both picomatch versions (2.3.1 and 4.0.3)
- ✅ Verified `npm ci` works locally
- ✅ Both files are not ignored by git and will be committed

## Deployment Steps

1. Commit all changes:
   ```bash
   git add .npmrc package-lock.json .env.example
   git commit -m "Fix Railway deployment: add .npmrc and regenerate package-lock.json"
   git push
   ```

2. Railway should auto-deploy. If it still fails, use Option 2 above.
