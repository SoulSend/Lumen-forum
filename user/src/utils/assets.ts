/**
 * 统一的资源管理工具
 * 解决项目中图片路径不一致的问题
 */

import defaultAvatarImg from '@/assets/default-avatar.png'

/**
 * 获取用户头像URL
 * @param avatar 用户头像URL
 * @returns 有效的头像URL
 */
export function getUserAvatarUrl(avatar?: string | null): string {
  if (avatar && avatar.trim()) {
    return avatar
  }
  return defaultAvatarImg
}

/**
 * 获取默认头像URL
 * @returns 默认头像URL
 */
export function getDefaultAvatarUrl(): string {
  return defaultAvatarImg
}

/**
 * 检查图片URL是否有效
 * @param url 图片URL
 * @returns 是否有效
 */
export function isValidImageUrl(url?: string | null): boolean {
  return Boolean(url && url.trim() && !url.includes('/src/assets/'))
}

/**
 * 获取安全的图片URL
 * @param url 原始URL
 * @param fallback 备用URL
 * @returns 安全的图片URL
 */
export function getSafeImageUrl(url?: string | null, fallback: string = defaultAvatarImg): string {
  return isValidImageUrl(url) ? url! : fallback
}
