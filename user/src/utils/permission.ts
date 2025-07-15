import { useUserStore } from '../stores/userStore';

// 权限级别枚举
export enum PermissionLevel {
  GUEST = 'guest',       // 游客（未登录用户）
  USER = 'user',         // 普通注册用户
  ADVANCED_USER = 'advanced_user', // 高级用户（达到一定活跃度或声望值）
  MODERATOR = 'moderator', // 版主
  ADMIN = 'admin'        // 管理员
}

// 权限检查函数
export function checkPermission(requiredLevel: PermissionLevel): boolean {
  const userStore = useUserStore();
  
  // 如果要求的权限是游客级别，任何人都可以访问
  if (requiredLevel === PermissionLevel.GUEST) {
    return true;
  }
  
  // 如果用户未登录，则没有任何权限（除了游客权限）
  if (!userStore.isAuthenticated) {
    return false;
  }
  
  // 管理员拥有所有权限
  if (userStore.isAdmin) {
    return true;
  }
  
  // 版主拥有除了管理员之外的所有权限
  if (userStore.isModerator && requiredLevel !== PermissionLevel.ADMIN) {
    return true;
  }
  
  // 高级用户（声望值大于100）
  const isAdvancedUser = userStore.currentUser && userStore.currentUser.reputation >= 100;
  if (isAdvancedUser && requiredLevel !== PermissionLevel.ADMIN && requiredLevel !== PermissionLevel.MODERATOR) {
    return true;
  }
  
  // 普通用户只有USER权限
  return requiredLevel === PermissionLevel.USER;
}

// 资源所有者检查
export function isResourceOwner(resourceUserId: number | undefined): boolean {
  const userStore = useUserStore();
  return userStore.currentUser?.id === resourceUserId;
}

// 检查用户是否有权限编辑资源（所有者或管理员/版主）
export function canEditResource(resourceUserId: number | undefined): boolean {
  const userStore = useUserStore();
  return isResourceOwner(resourceUserId) || userStore.isAdmin || userStore.isModerator;
}

// 检查用户是否有权限删除资源
export function canDeleteResource(resourceUserId: number | undefined): boolean {
  return canEditResource(resourceUserId);
}

// 检查用户是否可以创建内容
export function canCreateContent(): boolean {
  return checkPermission(PermissionLevel.USER);
}

// 检查用户是否可以点赞/收藏
export function canLikeContent(): boolean {
  return checkPermission(PermissionLevel.USER);
}

// 检查用户是否可以评论
export function canComment(): boolean {
  return checkPermission(PermissionLevel.USER);
}

// 检查用户是否可以关注其他用户
export function canFollowUser(): boolean {
  return checkPermission(PermissionLevel.USER);
}

// 检查用户是否可以管理分类
export function canManageCategories(): boolean {
  return checkPermission(PermissionLevel.ADMIN);
}

// 检查用户是否可以置顶/加精帖子
export function canPinOrFeaturePost(): boolean {
  return checkPermission(PermissionLevel.MODERATOR);
} 