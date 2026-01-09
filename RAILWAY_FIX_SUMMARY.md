# Railway Frontend Deployment Fix - Summary

## ✅ Issues Fixed

### 1. **Start Script for Standalone Mode**
- **Problem**: `next start` doesn't work with `output: 'standalone'`
- **Solution**: Changed to `node .next/standalone/server.js`
- **File**: `package.json`

### 2. **Build Script - Static Files**
- **Problem**: Standalone mode doesn't include `public` and `.next/static` by default
- **Solution**: Build script now copies these files after build
- **File**: `package.json`

## 🔧 Railway Dashboard Configuration Required

### CRITICAL: Set These Environment Variables

Go to **Railway Dashboard → Your Frontend Service → Variables** tab and add:

#### 1. HOSTNAME (REQUIRED - This fixes the 502 error!)
```
Variable Name: HOSTNAME
Value: 0.0.0.0
```
**Why**: The standalone server needs to bind to `0.0.0.0` to accept external connections. Without this, it binds to `localhost` and Railway can't reach it.

#### 2. NEXT_PUBLIC_API_URL (Required)
```
Variable Name: NEXT_PUBLIC_API_URL
Value: https://owl-app-backend-production.up.railway.app/api
```
**Why**: Your frontend needs to know where your backend API is.

#### 3. PORT (DO NOT SET - Railway sets this automatically)
Railway automatically sets `PORT`. The standalone server.js reads it automatically.

## 📋 Step-by-Step Railway Configuration

1. **Go to Railway Dashboard**
   - https://railway.app/dashboard

2. **Select Your Frontend Service**
   - Click on the service that's showing 502 errors

3. **Go to Variables Tab**
   - Click on "Variables" in the left sidebar

4. **Add HOSTNAME Variable**
   - Click "New Variable"
   - Key: `HOSTNAME`
   - Value: `0.0.0.0`
   - Click "Add"

5. **Add NEXT_PUBLIC_API_URL Variable** (if not already set)
   - Click "New Variable"
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://owl-app-backend-production.up.railway.app/api`
   - Click "Add"

6. **Save and Wait**
   - Railway will automatically redeploy
   - Wait 2-3 minutes for deployment

7. **Check Logs**
   - Go to "Deployments" tab
   - Click on latest deployment
   - Look for: `✓ Ready in XXXms`
   - Should show it's listening on the correct port

8. **Test Your Domain**
   - Visit: `https://owl-app-frontend-production.up.railway.app/`
   - Should now load your frontend!

## 🔍 How to Verify It's Working

### Check Deployment Logs
Look for these lines in Railway deployment logs:
```
> minible-nextjs@3.3.0 start
> node .next/standalone/server.js
  ▲ Next.js 14.2.35
  - Local:        http://0.0.0.0:XXXX
 ✓ Ready in XXXms
```

**Note**: It should say `http://0.0.0.0:XXXX`, NOT `http://localhost:XXXX`

### Check HTTP Logs
After setting HOSTNAME, the HTTP logs should show:
- Status: `200` (instead of `502`)
- Response time: Normal (not timeout)

## 🐛 If Still Getting 502 Errors

### Checklist:
- [ ] HOSTNAME is set to `0.0.0.0` in Railway Variables
- [ ] NEXT_PUBLIC_API_URL is set correctly
- [ ] Build completed successfully (check deployment logs)
- [ ] Deployment shows "Ready" status
- [ ] Service status is "Running" (green) in Railway dashboard
- [ ] Domain is assigned to the correct service

### Common Issues:

1. **HOSTNAME not set**
   - Most common cause of 502 errors
   - Solution: Set `HOSTNAME=0.0.0.0` in Railway Variables

2. **Build failed**
   - Check deployment logs for errors
   - Solution: Fix build errors and redeploy

3. **Service crashed**
   - Check logs for runtime errors
   - Solution: Check application logs for errors

4. **Domain not assigned**
   - Check Settings → Networking
   - Solution: Ensure domain is assigned to this service

## 📝 Files Changed

1. `package.json` - Updated start and build scripts
2. `RAILWAY_ENV_VARS.md` - Environment variables guide
3. `RAILWAY_FIX_SUMMARY.md` - This file

## 🚀 Next Steps

1. **Commit changes:**
   ```bash
   git add package.json RAILWAY_ENV_VARS.md RAILWAY_FIX_SUMMARY.md
   git commit -m "Fix Railway standalone deployment: update start script and add env vars guide"
   git push
   ```

2. **Set HOSTNAME in Railway** (MOST IMPORTANT!)
   - Go to Railway Variables
   - Add `HOSTNAME=0.0.0.0`

3. **Wait for redeploy**

4. **Test your domain**

## ⚠️ IMPORTANT NOTE

The **HOSTNAME environment variable is the key fix** for the 502 errors. Without it set to `0.0.0.0`, the server binds to `localhost` and Railway cannot route traffic to it, resulting in 502 Bad Gateway errors.
