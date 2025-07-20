import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { ElMessage } from 'element-plus'

// 路由懒加载函数，支持预加载和错误处理
const lazyLoad = (componentPath: string, chunkName?: string) => {
  return () => {
    const componentImport = import(
      /* webpackChunkName: "[request]" */
      /* webpackPreload: true */
      `../pages/${componentPath}.vue`
    )

    // 添加加载错误处理
    return componentImport.catch((error) => {
      console.error(`Failed to load component: ${componentPath}`, error)
      // 返回错误页面组件
      return import('../pages/NotFound.vue')
    })
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: lazyLoad('Home', 'home'),
    meta: {
      title: 'Lumen论坛 - 首页',
      preload: true, // 标记为需要预加载的页面
    },
  },
  {
    path: '/post/:id',
    name: 'postDetail',
    component: lazyLoad('PostDetail', 'post-detail'),
    props: true,
    meta: {
      title: '帖子详情 - Lumen论坛',
      preload: true,
    },
  },
  {
    path: '/category/:id',
    name: 'category',
    component: lazyLoad('Category', 'category'),
    props: true,
    meta: {
      title: '分类浏览 - Lumen论坛',
    },
  },
  {
    path: '/user/:id',
    name: 'userProfile',
    component: lazyLoad('UserProfile', 'user-profile'),
    props: true,
    meta: {
      title: '用户资料 - Lumen论坛',
    },
  },
  {
    path: '/create-post',
    name: 'createPost',
    component: lazyLoad('CreatePost', 'create-post'),
    meta: {
      title: '发布帖子 - Lumen论坛',
      requiresAuth: true,
    },
  },
  {
    path: '/edit-post/:id',
    name: 'editPost',
    component: () => import('../pages/EditPost.vue'),
    props: true,
    meta: {
      title: '编辑帖子 - Lumen论坛',
      requiresAuth: true,
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/Search.vue'),
    meta: {
      title: '搜索结果 - Lumen论坛',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../pages/Settings.vue'),
    meta: {
      title: '设置 - Lumen论坛',
      requiresAuth: true,
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../pages/Notifications.vue'),
    meta: {
      title: '通知 - Lumen论坛',
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/About.vue'),
    meta: {
      title: '关于我们 - Lumen论坛',
    },
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('../pages/NotFound.vue'),
    meta: {
      title: '页面未找到 - Lumen论坛',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 身份验证逻辑
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 获取用户状态
    const userStore = useUserStore()
    
    // 检查用户是否已登录
    if (!userStore.isAuthenticated) {
      ElMessage({
        message: '您需要登录才能访问此页面',
        type: 'warning',
        duration: 3000
      })
      
      // 跳转到首页，并保存原本要去的路径
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      // 用户已登录，检查是否有特殊权限要求
      if (to.meta.requiresAdmin && !userStore.isAdmin) {
        ElMessage({
          message: '您没有权限访问此页面',
          type: 'error',
          duration: 3000
        })
        next({ path: '/' })
      } else if (to.meta.requiresModerator && !userStore.isModerator && !userStore.isAdmin) {
        ElMessage({
          message: '您没有权限访问此页面',
          type: 'error',
          duration: 3000
        })
        next({ path: '/' })
      } else {
        // 有权限访问
        next()
      }
    }
  } else {
    // 不需要认证的路由
    next()
  }
})

export default router 