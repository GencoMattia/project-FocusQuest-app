<script>
import axios from "axios";
import UserProfileLink from "@/components/UserProfileLink.vue";
import PageProfile from "./PageProfile.vue";

export default {
    components: {
        UserProfileLink,
    },

    data() {
        return {
            user: {
                name: "",
                surname: "",
            }
        };
    },

    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user');
                console.log(response.data.user);
                this.user.name = response.data.user.name;
                this.user.surname = response.data.user.surname;
            } catch (error) {
                console.error("Errore nel recupero dei dati dell'utente:", error);
            }
        }
    },

    mounted() {
        this.fetchUserData();
    }
};
</script>

<template>
    <UserProfileLink :user="user" />
</template>

<style scoped></style>