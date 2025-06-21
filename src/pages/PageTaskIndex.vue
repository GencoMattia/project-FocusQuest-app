<script>
import api from '@/api/axios';
export default {
    data() {
        return {
            tasks: []
        };
    },
    methods: {
        getUserTask() {
            api
                .get('tasks/index')
                .then(response => {
                    this.tasks = Array.isArray(response.data) ? response.data : (response.data.tasks || []);
                })
                .catch(error => {
                    this.tasks = [];
                    console.error(error);
                });
        },
        showTask(id) {
            this.$router.push({ name: 'tasks.show', params: { id } });
        }
    },
    mounted() {
        this.getUserTask();
    }
};
</script>

<template>
    <div class="task-list container py-5">
        <header class="mb-5 text-center">
            <h1 class="display-4 text-primary">Elenco delle tue task</h1>
            <p class="lead">Organizza e gestisci le tue attività in modo efficace.</p>
            <router-link :to="{ name: 'tasks.create' }" class="btn btn-action btn-lg">
                Aggiungi una nuova task
            </router-link>
        </header>
        <div v-if="tasks.length" class="table-responsive rounded shadow-sm pastel-table">
            <table class="table table-hover align-middle">
                <thead class="table-primary text-center">
                    <tr>
                        <th scope="col">Nome task</th>
                        <th scope="col">Descrizione</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Priorità</th>
                        <th scope="col">Tempo stimato</th>
                        <th scope="col">Stato</th>
                        <th scope="col">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasks" :key="task.id" class="text-center">
                        <td>{{ task.name }}</td>
                        <td>{{ task.description }}</td>
                        <td>{{ task.category.name }}</td>
                        <td>{{ task.priority.name }}</td>
                        <td>{{ task.estimated_time }} minuti</td>
                        <td>{{ task.status.name }}</td>
                        <td>
                            <button
                                @click="showTask(task.id)"
                                class="btn btn-action btn-sm"
                            >
                                Mostra
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="alert alert-warning text-center pastel-alert" role="alert">
            Nessuna task trovata. Inizia creando una nuova task!
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;
.task-list {
    color: $text-color;
    header {
        h1 {
            color: $primary-color;
        }
        .btn-primary, .pastel-btn {
            background-color: $btn-primary-bg;
            color: $btn-primary-color;
            &:hover {
                background-color: $pastel-blue-dark;
            }
        }
    }
    .pastel-table {
        background-color: $secondary-color;
    }
    .table {
        thead {
            background-color: $primary-color;
            color: $white;
        }
        tbody {
            tr {
                &:hover {
                    background-color: lighten($primary-color, 40%);
                }
            }
        }
        .btn-outline-primary, .pastel-btn-outline {
            color: $primary-color;
            border-color: $primary-color;
            &:hover {
                background-color: $primary-color;
                color: $white;
            }
        }
    }
    .pastel-alert {
        background-color: $secondary-color;
        color: $text-color;
        border: 1px solid lighten($primary-color, 20%);
    }
}
.btn-action {
  background-color: $accent-color;
  color: $white;
  border: none;
  border-radius: $btn-border-radius;
  font-weight: bold;
  letter-spacing: 0.5px;
  padding: $btn-padding-y $btn-padding-x;
  transition: background-color $transition-duration $transition-timing-function, color $transition-duration $transition-timing-function;
  &:hover {
    background-color: $accent-dark;
    color: $white;
  }
}
</style>
