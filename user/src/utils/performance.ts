/**
 * 性能监控工具
 * 提供页面性能监控、组件渲染性能分析等功能
 */

/**
 * 性能指标接口
 */
interface PerformanceMetrics {
  /** 首次内容绘制时间 */
  fcp?: number
  /** 最大内容绘制时间 */
  lcp?: number
  /** 首次输入延迟 */
  fid?: number
  /** 累积布局偏移 */
  cls?: number
  /** 首次字节时间 */
  ttfb?: number
  /** 页面加载完成时间 */
  loadTime?: number
  /** DOM内容加载完成时间 */
  domContentLoaded?: number
}

/**
 * 组件性能数据接口
 */
interface ComponentPerformance {
  name: string
  mountTime: number
  updateTime: number
  renderCount: number
}

/**
 * 性能监控类
 */
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private componentMetrics = new Map<string, ComponentPerformance>()
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initObservers()
    this.measurePageLoad()
  }

  /**
   * 初始化性能观察器
   */
  private initObservers() {
    // 监控 LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          this.metrics.lcp = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // 监控 FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)
      } catch (e) {
        console.warn('FID observer not supported')
      }

      // 监控 CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
              this.metrics.cls = clsValue
            }
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (e) {
        console.warn('CLS observer not supported')
      }
    }
  }

  /**
   * 测量页面加载性能
   */
  private measurePageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          this.metrics.ttfb = navigation.responseStart - navigation.requestStart
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
          this.metrics.loadTime = navigation.loadEventEnd - navigation.navigationStart
        }

        // 获取 FCP
        const paintEntries = performance.getEntriesByType('paint')
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime
        }

        this.reportMetrics()
      }, 0)
    })
  }

  /**
   * 开始组件性能测量
   */
  startComponentMeasure(componentName: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      const existing = this.componentMetrics.get(componentName)
      if (existing) {
        existing.renderCount++
        existing.updateTime = duration
      } else {
        this.componentMetrics.set(componentName, {
          name: componentName,
          mountTime: duration,
          updateTime: 0,
          renderCount: 1
        })
      }
    }
  }

  /**
   * 测量函数执行时间
   */
  measureFunction<T extends (...args: any[]) => any>(
    fn: T,
    name?: string
  ): T {
    return ((...args: any[]) => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      
      console.log(`Function ${name || fn.name} took ${end - start} milliseconds`)
      
      return result
    }) as T
  }

  /**
   * 测量异步函数执行时间
   */
  async measureAsyncFunction<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    name?: string
  ): Promise<ReturnType<T>> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    console.log(`Async function ${name || fn.name} took ${end - start} milliseconds`)
    
    return result
  }

  /**
   * 获取当前性能指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * 获取组件性能数据
   */
  getComponentMetrics(): ComponentPerformance[] {
    return Array.from(this.componentMetrics.values())
  }

  /**
   * 报告性能指标
   */
  private reportMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics')
      console.table(this.metrics)
      console.groupEnd()
    }

    // 在生产环境中，可以将数据发送到分析服务
    // this.sendToAnalytics(this.metrics)
  }

  /**
   * 清理观察器
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

/**
 * 创建性能监控实例
 */
export const performanceMonitor = new PerformanceMonitor()

/**
 * Vue组件性能监控装饰器
 */
export function withPerformanceMonitoring(componentName: string) {
  return function(target: any) {
    const originalMounted = target.mounted
    const originalUpdated = target.updated

    target.mounted = function(...args: any[]) {
      const endMeasure = performanceMonitor.startComponentMeasure(componentName)
      
      if (originalMounted) {
        originalMounted.apply(this, args)
      }
      
      endMeasure()
    }

    target.updated = function(...args: any[]) {
      const endMeasure = performanceMonitor.startComponentMeasure(componentName)
      
      if (originalUpdated) {
        originalUpdated.apply(this, args)
      }
      
      endMeasure()
    }

    return target
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): T {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: any[]) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }) as T
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}

/**
 * 内存使用监控
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
    }
  }
  return null
}

/**
 * 导出类型
 */
export type { PerformanceMetrics, ComponentPerformance }
