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
  getUserById: (id: string | number) => get(`/users/id/${id}`),

  // 更新用户资料
  updateProfile: (data: any) => put('/users/profile', data),

  // 获取活跃用户列表 
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

// 帖子管理API - 新增接口
export const postManagementApi = {
  // 创建帖子
  createPost: (data: any) => post('/content/posts', data),

  // 编辑帖子
  updatePost: (id: string | number, data: any) => put(`/content/posts/${id}`, data),

  // 删除帖子
  deletePost: (id: string | number) => del(`/content/posts/${id}`),

  // 点赞/取消点赞帖子
  toggleLike: (id: string | number) => post(`/content/posts/${id}/like`),

  // 收藏/取消收藏帖子
  toggleBookmark: (id: string | number) => post(`/content/posts/${id}/bookmark`),

  // 保存草稿
  saveDraft: (data: any) => post('/content/posts/draft', data),

  // 获取用户草稿列表
  getDrafts: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) => get('/content/posts/drafts', { page, size }),
}

// 评论API - 新增接口
export const commentApi = {
  // 获取帖子评论列表
  getPostComments: (postId: string | number, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, sort = 'newest') =>
    get(`/content/posts/${postId}/comments`, { page, size, sort }),

  // 创建评论
  createComment: (data: any) => post('/content/comments', data),

  // 编辑评论
  updateComment: (id: string | number, data: any) => put(`/content/comments/${id}`, data),

  // 删除评论
  deleteComment: (id: string | number) => del(`/content/comments/${id}`),

  // 点赞/取消点赞评论
  toggleCommentLike: (id: string | number) => post(`/content/comments/${id}/like`),

  // 设置最佳答案
  setSolution: (postId: string | number, commentId: string | number) =>
    post(`/content/posts/${postId}/solution/${commentId}`),
}

// 搜索API - 新增接口
export const searchApi = {
  // 全文搜索
  search: (query: string, type = 'all', page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, sort = 'relevance') =>
    get('/content/search', { q: query, type, page, size, sort }),

  // 按分类搜索
  searchByCategory: (categoryId: string | number, query: string, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) =>
    get(`/content/search/category/${categoryId}`, { q: query, page, size }),

  // 按标签搜索
  searchByTag: (tagId: string | number, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) =>
    get(`/content/search/tag/${tagId}`, { page, size }),

  // 搜索建议
  getSuggestions: (query: string, limit = 10) =>
    get('/content/search/suggestions', { q: query, limit }),

  // 热门搜索
  getTrending: (limit = 10) =>
    get('/content/search/trending', { limit }),
}



// 通知API - 新增接口
export const notificationApi = {
  // 获取通知列表
  getNotifications: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, type = 'all', read = 'all') =>
    get('/notifications', { page, size, type, read }),

  // 获取未读通知数量
  getUnreadCount: () => get('/notifications/unread-count'),

  // 标记通知为已读
  markAsRead: (id: string | number) => put(`/notifications/${id}/read`),

  // 批量标记为已读
  batchMarkAsRead: (notificationIds: number[]) => put('/notifications/batch-read', { notificationIds }),

  // 标记所有通知为已读
  markAllAsRead: () => put('/notifications/read-all'),

  // 删除通知
  deleteNotification: (id: string | number) => del(`/notifications/${id}`),

  // 获取通知设置
  getSettings: () => get('/notifications/settings'),

  // 更新通知设置
  updateSettings: (data: any) => put('/notifications/settings', data),
}

// 用户交互API - 新增接口
export const userInteractionApi = {
  // 关注/取消关注用户
  toggleFollow: (id: string | number) => post(`/users/${id}/follow`),

  // 获取关注列表
  getFollowing: (id: string | number, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) =>
    get(`/users/${id}/following`, { page, size }),

  // 获取粉丝列表
  getFollowers: (id: string | number, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) =>
    get(`/users/${id}/followers`, { page, size }),

  // 获取用户收藏列表
  getBookmarks: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, type = 'all') =>
    get('/users/bookmarks', { page, size, type }),

  // 移除收藏
  removeBookmark: (id: string | number) => del(`/users/bookmarks/${id}`),

  // 获取用户点赞记录
  getLikes: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, type = 'all') =>
    get('/users/likes', { page, size, type }),

  // 获取用户统计信息
  //getUserStats: (id: string | number) => get(`/users/${id}/stats`),
}

