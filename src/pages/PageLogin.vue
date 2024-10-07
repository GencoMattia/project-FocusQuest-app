<script>
import axios from "axios";

export default {
    data() {
        return {
            userEmail: "",
            userPassword: "",
        };
    },

    methods: {
        createNewUser(event) {
            event.preventDefault();  
            axios.post("http://127.0.0.1:8000/api/auth/login", {
                email: this.userEmail,
                password: this.userPassword
            })
            .then((response) => {
                localStorage.setItem("token", response.data.access_token);
                console.log(response);
                this.$router.push("/dashboard");
            }).catch((error) => {
                console.log("Login Error:", error.response.data);
            }); 
        }
    }

};
</script>

<template>
    <form>
        <div class="mb-3">
            <label for="loginInputEmail" class="form-label">Email address</label>
            <input type="email" class="form-control" id="loginInputEmail" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="loginInputPassword" class="form-label">Password</label>
            <input type="password" class="form-control" id="loginInputPassword">
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="loginCheck">
            <label class="form-check-label" for="loginCheck">Check me out</label>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>

<style scoped></style>