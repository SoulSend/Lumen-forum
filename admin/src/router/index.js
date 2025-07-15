/**
 * 路由配置模块
 * 
 * 功能说明：
 * 1. 定义应用路由结构
 * 2. 配置路由元信息
 * 3. 实现路由懒加载
 * 4. 提供路由重置功能
 * 
 * 路由元信息说明：
 * - hidden: 是否在侧边栏隐藏
 * - alwaysShow: 是否始终显示根菜单
 * - redirect: 重定向路径
 * - name: 路由名称（用于keep-alive）
 * - meta: 路由元信息
 *   - roles: 可访问的角色列表
 *   - title: 显示在侧边栏和面包屑的标题
 *   - icon: 侧边栏图标
 *   - breadcrumb: 是否在面包屑中显示
 *   - activeMenu: 激活的菜单路径
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-01-15
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 常量路由配置
 * 这些路由不需要权限验证，所有角色都可以访问
 */
export const constantRoutes = [
  // 登录页面
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index'),
    hidden: true
  },

  // 404错误页面
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404'),
    hidden: true
  },

  // 首页仪表盘
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index'),
      meta: { 
        title: '首页', 
        icon: 'dashboard' 
      }
    }]
  },

  // 用户管理
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/index'),
        meta: { 
          title: '用户管理', 
          icon: 'user' 
        }
      }
    ]
  },

  // 日志管理
  {
    path: '/log',
    component: Layout,
    redirect: '/log/index',
    children: [
      {
        path: 'index',
        name: 'Log',
        component: () => import(/* webpackChunkName: "log" */ '@/views/log/index'),
        meta: { 
          title: '日志管理', 
          icon: 'log' 
        }
      }
    ]
  },

  // 通知中心
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    children: [
      {
        path: 'index',
        name: 'Notice',
        component: () => import(/* webpackChunkName: "notice" */ '@/views/notice/index'),
        meta: { 
          title: '通知公告', 
          icon: 'message' 
        }
      }
    ]
  },

  // 系统设置 (从侧边栏隐藏，只能通过头像下拉菜单访问)
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/index'),
        meta: { title: '系统设置', icon: 'setting' }
      }
    ]
  },

  // 个人中心 (从侧边栏隐藏，只能通过头像下拉菜单访问)
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index'),
        meta: { 
          title: '个人中心', 
          icon: 'user' 
        }
      }
    ]
  },

  // 404页面重定向（必须放在最后）
  { 
    path: '*', 
    redirect: '/404', 
    hidden: true 
  }
]

/**
 * 创建路由实例
 * 
 * @returns {Router} 路由实例
 */
const createRouter = () => new Router({
  // mode: 'history', // 需要服务器支持
  scrollBehavior: () => ({ y: 0 }), // 页面滚动行为
  routes: constantRoutes
})

// 创建路由实例
const router = createRouter()

/**
 * 重置路由
 * 
 * 用于用户登出时清除路由状态
 * 参考：https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由匹配器
}

export default router
