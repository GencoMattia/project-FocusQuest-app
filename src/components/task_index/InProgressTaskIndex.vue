<script>
import InProgressTaskCard from './TaskCards/InProgressTaskCard.vue';
export default {
    props: {
        tasks: {
            type: Array, 
            required: false
        }
    },
    components: {
        InProgressTaskCard
    },
    data() {
        return {
            open_tasks: []
        }
    },

    mounted() {
        console.log('Queste sono le Task che arrivano da PageTaskIndex:', this.tasks);
        this.open_tasks = this.tasks;

        // console.log('Queste sono le task da mandare ad OpenTaskCard:', this.open_tasks);
    }
}
</script>

<template>
    <!-- <p v-for="task in tasks" :key="task.id"> {{ task.name }} </p> -->
    
    <div class="container">
        <div class="row">
            <h1>Ciao, sono InProgressTaskIndex</h1>
            <div class="col-12 d-flex ">
                <InProgressTaskCard 
                    v-for="task in open_tasks"
                    :key="task.id"
                    :single_in_progress_task="task"
                />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
