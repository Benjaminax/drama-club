# Deploy Backend to Render

## Prerequisites
1. GitHub account with your project pushed
2. MongoDB Atlas account (free tier works)
3. Render account (free at https://render.com)

## Step 1: Set up MongoDB Atlas (if not done)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dramaclub`)

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Push your code to GitHub** (including the `render.yaml` file)

2. **Create New Web Service on Render:**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Set Environment Variables:**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASSWORD` - Your Gmail app password
   - `EMAIL_RECIPIENT` - Email to receive contact form submissions
   - Other variables are auto-generated or set in render.yaml

### Option B: Manual Setup

1. **Create New Web Service:**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the branch to deploy

2. **Configure Build Settings:**
   - **Name:** `drama-club-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

3. **Set Environment Variables:**
   Click "Advanced" and add these environment variables:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dramaclub
   JWT_SECRET=your-super-secret-jwt-key-change-this
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_RECIPIENT=admin@example.com
   NODE_ENV=production
   ```

4. **Click "Create Web Service"**

## Step 3: Get Your Backend URL

After deployment:
- Your backend will be available at: `https://drama-club-api.onrender.com`
- Copy this URL for frontend configuration

## Step 4: Update Frontend to Use Render Backend

1. **Create/Update `.env` file in your project root:**
   ```
   VITE_API_URL=https://drama-club-api.onrender.com/api
   ```

2. **Update your frontend app** wherever you deploy it (Vercel, Netlify, etc.)

## Important Notes

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Upgrade to paid tier ($7/month) for always-on service

### CORS Configuration
Your server already has `cors()` enabled, but if you need to restrict origins:
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:5173']
}));
```

### Email Setup (Gmail)
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" → "App passwords"
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASSWORD` env variable

### File Uploads
⚠️ **Important:** Render's free tier has ephemeral file storage. Uploaded files will be deleted when the service restarts.

**Solution Options:**
1. Use **Cloudinary** or **AWS S3** for file uploads (recommended)
2. Upgrade to Render's paid tier with persistent disks
3. Store files in MongoDB GridFS

## Testing Your Deployment

1. **Health Check:**
   ```
   https://drama-club-api.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Check Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for "MongoDB connected successfully"
   - Check for any errors

## Troubleshooting

### MongoDB Connection Issues
- Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access
- Verify connection string format
- Check database user permissions

### Environment Variables Not Working
- Make sure they're saved in Render dashboard
- Redeploy after adding new variables

### Service Won't Start
- Check logs for errors
- Verify `package.json` has all dependencies
- Make sure Node version is compatible (add `"engines"` to package.json if needed)

## Auto-Deploy

Render automatically redeploys when you push to your connected GitHub branch:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

## Monitoring

- View logs: Render Dashboard → Your Service → Logs
- Monitor uptime: Render Dashboard → Your Service → Metrics
- Set up health check alerts in Render settings
