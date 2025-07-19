# Lumen Forum API 文档

## 概述

Lumen Forum 是一个基于 Spring Cloud 微服务架构的论坛系统，提供用户认证、用户管理、内容管理等功能。

**基础信息：**

- 版本：1.0.0-SNAPSHOT
- 基础URL：`http://localhost:8080`
- 网关端口：8080
- 认证方式：Token认证

## 服务架构

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| gateway-service | 8080 | API网关服务 |
| auth-service | 8101 | 认证服务 |
| user-service | 8201 | 用户服务 |
| content-service | 8301 | 内容服务 |
| notification-service | 8401 | 通知服务 |
| relationship-service | 8501 | 用户关系服务 |
| file-service | 8601 | 文件服务 |
| stats-service | 8701 | 统计服务 |
| bookmark-service | 8801 | 收藏服务 |

## 通用响应格式

所有API响应都遵循统一的格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**响应字段说明：**
- `code`: 状态码，200表示成功，其他表示失败
- `message`: 响应消息
- `data`: 响应数据，可能为对象、数组或null

## 错误码说明

| 错误码 | 描述 |
|-------|------|
| -1 | 未知异常 |
| 1000 | 服务调用错误 |
| 1001 | 无响应体 |
| 1002 | 用户未登录 |
| 2000 | 验证码错误或已过期 |
| 2001 | 验证码缓存异常 |
| 3000 | 找不到用户 |
| 4000 | 找不到文章 |

## 功能实现状态总览

### 认证服务 (auth-service)
- [x] 用户登录
- [x] 发送验证码
- [x] 用户登出

### 用户服务 (user-service)
- [x] 获取当前用户信息
- [x] 获取指定用户信息
- [x] 更新用户资料
- [x] 获取活跃用户列表 (接口存在，功能待完善)
- [ ] 用户关注/取消关注
- [ ] 获取关注列表/粉丝列表
- [ ] 用户私信
- [ ] 修改密码
- [ ] 用户设置

### 内容服务 (content-service)
#### 分类管理
- [x] 获取所有分类
- [x] 获取指定分类
- [ ] 创建分类
- [ ] 更新分类
- [ ] 删除分类

#### 帖子管理
- [x] 获取帖子列表
- [x] 获取帖子详情
- [x] 获取用户帖子列表
- [x] 获取分类帖子列表
- [x] 获取热门帖子
- [x] 获取推荐帖子
- [ ] 创建帖子
- [ ] 编辑帖子
- [ ] 删除帖子
- [ ] 帖子点赞/取消点赞
- [ ] 收藏帖子/取消收藏

#### 评论系统
- [ ] 发表评论
- [ ] 获取评论列表
- [ ] 回复评论
- [ ] 删除评论
- [ ] 评论点赞
- [ ] 采纳最佳答案

### 待开发服务
#### 管理功能
- [ ] 用户管理
- [ ] 帖子审核
- [ ] 系统设置
- [ ] 数据统计

#### 搜索功能
- [ ] 帖子搜索
- [ ] 用户搜索
- [ ] 高级搜索

#### 通知系统
- [ ] 获取通知列表
- [ ] 标记已读
- [ ] 实时通知推送

#### 文件上传
- [ ] 图片上传
- [ ] 文件上传
- [ ] 头像上传

---

## 1. 认证服务 API (auth-service)

### 1.1 用户登录

**接口地址：** `POST /api/auth/login`

**接口描述：** 通过验证码进行用户登录

**请求参数：**
```json
{
  "loginType": "EMAIL",
  "identifier": "user@example.com",
  "code": "123456",
  "rememberMe": true
}
```

**参数说明：**
- `loginType`: 登录类型，枚举值：`EMAIL`(邮箱)、`SMS`(手机)
- `identifier`: 邮箱地址或手机号码
- `code`: 验证码
- `rememberMe`: 是否记住登录状态

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "abc123def456",
    "userContext": {
      "userId": 1,
      "username": "user_example@email.com",
      "avatar": "/default-avatar.png",
      "isAdmin": false,
      "isModerator": false,
      "moderatedCategory": -1,
      "isSystem": false
    }
  }
}
```

### 1.2 发送验证码

**接口地址：** `POST /api/auth/login/code`

**接口描述：** 发送登录验证码到邮箱或手机

**请求参数：**
```json
{
  "loginType": "EMAIL",
  "identifier": "user@example.com"
}
```

**参数说明：**
- `loginType`: 登录类型，枚举值：`EMAIL`(邮箱)、`SMS`(手机)
- `identifier`: 邮箱地址或手机号码

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 1.3 用户登出

**接口地址：** `POST /api/auth/logout`

**接口描述：** 用户登出，清除登录状态

**请求头：**
```
Authorization: your_token_here
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 2. 用户服务 API (user-service)

