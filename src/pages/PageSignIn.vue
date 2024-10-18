<script>
import axios from "axios";

export default {
    data() {
        return {
            userEmail: "",
            userName: "",
            userSurname: "",
            userPassword: "",
            userPasswordConfirmation: "",
            errors: {},
        };
    },

    methods: {
        validateInput() {
            this.errors = {};

            // Email Validator
            if (!this.userEmail) {
                this.errors.email = "L'indirizzo email è obbligatorio";
            } else if (!this.isValidEmail(this.userEmail)) {
                this.errors.email = "Inserisci un indirizzo email valido";
            }

            // User Name Validator
            if (!this.userName) {
                this.errors.name = "Il nome è obbligatorio";
            } else if (this.userName.length < 3 || this.userName.length > 50) {
                this.errors.name = "Il nome deve essere compreso tra 3 e 50 caratteri";
            }

            // User Surname Validator
            if (!this.userSurname) {
                this.errors.surname = "Il cognome è obbligatorio";
            } else if (this.userSurname.length < 3 || this.userSurname.length > 50) {
                this.errors.surname = "Il cognome deve essere compreso tra 3 e 50 caratteri";
            }

            // Password Validator
            if (!this.userPassword) {
                this.errors.password = "La password è obbligatoria";
            } else if (this.userPassword.length < 8) {
                this.errors.password = "La password deve avere almeno 8 caratteri";
            }

            // Confirm Password Validator
            if (this.userPassword !== this.userPasswordConfirmation) {
                this.errors.password_confirmation = "Le password non corrispondono";
            }

            return Object.keys(this.errors).length === 0;
        },

        isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        clearValidationMessage(field) {
            this.errors[field] = "";
        },

        createNewUser(event) {
            event.preventDefault();

            if (!this.validateInput()) {
                return; // Stop the request if the validation fails
            }

            axios.post("http://127.0.0.1:8000/api/register", this.signInForm)
                .then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.log(error.response);
                });
        }
    },

    computed: {
        signInForm() {
            return {
                email: this.userEmail,
                name: this.userName,
                surname: this.userSurname,
                password: this.userPassword,
                password_confirmation: this.userPasswordConfirmation
            };
        }
    },
};
</script>

<template>
    <div class="register-page">
        <div class="register-container">
            <h1 class="register-title">Create Account</h1>
            <p class="register-subtitle">Join us by creating an account</p>

            <form @submit.prevent="createNewUser" novalidate>
                <input type="email" class="form-control" id="exampleInputEmail1" name="email" v-model="userEmail"
                    @input="clearValidationMessage('email')">
                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                <div class="form-text">We'll never share your email with anyone else.</div>
                <div class="mb-3">
                    <label for="InputName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="InputName" name="name" v-model="userName"
                        @input="clearValidationMessage('name')">
                    <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
                </div>
                <div class="mb-3">
                    <label for="InputSurname" class="form-label">Surname</label>
                    <input type="text" class="form-control" id="InputSurname" name="surname" v-model="userSurname"
                        @input="clearValidationMessage('surname')">
                    <div v-if="errors.surname" class="text-danger">{{ errors.surname }}</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" name="password"
                        v-model="userPassword" @input="clearValidationMessage('password')">
                    <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword2" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword2" name="password_confirmation"
                        v-model="userPasswordConfirmation" @input="clearValidationMessage('password_confirmation')">
                    <div v-if="errors.password_confirmation" class="text-danger">{{ errors.password_confirmation }}
                    </div>
                </div>

                <div v-if="errors.general" class="text-danger">{{ errors.general }}</div>

                <button type="submit" class="btn btn-primary">Submit</button>
            </form>

            <div class="register-footer">
                <p>Already have an account? <router-link :to="{ name: 'login' }">Log in here</router-link></p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
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
