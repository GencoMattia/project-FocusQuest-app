<script>
import axios from 'axios';

export default {
    props: {
        id: {
            type: Number,
            required: true
        },
        task_id: {
            type: Number,
            required: true
        },
        moments_type_id: {
            type: Number,
            required: true
        },
        emotion_id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: false
        },
    },
    data() {
        return {
            emotion: {},
            moments_type: {}
        };
    },
    methods: {
        getMomentData() {
            // Usa this per accedere alle props
            axios.get('http://127.0.0.1:8000/api/moments/get-card-data', {
                params: {
                    emotion_id: this.emotion_id,
                    moments_type_id: this.moments_type_id,
                    task_id: this.task_id
                }
            })
            .then(response => {
                console.log('Risultato del caricamento del componente: ', response.data);
                this.emotion = response.data.moment_emotion
                this.moments_type = response.data.moment_moments_type
            })
            .catch(error => {
                console.error(error);
            });
        }
    },
    mounted() {
        this.getMomentData();
    }
};
</script>



<template>
    <div class="col-3">
        <div class="card">
            <div class="card-header">
                <h2>
                    {{ name }}
                </h2>
                <p>Associato a: {{ emotion.name }}</p>
                <p>Tipologia di Momento: {{ moments_type.name }}</p>
            </div>
            <div class="card-body">
                <blockquote class="blockquote mb-0">
                    <p>A{{ message }}.</p>
                </blockquote>
            </div>
        </div>
    </div>
</template>

<style scoped></style>