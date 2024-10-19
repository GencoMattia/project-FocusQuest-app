<script>
import axios from 'axios';
import { store } from '@/store';
import router from '@/router';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

//componenti per le task
import OpenTaskIndex from '@/components/task_index/OpenTaskIndex.vue';
import InProgressTaskIndex from '@/components/task_index/InProgressTaskIndex.vue';
// import CompletedTaskindex from '@/components/task_index/CompletedTaskindex.vue';

export default {
    components: {
        VueCal, 
        OpenTaskIndex, 
        InProgressTaskIndex, 
        // CompletedTaskindex
    },
    data() {
        return {
            tasks: [],
            store,

            open_tasks: [],
            completed_tasks: [],
            in_progress_tasks:[],

            events: [
                {
                    start: '2024-10-19 10:35',
                    end: '2024-10-19 11:30',
                    title: 'Doctor appointment'
                },

            ]
        };
    },

    methods: {
        getUserTask() {
            axios.get(`http://127.0.0.1:8000/api/tasks/index`)
                .then((response) => {
                    // console.log('Task recuperate correttamente');
                    // console.log(response);
                    this.tasks = response.data;
                    // console.log('queste sono le task', this.tasks)

                    this.open_tasks = this.tasks.filter((task) => task.status_id === 1)
                    // console.log('queste sono le open tasks: ', this.open_tasks)

                    this.in_progress_tasks = this.tasks.filter((task)=> task.status_id === 2 || task.status_id === 4)
                    // console.log('queste sono le in_progress tasks: ', this.in_progress_tasks)

                    this.completed_tasks = this.tasks.filter((task) => task.status_id === 3)
                    // console.log('queste sono le completed tasks: ', this.completed_tasks)

                    this.completed_tasks.forEach(task => {
                        // console.log(task.started_at, task.ended_at)
                        const data = {
                            start: task.started_at,
                            end: task.ended_at,
                            title: task.name
                        }

                        // console.log('dati delle task da mettere nel calendario', data)
                        this.events.push(data)
                        // console.log('data pronti per finire nel calendario', data)
                    })

                })
                .catch((error) => {
                    console.log(error);
                });
        },

        showTask(id) {
            console.log('id della task:', id)
            this.$router.push({ name: 'tasks.show', params: { id: id } });
        }

    },

    mounted() {
        this.getUserTask();
        // console.log(localStorage)
    }
}
</script>

<template>
    <h1>ciao sono nella task list di {{ store.loggedUser.name }} {{ store.loggedUser.surname }}</h1>
    <router-link :to="{ name: 'tasks.create' }">Aggiungi una nuova task</router-link>
    <!-- <div v-if="tasks">
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
                    <td>
                        <button @click="showTask(task.id)" class="btn btn-primary ">Show</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div v-else>
        <p>Nessuna task trovata.</p>
    </div> -->

    
    <OpenTaskIndex
    v-if="open_tasks.length > 0"
    :tasks="open_tasks"/>

    <InProgressTaskIndex
    v-if="in_progress_tasks.length > 0"
    :tasks="in_progress_tasks"/>



    <vue-cal style="height: 800px" 
    :time-from="8 * 60" 
    :time-to="23 * 60" 
    :events="events" 
    editable-events />


</template>

<style scoped></style>
