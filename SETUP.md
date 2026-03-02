# DogPath Setup Instructions

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project created
- Git installed

## Step 1: Supabase Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-setup.sql`
4. Paste and run the SQL in the SQL Editor
5. Verify the `profiles` table was created in the **Table Editor**

## Step 2: Environment Variables

1. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Find these values in your Supabase project:
   - Go to **Project Settings** → **API**
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Configure Supabase Auth (Optional)

For email confirmation and other auth settings:

1. Go to **Authentication** → **Providers** → **Email**
2. Configure email templates as needed
3. Toggle "Confirm email" on/off based on your needs
4. For development, you can disable email confirmation

## Testing the Application

### Test User Registration

1. Visit `http://localhost:3000`
2. Click "הירשם" (Sign Up)
3. Fill in the form:
   - Full name
   - Email
   - Password (must meet requirements)
   - Select role (Trainer or Client)
   - Accept terms
4. Submit the form
5. You should be redirected to `/dashboard` (trainer) or `/train` (client)

### Test Login

1. Visit `http://localhost:3000/login`
2. Enter your credentials
3. Click "התחבר" (Log In)
4. You should be redirected based on your role

### Verify Database

1. Go to Supabase **Table Editor** → **profiles**
2. You should see your user profile with the correct role
3. Go to **Authentication** → **Users**
4. Verify your user exists

## Project Structure

```
dogpath/
├── app/
│   ├── dashboard/          # Trainer dashboard
│   ├── train/              # Client training area
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles with RTL
├── components/
│   ├── auth/               # Auth forms
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── auth-context.tsx    # Auth context provider
│   ├── supabase.ts         # Supabase client setup
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
├── middleware.ts           # Route protection
└── supabase-setup.sql      # Database setup script
```

## Features Implemented

✅ Complete authentication system with Supabase Auth
✅ User profiles with role-based access (trainer/client)
✅ Hebrew RTL landing page
✅ Protected routes based on user role
✅ Role-based redirects (trainers → /dashboard, clients → /train)
✅ Responsive mobile-first design
✅ Form validation with Hebrew error messages
✅ Password strength indicator
✅ Amber/orange warm color scheme

## Next Steps

The authentication foundation is complete. You can now build:

- Client management for trainers
- Training program builder
- Progress tracking system
- Chat/messaging between trainers and clients
- Achievements and gamification
- Video lessons and content management

## Troubleshooting

### "Invalid login credentials" error
- Check that the email and password are correct
- Verify the user exists in Supabase **Authentication** → **Users**
- Check if email confirmation is required

### User not redirected after signup
- Check browser console for errors
- Verify the `profiles` table has the correct RLS policies
- Check that the trigger `on_auth_user_created` was created successfully

### Middleware redirect loop
- Clear browser cookies
- Check that `.env.local` variables are set correctly
- Restart the development server

### RTL not working
- Verify `dir="rtl"` is set in `app/layout.tsx`
- Check that Hebrew font (Assistant) is loading
- Clear browser cache

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
