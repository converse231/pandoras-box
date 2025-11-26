# 💎 Pandora's Box - Jewelry Portfolio Tracker

A modern, full-featured jewelry portfolio management application with real-time gold price tracking, camera integration, and comprehensive analytics.

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🏆 Core Features
- **📸 Camera Integration** - Take real-time photos of jewelry using device camera
- **💰 Real-Time Gold Prices** - Live gold price tracking across 8 purity levels (10K-24K)
- **🌍 Multi-Currency Support** - Track values in PHP, USD, EUR, GBP, JPY, CAD, AUD, CHF
- **📊 Investment Analytics** - Track profit/loss, percentage gains, and portfolio performance
- **🎨 Beautiful UI** - Modern, responsive design with Shadcn UI components
- **🌙 Dark Mode** - Seamless light/dark theme with system preference detection

### 💎 Jewelry Management
- **Add/Edit/Delete** jewelry items with comprehensive details
- **Image Upload** - Upload multiple images via drag-and-drop or camera capture
- **Detailed Cards** - View weight, purity, purchase price, current value, and more
- **Image Gallery** - Swipeable image carousel for each item
- **Category Filters** - Filter by jewelry type (Ring, Necklace, Bracelet, etc.)
- **Purity Filters** - Filter by gold purity (24K, 22K, 18K, etc.)
- **Search** - Quick search across all jewelry items

### 📈 Dashboard & Analytics
- **Portfolio Overview** - Total value, items count, average value
- **Live Gold Feed** - Real-time gold prices with 24-hour caching
- **Performance Metrics** - Track investment performance with profit/loss calculations
- **Responsive Grid** - Beautiful card-based layout that adapts to any screen size

### 🔐 Authentication & Security
- **Supabase Auth** - Secure email/password authentication
- **Row Level Security (RLS)** - User-specific data isolation
- **Email Verification** - Custom branded confirmation emails
- **Protected Routes** - Middleware-based route protection

### 📱 User Experience
- **Toast Notifications** - Beautiful Sonner toasts for all actions
- **Alert Dialogs** - Confirmation dialogs for destructive actions
- **Loading States** - Smooth loading indicators for async operations
- **Error Handling** - Graceful error handling with user-friendly messages
- **Mobile Optimized** - Fully responsive design for all devices

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component library
- **Lucide Icons** - Beautiful icon set
- **Sonner** - Toast notifications
- **next-themes** - Theme management

### Backend & Services
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage (for jewelry images)
  - Row Level Security
- **GoldAPI.io** - Real-time gold price data
- **MediaDevices API** - Camera access for photo capture

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `sonner` - Toast notifications
- `clsx` & `tailwind-merge` - Utility functions

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account
- GoldAPI.io account (optional, fallback prices available)

### 1. Clone the Repository
```bash
git clone https://github.com/converse231/pandoras-box.git
cd pandoras-box
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GoldAPI Configuration (Optional)
GOLDAPI_KEY=your_goldapi_key
```

### 4. Supabase Setup

#### Create Tables
Run the SQL schema in your Supabase SQL Editor:

```sql
-- See supabase-schema.sql for complete setup
-- Creates: jewelry_items, user_profiles tables
-- Sets up: RLS policies, triggers, storage bucket
```

#### Configure Storage
1. Go to Supabase Dashboard → Storage
2. Create bucket: `jewelry-images`
3. Set bucket to **public**
4. Apply RLS policies from schema file

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
pandoras-box/
├── app/
│   ├── api/
│   │   └── gold-prices/     # Gold price API endpoint
│   ├── auth/                # Authentication callbacks
│   ├── dashboard/           # Main dashboard page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── profile/             # User profile page
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Shadcn UI components
│   └── theme-provider.tsx   # Theme context provider
├── lib/
│   ├── supabase/            # Supabase client utilities
│   ├── goldPriceCache.ts    # Gold price caching logic
│   ├── mockData.ts          # Mock data for development
│   └── utils.ts             # Utility functions
├── public/
│   └── flags/               # Currency flag icons
├── email-templates/         # Custom email templates
├── middleware.ts            # Route protection middleware
└── supabase-schema.sql      # Database schema
```

## 🎨 Key Features Breakdown

### Camera Integration
- Real-time camera access using MediaDevices API
- Back camera on mobile, webcam on desktop
- Live preview with viewfinder grid
- Direct upload to Supabase Storage
- JPEG compression for optimal file size

### Gold Price Tracking
- Fetches live prices from GoldAPI
- 24-hour client-side caching
- Supports 8 purity levels (10K-24K)
- Fallback prices if API fails
- Auto-refresh capability

### Image Management
- Multiple upload methods: file picker, drag-and-drop, camera
- Base64 preview for instant feedback
- Upload to Supabase Storage
- Public URL generation
- Smart deletion (removes from storage on item delete)

### Database Schema
- `jewelry_items` - Stores jewelry data
- `user_profiles` - Extended user information
- RLS policies for user data isolation
- Automatic timestamp triggers
- Optimized indexes

## 🔧 Configuration

### Gold API
Sign up at [GoldAPI.io](https://www.goldapi.io/) and get your API key. The app includes fallback prices if the API is unavailable.

### Currency Support
Currently supports 8 currencies with real-time exchange rates:
- PHP (Philippine Peso)
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- CHF (Swiss Franc)

### Theme Customization
Themes are configured in `app/globals.css` using CSS variables. Supports:
- Light mode
- Dark mode
- System preference detection

## 🛡️ Security

- **Row Level Security (RLS)** - Users can only access their own data
- **Protected Routes** - Middleware checks authentication
- **Secure Storage** - User-specific folders in Supabase Storage
- **Email Verification** - Prevents fake accounts
- **HTTPS Only** - Camera requires secure context

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized interactions
- Back camera for photo capture
- Optimized image sizes
- Mobile-first approach

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
Add the same environment variables from `.env.local` to your Vercel project settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Shadcn** - For the amazing UI component library
- **Supabase** - For the powerful backend infrastructure
- **GoldAPI.io** - For real-time gold price data
- **Vercel** - For Next.js and deployment platform

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Supabase, and Shadcn UI**
