<script setup lang="ts">
//
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">欢迎来到题库平台</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
          社区驱动的题库平台，分享知识，共同进步
        </p>
        <div class="flex gap-4 justify-center">
          <router-link
            to="/questions"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            浏览题库
          </router-link>
          <router-link
            to="/login"
            class="px-6 py-3 bg-white text-blue-600 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
