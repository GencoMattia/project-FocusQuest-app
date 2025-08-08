<script>
import { store } from '@/store';

export default {
    data() {
        return {
            store,
        };
    },
    computed: {
        userName() {
            return this.store.loggedUser.name || 'Utente';
        },
        userSurname() {
            return this.store.loggedUser.surname || '';
        },
        userEmail() {
            return this.store.loggedUser.email || '';
        },
        userId() {
            return this.store.loggedUser.id || '';
        }
    },
};
</script>

<template>
    <div class="profile-container">
        <h1 class="profile-title">Profilo di {{ userName }} {{ userSurname }}</h1>
        <div class="profile-details">
            <p><strong>Email:</strong> {{ userEmail }}</p>
            <p><strong>User ID:</strong> {{ userId }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../assets/partials/_variables.scss" as *;

.profile-container {
    background-color: $secondary-color;
    padding: 2.5rem 2rem;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.10);
    max-width: 420px;
    margin: 3rem auto;
    text-align: center;
    font-family: 'Poppins', sans-serif;

    .profile-title {
        color: $primary-color;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
    }

    .profile-details {
        background: linear-gradient(135deg, $primary-color 10%, $accent-color 100%);
        color: $text-color;
        border: 1px solid $primary-color;
        border-radius: $btn-border-radius;
        padding: 1.5rem;
        box-shadow: $box-shadow;
        font-size: 1.1rem;
        margin-bottom: 1rem;

        p {
            margin: 0.5rem 0;
        }
    }
}
</style>