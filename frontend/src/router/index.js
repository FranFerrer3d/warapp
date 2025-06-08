import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import CreateReportView from '../views/CreateReportView.vue';
import StatisticsView from '@/views/StatisticsView.vue'; 

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/create-report', name: 'CreateReport', component: CreateReportView, meta: { requiresAuth: true } },
    {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView, 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
