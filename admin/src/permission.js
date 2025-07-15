/**
 * 路由权限控制模块
 * 
 * 功能说明：
 * 1. 路由守卫配置
 * 2. 用户登录状态验证
 * 3. 页面访问权限控制
 * 4. 进度条显示控制
 * 5. 页面标题动态设置
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-01-15
 */

import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条组件
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 获取token
import getPageTitle from '@/utils/get-page-title' // 获取页面标题

// 配置NProgress进度条
NProgress.configure({ 
  showSpinner: false, // 隐藏加载动画
  minimum: 0.1, // 最小进度值
  easing: 'ease', // 缓动函数
  speed: 500 // 动画速度
})

// 白名单路由（无需登录即可访问）
const whiteList = ['/login']

/**
 * 全局前置守卫
 * 
 * @param {Object} to - 目标路由对象
 * @param {Object} from - 来源路由对象
 * @param {Function} next - 路由跳转函数
 */
router.beforeEach(async(to, from, next) => {
  // 开始显示进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取用户token
  const hasToken = getToken()

  if (hasToken) {
    // 已登录状态
    if (to.path === '/login') {
      // 如果已登录且访问登录页，重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查是否已获取用户信息
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 已有用户信息，直接通过
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // 获取用户信息失败，清除token并跳转登录页
          await store.dispatch('user/resetToken')
          Message.error(error || '获取用户信息失败，请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 未登录状态
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单中，直接通过
      next()
    } else {
      // 不在白名单中，重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

/**
 * 全局后置钩子
 * 
 * @param {Object} to - 目标路由对象
 * @param {Object} from - 来源路由对象
 */
router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
