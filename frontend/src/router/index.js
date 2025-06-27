import { createRouter, createWebHashHistory } from 'vue-router'

// Importaciones estáticas o lazy
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CreateReportView from '@/views/CreateReportView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  {
    path: '/',             // 👈 Ruta raíz
    name: 'Login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-report',
    name: 'CreateReport',
    component: CreateReportView,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-report/:id',
    name: 'EditReport',
    component: CreateReportView,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'          // 👈 cualquier ruta inválida vuelve al login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 👇 Protección de rutas privadas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' }) // redirige al login si no hay token
  }
  next()
})

export default router
