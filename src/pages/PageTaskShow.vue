<template>
    <div class="task-show container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-9">

            <!-- Back link moved into header for better visual consistency -->

                <!-- Loading state -->
                <div v-if="isLoading" class="card shadow-sm" aria-busy="true">
                    <div class="card-body">
                        <div class="fq-skeleton mb-3" style="height:24px;width:60%"></div>
                        <div class="fq-skeleton mb-2" style="height:14px;width:90%"></div>
                        <div class="fq-skeleton mb-2" style="height:14px;width:85%"></div>
                        <div class="fq-skeleton mb-2" style="height:14px;width:70%"></div>
                    </div>
                </div>

                <!-- Error state -->
            <div v-else-if="error" class="alert alert-warning" role="alert">{{ error }}</div>

                <!-- Content -->
                <div v-else-if="task" class="card task-card shadow-sm" :style="{ '--accent': task.category?.color || 'var(--color-primary)' }">
                    <div class="card-body">
                        <!-- Header -->
                                    <div class="d-flex align-items-start justify-content-between gap-3 task-header">
                                        <div class="flex-grow-1">
                                            <RouterLink class="btn btn-sm btn-outline-primary back-btn mb-2" :to="{ name: 'tasks.index' }" aria-label="Torna alle Task">← Indietro</RouterLink>
                                <h1 class="h3 mb-1 task-title">{{ task.name }}</h1>
                                <div class="d-flex flex-wrap gap-2 align-items-center mt-2">
                                    <span v-if="task.category" class="chip" :title="`Categoria: ${task.category.name}`">
                                        <span class="chip-dot" :style="{ backgroundColor: task.category.color }" aria-hidden="true"></span>
                                        {{ task.category.name }}
                                    </span>
                                    <span v-if="task.priority" class="chip" :title="`Priorità: ${task.priority.name}`">
                                        <span class="chip-dot" :style="{ backgroundColor: task.priority.color }" aria-hidden="true"></span>
                                        {{ task.priority.name }}
                                    </span>
                                    <span v-if="task.status" class="chip" :title="`Stato: ${task.status.name}`">
                                        <span class="chip-dot" :style="{ backgroundColor: task.status.color }" aria-hidden="true"></span>
                                        {{ task.status.name }}
                                    </span>
                                </div>
                            </div>

                            <div class="text-end">
                                <div class="btn-group flex-wrap" role="group" aria-label="Azioni task">
                                    <button v-if="showStart" class="btn btn-primary" :disabled="isUpdating" @click="startTask">{{ startLabel }}</button>
                                    <button v-if="showStop" class="btn btn-outline-secondary" :disabled="isUpdating" @click="stopTask">Interrompi</button>
                                    <button class="btn btn-success" :disabled="isUpdating" @click="completeTask">Completa</button>
                                    <RouterLink class="btn btn-info" :to="{ name: 'moments.create', params: { id: task.id } }">Aggiungi Momento</RouterLink>
                                </div>
                            </div>
                        </div>

                        <!-- Meta -->
                        <div class="row g-3 mt-3 task-meta" role="list">
                            <div class="col-md-4" role="listitem">
                                <div class="meta-item">
                                    <div class="label">Tempo stimato</div>
                                    <div class="value">{{ task.estimated_time }} min<span v-if="task.estimated_time"> ({{ formatEstimated(task.estimated_time) }})</span></div>
                                </div>
                            </div>
                            <div class="col-md-4" role="listitem" v-if="task.started_at">
                                <div class="meta-item">
                                    <div class="label">Iniziato</div>
                                    <div class="value">{{ formatDate(task.started_at) }}</div>
                                </div>
                            </div>
                            <div class="col-md-4" role="listitem" v-if="task.deadline">
                                <div class="meta-item">
                                    <div class="label">Scadenza</div>
                                    <div class="value">{{ formatDate(task.deadline) }}</div>
                                </div>
                            </div>
                        </div>

                                    <!-- Completion summary -->
                                    <section v-if="completionSummary" class="mt-3">
                                        <div class="alert alert-info mb-0">
                                            <div class="fw-bold mb-1">{{ completionSummary.message }}</div>
                                            <ul class="mb-0 ps-3">
                                                <li v-if="completionSummary.total_task_time"><strong>Tempo totale:</strong> {{ completionSummary.total_task_time }}</li>
                                                <li v-if="completionSummary.total_pause_time"><strong>Tempo in pausa:</strong> {{ completionSummary.total_pause_time }}</li>
                                                <li v-if="completionSummary.effective_task_time !== undefined"><strong>Tempo effettivo:</strong> {{ formatEffective(completionSummary.effective_task_time) }}</li>
                                                <li v-if="completionSummary.effective_time_message">{{ completionSummary.effective_time_message }}</li>
                                            </ul>
                                        </div>
                                    </section>

                        <!-- Description -->
                        <section class="mt-4">
                            <h2 class="h5 mb-2">Descrizione</h2>
                            <p class="mb-0 text-body">{{ task.description || 'Nessuna descrizione fornita.' }}</p>
                        </section>

                        <!-- Moments -->
                        <section class="mt-4">
                            <div class="d-flex justify-content-between align-items-center">
                                <h2 class="h5 mb-0">Momenti</h2>
                                <RouterLink class="btn btn-sm btn-outline-primary" :to="{ name: 'moments.create', params: { id: task.id } }">+ Aggiungi</RouterLink>
                            </div>
                                            <div v-if="moment_card_data.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mt-1">
                                                <div v-for="mc in moment_card_data" :key="mc.id" class="col">
                                                    <MomentCard
                                                        :id="mc.id"
                                                        :task_id="mc.task_id"
                                                        :moments_type_id="mc.moments_type_id"
                                                        :emotion_id="mc.emotion_id"
                                                        :name="mc.name"
                                                        :message="mc.message"
                                                    />
                                                </div>
                                            </div>
                            <p v-else class="text-muted mt-2">Nessun momento registrato.</p>
                        </section>
                    </div>
                </div>

                <div v-else class="alert alert-info" role="status">Task non trovata.</div>
            </div>
        </div>
    </div>
  
