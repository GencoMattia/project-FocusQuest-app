<script>
import api from '@/api/axios';
import { nextTick } from 'vue';
// Removed global debounceTimeout declaration

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
                formPriorityId: 0,
                formDeadline: "",
            },

            suggestedTasks: [],
            showDropdown: false,
            taskSelected: false,

            errors: {},
            isSubmitting: false,
            lastFormName: '', // <--- aggiungi questa variabile
        }
    },

    watch: {
        "data.formName": function (newVal) {
            console.log('[WATCH] data.formName changed:', newVal, 'taskSelected:', this.taskSelected);
            if (this.taskSelected) {
                console.log('[WATCH] taskSelected is true, resetting to false and returning');
                this.taskSelected = false;
                return;
            }
            // Evita chiamate duplicate se il valore non è cambiato realmente
            if (newVal === this.lastFormName) {
                console.log('[WATCH] formName unchanged, skipping');
                return;
            }
            this.lastFormName = newVal;

            if (newVal.length > 1) {
                console.log('[WATCH] Calling getSuggestedTask()');
                this.getSuggestedTask();
            } else {
                console.log('[WATCH] Clearing suggestions and hiding dropdown');
                this.suggestedTasks = [];
                this.showDropdown = false;
            }
        }
    },

    methods: {
        validateInput() {
            this.errors = {};

            // Task's name validator
            if (!this.data.formName) {
                this.errors.name = "Ogni task deve avere un nome"
            } else if (this.data.formName.length < 3 || this.data.formName.length > 150) {
                this.errors.name = "Il nome della task deve essere compreso tra 3 e 150 caratteri"
            }

            // Task's description validator
            if (this.data.formDescription.length > 300) {
                this.errors.description = "La descrizione deve essere inferiore ai 300 caratteri"
            }

            // Task's estimated_time validator
            const hours = parseInt(this.data.formHours);
            const minutes = parseInt(this.data.formMinutes);
            if ((isNaN(hours) || hours < 0) || (isNaN(minutes) || minutes < 0)) {
                this.errors.estimatedTime = "Ore e minuti devono essere valori positivi";
            } else if (hours === 0 && minutes === 0) {
                this.errors.estimatedTime = "Devi inserire almeno 1 minuto o 1 ora";
            }

            // Task's deadline validator
            if (this.data.formDeadline) {
                const currentDate = new Date();
                const deadlineDate = new Date(this.data.formDeadline);

                // remove hours so that only the day it is compared
                currentDate.setHours(0, 0, 0, 0);

                if (deadlineDate < currentDate) {
                    this.errors.deadline = "La deadline non può essere precedente ad oggi";
                }
            }

            // Categoria e priorità devono essere selezionate
            if (!this.data.formCategoryId || this.data.formCategoryId === 0) {
                this.errors.category = "Seleziona una categoria";
            }
            if (!this.data.formPriorityId || this.data.formPriorityId === 0) {
                this.errors.priority = "Seleziona una priorità";
            }

            //If there are any errors return false, otherwise return true
            return Object.keys(this.errors).length === 0;
        },

        clearValidationMessage(field) {
            this.errors[field] = "";
        },

        fillForm(task) {
            console.log('[fillForm] Filling form with task:', task);
            this.data.formName = task.name;
            this.data.formDescription = task.description;
            this.data.formHours = Math.floor(task.estimated_time / 60);
            this.data.formMinutes = task.estimated_time % 60;
            this.data.formCategoryId = task.category_id;
            this.data.formPriorityId = task.priority_id;

            this.taskSelected = true;
            this.showDropdown = false;
            nextTick(() => {
                console.log('[fillForm] nextTick: setting taskSelected to false');
                this.taskSelected = false;
            });
        },

        getTotalMinutes(hours, minutes) {
            return (parseInt(hours) * 60) + parseInt(minutes);
        },

        getData() {
            api.get('tasks/form-data')
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
            console.log('[getSuggestedTask] Called with formName:', this.data.formName);
            clearTimeout(debounceTimeout);
            if (this.data.formName.length > 1) {
                debounceTimeout = setTimeout(() => {
                    api.get(`tasks/suggest-tasks?query=${this.data.formName}`)
                        .then((response) => {
                            console.log('[getSuggestedTask] Suggestions:', response.data.tasks);
                            this.suggestedTasks = response.data.tasks;
                            this.showDropdown = true;
                        })
                        .catch((error) => {
                            console.error('[getSuggestedTask] Error loading task suggestions:', error);
                            this.suggestedTasks = [];
                            this.showDropdown = true;
                        });
                }, 300); // 300ms debounce
            } else {
                this.suggestedTasks = [];
                this.showDropdown = false;
            }
        },

        async createNewTask() {
            console.log('[createNewTask] Called, isSubmitting:', this.isSubmitting);
            if (this.isSubmitting) return;
            if (!this.validateInput()) {
                return;
            }
            this.isSubmitting = true;
            const estimatedTime = this.getTotalMinutes(this.data.formHours, this.data.formMinutes);

            try {
                const response = await api.post('tasks/create', {
                    name: this.data.formName,
                    description: this.data.formDescription,
                    estimated_time: estimatedTime,
                    category_id: this.data.formCategoryId,
                    priority_id: this.data.formPriorityId,
                    deadline: this.data.formDeadline,
                });
                // Redirect to the newly created task page
                if (response.data && response.data.task && response.data.task.id) {
                    this.$router.push({ name: 'tasks.show', params: { id: response.data.task.id } });
                }
                this.resetForm();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    Object.keys(error.response.data.errors).forEach(field => {
                        const err = error.response.data.errors[field];
                        this.errors[field] = Array.isArray(err) ? err[0] : err;
                    });
                } else {
                    this.errors.server = "Errore durante la creazione della task";
                }
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            console.log('[resetForm] Resetting form');
            this.data.formName = '';
            this.data.formDescription = '';
            this.data.formHours = 0;
            this.data.formMinutes = 0;
            this.data.formCategoryId = 0;
            this.data.formPriorityId = 0;
            this.data.formDeadline = "";
            this.suggestedTasks = [];
            this.showDropdown = false;
        },

        onCreateNewTaskClick() {
            console.log('[onCreateNewTaskClick] Clicked + Create New Task');
            this.showDropdown = false;
            this.suggestedTasks = [];
            this.taskSelected = true;
            // opzionale: this.data.formName = '';
            nextTick(() => {
                console.log('[onCreateNewTaskClick] nextTick: setting taskSelected to false');
                this.taskSelected = false;
            });
        },
    },

    mounted() {
        console.log('[mounted] NewTaskForm mounted');
        this.getData();
    }
}
</script>

