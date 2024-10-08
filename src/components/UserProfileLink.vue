<script>
export default {
    data() {
        return {

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
        <h1>Benvenuto, {{ user.name }} {{ user.surname }}</h1>
        <router-link :to="`/profile/${user.name}-${user.surname}`">Vai al mio profilo</router-link>
    </div>
</template>

<style scoped></style>