<script>
export default {
    props: {
        single_open_task: {
            type: Object, // Corretto da Array a Object
            required: false,
        }
    },
    data() {
        return {
        }
    },

    mounted() {
        console.log('Questa è la singola card della task:', this.single_open_task);
    }
}
</script>

<template>
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">{{ single_open_task.name }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{single_open_task.priority.name}}</h6>
            <p class="card-text">{{ single_open_task.description }}</p>

            <RouterLink 
            :to="{name: 'tasks.show', params: {id: single_open_task.id}}">
            Visualizza Task
            </RouterLink>
        </div>
    </div>
</template>

<style scoped></style>
