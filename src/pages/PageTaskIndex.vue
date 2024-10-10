<script>
import axios from 'axios';
import { store } from '@/store';
import router from '@/router';
export default {
    data() {
        return {
            tasks: [],
            store
        };
    },

    methods: {
        getUserTask() {
            axios.get(`http://127.0.0.1:8000/api/tasks`)
                .then((response) => {
                    console.log('Task recuperate correttamente');
                    console.log(response);
                    this.tasks = response.data;
                    console.log('queste sono le task', this.tasks)
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        showTask(id) {
            console.log('id della task:', id)
            this.$router.push({ name: 'show.task', params: { id: id } });
        }

    },

    mounted() {
        this.getUserTask();
    }
}
</script>

<template>
    <h1>ciao sono nella task list di </h1>
    <router-link :to="{ name: 'create.new.task' }">Aggiungi una nuova task</router-link>
    <div v-if="tasks">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Nome task</th>
                    <th scope="col">Descrizione</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Priorità</th>
                    <th scope="col">Tempo stimato</th>
                    <th scope="col">Status</th>
                    <th scope="col">Azioni</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks" :key="task.id">
                    <td>{{ task.name }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ task.category.name }}</td>
                    <td>{{ task.priority.name }}</td>
                    <td>{{ task.estimated_time }} minuti</td>
                    <td>{{ task.status.name }}</td>
                    <!-- ! AZIONI -->
                    <td>
                        <button @click="showTask(task.id)" class="btn btn-primary ">Show</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <p>Nessuna task trovata.</p>
    </div>
</template>

<style scoped></style>
