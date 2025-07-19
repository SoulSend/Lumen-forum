# API对接状态检查清单

## 使用说明
当后端API开发完成后，可以按照此清单逐步启用相关功能。

## 已完成的API ✅

### 认证服务 (auth-service)
- [x] `POST /api/auth/login/code` - 发送验证码
- [x] `POST /api/auth/login` - 用户登录  
- [x] `POST /api/auth/logout` - 用户登出

### 用户服务 (user-service)
- [x] `GET /api/users/me` - 获取当前用户信息
- [x] `GET /api/users/{id}` - 获取指定用户信息
- [x] `PUT /api/users/profile` - 更新用户资料
- [x] `GET /api/users/active` - 获取活跃用户列表

### 内容服务 (content-service)
- [x] `GET /api/content/categories` - 获取所有分类
- [x] `GET /api/content/categories/{id}` - 获取指定分类
- [x] `GET /api/content/posts` - 获取帖子列表
- [x] `GET /api/content/posts/{id}` - 获取帖子详情
- [x] `GET /api/content/posts/user` - 获取用户帖子列表
- [x] `GET /api/content/posts/categories` - 获取分类帖子列表
- [x] `GET /api/content/posts/hot` - 获取热门帖子
- [x] `GET /api/content/posts/recommended` - 获取推荐帖子

## 待启用的API 🚧

### 帖子操作功能
**后端完成后需要启用的文件位置：**
- `src/services/api.ts` - 取消 `postApi` 中相关方法的注释
- `src/stores/postStore.ts` - 取消相关方法的注释
- `src/pages/PostDetail.vue` - 替换模拟操作为真实API调用

**API列表：**
- [ ] `POST /api/content/posts` - 创建帖子
- [ ] `PUT /api/content/posts/{id}` - 更新帖子
- [ ] `DELETE /api/content/posts/{id}` - 删除帖子
- [ ] `POST /api/content/posts/{id}/like` - 点赞帖子
- [ ] `POST /api/content/posts/{id}/bookmark` - 收藏帖子

### 评论系统功能
**后端完成后需要启用的文件位置：**
- `src/services/api.ts` - 取消 `commentApi` 的注释
- `src/stores/commentStore.ts` - 取消相关方法的注释，移除模拟数据
- `src/pages/PostDetail.vue` - 替换模拟操作为真实API调用

**API列表：**
- [ ] `GET /api/content/posts/{postId}/comments` - 获取帖子评论
- [ ] `POST /api/content/posts/{postId}/comments` - 创建评论
- [ ] `PUT /api/content/comments/{id}` - 更新评论
- [ ] `DELETE /api/content/comments/{id}` - 删除评论
- [ ] `POST /api/content/comments/{id}/like` - 点赞评论
- [ ] `POST /api/content/comments/{id}/solution` - 标记为最佳答案

### 搜索功能
**后端完成后需要创建的文件：**
- `src/stores/searchStore.ts` - 重新创建搜索状态管理
- 相关搜索页面组件

**API列表：**
- [ ] `GET /api/content/search` - 综合搜索
- [ ] `GET /api/content/search/advanced` - 高级搜索
- [ ] `GET /api/content/tags` - 获取标签列表
- [ ] `GET /api/content/tags/search` - 搜索标签
- [ ] `GET /api/content/tags/{id}/posts` - 获取标签下的帖子

### 通知系统
**后端完成后需要创建的文件：**
- `src/stores/notificationStore.ts` - 重新创建通知状态管理
- 相关通知组件

**API列表：**
- [ ] `GET /api/notifications` - 获取通知列表
- [ ] `PUT /api/notifications/{id}/read` - 标记通知为已读
- [ ] `PUT /api/notifications/read-all` - 标记所有通知为已读
- [ ] `DELETE /api/notifications/{id}` - 删除通知
- [ ] `GET /api/notifications/unread-count` - 获取未读通知数量

### 用户关系功能
**后端完成后需要创建的文件：**
- `src/stores/relationshipStore.ts` - 重新创建用户关系状态管理
- 相关用户关系组件

**API列表：**
- [ ] `POST /api/users/{id}/follow` - 关注/取消关注用户
- [ ] `GET /api/users/{id}/following` - 获取关注列表
- [ ] `GET /api/users/{id}/followers` - 获取粉丝列表
- [ ] `GET /api/users/{id}/follow-status` - 获取关注状态

### 文件上传功能
**后端完成后需要创建的文件：**
- `src/stores/fileStore.ts` - 重新创建文件上传状态管理
- 相关文件上传组件

**API列表：**
- [ ] `POST /api/files/avatar` - 上传头像
- [ ] `POST /api/files/images` - 上传图片
- [ ] `DELETE /api/files/{filename}` - 删除文件

### 统计数据功能
**后端完成后需要创建的文件：**
- `src/stores/statsStore.ts` - 重新创建统计数据状态管理
- 更新 `src/pages/Home.vue` - 启用统计数据显示

**API列表：**
- [ ] `GET /api/stats/forum` - 获取论坛统计
- [ ] `GET /api/stats/users/{id}` - 获取用户统计
- [ ] `GET /api/stats/trending` - 获取热门统计

### 收藏功能
**后端完成后需要创建的文件：**
- `src/stores/bookmarkStore.ts` - 重新创建收藏状态管理
- 更新 `src/pages/PostDetail.vue` - 启用真实收藏功能

**API列表：**
- [ ] `GET /api/bookmarks` - 获取收藏列表
- [ ] `GET /api/bookmarks/check/{postId}` - 检查收藏状态
- [ ] `DELETE /api/bookmarks/{id}` - 删除收藏

## 启用步骤

### 1. 单个功能启用步骤
1. 确认后端API已完成并可用
2. 在 `src/services/api.ts` 中取消相关API的注释
3. 重新创建或更新相关的Store文件
4. 更新页面组件，替换模拟操作为真实API调用
5. 测试功能是否正常工作

### 2. 批量启用建议顺序
1. **评论系统** - 核心功能，优先级最高
2. **帖子操作** - 点赞、收藏等交互功能
3. **文件上传** - 头像、图片上传功能
4. **搜索功能** - 提升用户体验
5. **通知系统** - 用户互动反馈
6. **统计数据** - 数据展示功能
7. **用户关系** - 社交功能
8. **收藏功能** - 个人收藏管理

### 3. 测试检查点
- [ ] API调用是否成功
- [ ] 错误处理是否正常
- [ ] UI状态更新是否正确
- [ ] 用户体验是否流畅
- [ ] 数据持久化是否正常

## 注意事项
1. 启用API前请确保后端接口已完成测试
2. 逐个功能启用，避免一次性启用导致问题难以定位
3. 保留模拟数据作为后备方案
4. 及时更新此检查清单的完成状态
