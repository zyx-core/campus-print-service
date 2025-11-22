# 📧 Email Function Setup Guide

## Current Status
✅ Email API created (`api/email.js`)  
✅ Resend API key ready (`re_K1dY8jm6_...`)  
✅ Admin email set (`ershadpersonal123@gmail.com`)  

## What You Need to Do

### Option 1: Test Locally with Vercel Dev

1. **Install Vercel CLI** (running now...):
   ```bash
   npm install -g vercel
   ```

2. **Stop the current dev server** (`Ctrl+C` in the terminal running `npm run dev`)

3. **Start Vercel Dev**:
   ```bash
   vercel dev
   ```
   - It will ask you to login (follow the prompts)
   - It will ask to link to a project (you can create a new one or link existing)
   - It will pull environment variables from Vercel (or use local `.env`)

4. **Test the email**:
   - Upload a PDF as a student
   - Check `ershadpersonal123@gmail.com` for the admin notification
   - Check the student's email for confirmation

### Option 2: Deploy to Vercel (Recommended)

1. **Push your code to GitHub** (if not already)

2. **Go to Vercel Dashboard**: https://vercel.com/new

3. **Import your repository**

4. **Add Environment Variables** in Vercel Settings:
   - `RESEND_API_KEY`: `re_K1dY8jm6_3ZrrBoNuoFNSW1okqFbKYENF`
   - `ADMIN_EMAIL`: `ershadpersonal123@gmail.com`
   - `VITE_SUPABASE_URL`: `https://fddnddopvdgaetnnzmhu.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

5. **Deploy!**

6. **Test on production URL**

## Important Notes

- The email API (`/api/email`) **only works** with `vercel dev` or on Vercel deployment
- Regular `npm run dev` won't run the API functions
- Resend free tier: 3000 emails/month (plenty for testing!)

## Troubleshooting

**Email not sending?**
- Check Vercel function logs
- Verify `RESEND_API_KEY` is set correctly
- Check spam folder

**API 404 error?**
- Make sure you're using `vercel dev`, not `npm run dev`
- Or deploy to Vercel
