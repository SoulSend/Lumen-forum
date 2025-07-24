# Lumen Forum API 接口文档

## 概述

Lumen Forum 是一个基于 Spring Cloud 微服务架构的论坛系统，包含以下服务：

- **Gateway Service** (端口: 8080) - API网关，统一入口
- **Auth Service** (端口: 8101) - 认证服务
- **User Service** (端口: 8201) - 用户服务
- **Content Service** (端口: 8301) - 内容服务

## 网关路由规则

所有API请求都通过网关进行路由：

- `/api/auth/**` → auth-service
- `/api/users/**` → user-service
- `/api/content/**` → content-service

## 认证机制

- 大部分API需要在请求头中携带 `Authorization: {token}`
- 白名单接口无需认证
- Token通过登录接口获取

## 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

---

## 1. 认证服务 (Auth Service)

### 1.1 用户登录

**接口路径**: `POST /api/auth/login`

**是否需要Token**: 否 (白名单)

**请求参数**: 请求体 (JSON)

```json
{
  "loginType": "SMS|EMAIL",
  "identifier": "手机号或邮箱",
  "code": "验证码",
  "rememberMe": true
}
```

**参数说明**:
- `loginType`: 登录方式，枚举值 SMS(短信) 或 EMAIL(邮箱)
- `identifier`: 手机号或邮箱地址
- `code`: 验证码
- `rememberMe`: 是否记住登录状态

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "用户令牌",
    "userContext": {
      "userId": 1,
      "username": "用户名",
      "avatar": "头像URL",
      "isAdmin": false,
      "isModerator": false,
      "moderatedCategory": -1,
      "isSystem": false
    }
  }
}
```

### 1.2 发送验证码

**接口路径**: `POST /api/auth/login/code`

**是否需要Token**: 否 (白名单)

**请求参数**: 请求体 (JSON)

```json
{
  "loginType": "SMS|EMAIL",
  "identifier": "手机号或邮箱"
}
```

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 1.3 用户登出

**接口路径**: `POST /api/auth/logout`

**是否需要Token**: 是

**请求参数**: 请求头
- `Authorization`: 用户token

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 2. 用户服务 (User Service)

### 2.1 获取当前用户信息

**接口路径**: `GET /api/users/me`

**是否需要Token**: 是

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "用户名",
    "email": "邮箱",
    "phone": "手机号",
    "avatar": "头像URL",
    "bio": "个人简介",
    "website": "个人网站",
    "location": "所在地",
    "title": "头衔",
    "showEmail": false,
    "reputation": 0,
    "postCount": 0,
    "commentCount": 0,
    "isAdmin": false,
    "isModerator": false
  }
}
```

### 2.2 获取指定用户信息

**接口路径**: `GET /api/users/{id}`

**是否需要Token**: 否 (白名单)

**请求参数**: 路径参数
- `id`: 用户ID

**响应体**: 同上

### 2.3 更新用户资料

**接口路径**: `PUT /api/users/profile`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "username": "新用户名",
  "bio": "个人简介",
  "avatar": "头像URL"
}
```

**响应体**: 返回更新后的用户信息，格式同获取用户信息

### 2.4 获取活跃用户列表

**接口路径**: `GET /api/users/active`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "username": "用户名",
      "avatar": "头像URL",
      ...
    }
  ]
}
```

---

## 3. 内容服务 (Content Service)

### 3.1 帖子相关接口

#### 3.1.1 获取帖子列表 (最新)

**接口路径**: `GET /api/content/posts`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "帖子标题",
        "content": "帖子内容",
        "userId": 1,
        "categoryId": 1,
        "viewCount": 100,
        "likeCount": 10,
        "commentCount": 5,
        "isPinned": false,
        "isFeatured": false,
        "isSolved": false,
        "isRecommended": false,
        "solutionCommentId": null
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 100,
    "totalPages": 10,
    "first": true,
    "last": false
  }
}
```

#### 3.1.2 获取帖子详情

**接口路径**: `GET /api/content/posts/{id}`

**是否需要Token**: 否 (白名单)

**请求参数**: 路径参数
- `id`: 帖子ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "帖子标题",
    "content": "帖子内容",
    "userId": 1,
    "categoryId": 1,
    "viewCount": 100,
    "likeCount": 10,
    "commentCount": 5,
    "isPinned": false,
    "isFeatured": false,
    "isSolved": false,
    "isRecommended": false,
    "solutionCommentId": null
  }
}
```

#### 3.1.3 获取用户的帖子列表

**接口路径**: `GET /api/content/posts/user`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `id`: 用户ID
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**: 分页帖子列表，格式同3.1.1

#### 3.1.4 获取分类下的帖子列表

**接口路径**: `GET /api/content/posts/categories`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `id`: 分类ID
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**: 分页帖子列表，格式同3.1.1

