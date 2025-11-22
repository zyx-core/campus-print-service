# ☁️ Serverless Email Setup (Cloudflare + Resend)

## 1. Get Resend API Key
1. Go to [Resend.com](https://resend.com) and sign up.
2. Create an API Key.
3. Copy the key (starts with `re_`).

## 2. Deploy the Worker
You need `wrangler` installed (Cloudflare CLI).

```bash
# Install wrangler
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Set your Resend API Key
npx wrangler secret put RESEND_API_KEY
# (Paste your key when asked)

# Set Admin Email (Optional)
npx wrangler secret put ADMIN_EMAIL
# (Enter your admin email)

# Deploy!
npx wrangler deploy
```

## 3. Update Frontend
After deployment, Wrangler will give you a URL like:
`https://campus-print-email.your-name.workers.dev`

Update `src/student.js` and `src/admin.js`:
Replace `http://localhost:3000` with your new Worker URL.

---

## ✅ Done!
No more `node server.js` needed. Your email service is now running on the edge! 🚀
