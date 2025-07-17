# Lumen Forum API 文档

## 目录
1. [认证服务 (Auth Service)](#认证服务-auth-service)
2. [用户服务 (User Service)](#用户服务-user-service)
3. [内容服务 (Content Service)](#内容服务-content-service)

## 认证服务 (Auth Service)

### 登录接口

**路径:** `/login`

**方法:** `POST`

**功能:** 验证码登录

**请求参数:**
```json
{
  "loginType": "EMAIL|SMS", // 登录类型：EMAIL(邮箱)或SMS(手机)
  "identifier": "string",   // 邮箱或手机号
  "code": "string",         // 验证码
  "rememberMe": true|false  // 是否记住登录
}
```

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "string",      // 认证令牌
    "userContext": {
      "userId": 123,        // 用户ID
      "username": "string", // 用户名
      "avatar": "string",   // 头像URL
      "isAdmin": true|false, // 是否为管理员
      "isModerator": true|false, // 是否为版主
      "moderatedCategory": 123,  // 管理的分类ID
      "isSystem": true|false     // 是否为系统用户
    }
  }
}
```

### 发送验证码

**路径:** `/login/code`

**方法:** `POST`

**功能:** 发送登录验证码

**请求参数:**
```json
{
  "loginType": "EMAIL|SMS", // 登录类型：EMAIL(邮箱)或SMS(手机)
  "identifier": "string"    // 邮箱或手机号
}
```

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 登出接口

**路径:** `/logout`

**方法:** `POST`

**功能:** 用户登出，清除认证信息

**请求头:**
- `Authorization`: 用户令牌

**请求参数:** 无

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 用户服务 (User Service)

### 获取当前用户信息

**路径:** `/me`

**方法:** `GET`

**功能:** 获取当前登录用户的详细信息

**请求参数:** 无

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "username": "string",
    "email": "string",
    "phone": "string",
    "passwordHash": "string",
    "avatar": "string",
    "bio": "string",
    "website": "string",
    "location": "string",
    "title": "string",
    "showEmail": true|false,
    "reputation": 123,
    "postCount": 123,
    "commentCount": 123,
    "isAdmin": true|false,
    "isModerator": true|false
  }
}
```

### 获取指定用户信息

**路径:** `/{id}`

**方法:** `GET`

**功能:** 根据ID获取指定用户的详细信息

**请求参数:**
- `id`: 路径参数，用户ID

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "username": "string",
    "email": "string",
    "phone": "string",
    "passwordHash": "string",
    "avatar": "string",
    "bio": "string",
    "website": "string",
    "location": "string",
    "title": "string",
    "showEmail": true|false,
    "reputation": 123,
    "postCount": 123,
    "commentCount": 123,
    "isAdmin": true|false,
    "isModerator": true|false
  }
}
```

### 更新用户个人资料

**路径:** `/profile`

**方法:** `PUT`

**功能:** 更新当前用户的个人资料

**请求参数:**
```json
{
  "username": "string", // 用户名(必填)
  "email": "string",    // 邮箱(必填)
  "bio": "string",      // 个人简介
  "avatar": "string"    // 头像URL
}
```

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "username": "string",
    "email": "string",
    "phone": "string",
    "passwordHash": "string",
    "avatar": "string",
    "bio": "string",
    "website": "string",
    "location": "string",
    "title": "string",
    "showEmail": true|false,
    "reputation": 123,
    "postCount": 123,
    "commentCount": 123,
    "isAdmin": true|false,
    "isModerator": true|false
  }
}
```

## 内容服务 (Content Service)

### 获取所有分类

**路径:** `/categories`

**方法:** `GET`

**功能:** 获取所有分类的列表

**请求参数:** 无

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 123,
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "deletedAt": 0,
      "name": "string",
      "description": "string",
      "icon": "string",
      "parent": {
        // 父分类对象(如果有)
      },
      "postCount": 123,
      "displayOrder": 123
    },
    // 更多分类...
  ]
}
```

### 获取特定分类

**路径:** `/categories/{id}`

**方法:** `GET`

**功能:** 根据ID获取特定分类的详情

**请求参数:**
- `id`: 路径参数，分类ID

**响应结果:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "deletedAt": 0,
    "name": "string",
    "description": "string",
    "icon": "string",
    "parent": {
      // 父分类对象(如果有)
    },
    "postCount": 123,
    "displayOrder": 123
  }
}
```

