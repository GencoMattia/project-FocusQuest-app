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
    },
};
</script>

<template>
    <div>
        <h1>Profilo di {{ user.name }} {{ user.surname }}</h1>
    </div>
</template>

<style scoped></style>