/**
 * 系统配置服务
 * 用于管理系统设置和配置项
 */
import store from '@/store'

// 默认配置
const defaultConfig = {
  // 系统信息
  system: {
    name: '企业管理平台',
    email: 'admin@example.com',
    version: 'v1.0.0',
    description: '这是一个企业级管理系统，提供完善的权限管理和业务功能。',
    copyright: '© 2024 企业管理平台 版权所有'
  },
  
  // 界面设置
  ui: {
    fixedHeader: true,
    sidebarLogo: true,
    tagsView: true
  },
  
  // 通知设置
  notification: {
    systemNotify: true,
    emailNotify: false,
    smsNotify: false,
    loginAlert: true,
    operationNotify: true,
    announcement: true
  },
  
  // 安全设置
  security: {
    minPasswordLength: 8,
    passwordComplexity: ['number', 'lowercase'],
    passwordExpireDays: 90,
    loginLockEnabled: true,
    maxLoginAttempts: 5,
    lockDuration: 30
  }
}

const CONFIG_KEY = 'system_config'

/**
 * 获取所有配置
 * @returns {Object} 系统配置
 */
export function getConfig() {
  try {
    const savedConfig = JSON.parse(localStorage.getItem(CONFIG_KEY))
    return savedConfig ? mergeConfig(defaultConfig, savedConfig) : { ...defaultConfig }
  } catch (error) {
    console.error('读取配置失败:', error)
    return { ...defaultConfig }
  }
}

/**
 * 获取指定模块的配置
 * @param {string} module 模块名称
 * @returns {Object} 模块配置
 */
export function getModuleConfig(module) {
  const config = getConfig()
  return config[module] || {}
}

/**
 * 保存配置
 * @param {Object} config 要保存的配置
 */
export function saveConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    return true
  } catch (error) {
    console.error('保存配置失败:', error)
    return false
  }
}

/**
 * 保存模块配置
 * @param {string} module 模块名称
 * @param {Object} moduleConfig 模块配置
 */
export function saveModuleConfig(module, moduleConfig) {
  const config = getConfig()
  config[module] = { ...config[module], ...moduleConfig }
  
  // 如果是UI配置，同步到Vuex
  if (module === 'ui') {
    syncUiConfigToVuex(moduleConfig)
  }
  
  return saveConfig(config)
}

/**
 * 重置所有配置
 */
export function resetConfig() {
  return saveConfig({ ...defaultConfig })
}

/**
 * 重置模块配置
 * @param {string} module 模块名称
 */
export function resetModuleConfig(module) {
  if (!defaultConfig[module]) return false
  
  const config = getConfig()
  config[module] = { ...defaultConfig[module] }
  
  // 如果是UI配置，同步到Vuex
  if (module === 'ui') {
    syncUiConfigToVuex(defaultConfig[module])
  }
  
  return saveConfig(config)
}

/**
 * 合并配置
 * @param {Object} defaultConfig 默认配置
 * @param {Object} savedConfig 已保存的配置
 * @returns {Object} 合并后的配置
 */
function mergeConfig(defaultConfig, savedConfig) {
  const result = { ...defaultConfig }
  
  Object.keys(savedConfig).forEach(module => {
    if (defaultConfig[module]) {
      result[module] = { ...defaultConfig[module], ...savedConfig[module] }
    } else {
      result[module] = { ...savedConfig[module] }
    }
  })
  
  return result
}

/**
 * 同步UI配置到Vuex
 * @param {Object} uiConfig UI配置
 */
function syncUiConfigToVuex(uiConfig) {
  if (uiConfig.fixedHeader !== undefined) {
    store.dispatch('settings/changeSetting', {
      key: 'fixedHeader',
      value: uiConfig.fixedHeader
    })
  }
  
  if (uiConfig.sidebarLogo !== undefined) {
    store.dispatch('settings/changeSetting', {
      key: 'sidebarLogo',
      value: uiConfig.sidebarLogo
    })
  }
}

export default {
  getConfig,
  getModuleConfig,
  saveConfig,
  saveModuleConfig,
  resetConfig,
  resetModuleConfig
} 