<script>
import { store } from '@/store';
import axios from 'axios';
export default {
    data() {
        return {
            store,
            task: [],
            completed_task_data: [],
            is_task_completed: false,
        }
    },

    methods: {
        getTaskData() {
            const task_id = this.$route.params.id;

            axios.get(`http://127.0.0.1:8000/api/tasks/${task_id}/show`)
                .then((response) => {
                    this.task = response.data.task;
                });
        },

        modifyTaskStatus(status_id, task_id) {
            axios.patch(`http://127.0.0.1:8000/api/tasks/${task_id}/status`, {
                'status_id': status_id,
                'task_id': task_id
            })
                .then((response) => {
                    this.getTaskData();
                    if (this.task.status_id === 3) {
                        this.is_task_completed = true;
                        this.completed_task_data = response.data;
                    }
                })
                .catch((error) => {
                    console.error('Errore nell\'aggiornamento dello stato della task:', error);
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

                        <ul class="list-group list-group-flush">
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
                    </div>

                    <!-- Pulsanti Azioni -->
                    <div class="card-footer text-center">
                        <button class="btn btn-start me-2" @click="modifyTaskStatus(2, task.id)">Avvia Task</button>
                        <button v-if="task.status_id == 4" class="btn btn-secondary me-2" @click="modifyTaskStatus(2, task.id)">Riavvia Task</button>
                        <button v-if="task.status_id == 2" class="btn btn-stop me-2" @click="modifyTaskStatus(4, task.id)">Interrompi Task</button>
                        <button class="btn btn-complete me-2" @click="modifyTaskStatus(3, task.id)">Completa Task</button>
                        <router-link :to="{ name: 'moments.create', params: { id: task.id } }" class="btn btn-outline-primary">
                            Aggiungi un Momento
                        </router-link>
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
                    <p v-for="data in completed_task_data" :key="data.id">{{ data }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* Variabili per colori pastello */
$primary-color: #a3d8f4;
$secondary-color: #fdf5e6;
$accent-color: #ffd5cd;
$text-color: #4a4a4a;
$success-color: #28a745;
$danger-color: #dc3545;

.task-detail {
    font-family: 'Poppins', sans-serif;

    .card {
        border: none;
        .card-header {
            font-size: 18px;
            font-weight: bold;
        }
        .card-body {
            h5 {
                color: $primary-color;
            }
            p {
                color: $text-color;
            }
        }
        .card-footer {
            .btn {
                padding: 10px 20px;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease-in-out;

                &-start {
                    background-color: $success-color;
                    color: $secondary-color;
                    border: none;
                }

                &-stop {
                    background-color: $danger-color;
                    color: $secondary-color;
                    border: none;
                }

                &-complete {
                    background-color: $accent-color;
                    color: $text-color;
                    border: none;
                }

                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }

                &:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                }
            }
        }
    }

    .alert {
        border: 1px solid lighten($primary-color, 20%);
        background-color: $secondary-color;
        color: $text-color;
    }
}
</style>