### 2.1 获取当前用户信息

**接口地址：** `GET /api/users/me`

**接口描述：** 获取当前登录用户的详细信息

**请求头：**
```
Authorization: your_token_here
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "user_example",
    "email": "user@example.com",
    "phone": "13800000000",
    "avatar": "/default-avatar.png",
    "bio": "这是我的个人简介",
    "website": "https://example.com",
    "location": "北京",
    "title": "开发者",
    "showEmail": false,
    "reputation": 100,
    "postCount": 5,
    "commentCount": 20,
    "isAdmin": false,
    "isModerator": false
  }
}
```

### 2.2 获取指定用户信息

**接口地址：** `GET /api/users/{id}`

**接口描述：** 获取指定ID用户的公开信息

**路径参数：**
- `id`: 用户ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "user_example",
    "email": "user@example.com",
    "avatar": "/default-avatar.png",
    "bio": "这是我的个人简介",
    "website": "https://example.com",
    "location": "北京",
    "title": "开发者",
    "showEmail": false,
    "reputation": 100,
    "postCount": 5,
    "commentCount": 20,
    "isAdmin": false,
    "isModerator": false
  }
}
```

### 2.3 更新用户资料

**接口地址：** `PUT /api/users/profile`

**接口描述：** 更新当前用户的个人资料

**请求头：**
```
Authorization: your_token_here
```

**请求参数：**
```json
{
  "username": "new_username",
  "bio": "更新后的个人简介",
  "avatar": "/new-avatar.png"
}
```

**参数说明：**
- `username`: 用户名（必填）
- `bio`: 个人简介（可选）
- `avatar`: 头像URL（必填）

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "new_username",
    "email": "user@example.com",
    "avatar": "/new-avatar.png",
    "bio": "更新后的个人简介",
    "reputation": 100,
    "postCount": 5,
    "commentCount": 20,
    "isAdmin": false,
    "isModerator": false
  }
}
```

### 2.4 获取活跃用户列表

**接口地址：** `GET /api/users/active`

**接口描述：** 获取活跃用户列表（分页）

**请求参数：**
```json
{
  "id": -1,
  "page": 0,
  "size": 10
}
```

**参数说明：**
- `id`: 固定传-1（不需要指定用户ID）
- `page`: 页码，从0开始
- `size`: 每页数量

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "username": "active_user1",
      "avatar": "/avatar1.png",
      "reputation": 500,
      "postCount": 20,
      "commentCount": 50
    }
  ]
}
```

**注意：** 此接口当前返回null，功能待完善。

---

## 3. 内容服务 API (content-service)

### 3.1 分类管理

#### 3.1.1 获取所有分类

**接口地址：** `GET /api/content/categories`

**接口描述：** 获取论坛所有分类列表

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "生活百科",
      "description": "日常生活小窍门和实用知识",
      "icon": "fa-home",
      "parent": null,
      "postCount": 10,
      "displayOrder": 1
    },
    {
      "id": 2,
      "name": "健康医疗",
      "description": "常见疾病预防和健康养生知识",
      "icon": "fa-heartbeat",
      "parent": null,
      "postCount": 5,
      "displayOrder": 2
    }
  ]
}
```

#### 3.1.2 获取指定分类

**接口地址：** `GET /api/content/categories/{id}`

**接口描述：** 获取指定ID的分类详情

