<script>
import axios from "axios";

export default {
    data() {
        return {
            userEmail: "",
            userName: "",
            userSurname: "",
            userPassword: "",
        };
    },

    computed: {
        signInForm() {
            return {
                email: this.userEmail,
                name: this.userName,
                surname: this.userSurname,
                password: this.userPassword
            };
        }
    },

    methods: {
        createNewUser(event) {
            event.preventDefault();  
            axios.post("http://127.0.0.1:8000/api/register", this.signInForm)
            .then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error.response);
            }); 
        }
    }
};
</script>

<template>
    <form @submit.prevent="createNewUser">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" name="email" v-model="userEmail">
            <div class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="InputName" class="form-label">Name</label>
            <input type="text" class="form-control" id="InputName" name="name" v-model="userName">
        </div>
        <div class="mb-3">
            <label for="InputSurname" class="form-label">Surname</label>
            <input type="text" class="form-control" id="InputSurname" name="surname" v-model="userSurname">
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" name="password" v-model="userPassword">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>

<style scoped></style>
