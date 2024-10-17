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
        }
    },
    methods:{
        getFormData(){
            const task_id = this.$route.params.id

            axios.get('http://127.0.0.1:8000/api/moments/form-data', {
                params:{
                    task_id: task_id,
                }
            })
            .then((response)=>{
                console.log(response);
                this.emotions = response.data.data.emotions
                this.moment_types = response.data.data.moment_types
                this.task = response.data.data.task[0]
                this.momentData.task_id = this.task.id
            })
        },

        submitForm(){
            // console.log('Dati pronti per essere inviati', this.momentData)
            axios.post(`http://127.0.0.1:8000/api/tasks/${this.task.id}/create`, {
                    name: this.momentData.name,
                    task_id: this.task.id,
                    message: this.momentData.message,
                    emotion_id: this.momentData.emotion_id,
                    moments_type_id: this.momentData.moments_type_id,
            })
            .then((response) =>{
                console.log('momento creato con successo')
            })

        }
        
    },
    mounted(){
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
                        <input type="text" name="name" id="moment-form-name"
                        v-model="momentData.name">
                    </div>

                    <div class="mb-3">
                        <label for="message">Insert Moment's message</label>
                        <input type="text" name="message" id="moment-form-message"
                        v-model="momentData.message">
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Image</label>
                        <input type="file" name="moment_img" id="moment-form-img">
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Emotion</label>
                        <select name="emotion_id" id="moment-form-emotion"
                        v-model="momentData.emotion_id">
                            <option v-for="emotion in emotions" :value="emotion.id">{{ emotion.name }}</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Type</label>
                        <select name="moments_type_id" id="moment-form-type"
                        v-model="momentData.moments_type_id">
                            <option v-for="moment_type in moment_types" :value="moment_type.id">{{ moment_type.name }}</option>
                        </select>
                    </div>

                    <button>CREATE MOMENT</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>