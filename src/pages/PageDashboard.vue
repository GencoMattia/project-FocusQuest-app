<script>
import axios from "axios";
import UserProfileLink from "@/components/UserProfileLink.vue";
import { store } from "@/store";


export default {
    components: {
        UserProfileLink,
    },

    data() {
        return {
            store,
            user: {
            
            },
            store

        };
    },

    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user');
                console.log(response.data.user);

                this.store.loggedUser.name = response.data.user.name;
                this.store.loggedUser.surname = response.data.user.surname;
                this.store.loggedUser.email = response.data.user.email;
                this.store.loggedUser.id = response.data.user.id;

                console.log(this.store.loggedUser)
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