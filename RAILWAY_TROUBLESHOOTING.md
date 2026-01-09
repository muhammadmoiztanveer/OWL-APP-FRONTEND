# Railway Deployment Troubleshooting Guide

## Issue: Frontend not accessible on Railway domain

### ✅ Fixed Configuration

1. **Start Script Updated** - Now uses Railway's PORT environment variable:
   ```json
   "start": "next start --hostname 0.0.0.0 --port ${PORT:-3000}"
   ```

2. **Next.js Config** - Using standalone output (already configured)

### 🔧 Railway Dashboard Configuration

#### Step 1: Check Environment Variables

Go to Railway Dashboard → Your Frontend Service → Variables tab and ensure:

- **PORT**: Railway sets this automatically (don't manually set it)
- **NEXT_PUBLIC_API_URL**: Set to `https://owl-app-backend-production.up.railway.app/api`

#### Step 2: Check Build Logs

1. Go to Railway Dashboard → Your Frontend Service
2. Click on "Deployments" tab
3. Check the latest deployment logs
4. Look for:
   - ✅ Build successful
   - ✅ `npm ci` completed
   - ✅ `npm run build` completed
   - ✅ `npm run start` is running

#### Step 3: Check Service Health

1. Go to Railway Dashboard → Your Frontend Service → Settings
2. Check:
   - **Healthcheck Path**: Should be `/` or leave empty
   - **Healthcheck Timeout**: Default is fine
   - **Restart Policy**: Should be "Always"

#### Step 4: Check Port Configuration

Railway automatically:
- Sets `PORT` environment variable (don't override)
- Routes traffic from your domain to this PORT
- Your app should listen on `0.0.0.0` (already configured)

### 🐛 Common Issues & Solutions

#### Issue 1: "Application failed to respond"
**Cause**: App not listening on 0.0.0.0 or wrong port
**Solution**: ✅ Fixed - Start script now uses `--hostname 0.0.0.0 --port ${PORT:-3000}`

#### Issue 2: "502 Bad Gateway"
**Possible causes:**
- Build failed
- Start command not running
- App crashed on startup

**Check:**
1. View deployment logs in Railway
2. Check if `npm run start` is in the logs
3. Look for any error messages

#### Issue 3: Domain shows nothing / blank page
**Possible causes:**
- Build artifacts missing
- Static files not generated
- Environment variables missing

**Solutions:**
1. Ensure `NEXT_PUBLIC_API_URL` is set in Railway variables
2. Check build logs for errors
3. Try redeploying

#### Issue 4: Domain shows "This site can't be reached"
**Cause**: Domain not properly configured
**Solution:**
1. Railway Dashboard → Your Service → Settings → Networking
2. Ensure domain is generated/configured
3. Wait a few minutes for DNS propagation

### 📋 Quick Checklist

- [ ] `package.json` has correct start script (`--hostname 0.0.0.0 --port ${PORT:-3000}`)
- [ ] `next.config.js` has `output: 'standalone'`
- [ ] Railway Variables has `NEXT_PUBLIC_API_URL` set
- [ ] Build logs show successful build
- [ ] Deployment logs show `npm run start` running
- [ ] Domain is generated in Railway
- [ ] Domain is properly assigned to the service

### 🔍 Debugging Steps

1. **Check Railway Logs:**
   ```bash
   # In Railway Dashboard → Your Service → Logs
   # Look for:
   - "Ready on http://0.0.0.0:XXXX"
   - Any error messages
   ```

2. **Verify Build Output:**
   - Check that `.next` directory exists after build
   - Verify `standalone` folder is created

3. **Test Locally:**
   ```bash
   PORT=3000 npm run start
   # Should see: "Ready on http://0.0.0.0:3000"
   ```

4. **Check Environment Variables:**
   - Railway Dashboard → Variables
   - Ensure `NEXT_PUBLIC_API_URL` is correct
   - Don't set `PORT` manually (Railway handles it)

### 🚀 After Fixing

1. **Commit and push changes:**
   ```bash
   git add package.json
   git commit -m "Fix Railway port and hostname configuration"
   git push
   ```

2. **Railway will auto-redeploy**

3. **Wait 2-3 minutes for deployment**

4. **Check logs to verify it's running**

5. **Visit your domain**: `owl-app-frontend-production.up.railway.app`

### 📞 Still Not Working?

If the issue persists:

1. Share the Railway deployment logs
2. Share any error messages from Railway
3. Check if the service shows as "Running" in Railway dashboard
4. Verify the domain is assigned to the correct service
