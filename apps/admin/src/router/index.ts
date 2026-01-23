import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
      },
      {
        path: 'questions',
        name: 'Questions',
        component: () => import('@/views/questions/List.vue'),
      },
      {
        path: 'questions/create',
        name: 'QuestionCreate',
        component: () => import('@/views/questions/Edit.vue'),
      },
      {
        path: 'questions/:id/edit',
        name: 'QuestionEdit',
        component: () => import('@/views/questions/Edit.vue'),
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/categories/List.vue'),
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/views/tags/List.vue'),
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/List.vue'),
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('@/views/comments/List.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth !== false) {
    if (!authStore.isAuthenticated) {
      next('/login');
      return;
    }

    // 验证管理员角色
    if (!authStore.user) {
      try {
        await authStore.fetchProfile();
      } catch (error) {
        next('/login');
        return;
      }
    }

    if (!authStore.isAdmin) {
      next('/login');
      return;
    }
  }

  next();
});

export default router;
