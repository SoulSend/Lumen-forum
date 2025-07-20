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

---

## 4. 内部服务接口 (仅供服务间调用)

### 4.1 用户服务内部接口

这些接口仅供微服务间内部调用，不对外开放：

- `POST /internal/user` - 创建用户
- `GET /internal/user/phone/{phone}` - 根据手机号获取用户
- `GET /internal/user/email/{email}` - 根据邮箱获取用户
- `GET /internal/user/id/{id}` - 根据ID获取用户
- `GET /internal/user/username/{username}` - 根据用户名获取用户

---

## 5. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 401 | 未授权/Token无效 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 6. 注意事项

1. 所有时间字段均为 ISO 8601 格式
2. 分页参数 page 从 0 开始计数
3. 需要认证的接口必须在请求头中携带有效的 Authorization token
4. 白名单接口可以直接访问，无需认证
5. 所有接口都支持 CORS 跨域请求
6. 网关统一处理异常，返回标准错误格式