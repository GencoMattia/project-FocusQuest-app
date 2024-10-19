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

            priorityTask: {

            },

            isAscending: true,
        };
    },

    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users/show');
                console.log(response.data.user);

                this.store.loggedUser.name = response.data.user.name;
                this.store.loggedUser.surname = response.data.user.surname;
                this.store.loggedUser.email = response.data.user.email;
                this.store.loggedUser.id = response.data.user.id;

                console.log(this.store.loggedUser)
            } catch (error) {
                console.error("Errore nel recupero dei dati dell'utente:", error);
            }
        },

        getPriorityTask() {
            console.log("Order direction:", this.isAscending ? "Ascending" : "Descending");

            axios.get('http://127.0.0.1:8000/api/tasks/top-priority', {
                params: {
                    estimated_time_order: this.isAscending ? "asc" : "desc"
                }
            }).then((response) => {
                console.log(response.data)

                if (response.data.task) {
                    this.priorityTask = response.data.task;
                } else {
                    console.log("Nessuna task trovata");
                }
            }).catch((error) => {
                console.error("Errore nel recupera della task con priorità:", error);
            })
        },

        toggleOrder() {
            this.getPriorityTask();
        },
    },

    mounted() {
        this.fetchUserData();
        this.getPriorityTask();
    },

    computed: {
        orderLabel() {
            return this.isAscending ? "Ascendente" : "Discendente";
        }
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

        <!-- Task Cards -->
        <div class="row justify-content-center mt-5">
            <!-- Task più urgente -->
            <div class="col-lg-4">
                <div class="card task-card shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title task-title">🔥 Più Urgente</h5>
                        <p class="card-text">Questa è la tua task più urgente</p>

                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="taskOrderSwitch"
                                v-model="isAscending" @change="toggleOrder">
                            <label class="form-check-label" for="taskOrderSwitch">
                                {{ orderLabel }}
                            </label>
                        </div>

                        <div class="task-section">
                            <h6 class="section-title">Nome</h6>
                            <p class="section-content">{{ priorityTask.name }}</p>
                        </div>

                        <div class="task-section">
                            <h6 class="section-title">Scadenza</h6>
                            <p class="section-content">{{ priorityTask.deadline }}</p>
                        </div>

                        <div class="task-section">
                            <h6 class="section-title">Tempo stimato</h6>
                            <p class="section-content">{{ priorityTask.estimated_time }} Minuti</p>
                        </div>

                        <a href="#" class="btn btn-outline-secondary btn-task text-white">
                            Maggiori informazioni
                        </a>
                    </div>
                </div>
            </div>

            <!-- New task -->
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title">➕ Nuova Task</h5>
                        <p class="card-text">Crea una nuova task da zero.</p>
                        <router-link :to="{ name: 'tasks.create' }" class="btn btn-outline-primary">Crea Task</router-link>
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

                .btn-task {
                    border-color: $primary;
                    background-color: $primary;
                    color: white;
                    padding: 0.5rem 1.5rem;
                    text-transform: uppercase;

                    &:hover {
                        background-color: darken($primary, 10%);
                        color: white;
                    }
                }
            }

            &:hover {
                transform: translateY(-5px);
                transition: transform 0.3s ease;
            }
        }
    }
}
</style>