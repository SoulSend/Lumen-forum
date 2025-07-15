import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/forum'
import { get, post } from '../services/api'

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
      // 在实际项目中，这里应该调用真实的API
      // 目前使用模拟数据
      /*
      const response = await post<{token: string; user: User}>('/auth/login/phone', {
        phone,
        code
      })
      */
      
      // 模拟API响应
      const mockResponse = {
        token: 'mock-token-phone-' + Date.now(),
        user: {
          id: 1,
          username: '测试用户',
          avatar: '/img/avatar-default.png',
          email: '',
          phone: phone,
          bio: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reputation: 0,
          post_count: 0,
          comment_count: 0,
          is_admin: false,
          is_moderator: false,
          last_active_at: new Date().toISOString()
        } as User
      }
      
      token.value = mockResponse.token
      currentUser.value = mockResponse.user
      
      // 保存到本地存储，如果设置了记住登录
      if (remember) {
        localStorage.setItem('token', mockResponse.token)
        localStorage.setItem('user', JSON.stringify(mockResponse.user))
      } else {
        // 使用sessionStorage保存临时登录
        sessionStorage.setItem('token', mockResponse.token)
        sessionStorage.setItem('user', JSON.stringify(mockResponse.user))
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
      // 在实际项目中，这里应该调用真实的API
      // 目前使用模拟数据
      /*
      const response = await post<{token: string; user: User}>('/auth/login/email', {
        email,
        code
      })
      */
      
      // 模拟API响应
      const mockResponse = {
        token: 'mock-token-email-' + Date.now(),
        user: {
          id: 1,
          username: email.split('@')[0], // 使用邮箱前缀作为用户名
          avatar: '/img/avatar-default.png',
          email: email,
          bio: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reputation: 0,
          post_count: 0,
          comment_count: 0,
          is_admin: false,
          is_moderator: false,
          last_active_at: new Date().toISOString()
        } as User
      }
      
      token.value = mockResponse.token
      currentUser.value = mockResponse.user
      
      // 保存到本地存储，如果设置了记住登录
      if (remember) {
        localStorage.setItem('token', mockResponse.token)
        localStorage.setItem('user', JSON.stringify(mockResponse.user))
      } else {
        // 使用sessionStorage保存临时登录
        sessionStorage.setItem('token', mockResponse.token)
        sessionStorage.setItem('user', JSON.stringify(mockResponse.user))
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
      await post('/auth/logout')
    } catch (e) {
      // 即使API调用失败，仍然清除本地状态
      console.error('Logout API call failed:', e)
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
      const user = await get<User>('/users/me')
      currentUser.value = user
      return user
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取用户信息失败'
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
      const user = await post<User>('/users/profile', data)
      currentUser.value = user
      // 更新localStorage中的用户信息
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (e: any) {
      error.value = e.response?.data?.message || '更新个人资料失败'
      return null
    } finally {
      loading.value = false
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
    updateProfile
  }
}) 