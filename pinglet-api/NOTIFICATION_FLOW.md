# Notification Send Flow

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

    F --> G["🔥 Fire-and-Forget Events"]
    G --> G1["📊 <b>notificationLifecycle</b><br/><code>event: request</code><br/><i>→ Kafka log + Webhook dispatch</i>"]
    G --> G2["⚡ <b>dispatchFlows</b><br/><i>→ BullMQ EXECUTE_FLOW queue</i>"]

    F --> H{"Notification Type?"}

    H -->|"type = -1<br/>(Browser Push)"| I["📤 BullMQ Queue<br/><code>SEND_BROWSER_NOTIFICATION</code>"]
    I --> I1["✅ 200 OK Response<br/><i>(immediate)</i>"]
    I1 --> I2["📊 <b>notificationLifecycle</b><br/><code>event: queued</code>"]

    I --> J["👷 Push Worker"]
    J -->|Success| K["📊 <b>notificationLifecycle</b><br/><code>event: sent</code><br/><i>→ Kafka + Webhook</i>"]
    J -->|Failure| L["📊 <b>notificationLifecycle</b><br/><code>event: failed</code><br/><i>→ Kafka + Webhook</i>"]

    H -->|"type = 0, 1, 2<br/>(SSE / Custom)"| M["📡 SSE Broadcast<br/><i>to all connected clients</i>"]
    M --> N["📥 <b>storeInbox</b><br/><i>fire-and-forget event</i>"]
    M --> O["📊 <b>notificationLifecycle</b><br/><code>event: sent</code><br/><i>→ Kafka + Webhook</i>"]
    M --> P["✅ 200 OK Response"]

    Q["📱 SDK Client Events<br/><code>POST /log/track</code>"] --> R["📊 <b>notificationLifecycle</b><br/><code>event: clicked / dismissed / closed</code><br/><i>→ Kafka + Webhook</i>"]

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
    style G1 fill:#9C27B0,color:#fff
    style G2 fill:#9C27B0,color:#fff
    style I2 fill:#9C27B0,color:#fff
    style N fill:#9C27B0,color:#fff
    style O fill:#9C27B0,color:#fff
    style R fill:#9C27B0,color:#fff
    style Q fill:#607D8B,color:#fff
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
