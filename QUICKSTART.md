# DogPath - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Database Setup (2 min)

1. Open your Supabase project: https://supabase.com/dashboard
2. Go to **SQL Editor** (left sidebar)
3. Copy everything from `supabase-setup.sql`
4. Paste and click **Run**
5. ✅ Done! Check **Table Editor** → you should see `profiles` table

### Step 2: Environment Setup (1 min)

1. In your Supabase project, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**
   - **anon public key**

3. Create `.env.local` in project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

### Step 3: Install & Run (2 min)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 🎉

## ✅ Test It Works

### 1. View Landing Page
- Visit http://localhost:3000
- Should see Hebrew landing page with dog theme

### 2. Create Trainer Account
- Click **"הירשם"** (Sign up)
- Fill form:
  - Name: `Test Trainer`
  - Email: `trainer@test.com`
  - Password: `Test1234`
  - Select **"מאלף"** (Trainer)
  - Check terms box
- Click **"הירשם"**
- Should redirect to `/dashboard`

### 3. Create Client Account
- Logout (click **"התנתק"**)
- Sign up again:
  - Name: `Test Client`
  - Email: `client@test.com`
  - Password: `Test1234`
  - Select **"לקוח"** (Client)
  - Check terms box
- Should redirect to `/train`

### 4. Test Login
- Logout
- Click **"התחבר"** (Login)
- Login with `trainer@test.com` → goes to `/dashboard`
- Logout and login with `client@test.com` → goes to `/train`

## 🎯 You're Ready!

If all tests pass, your auth system is working perfectly.

## 🔍 Verify Database

In Supabase dashboard:

1. **Authentication** → **Users**
   - Should see 2 users

2. **Table Editor** → **profiles**
   - Should see 2 profiles
   - One with `role='trainer'`
   - One with `role='client'`

## 🚨 Troubleshooting

### Can't login?
- Check Supabase **Authentication** → **Providers** → **Email** is enabled
- For dev, disable "Confirm email" in auth settings

### .env not working?
- File must be named exactly `.env.local`
- Must be in project root (next to package.json)
- Restart dev server after creating it

### Database error?
- Check SQL ran successfully in Supabase
- Verify RLS is enabled: **Authentication** → **Policies**
- Make sure trigger was created

## 📚 Next Steps

Read full documentation:
- `SETUP.md` - Detailed setup guide
- `VERIFICATION.md` - Complete testing checklist
- `IMPLEMENTATION_SUMMARY.md` - What's been built

## 🎨 What You Get

✅ Landing page in Hebrew with RTL
✅ User signup with role selection
✅ User login
✅ Protected trainer dashboard
✅ Protected client training area
✅ Auto-logout and session management
✅ Mobile responsive design
✅ Amber/orange dog-friendly theme

---

**Need Help?** Check the troubleshooting section in `SETUP.md`
