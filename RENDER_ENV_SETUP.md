# Render Environment Variables Setup

## Step-by-Step Instructions

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com

### 2. Select Your Service
Click on your `drama-club-api` web service

### 3. Go to Environment Tab
Click **Environment** in the left sidebar

### 4. Add These Environment Variables

Click **Add Environment Variable** for each one:

---

**Variable 1:**
- Key: `MONGODB_URI`
- Value: `mongodb+srv://kojoben29:Ost0UIZdvRIEDMRJ@cluster0.7ajsk.mongodb.net/dramaclub?retryWrites=true&w=majority&appName=Cluster0`

---

**Variable 2:**
- Key: `JWT_SECRET`
- Value: `amd-club-secret-key-2026`

---

**Variable 3:**
- Key: `EMAIL_SERVICE`
- Value: `gmail`

---

**Variable 4:**
- Key: `EMAIL_USER`
- Value: `kojoben29@gmail.com`

---

**Variable 5:**
- Key: `EMAIL_PASSWORD`
- Value: `pgfbubyybgmyldii`

---

**Variable 6:**
- Key: `EMAIL_RECIPIENT`
- Value: `kojoben29@gmail.com`

---

**Variable 7:**
- Key: `NODE_ENV`
- Value: `production`

---

**Variable 8:**
- Key: `BASE_URL`
- Value: `https://drama-club.onrender.com`
  - **IMPORTANT**: This must match your Render backend URL exactly!
  - This is used for file upload URLs (images/videos)
  - If you see localhost URLs when uploading, this variable is not set correctly

---

**Variable 9:**
- Key: `WEBSITE_URL`
- Value: `https://drama-club.vercel.app`

---

### 5. Save Changes
Click **Save Changes** button at the bottom

### 6. Deploy
Render will automatically redeploy your service

### 7. Wait for Deployment
- Watch the **Logs** tab
- Look for: `✅ MongoDB connected successfully`
- Deployment takes 2-3 minutes

### 8. Test Your API
Once deployed, visit:
```
https://your-render-url.onrender.com/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

## MongoDB Atlas Network Access

Make sure your MongoDB Atlas allows connections from Render:

1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Click **Network Access** (left sidebar)
4. Click **Add IP Address**
5. Click **Allow Access From Anywhere**
6. Enter: `0.0.0.0/0`
7. Click **Confirm**

## Troubleshooting

### Still Getting Connection Errors?

**Check:**
1. All environment variables are saved in Render
2. MongoDB connection string has no line breaks
3. MongoDB Atlas Network Access allows `0.0.0.0/0`
4. Database user exists in MongoDB Atlas

### Check Render Logs

Go to your Render service → **Logs** tab to see real-time deployment logs
