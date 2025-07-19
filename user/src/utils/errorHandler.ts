import { ElMessage, ElNotification } from 'element-plus'

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType
  code?: number | string
  message: string
  details?: any
}

// 错误处理器类
export class ErrorHandler {
  // 处理API错误
  static handleApiError(error: any): ErrorInfo {
    let errorInfo: ErrorInfo = {
      type: ErrorType.API,
      message: '请求失败'
    }

    if (error.response) {
      // 服务器响应了错误状态码
      const { status, data } = error.response
      errorInfo.code = status
      
      switch (status) {
        case 400:
          errorInfo.message = data?.message || '请求参数错误'
          errorInfo.type = ErrorType.VALIDATION
          break
        case 401:
          errorInfo.message = '登录已过期，请重新登录'
          errorInfo.type = ErrorType.AUTH
          break
        case 403:
          errorInfo.message = '没有权限访问此资源'
          errorInfo.type = ErrorType.AUTH
          break
        case 404:
          errorInfo.message = '请求的资源不存在'
          break
        case 429:
          errorInfo.message = '请求过于频繁，请稍后再试'
          break
        case 500:
          errorInfo.message = '服务器内部错误'
          break
        case 502:
          errorInfo.message = '网关错误'
          break
        case 503:
          errorInfo.message = '服务暂时不可用'
          break
        default:
          errorInfo.message = data?.message || `请求失败 (${status})`
      }
      
      errorInfo.details = data
    } else if (error.request) {
      // 网络错误
      errorInfo.type = ErrorType.NETWORK
      errorInfo.message = '网络连接失败，请检查网络设置'
    } else {
      // 其他错误
      errorInfo.type = ErrorType.UNKNOWN
      errorInfo.message = error.message || '未知错误'
    }

    return errorInfo
  }

  // 显示错误消息
  static showError(errorInfo: ErrorInfo, useNotification: boolean = false) {
    const { type, message } = errorInfo

    if (useNotification) {
      ElNotification({
        title: this.getErrorTitle(type),
        message,
        type: 'error',
        duration: 5000
      })
    } else {
      ElMessage({
        message,
        type: 'error',
        duration: 3000,
        showClose: true
      })
    }
  }

  // 获取错误标题
  private static getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return '网络错误'
      case ErrorType.API:
        return 'API错误'
      case ErrorType.AUTH:
        return '认证错误'
      case ErrorType.VALIDATION:
        return '验证错误'
      default:
        return '系统错误'
    }
  }

  // 处理并显示错误
  static handleAndShow(error: any, useNotification: boolean = false) {
    const errorInfo = this.handleApiError(error)
    this.showError(errorInfo, useNotification)
    return errorInfo
  }

  // 记录错误日志
  static logError(error: any, context?: string) {
    const errorInfo = this.handleApiError(error)
    
    console.group(`🚨 Error ${context ? `in ${context}` : ''}`)
    console.error('Error Info:', errorInfo)
    console.error('Original Error:', error)
    console.groupEnd()

    // 在生产环境中，这里可以发送错误到监控服务
    if (import.meta.env.PROD) {
      // 发送到错误监控服务
      // this.sendToMonitoring(errorInfo, context)
    }
  }

  // 创建用户友好的错误消息
  static createUserFriendlyMessage(error: any): string {
    const errorInfo = this.handleApiError(error)
    
    // 根据错误类型返回用户友好的消息
    switch (errorInfo.type) {
      case ErrorType.NETWORK:
        return '网络连接不稳定，请检查网络后重试'
      case ErrorType.AUTH:
        return '登录状态已过期，请重新登录'
      case ErrorType.VALIDATION:
        return errorInfo.message || '输入信息有误，请检查后重试'
      default:
        return errorInfo.message || '操作失败，请稍后重试'
    }
  }
}

// 导出便捷方法
export const handleError = ErrorHandler.handleAndShow
export const logError = ErrorHandler.logError
export const createUserFriendlyMessage = ErrorHandler.createUserFriendlyMessage
