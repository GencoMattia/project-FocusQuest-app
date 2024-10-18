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
    <div class="register-page">
        <div class="register-container">
            <h1 class="register-title">Create Account</h1>
            <p class="register-subtitle">Join us by creating an account</p>
            <form @submit.prevent="createNewUser" class="register-form">
                <div class="form-group">
                    <label for="registerInputEmail" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="registerInputEmail" name="email" v-model="userEmail" placeholder="Enter your email">
                    <div class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="form-group">
                    <label for="registerInputName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="registerInputName" name="name" v-model="userName" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label for="registerInputSurname" class="form-label">Surname</label>
                    <input type="text" class="form-control" id="registerInputSurname" name="surname" v-model="userSurname" placeholder="Enter your surname">
                </div>
                <div class="form-group">
                    <label for="registerInputPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" id="registerInputPassword" name="password" v-model="userPassword" placeholder="Enter your password">
                </div>
                <button type="submit" class="btn-submit">Submit</button>
            </form>
            <div class="register-footer">
                <p>Already have an account? <router-link :to="{ name: 'login'}">Log in here</router-link></p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.register-container {
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.register-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.register-subtitle {
    font-size: 16px;
    color: #777;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
}

.btn-submit {
    width: 100%;
    padding: 0.75rem;
    font-size: 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-submit:hover {
    background-color: #0056b3;
}

.register-footer {
    margin-top: 1.5rem;
    font-size: 14px;
}

.register-footer a {
    color: #007bff;
    text-decoration: none;
}

.register-footer a:hover {
    text-decoration: underline;
}
</style>
