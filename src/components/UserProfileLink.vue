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
            required: false,
            default: () => ({})
        }
    }
};
</script>

<template>
    <div>
        <h1>Benvenuto, {{ store.loggedUser.name || user.name }} {{ store.loggedUser.surname || user.surname }}</h1>
        <router-link 
            :to="`/profile/${store.loggedUser.name || user.name}-${store.loggedUser.surname || user.surname}`" 
            class="btn btn-action custom-button">
            Vai al mio profilo
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
@use "../assets/partials/_variables.scss" as *;

.custom-button {
    padding: $btn-padding-y $btn-padding-x;
    border-radius: $btn-border-radius;
    font-size: $btn-font-size;
    transition: background-color $transition-duration $transition-timing-function, transform 0.2s;
    background-color: $btn-info-bg;
    color: #fff;

    &:hover {
        background-color: $accent-dark;
        color: #fff;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
}
</style>