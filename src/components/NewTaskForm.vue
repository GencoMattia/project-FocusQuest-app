<script>
import axios from 'axios';
export default {
    data() {
        return {
            categories: null,
            statuses: null,
            priorities: null,

            data: {
                formName: '',
                formDescription: '',
                formHours: 0,  // Variabile per le ore
                formMinutes: 0, // Variabile per i minuti
                formCategoryId: 0,
                formPriorityId: 0
            }
        }
    },
    methods: {
        // Funzione per ottenere il totale dei minuti
        getTotalMinutes() {
            return (parseInt(this.data.formHours) * 60) + parseInt(this.data.formMinutes);
        },

        getData() {
            axios.get('http://127.0.0.1:8000/api/get-form-data')
                .then((response) => {
                    this.categories = response.data.data.categories;
                    this.priorities = response.data.data.priorities;
                    this.statuses = response.data.data.statuses;

                    console.log(this.categories, this.priorities, this.statuses)
                })
                .catch((error) => {
                    console.error('Errore nel caricamento dei dati:', error);
                });
        },

        createNewTask() {
            const estimatedTime = this.getTotalMinutes();

            // const taskData = {
            //     name: this.data.formName,
            //     description: this.data.formDescription,
            //     estimated_time: estimatedTime,
            //     category_id: this.data.formCategoryId,
            //     priority_id: this.data.formPriorityId,
            // };

            // console.log(taskData);

            axios.post('http://localhost:8000/api/create-new-task', {
                name: this.data.formName,
                description: this.data.formDescription,
                estimated_time: estimatedTime,
                category_id: this.data.formCategoryId,
                priority_id: this.data.formPriorityId
            })
                .then((response) => {
                    console.log('Task creato con successo:', response.data);
                })
                .catch((error) => {
                    if (error.response) {
                        // La richiesta è stata fatta e il server ha risposto con un codice di stato
                        console.error('Risposta del server:', error.response.data);
                        console.error('Codice di stato:', error.response.status);
                    } else if (error.request) {
                        // La richiesta è stata fatta ma non c'è stata risposta
                        console.error('Nessuna risposta ricevuta:', error.request);
                    } else {
                        // Qualcosa è andato storto nel configurare la richiesta
                        console.error('Errore:', error.message);
                    }
                });
        }
    },

    mounted() {
        this.getData();
    }
}
</script>

<template>
    <form @submit.prevent="createNewTask">

        <div class="mb-3">
            <label for="form-name" class="form-label">Name</label>
            <input type="text" v-model="data.formName" class="form-control" id="form-name" name="name">
        </div>

        <div class="mb-3">
            <label for="form-description" class="form-label">Description</label>
            <input type="text" v-model="data.formDescription" class="form-control" id="form-description"
                name="description">
        </div>

        <!-- <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Deadline</label>
            <input type="datetime-local" class="form-control" id="datetime-input" name="datetime">
        </div> -->

        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Estimated Time</label>
            <label for="hours">Hours:</label>
            <input type="number" v-model="data.formHours" id="form-hours" name="hours" min="0" placeholder="0">

            <label for="minutes">Minutes:</label>
            <input type="number" v-model="data.formMinutes" id="form-minutes" name="minutes" min="0" max="59"
                placeholder="0" required>
        </div>

        <div class="mb-3">
            <label for="category">Category</label>
            <select name="category" v-model="data.formCategoryId" id="form-category">
                <option v-for="(category, index) in categories" :key="index" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="priority">Priority</label>
            <select name="priority" v-model="data.formPriorityId" id="form-priority">
                <option v-for="(priority, index) in priorities" :key="index" :value="priority.id">
                    {{ priority.name }}
                </option>
            </select>
        </div>


        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>

<style scoped lang="scss"></style>