#### 3.1.5 获取热门帖子列表

**接口路径**: `GET /api/content/posts/hot`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**: 分页帖子列表，格式同3.1.1

#### 3.1.6 获取侧边栏热门帖子

**接口路径**: `GET /api/content/posts/hot/side`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "帖子标题",
      "content": "帖子内容",
      ...
    }
  ]
}
```

#### 3.1.7 获取推荐帖子列表

**接口路径**: `GET /api/content/posts/recommended`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**: 分页帖子列表，格式同3.1.1

#### 3.1.8 获取轮播推荐帖子

**接口路径**: `GET /api/content/posts/recommended/side`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**: 帖子列表，格式同3.1.6

### 3.2 分类相关接口

#### 3.2.1 获取所有分类

**接口路径**: `GET /api/content/categories`

**是否需要Token**: 否 (白名单)

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "分类名称",
      "description": "分类描述",
      "icon": "分类图标",
      "parent": null,
      "postCount": 10,
      "displayOrder": 0
    }
  ]
}
```

#### 3.2.2 获取指定分类

**接口路径**: `GET /api/content/categories/{id}`

**是否需要Token**: 否 (白名单)

**请求参数**: 路径参数
- `id`: 分类ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "分类名称",
    "description": "分类描述",
    "icon": "分类图标",
    "parent": null,
    "postCount": 10,
    "displayOrder": 0
  }
}
```

#### 3.1.9 创建帖子

**接口路径**: `POST /api/content/posts`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "title": "帖子标题",
  "content": "帖子内容（支持HTML）",
  "categoryId": 1,
  "tags": [1, 2, 3],
  "coverImage": "封面图片URL（可选）",
  "allowComments": true,
  "isOriginal": true,
  "notifyFollowers": false
}
```

**参数说明**:
- `title`: 帖子标题，必填，最大200字符
- `content`: 帖子内容，必填，支持HTML格式
- `categoryId`: 分类ID，必填
- `tags`: 标签ID数组，可选
- `coverImage`: 封面图片URL，可选
- `allowComments`: 是否允许评论，默认true
- `isOriginal`: 是否原创，默认true
- `notifyFollowers`: 是否通知关注者，默认false

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "帖子标题",
    "content": "帖子内容",
    "userId": 1,
    "categoryId": 1,
    "viewCount": 0,
    "likeCount": 0,
    "commentCount": 0,
    "isPinned": false,
    "isFeatured": false,
    "isSolved": false,
    "isRecommended": false,
    "solutionCommentId": null,
    "createdAt": "2025-07-24T10:00:00Z",
    "updatedAt": "2025-07-24T10:00:00Z"
  }
}
```

#### 3.1.10 编辑帖子

**接口路径**: `PUT /api/content/posts/{id}`

**是否需要Token**: 是

**权限要求**: 帖子作者、管理员或版主

**请求参数**:
- 路径参数: `id` - 帖子ID
- 请求体 (JSON):

```json
{
  "title": "新标题",
  "content": "新内容",
  "categoryId": 2,
  "tags": [2, 3, 4],
  "coverImage": "新封面图片URL",
  "allowComments": true
}
```

**响应体**: 返回更新后的帖子信息，格式同创建帖子

#### 3.1.11 删除帖子

**接口路径**: `DELETE /api/content/posts/{id}`

**是否需要Token**: 是

**权限要求**: 帖子作者、管理员或版主

**请求参数**: 路径参数
- `id`: 帖子ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 3.1.12 点赞/取消点赞帖子

**接口路径**: `POST /api/content/posts/{id}/like`

**是否需要Token**: 是

**请求参数**: 路径参数
- `id`: 帖子ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isLiked": true,
    "likeCount": 11
  }
}
```

#### 3.1.13 收藏/取消收藏帖子

**接口路径**: `POST /api/content/posts/{id}/bookmark`

**是否需要Token**: 是

