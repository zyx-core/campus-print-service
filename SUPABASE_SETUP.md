# 🗄️ Supabase Storage Setup

## 1. Setup Complete!
I've updated the code to use Supabase instead of Firebase Storage.

- **Client**: `src/supabase.js`
- **Uploads**: `src/student.js` (now uploads to `pdfs` bucket)
- **Env**: `.env` updated with your keys.

## 2. Verify Bucket Settings
Go to your Supabase Dashboard -> Storage -> `pdfs` bucket.
**Make sure it is PUBLIC.**
If it's not public, the download links won't work.

## 3. Test It
1. Restart your dev server: `npm run dev` (to load new env vars).
2. Login as Student.
3. Upload a PDF.
4. Check Supabase Dashboard to see the file!
