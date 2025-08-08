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
                        // Use moments/form-data; optionally pass task_id; filter locally by ids
                        const params = { task_id: this.task_id };
                        api.get('moments/form-data', { params })
                            .then(response => {
                                const emotions = response.data?.data?.emotions || [];
                                const types = response.data?.data?.moment_types || [];
                                this.emotion = emotions.find(e => e.id === this.emotion_id) || {};
                                this.moments_type = types.find(t => t.id === this.moments_type_id) || {};
                            })
                            .catch(error => {
                                // 404 ownership => treat as unavailable
                                this.emotion = {};
                                this.moments_type = {};
                                // optional: console.warn('Moments form-data unavailable or not owned');
                            });
        }
    },
    mounted() {
        this.getMomentData();
    }
};
</script>

<template>
  <article class="moment-card">
    <header class="moment-header">
      <h3 class="moment-title">{{ name }}</h3>
      <div class="meta">
        <div class="meta-row">
          <span class="label">Emozione:</span>
          <span class="chip" :style="{ '--chip-bg': emotion.color || 'var(--color-primary)' }">{{ emotion.name }}</span>
        </div>
        <div class="meta-row">
          <span class="label">Tipo:</span>
          <span class="chip" :style="{ '--chip-bg': moments_type.color || 'var(--color-accent)' }">{{ moments_type.name }}</span>
        </div>
      </div>
    </header>
    <div v-if="message" class="moment-message">{{ message }}</div>
  </article>
</template>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.moment-card {
  background: color-mix(in oklab, var(--color-surface), var(--color-primary) 6%);
  border: 1px solid color-mix(in oklab, var(--color-primary), #000 5%);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-1);
  padding: 1rem;
  color: $text-color;
  font-family: $font-family-base;
  height: 100%;
}
.moment-header { margin-bottom: .5rem; }
.moment-title { color: $primary-color; font-weight: 700; font-size: 1.05rem; margin: 0 0 .25rem; }
.meta { display: grid; gap: .35rem; }
.meta-row { display: flex; align-items: center; gap: .5rem; }
.label { color: $color-muted; font-size: .9rem; }
.chip {
  display: inline-flex; align-items: center; gap: .4rem; padding: .15rem .5rem; border-radius: 999px;
  background: var(--chip-bg); color: #fff; font-weight: 600; font-size: .85rem;
}
.moment-message { color: $text-color; font-size: 1rem; margin-top: .5rem; white-space: pre-line; }

</style>