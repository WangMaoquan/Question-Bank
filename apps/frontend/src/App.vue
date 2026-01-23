<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import ToastContainer from '@/components/shared/ToastContainer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="grow">
      <RouterView />
    </main>
    <Footer />
    <ToastContainer />
  </div>
</template>
