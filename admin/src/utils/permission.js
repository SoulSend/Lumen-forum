import store from '@/store';

/**
 * 检查当前用户是否拥有指定权限
 *
 * @param {string|string[]} requiredPerms 需要检查的权限标识，可以是单个字符串或字符串数组
 * @returns {boolean} 如果拥有权限则返回 true，否则返回 false
 */
export function hasPermission(requiredPerms) {
  // 从 Vuex store 获取当前用户的权限列表
  const userPermissions = store.getters && store.getters.permissions;

  // 如果没有权限列表，或者用户是超级管理员（拥有所有权限），则直接返回 true
  if (!userPermissions || userPermissions.includes('*:*:*')) {
    return true;
  }
  
  // 如果没有提供需要检查的权限，则默认拥有权限
  if (!requiredPerms || requiredPerms.length === 0) {
    return true;
  }

  // 将需要检查的权限统一处理为数组
  const permsToCheck = Array.isArray(requiredPerms) ? requiredPerms : [requiredPerms];

  // 检查用户权限列表是否包含所有必需的权限
  return permsToCheck.every(perm => userPermissions.includes(perm.trim()));
} 