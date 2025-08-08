<script setup>
import { RouterView } from 'vue-router';
import appHeader from './components/appHeader.vue';
import { store } from './store';
</script>

<template>
  <div id="app-bg">
    <header>
      <appHeader />
    </header>

    <RouterView />

    <!-- Global Toasts -->
    <div class="fq-toasts" role="region" aria-live="polite" aria-label="Notifiche">
      <div v-for="t in store.toasts" :key="t.id" class="fq-toast" :class="t.variant" role="alert">
        {{ t.message }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "./assets/partials/_variables.scss" as *;
/* theme.css is imported in main.js to set CSS vars */
@use "../node_modules/bootstrap/scss/bootstrap.scss"; // base components
@use "./assets/general.scss"; // our overrides

#app-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gradient-start) 30%, var(--gradient-end) 100%);
}
</style>