**路径参数：**
- `id`: 分类ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "生活百科",
    "description": "日常生活小窍门和实用知识",
    "icon": "fa-home",
    "parent": null,
    "postCount": 10,
    "displayOrder": 1
  }
}
```

### 3.2 帖子管理

#### 3.2.1 获取帖子列表

**接口地址：** `GET /api/content/posts`

**接口描述：** 获取最新帖子列表（按创建时间排序）

**请求参数：**
```json
{
  "id": -1,
  "page": 0,
  "size": 10
}
```

**参数说明：**
- `id`: 固定传-1（获取所有帖子）
- `page`: 页码，从0开始
- `size`: 每页数量

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "新手报到",
        "content": "大家好，我是刚来的萌新，请多关照！",
        "userId": 1,
        "categoryId": 1,
        "viewCount": 100,
        "likeCount": 5,
        "commentCount": 2,
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
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### 3.2.2 获取帖子详情

**接口地址：** `GET /api/content/posts/{id}`

**接口描述：** 获取指定ID帖子的详细信息

**路径参数：**
- `id`: 帖子ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "新手报到",
    "content": "大家好，我是刚来的萌新，请多关照！",
    "userId": 1,
    "categoryId": 1,
    "viewCount": 100,
    "likeCount": 5,
    "commentCount": 2,
    "isPinned": false,
    "isFeatured": false,
    "isSolved": false,
    "isRecommended": false,
    "solutionCommentId": null
  }
}
```

#### 3.2.3 获取用户帖子列表

**接口地址：** `GET /api/content/posts/user`

**接口描述：** 获取指定用户的帖子列表

**请求参数：**
```json
{
  "id": 1,
  "page": 0,
  "size": 10
}
```

**参数说明：**
- `id`: 用户ID
- `page`: 页码，从0开始
- `size`: 每页数量

**响应示例：** 同帖子列表格式

#### 3.2.4 获取分类帖子列表

**接口地址：** `GET /api/content/posts/categories`

**接口描述：** 获取指定分类下的帖子列表

**请求参数：**
```json
{
  "id": 1,
  "page": 0,
  "size": 10
}
```

**参数说明：**
- `id`: 分类ID
- `page`: 页码，从0开始
- `size`: 每页数量

**响应示例：** 同帖子列表格式

#### 3.2.5 获取热门帖子

**接口地址：** `GET /api/content/posts/hot`

**接口描述：** 获取热门帖子列表（按热度排序）

**请求参数：**
```json
{
  "id": -1,
  "page": 0,
  "size": 10
}
```

**热度计算公式：** `viewCount * 0.5 + likeCount * 1 + commentCount * 1.5`

**响应示例：** 同帖子列表格式

#### 3.2.6 获取侧边栏热门帖子

**接口地址：** `GET /api/content/posts/hot/side`

**接口描述：** 获取侧边栏显示的热门帖子（固定数量）

**请求参数：**
```json
{
  "id": -1,
  "page": 0,
  "size": 5
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "热门帖子标题",
      "viewCount": 1000,
      "likeCount": 50,
      "commentCount": 30
    }
  ]
}
```

#### 3.2.7 获取推荐帖子

**接口地址：** `GET /api/content/posts/recommended`

**接口描述：** 获取管理员推荐的帖子列表

**请求参数：**
```json
{
  "id": -1,
  "page": 0,
  "size": 10
}
```

**响应示例：** 同帖子列表格式

#### 3.2.8 获取轮播推荐帖子

**接口地址：** `GET /api/content/posts/recommended/side`

**接口描述：** 获取首页轮播显示的推荐帖子

**请求参数：**
```json
{
  "id": -1,
  "page": 0,
  "size": 5
}
```

**响应示例：** 同侧边栏热门帖子格式

---

## 4. 数据模型

### 4.1 用户模型 (UserVO)

```json
{
  "id": "用户ID",
  "username": "用户名",
  "email": "邮箱地址",
  "phone": "手机号码",
  "avatar": "头像URL",
  "bio": "个人简介",
  "website": "个人网站",
  "location": "所在地",
  "title": "头衔/职称",
  "showEmail": "是否公开邮箱",
  "reputation": "声望值",
  "postCount": "发帖数量",
  "commentCount": "评论数量",
  "isAdmin": "是否是管理员",
  "isModerator": "是否是版主"
}
```

### 4.2 帖子模型 (PostVO)

