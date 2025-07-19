import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage或sessionStorage获取token并添加到请求头
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
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
      const error = new Error(message || '请求失败')
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

// 封装GET请求
export const get = <T = any>(url: string, params = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .get(url, { params, ...config })
    .then((response: AxiosResponse<T>) => response.data)
}

// 封装POST请求
export const post = <T = any>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .post(url, data, config)
    .then((response: AxiosResponse<T>) => response.data)
}

// 封装PUT请求
export const put = <T = any>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .put(url, data, config)
    .then((response: AxiosResponse<T>) => response.data)
}

// 封装DELETE请求
export const del = <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
  return apiClient
    .delete(url, config)
    .then((response: AxiosResponse<T>) => response.data)
}

// 分类API
export const categoryApi = {
  getCategories: () => get('/content/categories'),
  getCategoryById: (id: string | number) => get(`/content/categories/${id}`),
}

// 用户API
export const userApi = {
  getCurrentUser: () => get('/users/me'),
  getUserById: (id: string | number) => get(`/users/${id}`),
  updateProfile: (data: any) => put('/users/profile', data),
  getActiveUsers: (page = 0, size = 10) => get('/users/active', { id: -1, page, size }),
}

// 帖子API
export const postApi = {
  getPosts: (page = 0, size = 10) => get('/content/posts', { id: -1, page, size }),
  getPostById: (id: string | number) => get(`/content/posts/${id}`),
  getUserPosts: (userId: string | number, page = 0, size = 10) => get('/content/posts/user', { id: userId, page, size }),
  getCategoryPosts: (categoryId: string | number, page = 0, size = 10) => get('/content/posts/categories', { id: categoryId, page, size }),
  getHotPosts: (page = 0, size = 10) => get('/content/posts/hot', { id: -1, page, size }),
  getRecommendedPosts: (page = 0, size = 10) => get('/content/posts/recommended', { id: -1, page, size }),
}



// 认证API
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

// 论坛统计API（待实现）
// export const statsApi = {
//   getForumStats: () => get('/stats/forum'),
// }

export default {
  get,
  post,
  put,
  del,
  authApi,
  categoryApi,
  userApi,
  postApi,
}