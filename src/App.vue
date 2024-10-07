<script setup>
import { RouterLink, RouterView } from 'vue-router';
import appHeader from './components/appHeader.vue';


</script>

<template>
  <header>
    <appHeader />
  </header>

  <RouterView />
</template>

<style lang="scss">
@use "../node_modules/bootstrap/scss/bootstrap.scss";
@use "./assets/general.scss";
@use "./assets/partials/variables.scss" as *;
</style>
