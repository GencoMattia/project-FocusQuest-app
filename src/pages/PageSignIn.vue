<script>
import axios from "axios";

export default {
    data() {
        return {

        };
    },

    methods: {
        createNewUser() {
            axios.post("http://127.0.0.1:8000/api/sign-in")
            .then((response) => {
                console.log(response);
            })
        }
    }

};
</script>

<template>
    <form @submit="createNewUser">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email">
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="InputName" class="form-label">Name</label>
            <input type="text" class="form-control" id="InputName" aria-describedby="emailHelp" name="name">
        </div>
        <div class="mb-3">
            <label for="InputSurname" class="form-label">Surname</label>
            <input type="text" class="form-control" id="InputSurname" aria-describedby="emailHelp" name="surname">
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" name="password">
        </div>
        <!-- <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div> -->
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>

<style scoped></style>