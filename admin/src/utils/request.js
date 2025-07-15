/**
 * HTTP请求工具
 * 
 * 功能说明：
 * 1. 封装axios请求
 * 2. 统一请求/响应拦截
 * 3. 统一错误处理
 * 4. Token自动注入
 * 
 * @author HRC Team
 * @version 1.1.0
 * @date 2024-05-20
 */

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import logger from '@/utils/logger'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // 请求超时时间增加到10秒
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 只在开发环境记录详细请求日志
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`发送请求: ${config.url}`, {
        method: config.method,
        url: config.url,
        params: config.params,
        data: config.data
      }, 'SYSTEM')
    }

    // 添加token到请求头
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    logger.error('请求错误', error, 'ERROR')
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 只在开发环境记录详细响应日志
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`接收响应: ${response.config.url}`, {
        url: response.config.url,
        status: response.status,
        data: res
      }, 'SYSTEM')
    }

    // 如果自定义状态码不是20000，则判断为错误
    if (res.code !== 20000) {
      logger.error('响应错误', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        data: res
      }, 'ERROR')
      
      console.error('响应错误:', res.message || '未知错误')
      
      // 50008: 非法的token; 50012: 其他客户端登录了; 50014: Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        console.error('您已被登出，请重新登录')
        
        // 可以在这里添加重定向到登录页的逻辑
        // store.dispatch('user/resetToken').then(() => {
        //   location.reload()
        // })
      }
      return Promise.reject(new Error(res.message || '未知错误'))
    } else {
      return res
    }
  },
  error => {
    logger.error('响应错误', {
      url: error.config ? error.config.url : 'unknown',
      method: error.config ? error.config.method : 'unknown',
      message: error.message,
      stack: error.stack
    }, 'ERROR')
    
    console.error('响应错误:', error.message)
    
    return Promise.reject(error)
  }
)

export default service
