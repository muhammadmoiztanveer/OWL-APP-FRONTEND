# Troubleshooting Guide - Auth Pages Not Working

## Quick Checks

### 1. Verify Dev Server is Running
```bash
npm run dev
```
Should show: `Ready on http://localhost:3000`

### 2. Check Browser Console
Open browser DevTools (F12) and check for:
- 404 errors (missing CSS/JS files)
- JavaScript errors
- Network errors

### 3. Verify File Structure
Make sure these files exist:
```
app/
  (auth)/
    layout.tsx ✅
    login/
      page.tsx ✅
    register/
      page.tsx ✅
    recover-password/
      page.tsx ✅
    lock-screen/
      page.tsx ✅
```

### 4. Verify Assets Exist
Check these directories exist:
```
public/
  assets/
    css/
      bootstrap.css
      icons.css
      app.css
    images/
      logo-dark.png
      logo-light.png
```

### 5. Test Routes Directly
Try accessing these URLs:
- http://localhost:3000/auth/login
- http://localhost:3000/auth/register
- http://localhost:3000/auth/recover-password
- http://localhost:3000/auth/lock-screen

## Common Issues

### Issue: Page shows blank/white screen
**Solution**: Check browser console for errors. Likely missing CSS files.

### Issue: Styles not loading
**Solution**: 
1. Verify CSS files exist in `public/assets/css/`
2. Check if paths in `app/layout.tsx` are correct
3. Clear browser cache (Ctrl+Shift+R)

### Issue: Images not showing
**Solution**:
1. Verify images exist in `public/assets/images/`
2. Check Next.js Image component paths
3. Ensure images are in the public folder

### Issue: JavaScript errors
**Solution**:
1. Check if jQuery is loading before other scripts
2. Verify script paths in `app/(auth)/layout.tsx`
3. Check browser console for specific errors

### Issue: 404 errors
**Solution**:
1. Verify route structure matches Next.js App Router conventions
2. Check file names are exactly `page.tsx` (lowercase)
3. Ensure folder structure is correct

## Debug Steps

1. **Check Network Tab**: See which files are failing to load
2. **Check Console**: Look for JavaScript errors
3. **Check Elements**: Verify HTML structure is rendering
4. **Check Sources**: Verify files are being served correctly

## Quick Fix Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

## Still Not Working?

If pages still don't work:
1. Share the exact error message from browser console
2. Share the network tab showing failed requests
3. Verify the dev server is actually running on port 3000

