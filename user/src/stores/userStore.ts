import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, ApiUserResponse, LoginResponse } from '../types/forum'
import { authApi, userApi } from '../services/api'
import { ErrorHandler } from '../utils/errorHandler'
import { ERROR_MESSAGES } from '../constants'
import { getUserAvatarUrl } from '@/utils/assets'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => currentUser.value?.isAdmin ?? currentUser.value?.is_admin ?? false)
  const isModerator = computed(() => currentUser.value?.isModerator ?? currentUser.value?.is_moderator ?? false)

  /**
   * 数据映射函数：将API响应映射为前端User对象
   * @param apiUser API返回的用户数据
   * @returns 标准化的User对象
   */
  const mapApiUserToUser = (apiUser: ApiUserResponse): User => {
    return {
      // API文档标准字段
      id: apiUser.id,
      username: apiUser.username,
      email: apiUser.email,
      phone: apiUser.phone,
      avatar: getUserAvatarUrl(),
      bio: apiUser.bio || '',
      website: apiUser.website || '',
      location: apiUser.location || '',
      title: apiUser.title || '',
      showEmail: apiUser.showEmail ?? false,
      reputation: apiUser.reputation ?? 0,
      postCount: apiUser.postCount ?? 0,
      commentCount: apiUser.commentCount ?? 0,
      isAdmin: apiUser.isAdmin ?? false,
      isModerator: apiUser.isModerator ?? false,

      // 管理相关字段
      moderatedCategory: apiUser.moderatedCategory,
      emailVerifiedAt: apiUser.emailVerifiedAt,
      phoneVerifiedAt: apiUser.phoneVerifiedAt,
      lastActiveAt: apiUser.lastActiveAt,
      rememberToken: apiUser.rememberToken,
      deleted: apiUser.deleted,
      createdAt: apiUser.createdAt,
      updatedAt: apiUser.updatedAt,

      // 扩展字段
      coverImage: apiUser.coverImage || apiUser.cover_image,
      skills: apiUser.skills || [],
      socialLinks: apiUser.socialLinks || apiUser.social_links || []
    }
  }

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

  /**
   * 手机验证码登录
   * @param phone 手机号码
   * @param code 验证码
   * @param remember 是否记住登录状态
   * @returns Promise<boolean> 登录是否成功
   */
  async function loginWithPhone(phone: string, code: string, remember: boolean = false): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response: LoginResponse = await authApi.login('SMS', phone, code, remember)

      // 后端返回格式: { token, userContext }
      const { token: authToken, userContext } = response

      token.value = authToken
      // 根据API文档，登录时只返回基本的userContext信息
      // 需要调用getCurrentUser获取完整用户信息
      currentUser.value = {
        id: userContext.userId,
        username: userContext.username,
        avatar: userContext.avatar ||getUserAvatarUrl() ,
        email: '',
        phone: phone,
        bio: '',
        website: '',
        location: '',
        title: '',
        showEmail: false,
        reputation: 0,
        postCount: 0,
        commentCount: 0,
        isAdmin: userContext.isAdmin || false,
        isModerator: userContext.isModerator || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
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
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.AUTH_FAILED
      ErrorHandler.showError(errorInfo)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 邮箱验证码登录
   * @param email 邮箱地址
   * @param code 验证码
   * @param remember 是否记住登录状态
   * @returns Promise<boolean> 登录是否成功
   */
  async function loginWithEmail(email: string, code: string, remember: boolean = false): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const response: LoginResponse = await authApi.login('EMAIL', email, code, remember)

      // 后端返回格式: { token, userContext }
      const { token: authToken, userContext } = response

      token.value = authToken
      // 根据API文档，登录时只返回基本的userContext信息
      // 需要调用getCurrentUser获取完整用户信息
      currentUser.value = {
        id: userContext.userId,
        username: userContext.username,
        avatar: userContext.avatar || getUserAvatarUrl(),
        email: email,
        bio: '',
        website: '',
        location: '',
        title: '',
        showEmail: false,
        reputation: 0,
        postCount: 0,
        commentCount: 0,
        isAdmin: userContext.isAdmin || false,
        isModerator: userContext.isModerator || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
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
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.AUTH_FAILED
      ErrorHandler.showError(errorInfo)
      return false
    } finally {
      loading.value = false
    }
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
      const apiUser = await userApi.getCurrentUser()
      const user = mapApiUserToUser(apiUser)
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
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.FETCH_USER_FAILED
      ErrorHandler.showError(errorInfo)
      return null
    } finally {
      loading.value = false
    }
  }

  // 设置用户信息（用于外部更新）
  function setUser(user: any) {
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
  }

  // 更新用户资料
  async function updateProfile(data: any) {
    loading.value = true
    error.value = null

    try {
      const user = await userApi.updateProfile(data)
      setUser(user) // 使用setUser方法

      return user
    } catch (e: any) {
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.VALIDATION_FAILED
      ErrorHandler.showError(errorInfo)
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
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.NETWORK_ERROR
      ErrorHandler.showError(errorInfo)
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

  // 获取用户资料
  async function fetchUserProfile(userId: string) {
    loading.value = true
    error.value = null

    try {
      const apiUser = await userApi.getUserById(userId)
      const user = mapApiUserToUser(apiUser)
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
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.FETCH_USER_FAILED
      ErrorHandler.showError(errorInfo)
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
    logout,
    fetchCurrentUser,
    setUser,
    updateProfile,
    sendVerificationCode,
    validateTokenAndFetchUser,
    fetchUserProfile
  }
})