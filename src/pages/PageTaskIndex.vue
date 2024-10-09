<script>
import axios from 'axios';
import { store } from '@/store';
export default {
    data() {
        return {
            tasks: null,
            store
        };
    },

    methods: {
        getUserTask() {
            axios.get(`http://127.0.0.1:8000/api/tasks`)
            .then((response) => {
                console.log('Task recuperate correttamente');
                console.log(response);
                this.tasks = response.data.tasks;
            })
            .catch((error) => {
                console.log(error);
            });
        }
    },

    mounted() {
        this.getUserTask();
    }
}
</script>

<template>
    <h1>ciao sono nella task list del singolo utente</h1>
    <div v-if="tasks">
        <ul>
            <li v-for="task in tasks" :key="task.id">{{ task.name }}</li>
        </ul>
    </div>
    <div v-else>
        <p>Nessuna task trovata.</p>
    </div>
</template>

<style scoped></style>
