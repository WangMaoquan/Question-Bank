<script setup lang="ts">
interface Props {
  lines?: number;
}

const props = withDefaults(defineProps<Props>(), {
  lines: 5,
});
</script>

<template>
  <div class="space-y-4 animate-pulse">
    <div v-for="i in lines" :key="i" class="bg-gray-200 h-20 rounded-lg"></div>
  </div>
</template>
