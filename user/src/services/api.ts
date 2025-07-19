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
  // ✅ 已完成的API
  getPosts: (page = 0, size = 10) => get('/content/posts', { id: -1, page, size }),
  getPostById: (id: string | number) => get(`/content/posts/${id}`),
  getUserPosts: (userId: string | number, page = 0, size = 10) => get('/content/posts/user', { id: userId, page, size }),
  getCategoryPosts: (categoryId: string | number, page = 0, size = 10) => get('/content/posts/categories', { id: categoryId, page, size }),
  getHotPosts: (page = 0, size = 10) => get('/content/posts/hot', { id: -1, page, size }),
  getRecommendedPosts: (page = 0, size = 10) => get('/content/posts/recommended', { id: -1, page, size }),

  // 🚧 未完成的API - 暂时注释
  // getHotPostsSide: (page = 0, size = 5) => get('/content/posts/hot/side', { id: -1, page, size }),
  // getRecommendedPostsSide: (page = 0, size = 5) => get('/content/posts/recommended/side', { id: -1, page, size }),
  // createPost: (data: any) => post('/content/posts', data),
  // updatePost: (id: string | number, data: any) => put(`/content/posts/${id}`, data),
  // deletePost: (id: string | number) => del(`/content/posts/${id}`),
  // likePost: (id: string | number) => post(`/content/posts/${id}/like`),
  // bookmarkPost: (id: string | number) => post(`/content/posts/${id}/bookmark`),
}



// 🚧 评论API - 未完成，暂时注释
// export const commentApi = {
//   getPostComments: (postId: string | number, params = {}) => get(`/content/posts/${postId}/comments`, params),
//   createComment: (postId: string | number, data: any) => post(`/content/posts/${postId}/comments`, data),
//   updateComment: (id: string | number, data: any) => put(`/content/comments/${id}`, data),
//   deleteComment: (id: string | number) => del(`/content/comments/${id}`),
//   likeComment: (id: string | number) => post(`/content/comments/${id}/like`),
//   markAsSolution: (id: string | number) => post(`/content/comments/${id}/solution`),
// }

// 🚧 标签API - 未完成，暂时注释
// export const tagApi = {
//   getTags: (params = {}) => get('/content/tags', params),
//   searchTags: (query: string, limit = 10) => get('/content/tags/search', { query, limit }),
//   getTagPosts: (id: string | number, params = {}) => get(`/content/tags/${id}/posts`, params),
// }

// 🚧 搜索API - 未完成，暂时注释
// export const searchApi = {
//   search: (params: any) => get('/content/search', params),
//   advancedSearch: (params: any) => get('/content/search/advanced', params),
// }

// ✅ 认证API - 已完成
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

// 🚧 通知API - 未完成，暂时注释
// export const notificationApi = {
//   getNotifications: (params = {}) => get('/notifications', params),
//   markAsRead: (id: string | number) => put(`/notifications/${id}/read`),
//   markAllAsRead: () => put('/notifications/read-all'),
//   deleteNotification: (id: string | number) => del(`/notifications/${id}`),
//   getUnreadCount: () => get('/notifications/unread-count'),
// }

// 🚧 用户关系API - 未完成，暂时注释
// export const relationshipApi = {
//   followUser: (id: string | number) => post(`/users/${id}/follow`),
//   getFollowing: (id: string | number, params = {}) => get(`/users/${id}/following`, params),
//   getFollowers: (id: string | number, params = {}) => get(`/users/${id}/followers`, params),
//   getFollowStatus: (id: string | number) => get(`/users/${id}/follow-status`),
// }

// 🚧 文件上传API - 未完成，暂时注释
// export const fileApi = {
//   uploadAvatar: (file: File) => {
//     const formData = new FormData()
//     formData.append('file', file)
//     return post('/files/avatar', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//   },
//   uploadImage: (file: File, type = 'post') => {
//     const formData = new FormData()
//     formData.append('file', file)
//     formData.append('type', type)
//     return post('/files/images', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//   },
//   deleteFile: (filename: string) => del(`/files/${filename}`),
// }

// 🚧 统计API - 未完成，暂时注释
// export const statsApi = {
//   getForumStats: () => get('/stats/forum'),
//   getUserStats: (id: string | number) => get(`/stats/users/${id}`),
//   getTrendingStats: (params = {}) => get('/stats/trending', params),
// }

// 🚧 收藏API - 未完成，暂时注释
// export const bookmarkApi = {
//   getBookmarks: (params = {}) => get('/bookmarks', params),
//   checkBookmark: (postId: string | number) => get(`/bookmarks/check/${postId}`),
//   deleteBookmark: (id: string | number) => del(`/bookmarks/${id}`),
// }

export default {
  get,
  post,
  put,
  del,
  // ✅ 已完成的API
  authApi,
  categoryApi,
  userApi,
  postApi,
  // 🚧 未完成的API暂时注释
  // commentApi,
  // tagApi,
  // searchApi,
  // notificationApi,
  // relationshipApi,
  // fileApi,
  // statsApi,
  // bookmarkApi,
}