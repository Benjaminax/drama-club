# Cloudinary Upload System

## Overview
Your drama club website now uses **Cloudinary** for file storage and **MongoDB** for tracking uploaded files. This setup works perfectly with:
- ✅ Frontend on Vercel
- ✅ Backend on Render
- ✅ No more localhost dependencies!

## How It Works

### File Upload Flow
```
User uploads file → Backend receives file → Cloudinary stores file → MongoDB saves metadata → Frontend gets Cloudinary URL
```

### MongoDB Collection: `images/video`
All uploaded files are tracked in your MongoDB collection with:
- **filename**: Original file name
- **cloudinaryUrl**: Public URL to access the file
- **cloudinaryPublicId**: Cloudinary identifier for deletion
- **resourceType**: image, video, or raw
- **format**: jpg, png, mp4, etc.
- **size**: File size in bytes
- **width/height**: Dimensions
- **uploadedBy**: User who uploaded
- **createdAt**: Upload timestamp

## Why Cloudinary?

- **Cloud Storage**: Files are stored permanently in the cloud, not on server disk
- **Works with Vercel & Render**: No issues with ephemeral filesystems
- **Free Tier**: 25GB storage and 25GB bandwidth per month
- **Fast CDN**: Images and videos load quickly from Cloudinary's global CDN
- **Auto-optimization**: Automatic image optimization and format conversion

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Credentials

After logging in to Cloudinary:

1. Go to your **Dashboard** (automatically shown after login)
2. You'll see your credentials at the top:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click the eye icon to reveal it)

### 3. Configure Your Environment Variables

#### For Local Development:

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
```

#### For Render (Backend):

1. Go to your Render dashboard
2. Select your web service
3. Go to **Environment** tab
4. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 4. How It Works

When you upload an image or video through the admin dashboard:

1. File is sent to your backend server
2. Backend uploads it to Cloudinary
3. Cloudinary returns a permanent URL (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v123456/drama-club/filename.jpg`)
4. This URL is saved to MongoDB and displayed on your website
5. Files are served from Cloudinary's fast CDN globally

### 5. Folder Structure in Cloudinary

All uploads are stored in a folder called `drama-club` in your Cloudinary account:

```
Media Library (Cloudinary)
└── drama-club/
    ├── image1.jpg
    ├── image2.png
    ├── video1.mp4
    └── ...
```

### 6. API Endpoints

Your backend now provides these media management endpoints:

#### Upload File
```http
POST /api/upload
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data
Body: media (file)

Response:
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v123456/drama-club/file.jpg",
  "mediaId": "mongodb-id",
  "metadata": {
    "filename": "file.jpg",
    "resourceType": "image",
    "format": "jpg",
    "size": 123456
  }
}
```

#### Get All Uploaded Media
```http
GET /api/media
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "filename": "photo.jpg",
      "cloudinaryUrl": "https://...",
      "resourceType": "image",
      "size": 123456,
      "createdAt": "2024-03-11T..."
    }
  ]
}
```

#### Delete Media
```http
DELETE /api/media/:id
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Media deleted successfully"
}
```
*Note: This deletes the file from both Cloudinary AND MongoDB*

### 7. File Size Limits

Current configuration allows:
- **Max file size**: 50MB per file
- **Supported formats**:
  - Images: JPG, JPEG, PNG, GIF, WebP
  - Videos: MP4, WebM, MOV, AVI

### 8. Troubleshooting

**"Cloudinary not configured" message:**
- Make sure all three environment variables are set correctly
- Restart your server after adding environment variables

**Upload fails:**
- Check your Cloudinary account hasn't exceeded free tier limits
- Verify API credentials are correct
- Check file size is under 50MB

**Files upload but don't show in MongoDB:**
- Check your MongoDB Atlas connection is active
- Look for the `images/video` collection in your database
- Check server logs for any MongoDB write errors

**Old local uploads not working:**
- Previous uploads stored locally on Render will be lost
- Re-upload important images/videos through the admin dashboard
- They'll now be permanently stored on Cloudinary

**How to view uploaded files in MongoDB:**
1. Go to MongoDB Atlas → Browse Collections
2. Select your database (e.g., "dramaclub")
3. Look for the collection named `images/video`
4. You'll see all uploaded file metadata with Cloudinary URLs

### 9. Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month

This is sufficient for most small to medium websites. Monitor usage in your Cloudinary dashboard.

## Benefits for Your Deployment

✅ **Vercel Frontend** - Can display images from Cloudinary CDN  
✅ **Render Backend** - No need to worry about ephemeral filesystem  
✅ **Persistent Storage** - Files never disappear when server restarts  
✅ **Fast Loading** - CDN ensures quick delivery worldwide  
✅ **Automatic Backups** - Cloudinary keeps your media safe  

---

**Need Help?** Check [Cloudinary Documentation](https://cloudinary.com/documentation) or contact support.
