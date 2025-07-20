// 用户相关类型 - 根据SQL表和API文档精确定义
export interface User {
  // 基础字段 - 与API文档完全一致
  id: number
  username: string
  email: string
  phone?: string
  avatar: string
  bio?: string
  website?: string
  location?: string
  title?: string
  showEmail: boolean
  reputation: number
  postCount: number
  commentCount: number
  isAdmin: boolean
  isModerator: boolean

  // SQL表中存在但API可能不返回的字段
  moderatedCategory?: number
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
  lastActiveAt?: string
  rememberToken?: string
  deleted?: boolean
  createdAt?: string
  updatedAt?: string

  // 兼容旧字段名（向后兼容，逐步移除）
  created_at?: string
  updated_at?: string
  last_active_at?: string
  post_count?: number
  comment_count?: number
  is_admin?: boolean
  is_moderator?: boolean
  show_email?: boolean

  // 扩展字段（前端使用）
  cover_image?: string
  skills?: UserSkill[]
  social_links?: SocialLink[]
}

// 用户技能类型
export interface UserSkill {
  name: string
  level: number
}

// 社交媒体链接类型
export interface SocialLink {
  name: string
  icon: string
  url: string
}

// 帖子相关类型 - 根据SQL表和API文档精确定义
export interface Post {
  // 基础字段 - 与API文档完全一致
  id: number
  title: string
  content: string
  userId: number
  categoryId: number
  viewCount: number
  likeCount: number
  commentCount: number
  isPinned: boolean
  isFeatured: boolean
  isSolved: boolean
  isRecommended: boolean
  solutionCommentId: number | null

  // SQL表中存在但API可能不返回的字段
  deleted?: boolean
  createdAt?: string
  updatedAt?: string

  // 关联对象（前端扩展，可能通过JOIN查询获得）
  user?: User
  category?: Category
  tags?: Tag[]

  // 前端状态字段
  is_liked?: boolean
  is_bookmarked?: boolean

  // 兼容旧字段名（向后兼容，逐步移除）
  created_at?: string
  updated_at?: string
  user_id?: number
  category_id?: number
  view_count?: number
  like_count?: number
  comment_count?: number
  is_pinned?: boolean
  is_featured?: boolean
  is_solved?: boolean
  solution_comment_id?: number | null
}

// 分类相关类型 - 根据SQL表和API文档精确定义
export interface Category {
  // 基础字段 - 与API文档完全一致
  id: number
  name: string
  description?: string
  icon?: string
  parent: Category | null
  postCount: number
  displayOrder: number

  // SQL表中存在但API可能不返回的字段
  deleted?: boolean
  createdAt?: string
  updatedAt?: string

  // 前端扩展字段
  children?: Category[]
  slug?: string

  // 兼容旧字段名（向后兼容，逐步移除）
  created_at?: string
  updated_at?: string
  post_count?: number
  parent_id?: number | null
}

// 评论相关类型
export interface Comment {
  id: number
  content: string
  userId: number
  postId: number
  parentId?: number
  likeCount: number
  replyCount: number
  isLiked?: boolean
  deleted?: boolean
  createdAt?: string
  updatedAt?: string

  // 关联对象
  user?: User
  post?: Post
  replies?: Comment[]

  // 兼容旧字段名
  created_at?: string
  updated_at?: string
  user_id?: number
  post_id?: number
  parent_id?: number
  like_count?: number
  reply_count?: number
  is_liked?: boolean
}

// 标签相关类型
export interface Tag {
  id: number
  name: string
  description: string
  slug: string
  post_count: number
  created_at: string
  updated_at: string
}

// 分页响应结构 - 根据API文档定义
export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}