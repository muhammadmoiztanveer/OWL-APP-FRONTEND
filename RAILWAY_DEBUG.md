# Railway Frontend Debugging Guide

## Current Issue: 502 Bad Gateway / Application Failed to Respond

### Possible Reasons:

1. **Server not starting** - Check if server.js is running
2. **Server crashing on startup** - Check for runtime errors
3. **Wrong hostname binding** - Server binding to localhost instead of 0.0.0.0
4. **Missing dependencies** - Standalone build missing required packages
5. **Build not completing** - Build fails before start command runs
6. **Path issues** - Server can't find required files

## 🔍 How to Debug on Railway

### Step 1: Check Deployment Logs

Go to Railway Dashboard → Your Service → Deployments → Latest Deployment

**Look for:**
- ✅ `npm run build` completed successfully
- ✅ `npm run start` is running
- ✅ `✓ Ready in XXXms`
- ✅ `- Local: http://0.0.0.0:XXXX` (NOT localhost)

**Error signs:**
- ❌ `Error: Cannot find module`
- ❌ `Error: listen EADDRINUSE`
- ❌ `Failed to start server`
- ❌ `- Local: http://localhost:XXXX` (wrong!)

### Step 2: Check Service Logs

Go to Railway Dashboard → Your Service → Logs

**Look for:**
- Server startup messages
- Any error messages
- HTTP request logs

### Step 3: Verify Environment Variables

Go to Railway Dashboard → Your Service → Variables

**Must have:**
- `HOSTNAME=0.0.0.0` (CRITICAL!)
- `NEXT_PUBLIC_API_URL=https://owl-app-backend-production.up.railway.app/api`

**Check:**
- Are they actually set? (not just in .env.example)
- Are the values correct?
- No typos in variable names

### Step 4: Check Service Status

Railway Dashboard → Your Service

**Status should be:**
- ✅ "Running" (green dot)
- ❌ NOT "Failed" or "Stopped"

## 🛠️ Solutions to Try

### Solution 1: Set HOSTNAME Explicitly (MOST IMPORTANT)

1. Railway Dashboard → Variables
2. Add: `HOSTNAME=0.0.0.0`
3. Save and wait for redeploy

### Solution 2: Check Build Completes

In deployment logs, verify:
```
> minible-nextjs@3.3.0 build
> next build && cp -r public .next/standalone/ ...
✓ Build completed
```

If build fails, fix the build errors first.

### Solution 3: Verify Standalone Directory Exists

The start command needs `.next/standalone/server.js` to exist.

Check in deployment logs if:
- Build creates `.next/standalone/` directory
- `server.js` file exists in that directory

### Solution 4: Try Alternative Start Command

If current start command doesn't work, try in Railway Settings → Build:

**Start Command:**
```bash
cd .next/standalone && node server.js
```

Or:
```bash
NODE_ENV=production HOSTNAME=0.0.0.0 node .next/standalone/server.js
```

### Solution 5: Check for Missing Dependencies

If you see "Cannot find module" errors:
- The standalone build might be missing dependencies
- Try rebuilding: Railway will auto-rebuild on next deploy

### Solution 6: Verify Port Configuration

Railway sets `PORT` automatically. Don't override it.

The standalone server.js reads:
```javascript
const currentPort = parseInt(process.env.PORT, 10) || 3000
```

So it should work automatically.

## 📋 Complete Checklist

Run through this checklist:

- [ ] **HOSTNAME environment variable is set to `0.0.0.0`** in Railway Variables
- [ ] **NEXT_PUBLIC_API_URL is set** to your backend URL
- [ ] **Build completes successfully** (check deployment logs)
- [ ] **Start command runs** (check deployment logs)
- [ ] **Server shows "Ready"** in logs
- [ ] **Server binds to `0.0.0.0`** (NOT localhost)
- [ ] **Service status is "Running"** (green)
- [ ] **Domain is assigned** to this service
- [ ] **No errors in logs** after server starts

## 🚨 Most Common Issue

**90% of Railway 502 errors are caused by missing HOSTNAME variable.**

The server defaults to `0.0.0.0` in code, but Railway's environment might override it or the server might not be reading the default correctly.

**Fix:** Set `HOSTNAME=0.0.0.0` explicitly in Railway Variables.

## 📞 What to Share for Help

If still not working, share:

1. **Deployment logs** (from Railway Deployments tab)
2. **Service logs** (from Railway Logs tab)
3. **Environment variables** (screenshot of Variables tab)
4. **Service status** (Running/Failed/Stopped)
5. **Any error messages** you see

This will help identify the exact issue.