**请求参数**: 路径参数
- `id`: 帖子ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isBookmarked": true,
    "bookmarkCount": 5
  }
}
```

#### 3.1.14 保存草稿

**接口路径**: `POST /api/content/posts/draft`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "title": "草稿标题",
  "content": "草稿内容",
  "categoryId": 1,
  "tags": [1, 2],
  "coverImage": "封面图片URL"
}
```

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "草稿标题",
    "content": "草稿内容",
    "isDraft": true,
    "createdAt": "2025-07-24T10:00:00Z",
    "updatedAt": "2025-07-24T10:00:00Z"
  }
}
```

#### 3.1.15 获取用户草稿列表

**接口路径**: `GET /api/content/posts/drafts`

**是否需要Token**: 是

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**: 分页草稿列表，格式同帖子列表

### 3.3 评论相关接口

#### 3.3.1 获取帖子评论列表

**接口路径**: `GET /api/content/posts/{postId}/comments`

**是否需要Token**: 否 (白名单)

**请求参数**:
- 路径参数: `postId` - 帖子ID
- 查询参数:
  - `page`: 页码 (从0开始)
  - `size`: 每页大小
  - `sort`: 排序方式 (newest|oldest|likes)

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "content": "评论内容",
        "userId": 1,
        "postId": 1,
        "parentId": null,
        "likeCount": 5,
        "replyCount": 2,
        "isLiked": false,
        "deleted": false,
        "createdAt": "2025-07-24T10:00:00Z",
        "updatedAt": "2025-07-24T10:00:00Z",
        "user": {
          "id": 1,
          "username": "用户名",
          "avatar": "头像URL"
        },
        "replies": [
          {
            "id": 2,
            "content": "回复内容",
            "userId": 2,
            "postId": 1,
            "parentId": 1,
            "likeCount": 1,
            "replyCount": 0,
            "isLiked": false,
            "createdAt": "2025-07-24T10:05:00Z",
            "user": {
              "id": 2,
              "username": "回复者",
              "avatar": "头像URL"
            }
          }
        ]
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 50,
    "totalPages": 5,
    "first": true,
    "last": false
  }
}
```

#### 3.3.2 创建评论

**接口路径**: `POST /api/content/comments`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "content": "评论内容",
  "postId": 1,
  "parentId": null
}
```

**参数说明**:
- `content`: 评论内容，必填，最大1000字符
- `postId`: 帖子ID，必填
- `parentId`: 父评论ID，回复评论时必填，顶级评论为null

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "content": "评论内容",
    "userId": 1,
    "postId": 1,
    "parentId": null,
    "likeCount": 0,
    "replyCount": 0,
    "isLiked": false,
    "deleted": false,
    "createdAt": "2025-07-24T10:00:00Z",
    "updatedAt": "2025-07-24T10:00:00Z"
  }
}
```

#### 3.3.3 编辑评论

**接口路径**: `PUT /api/content/comments/{id}`

**是否需要Token**: 是

**权限要求**: 评论作者、管理员或版主

**请求参数**:
- 路径参数: `id` - 评论ID
- 请求体 (JSON):

```json
{
  "content": "修改后的评论内容"
}
```

**响应体**: 返回更新后的评论信息，格式同创建评论

#### 3.3.4 删除评论

**接口路径**: `DELETE /api/content/comments/{id}`

**是否需要Token**: 是

**权限要求**: 评论作者、管理员或版主

**请求参数**: 路径参数
- `id`: 评论ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 3.3.5 点赞/取消点赞评论

**接口路径**: `POST /api/content/comments/{id}/like`

**是否需要Token**: 是

**请求参数**: 路径参数
- `id`: 评论ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isLiked": true,
    "likeCount": 6
  }
}
```

#### 3.3.6 设置最佳答案

**接口路径**: `POST /api/content/posts/{postId}/solution/{commentId}`

**是否需要Token**: 是

**权限要求**: 帖子作者、管理员或版主

**请求参数**: 路径参数
- `postId`: 帖子ID
- `commentId`: 评论ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "postId": 1,
    "solutionCommentId": 5,
    "isSolved": true
  }
}
```

### 3.4 搜索相关接口

#### 3.4.1 全文搜索

**接口路径**: `GET /api/content/search`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `q`: 搜索关键词，必填
- `type`: 搜索类型 (all|posts|users|categories)，默认all
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `sort`: 排序方式 (relevance|newest|oldest|likes)，默认relevance

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "posts": {
      "content": [
        {
          "id": 1,
          "title": "搜索结果标题",
          "content": "搜索结果内容摘要...",
          "userId": 1,
          "categoryId": 1,
          "viewCount": 100,
          "likeCount": 10,
          "commentCount": 5,
          "createdAt": "2025-07-24T10:00:00Z",
          "highlight": {
            "title": "搜索<em>关键词</em>标题",
            "content": "搜索结果内容<em>关键词</em>摘要..."
          }
        }
      ],
      "totalElements": 50
    },
    "users": {
      "content": [
        {
          "id": 1,
          "username": "用户名",
          "avatar": "头像URL",
          "bio": "个人简介",
          "postCount": 10,
          "reputation": 100
        }
      ],
      "totalElements": 5
    },
    "categories": {
      "content": [
        {
          "id": 1,
          "name": "分类名称",
          "description": "分类描述",
          "postCount": 20
        }
      ],
      "totalElements": 2
    }
  }
}
```

#### 3.4.2 按分类搜索

**接口路径**: `GET /api/content/search/category/{categoryId}`

**是否需要Token**: 否 (白名单)

**请求参数**:
- 路径参数: `categoryId` - 分类ID
- 查询参数:
  - `q`: 搜索关键词，必填
  - `page`: 页码 (从0开始)
  - `size`: 每页大小
  - `sort`: 排序方式

**响应体**: 分页帖子列表，格式同帖子列表

#### 3.4.3 按标签搜索

**接口路径**: `GET /api/content/search/tag/{tagId}`

**是否需要Token**: 否 (白名单)

**请求参数**:
- 路径参数: `tagId` - 标签ID
- 查询参数:
  - `page`: 页码 (从0开始)
  - `size`: 每页大小
  - `sort`: 排序方式

**响应体**: 分页帖子列表，格式同帖子列表

#### 3.4.4 搜索建议

**接口路径**: `GET /api/content/search/suggestions`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `q`: 搜索关键词前缀，必填
- `limit`: 建议数量限制，默认10

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "text": "搜索建议1",
      "type": "keyword",
      "count": 50
    },
    {
      "text": "搜索建议2",
      "type": "tag",
      "count": 30
    }
  ]
}
```

