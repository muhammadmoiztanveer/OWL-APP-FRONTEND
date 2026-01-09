# 🚀 Railway Frontend Deployment - Complete Setup Guide

## ✅ Code Fixes Applied

1. **Start Script**: Changed to `node .next/standalone/server.js` (correct for standalone mode)
2. **Build Script**: Automatically copies `public` and `.next/static` to standalone directory
3. **Next.js Config**: Already has `output: 'standalone'` configured

## 🔧 CRITICAL: Railway Dashboard Configuration

### Step 1: Set Environment Variables

Go to **Railway Dashboard → Your Frontend Service → Variables** tab:

#### Required Variables:

1. **HOSTNAME** (MOST IMPORTANT - Fixes 502 errors!)
   ```
   Key: HOSTNAME
   Value: 0.0.0.0
   ```
   **Why**: Without this, the server binds to `localhost` and Railway can't route traffic to it.

2. **NEXT_PUBLIC_API_URL** (Required for API calls)
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://owl-app-backend-production.up.railway.app/api
   ```
   **Why**: Your frontend needs to know where your backend API is located.

#### DO NOT SET:
- **PORT**: Railway sets this automatically. Don't override it.

### Step 2: Verify Build Configuration

In Railway Dashboard → Your Service → Settings:

1. **Root Directory**: Should be empty (default) or set to project root
2. **Build Command**: Should be `npm run build` (Railway auto-detects this)
3. **Start Command**: Should be `npm run start` (Railway auto-detects this)

### Step 3: Check Deployment Logs

After setting environment variables, Railway will auto-redeploy. Check logs:

**Good signs:**
```
✓ Ready in XXXms
- Local:        http://0.0.0.0:XXXX
```

**Bad signs:**
```
- Local:        http://localhost:XXXX  (means HOSTNAME not set)
Error: listen EADDRINUSE
Failed to start server
```

## 🐛 Troubleshooting 502 Errors

### Issue: "Application failed to respond" / 502 Bad Gateway

**Most Common Cause**: HOSTNAME environment variable not set

**Solution**:
1. Go to Railway → Variables
2. Add `HOSTNAME=0.0.0.0`
3. Wait for redeploy (2-3 minutes)
4. Check logs to verify it's listening on `0.0.0.0`

### Issue: Server crashes on startup

**Check logs for**:
- Missing dependencies
- Build errors
- Runtime errors

**Solution**: Check deployment logs and fix any errors shown

### Issue: Domain shows blank page

**Possible causes**:
- `NEXT_PUBLIC_API_URL` not set
- Build failed
- Static files not copied

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check build logs for errors
3. Ensure build completed successfully

## 📋 Complete Checklist

Before deploying, ensure:

- [ ] `package.json` has correct start script: `"start": "node .next/standalone/server.js"`
- [ ] `next.config.js` has `output: 'standalone'`
- [ ] Railway Variables has `HOSTNAME=0.0.0.0`
- [ ] Railway Variables has `NEXT_PUBLIC_API_URL=https://owl-app-backend-production.up.railway.app/api`
- [ ] Build completes successfully (check deployment logs)
- [ ] Deployment shows "Ready" status
- [ ] Service status is "Running" (green) in Railway dashboard
- [ ] Domain is assigned to the correct service

## 🚀 Deployment Steps

1. **Commit your changes:**
   ```bash
   git add package.json
   git commit -m "Fix Railway standalone deployment"
   git push
   ```

2. **Set Environment Variables in Railway:**
   - Go to Railway Dashboard
   - Select your Frontend Service
   - Click "Variables" tab
   - Add `HOSTNAME=0.0.0.0`
   - Add `NEXT_PUBLIC_API_URL=https://owl-app-backend-production.up.railway.app/api`

3. **Wait for Redeploy:**
   - Railway will automatically redeploy when you set variables
   - Wait 2-3 minutes

4. **Check Deployment Logs:**
   - Go to "Deployments" tab
   - Click on latest deployment
   - Verify it shows "Ready" and listening on `0.0.0.0`

5. **Test Your Domain:**
   - Visit: `https://owl-app-frontend-production.up.railway.app/`
   - Should now load your frontend!

## 🔍 How to Verify It's Working

### Check Deployment Logs
Look for:
```
> minible-nextjs@3.3.0 start
> node .next/standalone/server.js
  ▲ Next.js 14.2.35
  - Local:        http://0.0.0.0:XXXX
 ✓ Ready in XXXms
```

**Important**: Must show `http://0.0.0.0:XXXX`, NOT `http://localhost:XXXX`

### Check HTTP Logs
After setting HOSTNAME, HTTP logs should show:
- Status: `200` (instead of `502`)
- Response time: Normal

### Check Service Status
- Railway Dashboard → Your Service
- Status should be "Running" (green dot)
- Should show uptime

## ⚠️ Common Mistakes

1. **Forgetting to set HOSTNAME**
   - Result: 502 errors
   - Fix: Set `HOSTNAME=0.0.0.0` in Railway Variables

2. **Setting PORT manually**
   - Result: Conflicts with Railway's automatic PORT
   - Fix: Don't set PORT, let Railway handle it

3. **Wrong NEXT_PUBLIC_API_URL**
   - Result: API calls fail
   - Fix: Verify backend URL is correct

4. **Not waiting for redeploy**
   - Result: Changes not applied
   - Fix: Wait 2-3 minutes after setting variables

## 📞 Still Not Working?

If you've followed all steps and still getting errors:

1. **Share Railway Deployment Logs:**
   - Go to Deployments tab
   - Copy the latest deployment logs
   - Look for any error messages

2. **Check Service Status:**
   - Is it "Running" or "Failed"?
   - What does the status show?

3. **Verify Environment Variables:**
   - Are they actually set in Railway?
   - Are the values correct?

4. **Check Domain Configuration:**
   - Is the domain assigned to this service?
   - Is the domain status "Active"?

The most common issue is **HOSTNAME not being set**. Make sure it's set to `0.0.0.0` in Railway Variables!
