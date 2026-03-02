# 🐕 DogPath - הדואולינגו של אילוף כלבים

> A Duolingo-style SaaS platform for dog trainers and their clients, built with Next.js, Supabase, and TypeScript.

## 🎯 What is DogPath?

DogPath is an interactive dog training platform that connects professional dog trainers with dog owners. Think Duolingo, but for dog training! It features:

- **For Trainers**: Create custom training programs, manage clients, track progress
- **For Clients**: Follow structured training plans, track streaks, earn achievements
- **Gamification**: Points, streaks, badges, and progress tracking
- **Hebrew Interface**: Full RTL support with Hebrew UI

## ✨ Current Features (Phase 2 - Auth System)

✅ **Complete Authentication System**
- User registration with email/password
- Role-based access (Trainer vs Client)
- Secure login/logout
- Session management
- Password strength validation

✅ **Landing Page**
- Beautiful Hebrew landing page
- Feature showcase
- Dual CTAs for trainers and clients
- Responsive design

✅ **Protected Dashboards**
- Trainer dashboard (`/dashboard`)
- Client training area (`/train`)
- Role-based redirects
- Navigation layouts

✅ **Design System**
- Hebrew RTL support
- Amber/orange dog-friendly theme
- Responsive mobile-first design
- Reusable UI components

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up Supabase (see QUICKSTART.md)
# - Run supabase-setup.sql in your Supabase project
# - Create .env.local with your credentials

# 3. Start development server
npm run dev
```

**👉 See [QUICKSTART.md](./QUICKSTART.md) for detailed 5-minute setup guide**

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration
- **[VERIFICATION.md](./VERIFICATION.md)** - Complete testing checklist
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's been built

## 🏗️ Project Structure

```
dogpath/
├── app/                        # Next.js App Router pages
│   ├── dashboard/              # Trainer dashboard (protected)
│   ├── train/                  # Client training area (protected)
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── layout.tsx              # Root layout (RTL, AuthProvider)
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── auth/                   # Authentication forms
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   └── ui/                     # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Label.tsx
├── lib/
│   ├── auth-context.tsx        # Auth state management
│   ├── supabase.ts             # Supabase client setup
│   ├── types.ts                # TypeScript definitions
│   └── utils.ts                # Utility functions
├── middleware.ts               # Route protection
└── supabase-setup.sql          # Database schema
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## 🔐 Authentication Flow

1. **Signup**: User creates account, selects role (trainer/client)
2. **Database Trigger**: Auto-creates profile in `profiles` table
3. **Role-Based Redirect**: Trainers → `/dashboard`, Clients → `/train`
4. **Middleware Protection**: Routes protected based on role
5. **Session Management**: Persistent sessions with auto-refresh

## 🗄️ Database Schema

### `profiles` Table
```sql
id          UUID (FK to auth.users)
role        TEXT ('trainer' | 'client')
full_name   TEXT
created_at  TIMESTAMPTZ
```

### Row Level Security (RLS)
- Users can only view/update their own profile
- Auto-created on signup via trigger

## 🎨 Design Features

- **RTL Support**: Full right-to-left layout for Hebrew
- **Hebrew Font**: Assistant font family from Google Fonts
- **Color Scheme**: Warm amber (#f59e0b) and orange (#f97316)
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: Focus states, ARIA labels, keyboard navigation

## 📱 Pages Overview

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Landing | `/` | Public | Hebrew landing page with features |
| Login | `/login` | Public | Email/password login |
| Signup | `/signup` | Public | Registration with role selection |
| Trainer Dashboard | `/dashboard` | Trainers only | Manage clients and programs |
| Client Training | `/train` | Clients only | Training lessons and progress |

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Secure password requirements
- CSRF protection
- httpOnly cookies for auth tokens
- Environment variables for secrets
- Server-side auth verification

## 🚧 Roadmap

### Phase 3 - Client Management (Next)
- [ ] Add/edit clients
- [ ] Client profiles
- [ ] Assign training programs

### Phase 4 - Training Programs
- [ ] Create training programs
- [ ] Add lessons and exercises
- [ ] Schedule content
- [ ] Video uploads

### Phase 5 - Progress & Gamification
- [ ] Track lesson completion
- [ ] Streak counter
- [ ] Points system
- [ ] Achievements/badges

### Phase 6 - Communication
- [ ] Real-time chat
- [ ] Notifications
- [ ] Feedback system

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Auth Issues
- Check `.env.local` has correct Supabase credentials
- Verify database setup in Supabase dashboard
- Check RLS policies are enabled

### RTL Issues
- Clear browser cache
- Verify Assistant font is loading
- Check `dir="rtl"` in layout.tsx

## 📞 Support

- Check documentation in project root
- Review [VERIFICATION.md](./VERIFICATION.md) for testing
- See [SETUP.md](./SETUP.md) for configuration

---

**Built with ❤️ for dogs and their trainers**

🐕 🦴 🐾
