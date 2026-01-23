<script setup lang="ts">
// Placeholder for tags management
</script>

<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:grow">
        <h1 class="text-2xl font-semibold text-gray-900">标签管理</h1>
        <p class="mt-2 text-sm text-gray-700">管理题目标签</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          创建标签
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
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">功能开发中</h3>
      <p class="mt-1 text-sm text-gray-500">标签管理功能即将上线</p>
    </div>
  </div>
</template>
