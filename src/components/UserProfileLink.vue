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
        <h1>Benvenuto, {{ this.store.loggedUser.name }} {{ this.store.loggedUser.surname }}</h1>
        <router-link :to="`/profile/${this.store.loggedUser.name}-${this.store.loggedUser.surname}`">Vai al mio profilo</router-link>
    </div>
</template>

<style scoped></style>