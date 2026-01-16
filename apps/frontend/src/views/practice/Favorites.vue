<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/client';
import type { Favorite, PaginatedResponse } from '@question-bank/types';

const router = useRouter();
const favorites = ref<Favorite[]>([]);
const isLoading = ref(false);
const error = ref('');

const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(20);
const total = ref(0);

async function fetchFavorites() {
  isLoading.value = true;
  error.value = '';

  try {
    const response: PaginatedResponse<Favorite> = await apiClient.practice.getFavorites({
      page: currentPage.value,
      limit: pageSize.value,
    });

    favorites.value = response.items;
    total.value = response.meta.total;
    totalPages.value = response.meta.totalPages;
    currentPage.value = response.meta.page;
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取收藏列表失败';
  } finally {
    isLoading.value = false;
  }
}

async function removeFavorite(id: string) {
  if (!confirm('确定要取消收藏吗？')) return;

  try {
    await apiClient.practice.removeFavorite(id);
    fetchFavorites();
  } catch (err: any) {
    error.value = err.response?.data?.message || '取消收藏失败';
  }
}

function viewQuestion(questionId: string) {
  router.push(`/questions/${questionId}`);
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchFavorites();
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return difficulty;
  }
}

onMounted(() => {
  fetchFavorites();
});
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">我的收藏</h1>
      <p class="mt-2 text-gray-600">管理您收藏的题目</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <!-- Favorites List -->
    <div v-else-if="favorites.length > 0" class="space-y-4">
      <div
        v-for="favorite in favorites"
        :key="favorite.id"
        class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="grow cursor-pointer" @click="viewQuestion(favorite.questionId)">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ favorite.question?.title || '题目已删除' }}
            </h3>
            <p class="text-gray-600 line-clamp-2 mb-4">{{ favorite.question?.content }}</p>

            <div class="flex items-center gap-4 text-sm">
              <span
                v-if="favorite.question"
                :class="[
                  'px-2.5 py-0.5 rounded-full font-medium',
                  getDifficultyColor(favorite.question.difficulty),
                ]"
              >
                {{ getDifficultyLabel(favorite.question.difficulty) }}
              </span>
              <span v-if="favorite.question" class="text-gray-500">
                类型: {{ favorite.question.type }}
              </span>
            </div>
          </div>

          <button
            @click="removeFavorite(favorite.id)"
            class="ml-4 text-red-600 hover:text-red-700 font-medium text-sm"
          >
            取消收藏
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow-sm">
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
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无收藏</h3>
      <p class="mt-1 text-sm text-gray-500">您还没有收藏任何题目</p>
      <div class="mt-6">
        <button
          @click="router.push('/questions')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          前往题库
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg"
    >
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
      <div class="hidden sm:flex sm:grow sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            显示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到
            <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span> 条， 共
            <span class="font-medium">{{ total }}</span> 条
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              v-for="page in Math.min(totalPages, 10)"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                page === currentPage
                  ? 'z-10 bg-primary-600 text-white focus:z-20'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
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
  </div>
</template>
