<script>
import { store } from '@/store';
import axios from 'axios';
export default {
    data() {
        return {
            store,
            task: [],
        }
    },

    methods: {
        getTaskData() {
            const task_id = this.$route.params.id

            axios.get(`http://127.0.0.1:8000/api/tasks/${task_id}`)
                .then((response) => {
                    console.log('task recuperata con successo')
                    this.task = response.data.task
                    console.log('task visualizzata:', this.task)

                })
        }
    },

    mounted() {
        this.getTaskData(this.task_id)
    }
}
</script>

<template>
    <div class="container mt-4">
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
                </ul>
            </div>
        </div>
        <div v-else>
            <p>Caricamento task in corso...</p>
        </div>
    </div>
</template>

<style scoped></style>