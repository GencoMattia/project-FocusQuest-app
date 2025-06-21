<script>
import api from '@/api/axios';
export default {
    data() {
        return {
            emotions: [],
            moment_types: [],
            task: {},

            momentData: {
                name: '',
                task_id: 0,
                message: '',
                emotion_id: 0,
                moments_type_id: 0,
            },

            errors: {},
        }
    },
    methods: {
        validateInput() {
            this.errors = {};

            // Task's name validator
            if (!this.momentData.name) {
                this.errors.name = "Ogni momento deve avere un nome";
            } else if (this.momentData.name.length < 3 || this.momentData.name.length > 25) {
                this.errors.name = "Il nome deve essere compreso tra 3 e 25 caratteri";
            }

            // Task's message validator
            if (this.momentData.message.length > 150) {
                this.errors.message = "Il messaggio può essere lungo al massimo 150 caratteri"
            }

            // Emotion validator
            if (!this.momentData.emotion_id || this.momentData.emotion_id === 0) {
                this.errors.emotion_id = "Seleziona un'emozione";
            }

            // Moment type validator
            if (!this.momentData.moments_type_id || this.momentData.moments_type_id === 0) {
                this.errors.moments_type_id = "Seleziona un tipo di momento";
            }

            return Object.keys(this.errors).length === 0;
        },

        clearValidationMessage(field) {
            this.errors[field] = "";
        },

        getFormData() {
            const task_id = this.$route.params.id

            api.get('moments/form-data', {
                params: {
                    task_id: task_id,
                }
            })
                .then((response) => {
                    console.log(response);
                    this.emotions = response.data.data.emotions
                    this.moment_types = response.data.data.moment_types
                    this.task = response.data.data.task[0]
                    this.momentData.task_id = this.task.id
                })
        },

        submitForm() {
            if (!this.validateInput()) {
                return;
            }
            this.errors = {};
            api.post(`moments/tasks/${this.task.id}/create`, {
                name: this.momentData.name,
                task_id: this.task.id,
                message: this.momentData.message,
                emotion_id: this.momentData.emotion_id,
                moments_type_id: this.momentData.moments_type_id,
            })
                .then((response) => {
                    this.momentData.name = '';
                    this.momentData.message = '';
                    this.momentData.emotion_id = 0;
                    this.momentData.moments_type_id = 0;
                    this.errors = {};
                    // Optionally, show a success message
                }).catch((error) => {
                    if (error.response && error.response.data && error.response.data.errors) {
                        Object.keys(error.response.data.errors).forEach(field => {
                            const err = error.response.data.errors[field];
                            this.errors[field] = Array.isArray(err) ? err[0] : err;
                        });
                    } else {
                        this.errors.server = "Errore durante la creazione del momento";
                    }
                });
        }

    },
    mounted() {
        this.getFormData()
    }

}
</script>

<template>
    <div class="moment-form-page">
        <div class="moment-form-container">
            <h1 class="moment-form-title">Crea un nuovo Momento</h1>
            <h2 class="moment-form-subtitle">per la task: {{ task.name }}</h2>
            <form @submit.prevent="submitForm" class="moment-form">
                <input type="hidden" name="task_id" :value="task.id">
                <div class="mb-3">
                    <label for="name">Nome Momento</label>
                    <input type="text" name="name" id="moment-form-name" v-model="momentData.name"
                        @input="clearValidationMessage('name')" class="form-control" placeholder="Nome momento">
                    <div v-if="errors.name" class="error-message">
                        {{ errors.name }}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="message">Messaggio</label>
                    <input type="text" name="message" id="moment-form-message" v-model="momentData.message"
                        @input="clearValidationMessage('message')" class="form-control" placeholder="Messaggio (max 150 caratteri)">
                    <div v-if="errors.message" class="error-message">
                        {{ errors.message }}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="moment-form-img">Immagine (opzionale)</label>
                    <input type="file" name="moment_img" id="moment-form-img" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="moment-form-emotion">Emozione</label>
                    <select name="emotion_id" id="moment-form-emotion" v-model="momentData.emotion_id" class="form-select">
                        <option value="0" disabled>Seleziona un'emozione</option>
                        <option v-for="emotion in emotions" :value="emotion.id">{{ emotion.name }}</option>
                    </select>
                    <div v-if="errors.emotion_id" class="error-message">
                        {{ errors.emotion_id }}
                    </div>
                </div>
                <div class="mb-3">
                    <label for="moment-form-type">Tipo di Momento</label>
                    <select name="moments_type_id" id="moment-form-type" v-model="momentData.moments_type_id" class="form-select">
                        <option value="0" disabled>Seleziona un tipo</option>
                        <option v-for="moment_type in moment_types" :value="moment_type.id">{{ moment_type.name }}</option>
                    </select>
                    <div v-if="errors.moments_type_id" class="error-message">
                        {{ errors.moments_type_id }}
                    </div>
                </div>
                <div v-if="errors.server" class="error-message">{{ errors.server }}</div>
                <button type="submit" class="btn btn-primary w-100 mt-3">Crea Momento</button>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;
.moment-form-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, $primary-color 30%, $pastel-accent 100%);
    font-family: 'Poppins', sans-serif;
}
.moment-form-container {
    background-color: $secondary-color;
    padding: 2.5rem 2rem;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.10);
    text-align: center;
    width: 100%;
    max-width: 420px;
    margin: 2rem auto;
}
.moment-form-title {
    font-size: 2rem;
    font-weight: bold;
    color: $primary-color;
    margin-bottom: 0.5rem;
}
.moment-form-subtitle {
    font-size: 1.1rem;
    color: $accent-color;
    margin-bottom: 2rem;
}
.form-control, .form-select {
    width: 100%;
    padding: 0.85rem;
    font-size: 1rem;
    border: 1px solid $primary-color;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(163, 216, 244, 0.08);
    transition: border-color 0.3s $transition-timing-function, box-shadow 0.3s $transition-timing-function;
    background-color: $white;
    margin-bottom: 0.5rem;
}
.form-control:focus, .form-select:focus {
    border-color: $accent-color;
    box-shadow: 0 0 8px $accent-color;
}
.btn-primary {
    background-color: $btn-primary-bg;
    color: $btn-primary-color;
    &:hover {
        background-color: $pastel-blue-dark;
    }
}
.error-message {
    color: $danger-color;
}
</style>