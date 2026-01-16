import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@views/auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@views/auth/Register.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@views/auth/ForgotPassword.vue'),
  },
  {
    path: '/questions',
    name: 'Questions',
    component: () => import('@views/questions/QuestionList.vue'),
  },
  {
    path: '/questions/:id',
    name: 'QuestionDetail',
    component: () => import('@views/questions/QuestionDetail.vue'),
  },
  {
    path: '/practice',
    name: 'Practice',
    redirect: '/practice/records',
  },
  {
    path: '/practice/records',
    name: 'PracticeRecords',
    component: () => import('@views/practice/Records.vue'),
  },
  {
    path: '/practice/favorites',
    name: 'Favorites',
    component: () => import('@views/practice/Favorites.vue'),
  },
  {
    path: '/practice/wrong',
    name: 'WrongQuestions',
    component: () => import('@views/practice/WrongQuestions.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