#### 3.4.5 热门搜索

**接口路径**: `GET /api/content/search/trending`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `limit`: 返回数量，默认10

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "keyword": "热门关键词1",
      "count": 1000,
      "trend": "up"
    },
    {
      "keyword": "热门关键词2",
      "count": 800,
      "trend": "down"
    }
  ]
}
```

## 4. 通知服务 (Notification Service)

### 4.1 通知相关接口

#### 4.1.1 获取通知列表

**接口路径**: `GET /api/notifications`

**是否需要Token**: 是

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `type`: 通知类型 (all|comment|like|follow|system|mention)，默认all
- `read`: 读取状态 (all|read|unread)，默认all

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "userId": 1,
        "type": "comment",
        "title": "新评论通知",
        "content": "张三评论了您的帖子",
        "data": {
          "postId": 1,
          "commentId": 5,
          "fromUserId": 2,
          "fromUsername": "张三"
        },
        "readAt": null,
        "createdAt": "2025-07-24T10:00:00Z",
        "updatedAt": "2025-07-24T10:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 25,
    "totalPages": 3,
    "first": true,
    "last": false
  }
}
```

#### 4.1.2 获取未读通知数量

**接口路径**: `GET /api/notifications/unread-count`

**是否需要Token**: 是

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 5,
    "byType": {
      "comment": 2,
      "like": 1,
      "follow": 1,
      "system": 1,
      "mention": 0
    }
  }
}
```

#### 4.1.3 标记通知为已读

**接口路径**: `PUT /api/notifications/{id}/read`

**是否需要Token**: 是

**请求参数**: 路径参数
- `id`: 通知ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "readAt": "2025-07-24T10:30:00Z"
  }
}
```

#### 4.1.4 批量标记通知为已读

**接口路径**: `PUT /api/notifications/batch-read`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "notificationIds": [1, 2, 3, 4, 5]
}
```

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "readCount": 5
  }
}
```

#### 4.1.5 标记所有通知为已读

**接口路径**: `PUT /api/notifications/read-all`

**是否需要Token**: 是

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "readCount": 15
  }
}
```

#### 4.1.6 删除通知

**接口路径**: `DELETE /api/notifications/{id}`

**是否需要Token**: 是

**请求参数**: 路径参数
- `id`: 通知ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 4.1.7 获取通知设置

**接口路径**: `GET /api/notifications/settings`

**是否需要Token**: 是

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "emailNotifications": {
      "comment": true,
      "like": false,
      "follow": true,
      "system": true,
      "mention": true
    },
    "pushNotifications": {
      "comment": true,
      "like": true,
      "follow": true,
      "system": false,
      "mention": true
    },
    "frequency": "immediate"
  }
}
```

#### 4.1.8 更新通知设置

**接口路径**: `PUT /api/notifications/settings`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "emailNotifications": {
    "comment": true,
    "like": false,
    "follow": true,
    "system": true,
    "mention": true
  },
  "pushNotifications": {
    "comment": true,
    "like": true,
    "follow": true,
    "system": false,
    "mention": true
  },
  "frequency": "daily"
}
```

**响应体**: 返回更新后的通知设置，格式同获取通知设置

## 5. 用户交互服务 (User Interaction Service)

### 5.1 关注相关接口

#### 5.1.1 关注/取消关注用户

**接口路径**: `POST /api/users/{id}/follow`

**是否需要Token**: 是

**请求参数**: 路径参数
- `id`: 被关注用户ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isFollowing": true,
    "followerCount": 101
  }
}
```

#### 5.1.2 获取关注列表

**接口路径**: `GET /api/users/{id}/following`

**是否需要Token**: 否 (白名单)

