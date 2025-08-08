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
            userLoading: true,
            taskLoading: true,
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
            } finally {
                this.userLoading = false;
            }
        },

        getPriorityTask() {
            this.taskLoading = true;
            api.get('tasks/top-priority', {
                params: {
                    estimated_time_order: this.isAscending ? "asc" : "desc"
                }
            }).then((response) => {
                console.log(response.data)

                if (response.data.task) {
                    this.priorityTask = response.data.task;
                } else {
                    this.priorityTask = {};
                }
            }).catch(() => {
                this.store.addToast('Errore nel recupero della task con priorità.', 'error');
                this.priorityTask = {};
            }).finally(() => {
                this.taskLoading = false;
            });
        },

        toggleOrder() {
            this.getPriorityTask();
        },

        startTask() {
            this.store.addToast('Timer avviato.', 'success');
        },

        completeTask() {
            this.store.addToast('Task completata.', 'success');
        },

        deferTask() {
            this.store.addToast('Task rinviata.', 'warning');
        }
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
    <div class="container dashboard-page mt-5 pt-4">
        <!-- Welcome Card -->
        <div class="row justify-content-center mt-2">
            <div class="col-lg-8">
                <div class="card shadow-sm pastel-card dashboard-welcome-card">
                    <div class="card-header d-flex justify-content-between align-items-center pastel-header">
                        <h3 class="card-title mb-0">
                            <span v-if="userLoading" class="fq-skeleton" style="display:inline-block;width:180px;height:24px;"></span>
                            <span v-else>Benvenuto, {{ store.loggedUser.name }}!</span>
                        </h3>
                        <i class="bi bi-person-circle fs-2"></i>
                    </div>
                    <div class="card-body">
                        <div v-if="userLoading">
                            <div class="fq-skeleton mb-2" style="height:16px;width:60%;"></div>
                            <div class="fq-skeleton mb-2" style="height:16px;width:40%;"></div>
                        </div>
                        <div v-else>
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
        </div>

        <!-- Task più urgente -->
        <div class="row justify-content-center mt-4">
            <div class="col-lg-8">
                <div class="card task-card shadow-sm pastel-card dashboard-task-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title task-title">🔥 Più Urgente</h5>
                                <p class="card-text">La task consigliata in base al tempo a disposizione.</p>
                            </div>
                            <!-- Pill-like selector (keeps same logic) -->
                            <div class="btn-group" role="group" aria-label="Tempo a disposizione">
                                <button type="button" class="btn btn-outline-primary" :class="{ active: isAscending }" @click="isAscending=true; toggleOrder()">Poco</button>
                                <button type="button" class="btn btn-outline-primary" :class="{ active: !isAscending }" @click="isAscending=false; toggleOrder()">Molto</button>
                            </div>
                        </div>

                        <div v-if="taskLoading" class="mt-3">
                            <div class="fq-skeleton mb-2" style="height:20px;width:50%;"></div>
                            <div class="fq-skeleton mb-2" style="height:20px;width:30%;"></div>
                            <div class="fq-skeleton" style="height:40px;width:100%;"></div>
                        </div>

                        <div v-else class="mt-3">
                            <div class="task-section">
                                <h6 class="section-title fw-bold">Nome</h6>
                                <p class="section-content">{{ priorityTask.name || 'Nessuna task trovata' }}</p>
                            </div>
                            <div class="task-section">
                                <h6 class="section-title fw-bold">Tempo stimato</h6>
                                <p class="section-content">{{ priorityTask.estimated_time }} Minuti</p>
                            </div>

                            <div class="d-flex flex-wrap gap-2 mt-3" v-if="priorityTask && priorityTask.id">
                                <router-link :to="{ name: 'tasks.show', params: { id: priorityTask.id } }" class="btn btn-info">Dettagli</router-link>
                                <button class="btn btn-action" @click="startTask">Avvia</button>
                                <button class="btn btn-success" @click="completeTask">Completa</button>
                                <button class="btn btn-outline-secondary" @click="deferTask">Rimanda</button>
                            </div>
                        </div>

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
    min-height: 100vh;
    padding-bottom: 2rem;
}
.dashboard-welcome-card, .dashboard-task-card {
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    background-color: var(--color-surface);
}
.pastel-header {
    background-color: rgba(118,181,255,0.18);
    color: var(--color-text);
    padding: 15px;
    border-bottom: none;
}
.btn-action {
  background-color: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: $btn-border-radius;
  font-weight: bold;
  letter-spacing: 0.5px;
  padding: $btn-padding-y $btn-padding-x;
}
.btn-action:hover { background-color: var(--color-accent-strong); color: #fff; }
.section-title { color: var(--color-accent); }
.section-content { color: var(--color-text); font-size: 1.1rem; }
.btn-info { background-color: var(--color-accent); color: #fff; border: none; }
.btn-info:hover { background-color: var(--color-accent-strong); color: #fff; }
.btn-outline-primary.active { background-color: var(--color-primary); color: #fff; }
</style>

