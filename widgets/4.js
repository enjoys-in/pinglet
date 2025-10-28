// call connect widget 4
// Main container
const container = document.createElement("div");
Object.assign(container.style, {
  minHeight: "100vh",
  backgroundColor: "#0c0c0c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  position: "relative",
  overflow: "hidden",
  fontFamily: "sans-serif",
});

// Glass background effect layers
const glass1 = document.createElement("div");
Object.assign(glass1.style, {
  position: "absolute",
  top: "-50%",
  left: "-50%",
  width: "100%",
  height: "100%",
  background: "linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))",
  borderRadius: "9999px",
  filter: "blur(96px)",
});

const glass2 = document.createElement("div");
Object.assign(glass2.style, {
  position: "absolute",
  bottom: "-50%",
  right: "-50%",
  width: "100%",
  height: "100%",
  background: "linear-gradient(to top left, rgba(16, 185, 129, 0.1), rgba(234, 179, 8, 0.1))",
  borderRadius: "9999px",
  filter: "blur(96px)",
});

// Widget box
const widget = document.createElement("div");
Object.assign(widget.style, {
  width: "100%",
  maxWidth: "24rem",
  borderRadius: "1.5rem",
  overflow: "hidden",
  backdropFilter: "blur(16px)",
  background: "rgba(0, 0, 0, 0.3)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  position: "relative",
  zIndex: 10,
});

const content = document.createElement("div");
content.style.padding = "1.5rem";
content.style.display = "flex";
content.style.flexDirection = "column";
content.style.gap = "1.5rem";

// Header
const header = document.createElement("div");
header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";

// Status
const status = document.createElement("div");
status.style.display = "flex";
status.style.alignItems = "center";
status.style.gap = "0.5rem";

const dot = document.createElement("div");
Object.assign(dot.style, {
  width: "0.75rem",
  height: "0.75rem",
  borderRadius: "50%",
  backgroundColor: "#10b981",
  animation: "pulse 1.5s infinite",
});

const statusText = document.createElement("span");
statusText.textContent = "Available now";
Object.assign(statusText.style, {
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#34d399",
});

status.append(dot, statusText);

// Close Button
const closeBtn = document.createElement("button");
closeBtn.textContent = "✕";
Object.assign(closeBtn.style, {
  background: "transparent",
  border: "none",
  color: "#a1a1aa",
  borderRadius: "9999px",
  width: "2rem",
  height: "2rem",
  cursor: "pointer",
});
closeBtn.onmouseenter = () => (closeBtn.style.background = "rgba(255,255,255,0.1)");
closeBtn.onmouseleave = () => (closeBtn.style.background = "transparent");

// Title
const titleWrap = document.createElement("div");
titleWrap.style.textAlign = "center";

const title = document.createElement("h2");
title.textContent = "Need assistance?";
Object.assign(title.style, {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#fff",
});

const subtitle = document.createElement("p");
subtitle.textContent = "Choose how you'd like to connect";
Object.assign(subtitle.style, {
  fontSize: "0.875rem",
  color: "#a1a1aa",
});

titleWrap.append(title, subtitle);

// Call Options
const optionsWrap = document.createElement("div");
optionsWrap.style.display = "flex";
optionsWrap.style.flexDirection = "column";

function createOption(icon, title, subtitle, isLast) {
  const option = document.createElement("button");
  Object.assign(option.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "1rem",
    color: "#fff",
    background: "transparent",
    border: "none",
    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    height: "4rem",
    transition: "background 0.2s ease",
    borderRadius: "1rem",
  });

  option.onmouseenter = () => (option.style.background = "rgba(255,255,255,0.1)");
  option.onmouseleave = () => (option.style.background = "transparent");

  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.alignItems = "center";
  left.style.gap = "1rem";

  const iconWrap = document.createElement("div");
  Object.assign(iconWrap.style, {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "9999px",
    background: "rgba(255,255,255,0.05)",
    color: "#34d399",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  });
  iconWrap.innerHTML = icon;

  const textWrap = document.createElement("div");
  const optTitle = document.createElement("div");
  optTitle.textContent = title;
  optTitle.style.fontWeight = "500";

  const optSub = document.createElement("div");
  optSub.textContent = subtitle;
  optSub.style.fontSize = "0.875rem";
  optSub.style.color = "#a1a1aa";

  textWrap.append(optTitle, optSub);
  left.append(iconWrap, textWrap);

  const chevron = document.createElement("span");
  chevron.textContent = "›";
  chevron.style.color = "#52525b";
  chevron.style.fontSize = "1.25rem";

  option.append(left, chevron);
  return option;
}

optionsWrap.append(
  createOption("📞", "Voice Call", "Talk with an agent"),
  createOption("🎥", "Video Call", "Face-to-face chat"),
  createOption("📅", "Schedule Call", "Book a time later", true)
);

// Footer
const footer = document.createElement("div");
footer.style.paddingTop = "1rem";
footer.style.borderTop = "1px solid rgba(255,255,255,0.1)";
footer.style.textAlign = "center";

const footerText = document.createElement("span");
footerText.textContent = "Powered by CallConnect";
Object.assign(footerText.style, {
  fontSize: "0.75rem",
  color: "#71717a",
});
footer.append(footerText);

// Final assembly
header.append(status, closeBtn);
content.append(header, titleWrap, optionsWrap, footer);
widget.append(content);
container.append(glass1, glass2, widget);
document.body.appendChild(container);

// Optional: Keyframes for pulse effect
const style = document.createElement("style");
style.textContent = `
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}`;
document.head.appendChild(style);