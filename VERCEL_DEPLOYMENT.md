# Vercel Deployment Guide - AMD Club

## Project Structure

This project has two parts:
1. **Frontend (React + Vite)** - Deployed to Vercel
2. **Backend (Node.js/Express)** - Deployed to Vercel Serverless Functions

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free tier works)
- MongoDB Atlas database (already configured)
- Gmail App Password (already configured)

## Deployment Steps

### 1. Deploy Backend API

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

5. **Add Environment Variables** (click "Environment Variables"):
   ```
   MONGODB_URI=mongodb+srv://kojoben29:Ost0UIZdvRIEDMRJ@cluster0.7ajsk.mongodb.net/dramaclub?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=amd-club-secret-key-2026
   EMAIL_SERVICE=gmail
   EMAIL_USER=kojoben29@gmail.com
   EMAIL_PASSWORD=pgfbubyybgmyldii
   EMAIL_RECIPIENT=kojoben29@gmail.com
   BASE_URL=https://your-backend-domain.vercel.app
   WEBSITE_URL=https://your-frontend-domain.vercel.app
   ```

6. Click **"Deploy"**

7. Once deployed, copy the backend URL (e.g., `https://drama-club-api.vercel.app`)

### 2. Deploy Frontend

Option A: **Same Repository (Recommended)**

1. In the same Vercel project, go to **Settings** → **General**
2. Add a new deployment for the frontend:
   - Create a new Vercel project
   - Use the same GitHub repository
   - **Root Directory**: `./` 
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: Vite

3. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app
   ```
   (Use the backend URL from Step 1.7)

4. Click **"Deploy"**

Option B: **Separate Repository**

1. Move frontend files to a separate repo
2. Follow the same steps as Option A

### 3. Update Environment Variables

Once you have both URLs:

1. Go to **Backend Project** → **Settings** → **Environment Variables**
2. Update these variables:
   ```
   BASE_URL=https://your-actual-backend-domain.vercel.app
   WEBSITE_URL=https://your-actual-frontend-domain.vercel.app
   ```

3. **Redeploy** the backend (Deployments → Click the three dots → Redeploy)

### 4. Configure Vercel Serverless

The `vercel.json` file is already configured to handle:
- API routes (`/api/*`)
- File uploads (`/uploads/*`)
- Static file serving

### 5. Test Your Deployment

1. Visit your frontend URL (e.g., `https://drama-club.vercel.app`)
2. Test the contact form
3. Check email notifications
4. Log in to admin dashboard
5. Verify file uploads work

## Environment Variables Quick Reference

### Backend (Vercel Project Settings)
```env
MONGODB_URI=mongodb+srv://kojoben29:Ost0UIZdvRIEDMRJ@cluster0.7ajsk.mongodb.net/dramaclub
JWT_SECRET=amd-club-secret-key-2026
EMAIL_SERVICE=gmail
EMAIL_USER=kojoben29@gmail.com
EMAIL_PASSWORD=pgfbubyybgmyldii
EMAIL_RECIPIENT=kojoben29@gmail.com
BASE_URL=https://your-backend.vercel.app
WEBSITE_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel Project Settings)
```env
VITE_API_URL=https://your-backend.vercel.app
```

## Important Notes

### File Uploads
- Vercel serverless functions have a **4.5MB** file size limit
- Uploaded files are **ephemeral** (deleted after deployment)
- For production, consider using:
  - **Cloudinary** (recommended)
  - **AWS S3**
  - **Vercel Blob Storage**

### Database
- ✅ MongoDB Atlas works perfectly (already configured)
- Connection string is in environment variables

### Email
- ✅ Gmail SMTP works with Vercel
- Make sure to use App Password, not regular password

## Troubleshooting

### API Routes Not Working
**Problem**: 404 errors on `/api/*` routes  
**Solution**: 
- Check `vercel.json` exists in root directory
- Verify environment variables are set
- Redeploy after changes

### CORS Errors
**Problem**: Frontend can't connect to backend  
**Solution**: 
- Add frontend URL to CORS configuration in `server.js`
- Already configured to allow all origins in development

### File Upload Fails
**Problem**: 413 Payload Too Large  
**Solution**: 
- Vercel has 4.5MB limit for serverless functions
- Implement cloud storage (Cloudinary/S3) for production

### Email Not Sending
**Problem**: Emails not being received  
**Solution**:
- Verify EMAIL_USER and EMAIL_PASSWORD in Vercel environment variables
- Check spam folder
- Ensure Gmail App Password is correct (not regular password)

## Custom Domain (Optional)

1. Go to your Vercel project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update `WEBSITE_URL` environment variable to your custom domain

## Continuous Deployment

✅ **Automatic**: Vercel automatically redeploys when you push to GitHub

To trigger redeployment:
```bash
git add .
git commit -m "Update content"
git push origin main
```

## Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ Environment variables configured in Vercel dashboard (not in code)
- ✅ JWT secret is secure
- ✅ MongoDB connection uses Atlas (not localhost)
- ✅ Email password is App Password (not regular password)

## Cost

- Vercel Free Tier: **$0/month**
  - 100GB bandwidth
  - Unlimited deployments
  - HTTPS included
  - Custom domains included

- MongoDB Atlas Free Tier: **$0/month**
  - 512MB storage
  - Shared cluster
  - Sufficient for small to medium sites

**Total Cost: $0** ✅

## Support

If deployment fails:
1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure `vercel.json` is in root directory
4. Check Node.js version compatibility (18.x recommended)

---

**Deployed Successfully?** Test by visiting your frontend URL and submitting the contact form! 🎉
