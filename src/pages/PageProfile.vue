<script>
export default {
    data() {
        return {
            
        };
    },

    props: {
        user: {
            type: Object,
            required: true // Assicurati che l'oggetto user venga passato come prop
        }
    },
};
</script>

<template>
    <div>
        <h1>Profilo di {{ user.name }} {{ user.surname }}</h1>
    </div>
</template>

<style scoped></style>