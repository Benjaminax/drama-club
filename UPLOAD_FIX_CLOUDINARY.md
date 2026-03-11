# Quick Setup: Fix Image/Video Uploads

## What Changed?

Your uploads are now using **Cloudinary** (cloud storage) instead of local file storage. This fixes the issue where uploads disappear on Render.

## ⚡ Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to: https://cloudinary.com/users/register_free
2. Sign up (it's free!)
3. Verify your email

### Step 2: Get Your Credentials
After logging in, you'll see these on your dashboard:
- **Cloud Name**: (something like "dmxyz123")
- **API Key**: (numbers like "123456789012345")
- **API Secret**: (click eye icon to reveal)

### Step 3: Add to Render
1. Go to https://dashboard.render.com
2. Click your backend service
3. Go to **Environment** tab
4. Add these 3 variables:
   ```
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret
   ```
5. Click **Save Changes**

### Step 4: Deploy
Your Render service will automatically restart with the new configuration.

### Step 5: Test
1. Go to your admin dashboard
2. Try uploading an image or video
3. It should now work and stay permanently!

## ✅ What This Fixes

- ✅ Images upload successfully
- ✅ Videos upload successfully  
- ✅ Files don't disappear after server restarts
- ✅ Fast loading from Cloudinary CDN
- ✅ Works perfectly with Vercel + Render hosting

## 📝 Notes

- Free tier: 25GB storage + 25GB bandwidth/month
- All old local uploads are gone (you'll need to re-upload important ones)
- Max file size: 50MB per file
- Supports: JPG, PNG, GIF, WebP, MP4, WebM, MOV, AVI

## Need Help?

See detailed guide: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
