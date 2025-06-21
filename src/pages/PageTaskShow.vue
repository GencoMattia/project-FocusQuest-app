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

<template>
    <div class="task-detail container py-5">
        <!-- Sezione Dettaglio Task -->
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div v-if="task" class="card shadow rounded">
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

                    <!-- Pulsanti Azioni -->
                    <div class="card-footer text-center">
                        <button class="btn btn-start me-2" @click="modifyTaskStatus(2, task.id)">Avvia Task</button>
                        <button v-if="task.status_id == 4" class="btn btn-secondary me-2" @click="modifyTaskStatus(2, task.id)">Riavvia Task</button>
                        <button v-if="task.status_id == 2" class="btn btn-stop me-2" @click="modifyTaskStatus(4, task.id)">Interrompi Task</button>
                        <button class="btn btn-complete me-2" @click="modifyTaskStatus(3, task.id)">Completa Task</button>
                        <button class="btn btn-tertiary">
                            <RouterLink :to="{ name: 'moments.create', params: { id: task.id } }">Aggiungi un Momento</RouterLink>
                        </button>
                    </div>
                </div>

                <!-- Messaggio di caricamento -->
                <div v-else>
                    <div class="alert alert-warning text-center mt-3" role="alert">
                        Caricamento task in corso...
                    </div>
                </div>

                <!-- Messaggio di completamento -->
                <div v-if="is_task_completed" class="alert alert-success mt-4 text-center">
                    <p>🎉 Complimenti! Hai completato la task con successo.</p>
                    <p v-for="(data, idx) in completed_task_data" :key="idx">{{ data }}</p>
                </div>
            </div>
        </div>
    </div>
</template>