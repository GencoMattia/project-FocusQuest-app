<script>
import api from '@/api/axios';

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
            api.get('moments/get-card-data', {
                params: {
                    emotion_id: this.emotion_id,
                    moments_type_id: this.moments_type_id,
                    task_id: this.task_id
                }
            })
            .then(response => {
                this.emotion = response.data.moment_emotion || {};
                this.moments_type = response.data.moment_moments_type || {};
            })
            .catch(error => {
                this.emotion = {};
                this.moments_type = {};
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
    <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="moment-card pastel-card shadow">
            <div class="card-header pastel-header">
                <h2 class="moment-title">{{ name }}</h2>
                <p class="moment-emotion">Emozione: <span class="badge" :style="{backgroundColor: emotion.color || '#a3d8f4'}">{{ emotion.name }}</span></p>
                <p class="moment-type">Tipo: <span class="badge" :style="{backgroundColor: moments_type.color || '#ffd5cd'}">{{ moments_type.name }}</span></p>
            </div>
            <div class="card-body">
                <blockquote class="blockquote mb-0 moment-message">
                    <p>{{ message }}</p>
                </blockquote>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.card, .dashboard-card, .moment-card {
  background: $pastel-pink;
  border-radius: 18px;
  box-shadow: $box-shadow;
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
  color: $text-color;
  font-family: $font-family-base;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.card-header, .dashboard-card-header {
  background: $pastel-blue;
  border-radius: 12px 12px 0 0;
  padding: 1rem 1.5rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: $accent-color;
  margin-bottom: 1rem;
}
.moment-title {
  color: $accent-color;
  font-weight: bold;
  font-size: 1.2rem;
}
.moment-emotion, .moment-type {
  color: $text-color;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
}
.moment-emotion .badge, .moment-type .badge {
  display: inline-block;
  min-width: 60px;
  padding: 0.35em 0.7em;
  font-size: 0.95em;
  font-weight: 600;
  border-radius: 1em;
  background-color: $pastel-purple;
  color: $white;
  margin-left: 0.5em;
  margin-right: 0.5em;
  vertical-align: middle;
}
.moment-message {
  color: $text-color;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.card-title, .dashboard-card-title {
  font-size: 2rem;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: 1rem;
}

.card-section, .dashboard-card-section {
  margin-bottom: 1.2rem;
  padding: 1rem;
  background: $white;
  border-radius: 10px;
  box-shadow: $box-shadow;
}

.card-label, .dashboard-card-label {
  font-weight: bold;
  color: $accent-color;
  margin-right: 0.5rem;
}

.card-value, .dashboard-card-value {
  color: $text-color;
  font-size: 1.1rem;
}

.card-actions, .dashboard-card-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn {
  // ...existing button styles from _variables.scss...
}
</style>