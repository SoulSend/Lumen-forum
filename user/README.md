# Lumen 论坛 - 生活技巧分享社区

Lumen论坛是一个专注于生活技巧分享的在线社区平台，采用Vue 3 + TypeScript开发，旨在让用户分享、发现和讨论各种实用的生活技巧，帮助人们提升生活品质。

## 项目概述

Lumen论坛提供了一个用户友好的平台，让人们可以发布生活中的实用技巧、经验和窍门。社区涵盖了多个生活领域，包括家居装饰、烹饪美食、旅行探索、健康养生和职场技能等。用户可以通过发帖、评论、点赞和收藏等方式参与互动，构建活跃的知识分享社区。

## 核心功能

### 1. 用户系统
- **多种登录方式**：支持手机号、邮箱验证码和密码登录
- **个人资料管理**：用户可自定义头像、封面图、个人简介等
- **用户等级与声望**：基于活跃度和贡献度的用户成长体系
- **用户关注**：用户间可以互相关注，建立连接

### 2. 内容发布与管理
- **富文本编辑器**：支持多种格式的帖子内容编辑
- **分类与标签**：内容按主题分类并支持标签系统
- **草稿保存**：支持保存未完成的帖子草稿
- **编辑与删除**：用户可管理自己发布的内容

### 3. 互动功能
- **评论系统**：支持多级评论和回复
- **点赞功能**：用户可对帖子和评论点赞
- **收藏功能**：收藏喜欢的内容以便后续查看
- **分享功能**：支持分享内容到各社交媒体平台

### 4. 内容发现
- **首页推荐**：基于热门和精选的内容推荐
- **分类浏览**：按主题分类浏览内容
- **搜索功能**：支持全文搜索、标签搜索和用户搜索
- **热门排行**：展示最受欢迎的内容

### 5. 通知与消息
- **互动通知**：评论、点赞、收藏等交互提醒
- **系统通知**：平台公告和重要更新提醒
- **通知管理**：支持标记已读、筛选和删除通知

### 6. 社区特色功能
- **最佳回答**：可将有价值的评论标记为最佳回答
- **社区统计**：展示平台活跃度和内容数据
- **生活小技巧**：每日推荐实用生活技巧

## 技术栈

### 前端
- **框架**: Vue 3
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI组件库**: Element Plus
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **编辑器**: 集成多种富文本编辑器支持

### 后端 (API接口对接)
- RESTful API设计
- JWT认证机制
- 分页和筛选支持

## 详细项目结构

```
user/                              # 项目根目录
│
├── api_documentation.md           # API接口文档，详细说明了后端接口规范和用法
├── lumen_database.sql             # 数据库结构SQL脚本，包含表结构和关系定义
├── index.html                     # 项目入口HTML文件，包含基本页面结构和字体资源
├── env.d.ts                       # 环境变量类型声明文件
├── README.md                      # 项目说明文档
├── package.json                   # 项目依赖配置和脚本定义
├── package-lock.json              # 依赖版本锁定文件
├── vite.config.ts                 # Vite构建工具配置文件
├── tsconfig.json                  # TypeScript主配置文件
├── tsconfig.app.json              # 应用程序TypeScript配置
├── tsconfig.node.json             # Node环境TypeScript配置
│
├── public/                        # 公共静态资源目录
│   └── favicon.ico                # 网站图标
│
└── src/                           # 源代码目录
    ├── App.vue                    # 应用根组件，包含用户状态初始化逻辑
    ├── main.ts                    # 应用入口文件，配置和挂载Vue应用
    │
    ├── assets/                    # 静态资源目录
    │   ├── base.css               # 基础样式，定义颜色、间距、字体等变量
    │   ├── main.css               # 主样式文件，包含全局样式定义
    │   ├── default-avatar.png     # 默认用户头像
    │   └── logo.svg               # 网站Logo
    │
    ├── components/                # 组件目录
    │   ├── common/                # 通用组件
    │   │   ├── AuthRequired.vue   # 权限检查组件，用于控制需要登录才能访问的内容
    │   │   ├── LoginModal.vue     # 登录弹窗组件，支持多种登录方式
    │   │   └── LoginPrompt.vue    # 登录提示组件，用于引导未登录用户
    │   │
    │   ├── forum/                 # 论坛相关组件
    │   │   ├── CommentList.vue    # 评论列表组件，用于显示和管理帖子评论
    │   │   └── PostCard.vue       # 帖子卡片组件，用于在列表中展示帖子概要
    │   │
    │   └── layout/                # 布局组件
    │       ├── Footer.vue         # 页脚组件，包含站点信息和链接
    │       ├── Header.vue         # 页头组件，包含导航、搜索和用户菜单
    │       ├── MainLayout.vue     # 主布局组件，定义页面整体结构
    │       └── Sidebar.vue        # 侧边栏组件，显示分类、热门标签等信息
    │
    ├── directives/                # Vue自定义指令
    │   └── permission.ts          # 权限指令，用于基于用户权限控制UI元素的显示
    │
    ├── pages/                     # 页面组件
    │   ├── About.vue              # 关于页面，展示站点信息
    │   ├── Category.vue           # 分类页面，展示特定分类下的帖子
    │   ├── CreatePost.vue         # 发布帖子页面，包含富文本编辑器
    │   ├── EditPost.vue           # 编辑帖子页面，用于修改已有帖子
    │   ├── Home.vue               # 首页，展示推荐内容和热门帖子
    │   ├── NotFound.vue           # 404页面，处理未找到的路由
    │   ├── Notifications.vue      # 通知中心页面，管理用户通知
    │   ├── PostDetail.vue         # 帖子详情页，展示完整帖子内容和评论
    │   ├── Search.vue             # 搜索结果页面，展示搜索匹配的内容
    │   ├── Settings.vue           # 用户设置页面，管理账户和偏好设置
    │   └── UserProfile.vue        # 用户资料页面，展示用户信息和发布的内容
    │
    ├── router/                    # 路由配置
    │   └── index.ts               # 路由定义文件，配置页面路由和导航守卫
    │
    ├── services/                  # API服务
    │   └── api.ts                 # API请求封装，提供与后端交互的方法
    │
    ├── stores/                    # Pinia状态管理
    │   ├── categoryStore.ts       # 分类数据状态管理
    │   ├── commentStore.ts        # 评论数据状态管理
    │   ├── postStore.ts           # 帖子数据状态管理
    │   └── userStore.ts           # 用户数据和认证状态管理
    │
    ├── types/                     # TypeScript类型定义
    │   └── forum.ts               # 论坛相关的接口和类型定义
    │
    └── utils/                     # 工具函数
        └── permission.ts          # 权限相关的辅助函数
```

