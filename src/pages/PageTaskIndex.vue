<script>
import axios from 'axios';
export default {
    data() {
        return {
            tasks: null,
            user_id: this.$route.params.id
        };
    },

    methods: {
        getUserTask(id) {

            user_id = this.$route.params.id
            axios.get(`http://127.0.0.1:8000/api/${id}/tasks`)
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
        console.log(this.user_id);
        console.log(this.$route)
        this.getUserTask(this.$route.params.id);
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
