<script>
import { store } from '@/store';

export default {
    data() {
        return {
            store,
        };
    },

    props: {
        user: {
            type: Object,
            required: true
        }
    }
};
</script>

<template>
    <div>
        <h1>Benvenuto, {{ store.loggedUser.name }} {{ store.loggedUser.surname }}</h1>
        <router-link 
            :to="`/profile/${store.loggedUser.name}-${store.loggedUser.surname}`" 
            class="btn custom-button">
            Vai al mio profilo
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/variables" as *;

.custom-button {
    padding: $btn-padding-y $btn-padding-x;
    border-radius: $btn-border-radius;
    font-size: $btn-font-size;
    transition: background-color $transition-duration $transition-timing-function, transform 0.2s; // Transizioni

    &:hover {
        background-color: $primary-dark;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
}
</style>