<script>
import axios from 'axios';
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

            return Object.keys(this.errors).length === 0;
        },

        clearValidationMessage(field) {
            this.errors[field] = "";
        },

        getFormData() {
            const task_id = this.$route.params.id

            axios.get('http://127.0.0.1:8000/api/moments/form-data', {
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
                return; //Stop the request if the validation fails
            }

            // console.log('Dati pronti per essere inviati', this.momentData)
            axios.post(`http://127.0.0.1:8000/api/moments/tasks/${this.task.id}/create`, {
                name: this.momentData.name,
                task_id: this.task.id,
                message: this.momentData.message,
                emotion_id: this.momentData.emotion_id,
                moments_type_id: this.momentData.moments_type_id,
            })
                .then((response) => {
                    console.log('momento creato con successo')
                }).catch((error) => {
                    if (error.response && error.response.data) {
                        this.errors.server = "Email o password errati";
                    }

                    console.log("Login Error:", error.response.data);
                });

        }

    },
    mounted() {
        this.getFormData()
    }

}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1>New Moment Form</h1>
                <h2>for the task: {{ task.name }}</h2>
                <form action="" method="" @submit.prevent="submitForm">

                    <input type="hidden" name="task_id" :value="task.id">
                    <div class="mb-3">
                        <label for="name">Insert Moment's Name</label>
                        <input type="text" name="name" id="moment-form-name" v-model="momentData.name"
                            @input="clearValidationMessage('name')">
                        <div v-if="errors.name" class="error-message">
                            {{ errors.name }}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="message">Insert Moment's message</label>
                        <input type="text" name="message" id="moment-form-message" v-model="momentData.message"
                            @input="clearValidationMessage('message')">
                        <div v-if="errors.message" class="error-message">
                            {{ errors.message }}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Image</label>
                        <input type="file" name="moment_img" id="moment-form-img">
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Emotion</label>
                        <select name="emotion_id" id="moment-form-emotion" v-model="momentData.emotion_id">
                            <option v-for="emotion in emotions" :value="emotion.id">{{ emotion.name }}</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Type</label>
                        <select name="moments_type_id" id="moment-form-type" v-model="momentData.moments_type_id">
                            <option v-for="moment_type in moment_types" :value="moment_type.id">{{ moment_type.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Show generic error -->
                    <div v-if="errors.server" class="error-message">{{ errors.server }}</div>

                    <button>CREATE MOMENT</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>

.error-message {
    color: red;
    font-size: 0.9rem;
}

</style>