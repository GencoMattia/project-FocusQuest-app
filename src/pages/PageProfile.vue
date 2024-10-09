<script>
import { store } from '@/store';

export default {
    data() {
        return {
            store,
        };
    },
};
</script>

<template>
    <div>
        <h1>Profilo di {{ this.store.loggedUser.name }} {{ this.store.loggedUser.surname }}</h1>
    </div>
</template>

<style scoped></style>