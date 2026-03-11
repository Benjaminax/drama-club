# Fix Upload URLs (localhost → Production)

## Problem
When uploading images/videos in the admin dashboard, the returned URLs use `http://localhost:5000/uploads/...` instead of your production backend URL.

## Root Cause
The `BASE_URL` environment variable is not set on Render, so the server defaults to `http://localhost:5000`.

## Solution

### On Render (Production)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service**: `drama-club` or `drama-club-api`
3. **Click "Environment"** in the left sidebar
4. **Add or update this variable**:
   ```
   Key: BASE_URL
   Value: https://drama-club.onrender.com
   ```
   ⚠️ **Use YOUR actual Render URL** (check the service URL at the top of your dashboard)

5. **Click "Save Changes"**
6. **Wait for auto-redeploy** (2-3 minutes)

### Verify the Fix

1. **Go to your admin dashboard**: https://drama-club.vercel.app/admin
2. **Login** with your credentials
3. **Upload a test image** in any section
4. **Check the image URL** in the input field
   - ✅ **Correct**: `https://drama-club.onrender.com/uploads/filename.jpg`
   - ❌ **Wrong**: `http://localhost:5000/uploads/filename.jpg`

## How It Works

The upload endpoint in `server.js` uses:
```javascript
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
```

- **With BASE_URL set**: Returns `https://drama-club.onrender.com/uploads/...`
- **Without BASE_URL** (default): Returns `http://localhost:5000/uploads/...`

## For Local Development

In your `.env` file, you have two options:

### Option 1: Point to Production (Recommended)
```env
BASE_URL=https://drama-club.onrender.com
```
- Uploads will be stored on and served from Render
- Images will work in production immediately

### Option 2: Use Localhost
```env
BASE_URL=http://localhost:5000
```
- Uploads stored locally
- Won't work in production unless you re-upload

## Common Issues

### "Image not loading after upload"
- The `BASE_URL` is set incorrectly
- Check your Render service URL and update the variable

### "Upload works locally but not in production"
- `BASE_URL` not set on Render
- Follow the solution steps above

### "Getting 404 errors on uploaded images"
- ⚠️ **Note**: Render free tier has **ephemeral storage**
- Files uploaded are deleted when the service restarts
- **Solution**: Use a cloud storage service (Cloudinary, AWS S3, etc.) for permanent storage
