# 前端API使用指南

## 概述

本文档为前端开发者提供API接口的使用指南，包含常见场景的代码示例和最佳实践。

## 项目中的API服务结构

项目中的API服务位于 `src/services/api.ts`，已按功能模块进行分类：

- `authApi` - 认证相关
- `userApi` - 用户基础信息
- `postApi` - 帖子基础查询
- `postManagementApi` - 帖子管理（创建、编辑、删除等）
- `commentApi` - 评论管理
- `searchApi` - 搜索功能
- `notificationApi` - 通知系统
- `userInteractionApi` - 用户交互（关注、收藏、点赞）
- `tagApi` - 标签管理
- `fileApi` - 文件上传
- `settingsApi` - 设置管理
- `adminApi` - 管理员功能

## 常见使用场景

### 1. 用户认证流程

```typescript
import { authApi } from '@/services/api'

// 发送验证码
const sendVerificationCode = async (email: string) => {
  try {
    await authApi.sendCode('EMAIL', email)
    ElMessage.success('验证码已发送')
  } catch (error) {
    ElMessage.error('发送验证码失败')
  }
}

// 用户登录
const login = async (email: string, code: string) => {
  try {
    const result = await authApi.login('EMAIL', email, code, true)
    // 保存token和用户信息
    localStorage.setItem('token', result.token)
    // 更新用户状态
    userStore.setUser(result.userContext)
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败')
  }
}
```

### 2. 帖子管理

```typescript
import { postManagementApi } from '@/services/api'

// 创建帖子
const createPost = async (postData: any) => {
  try {
    const result = await postManagementApi.createPost({
      title: postData.title,
      content: postData.content,
      categoryId: postData.categoryId,
      tags: postData.tags,
      allowComments: true,
      isOriginal: true
    })
    ElMessage.success('帖子发布成功')
    router.push(`/posts/${result.id}`)
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

// 点赞帖子
const toggleLike = async (postId: number) => {
  try {
    const result = await postManagementApi.toggleLike(postId)
    // 更新UI状态
    post.value.isLiked = result.isLiked
    post.value.likeCount = result.likeCount
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
```

### 3. 评论功能

```typescript
import { commentApi } from '@/services/api'

// 获取评论列表
const fetchComments = async (postId: number, page = 0) => {
  try {
    const result = await commentApi.getPostComments(postId, page, 10, 'newest')
    comments.value = result.content
    pagination.value = {
      currentPage: result.pageable.pageNumber,
      totalPages: result.totalPages,
      total: result.totalElements
    }
  } catch (error) {
    ElMessage.error('获取评论失败')
  }
}

// 创建评论
const createComment = async (content: string, parentId?: number) => {
  try {
    const result = await commentApi.createComment({
      content,
      postId: route.params.id,
      parentId
    })
    ElMessage.success('评论发布成功')
    // 刷新评论列表
    await fetchComments(route.params.id as number)
  } catch (error) {
    ElMessage.error('评论失败')
  }
}
```

### 4. 搜索功能

```typescript
import { searchApi } from '@/services/api'

// 全文搜索
const performSearch = async (query: string, type = 'all') => {
  try {
    const result = await searchApi.search(query, type, 0, 10, 'relevance')
    searchResults.value = result
  } catch (error) {
    ElMessage.error('搜索失败')
  }
}

// 获取搜索建议
const getSuggestions = async (query: string) => {
  try {
    const suggestions = await searchApi.getSuggestions(query, 5)
    return suggestions
  } catch (error) {
    return []
  }
}
```

### 5. 文件上传

```typescript
import { fileApi } from '@/services/api'

// 上传头像
const uploadAvatar = async (file: File) => {
  try {
    const result = await fileApi.uploadAvatar(file)
    // 更新用户头像
    userStore.updateAvatar(result.url)
    ElMessage.success('头像更新成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

// 上传帖子图片（富文本编辑器中使用）
const uploadPostImage = async (file: File) => {
  try {
    const result = await fileApi.uploadPostImage(file)
    return result.url
  } catch (error) {
    ElMessage.error('图片上传失败')
    throw error
  }
}
```

### 6. 通知系统

```typescript
import { notificationApi } from '@/services/api'

// 获取通知列表
const fetchNotifications = async () => {
  try {
    const result = await notificationApi.getNotifications(0, 20, 'all', 'all')
    notifications.value = result.content
  } catch (error) {
    ElMessage.error('获取通知失败')
  }
}

// 获取未读通知数量
const getUnreadCount = async () => {
  try {
    const result = await notificationApi.getUnreadCount()
    unreadCount.value = result.total
  } catch (error) {
    console.error('获取未读通知数量失败')
  }
}

// 标记所有通知为已读
const markAllAsRead = async () => {
  try {
    await notificationApi.markAllAsRead()
    unreadCount.value = 0
    // 刷新通知列表
    await fetchNotifications()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
```

## 错误处理最佳实践

### 1. 统一错误处理

```typescript
// 在api.ts中已配置了响应拦截器，会自动处理常见错误
// 业务代码中只需要处理特定的业务逻辑

const handleApiCall = async () => {
  try {
    const result = await someApi.someMethod()
    // 处理成功结果
    return result
  } catch (error: any) {
    // 错误已经在拦截器中处理，这里可以做特定的业务处理
    if (error.code === 403) {
      // 权限不足的特殊处理
      router.push('/login')
    }
    throw error // 重新抛出，让上层组件处理
  }
}
```

### 2. 加载状态管理

```typescript
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const result = await api.getData()
    // 处理数据
  } catch (error) {
    // 处理错误
  } finally {
    loading.value = false
  }
}
```

## 分页数据处理

```typescript
// 标准分页数据结构处理
const handlePaginatedData = (response: any) => {
  return {
    items: response.content,
    pagination: {
      currentPage: response.pageable.pageNumber,
      pageSize: response.pageable.pageSize,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      isFirst: response.first,
      isLast: response.last
    }
  }
}
```

## 注意事项

1. **Token管理**: 所有需要认证的接口都会自动添加Authorization头，无需手动处理
2. **错误处理**: 使用try-catch包装API调用，响应拦截器已处理基础错误
3. **分页参数**: 后端分页从0开始，前端展示时需要+1
4. **文件上传**: 使用FormData格式，设置正确的Content-Type
5. **搜索防抖**: 搜索建议等高频接口建议添加防抖处理

## 开发建议

1. 在组件中使用API时，建议封装成composable函数
2. 对于复杂的数据处理，建议使用Pinia store管理状态
3. 重要操作前添加确认提示
4. 合理使用加载状态提升用户体验
5. 及时更新本地状态，避免数据不一致
