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
            const task_id = this.$route.params.id

            axios.get(`http://127.0.0.1:8000/api/tasks/${task_id}`)
                .then((response) => {
                    // console.log('task recuperata con successo')
                    this.task = response.data.task
                    // console.log('task visualizzata:', this.task)
                })
        },

        modifyTaskStatus(status_id, task_id) {
            axios.patch(`http://127.0.0.1:8000/api/tasks/${task_id}`, {
                'status_id': status_id,
                'task_id': task_id
            })
                .then((response) => {
                    console.log('Stato della task aggiornato con successo');
                    console.log(response)
                    this.getTaskData(); // Ricarica la task aggiornata

                    if(this.task.status_id === 3){
                        this.is_task_completed = true
                        this.completed_task_data = response.data

                        console.log(this.completed_task_data)
                        
                    }
                })
                .catch((error) => {
                    console.error('Errore nell\'aggiornamento dello stato della task:', error);
                })
        }
    },

    mounted() {
        this.getTaskData()
    }
}
</script>

<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <div v-if="task" class="card mb-3">
                    <div class="card-header" :style="{ backgroundColor: task.category?.color, color: 'white' }">
                        Categoria: {{ task.category?.name }}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ task.name }}</h5>
                        <p class="card-text">{{ task.description }}</p>

                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <strong>Priorità:</strong>
                                <span class="badge" :style="{ backgroundColor: task.priority?.color, color: 'black' }">
                                    {{ task.priority?.name }}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <strong>Status:</strong>
                                <span class="badge" :style="{ backgroundColor: task.status?.color, color: 'white' }">
                                    {{ task.status?.name }}
                                </span>
                            </li>
                            <li class="list-group-item">
                                <strong>Tempo stimato:</strong> {{ task.estimated_time }} minuti
                            </li>
                            <li v-if="task.started_at">{{ task.started_at }}</li>
                        </ul>
                    </div>
                    <div class="button-container text-center mt-3">
                        <button class="btn btn-start me-2" @click="modifyTaskStatus(2, task.id)">Avvia Task</button>
                        <button v-if ="task.status_id == 4" class="btn btn-secondary me-2" @click="modifyTaskStatus(2, task.id)">Riavvia Task</button>
                        <button v-if="task.status_id == 2" class="btn btn-stop me-2" @click="modifyTaskStatus(4, task.id)">Interrompi Task</button>
                        <button class="btn btn-complete" @click="modifyTaskStatus(3, task.id)">Completa Task</button>

                        <button class="btn btn-tertiary">
                            <RouterLink :to="{name: 'create.new.moment', params:{id: task.id}}">Aggiungi un Momento</RouterLink>
                        </button>
                    </div>
                </div>
                <div v-else>
                    <p>Caricamento task in corso...</p>
                </div>

                <div v-if="is_task_completed">
                    <p>Complimenti! Hai finito la Task</p>
                    <p v-for="data in completed_task_data"> {{ data }}</p>
                    
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
.button-container .btn {
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease-in-out;
}

.btn-start {
    background-color: #28a745;
    color: white;
    border: none;
}

.btn-stop {
    background-color: #dc3545;
    color: white;
    border: none;
}

.btn-complete {
    background-color: #ffc107;
    color: white;
    border: none;
}

.btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
</style>