// 标签API - 新增接口
export const tagApi = {
  // 获取所有标签
  getTags: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, sort = 'postCount') =>
    get('/content/tags', { page, size, sort }),

  // 获取热门标签
  getPopularTags: (limit = 20) => get('/content/tags/popular', { limit }),

  // 获取指定标签
  getTagById: (id: string | number) => get(`/content/tags/${id}`),

  // 创建标签
  createTag: (data: any) => post('/content/tags', data),

  // 更新标签
  updateTag: (id: string | number, data: any) => put(`/content/tags/${id}`, data),

  // 删除标签
  deleteTag: (id: string | number) => del(`/content/tags/${id}`),

  // 搜索标签
  searchTags: (query: string, limit = 10) => get('/content/tags/search', { q: query, limit }),

  // 获取标签下的帖子
  getTagPosts: (id: string | number, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, sort = 'newest') =>
    get(`/content/tags/${id}/posts`, { page, size, sort }),
}

// 文件上传API - 新增接口
export const fileApi = {
  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return post('/files/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // 上传帖子图片
  uploadPostImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return post('/files/post-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // 上传封面图片
  uploadCoverImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return post('/files/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // 批量上传图片
  uploadImages: (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return post('/files/images/batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // 获取用户文件列表
  getUserFiles: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, type = 'all') =>
    get('/files/user', { page, size, type }),

  // 删除文件
  deleteFile: (id: string | number) => del(`/files/${id}`),

  // 获取文件信息
  getFileInfo: (id: string | number) => get(`/files/${id}/info`),

  // 获取上传配置
  getUploadConfig: () => get('/files/config'),
}

// 设置API - 新增接口
export const settingsApi = {
  // 获取用户设置
  getUserSettings: () => get('/users/settings'),

  // 更新用户设置
  updateUserSettings: (data: any) => put('/users/settings', data),

  // 重置设置为默认值
  resetSettings: (sections: string[]) => post('/users/settings/reset', { sections }),

  // 获取系统配置
  getSystemConfig: () => get('/system/config'),

  // 更新系统配置
  updateSystemConfig: (data: any) => put('/system/config', data),

  // 修改密码
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    put('/users/password', { currentPassword, newPassword, confirmPassword }),

  // 绑定/解绑手机号
  updatePhone: (phone: string, code: string, action: 'bind' | 'unbind') =>
    put('/users/phone', { phone, code, action }),

  // 绑定/解绑邮箱
  updateEmail: (email: string, code: string, action: 'bind' | 'unbind') =>
    put('/users/email', { email, code, action }),

  // 获取登录记录
  getLoginHistory: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) =>
    get('/users/login-history', { page, size }),
}

// 管理员API - 新增接口
export const adminApi = {
  // 管理员获取所有帖子
  getAllPosts: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, status = 'all', categoryId?: number, userId?: number) =>
    get('/admin/posts', { page, size, status, categoryId, userId }),

  // 批量操作帖子
  batchOperatePosts: (postIds: number[], action: string, reason?: string) =>
    post('/admin/posts/batch', { postIds, action, reason }),

  // 获取举报列表
  getReports: (page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, type = 'all', status = 'pending') =>
    get('/admin/reports', { page, size, type, status }),

  // 处理举报
  handleReport: (id: string | number, status: string, action: string, note?: string) =>
    put(`/admin/reports/${id}`, { status, action, note }),
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
  postManagementApi,
  commentApi,
  searchApi,
  notificationApi,
  userInteractionApi,
  tagApi,
  fileApi,
  settingsApi,
  adminApi,
}