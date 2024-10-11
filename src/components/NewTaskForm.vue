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
                axios.get(`http://127.0.0.1:8000/api/tasks/suggest-tasks?query=${this.data.formName}`)
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
    <form v-on:submit="createNewTask($event)" class="task-form">
        <div class="mb-3">
            <label for="form-name" class="form-label">Name</label>
            <input type="text" v-model="data.formName" @input="getSuggestedTasks" class="form-control styled-input"
                id="form-name" name="name" placeholder="Enter task name">

            <!-- Suggestions Dropdown -->
            <ul v-if="showDropdown" class="dropdown suggestions-list">
                <li v-for="task in suggestedTasks" :key="task.id" @click="fillForm(task)" class="suggestion-item">
                    {{ task.name }}
                </li>
                <li @click="showDropdown = false" class="suggestion-item">Crea Nuova Task</li>
            </ul>
        </div>

        <div class="mb-3">
            <label for="form-description" class="form-label">Description</label>
            <input type="text" v-model="data.formDescription" class="form-control styled-input" id="form-description"
                name="description" placeholder="Enter task description">
        </div>

        <div class="mb-3 time-inputs">
            <div class="input-wrapper">
                <label for="form-hours">Hours:</label>
                <input type="number" v-model="data.formHours" id="form-hours" name="hours" min="0" class="styled-input"
                    placeholder="0">
            </div>
            <div class="input-wrapper">
                <label for="form-minutes">Minutes:</label>
                <input type="number" v-model="data.formMinutes" id="form-minutes" name="minutes" min="0" max="59"
                    class="styled-input" placeholder="0" required>
            </div>
        </div>

        <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select name="category" v-model="data.formCategoryId" id="form-category" class="form-control styled-select">
                <option v-for="(category, index) in categories" :key="index" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="priority" class="form-label">Priority</label>
            <select name="priority" v-model="data.formPriorityId" id="form-priority" class="form-control styled-select">
                <option v-for="(priority, index) in priorities" :key="index" :value="priority.id">
                    {{ priority.name }}
                </option>
            </select>
        </div>

        <button type="submit" class="btn btn-primary styled-button">Submit</button>
    </form>
</template>

<style scoped lang="scss">
.task-form {
    max-width: 500px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.styled-input,
.styled-select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    transition: border 0.2s ease;
}

.styled-input:focus,
.styled-select:focus {
    border-color: #0056b3;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 86, 179, 0.3);
}

.suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.suggestion-item:hover {
    background-color: #f0f0f0;
}

.time-inputs {
    display: flex;
    gap: 10px;
}

.input-wrapper {
    flex: 1;
}

.styled-button {
    width: 100%;
    padding: 10px;
    background-color: #0056b3;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.styled-button:hover {
    background-color: #0046a3;
}
</style>