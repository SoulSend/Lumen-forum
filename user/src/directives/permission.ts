import type { ObjectDirective } from 'vue';
import { checkPermission, PermissionLevel, canEditResource, canDeleteResource, isResourceOwner } from '../utils/permission';

// 权限指令
export const vPermission: ObjectDirective = {
  mounted(el, binding) {
    const { value } = binding;
    
    let hasPermission = false;
    
    // 如果值是字符串，则视为权限级别
    if (typeof value === 'string') {
      hasPermission = checkPermission(value as PermissionLevel);
    } 
    // 如果值是对象，则处理更复杂的权限检查
    else if (typeof value === 'object') {
      if (value.type === 'edit' && value.resourceUserId !== undefined) {
        hasPermission = canEditResource(value.resourceUserId);
      } else if (value.type === 'delete' && value.resourceUserId !== undefined) {
        hasPermission = canDeleteResource(value.resourceUserId);
      } else if (value.type === 'owner' && value.resourceUserId !== undefined) {
        hasPermission = isResourceOwner(value.resourceUserId);
      } else if (value.type === 'level') {
        hasPermission = checkPermission(value.level as PermissionLevel);
      }
    }
    
    if (!hasPermission) {
      // 如果没有权限，则隐藏元素
      el.style.display = 'none';
    }
  }
};

// 导出指令集合
export const permissionDirectives = {
  'permission': vPermission
};

// 注册所有指令的函数
export function registerPermissionDirectives(app: any) {
  Object.entries(permissionDirectives).forEach(([name, directive]) => {
    app.directive(name, directive);
  });
} 