# Admin Account Setup

## How Admin Login Works

The app uses the **same login page** for both students and admins. After login, the system checks the user's role in the database:
- If `role === 'admin'` → Shows Admin Dashboard
- Otherwise → Shows Student Dashboard

## Creating an Admin Account

### Method 1: Using Browser Console (Easiest)

1. **Sign up normally** with any email (e.g., `admin@campus.com`)
2. **Open browser console** (F12 → Console tab)
3. **Run this code** to change your role to admin:

```javascript
// Get current user
const currentUser = JSON.parse(localStorage.getItem('mockUser'));

// Update user role in database
const users = JSON.parse(localStorage.getItem('mockFirestore') || '{}');
if (!users.users) users.users = {};
users.users[currentUser.uid] = {
    email: currentUser.email,
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString()
};
localStorage.setItem('mockFirestore', JSON.stringify(users));

// Reload the page
location.reload();
```

4. **Refresh the page** - you should now see the Admin Dashboard!

### Method 2: Direct Setup (Before Login)

Run this in the browser console **before logging in**:

```javascript
// Create admin user
const users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
users['admin@campus.com'] = {
    uid: 'admin_001',
    email: 'admin@campus.com',
    password: 'admin123',
    displayName: 'Admin'
};
localStorage.setItem('mockUsers', JSON.stringify(users));

// Create admin profile
const db = JSON.parse(localStorage.getItem('mockFirestore') || '{}');
if (!db.users) db.users = {};
db.users['admin_001'] = {
    email: 'admin@campus.com',
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString()
};
localStorage.setItem('mockFirestore', JSON.stringify(db));

console.log('✅ Admin account created!');
console.log('Email: admin@campus.com');
console.log('Password: admin123');
```

Then login with:
- **Email**: `admin@campus.com`
- **Password**: `admin123`

## Quick Test Credentials

After running Method 2, you can use:
- **Admin**: `admin@campus.com` / `admin123`
- **Student**: Create any new account via signup

## Switching Between Roles

To test both dashboards, you can:
1. Logout
2. Login with different accounts
3. Or use the console method above to change roles

## Admin Dashboard Features

Once logged in as admin, you'll see:
- All print requests from all students
- Ability to change request status (New Request → Printing → Ready for Pickup → Completed)
- Student information and order details
- Total request count
