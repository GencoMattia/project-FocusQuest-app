import { reactive } from "vue";

export const store = reactive ({
    loggedUser: {
        id: "",
        name: "",
        surname: "",
        email: "",
    },
    selected_task_id: null,

    // THEME & LOCALE
    theme: localStorage.getItem("theme") || "light",
    locale: localStorage.getItem("locale") || "it",

    // UI SETTINGS (widget visibility etc.)
    ui: {
        widgets: {
            tips: false,
            stats: false,
            // ...extend as needed...
        }
    },

    // TOASTS
    toasts: [],
    addToast(message, variant = "info", timeout = 3000) {
        const id = Date.now() + Math.random();
        this.toasts.push({ id, message, variant });
        if (timeout) {
            setTimeout(() => this.removeToast(id), timeout);
        }
    },
    removeToast(id) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    },

    // THEME HANDLERS
    setTheme(nextTheme) {
        this.theme = nextTheme;
        localStorage.setItem("theme", nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
        document.body.classList.toggle("dark", nextTheme === "dark");
    },

    // i18n scaffolding (optional usage)
    messages: {
        it: {
            home: "Home",
            dashboard: "Dashboard",
            tasks: "Tasks",
            profile: "Profilo",
        },
        en: {
            home: "Home",
            dashboard: "Dashboard",
            tasks: "Tasks",
            profile: "Profile",
        }
    },
    t(key) {
        const pack = this.messages[this.locale] || {};
        return pack[key] || key;
    }
});