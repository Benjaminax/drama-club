# Vercel Deployment Checklist

## Before Deployment

- [ ] Code pushed to GitHub
- [ ] `.env` file NOT committed (check `.gitignore`)
- [ ] MongoDB Atlas connection string ready
- [ ] Gmail App Password ready
- [ ] Vercel account created

## Backend Deployment

- [ ] Create new Vercel project
- [ ] Import GitHub repository
- [ ] Set Framework Preset to "Other"
- [ ] Add environment variables:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] EMAIL_SERVICE
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASSWORD
  - [ ] EMAIL_RECIPIENT
  - [ ] BASE_URL (update after first deploy)
  - [ ] WEBSITE_URL (update after frontend deploy)
- [ ] Deploy backend
- [ ] Copy backend URL

## Frontend Deployment

- [ ] Create new Vercel project (or use same repo)
- [ ] Set Framework Preset to "Vite"
- [ ] Set Build Command to `npm run build`
- [ ] Set Output Directory to `dist`
- [ ] Add environment variable:
  - [ ] VITE_API_URL (use backend URL from above)
- [ ] Deploy frontend
- [ ] Copy frontend URL

## Post-Deployment

- [ ] Update backend environment variables:
  - [ ] BASE_URL = backend URL
  - [ ] WEBSITE_URL = frontend URL
- [ ] Redeploy backend to apply changes
- [ ] Test website:
  - [ ] Homepage loads
  - [ ] Contact form submits
  - [ ] Email notification received
  - [ ] Admin login works
  - [ ] Admin dashboard saves changes
  - [ ] File uploads work (if needed)

## Optional

- [ ] Add custom domain
- [ ] Update WEBSITE_URL to custom domain
- [ ] Configure SSL (auto with Vercel)
- [ ] Set up Cloudinary/S3 for file uploads

## Troubleshooting

If something doesn't work:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Check browser console for errors
4. Verify CORS is allowing your frontend domain
5. Check MongoDB Atlas network access (allow all IPs or specific Vercel IPs)

## Success!

✅ Website live at: _____________________
✅ Admin dashboard at: _____________________/admin
✅ Backend API at: _____________________/api/content

---

**Need Help?** See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.
