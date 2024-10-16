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
            taskSelected: false,
        }
    },

    watch: {
        "data.formName": function (newVal) {
            if(this.taskSelected) {
                this.taskSelected = false;
                return;
            }

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
            
            this.taskSelected = true;
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
            <label for="form-name" class="form-label">Task Name</label>
            <input 
                type="text" 
                v-model="data.formName" 
                @input="getSuggestedTasks" 
                class="form-control styled-input" 
                id="form-name" 
                name="name" 
                placeholder="Enter task name">

            <!-- Suggestions Dropdown -->
            <ul v-if="showDropdown" class="dropdown suggestions-list">
                <li 
                    v-for="task in suggestedTasks" 
                    :key="task.id" 
                    @click="fillForm(task)" 
                    class="suggestion-item button-like">
                    {{ task.name }}
                </li>
                <li @click="showDropdown = false" class="suggestion-item new-task-button">+ Create New Task</li>
            </ul>
        </div>

        <div class="mb-3">
            <label for="form-description" class="form-label">Description</label>
            <textarea 
                v-model="data.formDescription" 
                class="form-control styled-input" 
                id="form-description" 
                name="description" 
                placeholder="Enter task description">
            </textarea>
        </div>

        <div class="mb-3 time-inputs">
            <div class="input-wrapper">
                <label for="form-hours">Hours:</label>
                <input 
                    type="number" 
                    v-model="data.formHours" 
                    id="form-hours" 
                    name="hours" 
                    min="0" 
                    class="styled-input" 
                    placeholder="0">
            </div>
            <div class="input-wrapper">
                <label for="form-minutes">Minutes:</label>
                <input 
                    type="number" 
                    v-model="data.formMinutes" 
                    id="form-minutes" 
                    name="minutes" 
                    min="0" 
                    max="59" 
                    class="styled-input" 
                    placeholder="0" 
                    required>
            </div>
        </div>

        <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select 
                name="category" 
                v-model="data.formCategoryId" 
                id="form-category" 
                class="form-control styled-select">
                <option 
                    v-for="(category, index) in categories" 
                    :key="index" 
                    :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="priority" class="form-label">Priority</label>
            <select 
                name="priority" 
                v-model="data.formPriorityId" 
                id="form-priority" 
                class="form-control styled-select">
                <option 
                    v-for="(priority, index) in priorities" 
                    :key="index" 
                    :value="priority.id">
                    {{ priority.name }}
                </option>
            </select>
        </div>

        <!-- Buttons for Submit and Reset -->
        <div class="button-group">
            <button 
                type="submit" 
                class="btn btn-primary styled-button submit-button">
                Submit
            </button>
            <button 
                type="button" 
                @click="resetForm" 
                class="btn btn-secondary styled-button reset-button">
                Reset
            </button>
        </div>
    </form>
</template>


<style scoped lang="scss">
.task-form {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;

    position: relative;
}

.styled-input,
.styled-select {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 100%;
    font-size: 16px;
    margin-bottom: 15px;
    transition: border-color 0.3s ease;
    &:focus {
        border-color: #007bff;
        outline: none;
    }
}

textarea {
    min-height: 120px;
    resize: vertical;
    border: 1px solid #ddd;
    padding: 12px;
}

.dropdown {
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    position: absolute;
    z-index: 10;
    width: calc(100% - 20px);
    max-height: 200px;
    overflow-y: auto;
    margin-top: 5px;
    left: 0;
    right: 0;
}

.suggestions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-width: 100%;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 1000;
}

.suggestion-item {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f1f1f1;
    }
}

.button-like {
    border-radius: 8px;
    background-color: #e9ecef;
    margin: 5px;
    &:hover {
        background-color: #dee2e6;
    }
}

.new-task-button {
    font-weight: bold;
    text-align: center;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border-radius: 8px;
    &:hover {
        background-color: #0056b3;
    }
}

.button-group {
    display: flex;
    justify-content: space-between; 
    gap: 20px;
    margin-top: 20px; 
}

.styled-button {
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
    font-weight: bold;
}

.submit-button {
    background-color: #007bff;
    color: #fff;
    &:hover {
        background-color: #0056b3;
    }
}

.reset-button {
    background-color: #6c757d;
    color: #fff;
    &:hover {
        background-color: #5a6268;
    }
}
</style>