<template>
    <form class="task-form" @submit.prevent="createNewTask">
        <div class="mb-3">
            <label for="form-name" class="form-label">Task Name</label>
            <input type="text" v-model="data.formName" @input="(getSuggestedTask(), clearValidationMessage('name'))"
                class="form-control styled-input" id="form-name" name="name" placeholder="Enter task name">

            <!-- Show name error -->
            <div v-if="errors.name" class="error-message">
                {{ errors.name }}
            </div>

            <!-- Suggestions Dropdown -->
            <ul v-if="showDropdown" class="dropdown suggestions-list">
                <li v-for="task in suggestedTasks" :key="task.id" @click="fillForm(task)"
                    class="suggestion-item button-like">
                    {{ task.name }}
                </li>
                <li @click="onCreateNewTaskClick" class="suggestion-item new-task-button">+ Create New Task</li>
            </ul>
        </div>

        <div class="mb-3">
            <label for="form-description" class="form-label">Description</label>
            <textarea v-model="data.formDescription" class="form-control styled-input" id="form-description"
                name="description" placeholder="Enter task description" @input="clearValidationMessage('description')">
            </textarea>

            <!-- Show description error -->
            <div v-if="errors.description" class="error-message">
                {{ errors.description }}
            </div>
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
                    class="styled-input" placeholder="0" required @input="clearValidationMessage('estimatedTime')">
            </div>

            <!-- Show estimatedTime error -->
            <div v-if="errors.estimatedTime" class="error-message">
                {{ errors.estimatedTime }}
            </div>
        </div>

        <div class="mb-3">
            <label for="form-deadline" class="form-label">Deadline</label>
            <input 
            type="date" 
            v-model="data.formDeadline" 
            @input="clearValidationMessage('deadline')"
            class="form-control styled-input" 
            id="form-deadline" />

            <!-- Show deadline error -->
            <div v-if="errors.deadline" class="error-message">
                {{ errors.deadline }}
            </div>
        </div>

        <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select name="category" v-model="data.formCategoryId" id="form-category" class="form-control styled-select">
                <option value="0" disabled>Seleziona una categoria</option>
                <option v-for="(category, index) in categories" :key="index" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <div v-if="errors.category" class="error-message">
                {{ errors.category }}
            </div>
        </div>

        <div class="mb-3">
            <label for="priority" class="form-label">Priority</label>
            <select name="priority" v-model="data.formPriorityId" id="form-priority" class="form-control styled-select">
                <option value="0" disabled>Seleziona una priorità</option>
                <option v-for="(priority, index) in priorities" :key="index" :value="priority.id">
                    {{ priority.name }}
                </option>
            </select>
            <div v-if="errors.priority" class="error-message">
                {{ errors.priority }}
            </div>
        </div>

        <!-- Buttons for Submit and Reset -->
        <div class="button-group">
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary styled-button submit-button">
                Submit
            </button>
            <button type="button" @click="resetForm" class="btn btn-tertiary pastel-btn-tertiary styled-button reset-button">
                Reset
            </button>
        </div>
    </form>
