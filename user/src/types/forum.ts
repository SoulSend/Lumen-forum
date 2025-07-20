/**
 * 用户信息接口
 * 定义了用户的完整信息结构，包含基本信息、统计数据、权限信息等
 */
export interface User {
  /** 用户唯一标识符 */
  id: number
  /** 用户名，用于显示和登录 */
  username: string
  /** 邮箱地址，用于登录和通知 */
  email: string
  /** 手机号码，用于登录和验证 */
  phone?: string
  /** 用户头像URL地址 */
  avatar: string
  /** 个人简介或自我介绍 */
  bio?: string
  /** 个人网站或博客地址 */
  website?: string
  /** 所在地理位置 */
  location?: string
  /** 用户头衔或职称 */
  title?: string
  /** 是否公开显示邮箱地址 */
  showEmail: boolean
  /** 用户声望值，基于社区贡献计算 */
  reputation: number
  /** 用户发布的帖子总数 */
  postCount: number
  /** 用户发表的评论总数 */
  commentCount: number
  /** 是否为系统管理员 */
  isAdmin: boolean
  /** 是否为版主 */
  isModerator: boolean

  // 时间相关字段
  /** 账户创建时间 */
  createdAt?: string
  /** 最后更新时间 */
  updatedAt?: string
  /** 最后活跃时间 */
  lastActiveAt?: string
  /** 邮箱验证时间 */
  emailVerifiedAt?: string
  /** 手机验证时间 */
  phoneVerifiedAt?: string

  // 管理相关字段
  /** 版主管理的分类ID */
  moderatedCategory?: number
  /** 是否已被删除（软删除标记） */
  deleted?: boolean
  /** 记住登录状态的令牌 */
  rememberToken?: string

  // 前端扩展字段
  /** 个人主页封面图片URL */
  coverImage?: string
  /** 用户技能列表 */
  skills?: UserSkill[]
  /** 社交媒体链接列表 */
  socialLinks?: SocialLink[]
}

/**
 * 用户技能信息
 * 用于展示用户的专业技能和熟练程度
 */
export interface UserSkill {
  /** 技能名称，如"JavaScript"、"设计"等 */
  name: string
  /** 技能等级，1-5级，5为最高级 */
  level: number
}

/**
 * 社交媒体链接
 * 用于展示用户的社交媒体账号
 */
export interface SocialLink {
  /** 社交平台名称，如"微博"、"GitHub"等 */
  name: string
  /** 平台图标名称或CSS类名 */
  icon: string
  /** 社交媒体链接地址 */
  url: string
}

/**
 * 帖子信息接口
 * 定义了帖子的完整信息结构，包含内容、统计、状态等信息
 */
export interface Post {
  /** 帖子唯一标识符 */
  id: number
  /** 帖子标题 */
  title: string
  /** 帖子内容（支持富文本） */
  content: string
  /** 发布者用户ID */
  userId: number
  /** 所属分类ID */
  categoryId: number

  // 统计相关字段
  /** 浏览次数 */
  viewCount: number
  /** 点赞数量 */
  likeCount: number
  /** 评论数量 */
  commentCount: number

  // 状态相关字段
  /** 是否置顶显示 */
  isPinned: boolean
  /** 是否为精华帖子 */
  isFeatured: boolean
  /** 是否已解决（问答类帖子） */
  isSolved: boolean
  /** 是否为推荐帖子 */
  isRecommended: boolean
  /** 是否已被删除（软删除标记） */
  deleted?: boolean

  /** 最佳答案评论ID（问答类帖子） */
  solutionCommentId?: number | null

  // 时间相关字段
  /** 创建时间 */
  createdAt?: string
  /** 最后更新时间 */
  updatedAt?: string

  // 关联对象（通过JOIN查询或前端组装）
  /** 发布者用户信息 */
  user?: User
  /** 所属分类信息 */
  category?: Category
  /** 关联的标签列表 */
  tags?: Tag[]

