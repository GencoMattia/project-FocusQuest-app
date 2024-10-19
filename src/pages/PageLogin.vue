<script>
import axios from "axios";
import { store } from "@/store";
export default {
    data() {
        return {
            userEmail: "",
            userPassword: "",
            store,
            errors: {},
        };
    },

    methods: {
        validateInput() {
            this.errors = {};

            //Email Validator
            if (!this.userEmail) {
                this.errors.email = "L'indirizzo email è obbligatorio";
            } else if(!this.isValidEmail(this.userEmail)) {
                this.errors.email = "Inserisci un indirizzo email valido";
            }

            //Password Validator
            if (!this.userPassword) {
                this.errors.password = "La password è obbligatoria";
            } else if (this.userPassword.length < 8) {
                this.errors.password = "La password deve essere lunga almeno 8 caratteri";
            }

            //If there are any errors return false, otherwise return true
            return Object.keys(this.errors).length === 0;
        },

        isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        // Custom HTML validation messages
        validateNativeEmail(event) {
            const emailInput = event.target;

            if (emailInput.validity.valueMissing) {
                emailInput.setCustomValidity("L'indirizzo email è obbligatorio");
            } else if (emailInput.validity.typeMismatch) {
                emailInput.setCustomValidity("Inserisci un indirizzo email valido");
            } else {
                emailInput.setCustomValidity("");
            }

            emailInput.reportValidity();
        },

        logInUser(event) {
            event.preventDefault();

            if (!this.validateInput()) {
                return; //Stop the request if the validation fails
            }

            axios.post("http://127.0.0.1:8000/api/auth/login", {
                email: this.userEmail,
                password: this.userPassword
            })
                .then((response) => {
                    localStorage.setItem("token", response.data.access_token);
                    console.log(response);

                    //Update store.js data
                    this.store.loggedUser.name = response.data.name
                    this.store.loggedUser.surname = response.data.surname
                    this.store.loggedUser.email = response.data.user.email
                    this.store.loggedUser.id = response.data.user.id

                    //Redirect to Dashboard page
                    this.$router.push("/dashboard");
                }).catch((error) => {
                    if (error.response && error.response.data) {
                        this.errors.server = "Email o password errati";
                    }

                    console.log("Login Error:", error.response.data);
                });
        }
    }

};
</script>

<template>
    <div class="login-page">
        <div class="login-container">
            <h1 class="login-title">Welcome Back</h1>
            <p class="login-subtitle">Please sign in to continue</p>
            <form @submit.prevent="logInUser" class="login-form">
                <!-- Input Email -->
                <div class="form-group">
                    <label for="loginInputEmail" class="form-label">Email address</label>
                    <input 
                    v-model="userEmail" 
                    type="text" 
                    class="form-control" 
                    id="loginInputEmail" 
                    placeholder="Enter your email"
                    @input="validateNativeEmail"
                    required>
                    <!-- Show email error -->
                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                </div>

                <!-- Input Password -->
                <div class="form-group">
                    <label for="loginInputPassword" class="form-label">Password</label>
                    <input 
                    v-model="userPassword" 
                    type="password" 
                    class="form-control" 
                    id="loginInputPassword" 
                    placeholder="Enter your password"
                    required>
                    <!-- Show password error -->
                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                </div>

                <!-- Show generic error -->
                <div v-if="errors.server" class="error-message">{{ errors.server }}</div>

                <!-- <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="loginCheck">
                    <label class="form-check-label" for="loginCheck">Remember me</label>
                </div> -->

                <button type="submit" class="btn-submit">Sign In</button>
            </form>
            <div class="login-footer">
                <p>Don't have an account? <router-link :to="{ name: 'register'}">Sign up here</router-link></p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.login-container {
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.login-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.login-subtitle {
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

.login-footer {
    margin-top: 1.5rem;
    font-size: 14px;
}

.login-footer a {
    color: #007bff;
    text-decoration: none;
}

.login-footer a:hover {
    text-decoration: underline;
}

.error-message {
    color: red;
    font-size: 0.9rem;
}
</style>