## 核心文件功能说明

### 入口文件
- **src/App.vue**: 应用程序根组件，负责初始化用户状态和路由渲染
- **src/main.ts**: 应用入口文件，配置和挂载Vue应用，注册全局组件和插件

### 核心组件
- **src/components/layout/MainLayout.vue**: 主布局组件，定义了页面的基本结构，包含头部、内容区和侧边栏
- **src/components/layout/Header.vue**: 页头组件，实现网站导航、搜索功能和用户菜单
- **src/components/forum/PostCard.vue**: 帖子卡片组件，在各个列表页面展示帖子预览
- **src/components/forum/CommentList.vue**: 评论列表组件，管理帖子评论的显示和交互

### 页面组件
- **src/pages/Home.vue**: 首页，展示推荐内容、热门帖子和社区动态
- **src/pages/PostDetail.vue**: 帖子详情页，显示完整帖子内容和评论区
- **src/pages/CreatePost.vue**: 发布帖子页面，集成富文本编辑器和表单验证
- **src/pages/UserProfile.vue**: 用户个人资料页，展示用户信息和内容列表

### 状态管理
- **src/stores/userStore.ts**: 用户状态管理，处理登录、注册和用户信息
- **src/stores/postStore.ts**: 帖子状态管理，处理帖子的获取、创建和更新
- **src/stores/commentStore.ts**: 评论状态管理，处理评论的获取和操作
- **src/stores/categoryStore.ts**: 分类状态管理，处理分类数据的获取和缓存

### 工具和服务
- **src/services/api.ts**: API服务，封装了与后端交互的HTTP请求方法
- **src/utils/permission.ts**: 权限工具，提供权限检查和控制的功能
- **src/directives/permission.ts**: 权限指令，用于在模板中基于权限控制UI元素

## 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装步骤

1. 克隆项目代码
```bash
git clone [仓库URL]
cd lumen-forum
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 开发环境运行
```bash
npm run dev
# 或
yarn dev
```

4. 构建生产版本
```bash
npm run build
# 或
yarn build
```

## 主要页面

1. **首页**: 展示热门帖子、推荐内容和社区动态
2. **帖子详情页**: 查看帖子内容和评论
3. **分类页面**: 浏览特定分类下的帖子
4. **发布帖子**: 创建和编辑帖子
5. **用户个人中心**: 查看用户信息和发布历史
6. **通知中心**: 管理系统和互动通知
7. **搜索结果**: 展示搜索内容

## 开发指南

### 代码规范
- 遵循ESLint和Prettier配置
- 组件使用PascalCase命名
- 文件使用kebab-case命名

### 组件开发
- 使用组合式API (Composition API)
- 注重组件复用和逻辑分离
- 使用TypeScript类型定义确保类型安全

### 状态管理
- 使用Pinia进行状态管理
- 模块化设计，按功能划分store

## 权限管理

系统实现了基于角色的权限控制：
- 游客：浏览内容
- 注册用户：发布内容、评论、点赞等
- 版主：内容管理、置顶帖子等
- 管理员：系统管理和高级权限

## 本地开发与测试数据

为方便本地开发，系统内置了一些模拟数据和API响应：
- 用户可通过任意手机号+验证码"123456"登录
- 帖子ID 999提供测试帖子内容
- 帖子ID 888提供可编辑的测试帖子

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请遵循以下步骤：

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 协议

本项目采用MIT许可证 - 详情见LICENSE文件
