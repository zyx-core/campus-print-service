# ☁️ Vercel Email Setup (Resend)

## 1. Configure Environment Variables
Since you are deploying to Vercel, you need to add your secrets there.

1. Go to your Vercel Project Dashboard.
2. Click **Settings** -> **Environment Variables**.
3. Add the following:
   - `RESEND_API_KEY`: `re_K1dY8jm6_3ZrrBoNuoFNSW1okqFbKYENF` (Your key)
   - `ADMIN_EMAIL`: `your-admin-email@gmail.com` (Optional)

## 2. Local Development
To test this locally, you should use `vercel dev` instead of `npm run dev` if you want the API functions to work.

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel dev`
3. It will ask you to link the project (say yes).
4. It will pull your environment variables.

**OR (Simpler for now):**
You can just add `RESEND_API_KEY` to your local `.env` file and run:
`npm run dev` won't run the API functions automatically. You need to run `vercel dev`.

## 3. Deployment
Just push your code to GitHub (or deploy via Vercel CLI).
```bash
vercel deploy
```

The API will be live at `https://your-app.vercel.app/api/email`.
