# Railway Environment Variables Configuration

## Required Environment Variables

Go to Railway Dashboard → Your Frontend Service → Variables tab and set:

### 1. NEXT_PUBLIC_API_URL (Required)
```
NEXT_PUBLIC_API_URL=https://owl-app-backend-production.up.railway.app/api
```

### 2. HOSTNAME (Required for Standalone Mode)
```
HOSTNAME=0.0.0.0
```
**Important**: This ensures the Next.js standalone server binds to all interfaces, allowing Railway to route traffic to your app.

### 3. PORT (Automatic - Don't Set Manually)
Railway automatically sets the `PORT` environment variable. **Do NOT set this manually**. The Next.js standalone server.js will automatically read it.

## Optional Environment Variables

### KEEP_ALIVE_TIMEOUT (Optional)
If you need to adjust keep-alive timeout:
```
KEEP_ALIVE_TIMEOUT=65000
```

## How to Set in Railway

1. Go to Railway Dashboard
2. Select your Frontend Service
3. Click on "Variables" tab
4. Click "New Variable"
5. Add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://owl-app-backend-production.up.railway.app/api`
6. Click "New Variable" again
7. Add:
   - Key: `HOSTNAME`
   - Value: `0.0.0.0`
8. Save changes
9. Railway will automatically redeploy

## Verification

After setting these variables, check the deployment logs. You should see:
```
✓ Ready in XXXms
```

The server should be listening on `0.0.0.0:XXXX` (where XXXX is Railway's assigned PORT).
