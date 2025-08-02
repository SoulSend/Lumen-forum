/**
 * 数据验证和默认值工具函数
 * 用于确保对象属性的安全访问，防止undefined错误
 */

import type { User, Post, Category } from '../types/forum'
import { getUserAvatarUrl } from './assets'

/**
 * 为User对象提供安全的默认值
 */
export function safeUser(user: Partial<User> | null | undefined): User {
  if (!user) {
    return {
      id: 0,
      username: ' 小流明',
      email: '',
      avatar: getUserAvatarUrl(),
      bio: '',
      showEmail: false,
      reputation: 0,
      postCount: 0,
      commentCount: 0,
      isAdmin: false,
      isModerator: false
    }
  }

  return {
    // 必需字段
    id: user.id ?? 0,
    username: user.username ?? '未知用户',
    email: user.email ?? '',
    avatar: user.avatar ?? getUserAvatarUrl(),
    bio: user.bio ?? '',
    showEmail: user.showEmail ?? false,
    reputation: user.reputation ?? 0,
    postCount: user.postCount ?? user.post_count ?? 0,
    commentCount: user.commentCount ?? user.comment_count ?? 0,
    isAdmin: user.isAdmin ?? user.is_admin ?? false,
    isModerator: user.isModerator ?? user.is_moderator ?? false,
    
    // 可选字段
    phone: user.phone,
    website: user.website,
    location: user.location,
    title: user.title,
    moderatedCategory: user.moderatedCategory,
    emailVerifiedAt: user.emailVerifiedAt,
    phoneVerifiedAt: user.phoneVerifiedAt,
    lastActiveAt: user.lastActiveAt ?? user.last_active_at,
    rememberToken: user.rememberToken,
    deleted: user.deleted,
    createdAt: user.createdAt ?? user.created_at,
    updatedAt: user.updatedAt ?? user.updated_at,
    
    // 兼容字段
    created_at: user.created_at ?? user.createdAt,
    updated_at: user.updated_at ?? user.updatedAt,
    last_active_at: user.last_active_at ?? user.lastActiveAt,
    post_count: user.post_count ?? user.postCount,
    comment_count: user.comment_count ?? user.commentCount,
    is_admin: user.is_admin ?? user.isAdmin,
    is_moderator: user.is_moderator ?? user.isModerator,
    show_email: user.show_email ?? user.showEmail,
    
    // 扩展字段
    cover_image: user.cover_image,
    skills: user.skills ?? [],
    social_links: user.social_links ?? []
  }
}

/**
 * 为Post对象提供安全的默认值
 */
export function safePost(post: Partial<Post> | null | undefined): Post {
  if (!post) {
    return {
      id: 0,
      title: '未知标题',
      content: '',
      userId: 0,
      categoryId: 0,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      isPinned: false,
      isFeatured: false,
      isSolved: false,
      isRecommended: false,
      solutionCommentId: null
    }
  }

  return {
    // 必需字段
    id: post.id ?? 0,
    title: post.title ?? '未知标题',
    content: post.content ?? '',
    userId: post.userId ?? post.user_id ?? 0,
    categoryId: post.categoryId ?? post.category_id ?? 0,
    viewCount: post.viewCount ?? post.view_count ?? 0,
    likeCount: post.likeCount ?? post.like_count ?? 0,
    commentCount: post.commentCount ?? post.comment_count ?? 0,
    isPinned: post.isPinned ?? post.is_pinned ?? false,
    isFeatured: post.isFeatured ?? post.is_featured ?? false,
    isSolved: post.isSolved ?? post.is_solved ?? false,
    isRecommended: post.isRecommended ?? false,
    solutionCommentId: post.solutionCommentId ?? post.solution_comment_id ?? null,
    
    // 可选字段
    deleted: post.deleted,
    createdAt: post.createdAt ?? post.created_at,
    updatedAt: post.updatedAt ?? post.updated_at,
    
    // 关联对象
    user: post.user ? safeUser(post.user) : undefined,
    category: post.category ? safeCategory(post.category) : undefined,
    tags: post.tags ?? [],
    
    // 兼容字段
    created_at: post.created_at ?? post.createdAt,
    updated_at: post.updated_at ?? post.updatedAt,
    user_id: post.user_id ?? post.userId,
    category_id: post.category_id ?? post.categoryId,
    view_count: post.view_count ?? post.viewCount,
    like_count: post.like_count ?? post.likeCount,
    comment_count: post.comment_count ?? post.commentCount,
    is_pinned: post.is_pinned ?? post.isPinned,
    is_featured: post.is_featured ?? post.isFeatured,
    is_solved: post.is_solved ?? post.isSolved,
    solution_comment_id: post.solution_comment_id ?? post.solutionCommentId,
    
    // 前端状态字段
    is_liked: post.is_liked,
    is_bookmarked: post.is_bookmarked
  }
}

