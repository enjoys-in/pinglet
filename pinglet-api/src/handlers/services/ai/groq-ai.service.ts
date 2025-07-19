import { Groq } from 'groq-sdk';

const groq = new Groq();
export const SYSTEM_PROMPT = `You are a code converter. Your task is to take user-supplied HTML and CSS and convert it into a pure Vanilla JavaScript implementation that builds the same layout and style using only document.createElement, element.style, and DOM methods.
Convert the following HTML and CSS into a pure Vanilla JavaScript function.

Do not include any comments.

The output should be a JavaScript function that builds the DOM elements using document.createElement, sets class names, styles, and appends to the DOM.

Inline CSS class styles as DOM styles using element.style.

If a class is reused, create a helper function or keep the logic DRY.

Do not return any explanation, only the pure JavaScript code that represents the original HTML and CSS.

The final code should contain:

A JSON input object (icon, title, message, color)

A createNotification(data) function that renders the notification using document.createElement

The output DOM should match the layout and style of the provided HTML+CSS.

The final result should not include any stringified JS code or backticks—just actual executable code embedded in the JSON format under "result" key.
The final output must be wrapped in a valid JSON object in the format:

json 
{
  "result": <actual JavaScript code as raw executable code, NOT a string>
}
`

async function getGroqAi() {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": "<html lang=\"en\">\n\n\n\n<head>\n\n\n\n  <title>Push Notification</title>\n\n  <style>\n\n    * {\n\n      box-sizing: border-box;\n\n    }\n\n\n\n    body {\n\n      margin: 0;\n\n      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n\n    }\n\n\n\n    .notification-wrapper {\n\n      position: fixed;\n\n      bottom: 20px;\n\n      right: 20px;\n\n      max-width: 350px;\n\n      z-index: 9999;\n\n      display: flex;\n\n      flex-direction: column;\n\n      gap: 12px;\n\n    }\n\n\n\n    .notification {\n\n      background: #fff;\n\n      border-left: 4px solid #4f46e5;\n\n      border-radius: 12px;\n\n      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);\n\n      display: flex;\n\n      padding: 16px;\n\n      gap: 12px;\n\n      align-items: start;\n\n      animation: slideUp 0.4s ease-out;\n\n      position: relative;\n\n      overflow: hidden;\n\n    }\n\n\n\n    .notification-icon {\n\n      width: 36px;\n\n      height: 36px;\n\n      flex-shrink: 0;\n\n      background: #4f46e5;\n\n      color: #fff;\n\n      border-radius: 50%;\n\n      display: flex;\n\n      align-items: center;\n\n      justify-content: center;\n\n      font-size: 18px;\n\n    }\n\n\n\n    .notification-content {\n\n      flex: 1;\n\n    }\n\n\n\n    .notification-title {\n\n      font-weight: 600;\n\n      font-size: 16px;\n\n      margin-bottom: 4px;\n\n      color: #111827;\n\n    }\n\n\n\n    .notification-message {\n\n      font-size: 14px;\n\n      color: #4b5563;\n\n    }\n\n\n\n    .notification-close {\n\n      position: absolute;\n\n      top: 10px;\n\n      right: 12px;\n\n      background: none;\n\n      border: none;\n\n      font-size: 16px;\n\n      color: #9ca3af;\n\n      cursor: pointer;\n\n      transition: color 0.2s;\n\n    }\n\n\n\n    .notification-close:hover {\n\n      color: #6b7280;\n\n    }\n\n\n\n    @keyframes slideUp {\n\n      from {\n\n        transform: translateY(20px);\n\n        opacity: 0;\n\n      }\n\n\n\n      to {\n\n        transform: translateY(0);\n\n        opacity: 1;\n\n      }\n\n    }\n\n  </style>\n\n</head>\n\n\n\n<body>\n\n\n\n  <div class=\"notification-wrapper\">\n\n    <div class=\"notification\">\n\n      <div class=\"notification-icon\">🔔</div>\n\n      <div class=\"notification-content\">\n\n        <div class=\"notification-title\">New Message</div>\n\n        <div class=\"notification-message\">You have a new message from John Doe.</div>\n\n      </div>\n\n      <button class=\"notification-close\" onclick=\"this.parentElement.remove()\">×</button>\n\n    </div>\n\n  </div>\n\n\n\n</body>\n\n\n\n</html>"
            },
            {
                "role": "assistant",
                "content": "```javascript\nconst notificationData = {\n  icon: '🔔',\n  title: 'New Message',\n  message: 'You have a new message from John Doe.',\n  color: '#4f46e5'\n};\n\nfunction createNotification(data) {\n  const notificationWrapper = document.createElement('div');\n  notificationWrapper.style.position = 'fixed';\n  notificationWrapper.style.bottom = '20px';\n  notificationWrapper.style.right = '20px';\n  notificationWrapper.style.maxWidth = '350px';\n  notificationWrapper.style.zIndex = '9999';\n  notificationWrapper.style.display = 'flex';\n  notificationWrapper.style.flexDirection = 'column';\n  notificationWrapper.style.gap = '12px';\n\n  const notification = document.createElement('div');\n  notification.className = 'notification';\n  notification.style.background = '#fff';\n  notification.style.borderLeft = '4px solid ' + data.color;\n  notification.style.borderRadius = '12px';\n  notification.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';\n  notification.style.display = 'flex';\n  notification.style.padding = '16px';\n  notification.style.gap = '12px';\n  notification.style.alignItems = 'start';\n  notification.style.animation = 'slideUp 0.4s ease-out';\n  notification.style.position = 'relative';\n  notification.style.overflow = 'hidden';\n\n  const notificationIcon = createNotificationIcon(data.icon, data.color);\n  notification.appendChild(notificationIcon);\n\n  const notificationContent = createNotificationContent(data.title, data.message);\n  notification.appendChild(notificationContent);\n\n  const notificationClose = createNotificationClose();\n  notification.appendChild(notificationClose);\n\n  notificationWrapper.appendChild(notification);\n  document.body.appendChild(notificationWrapper);\n\n  setTimeout(() => {\n    notification.style.animation = '';\n  }, 400);\n}\n\nfunction createNotificationIcon(icon, color) {\n  const notificationIcon = document.createElement('div');\n  notificationIcon.className = 'notification-icon';\n  notificationIcon.style.width = '36px';\n  notificationIcon.style.height = '36px';\n  notificationIcon.style.flexShrink = '0';\n  notificationIcon.style.background = color;\n  notificationIcon.style.color = '#fff';\n  notificationIcon.style.borderRadius = '50%';\n  notificationIcon.style.display = 'flex';\n  notificationIcon.style.alignItems = 'center';\n  notificationIcon.style.justifyContent = 'center';\n  notificationIcon.style.fontSize = '18px';\n  notificationIcon.textContent = icon;\n  return notificationIcon;\n}\n\nfunction createNotificationContent(title, message) {\n  const notificationContent = document.createElement('div');\n  notificationContent.className = 'notification-content';\n  notificationContent.style.flex = '1';\n\n  const notificationTitle = document.createElement('div');\n  notificationTitle.className = 'notification-title';\n  notificationTitle.style.fontWeight = '600';\n  notificationTitle.style.fontSize = '16px';\n  notificationTitle.style.marginBottom = '4px';\n  notificationTitle.style.color = '#111827';\n  notificationTitle.textContent = title;\n  notificationContent.appendChild(notificationTitle);\n\n  const notificationMessage = document.createElement('div');\n  notificationMessage.className = 'notification-message';\n  notificationMessage.style.fontSize = '14px';\n  notificationMessage.style.color = '#4b5563';\n  notificationMessage.textContent = message;\n  notificationContent.appendChild(notificationMessage);\n\n  return notificationContent;\n}\n\nfunction createNotificationClose() {\n  const notificationClose = document.createElement('button');\n  notificationClose.className = 'notification-close';\n  notificationClose.style.position = 'absolute';\n  notificationClose.style.top = '10px';\n  notificationClose.style.right = '12px';\n  notificationClose.style.background = 'none';\n  notificationClose.style.border = 'none';\n  notificationClose.style.fontSize = '16px';\n  notificationClose.style.color = '#9ca3af';\n  notificationClose.style.cursor = 'pointer';\n  notificationClose.textContent = '×';\n  notificationClose.addEventListener('click', () => {\n    notificationClose.parentElement.remove();\n  });\n  return notificationClose;\n}\n\ncreateNotification(notificationData);\n```"
            },
            {
                "role": "user",
                "content": ""
            }
        ],
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "response_format": {
            "type": "json_object"
        },
        "stop": null
    });

}
