/**
 * 日志管理工具
 * 
 * 功能说明：
 * 1. 统一日志记录接口
 * 2. 支持多级别日志（debug, info, warn, error）
 * 3. 支持日志分类与过滤
 * 4. 支持开发环境控制台输出与生产环境上报
 * 
 * @author HRC Team
 * @version 1.1.0
 * @date 2024-05-15
 */

import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'

// 日志级别定义
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// 日志类型定义
export const LOG_TYPES = {
  SYSTEM: 'SYSTEM',   // 系统日志
  OPERATION: 'OPERATION', // 操作日志
  ERROR: 'ERROR',     // 错误日志
  SECURITY: 'SECURITY'  // 安全日志
}

// 默认配置
const defaultConfig = {
  // 日志级别，低于此级别的日志将不会被处理
  minLevel: process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG,
  // 是否在控制台输出
  consoleOutput: process.env.NODE_ENV !== 'production',
  // 是否上报到服务器
  serverReport: process.env.NODE_ENV === 'production',
  // 服务器上报地址
  reportUrl: process.env.VUE_APP_BASE_API + '/log/report',
  // 上报批量大小
  batchSize: 10,
  // 上报间隔(ms)
  reportInterval: 10000
}

/**
 * 日志管理类
 */
class Logger {
  /**
   * 构造函数
   * @param {Object} config 配置项
   */
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config }
    this.logQueue = []
    this.timer = null
    
    // 初始化定时上报
    if (this.config.serverReport) {
      this.startReportTimer()
    }
    
    // 在页面卸载前尝试发送剩余日志
    window.addEventListener('beforeunload', () => {
      if (this.logQueue.length > 0) {
        this.flush(true)
      }
    })
  }
  
  /**
   * 记录调试日志
   * @param {String} message 日志消息
   * @param {Object} data 附加数据
   * @param {String} type 日志类型
   */
  debug(message, data = {}, type = LOG_TYPES.SYSTEM) {
    this.log(message, data, LOG_LEVELS.DEBUG, type)
  }
  
  /**
   * 记录信息日志
   * @param {String} message 日志消息
   * @param {Object} data 附加数据
   * @param {String} type 日志类型
   */
  info(message, data = {}, type = LOG_TYPES.SYSTEM) {
    this.log(message, data, LOG_LEVELS.INFO, type)
  }
  
  /**
   * 记录警告日志
   * @param {String} message 日志消息
   * @param {Object} data 附加数据
   * @param {String} type 日志类型
   */
  warn(message, data = {}, type = LOG_TYPES.SYSTEM) {
    this.log(message, data, LOG_LEVELS.WARN, type)
  }
  
  /**
   * 记录错误日志
   * @param {String|Error} message 日志消息或Error对象
   * @param {Object} data 附加数据
   * @param {String} type 日志类型
   */
  error(message, data = {}, type = LOG_TYPES.ERROR) {
    // 如果传入的是Error对象，提取错误信息
    if (message instanceof Error) {
      const errorData = {
        name: message.name,
        message: message.message,
        stack: message.stack,
        ...data
      }
      this.log(message.message, errorData, LOG_LEVELS.ERROR, type)
    } else {
      this.log(message, data, LOG_LEVELS.ERROR, type)
    }
  }
  
  /**
   * 记录用户操作日志
   * @param {String} action 操作名称
   * @param {String} result 操作结果
   * @param {Object} data 操作数据
   */
  operation(action, result = '成功', data = {}) {
    this.log(`用户操作: ${action}`, { action, result, ...data }, LOG_LEVELS.INFO, LOG_TYPES.OPERATION)
  }
  
  /**
   * 记录安全相关日志
   * @param {String} message 日志消息
   * @param {Object} data 附加数据
   */
  security(message, data = {}) {
    this.log(message, data, LOG_LEVELS.WARN, LOG_TYPES.SECURITY)
  }
  
  /**
   * 内部日志记录方法
   * @param {String} message 日志消息
   * @param {Object} data 附加数据
   * @param {Number} level 日志级别
   * @param {String} type 日志类型
   * @private
   */
  log(message, data, level, type) {
    // 检查日志级别
    if (level < this.config.minLevel) {
      return
    }
    
    // 构建日志对象
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      level,
      type,
      user: store.getters.name || 'unknown',
      url: window.location.href
    }
    
    // 只在非生产环境添加详细数据，减少日志体积
    if (process.env.NODE_ENV !== 'production') {
      logEntry.data = data
      logEntry.userAgent = navigator.userAgent
    } else if (Object.keys(data).length > 0) {
      // 生产环境只保留关键数据
      logEntry.data = data
    }
    
    // 控制台输出
    if (this.config.consoleOutput) {
      this._consoleLog(logEntry)
    }
    
    // 添加到上报队列
    if (this.config.serverReport) {
      this.logQueue.push(logEntry)
      
      // 达到批量大小时立即上报
      if (this.logQueue.length >= this.config.batchSize) {
        this.flush()
      }
    }
  }
  
  /**
   * 控制台输出日志
   * @param {Object} logEntry 日志条目
   * @private
   */
  _consoleLog(logEntry) {
    const { message, data, level, type } = logEntry
    const prefix = `[${type}]`
    
    switch (level) {
      case LOG_LEVELS.DEBUG:
        console.debug(prefix, message, data)
        break
      case LOG_LEVELS.INFO:
        console.info(prefix, message, data)
        break
      case LOG_LEVELS.WARN:
        console.warn(prefix, message, data)
        break
      case LOG_LEVELS.ERROR:
        console.error(prefix, message, data)
        break
      default:
        console.log(prefix, message, data)
    }
  }
  
  /**
   * 启动定时上报
   * @private
   */
  startReportTimer() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    
    this.timer = setInterval(() => {
      if (this.logQueue.length > 0) {
        this.flush()
      }
    }, this.config.reportInterval)
  }
  
  /**
   * 立即上报所有日志
   * @param {Boolean} sync 是否同步请求
   */
  flush(sync = false) {
    if (this.logQueue.length === 0) {
      return
    }
    
    const logs = [...this.logQueue]
    this.logQueue = []
    
    const headers = {}
    const token = getToken()
    if (token) {
      headers['X-Token'] = token
    }
    
    if (sync) {
      // 同步发送（页面卸载前）
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({ logs })], { type: 'application/json' })
        navigator.sendBeacon(this.config.reportUrl, blob)
      } else {
        // 回退到同步XHR
        const xhr = new XMLHttpRequest()
        xhr.open('POST', this.config.reportUrl, false)
        xhr.setRequestHeader('Content-Type', 'application/json')
        if (token) {
          xhr.setRequestHeader('X-Token', token)
        }
        xhr.send(JSON.stringify({ logs }))
      }
    } else {
      // 异步发送
      axios({
        url: this.config.reportUrl,
        method: 'post',
        headers,
        data: { logs }
      }).catch(err => {
        console.error('日志上报失败', err)
        // 上报失败时，只保留错误和警告级别的日志重新加入队列
        const criticalLogs = logs.filter(log => 
          log.level >= LOG_LEVELS.WARN
        )
        if (criticalLogs.length > 0) {
          this.logQueue = [...this.logQueue, ...criticalLogs]
        }
      })
    }
  }
}

// 创建默认日志实例
const logger = new Logger()

export default logger 