<script>
import axios from "axios";
import UserProfileLink from "@/components/UserProfileLink.vue";

export default {
    components: {
        UserProfileLink,
    },

    data() {
        return {
            user: {
                name: '',
                surname: ''
            }
        };
    },

    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/me');
                this.user = response.data;
            } catch (error) {
                console.error("Errore nel recupero dei dati dell'utente:", error);
            }
        }
    }
};
</script>

<template>
    <UserProfileLink :user="user" />
</template>

<style scoped></style>