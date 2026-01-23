<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
}

interface Emits {
  (e: 'page-change', page: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function handlePageChange(page: number) {
  if (page < 1 || page > props.totalPages) return;
  emit('page-change', page);
}
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg"
  >
    <!-- Mobile -->
    <div class="flex grow justify-between sm:hidden">
      <button
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一页
      </button>
      <button
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>

    <!-- Desktop -->
    <div class="hidden sm:flex sm:grow sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          共 <span class="font-medium">{{ total }}</span> 条记录
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">上一页</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <button
            v-for="page in Math.min(totalPages, 7)"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
              page === currentPage
                ? 'z-10 bg-primary-600 text-white focus-visible:outline-primary-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">下一页</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