**请求参数**:
- 路径参数: `id` - 用户ID
- 查询参数:
  - `page`: 页码 (从0开始)
  - `size`: 每页大小

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "用户名",
        "avatar": "头像URL",
        "bio": "个人简介",
        "isFollowing": true,
        "followedAt": "2025-07-24T10:00:00Z"
      }
    ],
    "totalElements": 50,
    "totalPages": 5
  }
}
```

#### 5.1.3 获取粉丝列表

**接口路径**: `GET /api/users/{id}/followers`

**是否需要Token**: 否 (白名单)

**请求参数**:
- 路径参数: `id` - 用户ID
- 查询参数:
  - `page`: 页码 (从0开始)
  - `size`: 每页大小

**响应体**: 格式同关注列表

### 5.2 收藏相关接口

#### 5.2.1 获取用户收藏列表

**接口路径**: `GET /api/users/bookmarks`

**是否需要Token**: 是

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `type`: 收藏类型 (all|posts)，默认all

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "type": "post",
        "targetId": 1,
        "bookmarkedAt": "2025-07-24T10:00:00Z",
        "post": {
          "id": 1,
          "title": "帖子标题",
          "content": "帖子内容摘要...",
          "userId": 2,
          "categoryId": 1,
          "viewCount": 100,
          "likeCount": 10,
          "commentCount": 5
        }
      }
    ],
    "totalElements": 20,
    "totalPages": 2
  }
}
```

#### 5.2.2 移除收藏

**接口路径**: `DELETE /api/users/bookmarks/{id}`

**是否需要Token**: 是

**请求参数**: 路径参数
- `id`: 收藏记录ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 5.3 点赞记录接口

#### 5.3.1 获取用户点赞记录

**接口路径**: `GET /api/users/likes`

**是否需要Token**: 是

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `type`: 点赞类型 (all|posts|comments)，默认all

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "type": "post",
        "targetId": 1,
        "likedAt": "2025-07-24T10:00:00Z",
        "post": {
          "id": 1,
          "title": "帖子标题",
          "content": "帖子内容摘要...",
          "userId": 2,
          "categoryId": 1
        }
      }
    ],
    "totalElements": 100,
    "totalPages": 10
  }
}
```

### 5.4 用户统计接口

#### 5.4.1 获取用户统计信息

**接口路径**: `GET /api/users/{id}/stats`

**是否需要Token**: 否 (白名单)

**请求参数**: 路径参数
- `id`: 用户ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "postCount": 50,
    "commentCount": 200,
    "likeCount": 300,
    "bookmarkCount": 25,
    "followerCount": 100,
    "followingCount": 80,
    "reputation": 1500,
    "joinedDays": 365,
    "lastActiveAt": "2025-07-24T10:00:00Z"
  }
}
```

## 6. 标签服务 (Tag Service)

### 6.1 标签相关接口

#### 6.1.1 获取所有标签

**接口路径**: `GET /api/content/tags`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `sort`: 排序方式 (name|postCount|newest)，默认postCount

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "生活技巧",
        "description": "日常生活中的实用技巧",
        "slug": "life-tips",
        "postCount": 150,
        "createdAt": "2025-07-24T10:00:00Z",
        "updatedAt": "2025-07-24T10:00:00Z"
      }
    ],
    "totalElements": 50,
    "totalPages": 5
  }
}
```

#### 6.1.2 获取热门标签

**接口路径**: `GET /api/content/tags/popular`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `limit`: 返回数量，默认20

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "生活技巧",
      "postCount": 150,
      "trend": "up"
    },
    {
      "id": 2,
      "name": "健康养生",
      "postCount": 120,
      "trend": "stable"
    }
  ]
}
```

#### 6.1.3 获取指定标签

**接口路径**: `GET /api/content/tags/{id}`

**是否需要Token**: 否 (白名单)

**请求参数**: 路径参数
- `id`: 标签ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "生活技巧",
    "description": "日常生活中的实用技巧",
    "slug": "life-tips",
    "postCount": 150,
    "createdAt": "2025-07-24T10:00:00Z",
    "updatedAt": "2025-07-24T10:00:00Z"
  }
}
```

#### 6.1.4 创建标签

**接口路径**: `POST /api/content/tags`

**是否需要Token**: 是

**权限要求**: 管理员或版主

**请求参数**: 请求体 (JSON)

```json
{
  "name": "新标签",
  "description": "标签描述",
  "slug": "new-tag"
}
```

**参数说明**:
- `name`: 标签名称，必填，最大50字符
- `description`: 标签描述，可选，最大200字符
- `slug`: URL友好标识符，可选，系统自动生成

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "新标签",
    "description": "标签描述",
    "slug": "new-tag",
    "postCount": 0,
    "createdAt": "2025-07-24T10:00:00Z",
    "updatedAt": "2025-07-24T10:00:00Z"
  }
}
```

#### 6.1.5 更新标签

**接口路径**: `PUT /api/content/tags/{id}`

**是否需要Token**: 是

**权限要求**: 管理员或版主

**请求参数**:
- 路径参数: `id` - 标签ID
- 请求体 (JSON):

```json
{
  "name": "更新后的标签名",
  "description": "更新后的描述"
}
```

