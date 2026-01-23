<script setup lang="ts">
// Placeholder for categories management
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:grow">
        <h1 class="text-2xl font-semibold text-gray-900">分类管理</h1>
        <p class="mt-2 text-sm text-gray-700">管理题目分类</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          创建分类
        </button>
      </div>
    </div>

    <div class="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg p-8 text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">功能开发中</h3>
      <p class="mt-1 text-sm text-gray-500">分类管理功能即将上线</p>
    </div>
  </div>
</template>
