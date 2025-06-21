<script setup>
import { RouterLink, RouterView } from 'vue-router';
import appHeader from './components/appHeader.vue';


</script>

<template>
  <div id="app-bg">
    <header>
      <appHeader />
    </header>
    <RouterView />
  </div>
</template>

<style lang="scss">
@use "./assets/partials/_variables.scss" as *;
@use "../node_modules/bootstrap/scss/bootstrap.scss";
@use "./assets/general.scss";

#app-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color 30%, $pastel-accent 100%);
}
</style>