**响应体**: 返回更新后的标签信息，格式同创建标签

#### 6.1.6 删除标签

**接口路径**: `DELETE /api/content/tags/{id}`

**是否需要Token**: 是

**权限要求**: 管理员

**请求参数**: 路径参数
- `id`: 标签ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 6.1.7 搜索标签

**接口路径**: `GET /api/content/tags/search`

**是否需要Token**: 否 (白名单)

**请求参数**: 查询参数
- `q`: 搜索关键词，必填
- `limit`: 返回数量，默认10

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "生活技巧",
      "postCount": 150
    },
    {
      "id": 2,
      "name": "生活小窍门",
      "postCount": 80
    }
  ]
}
```

#### 6.1.8 获取标签下的帖子

**接口路径**: `GET /api/content/tags/{id}/posts`

**是否需要Token**: 否 (白名单)

**请求参数**:
- 路径参数: `id` - 标签ID
- 查询参数:
  - `page`: 页码 (从0开始)
  - `size`: 每页大小
  - `sort`: 排序方式 (newest|oldest|likes|views)

**响应体**: 分页帖子列表，格式同帖子列表

## 7. 文件服务 (File Service)

### 7.1 文件上传接口

#### 7.1.1 上传头像

**接口路径**: `POST /api/files/avatar`

**是否需要Token**: 是

**请求参数**: 表单数据 (multipart/form-data)
- `file`: 头像文件，必填
  - 支持格式: JPG, PNG, GIF
  - 最大大小: 2MB
  - 推荐尺寸: 200x200px

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://example.com/avatars/user123_avatar.jpg",
    "filename": "user123_avatar.jpg",
    "size": 102400,
    "width": 200,
    "height": 200
  }
}
```

#### 7.1.2 上传帖子图片

**接口路径**: `POST /api/files/post-image`

**是否需要Token**: 是

**请求参数**: 表单数据 (multipart/form-data)
- `file`: 图片文件，必填
  - 支持格式: JPG, PNG, GIF, WebP
  - 最大大小: 5MB
  - 最大尺寸: 2048x2048px

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://example.com/images/post_image_123.jpg",
    "filename": "post_image_123.jpg",
    "size": 512000,
    "width": 1024,
    "height": 768,
    "thumbnail": "https://example.com/images/thumbnails/post_image_123_thumb.jpg"
  }
}
```

#### 7.1.3 上传封面图片

**接口路径**: `POST /api/files/cover-image`

**是否需要Token**: 是

**请求参数**: 表单数据 (multipart/form-data)
- `file`: 封面图片文件，必填
  - 支持格式: JPG, PNG, WebP
  - 最大大小: 5MB
  - 推荐尺寸: 1200x630px (16:9比例)

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://example.com/covers/cover_123.jpg",
    "filename": "cover_123.jpg",
    "size": 800000,
    "width": 1200,
    "height": 630
  }
}
```

#### 7.1.4 批量上传图片

**接口路径**: `POST /api/files/images/batch`

**是否需要Token**: 是

**请求参数**: 表单数据 (multipart/form-data)
- `files`: 图片文件数组，必填
  - 最多同时上传10个文件
  - 每个文件最大5MB

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "successful": [
      {
        "url": "https://example.com/images/image1.jpg",
        "filename": "image1.jpg",
        "size": 512000
      },
      {
        "url": "https://example.com/images/image2.jpg",
        "filename": "image2.jpg",
        "size": 768000
      }
    ],
    "failed": [
      {
        "filename": "image3.jpg",
        "error": "文件大小超出限制"
      }
    ]
  }
}
```

### 7.2 文件管理接口

#### 7.2.1 获取用户文件列表

**接口路径**: `GET /api/files/user`

**是否需要Token**: 是

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `type`: 文件类型 (all|avatar|image|cover)，默认all

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "url": "https://example.com/images/image1.jpg",
        "filename": "image1.jpg",
        "originalName": "我的图片.jpg",
        "size": 512000,
        "type": "image",
        "width": 1024,
        "height": 768,
        "createdAt": "2025-07-24T10:00:00Z"
      }
    ],
    "totalElements": 50,
    "totalPages": 5
  }
}
```

#### 7.2.2 删除文件

**接口路径**: `DELETE /api/files/{id}`

**是否需要Token**: 是

**权限要求**: 文件所有者、管理员

**请求参数**: 路径参数
- `id`: 文件ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 7.2.3 获取文件信息

**接口路径**: `GET /api/files/{id}/info`

**是否需要Token**: 否 (白名单)

