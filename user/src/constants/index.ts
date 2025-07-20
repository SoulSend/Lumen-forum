/**
 * 项目常量配置
 * 统一管理所有硬编码的值
 */

import { config } from '@/config'

// API配置
export const API_CONFIG = {
  BASE_URL: config.api.baseURL,
  TIMEOUT: config.api.timeout,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

// 时间常量（毫秒）
export const TIME_CONSTANTS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const

// 文本截断配置
export const TEXT_CONFIG = {
  POST_EXCERPT_LENGTH: 120,
  COMMENT_PREVIEW_LENGTH: 100,
  TITLE_MAX_LENGTH: 200,
  BIO_MAX_LENGTH: 500,
} as const

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIDEBAR_SIZE: 5,
  MAX_SIZE: 50,
} as const

// 上传配置
export const UPLOAD_CONFIG = {
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_COVER_SIZE: 5 * 1024 * 1024,  // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  AVATAR_DIMENSIONS: {
    WIDTH: 200,
    HEIGHT: 200,
  },
} as const

// UI配置
export const UI_CONFIG = {
  AVATAR_SIZE: {
    SMALL: 28,
    MEDIUM: 40,
    LARGE: 80,
    XLARGE: 120,
  },
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 350,
  },
} as const

// 默认文案
export const DEFAULT_TEXTS = {
  UNKNOWN_USER: '未知用户',
  UNKNOWN_CATEGORY: '未知分类',
  UNKNOWN_TITLE: '未知标题',
  EMPTY_BIO: '这个用户很懒，还没有填写个人简介',
  LOADING: '加载中...',
  NO_DATA: '暂无数据',
} as const

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  AUTH_FAILED: '认证失败，请重新登录',
  PERMISSION_DENIED: '权限不足，无法执行此操作',
  VALIDATION_FAILED: '数据验证失败，请检查输入',
  UPLOAD_FAILED: '文件上传失败，请重试',
  FETCH_CATEGORIES_FAILED: '获取分类列表失败',
  FETCH_POSTS_FAILED: '获取帖子列表失败',
  FETCH_USER_FAILED: '获取用户信息失败',
} as const

// 分类图标映射
export const CATEGORY_ICONS = {
  '生活技巧': 'lightbulb',
  '家居装饰': 'chair',
  '美食烹饪': 'restaurant',
  '旅行探索': 'flight',
  '健康养生': 'spa',
  '职场技能': 'work',
  '学习方法': 'school',
  '科技数码': 'computer',
  '运动健身': 'fitness_center',
  '艺术创作': 'palette',
} as const

// 路由名称常量
export const ROUTE_NAMES = {
  HOME: 'home',
  POST_DETAIL: 'postDetail',
  USER_PROFILE: 'userProfile',
  CATEGORY: 'category',
  SEARCH: 'search',
  CREATE_POST: 'createPost',
  EDIT_POST: 'editPost',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
  ABOUT: 'about',
} as const
