// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  avatar: string
  bio: string
  created_at: string
  updated_at: string
  reputation: number
  post_count: number
  comment_count: number
  is_admin: boolean
  is_moderator: boolean
  last_active_at: string
  website?: string
  location?: string
  show_email?: boolean
  title?: string
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

// 帖子相关类型
export interface Post {
  id: number
  title: string
  content: string
  user_id: number
  user: User
  category_id: number
  category: Category
  created_at: string
  updated_at: string
  view_count: number
  like_count: number
  comment_count: number
  is_pinned: boolean
  is_featured: boolean
  tags: Tag[]
  is_solved: boolean
  solution_comment_id: number | null
}

// 评论相关类型
export interface Comment {
  id: number
  content: string
  user_id: number
  user: User
  post_id: number
  parent_id: number | null
  created_at: string
  updated_at: string
  like_count: number
  is_solution: boolean
  replies?: Comment[]
}

// 分类相关类型
export interface Category {
  id: number
  name: string
  description: string
  icon: string
  slug: string
  post_count: number
  parent_id: number | null
  children?: Category[]
  created_at: string
  updated_at: string
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

// 通知相关类型
export interface Notification {
  id: number
  user_id: number
  type: string
  data: any
  read_at: string | null
  created_at: string
  updated_at: string
}

// 分页相关类型
export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// 分页响应结构
export interface PaginatedResponse<T> {
  data: T[]
  meta: Pagination
}

// API响应基本结构
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

// 登录请求参数
export interface LoginRequest {
  email?: string
  phone?: string
  code: string
  remember_me?: boolean
}

// 创建帖子请求参数
export interface CreatePostRequest {
  title: string
  content: string
  category_id: number
  tags?: number[]
}

// 创建评论请求参数
export interface CreateCommentRequest {
  content: string
  post_id: number
  parent_id?: number
}

// 用户设置请求参数
export interface UpdateUserSettingsRequest {
  username?: string
  email?: string
  bio?: string
  avatar?: File | null
  current_password?: string
  new_password?: string
  new_password_confirmation?: string
}

// 搜索请求参数
export interface SearchRequest {
  query: string
  category_id?: number
  tag_id?: number
  sort_by?: 'latest' | 'oldest' | 'most_liked' | 'most_commented'
  user_id?: number
  page?: number
  per_page?: number
} 