// ask for feedback

(function () {
    // --- Global body font ---
    document.body.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    document.body.style.backgroundColor = "#f8f9fa";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // --- Chat Widget Container ---
    const widget = document.createElement("div");
    widget.style.position = "fixed";
    widget.style.bottom = "24px";
    widget.style.right = "24px";
    widget.style.width = "380px";
    widget.style.fontFamily = "inherit";
    widget.style.opacity = "0"; // start hidden for animation
    widget.style.transform = "translateY(20px)";
    document.body.appendChild(widget);

    // Animate in
    widget.animate(
        [
            { transform: "translateY(20px)", opacity: 0 },
            { transform: "translateY(0)", opacity: 1 }
        ],
        { duration: 300, easing: "ease-out", fill: "forwards" }
    );

    // --- Close Button ---
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "-8px";
    closeBtn.style.left = "-8px";
    closeBtn.style.width = "28px";
    closeBtn.style.height = "28px";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.border = "none";
    closeBtn.style.background = "#ef4444";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.display = "flex";
    closeBtn.style.alignItems = "center";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.boxShadow = "0 2px 8px rgba(239,68,68,0.3)";
    widget.appendChild(closeBtn);

    // --- Chat Card ---
    const card = document.createElement("div");
    card.style.background = "white";
    card.style.borderRadius = "16px";
    card.style.boxShadow = "0 4px 24px -6px rgba(0,0,0,0.12)";
    card.style.overflow = "hidden";
    widget.appendChild(card);

    // --- Header ---
    const header = document.createElement("div");
    header.style.padding = "16px";
    header.style.borderBottom = "1px solid #e5e7eb";
    header.style.display = "flex";
    header.style.alignItems = "flex-start";
    header.style.gap = "12px";

    const avatar = document.createElement("div");
    avatar.style.width = "40px";
    avatar.style.height = "40px";
    avatar.style.borderRadius = "50%";
    avatar.style.overflow = "hidden";
    avatar.style.flexShrink = "0";
    avatar.style.background = "#f3f4f6";

    const img = document.createElement("img");
    img.src = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    avatar.appendChild(img);

    const userInfo = document.createElement("div");
    const name = document.createElement("h3");
    name.innerText = "Anna";
    name.style.fontSize = "14px";
    name.style.fontWeight = "600";
    name.style.color = "#1a1a1a";
    name.style.margin = "0 0 2px 0";

    const role = document.createElement("p");
    role.innerText = "AI SDR";
    role.style.fontSize = "12px";
    role.style.color = "#6b7280";
    role.style.margin = "0";

    userInfo.appendChild(name);
    userInfo.appendChild(role);

    header.appendChild(avatar);
    header.appendChild(userInfo);
    card.appendChild(header);

    // --- Content ---
    const content = document.createElement("div");
    content.style.padding = "16px";

    const msg = document.createElement("div");
    msg.innerHTML = "Hey there! I'm Anna, an AI SDR at Mailgun.<br>What's on your mind today?";
    msg.style.fontSize = "14px";
    msg.style.color = "#1a1a1a";
    msg.style.lineHeight = "1.6";
    msg.style.marginBottom = "16px";

    // Input Container
    const inputContainer = document.createElement("div");
    inputContainer.style.position = "relative";
    inputContainer.style.marginBottom = "12px";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Ask a question";
    input.autocomplete = "off";
    input.style.width = "100%";
    input.style.padding = "12px 48px 12px 16px";
    input.style.fontSize = "14px";
    input.style.border = "1px solid #e5e7eb";
    input.style.borderRadius = "8px";
    input.style.outline = "none";

    const sendBtn = document.createElement("button");
    sendBtn.innerHTML = "➤";
    sendBtn.disabled = true;
    sendBtn.style.position = "absolute";
    sendBtn.style.right = "8px";
    sendBtn.style.top = "50%";
    sendBtn.style.transform = "translateY(-50%)";
    sendBtn.style.width = "32px";
    sendBtn.style.height = "32px";
    sendBtn.style.border = "none";
    sendBtn.style.background = "transparent";
    sendBtn.style.color = "#ef4444";
    sendBtn.style.cursor = "pointer";
    sendBtn.style.fontSize = "16px";

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendBtn);

    // Privacy Notice
    const notice = document.createElement("p");
    notice.innerHTML = 'This chat may be recorded as described in our <a href="#">Privacy Policy</a>.';
    notice.style.fontSize = "12px";
    notice.style.color = "#6b7280";
    notice.style.lineHeight = "1.4";
    notice.style.margin = "0";

    content.appendChild(msg);
    content.appendChild(inputContainer);
    content.appendChild(notice);
    card.appendChild(content);

    // --- Events ---
    closeBtn.addEventListener("click", () => {
        widget.animate(
            [
                { transform: "translateY(0)", opacity: 1 },
                { transform: "translateY(20px)", opacity: 0 }
            ],
            { duration: 200, easing: "ease-in", fill: "forwards" }
        ).onfinish = () => widget.remove();
    });

    input.addEventListener("input", () => sendBtn.disabled = !input.value.trim());
    sendBtn.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text) return;
        console.log("Sending message:", text);
        input.value = "";
        sendBtn.disabled = true;
    });
})();