```json
{
  "id": "帖子ID",
  "title": "帖子标题",
  "content": "帖子内容",
  "userId": "作者用户ID",
  "categoryId": "所属分类ID",
  "viewCount": "浏览次数",
  "likeCount": "点赞次数",
  "commentCount": "评论数量",
  "isPinned": "是否置顶",
  "isFeatured": "是否加精",
  "isSolved": "是否已解决（问答帖）",
  "isRecommended": "是否推荐",
  "solutionCommentId": "被采纳的评论ID"
}
```

### 4.3 分类模型 (CategoryPO)

```json
{
  "id": "分类ID",
  "name": "分类名称",
  "description": "分类描述",
  "icon": "分类图标",
  "parent": "父分类对象",
  "postCount": "该分类下的帖子数量",
  "displayOrder": "显示顺序"
}
```

---

#### 3.2.9 创建帖子

**接口地址：** `POST /api/content/posts`

**接口描述：** 创建新帖子

**请求头：**
```
Authorization: your_token_here
```

**请求参数：**
```json
{
  "title": "帖子标题",
  "content": "帖子内容",
  "categoryId": 1,
  "tags": [1, 2, 3],
  "isPinned": false,
  "isFeatured": false
}
```

**参数说明：**
- `title`: 帖子标题（必填，最大200字符）
- `content`: 帖子内容（必填）
- `categoryId`: 分类ID（必填）
- `tags`: 标签ID数组（可选）
- `isPinned`: 是否置顶（可选，默认false，需要管理员权限）
- `isFeatured`: 是否精华（可选，默认false，需要版主权限）

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
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
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.2.10 更新帖子

**接口地址：** `PUT /api/content/posts/{id}`

**接口描述：** 更新指定帖子（仅作者或管理员可操作）

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 帖子ID

**请求参数：**
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "categoryId": 1,
  "tags": [1, 2, 3]
}
```

**响应示例：** 同创建帖子格式

#### 3.2.11 删除帖子

**接口地址：** `DELETE /api/content/posts/{id}`

**接口描述：** 删除指定帖子（仅作者或管理员可操作）

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 帖子ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 3.2.12 帖子点赞

**接口地址：** `POST /api/content/posts/{id}/like`

**接口描述：** 点赞或取消点赞帖子

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 帖子ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isLiked": true,
    "likeCount": 10
  }
}
```

#### 3.2.13 帖子收藏

**接口地址：** `POST /api/content/posts/{id}/bookmark`

**接口描述：** 收藏或取消收藏帖子

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 帖子ID

**响应示例：**
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

### 3.3 评论管理

#### 3.3.1 获取帖子评论

**接口地址：** `GET /api/content/posts/{postId}/comments`

**接口描述：** 获取指定帖子的评论列表

**路径参数：**
- `postId`: 帖子ID

**请求参数：**
```json
{
  "page": 0,
  "size": 10,
  "sortBy": "createdAt",
  "sortDir": "desc"
}
```

**参数说明：**
- `page`: 页码，从0开始
- `size`: 每页数量
- `sortBy`: 排序字段（createdAt, likeCount）
- `sortDir`: 排序方向（asc, desc）

**响应示例：**
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
        "isSolution": false,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "user": {
          "id": 1,
          "username": "用户名",
          "avatar": "/avatar.png"
        },
        "replies": []
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### 3.3.2 创建评论

**接口地址：** `POST /api/content/posts/{postId}/comments`

**接口描述：** 为指定帖子创建评论

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `postId`: 帖子ID

**请求参数：**
```json
{
  "content": "评论内容",
  "parentId": null
}
```

**参数说明：**
- `content`: 评论内容（必填）
- `parentId`: 父评论ID（可选，用于回复评论）

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "content": "评论内容",
    "userId": 1,
    "postId": 1,
    "parentId": null,
    "likeCount": 0,
    "isSolution": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.3.3 更新评论

**接口地址：** `PUT /api/content/comments/{id}`

**接口描述：** 更新指定评论（仅作者可操作）

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 评论ID

**请求参数：**
```json
{
  "content": "更新后的评论内容"
}
```

**响应示例：** 同创建评论格式

#### 3.3.4 删除评论

**接口地址：** `DELETE /api/content/comments/{id}`

**接口描述：** 删除指定评论（仅作者或管理员可操作）

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 评论ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 3.3.5 评论点赞

**接口地址：** `POST /api/content/comments/{id}/like`

