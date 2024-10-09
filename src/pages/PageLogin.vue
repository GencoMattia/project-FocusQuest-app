<script>
import axios from "axios";
import { store } from "@/store";
export default {
    data() {
        return {
            userEmail: "",
            userPassword: "",
            store
        };
    },

    methods: {
        logInUser(event) {
            event.preventDefault();
            axios.post("http://127.0.0.1:8000/api/auth/login", {
                email: this.userEmail,
                password: this.userPassword
            })
                .then((response) => {
                    localStorage.setItem("token", response.data.access_token);
                    console.log(response);

                    console.log('logged user prima')
                    console.log(this.store.loggedUser)
                    
                    console.log('logged user dopo')
                    //Aggiorno i dati dello store.js
                    this.store.loggedUser.name = response.data.name
                    this.store.loggedUser.surname = response.data.surname
                    this.store.loggedUser.email = response.data.user.email
                    this.store.loggedUser.id = response.data.user.id

                    console.log(this.store.loggedUser)
                    this.$router.push("/dashboard");
                }).catch((error) => {
                    console.log("Login Error:", error.response.data);
                });
        }
    }

};
</script>

<template>
    <form @submit.prevent="logInUser">
        <div class="mb-3">
            <label for="loginInputEmail" class="form-label">Email address</label>
            <input v-model="userEmail" type="email" class="form-control" id="loginInputEmail"
                aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="loginInputPassword" class="form-label">Password</label>
            <input v-model="userPassword" type="password" class="form-control" id="loginInputPassword">
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="loginCheck">
            <label class="form-check-label" for="loginCheck">Check me out</label>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>

<style scoped></style>