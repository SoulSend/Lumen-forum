/**
 * 格式化工具函数
 * 统一管理所有格式化逻辑，避免重复代码
 */

import { TIME_CONSTANTS, TEXT_CONFIG } from '@/constants'

/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 后缀
 * @returns 截断后的文本
 */
export function truncateText(text: string | null | undefined, maxLength: number = TEXT_CONFIG.POST_EXCERPT_LENGTH, suffix: string = '...'): string {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}

/**
 * 格式化数字
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number | null | undefined): string {
  if (num == null || isNaN(num)) return '0'

  const safeNum = Math.abs(num)
  if (safeNum < 1000) return String(num)
  if (safeNum < 10000) return (num / 1000).toFixed(1) + 'k'
  return (num / 10000).toFixed(1) + 'w'
}

/**
 * 格式化日期为相对时间
 * @param dateString 日期字符串
 * @returns 相对时间字符串
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return '未知时间'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return '无效时间'
    }

    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // 小于1分钟
    if (diff < TIME_CONSTANTS.MINUTE) {
      return '刚刚'
    }

    // 小于1小时，显示"xx分钟前"
    if (diff < TIME_CONSTANTS.HOUR) {
      const minutes = Math.floor(diff / TIME_CONSTANTS.MINUTE)
      return `${minutes}分钟前`
    }

    // 小于24小时，显示"xx小时前"
    if (diff < TIME_CONSTANTS.DAY) {
      const hours = Math.floor(diff / TIME_CONSTANTS.HOUR)
      return `${hours}小时前`
    }

    // 小于7天，显示"xx天前"
    if (diff < TIME_CONSTANTS.WEEK) {
      const days = Math.floor(diff / TIME_CONSTANTS.DAY)
      return `${days}天前`
    }

    // 否则显示具体日期
    return formatDate(date)
  } catch (error) {
    console.warn('格式化相对时间失败:', dateString, error)
    return '时间格式错误'
  }
}

/**
 * 格式化日期为标准格式
 * @param date 日期对象或字符串
 * @returns 格式化的日期字符串
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '未知日期'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return '无效日期'
    }

    const now = new Date()

    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    // 如果是当前年份，不显示年份
    if (year === now.getFullYear()) {
      return `${month}-${day}`
    }

    return `${year}-${month}-${day}`
  } catch (error) {
    console.warn('格式化日期失败:', date, error)
    return '日期格式错误'
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化百分比
 * @param value 数值
 * @param total 总数
 * @param decimals 小数位数
 * @returns 百分比字符串
 */
export function formatPercentage(value: number, total: number, decimals: number = 1): string {
  if (total === 0) return '0%'
  const percentage = (value / total) * 100
  return percentage.toFixed(decimals) + '%'
}

/**
 * 格式化手机号（隐藏中间4位）
 * @param phone 手机号
 * @returns 格式化的手机号
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 11) return ''
  return phone.substring(0, 3) + '****' + phone.substring(7)
}

/**
 * 格式化邮箱（隐藏用户名部分）
 * @param email 邮箱
 * @returns 格式化的邮箱
 */
export function maskEmail(email: string): string {
  if (!email) return ''
  const parts = email.split('@')
  if (parts.length !== 2) return email
  
  const username = parts[0]
  const domain = parts[1]
  
  let maskedUsername = username
  if (username.length > 3) {
    maskedUsername = username.substring(0, 3) + '*'.repeat(username.length - 3)
  }
  
  return maskedUsername + '@' + domain
}
