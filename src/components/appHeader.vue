<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary w-100">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: 'dashboard'}">Dashboard</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: 'tasks.index'}">Lista Task</router-link>
                    </li>
                </ul>
                <div class="d-flex align-items-center">
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
            store
        };
    },
    methods: {
        logOutUser() {
            localStorage.removeItem("token");
            this.isAuthenticated = false;
            this.store.loggedUser = { id: '', name: '', surname: '', email: '' };
            this.$router.push({ name: 'home' });
        },
        checkAuthStatus() {
            this.isAuthenticated = !!localStorage.getItem("token");
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
        console.log('utente loggato', this.store.loggedUser);
    }
};
</script>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.navbar {
    width: 100vw;
    min-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    border-radius: 0;
    background: $pastel-blue;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.navbar-nav .nav-item {
    margin-right: 15px;
}

/* Navbar links style */
.navbar-nav .nav-link {
    color: $text-color;
    font-weight: 500;
    transition: color 0.3s ease;
}

/* Navbar link hover effect */
.navbar-nav .nav-link:hover {
    color: $primary-color;
}

/* Dropdown menu alignment and style */
.dropdown-menu {
    background-color: $secondary-color;
}

/* Dropdown item style */
.dropdown-item {
    transition: background-color 0.3s ease;
}

.dropdown-item:hover {
    background-color: $pastel-accent;
    color: $primary-color;
}
</style>
