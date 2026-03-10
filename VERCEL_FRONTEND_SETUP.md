# Connect Vercel Frontend to Render Backend

Your frontend is deployed at: **https://drama-club.vercel.app/**

## Step 1: Deploy Backend to Render First

Follow the instructions in [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) to deploy your backend to Render.

After deployment, you'll get a URL like: `https://drama-club-api.onrender.com`

## Step 2: Configure Environment Variable in Vercel

1. **Go to your Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your `drama-club` project

2. **Add Environment Variable:**
   - Go to **Settings** → **Environment Variables**
   - Add the following:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://drama-club-api.onrender.com/api` (replace with your actual Render URL)
     - **Environments:** Check all (Production, Preview, Development)
   - Click **Save**

3. **Redeploy Your Frontend:**
   - Go to **Deployments** tab
   - Click the three dots ⋯ on your latest deployment
   - Click **Redeploy**
   - Select **Use existing Build Cache** (uncheck it for fresh build)
   - Click **Redeploy**

## Step 3: Test Your Setup

After redeployment, visit https://drama-club.vercel.app/ and check:

1. **Homepage loads** - Content should appear
2. **Contact form works** - Submit a test message
3. **Admin login works** - Go to `/admin`
4. **Browser Console** - Check for any API errors (F12 → Console)

## Troubleshooting

### "Failed to load content" Error

**Check:**
1. Render backend is running: `https://your-render-url.onrender.com/api/health`
2. VITE_API_URL is set correctly in Vercel (must include `/api` at the end)
3. Frontend was redeployed after adding the env variable

### CORS Errors

If you see CORS errors in the browser console, update your backend `server.js`:

```javascript
app.use(cors({
  origin: [
    'https://drama-club.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Then push to GitHub to redeploy Render.

### Render Free Tier Cold Starts

- First request after 15 min of inactivity takes 30-60 seconds
- Show loading spinner on frontend
- Consider upgrading to Render paid tier ($7/mo) for always-on service

## Alternative: Keep Backend on Vercel

If you want to keep the backend on Vercel instead of Render:

1. **Revert vercel.json:**
   ```bash
   git checkout vercel.json
   ```

2. **Set up MongoDB Atlas** and configure environment variables in Vercel:
   - MONGODB_URI
   - JWT_SECRET
   - EMAIL_USER
   - EMAIL_PASSWORD
   - EMAIL_RECIPIENT

3. **No VITE_API_URL needed** - backend and frontend on same domain

## Current Configuration

Your `vercel.json` is now configured for **frontend-only deployment**. The backend should be on Render.

If you need to switch back to full-stack Vercel, check the git history:
```bash
git log --oneline vercel.json
git show <commit-hash>:vercel.json
```
