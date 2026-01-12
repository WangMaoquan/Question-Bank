<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <Header />
    <main class="grow bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <RouterView />
      </div>
    </main>
    <Footer />
  </div>
</template>
