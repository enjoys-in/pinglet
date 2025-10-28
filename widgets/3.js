// chat widget only
class ChatWidget {
  constructor() {
    this.init();
  }

  init() {
    this.injectStyles();
    this.createWidget();
    this.attachEventListeners();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .chat-widget-container * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .chat-toggle-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 50;
        background: #9333ea;
        color: white;
        padding: 12px 16px;
        border: none;
        border-radius: 25px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .chat-toggle-button:hover {
        background: #7c3aed;
        transform: translateY(-2px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      }

      .chat-widget {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 100%;
        max-width: 384px;
        z-index: 40;
        background: radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.4) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
                    #0f0f0f;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
      }

      .chat-widget.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }

      .chat-card {
        background: rgba(40, 40, 40, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        color: white;
      }

      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .chat-avatar {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-button {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.2s ease;
      }

      .close-button:hover {
        color: white;
      }

      .chat-title {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 24px;
      }

      .chat-message {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }

      .message-avatar {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
      }

      .message-text {
        color: #d1d5db;
        font-size: 14px;
      }

      .start-chat-btn {
        width: 100%;
        padding: 12px 16px;
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .start-chat-btn:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
        transform: scale(1.02);
      }

      .start-chat-btn svg {
        margin-left: 8px;
      }

      .options-container {
        margin-bottom: 32px;
      }

      .option-item {
        background: rgba(60, 60, 60, 0.6);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 12px;
      }

      .option-item:hover {
        background: rgba(70, 70, 70, 0.8);
        transform: translateX(4px);
      }

      .option-content {
        display: flex;
        align-items: center;
      }

      .option-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
      }

      .option-text {
        color: #d1d5db;
        font-size: 14px;
      }

      .option-arrow {
        width: 24px;
        height: 24px;
        background: #4b5563;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .bottom-nav {
        background: rgba(40, 40, 40, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 16px;
      }

      .nav-items {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 16px;
      }

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      }

      .nav-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4px;
      }

      .nav-label {
        font-size: 12px;
        font-weight: 500;
      }

      .nav-item.active .nav-label {
        color: white;
      }

      .nav-item:not(.active) .nav-label {
        color: #9ca3af;
      }

      .powered-by {
        text-align: center;
        font-size: 12px;
      }

      .powered-by-text {
        color: #6b7280;
      }

      .brand-text {
        font-weight: 600;
        background: linear-gradient(45deg, #f97316, #ef4444);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }

      @media (max-width: 640px) {
        .chat-widget {
          left: 20px;
          right: 20px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  createWidget() {
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'chat-toggle-button';
    toggleBtn.textContent = 'Chat';
    toggleBtn.id = 'chat-toggle-button';

    // Create main widget container
    const widget = document.createElement('div');
    widget.className = 'chat-widget chat-widget-container';
    widget.id = 'chat-widget';

    // Create main chat card
    const chatCard = document.createElement('div');
    chatCard.className = 'chat-card';

    // Header
    const header = document.createElement('div');
    header.className = 'chat-header';

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.innerHTML = `
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    `;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-button';
    closeBtn.id = 'chat-close';
    closeBtn.innerHTML = `
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    `;

    header.appendChild(avatar);
    header.appendChild(closeBtn);

    // Title
    const title = document.createElement('div');
    title.className = 'chat-title';
    title.innerHTML = 'Hello! Nice to see<br>you here';

    // Message section
    const messageSection = document.createElement('div');
    const message = document.createElement('div');
    message.className = 'chat-message';

    const messageAvatar = document.createElement('div');
    messageAvatar.className = 'message-avatar';
    messageAvatar.innerHTML = `
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    `;

    const messageText = document.createElement('span');
    messageText.className = 'message-text';
    messageText.textContent = 'How can I help you?';

    message.appendChild(messageAvatar);
    message.appendChild(messageText);
    messageSection.appendChild(message);

    // Start chat button
    const startBtn = document.createElement('button');
    startBtn.className = 'start-chat-btn';
    startBtn.innerHTML = `
      <span>Start chat</span>
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
      </svg>
    `;

    chatCard.appendChild(header);
    chatCard.appendChild(title);
    chatCard.appendChild(messageSection);
    chatCard.appendChild(startBtn);

    // Options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    // Schedule meeting option
    const scheduleOption = this.createOption(
      '#4b5563',
      `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>`,
      'Schedule a meeting'
    );

    // Video option
    const videoOption = this.createOption(
      '#dc2626',
      `<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>`,
      'Watch demo video'
    );

    optionsContainer.appendChild(scheduleOption);
    optionsContainer.appendChild(videoOption);

    // Bottom navigation
    const bottomNav = document.createElement('div');
    bottomNav.className = 'bottom-nav';

    const navItems = document.createElement('div');
    navItems.className = 'nav-items';

    // Home nav item
    const homeNav = document.createElement('div');
    homeNav.className = 'nav-item active';
    homeNav.innerHTML = `
      <div class="nav-icon">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
      <span class="nav-label">Home</span>
    `;

    // Chat nav item
    const chatNav = document.createElement('div');
    chatNav.className = 'nav-item';
    chatNav.innerHTML = `
      <div class="nav-icon">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <span class="nav-label">Chatting</span>
    `;

    navItems.appendChild(homeNav);
    navItems.appendChild(chatNav);

    // Powered by section
    const poweredBy = document.createElement('div');
    poweredBy.className = 'powered-by';
    poweredBy.innerHTML = `
      <span class="powered-by-text">Powered by </span>
      <span class="brand-text">Pinglet</span>
    `;

    bottomNav.appendChild(navItems);
    bottomNav.appendChild(poweredBy);

    // Assemble widget
    widget.appendChild(chatCard);
    widget.appendChild(optionsContainer);
    widget.appendChild(bottomNav);

    // Add to DOM
    document.body.appendChild(toggleBtn);
    document.body.appendChild(widget);

    // Store references
    this.toggleBtn = toggleBtn;
    this.widget = widget;
    this.closeBtn = closeBtn;
  }

  createOption(iconBg, iconSvg, text) {
    const option = document.createElement('div');
    option.className = 'option-item';

    const content = document.createElement('div');
    content.className = 'option-content';

    const icon = document.createElement('div');
    icon.className = 'option-icon';
    icon.style.backgroundColor = iconBg;
    icon.innerHTML = iconSvg;

    const textSpan = document.createElement('span');
    textSpan.className = 'option-text';
    textSpan.textContent = text;

    content.appendChild(icon);
    content.appendChild(textSpan);

    const arrow = document.createElement('div');
    arrow.className = 'option-arrow';
    arrow.innerHTML = `
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    `;

    option.appendChild(content);
    option.appendChild(arrow);

    return option;
  }

  attachEventListeners() {
    this.toggleBtn.addEventListener('click', () => {
      this.widget.classList.add('visible');
    });

    this.closeBtn.addEventListener('click', () => {
      this.widget.classList.remove('visible');
    });

    // Close widget when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.widget.contains(e.target) && !this.toggleBtn.contains(e.target)) {
        this.widget.classList.remove('visible');
      }
    });
  }
}

// Initialize the chat widget when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
  });
} else {
  new ChatWidget();
}