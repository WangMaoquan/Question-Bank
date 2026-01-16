<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { UserCircleIcon } from '@heroicons/vue/24/solid';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);

const navigation = [
  { name: '题目', href: '/questions' },
  {
    name: '练习',
    href: '/practice',
    submenu: [
      { name: '练习记录', href: '/practice/records' },
      { name: '错题本', href: '/practice/wrong' },
      { name: '我的收藏', href: '/practice/favorites' },
    ],
  },
  { name: '社区', href: '/community' },
];

// 检查是否在认证页面
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <header class="bg-white">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <RouterLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Question Bank</span>
          <span
            class="text-2xl font-bold bg-linear-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Question Bank
          </span>
        </RouterLink>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-8">
        <template v-for="item in navigation" :key="item.name">
          <!-- Menu with submenu -->
          <Menu v-if="item.submenu" as="div" class="relative">
            <MenuButton
              class="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              {{ item.name }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </MenuButton>
            <MenuItems
              class="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <MenuItem v-for="subitem in item.submenu" :key="subitem.name" v-slot="{ active }">
                <RouterLink
                  :to="subitem.href"
                  :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                >
                  {{ subitem.name }}
                </RouterLink>
              </MenuItem>
            </MenuItems>
          </Menu>

          <!-- Simple link without submenu -->
          <RouterLink
            v-else
            :to="item.href"
            class="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
          >
            {{ item.name }}
          </RouterLink>
        </template>
      </div>
      <div v-if="!isAuthPage" class="hidden lg:flex lg:flex-1 lg:justify-end gap-x-4">
        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/login" class="text-sm font-semibold leading-6 text-gray-900">
            登录 <span aria-hidden="true">&rarr;</span>
          </RouterLink>
          <RouterLink
            to="/register"
            class="rounded-md bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            注册
          </RouterLink>
        </template>
        <template v-else>
          <Menu as="div" class="relative">
            <MenuButton
              class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900"
            >
              <UserCircleIcon class="h-8 w-8 text-gray-400" />
              <span>{{ authStore.user?.username }}</span>
            </MenuButton>
            <MenuItems
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <MenuItem v-slot="{ active }">
                <RouterLink
                  to="/profile"
                  :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                >
                  个人中心
                </RouterLink>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="handleLogout"
                  :class="[
                    active ? 'bg-gray-100' : '',
                    'block w-full text-left px-4 py-2 text-sm text-gray-700',
                  ]"
                >
                  退出登录
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </template>
      </div>
    </nav>
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Question Bank</span>
            <span class="text-xl font-bold text-gray-900">Question Bank</span>
          </RouterLink>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                {{ item.name }}
              </RouterLink>
            </div>
            <div v-if="!isAuthPage" class="py-6">
              <RouterLink
                to="/login"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >登录</RouterLink
              >
              <RouterLink
                to="/register"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >注册</RouterLink
              >
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
