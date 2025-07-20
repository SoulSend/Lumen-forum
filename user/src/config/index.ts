/**
 * 应用配置管理
 * 统一管理环境变量和配置项
 */

/**
 * 环境变量接口
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
}

/**
 * 应用配置接口
 */
export interface AppConfig {
  api: {
    baseURL: string
    timeout: number
  }
  app: {
    title: string
    description: string
    version: string
  }
  features: {
    enableDevTools: boolean
    enableErrorReporting: boolean
  }
  ui: {
    theme: 'light' | 'dark' | 'auto'
    language: string
  }
}

/**
 * 获取环境变量值，提供默认值
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 环境变量值
 */
function getEnvVar(key: keyof ImportMetaEnv, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue
}

/**
 * 获取布尔类型的环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 布尔值
 */
function getBooleanEnvVar(key: keyof ImportMetaEnv, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key)
  if (!value) return defaultValue
  return value.toLowerCase() === 'true'
}

/**
 * 应用配置
 */
export const config: AppConfig = {
  api: {
    baseURL: getEnvVar('VITE_API_URL', 'http://localhost:8080/api'),
    timeout: 10000,
  },
  app: {
    title: getEnvVar('VITE_APP_TITLE', 'Lumen论坛'),
    description: getEnvVar('VITE_APP_DESCRIPTION', '生活技巧分享社区'),
    version: '1.0.0',
  },
  features: {
    enableDevTools: import.meta.env.DEV,
    enableErrorReporting: import.meta.env.PROD,
  },
  ui: {
    theme: 'auto',
    language: 'zh-CN',
  },
}

/**
 * 开发环境检查
 */
export const isDev = import.meta.env.DEV

/**
 * 生产环境检查
 */
export const isProd = import.meta.env.PROD

/**
 * 获取API基础URL
 */
export const getApiBaseURL = (): string => config.api.baseURL

/**
 * 获取应用标题
 */
export const getAppTitle = (): string => config.app.title

/**
 * 获取应用描述
 */
export const getAppDescription = (): string => config.app.description

/**
 * 检查功能是否启用
 * @param feature 功能名称
 * @returns 是否启用
 */
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature]
}

/**
 * 更新配置
 * @param updates 配置更新对象
 */
export const updateConfig = (updates: Partial<AppConfig>): void => {
  Object.assign(config, updates)
}

/**
 * 获取完整配置
 */
export const getConfig = (): AppConfig => config

/**
 * 配置验证
 */
export const validateConfig = (): boolean => {
  const requiredFields = [
    config.api.baseURL,
    config.app.title,
  ]
  
  return requiredFields.every(field => field && field.trim().length > 0)
}

// 在开发环境下输出配置信息
if (isDev) {
  console.group('🔧 Application Configuration')
  console.log('API Base URL:', config.api.baseURL)
  console.log('App Title:', config.app.title)
  console.log('Environment:', import.meta.env.MODE)
  console.log('Dev Tools:', config.features.enableDevTools)
  console.groupEnd()
}

// 验证配置
if (!validateConfig()) {
  console.error('❌ Configuration validation failed!')
}
