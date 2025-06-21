<template>
    <div class="task-detail container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div v-if="task" class="card shadow rounded pastel-card task-detail-card">
                    <div class="card-header text-white" :style="{ backgroundColor: task.category?.color }">
                        Categoria: {{ task.category?.name }}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-primary">{{ task.name }}</h5>
                        <p class="card-text text-secondary">{{ task.description }}</p>
                        <ul class="list-group list-group-flush mb-5">
                            <li class="list-group-item">
                                <strong>Priorità:</strong>
                                <span class="badge rounded-pill" :style="{ backgroundColor: task.priority?.color }">
                                    {{ task.priority?.name }}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <strong>Stato:</strong>
                                <span class="badge rounded-pill" :style="{ backgroundColor: task.status?.color }">
                                    {{ task.status?.name }}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <strong>Tempo stimato:</strong> {{ task.estimated_time }} minuti
                            </li>
                            <li class="list-group-item" v-if="task.started_at">
                                <strong>Iniziato il:</strong> {{ task.started_at }}
                            </li>
                        </ul>
                        <div v-if="moment_card_data && moment_card_data.length" class="moment-cards-container d-flex justify-content-around mb-3">
                            <MomentCard v-for="moment_card in moment_card_data" 
                            :key="moment_card.id"
                            :id="moment_card.id"
                            :task_id="moment_card.task_id"
                            :moments_type_id="moment_card.moments_type_id"
                            :emotion_id="moment_card.emotion_id"
                            :name="moment_card.name"
                            :message="moment_card.message"
                            />
                        </div>
                    </div>
                    <div class="card-footer text-center pastel-footer">
                        <button class="btn btn-start me-2 pastel-btn" @click="modifyTaskStatus(2, task.id)">Avvia Task</button>
                        <button v-if="task.status_id == 4" class="btn btn-secondary me-2 pastel-btn" @click="modifyTaskStatus(2, task.id)">Riavvia Task</button>
                        <button v-if="task.status_id == 2" class="btn btn-stop me-2 pastel-btn" @click="modifyTaskStatus(4, task.id)">Interrompi Task</button>
                        <button class="btn btn-complete me-2 pastel-btn" @click="modifyTaskStatus(3, task.id)">Completa Task</button>
                        <button class="btn btn-action pastel-btn" >
                            <RouterLink :to="{ name: 'moments.create', params: { id: task.id } }">Aggiungi un Momento</RouterLink>
                        </button>
                    </div>
                </div>
                <div v-else>
                    <div class="alert alert-warning text-center mt-3 pastel-alert" role="alert">
                        Caricamento task in corso...
                    </div>
                </div>
                <div v-if="is_task_completed" class="alert alert-success mt-4 text-center pastel-alert-success">
                    <p>🎉 Complimenti! Hai completato la task con successo.</p>
                    <p v-for="(data, idx) in completed_task_data" :key="idx">{{ data }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MomentCard from '@/components/MomentCard.vue';
import { store } from '@/store';
import api from '@/api/axios';
export default {
    components: {
        MomentCard
    },
    data() {
        return {
            store,
            task: [],
            moments: [],
            completed_task_data: [],
            is_task_completed: false,
            moment_card_data: []
        }
    },

    methods: {
        getTaskData() {
            const task_id = this.$route.params.id;
            api.get(`tasks/${task_id}/show`)
                .then((response) => {
                    this.task = response.data.task;
                    this.moments = this.task.moments;
                });
        },

        modifyTaskStatus(status_id, task_id) {
            api.patch(`tasks/${task_id}/status`, {
                'status_id': status_id,
                'task_id': task_id
            })
                .then((response) => {
                    this.getTaskData(); // Ricarica la task aggiornata
                    if (this.task.status_id === 3) {
                        this.is_task_completed = true;
                        this.completed_task_data = response.data;
                    }
                })
                .catch((error) => {
                    // Puoi gestire l'errore anche visualizzando un alert o un messaggio utente
                    // console.error('Errore nell\'aggiornamento dello stato della task:', error);
                });
        }
    },

    watch: {
        moments() {
            this.moment_card_data = [];
            this.moments.forEach(moment => {
                this.moment_card_data.push({
                    'id': moment.id, 
                    'task_id': moment.task_id, 
                    'moments_type_id': moment.moments_type_id, 
                    'emotion_id': moment.emotion_id, 
                    'name': moment.name, 
                    'message': moment.message
                });
            });
        }
    },

    mounted() {
        this.getTaskData();
    }
};
</script>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;
.task-detail-card {
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    background-color: $pastel-pink;
    transition: transform 0.3s ease;
    font-family: 'Poppins', sans-serif;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }
}
.pastel-btn {
    border-radius: $btn-border-radius;
    font-weight: bold;
    letter-spacing: 0.5px;
    padding: $btn-padding-y $btn-padding-x;
    background-color: $btn-primary-bg;
    color: $btn-primary-color;
    border: none;
    transition: background-color $transition-duration $transition-timing-function;
    &:hover {
        background-color: $pastel-blue-dark;
    }
}
.pastel-footer {
    background-color: $pastel-blue;
    border-radius: 0 0 15px 15px;
}
.pastel-alert {
    background-color: $secondary-color;
    color: $text-color;
    border: 1px solid $primary-color;
}
.pastel-alert-success {
    background-color: $pastel-green;
    color: $white;
    border-radius: $btn-border-radius;
    font-weight: bold;
}
.list-group-item strong {
  color: $accent-color;
  font-weight: bold;
  margin-right: 0.5rem;
}
.badge, .rounded-pill {
  display: inline-block;
  min-width: 60px;
  padding: 0.35em 0.7em;
  font-size: 0.95em;
  font-weight: 600;
  border-radius: 1em;
  background-color: $pastel-purple;
  color: $white;
  margin-left: 0.5em;
  margin-right: 0.5em;
  vertical-align: middle;
}
.badge-priority-high {
  background-color: $btn-danger-bg;
  color: $white;
}
.badge-priority-medium {
  background-color: $btn-warning-bg;
  color: $black;
}
.badge-priority-low {
  background-color: $btn-info-bg;
  color: $white;
}
.badge-status-completed {
  background-color: $btn-success-bg;
  color: $white;
}
.badge-status-open {
  background-color: $btn-primary-bg;
  color: $white;
}
</style>