</template>


<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;
.task-form {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 2rem auto;
    padding: 2.5rem 2rem;
    background-color: $secondary-color;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.10);
    font-family: 'Poppins', sans-serif;
    position: relative;
}
.styled-input,
.styled-select {
    padding: 0.85rem;
    border: 1px solid $primary-color;
    border-radius: 8px;
    width: 100%;
    font-size: 1rem;
    margin-bottom: 1.2rem;
    transition: border-color 0.3s $transition-timing-function;
    background-color: $white;
    &:focus {
        border-color: $accent-color;
        outline: none;
        box-shadow: 0 0 8px $accent-color;
    }
}
textarea {
    min-height: 120px;
    resize: vertical;
    border: 1px solid $primary-color;
    padding: 0.85rem;
    border-radius: 8px;
    background-color: $white;
}
.dropdown, .suggestions-list {
    background-color: $white;
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
.suggestion-item {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 8px;
    &:hover {
        background-color: $pastel-accent;
        color: $white;
    }
}
.button-like {
    background-color: $pastel-blue;
    margin: 5px;
    &:hover {
        background-color: $pastel-accent;
    }
}
.new-task-button {
    font-weight: bold;
    text-align: center;
    padding: 12px;
    background-color: $primary-color;
    color: $white;
    border-radius: 8px;
    &:hover {
        background-color: $primary-dark;
    }
}
.button-group {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
}
.btn-primary {
    background-color: $btn-primary-bg;
    color: $btn-primary-color;
    &:hover {
        background-color: $pastel-blue-dark;
    }
}
.btn-tertiary, .pastel-btn-tertiary {
    background-color: $secondary-color;
    color: $primary-color;
    border: 1px solid $primary-color;
    &:hover {
        background-color: $primary-color;
        color: $white;
    }
}
.submit-button {
    background-color: $btn-primary-bg;
    color: $btn-primary-color;
    &:hover {
        background-color: $pastel-blue-dark;
    }
}
.reset-button {
    background-color: $secondary-color;
    color: $primary-color;
    border: 1px solid $primary-color;
    &:hover {
        background-color: $primary-color;
        color: $white;
    }
}
.error-message {
    color: $danger-color;
    font-size: 0.95rem;
    margin-top: 0.2rem;
    text-align: left;
}
</style>