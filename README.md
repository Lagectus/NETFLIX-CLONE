# CineVault — Next-Generation Premium Streaming Platform

![CineVault](https://img.shields.io/badge/CineVault-Premium%20Streaming-2563EB?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-R185-000?style=flat-square&logo=three.js)
![Express](https://img.shields.io/badge/Express-4-000?style=flat-square&logo=express)

> A cinematic, Awwwards-quality streaming platform built with cutting-edge technologies.

## ✨ Features

- **🎬 Cinematic Hero** — Fullscreen 3D particle background with auto-rotating featured content
- **🌟 Three.js Engine** — GPU particle universe, interactive cursor lighting, volumetric fog
- **🎭 Premium Movie Cards** — 3D tilt, glow border, score rings, bookmark animations
- **📺 Cinema Player** — HLS streaming, ambient lighting, cinema mode, keyboard shortcuts
- **🔍 Smart Search** — Instant results, trending searches, genre filtering
- **🎨 Glassmorphism Design** — Dark luxury theme with blur, gradients, and depth
- **⚡ GSAP Animations** — ScrollTrigger, parallax, marquee, stagger effects
- **🔐 JWT Auth** — Secure authentication with HTTP-only cookies
- **📊 Admin Dashboard** — Analytics, movie management, upload center
- **🚀 Full Backend** — Express.js + MongoDB + Redis + Socket.io

## 🏗️ Tech Stack

### Frontend
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- GSAP + ScrollTrigger
- Three.js (React Three Fiber + Drei)
- Lenis Smooth Scroll
- Zustand + React Query

### Backend
- Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (Realtime)
- Multer (Uploads)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker (for MongoDB & Redis)

### 1. Clone & Install

```bash
# Clone
git clone <repo-url> cinevault
cd cinevault

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Start Database Services

```bash
docker-compose up -d
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Start Development

```bash
# Terminal 1 — Frontend
cd frontend
npm run dev

# Terminal 2 — Backend
cd backend
npm run dev
```

### 5. Open Browser

Navigate to `http://localhost:3000`

## 📁 Project Structure

```
cinevault/
├── frontend/          # Next.js 16 App
│   └── src/
│       ├── app/       # App Router pages
│       ├── components/ # UI components
│       ├── three/     # Three.js scenes
│       ├── animations/ # GSAP & Framer Motion
│       ├── store/     # Zustand stores
│       ├── providers/ # Context providers
│       ├── hooks/     # Custom hooks
│       ├── types/     # TypeScript types
│       └── lib/       # Utilities
├── backend/           # Express.js API
│   └── src/
│       ├── routes/    # API endpoints
│       ├── models/    # MongoDB schemas
│       ├── middleware/ # Auth, errors
│       ├── config/    # DB, Redis config
│       └── utils/     # Logger, helpers
└── docker-compose.yml # MongoDB + Redis
```

## 🎨 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero + all sections |
| `/login` | Cinematic login with 3D background |
| `/register` | Multi-step registration |
| `/watch/[id]` | Cinema mode video player |
| `/dashboard` | Admin analytics dashboard |

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `⌘K` / `Ctrl+K` | Open search |
| `Space` / `K` | Play/Pause |
| `F` | Fullscreen |
| `M` | Mute/Unmute |
| `C` | Cinema mode |
| `←` / `→` | Seek ±10s |
| `↑` / `↓` | Volume |
| `Esc` | Close overlay |

## 📄 License

MIT
