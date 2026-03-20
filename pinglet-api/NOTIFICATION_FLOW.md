# Notification Send Flow

## Event-Driven Architecture

Every notification lifecycle event flows through a **single centralized handler** (`notificationLifecycle`) that automatically triggers:
1. **Kafka analytics logging** — activity tracking
2. **Webhook dispatch** — to all matching user webhooks (API, Slack, Discord, Telegram, Teams)
3. **Flow execution** — triggers matching active automation flows

Nothing blocks the main thread. Everything is fire-and-forget via `AppEvents.emit()`.

```mermaid
flowchart TD
    A["📨 API Request<br/><code>POST /api/v1/notifications/send</code>"] --> B{"Zod Schema<br/>Validation"}
    B -->|Invalid| B1["❌ 400 Bad Request"]
    B -->|Valid| C["🔍 Project Lookup<br/><i>Redis cached · 5 min TTL</i>"]

    C --> D{"Quiet Hours<br/>Check"}
    D -->|In quiet hours| D1["❌ 429 Paused"]
    D -->|OK| E{"Plan Permissions<br/><i>getUserPlanType (cached 5 min)<br/>Quota (Redis cached 60s)<br/>Features (in-memory)</i>"}

    E -->|Quota exceeded| E1["❌ 403 Limit Reached"]
    E -->|Feature blocked| E2["❌ 403 Feature Unavailable"]
    E -->|All OK| F["🎯 Cleared to Send"]

    F --> G["🔥 <b>notificationLifecycle</b><br/><code>event: request</code>"]
    G --> EH["🧠 Event Handler<br/><i>(centralized, async)</i>"]

    F --> H{"Notification Type?"}

    H -->|"type = -1<br/>(Browser Push)"| I["📤 BullMQ Queue<br/><code>SEND_BROWSER_NOTIFICATION</code>"]
    I --> I1["✅ 200 OK Response<br/><i>(immediate)</i>"]
    I1 --> I2["🔥 <b>notificationLifecycle</b><br/><code>event: queued</code>"]
    I2 --> EH

    I --> J["👷 Push Worker"]
    J -->|Success| K["🔥 <b>notificationLifecycle</b><br/><code>event: sent</code>"]
    K --> EH
    J -->|Failure| L["🔥 <b>notificationLifecycle</b><br/><code>event: failed</code>"]
    L --> EH

    H -->|"type = 0, 1, 2<br/>(SSE / Custom)"| M["📡 SSE Broadcast<br/><i>to all connected clients</i>"]
    M --> N["🔥 <b>storeInbox</b><br/><i>fire-and-forget</i>"]
    M --> O["🔥 <b>notificationLifecycle</b><br/><code>event: sent</code>"]
    O --> EH
    M --> P["✅ 200 OK Response"]

    Q["📱 SDK Client Events<br/><code>POST /log/track</code>"] --> R["🔥 <b>notificationLifecycle</b><br/><code>event: clicked / dismissed / closed</code>"]
    R --> EH

    EH --> EH1["📊 Kafka Analytics Log"]
    EH --> EH2["🔗 Webhook Dispatch<br/><i>API · Slack · Discord · Telegram · Teams</i>"]
    EH --> EH3["⚡ Flow Execution<br/><i>BullMQ EXECUTE_FLOW queue</i>"]

    style A fill:#4CAF50,color:#fff
    style B1 fill:#f44336,color:#fff
    style D1 fill:#FF9800,color:#fff
    style E1 fill:#f44336,color:#fff
    style E2 fill:#f44336,color:#fff
    style F fill:#2196F3,color:#fff
    style I1 fill:#4CAF50,color:#fff
    style P fill:#4CAF50,color:#fff
    style K fill:#4CAF50,color:#fff
    style L fill:#f44336,color:#fff
    style G fill:#9C27B0,color:#fff
    style I2 fill:#9C27B0,color:#fff
    style N fill:#9C27B0,color:#fff
    style O fill:#9C27B0,color:#fff
    style R fill:#9C27B0,color:#fff
    style Q fill:#607D8B,color:#fff
    style EH fill:#FF5722,color:#fff
    style EH1 fill:#795548,color:#fff
    style EH2 fill:#795548,color:#fff
    style EH3 fill:#795548,color:#fff
```

## Legend

| Color | Meaning |
|-------|---------|
| 🟢 Green | Success responses |
| 🔴 Red | Error / failure |
| 🟠 Orange | Rate-limited |
| 🟣 Purple | Async fire-and-forget events (never block main thread) |
| 🔵 Blue | Cleared checkpoint |
| ⚫ Gray | External SDK client |

## Key Architecture Points

- Every **purple** box is **non-blocking** — runs via `AppEvents.emit()` off the main thread
- The `notificationLifecycle` event handles **both** Kafka analytics logging and webhook dispatch in one shot
- For push notifications: response returns **immediately** after queueing, actual delivery is async via BullMQ worker
- All DB lookups on the hot path are **Redis-cached**:
  - Project lookup: 5 min TTL
  - Plan type: 5 min TTL
  - Quota count: 60s TTL
  - Feature flags: in-memory (zero I/O)

## Notification Lifecycle Events

| Event | When |
|-------|------|
| `request` | API receives a send request |
| `queued` | Push notification enters BullMQ queue |
| `sent` | Dispatched to browser (push) or SSE clients |
| `delivered` | Confirmed delivered by browser |
| `clicked` | User clicked the notification |
| `dismissed` | User explicitly dismissed (X / swipe) |
| `closed` | Auto-closed (timeout / replaced) |
| `dropped` | Dropped (quiet hours, quota, invalid sub) |
| `failed` | Send failed (webpush error, network) |

## Webhook Events

| Event | Trigger |
|-------|---------|
| `notification.sent` | Notification dispatched |
| `notification.failed` | Push delivery failed |
| `notification.dropped` | Notification dropped |
| `notification.clicked` | User clicked |
| `notification.closed` | Notification closed |
| `notification.queued` | Push queued |
| `notification.delivered` | Push delivered |
| `notification.dismissed` | User dismissed |
| `user.subscribed` | New push subscription |
| `user.unsubscribed` | Push unsubscribe |
| `project.created` | New project |
| `domain.verified` | Domain verified |