/**
 * 为Category对象提供安全的默认值
 */
export function safeCategory(category: Partial<Category> | null | undefined): Category {
  if (!category) {
    return {
      id: 0,
      name: '未知分类',
      description: '',
      icon: '',
      parent: null,
      postCount: 0,
      displayOrder: 0
    }
  }

  return {
    // 必需字段
    id: category.id ?? 0,
    name: category.name ?? '未知分类',
    description: category.description ?? '',
    icon: category.icon ?? '',
    parent: category.parent,
    postCount: category.postCount ?? category.post_count ?? 0,
    displayOrder: category.displayOrder ?? 0,
    
    // 可选字段
    deleted: category.deleted,
    createdAt: category.createdAt ?? category.created_at,
    updatedAt: category.updatedAt ?? category.updated_at,
    
    // 前端扩展字段
    children: category.children ?? [],
    slug: category.slug,
    
    // 兼容字段
    created_at: category.created_at ?? category.createdAt,
    updated_at: category.updated_at ?? category.updatedAt,
    post_count: category.post_count ?? category.postCount,
    parent_id: category.parent_id ?? (category.parent ? category.parent.id : null)
  }
}

/**
 * 安全获取用户显示名称
 */
export function getUserDisplayName(user: Partial<User> | null | undefined): string {
  return user?.username ?? '未知用户'
}

/**
 * 安全获取用户头像
 */
export function getUserAvatar(user: Partial<User> | null | undefined): string {
  // 使用ESM导入的统一资源管理工具
  return getUserAvatarUrl(user?.avatar)
}

/**
 * 安全获取帖子标题
 */
export function getPostTitle(post: Partial<Post> | null | undefined): string {
  return post?.title ?? '未知标题'
}

/**
 * 安全获取分类名称
 */
export function getCategoryName(category: Partial<Category> | null | undefined): string {
  return category?.name ?? '未知分类'
}

/**
 * 安全获取数字值，提供默认值
 */
export function safeNumber(value: number | undefined | null, defaultValue: number = 0): number {
  return typeof value === 'number' && !isNaN(value) ? value : defaultValue
}

/**
 * 安全获取字符串值，提供默认值
 */
export function safeString(value: string | undefined | null, defaultValue: string = ''): string {
  return typeof value === 'string' ? value : defaultValue
}

/**
 * 安全获取布尔值，提供默认值
 */
export function safeBoolean(value: boolean | undefined | null, defaultValue: boolean = false): boolean {
  return typeof value === 'boolean' ? value : defaultValue
}

/**
 * 检查对象是否有有效的ID
 */
export function hasValidId(obj: { id?: number | string } | null | undefined): boolean {
  return obj != null && obj.id != null && obj.id !== 0 && obj.id !== ''
}

/**
 * 安全获取对象ID
 */
export function safeId(obj: { id?: number | string } | null | undefined): number {
  if (!hasValidId(obj)) return 0
  const id = obj!.id!
  return typeof id === 'string' ? parseInt(id, 10) || 0 : id
}