  // 用户交互状态（前端状态）
  /** 当前用户是否已点赞 */
  isLiked?: boolean
  /** 当前用户是否已收藏 */
  isBookmarked?: boolean
}

/**
 * 分类信息接口
 * 定义了论坛分类的结构，支持层级分类
 */
export interface Category {
  /** 分类唯一标识符 */
  id: number
  /** 分类名称 */
  name: string
  /** 分类描述 */
  description?: string
  /** 分类图标名称或CSS类名 */
  icon?: string
  /** 父分类信息，顶级分类为null */
  parent: Category | null
  /** 该分类下的帖子数量 */
  postCount: number
  /** 显示顺序，用于排序 */
  displayOrder: number

  /** 是否已被删除（软删除标记） */
  deleted?: boolean
  /** 创建时间 */
  createdAt?: string
  /** 最后更新时间 */
  updatedAt?: string

  // 前端扩展字段
  /** 子分类列表 */
  children?: Category[]
  /** URL友好的分类标识符 */
  slug?: string
}

/**
 * 评论信息接口
 * 定义了评论的结构，支持多级回复
 */
export interface Comment {
  /** 评论唯一标识符 */
  id: number
  /** 评论内容 */
  content: string
  /** 评论者用户ID */
  userId: number
  /** 所属帖子ID */
  postId: number
  /** 父评论ID，顶级评论为undefined */
  parentId?: number
  /** 点赞数量 */
  likeCount: number
  /** 回复数量 */
  replyCount: number
  /** 当前用户是否已点赞 */
  isLiked?: boolean
  /** 是否已被删除（软删除标记） */
  deleted?: boolean
  /** 创建时间 */
  createdAt?: string
  /** 最后更新时间 */
  updatedAt?: string

  // 关联对象
  /** 评论者用户信息 */
  user?: User
  /** 所属帖子信息 */
  post?: Post
  /** 子回复列表 */
  replies?: Comment[]
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
export interface ForumNotification {
  id: number
  user_id: number
  type: string
  title?: string
  content?: string
  data: any
  read_at: string | null
  created_at: string
  updated_at: string
}

/**
 * 分页响应结构
 * 定义了API返回的分页数据格式
 */
export interface PaginatedResponse<T> {
  /** 当前页的数据内容 */
  content: T[]
  /** 分页信息 */
  pageable: {
    /** 当前页码（从0开始） */
    pageNumber: number
    /** 每页大小 */
    pageSize: number
  }
  /** 总元素数量 */
  totalElements: number
  /** 总页数 */
  totalPages: number
  /** 是否为第一页 */
  first: boolean
  /** 是否为最后一页 */
  last: boolean
}

/**
 * API用户响应类型
 * 定义了后端API返回的用户数据结构
 */
export interface ApiUserResponse {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  website?: string
  location?: string
  title?: string
  showEmail?: boolean
  reputation?: number
  postCount?: number
  commentCount?: number
  isAdmin?: boolean
  isModerator?: boolean
  moderatedCategory?: number
  emailVerifiedAt?: string
  phoneVerifiedAt?: string
  lastActiveAt?: string
  rememberToken?: string
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
  coverImage?: string
  cover_image?: string
  skills?: UserSkill[]
  socialLinks?: SocialLink[]
  social_links?: SocialLink[]
}

/**
 * 登录响应类型
 * 定义了登录API返回的数据结构
 */
export interface LoginResponse {
  /** 认证令牌 */
  token: string
  /** 用户上下文信息 */
  userContext: {
    /** 用户ID */
    userId: number
    /** 用户名 */
    username: string
    /** 头像URL */
    avatar?: string
    /** 是否为管理员 */
    isAdmin?: boolean
    /** 是否为版主 */
    isModerator?: boolean
  }
}

/**
 * API错误响应类型
 * 定义了API错误返回的数据结构
 */
export interface ApiErrorResponse {
  /** 错误码 */
  code: number
  /** 错误消息 */
  message: string
  /** 详细错误信息 */
  details?: string
  /** 时间戳 */
  timestamp?: string
}