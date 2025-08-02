import { ElMessage } from 'element-plus'

/**
 * API状态检查工具
 * 用于检查API接口的可用性和响应状态
 */
export class ApiStatusChecker {
  private static instance: ApiStatusChecker
  private apiStatus: Map<string, boolean> = new Map()
  private lastCheck: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

  static getInstance(): ApiStatusChecker {
    if (!ApiStatusChecker.instance) {
      ApiStatusChecker.instance = new ApiStatusChecker()
    }
    return ApiStatusChecker.instance
  }

  /**
   * 检查API是否可用
   * @param apiName API名称
   * @param checkFn 检查函数
   */
  async checkApi(apiName: string, checkFn: () => Promise<any>): Promise<boolean> {
    const now = Date.now()
    const lastCheckTime = this.lastCheck.get(apiName) || 0
    
    // 如果缓存未过期，直接返回缓存结果
    if (now - lastCheckTime < this.CACHE_DURATION && this.apiStatus.has(apiName)) {
      return this.apiStatus.get(apiName)!
    }

    try {
      await checkFn()
      this.apiStatus.set(apiName, true)
      this.lastCheck.set(apiName, now)
      return true
    } catch (error) {
      console.warn(`API ${apiName} is not available:`, error)
      this.apiStatus.set(apiName, false)
      this.lastCheck.set(apiName, now)
      return false
    }
  }

  /**
   * 获取API状态
   * @param apiName API名称
   */
  getApiStatus(apiName: string): boolean | null {
    return this.apiStatus.get(apiName) || null
  }

  /**
   * 清除API状态缓存
   * @param apiName API名称，不传则清除所有
   */
  clearCache(apiName?: string) {
    if (apiName) {
      this.apiStatus.delete(apiName)
      this.lastCheck.delete(apiName)
    } else {
      this.apiStatus.clear()
      this.lastCheck.clear()
    }
  }

  /**
   * 获取所有API状态
   */
  getAllApiStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {}
    this.apiStatus.forEach((value, key) => {
      status[key] = value
    })
    return status
  }
}

/**
 * API调用包装器
 * 自动处理API不可用的情况
 */
export async function withApiCheck<T>(
  apiName: string,
  apiCall: () => Promise<T>,
  fallback?: () => T,
  options: {
    showError?: boolean
    errorMessage?: string
  } = {}
): Promise<T | null> {
  const { showError = true, errorMessage = `${apiName} 服务暂时不可用` } = options
  const checker = ApiStatusChecker.getInstance()

  try {
    const result = await apiCall()
    // API调用成功，更新状态
    checker.checkApi(apiName, apiCall)
    return result
  } catch (error) {
    console.error(`API ${apiName} failed:`, error)
    
    // 更新API状态为不可用
    checker.checkApi(apiName, apiCall)
    
    if (showError) {
      ElMessage.error(errorMessage)
    }

    // 如果有降级方案，使用降级方案
    if (fallback) {
      console.log(`Using fallback for ${apiName}`)
      return fallback()
    }

    return null
  }
}

/**
 * 批量检查API状态
 */
export async function checkMultipleApis(
  apis: Array<{ name: string; checkFn: () => Promise<any> }>
): Promise<Record<string, boolean>> {
  const checker = ApiStatusChecker.getInstance()
  const results: Record<string, boolean> = {}

  await Promise.allSettled(
    apis.map(async ({ name, checkFn }) => {
      results[name] = await checker.checkApi(name, checkFn)
    })
  )

  return results
}

/**
 * API健康检查
 */
export class ApiHealthCheck {
  private static readonly HEALTH_CHECK_INTERVAL = 30 * 1000 // 30秒
  private intervalId: number | null = null
  private healthCheckApis: Array<{ name: string; checkFn: () => Promise<any> }> = []

  /**
   * 添加需要健康检查的API
   */
  addApi(name: string, checkFn: () => Promise<any>) {
    this.healthCheckApis.push({ name, checkFn })
  }

  /**
   * 开始健康检查
   */
  start() {
    if (this.intervalId) {
      return
    }

    this.intervalId = window.setInterval(async () => {
      await checkMultipleApis(this.healthCheckApis)
    }, ApiHealthCheck.HEALTH_CHECK_INTERVAL)

    console.log('API health check started')
  }

  /**
   * 停止健康检查
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('API health check stopped')
    }
  }

  /**
   * 立即执行一次健康检查
   */
  async checkNow(): Promise<Record<string, boolean>> {
    return await checkMultipleApis(this.healthCheckApis)
  }
}

// 导出单例实例
export const apiHealthCheck = new ApiHealthCheck()
export const apiStatusChecker = ApiStatusChecker.getInstance()
