
function showMailToast({ sender, subject, message, avatar }) {
  // === Toast Container (holds multiple toasts) ===
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "12px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  // === Toast Element ===
  const toast = document.createElement("div");
  toast.style.width = "400px";
  toast.style.background = "#1e1e1e";
  toast.style.color = "#f1f1f1";
  toast.style.border = "1px solid #333";
  toast.style.borderRadius = "10px";
  toast.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
  toast.style.overflow = "hidden";
  toast.style.display = "flex";
  toast.style.flexDirection = "column";
  toast.style.animation = "slideIn 0.4s ease-out";

  // === Header ===
  const header = document.createElement("div");
  header.style.background = "#2a2a2a";
  header.style.padding = "4px 8px";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const headerLeft = document.createElement("div");
  headerLeft.style.display = "flex";
  headerLeft.style.alignItems = "center";
  headerLeft.style.gap = "8px";

  const iconBox = document.createElement("div");
  iconBox.style.background = "#0078d4";
  iconBox.style.borderRadius = "6px";
  iconBox.style.padding = "6px";
  const mailIcon = document.createElement("span");
  mailIcon.textContent = "📧";
  iconBox.appendChild(mailIcon);

  const headerText = document.createElement("span");
  headerText.textContent = "Airsend";
  headerText.style.fontWeight = "600";
  headerText.style.fontSize = "14px";
  headerText.style.color = "#fff";

  headerLeft.append(iconBox, headerText);

  const headerRight = document.createElement("div");
  headerRight.style.display = "flex";
  headerRight.style.gap = "6px";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.color = "#aaa";
  closeBtn.onmouseenter = () => (closeBtn.style.color = "#fff");
  closeBtn.onmouseleave = () => (closeBtn.style.color = "#aaa");

  closeBtn.onclick = () => {
    toast.style.animation = "fadeOut 0.3s ease-in";
    setTimeout(() => toast.remove(), 250);
  };

  headerRight.appendChild(closeBtn);
  header.append(headerLeft, headerRight);

  // === Content ===
  const content = document.createElement("div");
  content.style.display = "flex";
  content.style.padding = "14px";
  content.style.gap = "10px";

  // Avatar
  const avatarDiv = document.createElement("div");
  avatarDiv.style.flexShrink = "0";

  if (avatar) {
    const img = document.createElement("img");
    img.src = avatar;
    img.style.width = "48px";
    img.style.height = "48px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    avatarDiv.appendChild(img);
  } else {
    const circle = document.createElement("div");
    circle.style.width = "48px";
    circle.style.height = "48px";
    circle.style.borderRadius = "50%";
    circle.style.background = "#0078d4";
    circle.style.display = "flex";
    circle.style.alignItems = "center";
    circle.style.justifyContent = "center";
    circle.style.fontWeight = "bold";
    circle.style.color = "#fff";
    circle.textContent = sender?.charAt(0)?.toUpperCase() || "?";
    avatarDiv.appendChild(circle);
  }

  // Message
  const msgDiv = document.createElement("div");
  msgDiv.style.flex = "1";
  msgDiv.innerHTML = `
    <div style="font-weight:600;font-size:15px;margin-bottom:3px;">${sender}</div>
    <div style="font-weight:500;font-size:14px;margin-bottom:4px;">${subject}</div>
    <div style="font-size:13px;line-height:1.4;color:#ccc;">${message}</div>
  `;

  content.append(avatarDiv, msgDiv);


  const actions = document.createElement("div");
  actions.style.display = "grid";
  actions.style.gridTemplateColumns = "repeat(3, 1fr)";
  actions.style.borderTop = "1px solid #333";

  const makeBtn = (label, icon, fn) => {
    const btn = document.createElement("button");
    btn.innerHTML = `${icon}<br><span style="font-size:11px;">${label}</span>`;
    btn.style.padding = "8px";
    btn.style.background = "none";
    btn.style.border = "1px solid #333";
    btn.style.color = "#aaa";
    btn.style.cursor = "pointer";
    btn.onmouseenter = () => (btn.style.color = "#fff");
    btn.onmouseleave = () => (btn.style.color = "#aaa");
    btn.onclick = fn;
    return btn;
  };

  const delBtn = makeBtn("Delete", "🗑️", () => toast.remove());
  const flagBtn = makeBtn("Flag", "🚩", () => alert("Flagged"));
  const dismissBtn = makeBtn("Dismiss", "❌", () => toast.remove());

  actions.append(delBtn, flagBtn, dismissBtn);

  // === Combine ===
  toast.append(header, content, actions);
  container.appendChild(toast);

  // === Auto-dismiss ===
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease-in";
    setTimeout(() => toast.remove(), 250);
  }, 6000);
}

// === Add basic animations ===
const style = document.createElement("style");
style.textContent = `
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}
`;
document.head.appendChild(style);

// === Example Usage ===
showMailToast({
  sender: "John Doe",
  subject: "New Message Received",
  message: "Hey! Just checking in about the meeting tomorrow.",
  avatar: ""
});