**接口描述：** 点赞或取消点赞评论

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 评论ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isLiked": true,
    "likeCount": 3
  }
}
```

#### 3.3.6 标记最佳答案

**接口地址：** `POST /api/content/comments/{id}/solution`

**接口描述：** 将评论标记为最佳答案（仅帖子作者可操作）

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 评论ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isSolution": true,
    "postId": 1
  }
}
```

### 3.4 标签管理

#### 3.4.1 获取标签列表

**接口地址：** `GET /api/content/tags`

**接口描述：** 获取所有标签列表

**请求参数：**
```json
{
  "page": 0,
  "size": 20,
  "sortBy": "postCount",
  "sortDir": "desc"
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "生活技巧",
        "description": "实用的生活小窍门",
        "slug": "life-tips",
        "postCount": 100,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### 3.4.2 搜索标签

**接口地址：** `GET /api/content/tags/search`

**接口描述：** 根据关键词搜索标签

**请求参数：**
```json
{
  "query": "生活",
  "limit": 10
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "生活技巧",
      "postCount": 100
    }
  ]
}
```

#### 3.4.3 获取标签相关帖子

**接口地址：** `GET /api/content/tags/{id}/posts`

**接口描述：** 获取指定标签下的帖子列表

**路径参数：**
- `id`: 标签ID

**请求参数：**
```json
{
  "page": 0,
  "size": 10,
  "sortBy": "createdAt",
  "sortDir": "desc"
}
```

**响应示例：** 同帖子列表格式

### 3.5 搜索功能

#### 3.5.1 综合搜索

**接口地址：** `GET /api/content/search`

**接口描述：** 综合搜索帖子、用户、标签

**请求参数：**
```json
{
  "query": "搜索关键词",
  "type": "all",
  "page": 0,
  "size": 10,
  "sortBy": "relevance",
  "sortDir": "desc"
}
```

**参数说明：**
- `query`: 搜索关键词（必填）
- `type`: 搜索类型（all, posts, users, tags）
- `sortBy`: 排序字段（relevance, createdAt, likeCount）

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "posts": {
      "content": [],
      "totalElements": 0
    },
    "users": {
      "content": [],
      "totalElements": 0
    },
    "tags": {
      "content": [],
      "totalElements": 0
    }
  }
}
```

#### 3.5.2 高级搜索

**接口地址：** `GET /api/content/search/advanced`

**接口描述：** 高级搜索，支持多种筛选条件

**请求参数：**
```json
{
  "query": "搜索关键词",
  "categoryId": 1,
  "tagIds": [1, 2],
  "userId": 1,
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31",
  "minLikes": 5,
  "minComments": 2,
  "page": 0,
  "size": 10
}
```

**响应示例：** 同帖子列表格式

---

## 4. 通知服务 API (notification-service)

### 4.1 通知管理

#### 4.1.1 获取通知列表

**接口地址：** `GET /api/notifications`

**接口描述：** 获取当前用户的通知列表

**请求头：**
```
Authorization: your_token_here
```

**请求参数：**
```json
{
  "type": "all",
  "page": 0,
  "size": 20,
  "unreadOnly": false
}
```

**参数说明：**
- `type`: 通知类型（all, comment, like, system, follow）
- `unreadOnly`: 是否只显示未读通知

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "type": "comment",
        "title": "新评论通知",
        "content": "用户张三评论了您的帖子",
        "data": {
          "postId": 123,
          "commentId": 456,
          "userId": 789
        },
        "readAt": null,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 1,
    "totalPages": 1,
    "unreadCount": 5
  }
}
```

#### 4.1.2 标记通知已读

**接口地址：** `PUT /api/notifications/{id}/read`

**接口描述：** 标记指定通知为已读

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 通知ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 4.1.3 批量标记已读

**接口地址：** `PUT /api/notifications/read-all`

**接口描述：** 标记所有通知为已读

**请求头：**
```
Authorization: your_token_here
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "markedCount": 10
  }
}
```

#### 4.1.4 删除通知

**接口地址：** `DELETE /api/notifications/{id}`

**接口描述：** 删除指定通知

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 通知ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 4.1.5 获取未读通知数量

**接口地址：** `GET /api/notifications/unread-count`

**接口描述：** 获取当前用户未读通知数量

**请求头：**
```
Authorization: your_token_here
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "unreadCount": 5,
    "byType": {
      "comment": 2,
      "like": 1,
      "system": 1,
      "follow": 1
    }
  }
}
```

---

## 5. 用户关系服务 API (relationship-service)

### 5.1 用户关注

#### 5.1.1 关注用户

**接口地址：** `POST /api/users/{id}/follow`

**接口描述：** 关注或取消关注指定用户

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 被关注用户ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isFollowing": true,
    "followerCount": 100,
    "followingCount": 50
  }
}
```

