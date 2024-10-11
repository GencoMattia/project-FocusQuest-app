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
                formHours: 0,
                formMinutes: 0,
                formCategoryId: 0,
                formPriorityId: 0
            },

            suggestedTasks: [],
            showDropdown: false,
        }
    },

    watch: {
        "data.formName": function (newVal) {
            if (newVal.length > 1) {
                this.getSuggestedTask();
            } else {
                this.suggestedTasks = [];
                this.showDropdown = false;
            }
        }
    },

    methods: {
        fillForm(task) {
            this.data.formName = task.name;
            this.data.formDescription = task.description;
            this.data.formHours = Math.floor(task.estimated_time / 60);
            this.data.formMinutes = task.estimated_time % 60;
            this.data.formCategoryId = task.category_id;
            this.data.formPriorityId = task.priority_id;
            this.showDropdown = false;
        },

        getTotalMinutes(hours, minutes) {
            return (parseInt(hours) * 60) + parseInt(minutes);
        },

        getData() {
            axios.get('http://127.0.0.1:8000/api/get-form-data')
                .then((response) => {
                    this.categories = response.data.data.categories;
                    this.priorities = response.data.data.priorities;
                    this.statuses = response.data.data.statuses;
                })
                .catch((error) => {
                    console.error('Error loading form data:', error);
                });
        },

        getSuggestedTask() {
            if (this.data.formName.length > 1) {
                axios.get(`http://localhost:8000/api/suggest-tasks?query=${this.data.formName}`)
                    .then((response) => {
                        this.suggestedTasks = response.data.tasks;
                        this.showDropdown = true;
                    })
                    .catch((error) => {
                        console.error('Error loading task suggestions:', error);
                    });
            } else {
                this.showDropdown = false;
            }
        },

        async createNewTask(event) {
            const estimatedTime = this.getTotalMinutes(this.data.formHours, this.data.formMinutes);

            event.preventDefault();
            axios.post('http://localhost:8000/api/create-new-task', {
                name: this.data.formName,
                description: this.data.formDescription,
                estimated_time: estimatedTime,
                category_id: this.data.formCategoryId,
                priority_id: this.data.formPriorityId,
            })
                .then((response) => {
                    console.log('Task created successfully:', response.data);
                    this.resetForm();
                })
                .catch((error) => {
                    if (error.response) {
                        console.error('Server response:', error.response.data);
                    } else if (error.request) {
                        console.error('No response received:', error.request);
                    } else {
                        console.error('Error:', error.message);
                    }
                });
        },

        resetForm() {
            this.data.formName = '';
            this.data.formDescription = '';
            this.data.formHours = 0;
            this.data.formMinutes = 0;
            this.data.formCategoryId = 0;
            this.data.formPriorityId = 0;
            this.suggestedTasks = [];
            this.showDropdown = false;
        }
    },

    mounted() {
        this.getData();
    }
}
</script>

<template>
    <form v-on:submit="createNewTask($event)">
        <div class="mb-3">
            <label for="form-name" class="form-label">Name</label>
            <input type="text" v-model="data.formName" @input="getSuggestedTasks" class="form-control" id="form-name"
                name="name">

            <!-- Suggestions Dropdown -->
            <ul v-if="showDropdown" class="dropdown">
                <li v-for="task in suggestedTasks" :key="task.id" @click="fillForm(task)">
                    {{ task.name }}
                </li>
                <li @click="showDropdown = false">Crea Nuova Task</li>
            </ul>
        </div>

        <div class="mb-3">
            <label for="form-description" class="form-label">Description</label>
            <input type="text" v-model="data.formDescription" class="form-control" id="form-description"
                name="description">
        </div>

        <div class="mb-3">
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


<style scoped lang="scss">
.suggestions-list {
    list-style: none;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
}

.suggestions-list li {
    padding: 8px;
    cursor: pointer;
}

.suggestions-list li:hover {
    background-color: #f0f0f0;
}
</style>