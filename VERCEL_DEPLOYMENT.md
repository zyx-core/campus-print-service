# 🚀 Vercel Deployment Guide

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Campus Print Service"
   ```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it: `campus-print-service`
   - Don't initialize with README (you already have code)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/campus-print-service.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com/new

2. **Import your GitHub repository**:
   - Click "Import Git Repository"
   - Select `campus-print-service`

3. **Configure Project**:
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)

4. **Add Environment Variables** (IMPORTANT!):
   Click "Environment Variables" and add these:

   ```
   RESEND_API_KEY = re_K1dY8jm6_3ZrrBoNuoFNSW1okqFbKYENF
   ADMIN_EMAIL = ershadpersonal123@gmail.com
   VITE_SUPABASE_URL = https://fddnddopvdgaetnnzmhu.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZG5kZG9wdmRnYWV0bm56bWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTU3NjgsImV4cCI6MjA3OTM5MTc2OH0.9zaHKS-WX8lFIpISYvooXgMtry2LsijvumAevW_01ZY
   ```

   **Also add your Firebase config** (from `src/firebase.js`):
   ```
   VITE_FIREBASE_API_KEY = your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN = your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID = your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET = your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID = your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID = your_firebase_app_id
   ```

5. **Click "Deploy"!**

## Step 3: Test Your Deployment

1. Wait for deployment to finish (~2 minutes)
2. Vercel will give you a URL like: `https://campus-print-service.vercel.app`
3. Open the URL and test:
   - Login as student
   - Upload a PDF
   - Check your email (both admin and student should receive emails!)
   - Login as admin
   - Change status to "Completed"
   - Student should receive status update email

## Step 4: Future Updates

Whenever you make changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy! 🎉

## Troubleshooting

**Build fails?**
- Check the build logs in Vercel dashboard
- Make sure all environment variables are set

**Email not working?**
- Check Vercel function logs
- Verify `RESEND_API_KEY` is correct
- Check spam folder

**Firebase not working?**
- Make sure all `VITE_FIREBASE_*` variables are set
- Check Firebase console for errors
