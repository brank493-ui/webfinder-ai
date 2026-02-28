# 🌐 WebFinder AI - Business Discovery Platform

A powerful AI-powered business discovery and website development platform that helps find businesses without websites and connects them with professional web development services.

## ✨ Features

### 🔍 Business Discovery
- Search businesses worldwide by location
- Filter by category and radius
- Identify businesses without online presence
- AI-powered outreach system

### 🌐 Website Builder
- Professional website templates
- Custom domain management
- Deployment center with SSL certificates
- Website editor with real-time preview

### 💼 Business Management
- Client onboarding workflow
- Project tracking dashboard
- Team management system
- Billing and invoicing

### 🌍 Multi-language Support
- English and French translations
- Easy language switching
- Complete UI localization

### 💳 Payment Integration
- Mobile Money support
- Credit card payments
- Bank transfers
- Cryptocurrency options

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **AI Integration**: z-ai-web-dev-sdk

## 📋 Prerequisites

- Node.js 18+ or Bun
- A Vercel account (for deployment)
- A GitHub account

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/webfinder-ai.git
cd webfinder-ai

# Install dependencies
bun install
# or
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Integration (optional)
ZAI_API_KEY="your-ai-api-key"
```

## 📦 Deployment on Vercel

### Step 1: Push to GitHub

```bash
# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/webfinder-ai.git

# Push to GitHub
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "Add New Project"
4. Import your `webfinder-ai` repository
5. Configure environment variables in Vercel dashboard
6. Click "Deploy"

### Step 3: Automatic Deployments

Once connected:
- Every push to `main` branch triggers automatic deployment
- Vercel provides a live URL for your application
- Preview deployments are created for pull requests

## 🔄 Update Workflow

After making changes in Z AI:

```bash
# Check what changed
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push origin main

# Vercel will automatically redeploy!
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── custom/            # Custom components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

## 🎨 Key Components

| Component | Description |
|-----------|-------------|
| `HeroSection` | Main search interface |
| `BusinessList` | Search results display |
| `PricingSection` | Package pricing |
| `UserHomePage` | User dashboard |
| `AdminDashboard` | Admin panel |
| `ChatPanel` | AI chat assistant |

## 🌍 Internationalization

The app supports multiple languages:
- English (en)
- French (fr)

Translations are managed in `src/store/useLanguageStore.ts`

## 👤 Owner Access

Use these credentials to access the owner dashboard:
- **Credential**: `lago2.1B`
- **Email**: `brank493@gmail.com`

## 📞 Contact

- **Owner**: Fongang Lamago Brank
- **Email**: brank493@gmail.com
- **Phone**: +237 693 401 619

## 📄 License

This project is proprietary and owned by Fongang Lamago Brank.

---

Built with ❤️ using Next.js and AI-powered development
