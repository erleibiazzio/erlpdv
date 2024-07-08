// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import EUsers from '../components/e-users/ErIndex.vue';
import EDashboard from '../components/e-dashboard/ErIndex.vue';

const routes = [
  {
    path: '/',
    name: 'e-dashboard',
    component: EDashboard
  },
  {
    path: '/users',
    name: 'e-users',
    component: EUsers
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
