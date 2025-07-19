import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/forum'
import { authApi, userApi } from '../services/api'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => currentUser.value?.is_admin ?? false)
  const isModerator = computed(() => currentUser.value?.is_moderator ?? false)

  // 从本地存储初始化状态
  function initFromLocalStorage() {
    // 先检查localStorage（长期登录）
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    // 如果localStorage中没有，则检查sessionStorage（临时登录）
    const sessionToken = sessionStorage.getItem('token')
    const sessionUser = sessionStorage.getItem('user')

    if (storedToken) {
      token.value = storedToken
    } else if (sessionToken) {
      token.value = sessionToken
    }

    if (storedUser) {
      try {
        currentUser.value = JSON.parse(storedUser)
      } catch (e) {
        localStorage.removeItem('user')
      }
    } else if (sessionUser) {
      try {
        currentUser.value = JSON.parse(sessionUser)
      } catch (e) {
        sessionStorage.removeItem('user')
      }
    }
  }

  // 手机验证码登录
  async function loginWithPhone(phone: string, code: string, remember: boolean = false) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login('SMS', phone, code, remember)

      // 后端返回格式: { token, userContext }
      const { token: authToken, userContext } = response

      token.value = authToken
      currentUser.value = {
        id: userContext.userId,
        username: userContext.username,
        avatar: userContext.avatar || '/img/avatar-default.png',
        email: '',
        phone: phone,
        bio: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reputation: 0,
        post_count: 0,
        comment_count: 0,
        is_admin: userContext.isAdmin || false,
        is_moderator: userContext.isModerator || false,
        last_active_at: new Date().toISOString()
      } as User

      // 保存到本地存储
      if (remember) {
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(currentUser.value))
      } else {
        sessionStorage.setItem('token', authToken)
        sessionStorage.setItem('user', JSON.stringify(currentUser.value))
      }

      return true
    } catch (e: any) {
      error.value = e?.message || '登录失败，请检查手机号和验证码'
      return false
    } finally {
      loading.value = false
    }
  }

  // 邮箱验证码登录
  async function loginWithEmail(email: string, code: string, remember: boolean = false) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login('EMAIL', email, code, remember)

      // 后端返回格式: { token, userContext }
      const { token: authToken, userContext } = response

      token.value = authToken
      currentUser.value = {
        id: userContext.userId,
        username: userContext.username,
        avatar: userContext.avatar || '/img/avatar-default.png',
        email: email,
        bio: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reputation: 0,
        post_count: 0,
        comment_count: 0,
        is_admin: userContext.isAdmin || false,
        is_moderator: userContext.isModerator || false,
        last_active_at: new Date().toISOString()
      } as User

      // 保存到本地存储
      if (remember) {
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(currentUser.value))
      } else {
        sessionStorage.setItem('token', authToken)
        sessionStorage.setItem('user', JSON.stringify(currentUser.value))
      }

      return true
    } catch (e: any) {
      error.value = e?.message || '登录失败，请检查邮箱和验证码'
      return false
    } finally {
      loading.value = false
    }
  }

  // 直接设置用户信息（用于模拟登录）
  async function login(userData: User & { token: string }) {
    token.value = userData.token
    currentUser.value = userData
    
    // 保存到本地存储
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    
    return true
  }

  // 登出方法
  async function logout() {
    loading.value = true
    error.value = null

    try {
      await authApi.logout()
    } catch (e) {
      // 即使API调用失败，仍然清除本地状态
    } finally {
      // 清除状态和本地存储
      token.value = null
      currentUser.value = null

      // 清除localStorage和sessionStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')

      loading.value = false
    }
  }

  // 获取当前用户信息
  async function fetchCurrentUser() {
    loading.value = true
    error.value = null

    try {
      const user = await userApi.getCurrentUser()
      currentUser.value = user

      // 更新本地存储中的用户信息
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (storedToken) {
        if (localStorage.getItem('token')) {
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          sessionStorage.setItem('user', JSON.stringify(user))
        }
      }

      return user
    } catch (e: any) {
      error.value = e?.message || '获取用户信息失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新用户资料
  async function updateProfile(data: any) {
    loading.value = true
    error.value = null

    try {
      const user = await userApi.updateProfile(data)
      currentUser.value = user

      // 更新本地存储中的用户信息
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (storedToken) {
        if (localStorage.getItem('token')) {
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          sessionStorage.setItem('user', JSON.stringify(user))
        }
      }

      return user
    } catch (e: any) {
      error.value = e?.message || '更新个人资料失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 发送验证码
  async function sendVerificationCode(type: 'EMAIL' | 'SMS', identifier: string) {
    loading.value = true
    error.value = null

    try {
      await authApi.sendCode(type, identifier)
      return true
    } catch (e: any) {
      error.value = e?.message || '发送验证码失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 验证Token有效性并获取用户信息
  async function validateTokenAndFetchUser() {
    if (!token.value) {
      return false
    }

    try {
      const user = await userApi.getCurrentUser()
      currentUser.value = user

      // 更新本地存储中的用户信息
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (storedToken) {
        if (localStorage.getItem('token')) {
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          sessionStorage.setItem('user', JSON.stringify(user))
        }
      }

      return true
    } catch (e: any) {
      // 只有在401错误时才清除Token，其他错误保持登录状态
      if (e.response?.status === 401) {
        token.value = null
        currentUser.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
      }
      return false
    }
  }

  return {
    currentUser,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isModerator,
    initFromLocalStorage,
    loginWithPhone,
    loginWithEmail,
    login,
    logout,
    fetchCurrentUser,
    updateProfile,
    sendVerificationCode,
    validateTokenAndFetchUser
  }
}) 