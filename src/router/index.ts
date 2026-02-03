import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'health',
        name: 'Health',
        redirect: '/health/meals',
        children: [
          {
            path: 'meals',
            name: 'Meals',
            component: () => import('@/views/health/Meals.vue'),
            meta: { title: '饮食记录' }
          },
          {
            path: 'water',
            name: 'Water',
            component: () => import('@/views/health/Water.vue'),
            meta: { title: '饮水记录' }
          },
          {
            path: 'workouts',
            name: 'Workouts',
            component: () => import('@/views/health/Workouts.vue'),
            meta: { title: '训练记录' }
          },
          {
            path: 'data',
            name: 'HealthData',
            component: () => import('@/views/health/HealthData.vue'),
            meta: { title: '健康数据' }
          }
        ]
      },
      {
        path: 'reminders',
        name: 'Reminders',
        component: () => import('@/views/reminders/Index.vue'),
        meta: { title: '任务管理' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/inventory/List.vue'),
        meta: { title: '库存管理' }
      },
      {
        path: 'pets',
        name: 'Pets',
        component: () => import('@/views/pets/List.vue'),
        meta: { title: '宠物管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  // Update document title
  const title = to.meta.title as string
  document.title = title ? `${title} - Oliver System` : 'Oliver Personal System'

  const token = getToken()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  if (requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && token) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