**请求参数**: 路径参数
- `id`: 文件ID

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "url": "https://example.com/images/image1.jpg",
    "filename": "image1.jpg",
    "size": 512000,
    "type": "image",
    "width": 1024,
    "height": 768,
    "createdAt": "2025-07-24T10:00:00Z"
  }
}
```

### 7.3 文件配置接口

#### 7.3.1 获取上传配置

**接口路径**: `GET /api/files/config`

**是否需要Token**: 否 (白名单)

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "avatar": {
      "maxSize": 2097152,
      "allowedTypes": ["image/jpeg", "image/png", "image/gif"],
      "maxWidth": 2048,
      "maxHeight": 2048
    },
    "postImage": {
      "maxSize": 5242880,
      "allowedTypes": ["image/jpeg", "image/png", "image/gif", "image/webp"],
      "maxWidth": 2048,
      "maxHeight": 2048
    },
    "coverImage": {
      "maxSize": 5242880,
      "allowedTypes": ["image/jpeg", "image/png", "image/webp"],
      "maxWidth": 2048,
      "maxHeight": 2048
    }
  }
}
```

## 8. 设置服务 (Settings Service)

### 8.1 用户设置接口

#### 8.1.1 获取用户设置

**接口路径**: `GET /api/users/settings`

**是否需要Token**: 是

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "privacy": {
      "showEmail": false,
      "showPhone": false,
      "allowFollow": true,
      "allowMessage": true
    },
    "notification": {
      "emailNotifications": true,
      "pushNotifications": true,
      "commentNotification": true,
      "likeNotification": false,
      "followNotification": true,
      "systemNotification": true
    },
    "display": {
      "theme": "auto",
      "language": "zh-CN",
      "timezone": "Asia/Shanghai",
      "postsPerPage": 10
    },
    "security": {
      "twoFactorEnabled": false,
      "loginNotification": true,
      "sessionTimeout": 7200
    }
  }
}
```

#### 8.1.2 更新用户设置

**接口路径**: `PUT /api/users/settings`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "privacy": {
    "showEmail": false,
    "showPhone": false,
    "allowFollow": true,
    "allowMessage": true
  },
  "notification": {
    "emailNotifications": true,
    "pushNotifications": true,
    "commentNotification": true,
    "likeNotification": false,
    "followNotification": true,
    "systemNotification": true
  },
  "display": {
    "theme": "dark",
    "language": "zh-CN",
    "timezone": "Asia/Shanghai",
    "postsPerPage": 20
  }
}
```

**响应体**: 返回更新后的设置信息，格式同获取设置

#### 8.1.3 重置设置为默认值

**接口路径**: `POST /api/users/settings/reset`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "sections": ["privacy", "notification", "display"]
}
```

**参数说明**:
- `sections`: 要重置的设置分类，可选值: privacy, notification, display, security

**响应体**: 返回重置后的设置信息

### 8.2 系统设置接口

#### 8.2.1 获取系统配置

**接口路径**: `GET /api/system/config`

**是否需要Token**: 否 (白名单)

**请求参数**: 无

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "site": {
      "name": "Lumen论坛",
      "description": "生活技巧分享社区",
      "logo": "https://example.com/logo.png",
      "favicon": "https://example.com/favicon.ico",
      "keywords": ["生活技巧", "社区", "分享"]
    },
    "features": {
      "registration": true,
      "guestPosting": false,
      "emailVerification": true,
      "phoneVerification": false
    },
    "limits": {
      "maxPostLength": 50000,
      "maxCommentLength": 1000,
      "maxTagsPerPost": 5,
      "maxFileSize": 5242880
    },
    "contact": {
      "email": "admin@example.com",
      "phone": "400-123-4567",
      "address": "北京市朝阳区xxx街道"
    }
  }
}
```

#### 8.2.2 更新系统配置

**接口路径**: `PUT /api/system/config`

**是否需要Token**: 是

**权限要求**: 管理员

**请求参数**: 请求体 (JSON)，格式同获取系统配置

**响应体**: 返回更新后的系统配置

### 8.3 安全设置接口

#### 8.3.1 修改密码

**接口路径**: `PUT /api/users/password`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "currentPassword": "当前密码",
  "newPassword": "新密码",
  "confirmPassword": "确认新密码"
}
```

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 8.3.2 绑定/解绑手机号

**接口路径**: `PUT /api/users/phone`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "phone": "13800000000",
  "code": "123456",
  "action": "bind"
}
```

**参数说明**:
- `phone`: 手机号码
- `code`: 验证码
- `action`: 操作类型 (bind|unbind)

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "phone": "13800000000",
    "verified": true,
    "verifiedAt": "2025-07-24T10:00:00Z"
  }
}
```

#### 8.3.3 绑定/解绑邮箱

**接口路径**: `PUT /api/users/email`

**是否需要Token**: 是

**请求参数**: 请求体 (JSON)

```json
{
  "email": "new@example.com",
  "code": "123456",
  "action": "bind"
}
```

**响应体**: 格式同绑定手机号

#### 8.3.4 获取登录记录

**接口路径**: `GET /api/users/login-history`

**是否需要Token**: 是

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "ip": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "location": "北京市",
        "device": "Chrome on Windows",
        "success": true,
        "loginAt": "2025-07-24T10:00:00Z"
      }
    ],
    "totalElements": 100,
    "totalPages": 10
  }
}
```

