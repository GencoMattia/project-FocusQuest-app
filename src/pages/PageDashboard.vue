<script>
import api from "@/api/axios";
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
                const response = await api.get('users/show');
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

            api.get('tasks/top-priority', {
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
            return this.isAscending ? "Poco" : "Molto";
        }
    }
};
</script>

<template>
    <div class="container dashboard-page mt-5 pt-5">
        <!-- Welcome Card -->
        <div class="row justify-content-center mt-4">
            <div class="col-lg-8">
                <div class="card shadow-sm pastel-card dashboard-welcome-card">
                    <div class="card-header d-flex justify-content-between align-items-center pastel-header">
                        <h3 class="card-title mb-0">Benvenuto, {{ store.loggedUser.name }}!</h3>
                        <i class="bi bi-person-circle fs-2"></i>
                    </div>
                    <div class="card-body">
                        <p class="lead">Questa è la tua dashboard, {{ store.loggedUser.name }} {{ store.loggedUser.surname }}.</p>
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
            <div class="col-lg-5 mb-4">
                <div class="card task-card shadow-sm pastel-card dashboard-task-card">
                    <div class="card-body text-center">
                        <h5 class="card-title task-title">🔥 Più Urgente</h5>
                        <p class="card-text">Questa è la tua task più urgente</p>
                        <div class="form-check form-switch d-flex justify-content-evenly mt-3">
                            <label class="form-check-label" for="taskOrderSwitch">
                                Quanto tempo hai? {{ orderLabel }}
                            </label>
                            <input class="form-check-input pastel-switch" type="checkbox" role="switch" id="taskOrderSwitch"
                                v-model="isAscending" @change="toggleOrder">
                        </div>
                        <div class="task-section mt-3">
                            <h6 class="section-title fw-bold">Nome</h6>
                            <p class="section-content">{{ priorityTask.name }}</p>
                        </div>
                        <div class="task-section">
                            <h6 class="section-title fw-bold">Tempo stimato</h6>
                            <p class="section-content">{{ priorityTask.estimated_time }} Minuti</p>
                        </div>
                        <router-link v-if="priorityTask && priorityTask.id" :to="{ name: 'tasks.show', params: { id: priorityTask.id } }" class="btn btn-info mt-3">Maggiori informazioni</router-link>
                    </div>
                </div>
            </div>
            <!-- New task -->
            <div class="col-lg-5 mb-4">
                <div class="card shadow-sm pastel-card dashboard-task-card">
                    <div class="card-body text-center">
                        <h5 class="card-title">➕ Nuova Task</h5>
                        <p class="card-text">Crea una nuova task da zero.</p>
                        <router-link :to="{ name: 'tasks.create' }" class="btn btn-primary mt-3">Crea Task</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;
.dashboard-page {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, $primary-color 30%, $pastel-accent 100%);
    min-height: 100vh;
    padding-bottom: 2rem;
}
.dashboard-welcome-card, .dashboard-task-card {
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    background-color: $pastel-pink;
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }
}
.pastel-header {
    background-color: $pastel-blue;
    color: $text-color;
    padding: 15px;
    border-bottom: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.btn-outline-pastel {
    border-color: $pastel-accent;
    background-color: $pastel-blue;
    color: $primary-color !important;
    padding: 0.5rem 1.5rem;
    text-transform: uppercase;
    border-radius: $btn-border-radius;
    font-weight: bold;
    letter-spacing: 0.5px;
    transition: background-color $transition-duration $transition-timing-function, color $transition-duration $transition-timing-function;
    &:hover {
        background-color: $pastel-accent;
        color: $primary-color;
    }
}
.btn-action {
  background-color: $accent-color;
  color: $white;
  border: none;
  border-radius: $btn-border-radius;
  font-weight: bold;
  letter-spacing: 0.5px;
  padding: $btn-padding-y $btn-padding-x;
  transition: background-color $transition-duration $transition-timing-function, color $transition-duration $transition-timing-function;
  &:hover {
    background-color: $accent-dark;
    color: $white;
  }
}
.pastel-switch {
    background-color: $pastel-blue;
    &:checked {
        background-color: $pastel-accent;
    }
}
.section-title {
  color: $accent-color;
  font-weight: bold;
  margin-bottom: 0.2rem;
}
.section-content {
  color: $text-color;
  font-size: 1.1rem;
}
.btn-info, .btn-action {
  background-color: $accent-color;
  color: $white;
  border: none;
  border-radius: $btn-border-radius;
  font-weight: bold;
  letter-spacing: 0.5px;
  padding: $btn-padding-y $btn-padding-x;
  transition: background-color $transition-duration $transition-timing-function, color $transition-duration $transition-timing-function;
  &:hover {
    background-color: $accent-dark;
    color: $white;
  }
}
</style>

