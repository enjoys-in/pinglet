# 🔔 Pinglet — Real-Time Notification Platform

<div align="center">
  <img src="https://pinglet.enjoys.in/favicon.ico" alt="Pinglet Logo" width="100" height="100">

  [![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://www.npmjs.com/package/@enjoys/pinglet)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/typescript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/next.js-15.2-black.svg)](https://nextjs.org/)
</div>

---

## Overview

Pinglet is a full-stack notification platform — send web push, glassmorphism toasts, template-rendered and custom HTML notifications from a single dashboard. Includes a visual flow builder, real-time analytics, session replay, widget injection, visitor activity tracking, and a lightweight browser SDK.

---

## Monorepo Structure

```
pinglet/
├── pinglet-api/          # Backend — NestJS, PostgreSQL, Redis, BullMQ
├── pinglet-dashboard/    # Frontend — Next.js 15, React 19, Tailwind, shadcn/ui
├── widgets/              # Prebuilt injectable widget scripts
├── docker-templates/     # Docker / compose configs
└── README.md
```

---

## Features

### Notifications
- **4 notification types** — Browser Push (type -1), Glassmorphism toast (type 0), Custom Template (type 1), Compat Alias (type 2)
- **Real-time delivery** via Server-Sent Events (SSE)
- **Rich media** — images, video, audio, iframes
- **Interactive buttons** — redirect, close, custom events with payloads
- **Tag-based dedup** — group & replace notifications by tag
- **Stacking & queue** — configurable max visible, sound, theme overrides

### Flow Builder
- **15 node types** — Event Trigger, Condition, Delay, Notification, Webhook, A/B Split, Filter, Schedule, Rate Limit, Presence Check, Transform, Email, Merge, Diverge, Note
- **Visual drag-and-drop** canvas with React Flow
- **24 event presets** across 6 categories (Platform, User, E-Commerce, Billing, Product, Custom)
- **Duplicate event detection** — prevents infinite loops across triggers
- **Export/import** flows as JSON
- **Keyboard shortcuts** — Ctrl+S save, Ctrl+C/V copy-paste, Ctrl+D duplicate, Delete

### Widgets
- **Injectable widgets** via `<script>` tag per website
- **11 config fields** — position, autoDismiss, autoShow delay, animation, theme, sound, etc.
- **Prebuilt gallery** — 10 starter templates (welcome, feedback, survey, promo, etc.)

### Analytics & Tracking
- **Visitor activity tracking** — page views, clicks, page exits, custom events
- **Session recording** with rrweb replay
- **Notification analytics** — sent, delivered, clicked, dismissed, failed, dropped
- **Unsubscribe analytics** — opt-out trends and reasons
- **Top pages, unique visitors, avg session duration**

### Developer Tools
- **REST API** with JWT auth
- **Webhook system** — 12 event types with retry
- **Payload Creator** — visual builder for all notification types with JSON / cURL / fetch output
- **Interactive demo playground** — test all types in real-time

### Dashboard
- **Projects** — multi-project management with IDB-first caching
- **Websites** — domain-linked website management
- **Templates** — reusable notification templates with variable interpolation
- **Settings** — account, API keys, preferences
- **IndexedDB sync** — offline-capable with background API refresh

---

## Tech Stack

| Layer | Stack |
|---|---|
| **Backend** | NestJS, PostgreSQL, TypeORM, Redis, BullMQ, Socket.io |
| **Frontend** | Next.js 15, React 19, Tailwind CSS, shadcn/ui, Zustand, React Flow, Recharts |
| **SDK** | Vanilla JS (~15KB), SSE, Web Push, Service Worker |
| **Infra** | Docker, PM2, Nginx |

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/enjoys-in/pinglet.git
cd pinglet

# API
cd pinglet-api && npm install

# Dashboard
cd ../pinglet-dashboard && npm install
```

### 2. Environment

```env
# pinglet-api/.env
DATABASE_URL=postgresql://user:password@localhost:5432/pinglet
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# pinglet-dashboard/.env
NEXT_PUBLIC_API_URL=http://localhost:8888
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000
```

### 3. Run

```bash
# API (port 8888)
cd pinglet-api && npm run dev

# Dashboard (port 3000)
cd pinglet-dashboard && npm run dev
```

### 4. Integrate SDK

```html
<script
  src="https://cdn.pinglet.enjoys.in/pinglet-sse.min.js"
  data-endpoint="https://api.pinglet.enjoys.in"
  data-project-id="your-project-id"
  data-pinglet-id="your-pinglet-id"
  data-configured-domain="yourdomain.com"
  data-checksum="sha384-checksum">
</script>
```

---

## API Endpoints

### Auth
```
POST /api/v1/auth/login        → { email, password }
POST /api/v1/auth/register     → { name, email, password }
```

### Notifications
```
POST /api/v1/notifications/send       → Send notification
GET  /api/v1/notifications/:id        → Get notification details
GET  /api/v1/notifications            → List notifications (paginated)
```

### Projects / Websites / Widgets
```
GET|POST        /api/v1/projects
GET|PUT|DELETE  /api/v1/projects/:id
GET|POST        /api/v1/websites
GET|POST        /api/v1/widgets
```

### Flows
```
GET|POST        /api/v1/flows
PUT|DELETE      /api/v1/flows/:id
PUT             /api/v1/flows/:id/toggle
POST            /api/v1/flows/:id/duplicate
```

### Activity
```
GET /api/v1/activity/stats?projectId=<PID>
GET /api/v1/activity/events?projectId=<PID>&limit=50&offset=0
GET /api/v1/activity/visitor?projectId=<PID>&visitorId=<VID>
```

### Analytics
```
GET /api/v1/analytics/overview?projectId=<PID>&timeframe=7d
```

### Webhooks
```
GET|POST        /api/v1/webhooks
GET|PUT|DELETE  /api/v1/webhooks/:id
```

---

## Notification Payload Example

```json
{
  "projectId": "your-project-id",
  "type": "0",
  "variant": "default",
  "body": {
    "title": "Welcome!",
    "description": "Thanks for joining our platform",
    "icon": "https://example.com/icon.png",
    "media": { "type": "image", "src": "https://example.com/hero.jpg" },
    "buttons": [
      { "text": "Get Started", "action": "redirect", "src": "https://example.com/start" },
      { "text": "Dismiss", "action": "close" }
    ]
  }
}
```

---

## Deployment

```bash
# Build
cd pinglet-api && npm run build
cd pinglet-dashboard && npm run build

# Docker
docker-compose up -d

# PM2
pm2 start ecosystem.config.js --env production
```

---

## Changelog

See [Changelog](https://pinglet.enjoys.in/changelog) for release history.

**v1.1.0** (March 2026) — Activity tracking alignment, flow loop prevention, widget config system, IDB sync, JSON editor fixes.

**v1.0.0** (March 2026) — Flow engine (15 nodes), payload creator, SDK v0.0.3 activity tracking, custom events.

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
  <p>Built by <a href="https://enjoys.in">Enjoys</a></p>
  <p>
    <a href="https://github.com/enjoys-in/pinglet">GitHub</a> •
    <a href="https://pinglet.enjoys.in">Website</a> •
    <a href="https://pinglet.enjoys.in/docs">Docs</a>
  </p>
</div>
</div>