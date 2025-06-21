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
@use "../assets/partials/variables" as *;

.profile-container {
    background-color: $background-color; // Light background
    padding: 20px;
    border-radius: 10px;
    box-shadow: $box-shadow; // Add shadow for depth
    max-width: 600px;
    margin: auto;
    text-align: center; // Center content

    .profile-title {
        color: $primary-color; // Use primary color for title
        font-size: $font-size-lg; // Larger font size for the title
        margin-bottom: 20px;
    }

    .profile-details {
        background-color: $light-color; // Light background for details
        border-radius: $btn-border-radius; // Match button radius
        padding: 15px;
        box-shadow: $box-shadow; // Shadow for the details box
        color: $font-color; // Use standard font color

        p {
            font-size: $font-size-base; // Base font size for text
            margin: 5px 0; // Margin for paragraphs
        }
    }
}
</style>