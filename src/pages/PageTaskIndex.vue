<script>
import axios from 'axios';
export default {
    data() {
        return {
            tasks: []
        };
    },
    methods: {
        getUserTask() {
            axios
                .get('http://127.0.0.1:8000/api/tasks/index')
                .then(response => {
                    this.tasks = response.data;
                })
                .catch(error => {
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
        <!-- Header Section -->
        <header class="mb-5 text-center">
            <h1 class="display-4 text-primary">Elenco delle tue task</h1>
            <p class="lead">Organizza e gestisci le tue attività in modo efficace.</p>
            <router-link :to="{ name: 'tasks.create' }" class="btn btn-primary btn-lg">
                Aggiungi una nuova task
            </router-link>
        </header>

        <!-- Task Table -->
        <div v-if="tasks.length" class="table-responsive rounded shadow-sm">
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
                                class="btn btn-outline-primary btn-sm"
                            >
                                Mostra
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div v-else class="alert alert-warning text-center" role="alert">
            Nessuna task trovata. Inizia creando una nuova task!
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* Variabili per colori pastello */
$primary-color: #a3d8f4;
$secondary-color: #fdf5e6;
$accent-color: #ffd5cd;
$text-color: #4a4a4a;
$white: #fff;

.task-list {
    font-family: 'Poppins', sans-serif;
    color: $text-color;

    header {
        h1 {
            color: $primary-color;
        }
        .btn-primary {
            background-color: $primary-color;
            border: none;
            &:hover {
                background-color: darken($primary-color, 10%);
            }
        }
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
        .btn-outline-primary {
            color: $primary-color;
            border-color: $primary-color;
            &:hover {
                background-color: $primary-color;
                color: $white;
            }
        }
    }

    .alert-warning {
        background-color: $secondary-color;
        color: $text-color;
        border: 1px solid lighten($primary-color, 20%);
    }
}
</style>