</template>

<script>
import MomentCard from '@/components/MomentCard.vue';
import { store } from '@/store';
import api from '@/api/axios';

export default {
    components: { MomentCard },
    data() {
        return {
            store,
            task: null,
            moments: [],
            moment_card_data: [],
            isLoading: true,
            isUpdating: false,
    error: '',
    completionSummary: null,
        };
    },
    computed: {
        showStart() {
            // Show start if not running
            return this.task && this.task.status_id !== 2;
        },
        showStop() {
            return this.task && this.task.status_id === 2;
        },
        startLabel() {
            return this.task && this.task.status_id === 4 ? 'Riavvia' : 'Avvia';
        }
    },
    methods: {
            async fetchTask() {
            this.isLoading = true;
            this.error = '';
            const id = this.$route.params.id;
            try {
                const res = await api.get(`tasks/${id}/show`);
                this.task = res.data?.task || null;
                this.moments = this.task?.moments || [];
            } catch (e) {
                    if (e?.response?.status === 404) {
                        this.error = 'Task non disponibile o non appartenente all\'utente.';
                    } else {
                        this.error = 'Errore nel caricamento della task.';
                    }
                this.task = null;
            } finally {
                this.isLoading = false;
            }
        },
            async updateStatus(next) {
            if (!this.task) return;
            this.isUpdating = true;
            try {
                    const { data } = await api.patch(`tasks/${this.task.id}/status`, { status_id: next });
                    this.store.addToast(data?.message || 'Stato della task aggiornato.', 'success');
                    // Capture completion summaries when present
                    if (next === 3) {
                        this.completionSummary = {
                            message: data?.message,
                            total_task_time: data?.total_task_time,
                            total_pause_time: data?.total_pause_time,
                            effective_task_time: data?.effective_task_time,
                            effective_time_message: data?.effective_time_message,
                        };
                    } else {
                        this.completionSummary = null;
                    }
                    await this.fetchTask();
            } catch (e) {
                    if (e?.response?.status === 404) {
                        this.error = 'Task non disponibile o non appartenente all\'utente.';
                        this.store.addToast('Task non disponibile o non appartenente.', 'warning');
                    } else if (e?.response?.status === 422) {
                        this.store.addToast('Dati non validi per l\'aggiornamento.', 'error');
                    } else {
                        this.store.addToast('Errore nell\'aggiornamento dello stato.', 'error');
                    }
            } finally {
                this.isUpdating = false;
            }
        },
        startTask() { this.updateStatus(2); },
        stopTask() { this.updateStatus(4); },
        completeTask() { this.updateStatus(3); },
        formatEstimated(totalMinutes) {
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            if (h && m) return `${h}h ${m}m`;
            if (h) return `${h}h`;
            return `${m}m`;
        },
        formatDate(val) {
            try {
                const d = new Date(val);
                if (isNaN(d.getTime())) return String(val);
                return d.toLocaleString();
            } catch {
                return String(val);
            }
            },
            formatEffective(val) {
                // If string already formatted, return as-is; if number (minutes), format nicely
                if (typeof val === 'string') return val;
                const mins = Number(val) || 0;
                return this.formatEstimated(mins);
        }
    },
    watch: {
        moments: {
            handler() {
                this.moment_card_data = (this.moments || []).map(moment => ({
                    id: moment.id,
                    task_id: moment.task_id,
                    moments_type_id: moment.moments_type_id,
                    emotion_id: moment.emotion_id,
                    name: moment.name,
                    message: moment.message,
                }));
            },
            immediate: true
        },
        '$route.params.id': {
            handler() { this.fetchTask(); },
        }
    },
    mounted() { this.fetchTask(); }
};
</script>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.task-card {
    background: $surface-color;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-1);
    border-left: 4px solid var(--accent);
}
.back-btn { padding: .25rem .5rem; border-radius: 999px; }
.task-header .task-title {
    color: $text-color;
}
.chip {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    padding: .25rem .5rem;
    border-radius: 999px;
    background: rgba(0,0,0,0.04);
    color: $text-color;
    border: 1px solid rgba(0,0,0,0.06);
    font-size: .9rem;
}
.chip-dot { width: .65rem; height: .65rem; border-radius: 50%; display: inline-block; }

.task-meta .meta-item {
    background: $surface-color;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: var(--radius-md);
    padding: .75rem .9rem;
}
.task-meta .label { color: $color-muted; font-size: .85rem; }
.task-meta .value { color: $text-color; font-weight: 600; }

section h2 { color: $text-color; }
section p { color: $text-color; }
</style>