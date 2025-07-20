/**
 * API服务模块
 * 提供与后端API交互的统一接口，包含请求拦截、响应处理、错误处理等功能
 */

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG } from '@/constants'

/**
 * 创建axios实例
 * 配置基础URL、请求头、超时时间等全局设置
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage或sessionStorage获取token并添加到请求头
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 处理后端统一响应格式 { code, message, data }
    const { code, message, data } = response.data

    if (code === 200) {
      // 成功响应，返回data部分
      return { ...response, data }
    } else {
      // 业务错误，抛出异常
      const error = new Error(message || '请求失败') as Error & { code: number }
      error.code = code
      throw error
    }
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response

      // 401错误由userStore统一处理，这里不重复处理
      // if (status === 401) {
      //   // Token过期或无效处理已移至userStore
      // }

      // 如果后端返回了错误信息，使用后端的错误信息
      if (data && data.message) {
        error.message = data.message
      }
    }

    return Promise.reject(error)
  }
)

/**
 * 封装GET请求
 * @template T 响应数据类型
 * @param url 请求URL
 * @param params 查询参数
 * @param config axios配置选项
 * @returns Promise<T> 响应数据
 */
export const get = <T = any>(url: string, params = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .get(url, { params, ...config })
    .then((response: AxiosResponse<T>) => response.data)
}

/**
 * 封装POST请求
 * @template T 响应数据类型
 * @param url 请求URL
 * @param data 请求体数据
 * @param config axios配置选项
 * @returns Promise<T> 响应数据
 */
export const post = <T = any>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .post(url, data, config)
    .then((response: AxiosResponse<T>) => response.data)
}

/**
 * 封装PUT请求
 * @template T 响应数据类型
 * @param url 请求URL
 * @param data 请求体数据
 * @param config axios配置选项
 * @returns Promise<T> 响应数据
 */
export const put = <T = any>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .put(url, data, config)
    .then((response: AxiosResponse<T>) => response.data)
}

/**
 * 封装DELETE请求
 * @template T 响应数据类型
 * @param url 请求URL
 * @param config axios配置选项
 * @returns Promise<T> 响应数据
 */
export const del = <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .delete(url, config)
    .then((response: AxiosResponse<T>) => response.data)
}

// 分类API - 根据API文档实现
export const categoryApi = {
  // 获取所有分类
  getCategories: () => get('/content/categories'),

  // 获取指定分类
  getCategoryById: (id: string | number) => get(`/content/categories/${id}`),
}

// 用户API - 根据API文档实现
export const userApi = {
  // 获取当前用户信息
  getCurrentUser: () => get('/users/me'),

  // 获取指定用户信息
  getUserById: (id: string | number) => get(`/users/${id}`),

  // 更新用户资料
  updateProfile: (data: any) => put('/users/profile', data),

  // 获取活跃用户列表 - 修正为使用查询参数
  getActiveUsers: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) => get('/users/active', { page, size }),
}

// 帖子API - 根据API文档实现
export const postApi = {
  // 获取帖子列表 (最新) - 修正为使用查询参数
  getPosts: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) => get('/content/posts', { page, size }),

  // 获取帖子详情
  getPostById: (id: string | number) => get(`/content/posts/${id}`),

  // 获取用户的帖子列表 - 修正为使用查询参数
  getUserPosts: (userId: string | number, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) =>
    get('/content/posts/user', { id: userId, page, size }),

  // 获取分类下的帖子列表 - 修正为使用查询参数
  getCategoryPosts: (categoryId: string | number, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) =>
    get('/content/posts/categories', { id: categoryId, page, size }),

  // 获取热门帖子列表 - 修正为使用查询参数
  getHotPosts: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) => get('/content/posts/hot', { page, size }),

  // 获取侧边栏热门帖子 - 修正为使用查询参数
  getHotPostsSide: (page = 0, size = 5) => get('/content/posts/hot/side', { page, size }),

  // 获取推荐帖子列表 - 修正为使用查询参数
  getRecommendedPosts: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) => get('/content/posts/recommended', { page, size }),

  // 获取轮播推荐帖子 - 修正为使用查询参数
  getRecommendedPostsSide: (page = 0, size = 5) => get('/content/posts/recommended/side', { page, size }),
}



// 认证API - 根据API文档实现
export const authApi = {
  // 发送验证码
  sendCode: (loginType: 'EMAIL' | 'SMS', identifier: string) =>
    post('/auth/login/code', { loginType, identifier }),

  // 用户登录
  login: (loginType: 'EMAIL' | 'SMS', identifier: string, code: string, rememberMe: boolean = false) =>
    post('/auth/login', { loginType, identifier, code, rememberMe }),

  // 用户登出
  logout: () => post('/auth/logout'),
}



export default {
  get,
  post,
  put,
  del,
  authApi,
  userApi,
  categoryApi,
  postApi,
}