---

## 9. 管理服务 (Admin Service)

### 9.1 内容管理接口

#### 9.1.1 管理员获取所有帖子

**接口路径**: `GET /api/admin/posts`

**是否需要Token**: 是

**权限要求**: 管理员或版主

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `status`: 帖子状态 (all|published|deleted|reported)
- `categoryId`: 分类ID筛选
- `userId`: 用户ID筛选

**响应体**: 分页帖子列表，包含管理信息

#### 9.1.2 批量操作帖子

**接口路径**: `POST /api/admin/posts/batch`

**是否需要Token**: 是

**权限要求**: 管理员或版主

**请求参数**: 请求体 (JSON)

```json
{
  "postIds": [1, 2, 3, 4, 5],
  "action": "delete",
  "reason": "违规内容"
}
```

**参数说明**:
- `postIds`: 帖子ID数组
- `action`: 操作类型 (delete|pin|unpin|feature|unfeature|recommend|unrecommend)
- `reason`: 操作原因，删除时必填

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "successCount": 5,
    "failedCount": 0
  }
}
```

#### 9.1.3 获取举报列表

**接口路径**: `GET /api/admin/reports`

**是否需要Token**: 是

**权限要求**: 管理员或版主

**请求参数**: 查询参数
- `page`: 页码 (从0开始)
- `size`: 每页大小
- `type`: 举报类型 (all|post|comment|user)
- `status`: 处理状态 (pending|resolved|rejected)

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "type": "post",
        "targetId": 1,
        "reporterId": 2,
        "reason": "spam",
        "description": "垃圾内容",
        "status": "pending",
        "createdAt": "2025-07-24T10:00:00Z",
        "target": {
          "id": 1,
          "title": "被举报的帖子标题"
        },
        "reporter": {
          "id": 2,
          "username": "举报者"
        }
      }
    ],
    "totalElements": 20,
    "totalPages": 2
  }
}
```

#### 9.1.4 处理举报

**接口路径**: `PUT /api/admin/reports/{id}`

**是否需要Token**: 是

**权限要求**: 管理员或版主

**请求参数**:
- 路径参数: `id` - 举报ID
- 请求体 (JSON):

```json
{
  "status": "resolved",
  "action": "delete_content",
  "note": "处理说明"
}
```

**响应体**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "status": "resolved",
    "resolvedAt": "2025-07-24T10:30:00Z",
    "resolvedBy": 1
  }
}
```

---

## 错误码说明

| 错误码 | 说明 | 常见原因 |
|--------|------|----------|
| 200 | 成功 | 请求处理成功 |
| 400 | 请求参数错误 | 参数格式不正确、必填参数缺失 |
| 401 | 未授权 | Token无效、Token过期、未登录 |
| 403 | 权限不足 | 无权限访问该资源 |
| 404 | 资源不存在 | 请求的资源不存在 |
| 409 | 资源冲突 | 用户名已存在、邮箱已注册等 |
| 413 | 文件过大 | 上传文件超出大小限制 |
| 415 | 不支持的媒体类型 | 上传文件格式不支持 |
| 429 | 请求过于频繁 | 触发限流机制 |
| 500 | 服务器内部错误 | 服务器处理异常 |
| 502 | 网关错误 | 上游服务不可用 |
| 503 | 服务不可用 | 服务维护中 |

## 接口调用示例

### JavaScript/Axios 示例

```javascript
// 登录
const login = async (email, code) => {
  try {
    const response = await axios.post('/api/auth/login', {
      loginType: 'EMAIL',
      identifier: email,
      code: code,
      rememberMe: true
    });

    // 保存token
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('登录失败:', error.response.data.message);
    throw error;
  }
};

// 创建帖子
const createPost = async (postData) => {
  try {
    const response = await axios.post('/api/content/posts', postData, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
    return response.data;
  } catch (error) {
    console.error('创建帖子失败:', error.response.data.message);
    throw error;
  }
};

// 上传图片
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/files/post-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')
      }
    });
    return response.data;
  } catch (error) {
    console.error('上传图片失败:', error.response.data.message);
    throw error;
  }
};
```

---

## 更新日志

### v1.0.0 (2025-07-24)
- 初始版本发布
- 完成基础认证、用户、内容服务接口
- 添加帖子管理、评论管理接口
- 添加搜索功能接口
- 添加通知系统接口
- 添加用户交互接口（关注、收藏、点赞）
- 添加标签管理接口
- 添加文件上传接口
- 添加用户设置和系统配置接口
- 添加管理员功能接口
