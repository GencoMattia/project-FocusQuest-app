<template>
    <nav class="navbar navbar-expand-lg fq-sticky" :class="{ 'is-hidden': isHidden }" role="navigation" aria-label="Main navigation">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <RouterLink class="navbar-brand fw-semibold" :to="{ name: 'home'}" aria-label="Home">FocusQuest</RouterLink>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: 'dashboard'}">Dashboard</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: 'tasks.index'}">Lista Task</router-link>
                    </li>
                </ul>
                <div class="d-flex align-items-center gap-2">
                    <!-- Theme toggle -->
                    <button class="btn btn-sm btn-outline-primary" @click="toggleTheme" :aria-pressed="store.theme==='dark'" aria-label="Toggle theme">
                        <span v-if="store.theme==='dark'">Light</span>
                        <span v-else>Dark</span>
                    </button>

                    <div class="dropdown">
                        <a class="nav-link dropdown-toggle" role="button" id="navbarDropdown" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Azioni
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li v-if="isAuthenticated">
                                <a href="#" class="dropdown-item" @click.prevent="logOutUser">Logout</a>
                            </li>
                            <li v-if="isAuthenticated">
                                <router-link class="dropdown-item" :to="`/profile/${this.store.loggedUser.name}-${this.store.loggedUser.surname}`">Profilo</router-link>
                            </li>
                            <li v-if="!isAuthenticated">
                                <router-link class="dropdown-item" :to="{ name: 'login'}">Login</router-link>
                            </li>
                            <li v-if="!isAuthenticated">
                                <router-link class="dropdown-item" :to="{ name: 'register'}">Registrati</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { store } from '@/store';
export default {
    data() {
        return {
            isAuthenticated: !!localStorage.getItem("token"),
            store,
            isHidden: false,
            _lastScrollY: 0,
            _idleTimer: null,
        };
    },
    methods: {
        logOutUser() {
            localStorage.removeItem("token");
            this.isAuthenticated = false;
            this.store.loggedUser = { id: '', name: '', surname: '', email: '' };
            this.$router.push({ name: 'home' });
            this.$nextTick(() => this.store.addToast('Logout effettuato', 'success'));
        },
        checkAuthStatus() {
            this.isAuthenticated = !!localStorage.getItem("token");
        },
        toggleTheme() {
            const next = this.store.theme === 'dark' ? 'light' : 'dark';
            this.store.setTheme(next);
        },
        _onScroll() {
            const y = window.scrollY || 0;
            this.isHidden = y > this._lastScrollY && y > 56; // hide on scroll down
            this._lastScrollY = y;

            clearTimeout(this._idleTimer);
            this._idleTimer = setTimeout(() => {
                if (window.scrollY > 100) this.isHidden = true; // auto-hide after idle
            }, 2500);
        }
    },
    watch: {
        '$route'() {
            this.isAuthenticated = !!localStorage.getItem("token");
        }
    },
    mounted() {
        this.checkAuthStatus();
        this.$watch(() => this.store.loggedUser, () => this.checkAuthStatus(), { deep: true });
        window.addEventListener('scroll', this._onScroll, { passive: true });
    },
    unmounted() {
        window.removeEventListener('scroll', this._onScroll);
    }
};
</script>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.navbar {
    width: 100%;
    border-radius: 0;
    background: var(--color-surface);
    color: var(--color-text);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.navbar-brand, .nav-link {
    color: var(--color-text);
}
.navbar-nav .nav-link:hover {
    color: var(--color-primary);
}
.dropdown-menu {
    background-color: var(--color-surface);
}
.dropdown-item:hover {
    background-color: rgba(118,181,255,0.15);
    color: var(--color-text);
}
.btn-outline-primary {
    border-color: var(--color-primary);
    color: var(--color-primary);
}
.btn-outline-primary:hover {
    background: var(--color-primary);
    color: #fff;
}
</style>
