import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'products', component: () => import('pages/DashboardPage.vue'), meta: { requiresAuth: true } },
      // { path: 'products', component: () => import('pages/DashboardPage.vue')},
      { path: 'cart', component: () => import('pages/CartPage.vue'), meta: { requiresAuth: true }},
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes;
