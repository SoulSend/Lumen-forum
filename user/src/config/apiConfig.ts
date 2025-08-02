/**
 * API配置文件
 * 统一管理所有API接口的配置信息
 */

// API基础配置
export const API_BASE_CONFIG = {
  // 基础URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // 超时时间
  TIMEOUT: 10000,
  
  // 重试次数
  RETRY_COUNT: 3,
  
  // 重试延迟（毫秒）
  RETRY_DELAY: 1000,
  
  // 分页默认配置
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // 文件上传配置
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  }
}

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SEND_CODE: '/auth/login/code',
    REFRESH_TOKEN: '/auth/refresh',
    CURRENT_USER: '/auth/current-user'
  },
  
  // 用户相关
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/password',
    BIND_PHONE: '/users/phone',
    BIND_EMAIL: '/users/email',
    LOGIN_HISTORY: '/users/login-history',
    SETTINGS: '/users/settings',
    STATS: (id: string | number) => `/users/${id}/stats`,
    FOLLOW: (id: string | number) => `/users/${id}/follow`,
    FOLLOWING: (id: string | number) => `/users/${id}/following`,
    FOLLOWERS: (id: string | number) => `/users/${id}/followers`,
    BOOKMARKS: '/users/bookmarks',
    LIKES: '/users/likes'
  },
  
  // 帖子相关
  POST: {
    LIST: '/content/posts',
    DETAIL: (id: string | number) => `/content/posts/${id}`,
    CREATE: '/content/posts',
    UPDATE: (id: string | number) => `/content/posts/${id}`,
    DELETE: (id: string | number) => `/content/posts/${id}`,
    LIKE: (id: string | number) => `/content/posts/${id}/like`,
    BOOKMARK: (id: string | number) => `/content/posts/${id}/bookmark`,
    DRAFT: '/content/posts/draft',
    DRAFTS: '/content/posts/drafts',
    CATEGORY_POSTS: (categoryId: string | number) => `/content/categories/${categoryId}/posts`,
    USER_POSTS: (userId: string | number) => `/users/${userId}/posts`,
    RECOMMENDED: '/content/posts/recommended',
    FEATURED: '/content/posts/featured'
  },
  
  // 评论相关
  COMMENT: {
    LIST: (postId: string | number) => `/content/posts/${postId}/comments`,
    CREATE: '/content/comments',
    UPDATE: (id: string | number) => `/content/comments/${id}`,
    DELETE: (id: string | number) => `/content/comments/${id}`,
    LIKE: (id: string | number) => `/content/comments/${id}/like`,
    SOLUTION: (postId: string | number, commentId: string | number) => 
      `/content/posts/${postId}/solution/${commentId}`
  },
  
  // 分类相关
  CATEGORY: {
    LIST: '/content/categories',
    DETAIL: (id: string | number) => `/content/categories/${id}`,
    POSTS: (id: string | number) => `/content/categories/${id}/posts`
  },
  
  // 标签相关
  TAG: {
    LIST: '/content/tags',
    POPULAR: '/content/tags/popular',
    DETAIL: (id: string | number) => `/content/tags/${id}`,
    CREATE: '/content/tags',
    UPDATE: (id: string | number) => `/content/tags/${id}`,
    DELETE: (id: string | number) => `/content/tags/${id}`,
    SEARCH: '/content/tags/search',
    POSTS: (id: string | number) => `/content/tags/${id}/posts`
  },
  
  // 搜索相关
  SEARCH: {
    GLOBAL: '/content/search',
    BY_CATEGORY: (categoryId: string | number) => `/content/search/category/${categoryId}`,
    BY_TAG: (tagId: string | number) => `/content/search/tag/${tagId}`,
    SUGGESTIONS: '/content/search/suggestions',
    TRENDING: '/content/search/trending'
  },
  
  // 通知相关
  NOTIFICATION: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id: string | number) => `/notifications/${id}/read`,
    BATCH_READ: '/notifications/batch-read',
    READ_ALL: '/notifications/read-all',
    DELETE: (id: string | number) => `/notifications/${id}`,
    SETTINGS: '/notifications/settings'
  },
  
  // 文件相关
  FILE: {
    UPLOAD_AVATAR: '/files/avatar',
    UPLOAD_POST_IMAGE: '/files/post-image',
    UPLOAD_COVER_IMAGE: '/files/cover-image',
    BATCH_UPLOAD: '/files/images/batch',
    USER_FILES: '/files/user',
    DELETE: (id: string | number) => `/files/${id}`,
    INFO: (id: string | number) => `/files/${id}/info`,
    CONFIG: '/files/config'
  },
  
  // 系统相关
  SYSTEM: {
    CONFIG: '/system/config'
  },
  
  // 管理员相关
  ADMIN: {
    POSTS: '/admin/posts',
    BATCH_POSTS: '/admin/posts/batch',
    REPORTS: '/admin/reports',
    HANDLE_REPORT: (id: string | number) => `/admin/reports/${id}`
  }
}

// HTTP状态码配置
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
}

// 错误消息配置
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后再试',
  SERVER_ERROR: '服务器错误，请稍后再试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '权限不足，无法执行此操作',
  NOT_FOUND: '请求的资源不存在',
  CONFLICT: '数据冲突，请刷新页面后重试',
  PAYLOAD_TOO_LARGE: '文件过大，请选择较小的文件',
  UNSUPPORTED_MEDIA_TYPE: '不支持的文件格式',
  TOO_MANY_REQUESTS: '请求过于频繁，请稍后再试',
  VALIDATION_ERROR: '数据验证失败，请检查输入内容',
  UNKNOWN_ERROR: '未知错误，请稍后再试'
}

// API功能开关配置
export const API_FEATURES = {
  // 是否启用API缓存
  ENABLE_CACHE: true,
  
  // 是否启用请求重试
  ENABLE_RETRY: true,
  
  // 是否启用请求日志
  ENABLE_LOGGING: import.meta.env.DEV,
  
  // 是否启用API健康检查
  ENABLE_HEALTH_CHECK: true,
  
  // 是否启用离线模式
  ENABLE_OFFLINE_MODE: false,
  
  // 是否启用模拟数据降级
  ENABLE_MOCK_FALLBACK: import.meta.env.DEV
}

// 缓存配置
export const CACHE_CONFIG = {
  // 默认缓存时间（毫秒）
  DEFAULT_TTL: 5 * 60 * 1000, // 5分钟
  
  // 不同类型数据的缓存时间
  TTL: {
    USER_PROFILE: 10 * 60 * 1000, // 10分钟
    POST_LIST: 2 * 60 * 1000,     // 2分钟
    POST_DETAIL: 5 * 60 * 1000,   // 5分钟
    CATEGORIES: 30 * 60 * 1000,   // 30分钟
    TAGS: 15 * 60 * 1000,         // 15分钟
    NOTIFICATIONS: 1 * 60 * 1000, // 1分钟
    SEARCH_RESULTS: 5 * 60 * 1000 // 5分钟
  },
  
  // 最大缓存条目数
  MAX_ENTRIES: 100
}
