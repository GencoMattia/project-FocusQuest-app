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

            estimatedTimeOrder: "asc",

        };
    },

    methods: {
        async fetchUserData(estimatedTimeOrder) {
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
        },

        getPriorityTask() {
            axios.get('http://127.0.0.1:8000/api/tasks/top-priority', {
                params: {
                    estimated_time_order: this.estimatedTimeOrder
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
    },

    mounted() {
        this.fetchUserData();
        this.getPriorityTask();
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
                        <p class="lead">This is your dashboard, {{ store.loggedUser.name }} {{ store.loggedUser.surname
                            }}.</p>
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
                <div class="card task-card shadow-sm">
                    <div class="card-body text-center">
                        <h5 class="card-title task-title">🔥 Più Urgente</h5>
                        <p class="card-text">Questa è la tua task più urgente</p>

                        <div class="task-section">
                            <h6 class="section-title">Nome</h6>
                            <p class="section-content">{{ this.priorityTask.name }}</p>
                        </div>

                        <div class="task-section">
                            <h6 class="section-title">Scadenza</h6>
                            <p class="section-content">{{ this.priorityTask.deadline }}</p>
                        </div>

                        <div class="task-section">
                            <h6 class="section-title">Tempo stimato</h6>
                            <p class="section-content">{{ this.priorityTask.estimated_time }} ore</p>
                        </div>

                        <a href="#" class="btn btn-outline-secondary btn-task text-white">Maggiori informazioni</a>
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

.task-card {
    border: 1px solid $primary; // Usa il colore primario di Bootstrap per il bordo
    border-radius: 10px;
    background-color: #f8f9fa; // Colore di sfondo leggero

    .card-body {
        padding: 1.5rem;
    }

    .task-title {
        font-size: 1.25rem;
        font-weight: bold;
        color: #dc3545; // Rosso per indicare urgenza
        text-transform: uppercase;
        margin-bottom: 1.5rem;
    }

    .task-section {
        margin-bottom: 1.5rem;
        padding: 0.5rem;
        border: 1px solid lighten($primary, 40%);
        border-radius: 5px;
        background-color: #ffffff;

        .section-title {
            font-size: 1rem;
            font-weight: bold;
            color: $primary; // Colore primario per le etichette
            margin-bottom: 0.5rem;
        }

        .section-content {
            font-size: 1.1rem;
            color: #343a40;
        }
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

    &:hover {
        transform: translateY(-5px); // Piccolo effetto di sollevamento al passaggio del mouse
        transition: transform 0.3s ease;
    }
}
</style>