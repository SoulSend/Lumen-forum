import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token并添加到请求头
    const token = localStorage.getItem('token')
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
    return response
  },
  (error) => {
    // 处理token过期
    if (error.response && error.response.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 跳转到登录页
      window.location.href = '/login'
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
  getCategories: () => get('/categories'),
  getCategoryById: (id: string | number) => get(`/categories/${id}`),
}

// 标签API
export const tagApi = {
  getPopularTags: (limit = 20) => get('/tags/popular', { limit }),
  searchTags: (query: string, limit = 10) => get('/tags/search', { query, limit }),
  getTagPosts: (tagName: string, page = 1, pageSize = 10) => get(`/tags/${tagName}/posts`, { page, pageSize }),
}

// 用户API
export const userApi = {
  getCurrentUser: () => get('/users/me'),
  getUserById: (id: string | number) => get(`/users/${id}`),
  getUserPosts: (id: string | number, page = 1, pageSize = 10) => get(`/users/${id}/posts`, { page, pageSize }),
  getActiveUsers: (limit = 5) => get('/users/active', { limit }),
}

// 帖子API
export const postApi = {
  getPosts: (params = {}) => get('/posts', params),
  getPostById: (id: string | number) => get(`/posts/${id}`),
  createPost: (data: any) => post('/posts', data),
  updatePost: (id: string | number, data: any) => put(`/posts/${id}`, data),
  deletePost: (id: string | number) => del(`/posts/${id}`),
  getHotTopics: (limit = 5) => get('/posts/hot', { limit }),
  getRecommendedPosts: (limit = 3) => get('/posts/recommended', { limit }),
}

// 评论API
export const commentApi = {
  getPostComments: (postId: string | number, page = 1, pageSize = 10) => get(`/posts/${postId}/comments`, { page, pageSize }),
  createComment: (postId: string | number, data: any) => post(`/posts/${postId}/comments`, data),
  updateComment: (commentId: string | number, data: any) => put(`/comments/${commentId}`, data),
  deleteComment: (commentId: string | number) => del(`/comments/${commentId}`),
}

// 通知API
export const notificationApi = {
  getNotifications: (params = {}) => get('/notifications', params),
  markAsRead: (id: string | number) => put(`/notifications/${id}/read`),
  markAllAsRead: () => put('/notifications/read-all'),
}

// 活动API
export const activityApi = {
  getRecentActivities: (limit = 3) => get('/activities/recent', { limit }),
}

// 论坛统计API
export const statsApi = {
  getForumStats: () => get('/stats/forum'),
}

export default {
  get,
  post,
  put,
  del,
  categoryApi,
  tagApi,
  userApi,
  postApi,
  commentApi,
  notificationApi,
  activityApi,
  statsApi,
} 