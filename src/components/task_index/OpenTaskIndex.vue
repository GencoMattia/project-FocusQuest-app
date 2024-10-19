<script>
import OpenTaskCard from './TaskCards/OpenTaskCard.vue';

export default {
    props: {
        tasks: {
            type: Array, 
            required: false
        }
    },
    components: {
        OpenTaskCard
    },
    data() {
        return {
            open_tasks: []
        }
    },

    mounted() {
        console.log('Queste sono le Task che arrivano da PageTaskIndex:', this.tasks);
        this.open_tasks = this.tasks;

        console.log('Queste sono le task da mandare ad OpenTaskCard:', this.open_tasks);
    }
}
</script>

<template>
    <!-- <p v-for="task in tasks" :key="task.id"> {{ task.name }} </p> -->
    <div class="container">
        <div class="row">
            <div class="col-12">
            <h1>Ciao, sono OpenTaskIndex</h1>
            <OpenTaskCard 
                v-for="task in open_tasks"
                :key="task.id"
                :single_open_task="task"
            />
        </div>
    </div>
</div>
</template>

<style scoped></style>
