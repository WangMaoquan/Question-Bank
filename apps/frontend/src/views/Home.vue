<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const features = [
  {
    name: '海量题库',
    description: '覆盖多个学科和难度等级的题目，满足不同学习需求',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    name: '智能练习',
    description: '记录答题历史，智能推荐错题，帮助您高效复习',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    name: '错题本',
    description: '自动收集答错的题目，针对性复习，提高学习效率',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    name: '个人统计',
    description: '可视化展示学习进度，让您的成长看得见',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

const stats = [
  { label: '题目总数', value: '10,000+' },
  { label: '活跃用户', value: '5,000+' },
  { label: '练习记录', value: '50,000+' },
];
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
      <div class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:grow lg:pt-8">
          <h1 class="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            让学习更高效
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            丰富的题库资源，智能的练习系统，帮助您快速提升学习效果。随时随地，想练就练。
          </p>
          <div class="mt-10 flex items-center gap-x-6">
            <button
              v-if="!authStore.isAuthenticated"
              @click="router.push('/register')"
              class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              立即开始
            </button>
            <button
              v-else
              @click="router.push('/questions')"
              class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              开始练习
            </button>
            <a href="#features" class="text-sm font-semibold leading-6 text-gray-900">
              了解更多 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div
          class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:grow xl:ml-32"
        >
          <div class="max-w-3xl grow">
            <svg
              viewBox="0 0 366 729"
              role="img"
              class="mx-auto w-[22.875rem] max-w-full drop-shadow-xl"
            >
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect width="316" height="684" rx="36" />
                </clipPath>
              </defs>
              <path
                fill="#4F46E5"
                d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
              />
              <path
                fill="#343E4E"
                d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
              />
              <foreignObject
                width="316"
                height="684"
                transform="translate(24 24)"
                clip-path="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)"
              >
                <div class="flex h-full flex-col bg-white">
                  <div class="grow p-6">
                    <div class="text-lg font-semibold text-gray-900 mb-4">题库平台</div>
                    <div class="space-y-3">
                      <div class="bg-primary-50 p-4 rounded-lg">
                        <div class="text-sm font-medium text-primary-900">今日练习</div>
                        <div class="mt-1 text-2xl font-bold text-primary-600">23 题</div>
                      </div>
                      <div class="bg-green-50 p-4 rounded-lg">
                        <div class="text-sm font-medium text-green-900">正确率</div>
                        <div class="mt-1 text-2xl font-bold text-green-600">85%</div>
                      </div>
                      <div class="bg-yellow-50 p-4 rounded-lg">
                        <div class="text-sm font-medium text-yellow-900">收藏题目</div>
                        <div class="mt-1 text-2xl font-bold text-yellow-600">12 题</div>
                      </div>
                    </div>
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="mx-auto flex max-w-xs flex-col gap-y-4"
          >
            <dt class="text-base leading-7 text-gray-600">{{ stat.label }}</dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {{ stat.value }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Features -->
    <div id="features" class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-primary-600">更智能的学习</h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            一站式题库练习平台
          </p>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            我们提供全面的题库资源和智能的学习工具，帮助您更好地掌握知识，提升学习效率。
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            <div v-for="feature in features" :key="feature.name" class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-600">
                  <svg
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
                  </svg>
                </div>
                {{ feature.name }}
              </dt>
              <dd class="mt-4 flex grow flex-col text-base leading-7 text-gray-600">
                <p class="grow">{{ feature.description }}</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="bg-white">
      <div class="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            准备好开始学习了吗？<br />现在就开始您的学习之旅
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            加入我们，体验高效的学习方式，让知识掌握变得更加轻松愉快。
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <button
              v-if="!authStore.isAuthenticated"
              @click="router.push('/register')"
              class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              免费注册
            </button>
            <button
              v-else
              @click="router.push('/profile')"
              class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              查看统计
            </button>
            <button
              @click="router.push('/questions')"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              浏览题库 <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
