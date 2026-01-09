# 🚨 Railway Frontend 502 Error - FINAL FIX

## The Problem

Your frontend is deployed but showing "Application failed to respond" / 502 errors on Railway.

## Root Causes (Most Likely)

### 1. **HOSTNAME Environment Variable NOT Set** (90% of cases)
- **Symptom**: Server binds to `localhost` instead of `0.0.0.0`
- **Result**: Railway can't route traffic → 502 errors
- **Fix**: Set `HOSTNAME=0.0.0.0` in Railway Variables

### 2. **Server Crashing on Startup**
- **Symptom**: Logs show "Failed to start server" or errors
- **Result**: Server never starts → 502 errors
- **Fix**: Check deployment logs for error messages

### 3. **Build Not Completing**
- **Symptom**: Build fails before start command runs
- **Result**: No `.next/standalone/server.js` exists → 502 errors
- **Fix**: Fix build errors first

## ✅ Complete Fix Steps

### Step 1: Set Environment Variables in Railway

**CRITICAL - Do this first!**

1. Go to **Railway Dashboard** → Your Frontend Service
2. Click **"Variables"** tab
3. Click **"New Variable"** or **"+"** button
4. Add these variables:

   **Variable 1:**
   ```
   Key: HOSTNAME
   Value: 0.0.0.0
   ```

   **Variable 2:**
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://owl-app-backend-production.up.railway.app/api
   ```

5. Click **"Add"** or **"Save"** for each
6. Railway will automatically redeploy (wait 2-3 minutes)

### Step 2: Verify Deployment Logs

After setting variables, check deployment logs:

1. Go to **Railway Dashboard** → Your Service → **"Deployments"** tab
2. Click on the **latest deployment**
3. Look for these lines:

   **✅ GOOD (Server is working):**
   ```
   > minible-nextjs@3.3.0 start
   > ./start-server.sh
   - Local:        http://0.0.0.0:XXXX
   ✓ Ready in XXXms
   ```

   **❌ BAD (Server not working):**
   ```
   - Local:        http://localhost:XXXX  (HOSTNAME not set!)
   Error: Failed to start server
   Cannot find module
   ```

### Step 3: Check Service Status

1. Railway Dashboard → Your Service
2. Status should be **"Running"** (green dot)
3. If it's **"Failed"** or **"Stopped"**, check logs for errors

### Step 4: Test Your Domain

After redeploy completes:
- Visit: `https://owl-app-frontend-production.up.railway.app/`
- Should load your frontend!

## 🔍 How to Debug

### Check Railway Logs

**Deployment Logs:**
- Railway Dashboard → Deployments → Latest
- Look for build and start messages
- Check for any errors

**Service Logs:**
- Railway Dashboard → Logs
- Shows real-time server output
- Look for startup messages and errors

### Common Error Messages

**"listen EADDRINUSE"**
- Port already in use
- Railway handles this automatically, shouldn't happen

**"Cannot find module"**
- Missing dependencies
- Solution: Rebuild (Railway will do this on next deploy)

**"Failed to start server"**
- Check the full error message in logs
- Usually indicates a configuration issue

**"Application failed to respond"**
- Server not binding to 0.0.0.0
- Solution: Set `HOSTNAME=0.0.0.0` in Railway Variables

## 📋 Verification Checklist

Before asking for help, verify:

- [ ] **HOSTNAME=0.0.0.0** is set in Railway Variables (NOT just in code)
- [ ] **NEXT_PUBLIC_API_URL** is set correctly
- [ ] **Build completed** successfully (check deployment logs)
- [ ] **Start command ran** (check deployment logs)
- [ ] **Server shows "Ready"** in logs
- [ ] **Server binds to 0.0.0.0** (NOT localhost) in logs
- [ ] **Service status is "Running"** (green)
- [ ] **No errors** in deployment or service logs

## 🎯 Most Important Fix

**Set `HOSTNAME=0.0.0.0` in Railway Variables!**

This is the #1 cause of 502 errors. The code defaults to `0.0.0.0`, but Railway's environment might override it or the server might not read the default correctly.

## 📞 Still Not Working?

If you've set HOSTNAME and it's still not working:

1. **Share Railway Deployment Logs:**
   - Copy the full logs from the latest deployment
   - Look for any error messages

2. **Share Service Logs:**
   - Copy the logs from the Logs tab
   - Look for startup messages

3. **Check Service Status:**
   - Is it "Running", "Failed", or "Stopped"?
   - What does the status show?

4. **Verify Variables:**
   - Screenshot of Variables tab
   - Confirm HOSTNAME is actually set (not just in .env.example)

The start script and build process are correct. The issue is almost certainly the **HOSTNAME environment variable not being set in Railway**.