#### 5.1.2 获取关注列表

**接口地址：** `GET /api/users/{id}/following`

**接口描述：** 获取用户关注的人列表

**路径参数：**
- `id`: 用户ID

**请求参数：**
```json
{
  "page": 0,
  "size": 20
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "用户名",
        "avatar": "/avatar.png",
        "bio": "个人简介",
        "followerCount": 100,
        "isFollowing": true,
        "followedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### 5.1.3 获取粉丝列表

**接口地址：** `GET /api/users/{id}/followers`

**接口描述：** 获取用户的粉丝列表

**路径参数：**
- `id`: 用户ID

**请求参数：** 同关注列表

**响应示例：** 同关注列表格式

#### 5.1.4 检查关注状态

**接口地址：** `GET /api/users/{id}/follow-status`

**接口描述：** 检查当前用户是否关注指定用户

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 用户ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isFollowing": true,
    "isFollowedBy": false
  }
}
```

---

## 6. 文件服务 API (file-service)

### 6.1 文件上传

#### 6.1.1 头像上传

**接口地址：** `POST /api/files/avatar`

**接口描述：** 上传用户头像

**请求头：**
```
Authorization: your_token_here
Content-Type: multipart/form-data
```

**请求参数：**
- `file`: 头像文件（支持jpg, png, gif格式，最大2MB）

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "/uploads/avatars/user_123_avatar.jpg",
    "filename": "user_123_avatar.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

#### 6.1.2 图片上传

**接口地址：** `POST /api/files/images`

**接口描述：** 上传图片文件（用于帖子内容）

**请求头：**
```
Authorization: your_token_here
Content-Type: multipart/form-data
```

**请求参数：**
- `file`: 图片文件（支持jpg, png, gif格式，最大5MB）
- `type`: 图片类型（post, comment, cover）

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "/uploads/images/post_image_123.jpg",
    "filename": "post_image_123.jpg",
    "size": 512000,
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080
  }
}
```

#### 6.1.3 文件删除

**接口地址：** `DELETE /api/files/{filename}`

**接口描述：** 删除指定文件

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `filename`: 文件名

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 7. 统计服务 API (stats-service)

### 7.1 论坛统计

#### 7.1.1 获取论坛统计数据

**接口地址：** `GET /api/stats/forum`

**接口描述：** 获取论坛整体统计数据

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userCount": 10000,
    "postCount": 50000,
    "commentCount": 200000,
    "categoryCount": 10,
    "tagCount": 500,
    "todayPosts": 100,
    "todayComments": 500,
    "todayUsers": 50,
    "solutionCount": 5000
  }
}
```

#### 7.1.2 获取用户统计数据

**接口地址：** `GET /api/stats/users/{id}`

**接口描述：** 获取指定用户的统计数据

**路径参数：**
- `id`: 用户ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "postCount": 100,
    "commentCount": 500,
    "likeReceived": 1000,
    "viewCount": 50000,
    "followerCount": 200,
    "followingCount": 150,
    "reputation": 2500,
    "joinDays": 365,
    "lastActiveAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 7.1.3 获取热门统计

**接口地址：** `GET /api/stats/trending`

**接口描述：** 获取热门内容统计

**请求参数：**
```json
{
  "period": "week",
  "limit": 10
}
```

