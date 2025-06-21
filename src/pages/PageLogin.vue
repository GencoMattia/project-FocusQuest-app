<template>
    <div class="login-page">
        <div class="login-container">
            <h1 class="login-title">Welcome Back</h1>
            <p class="login-subtitle">Please sign in to continue</p>
            <form @submit.prevent="logInUser" class="login-form">
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
                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                </div>
                <div class="form-group">
                    <label for="loginInputPassword" class="form-label">Password</label>
                    <input 
                    v-model="userPassword" 
                    type="password" 
                    class="form-control" 
                    id="loginInputPassword" 
                    placeholder="Enter your password"
                    required>
                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                </div>
                <div v-if="errors.server" class="error-message">{{ errors.server }}</div>
                <button type="submit" class="btn-submit pastel-btn">Sign In</button>
            </form>
            <div class="login-footer">
                <p>Don't have an account? <router-link :to="{ name: 'register'}">Sign up here</router-link></p>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/api/axios";
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
                return;
            }
            this.errors = {};
            api.post("auth/login", {
                email: this.userEmail,
                password: this.userPassword
            })
                .then((response) => {
                    localStorage.setItem("token", response.data.access_token);
                    this.store.loggedUser.name = response.data.name || response.data.user.name;
                    this.store.loggedUser.surname = response.data.surname || response.data.user.surname;
                    this.store.loggedUser.email = response.data.user.email;
                    this.store.loggedUser.id = response.data.user.id;
                    this.userEmail = "";
                    this.userPassword = "";
                    this.errors = {};
                    this.$router.push("/dashboard");
                }).catch((error) => {
                    if (error.response && error.response.data) {
                        this.errors.server = "Email o password errati";
                    } else {
                        this.errors.server = "Errore di connessione";
                    }
                });
        }
    }

};
</script>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.login-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, $primary-color 30%, $pastel-accent 100%);
    font-family: 'Poppins', sans-serif;
}

.login-container {
    background-color: $secondary-color;
    padding: 2.5rem 2rem;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.10);
    text-align: center;
    width: 100%;
    max-width: 420px;
    margin: 2rem auto;
}

.login-title {
    font-size: 2.2rem;
    font-weight: bold;
    color: $primary-color;
    margin-bottom: 0.5rem;
}

.login-subtitle {
    font-size: 1.1rem;
    color: $accent-color;
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.2rem;
    text-align: left;
}

.form-control {
    width: 100%;
    padding: 0.85rem;
    font-size: 1rem;
    border: 1px solid $primary-color;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(163, 216, 244, 0.08);
    transition: border-color 0.3s $transition-timing-function, box-shadow 0.3s $transition-timing-function;
    background-color: $white;
}

.form-control:focus {
    border-color: $accent-color;
    box-shadow: 0 0 8px $accent-color;
}

.btn-submit, .pastel-btn {
    width: 100%;
    padding: $btn-padding-y $btn-padding-x;
    font-size: $btn-font-size;
    background-color: $btn-primary-bg;
    color: $btn-primary-color;
    border: none;
    border-radius: $btn-border-radius;
    cursor: pointer;
    transition: background-color $transition-duration $transition-timing-function;
    margin-top: 1rem;
    font-weight: bold;
    letter-spacing: 0.5px;
    &:hover {
        background-color: $pastel-blue-dark;
    }
}

.login-footer {
    margin-top: 2rem;
    font-size: 1rem;
    color: $text-color;

    a {
        color: $primary-color;
        text-decoration: underline;
        transition: color $transition-duration $transition-timing-function;
        &:hover {
            color: $accent-color;
        }
    }
}

.error-message {
    color: $danger-color;
    font-size: 0.95rem;
    margin-top: 0.2rem;
    text-align: left;
}
</style>