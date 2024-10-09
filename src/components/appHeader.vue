<script>
export default {
    data() {
        return {
            isAuthenticated: !!localStorage.getItem("token"),
        };
    },

    methods: {
        logOutUser() {
            localStorage.removeItem("token");
            this.isAuthenticated = false;
            this.$router.push({name: 'home'});
        },

        checkAuthStatus() {
            this.isAuthenticated = !!localStorage.getItem("token");
        }
    },

    created() {
        this.checkAuthStatus();
    }
};
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Dropdown
                        </a>
                        <ul class="dropdown-menu">
                            <li v-if="isAuthenticated">
                                <a href="#" class="dropdown-item" @click.prevent="logOutUser">Logout</a>
                            </li>
                            <li v-else>
                                <router-link class="dropdown-item" :to="{name: 'login'}">Login</router-link>
                            </li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
</template>

<style scoped></style>