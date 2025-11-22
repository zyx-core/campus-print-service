# ✅ Email Notifications Implemented!

## What's New

I've added a complete **Email Notification System**!

### 📧 Notifications Sent:
1. **To Admin**: When a **New Request** is submitted (contains all details + link to dashboard).
2. **To Student**: **Confirmation Email** when they submit a request.
3. **To Student**: **Status Update Email** when admin changes status (e.g., "Ready for Pickup").

---

## 🚀 How to Run It

Since this requires a backend server to send emails, you need to run **two** commands now.

### 1. Start the Email Server (Backend)
Open a **new terminal** and run:
```bash
node server.js
```
*This server listens on port 3000 and handles sending emails.*

### 2. Start the Web App (Frontend)
In your **original terminal**, keep running:
```bash
npm run dev
```

---

## ⚙️ Configuration

I've created a `.env.example` file. You need to create a `.env` file with your real credentials:

1. Create a file named `.env` in the project root.
2. Add your Gmail credentials (use an **App Password**, not your login password):

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin-email@gmail.com
APP_URL=http://localhost:5173
PORT=3000
```

**Note:** If you don't set up the `.env` file, the server will fail to send emails, but the app will still work (errors are logged to console).

---

## 🧪 How to Test

1. **Start both servers** (`node server.js` and `npm run dev`).
2. **Login as Student** and submit a request.
   - Check your student email for confirmation.
   - Check your admin email for the new request notification.
3. **Login as Admin** and change the status of a request.
   - Check the student email for the status update.

---

## ⚠️ Troubleshooting

- **"Failed to send email"**: Check the terminal where `node server.js` is running. It will show detailed error messages.
- **CORS Errors**: Ensure `server.js` is running on port 3000 and `cors` is enabled (it is by default).
- **Gmail Blocking**: Make sure you are using an **App Password** if you have 2FA enabled on Gmail.

---

**Ready to go!** 🚀
