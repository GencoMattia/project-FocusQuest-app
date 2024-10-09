<script>
import axios from "axios";
import UserProfileLink from "@/components/UserProfileLink.vue";
import { store } from "@/store";


export default {
    components: {
        UserProfileLink,
    },

    data() {
        return {
            store,
            user: {

            },
            store

        };
    },

    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user');
                console.log(response.data.user);

                this.store.loggedUser.name = response.data.user.name;
                this.store.loggedUser.surname = response.data.user.surname;
                this.store.loggedUser.email = response.data.user.email;
                this.store.loggedUser.id = response.data.user.id;

                console.log(this.store.loggedUser)
            } catch (error) {
                console.error("Errore nel recupero dei dati dell'utente:", error);
            }
        }
    },

    mounted() {
        this.fetchUserData();
    }
};
</script>

<template>
    <div class="container py-5">
        <!-- Welcome Card -->
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h3 class="card-title mb-0">Benvenuto, {{ store.loggedUser.name }}!</h3>
                    </div>
                    <div class="card-body">
                        <p class="lead">This is your dashboard, {{ store.loggedUser.name }} {{ store.loggedUser.surname }}.</p>
                        <p><strong>Email:</strong> {{ store.loggedUser.email }}</p>
                        <p><strong>User ID:</strong> {{ store.loggedUser.id }}</p>

                        <div class="text-center mt-4">
                            <UserProfileLink :user="user" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Features -->
        <div class="row justify-content-center mt-5">
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title">Feature 1</h5>
                        <p class="card-text">A quick description of Feature 1.</p>
                        <a href="#" class="btn btn-outline-primary">Learn More</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title">Feature 2</h5>
                        <p class="card-text">A quick description of Feature 2.</p>
                        <a href="#" class="btn btn-outline-secondary">Learn More</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../assets/partials/variables" as *;

.container {
    background-color: $light-color;
    padding: 20px;
    border-radius: 10px;

    .row {
        margin-bottom: 20px;

        .card {
            border-radius: 8px;
            box-shadow: $box-shadow;
            background-color: $light-color;

            &-header {
                background-color: $primary-color;
                color: $light-color;
                padding: 15px;
                border-bottom: none;

                h3 {
                    margin: 0;
                }
            }

            &-body {
                padding: 30px;

                p {
                    font-size: 1.1rem;
                    margin-bottom: 10px;
                }
            }
        }

        .btn {
            &-primary {
                background-color: $primary-color;
                border-color: $primary-color;

                &:hover {
                    background-color: $primary-dark;
                }
            }

            &-outline-primary {
                border-color: $primary-color;
                color: $primary-color;

                &:hover {
                    background-color: $primary-color;
                    color: $light-color;
                }
            }

            &-outline-secondary {
                border-color: $secondary-color;
                color: $secondary-color;

                &:hover {
                    background-color: $secondary-color;
                    color: $light-color;
                }
            }
        }
    }
}
</style>