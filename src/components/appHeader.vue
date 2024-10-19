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
        console.log('utente loggato', this.store.loggedUser)
    }
};
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
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
            </div>
        </div>
    </div>
</template>

<style scoped>
.navbar-nav .nav-item {
    margin-right: 15px;
}
</style>
