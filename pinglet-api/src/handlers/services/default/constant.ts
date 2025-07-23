import { ProjectConfig } from "@/utils/interfaces/project.interface";
import { TemplateConfig } from "@/utils/interfaces/template.interface";

export const DEFAULT_STYLES: TemplateConfig = {
    duration: 3000, // 5 seconds

    btn1: {
        color: "#ffffff",
        backgroundColor: "#007bff", // primary blue
        padding: "10px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        border: "none",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    },

    btn2: {
        color: "#333333",
        backgroundColor: "#f0f0f0", // neutral
        padding: "10px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        border: "1px solid #ccc",
    },

    title: {
        color: "#111111",
        fontSize: "15px",
        fontWeight: "500",
        lineHeight: "1.4",
        margin: "0 0 6px 0",
        textAlign: "left",
    },

    description: {
        color: "#444444",
        fontSize: "13px",
        fontWeight: "400",
        lineHeight: "1.5",
        margin: "0 0 10px 0",
        textAlign: "left",
    },
    controls: {
        video: {
            autoplay: false,
            muted: false,
            loop: false,
            controls: false,
        },
        audio: {
            autoplay: false,
            muted: false,
            loop: false,
            controls: false,
        },
    },
    media: {
        image: {
            width: "100%",
            height: "200px",
            borderRadius: "6px",
            objectFit: "cover",
            margin: "0 0 8px 0",
        },
        icon: {
            width: "24px",
            height: "24px",
            margin: "0 8px 0 0",
            objectFit: "contain",
        },
        logo: {
            width: "50px",
            height: "50px",
            margin: "0 8px 0 0",
            objectFit: "contain",
        },
        video: {
            width: "100%",
            height: "140px",
            borderRadius: "6px",
            objectFit: "cover",
            margin: "0 0 10px 0",
        },
        iframe: {
            width: "100%",
            height: "140px",
            borderRadius: "6px",
            objectFit: "cover",
            margin: "0 0 10px 0",
        },
        audio: {
            width: "100%",
            margin: "8px 0",
        },
    },
};
export const PROJECT_DEFAULT_CONFIG: ProjectConfig = {
    position: "bottom-left",
    transition: "fade", // or "slide", "zoom"
    branding: {
        show: true,
        once: true,
        html: `Notifications by <a href="https://pinglet.enjoys.in" style="color:#4da6ff;text-decoration:none;" target="_blank">Pinglet</a> - Enjoys`,
    },
    sound: {
        play: false,
        src: "https://pinglet.enjoys.in/api/v1/pinglet-sound.mp3?v=1&ext=mp3",
        volume: 0.6,
    },
    duration: 2000,
    maxVisible: 3,                // 🆕 Max number of visible toasts
    stacking: true,               // 🆕 Whether to stack new toasts vertically
    auto_dismiss: true,          // 🆕 Automatically dismiss after duration
    dismissible: true,           // 🆕 Show close "X" button
    pauseOnHover: true,
    website: "https://pinglet.enjoys.in",
    time: true, // 🆕 Show time of notification
    favicon: true,// 🆕 Show favicon of the website
    theme: {
        mode: "light",            // 🆕 "light" | "dark" | "auto"
        customClass: "",          // 🆕 Custom class for advanced styling
        rounded: true,            // 🆕 Rounded corners
        shadow: true,             // 🆕 Enable/disable shadow
        border: false,            // 🆕 Border around toast
    },

    iconDefaults: {
        show: true,               // 🆕 Show icon by default
        size: 20,
        position: "left",         // "left" | "right" | "top"
    },

    progressBar: {
        show: true,               // 🆕 Show progress bar timer
        color: "#4da6ff",         // Optional customization
        height: 3
    },
}
