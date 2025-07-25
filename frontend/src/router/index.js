import { createRouter, createWebHashHistory } from 'vue-router'

// Importaciones estáticas o lazy
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CreateReportView from '@/views/CreateReportView.vue'
import EditReportView from '@/views/EditReportView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TeamOverviewView from '@/views/TeamOverviewView.vue'
import CreatePlayerView from '@/views/CreatePlayerView.vue'
import AdminPanelView from '@/views/AdminPanelView.vue'

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
    component: EditReportView,
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
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanelView,
    meta: { requiresAuth: true, allowedRoles: [3] }
  },
  {
    path: '/team-management/overview',
    name: 'TeamOverview',
    component: TeamOverviewView,
    meta: { requiresAuth: true, allowedRoles: [1, 2, 3] }
  },
  {
    path: '/team-management/create-player',
    name: 'CreatePlayer',
    component: CreatePlayerView,
    meta: { requiresAuth: true, allowedRoles: [1, 2, 3] }
  },
  {
    path: '/team-management',
    redirect: '/team-management/overview'
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
  const token = sessionStorage.getItem('token')
  const user = sessionStorage.getItem('user')

  if (to.name === 'Login' && token && user) {
    return next({ name: 'Dashboard' })
  }

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' }) // redirige al login si no hay token
  }

  if (to.meta.allowedRoles) {
    if (!user) {
      return next({ name: 'Login' })
    }
    const u = JSON.parse(user)
    const role = Number(
      u.role ?? u.rol ?? u.roleId ?? u.rolId ?? u.Role ?? u.Rol ?? u.RoleID ?? u.RolID ?? 0
    )
    if (!to.meta.allowedRoles.includes(role)) {
      return next({ name: 'Dashboard' })
    }
  }
  next()
})

export default router