**参数说明：**
- `period`: 统计周期（day, week, month, year）
- `limit`: 返回数量限制

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "hotPosts": [
      {
        "id": 1,
        "title": "热门帖子标题",
        "viewCount": 10000,
        "likeCount": 500,
        "commentCount": 200,
        "score": 95.5
      }
    ],
    "hotTags": [
      {
        "id": 1,
        "name": "热门标签",
        "postCount": 100,
        "growthRate": 25.5
      }
    ],
    "activeUsers": [
      {
        "id": 1,
        "username": "活跃用户",
        "avatar": "/avatar.png",
        "postCount": 50,
        "commentCount": 200
      }
    ]
  }
}
```

---

## 8. 收藏服务 API (bookmark-service)

### 8.1 收藏管理

#### 8.1.1 获取收藏列表

**接口地址：** `GET /api/bookmarks`

**接口描述：** 获取当前用户的收藏列表

**请求头：**
```
Authorization: your_token_here
```

**请求参数：**
```json
{
  "page": 0,
  "size": 20,
  "sortBy": "createdAt",
  "sortDir": "desc"
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "postId": 123,
        "post": {
          "id": 123,
          "title": "收藏的帖子标题",
          "content": "帖子内容摘要...",
          "user": {
            "id": 1,
            "username": "作者",
            "avatar": "/avatar.png"
          },
          "category": {
            "id": 1,
            "name": "分类名称"
          }
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 1,
    "totalPages": 1
  }
}
```

#### 8.1.2 检查收藏状态

**接口地址：** `GET /api/bookmarks/check/{postId}`

**接口描述：** 检查指定帖子是否已收藏

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `postId`: 帖子ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isBookmarked": true,
    "bookmarkId": 123,
    "bookmarkedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 8.1.3 删除收藏

**接口地址：** `DELETE /api/bookmarks/{id}`

**接口描述：** 删除指定收藏

**请求头：**
```
Authorization: your_token_here
```

**路径参数：**
- `id`: 收藏ID

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 9. 待完善功能

以下功能当前尚未完全实现，预留接口供后续开发：

### 9.1 私信系统
- **发送私信**: `POST /api/messages`
- **获取私信列表**: `GET /api/messages`
- **标记私信已读**: `PUT /api/messages/{id}/read`
- **删除私信**: `DELETE /api/messages/{id}`

### 9.2 举报系统
- **举报内容**: `POST /api/reports`
- **获取举报列表**: `GET /api/reports` (管理员)
- **处理举报**: `PUT /api/reports/{id}/handle` (管理员)

### 9.3 管理员功能
- **用户管理**: `GET/PUT/DELETE /api/admin/users`
- **内容审核**: `GET/PUT /api/admin/content/review`
- **系统设置**: `GET/PUT /api/admin/settings`
- **数据导出**: `GET /api/admin/export`

### 9.4 高级功能
- **内容推荐算法**: 基于用户行为的智能推荐
- **实时通知**: WebSocket实时通知推送
- **内容审核**: 自动内容审核和人工审核
- **数据分析**: 用户行为分析和内容分析

### 9.5 第三方集成
- **社交登录**: 微信、QQ、微博等第三方登录
- **分享功能**: 分享到各大社交平台
- **支付功能**: 会员系统和打赏功能
- **邮件服务**: 邮件通知和营销邮件

---

## 10. 扩展数据模型

### 10.1 通知模型 (NotificationVO)

```json
{
  "id": "通知ID",
  "type": "通知类型 (comment, like, system, follow)",
  "title": "通知标题",
  "content": "通知内容",
  "data": "通知相关数据 (JSON格式)",
  "readAt": "已读时间",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### 10.2 评论模型 (CommentVO)

```json
{
  "id": "评论ID",
  "content": "评论内容",
  "userId": "用户ID",
  "user": "用户信息对象",
  "postId": "帖子ID",
  "parentId": "父评论ID",
  "likeCount": "点赞数",
  "isSolution": "是否为最佳答案",
  "isLiked": "当前用户是否已点赞",
  "replies": "回复列表",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### 10.3 标签模型 (TagVO)

```json
{
  "id": "标签ID",
  "name": "标签名称",
  "description": "标签描述",
  "slug": "标签别名",
  "postCount": "使用该标签的帖子数量",
  "color": "标签颜色",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### 10.4 关注关系模型 (FollowVO)

```json
{
  "id": "关注关系ID",
  "followerId": "关注者ID",
  "follower": "关注者信息",
  "followingId": "被关注者ID",
  "following": "被关注者信息",
  "createdAt": "关注时间"
}
```

### 10.5 收藏模型 (BookmarkVO)

```json
{
  "id": "收藏ID",
  "userId": "用户ID",
  "postId": "帖子ID",
  "post": "帖子信息对象",
  "createdAt": "收藏时间"
}
```

### 10.6 文件模型 (FileVO)

```json
{
  "id": "文件ID",
  "filename": "文件名",
  "originalName": "原始文件名",
  "url": "文件访问URL",
  "size": "文件大小 (字节)",
  "mimeType": "文件类型",
  "width": "图片宽度 (仅图片)",
  "height": "图片高度 (仅图片)",
  "uploaderId": "上传者ID",
  "createdAt": "上传时间"
}
```

### 10.7 统计模型 (StatsVO)

```json
{
  "userCount": "用户总数",
  "postCount": "帖子总数",
  "commentCount": "评论总数",
  "categoryCount": "分类总数",
  "tagCount": "标签总数",
  "todayPosts": "今日新增帖子",
  "todayComments": "今日新增评论",
  "todayUsers": "今日新增用户",
  "solutionCount": "已解决问题数",
  "activeUsers": "活跃用户数",
  "onlineUsers": "在线用户数"
}
```



---

## 11. 开发说明

### 11.1 认证机制
- **Token认证**: 使用JWT Token进行用户认证
- **Token存储**: Token存储在Redis中，支持分布式部署
- **Token有效期**: 30分钟（1800秒），支持刷新机制
- **验证码有效期**: 5分钟（300秒）
- **权限控制**: 基于角色的权限控制(RBAC)

### 11.2 分页参数规范
- **page**: 页码，从0开始
- **size**: 每页数量，默认10，最大100
- **sortBy**: 排序字段，默认按创建时间
- **sortDir**: 排序方向，asc(升序) 或 desc(降序)
- **id**: 特殊参数，用于指定特定资源的分页查询

### 11.3 错误处理机制
- **全局异常处理**: 所有异常都会被全局异常处理器捕获
- **统一错误格式**: 返回统一的错误响应格式
- **参数校验**: 参数校验失败会返回详细的错误信息
- **业务异常**: 业务逻辑异常使用特定错误码
- **系统异常**: 系统异常统一处理，不暴露敏感信息

### 11.4 服务间通信
- **OpenFeign**: 使用OpenFeign进行服务间调用
- **负载均衡**: 支持Ribbon负载均衡
- **熔断机制**: 集成Hystrix熔断器
- **内部调用**: 内部调用使用特殊请求头标识
- **链路追踪**: 支持分布式链路追踪

### 11.5 缓存策略
- **Redis缓存**: 使用Redis进行数据缓存
- **热点数据**: 热门帖子、用户信息等热点数据缓存
- **缓存更新**: 数据更新时自动刷新相关缓存
- **缓存穿透**: 防止缓存穿透和雪崩
- **缓存预热**: 系统启动时预热重要数据

### 11.6 性能优化
- **数据库优化**: 合理使用索引，优化查询语句
- **分页优化**: 大数据量分页使用游标分页
- **图片处理**: 图片压缩和CDN加速
- **接口限流**: 防止接口被恶意调用
- **异步处理**: 耗时操作使用异步处理

### 11.7 安全措施
- **SQL注入防护**: 使用参数化查询防止SQL注入
- **XSS防护**: 前端输入过滤和后端输出编码
- **CSRF防护**: 使用CSRF Token防护
- **接口鉴权**: 敏感接口需要权限验证
- **数据脱敏**: 敏感数据脱敏处理

### 11.8 监控和日志
- **接口监控**: 监控接口响应时间和成功率
- **业务监控**: 监控关键业务指标
- **错误日志**: 详细记录错误信息和堆栈
- **访问日志**: 记录用户访问行为
- **性能分析**: 定期分析系统性能瓶颈

### 11.9 部署说明
- **容器化部署**: 支持Docker容器化部署
- **微服务部署**: 各服务独立部署和扩展
- **配置管理**: 使用配置中心管理配置
- **服务发现**: 使用Eureka进行服务注册和发现
- **网关路由**: 通过网关进行统一路由和负载均衡

### 11.10 测试规范
- **单元测试**: 核心业务逻辑需要单元测试覆盖
- **集成测试**: 服务间调用需要集成测试
- **接口测试**: 所有API接口需要自动化测试
- **性能测试**: 关键接口需要性能测试
- **安全测试**: 定期进行安全漏洞扫描