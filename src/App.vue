<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import appHeader from './components/appHeader.vue';
import { store } from './store';

const route = useRoute();
</script>

<template>
  <div id="app-bg">
    <header>
      <appHeader />
    </header>

    <!-- Breadcrumbs -->
    <nav class="fq-breadcrumbs container" aria-label="breadcrumb">
      <template v-for="(m, i) in route.matched" :key="m.path">
        <RouterLink v-if="i < route.matched.length - 1" :to="m.path">
          {{ m.meta?.breadcrumb || m.name }}
        </RouterLink>
        <span v-else aria-current="page">{{ m.meta?.breadcrumb || m.name }}</span>
        <span v-if="i < route.matched.length - 1" class="sep">/</span>
      </template>
    </nav>

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
@use "../node_modules/bootstrap/scss/bootstrap.scss";
@use "./assets/general.scss";

#app-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gradient-start) 30%, var(--gradient-end) 100%);
}
</style>
