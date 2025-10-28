# 🔔 Pinglet - Advanced Notification Platform

<div align="center">
  <img src="https://pinglet.enjoys.in/favicon.ico" alt="Pinglet Logo" width="100" height="100">
  
  [![Version](https://img.shields.io/badge/version-1.1.2-blue.svg)](https://www.npmjs.com/package/@enjoys/pinglet)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/node.js-18%2B-green.svg)](https://nodejs.org/)
</div>

## 📖 Overview

Pinglet is a comprehensive, enterprise-grade notification platform that enables custom browser notifications, service worker integration, widget creation, and advanced analytics. Built with modern web technologies, it provides a complete solution for web push notifications, real-time messaging, and user engagement tracking.

## ✨ Key Features

### 🔔 **Advanced Notification System**
- **Custom Browser Notifications** - Rich, customizable in-browser notifications
- **Web Push Notifications** - Service worker-powered push notifications
- **Real-time Delivery** - Server-Sent Events (SSE) for instant notifications
- **Cross-platform Support** - Works across all modern browsers

### 🎨 **Customizable Widgets**
- **Dynamic Widget Creation** - Injectable notification widgets
- **Custom Styling** - Fully customizable appearance and themes
- **Multiple Layouts** - Toast, modal, sidebar, and custom layouts
- **Responsive Design** - Mobile-first, adaptive interfaces

### 🔧 **Developer Tools**
- **Webhook Integration** - HTTP webhooks for external triggers
- **REST API** - Comprehensive API for all operations
- **Script Injection** - Easy integration with existing websites
- **TypeScript Support** - Full type safety and IntelliSense

### 📊 **Analytics & Insights**
- **Real-time Dashboard** - Modern analytics interface
- **Event Tracking** - Click, view, and engagement metrics
- **Performance Monitoring** - Delivery rates and user interactions
- **Custom Reports** - Detailed analytics and insights

### 🚀 **Enterprise Features**
- **Multi-project Support** - Manage multiple websites/projects
- **User Management** - Role-based access control
- **Template System** - Reusable notification templates
- **Flow Creation** - Automated notification workflows

## 🏗️ Architecture

### **Backend (pinglet-api)**
- **Framework**: NestJS with Express
- **Database**: PostgreSQL with TypeORM
- **Queue System**: BullMQ with Redis
- **Authentication**: JWT with bcrypt
- **WebSockets**: Socket.io for real-time communication

### **Frontend (pinglet-dashboard)**
- **Framework**: Next.js 15 with React 19
- **UI Library**: Radix UI with Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts for analytics
- **Workflow Builder**: ReactFlow for visual workflows

### **Client SDK**
- **Delivery**: CDN-distributed JavaScript SDK
- **Size**: Lightweight (~15KB minified)
- **Features**: SSE, Web Push, Custom Widgets
- **Compatibility**: All modern browsers

## 🚀 Quick Start

### 1. **Installation**

```bash
# Clone the repository
git clone https://github.com/enjoys-in/pinglet.git
cd pinglet

# Install API dependencies
cd pinglet-api
npm install

# Install Dashboard dependencies
cd ../pinglet-dashboard
npm install
```

### 2. **Environment Setup**

Create `.env` files in both `pinglet-api` and `pinglet-dashboard`:

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

### 3. **Database Setup**

```bash
cd pinglet-api
npm run migrate:run
```

### 4. **Start Development**

```bash
# Start API server
cd pinglet-api
npm run dev

# Start Dashboard (in another terminal)
cd pinglet-dashboard
npm run dev
```

### 5. **Client Integration**

Add the Pinglet script to your website:

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

## 📚 Usage Examples

### **Basic Notification**

```javascript
// Send a simple notification
fetch('https://api.pinglet.enjoys.in/api/v1/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key'
  },
  body: JSON.stringify({
    title: 'Welcome!',
    description: 'Thanks for joining our platform',
    type: 'success',
    projectId: 'your-project-id'
  })
});
```

### **Custom Widget**

```javascript
// Create a custom feedback widget
const widget = {
  variant: 'feedback',
  body: {
    title: 'How was your experience?',
    description: 'We value your feedback',
    media: {
      type: 'icon',
      src: '⭐'
    },
    buttons: [
      {
        text: 'Great!',
        action: 'link',
        src: '/feedback/positive'
      },
      {
        text: 'Could be better',
        action: 'link', 
        src: '/feedback/negative'
      }
    ]
  }
};
```

### **Webhook Integration**

```javascript
// Set up webhook endpoint
app.post('/webhook/pinglet', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'user_signup') {
    // Send welcome notification
    sendNotification({
      title: `Welcome ${data.username}!`,
      description: 'Get started with your new account',
      userId: data.userId
    });
  }
  
  res.status(200).send('OK');
});
```

## 🛠️ API Reference

### **Authentication**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### **Send Notification**
```http
POST /api/v1/notifications/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Notification Title",
  "description": "Notification body text",
  "projectId": "project-id",
  "type": "info",
  "media": {
    "type": "icon",
    "src": "🔔"
  },
  "buttons": [
    {
      "text": "Action",
      "action": "link",
      "src": "https://example.com"
    }
  ]
}
```

### **Analytics**
```http
GET /api/v1/analytics/overview?projectId={id}&timeframe=7d
Authorization: Bearer {token}
```

## 🎯 Advanced Features

### **Flow Creation**
Create automated notification workflows:
- **Trigger Conditions**: User actions, time-based, API events
- **Logic Branches**: Conditional routing and A/B testing
- **Multi-step Sequences**: Complex notification chains
- **Performance Tracking**: Flow-specific analytics

### **Template System**
- **Visual Editor**: Drag-and-drop template builder
- **Dynamic Content**: Variable interpolation and personalization
- **Version Control**: Template versioning and rollback
- **A/B Testing**: Split testing for optimization

### **Service Worker Features**
- **Background Sync**: Offline notification queuing
- **Push Notifications**: Native browser push messages
- **Cache Management**: Intelligent resource caching
- **Custom Actions**: Interactive notification buttons

## 📊 Analytics Dashboard

The analytics dashboard provides comprehensive insights:

- **Real-time Metrics**: Live notification delivery and engagement
- **User Segmentation**: Audience analysis and targeting
- **Performance Tracking**: Delivery rates, click-through rates
- **Revenue Attribution**: Conversion tracking and ROI analysis
- **Custom Reports**: Exportable data and visualizations

## 🔧 Configuration

### **Client Configuration**
```javascript
{
  position: "bottom-right",
  theme: {
    mode: "auto", // light, dark, auto
    rounded: true,
    shadow: true
  },
  sound: {
    play: true,
    src: "notification-sound.mp3",
    volume: 0.6
  },
  duration: 5000,
  maxVisible: 3,
  auto_dismiss: true
}
```

### **Server Configuration**
```typescript
// pinglet-api/src/app/config/
export const config = {
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    // ... other database config
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  },
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT
  }
};
```

## 🚀 Deployment

### **Production Deployment**

1. **Build Applications**
```bash
# Build API
cd pinglet-api
npm run build

# Build Dashboard
cd pinglet-dashboard
npm run build
```

2. **Docker Deployment**
```bash
# Use provided Docker templates
docker-compose up -d
```

3. **PM2 Process Management**
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production
```

### **Environment Variables**
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
JWT_SECRET=...
API_BASE_URL=https://api.pinglet.enjoys.in
DASHBOARD_URL=https://dashboard.pinglet.enjoys.in
```

## 🧪 Testing

```bash
# Run API tests
cd pinglet-api
npm test

# Run Dashboard tests  
cd pinglet-dashboard
npm test

# E2E tests
npm run test:e2e
```

## 📝 API Documentation

Full API documentation is available at:
- **Development**: http://localhost:8888/docs
- **Production**: https://api.pinglet.enjoys.in/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://pinglet.enjoys.in/docs](https://pinglet.enjoys.in/docs)
- **Issues**: [GitHub Issues](https://github.com/enjoys-in/pinglet/issues)
- **Discord**: [Join our community](https://discord.gg/pinglet)
- **Email**: support@enjoys.in

## 🏢 Enterprise

For enterprise features, custom integrations, and dedicated support:
- **Website**: [https://enjoys.in](https://enjoys.in)
- **Email**: enterprise@enjoys.in
- **Sales**: [Schedule a demo](https://enjoys.in/demo)

---

<div align="center">
  <p>Built with ❤️ by <a href="https://enjoys.in">Enjoys</a></p>
  <p>
    <a href="https://github.com/enjoys-in/pinglet">GitHub</a> •
    <a href="https://pinglet.enjoys.in">Website</a> •
    <a href="https://pinglet.enjoys.in/docs">Documentation</a> •
    <a href="https://enjoys.in">Enjoys</a>
  </p>
</div>