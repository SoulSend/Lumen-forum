# 项目优化使用指南

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```
访问: http://localhost:5173/

### 生产构建
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📦 新增功能使用

### 1. 通用UI组件库

#### BaseButton 组件
```vue
<template>
  <BaseButton 
    type="primary" 
    size="large" 
    :loading="isLoading"
    @click="handleClick"
  >
    点击我
  </BaseButton>
</template>

<script setup>
import { BaseButton } from '@/components/ui'
</script>
```

#### BaseCard 组件
```vue
<template>
  <BaseCard 
    title="卡片标题"
    shadow="hover"
    :loading="isLoading"
  >
    <template #extra>
      <el-button>操作</el-button>
    </template>
    
    卡片内容
    
    <template #footer>
      <div>底部内容</div>
    </template>
  </BaseCard>
</template>

<script setup>
import { BaseCard } from '@/components/ui'
</script>
```

#### SkeletonLoader 组件
```vue
<template>
  <!-- 帖子骨架屏 -->
  <SkeletonLoader v-if="loading" type="post" :animated="true" />
  
  <!-- 评论骨架屏 -->
  <SkeletonLoader v-if="loading" type="comment" />
  
  <!-- 用户骨架屏 -->
  <SkeletonLoader v-if="loading" type="user" />
  
  <!-- 自定义骨架屏 -->
  <SkeletonLoader v-if="loading" type="custom" :lines="5" />
</template>

<script setup>
import { SkeletonLoader } from '@/components/ui'
</script>
```

#### LoadingSpinner 组件
```vue
<template>
  <!-- 默认加载器 -->
  <LoadingSpinner />
  
  <!-- 带文字的加载器 -->
  <LoadingSpinner text="加载中..." type="circle" />
  
  <!-- 全屏遮罩加载器 -->
  <LoadingSpinner :overlay="true" text="处理中..." />
</template>

<script setup>
import { LoadingSpinner } from '@/components/ui'
</script>
```

### 2. 加载状态管理

```vue
<script setup>
import { useLoading } from '@/stores/loadingStore'

// 使用加载状态
const { start, stop, isLoading, withLoading } = useLoading('api-call')

// 手动控制
const handleSubmit = async () => {
  start({ message: '提交中...', progress: 0 })
  try {
    // API调用
    await submitData()
  } finally {
    stop()
  }
}

// 自动控制
const handleAutoSubmit = () => {
  withLoading('submit', async () => {
    await submitData()
  }, { message: '提交中...' })
}
</script>
```

### 3. 懒加载指令

```vue
<template>
  <!-- 图片懒加载 -->
  <img v-lazy="imageSrc" alt="描述" />
  
  <!-- 带配置的懒加载 -->
  <img v-lazy="{
    src: imageSrc,
    loading: '/loading.gif',
    error: '/error.png'
  }" alt="描述" />
  
  <!-- 背景图懒加载 -->
  <div v-lazy="backgroundImage" class="bg-container"></div>
</template>
```

### 4. 错误处理

```vue
<template>
  <!-- 错误边界 -->
  <ErrorBoundary @retry="handleRetry">
    <YourComponent />
  </ErrorBoundary>
</template>

<script setup>
import { handleError, handleNetworkError } from '@/utils/errorHandler'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'

// 手动错误处理
const handleApiCall = async () => {
  try {
    await apiCall()
  } catch (error) {
    handleNetworkError(error, 'API调用失败')
  }
}

// 业务错误处理
const handleBusinessLogic = () => {
  try {
    // 业务逻辑
  } catch (error) {
    handleError(error, '业务处理')
  }
}
</script>
```

### 5. 响应式工具

```vue
<script setup>
import { useResponsive, useResponsiveValue } from '@/utils/responsive'

// 响应式断点
const { isMobile, isTablet, isDesktop, currentBreakpoint } = useResponsive()

// 响应式值
const fontSize = useResponsiveValue({
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px'
}, '14px')

// 响应式样式
const containerStyle = computed(() => ({
  padding: isMobile.value ? '16px' : '32px',
  fontSize: fontSize.value
}))
</script>
```

## 🛠️ 开发工具

### 新增脚本命令

```bash
# 代码检查和格式化
npm run lint
npm run format

# 构建分析
npm run analyze

# 清理缓存
npm run clean

# 依赖管理
npm run deps:update
npm run deps:check
```

### 构建分析

运行 `npm run analyze` 后会生成 `dist/stats.html` 文件，可以分析：
- Bundle大小分布
- 依赖关系图
- 重复代码检测
- 压缩效果

## 📱 响应式断点

```scss
// 断点定义
$breakpoints: (
  xs: 480px,   // 手机
  sm: 768px,   // 平板
  md: 992px,   // 小桌面
  lg: 1200px,  // 大桌面
  xl: 1920px   // 超大屏
);
```

## 🎨 主题系统

```javascript
// 使用主题变量
import { UI_THEME } from '@/components/ui'

// 颜色
UI_THEME.colors.primary     // #409eff
UI_THEME.colors.success     // #67c23a
UI_THEME.colors.warning     // #e6a23c

// 间距
UI_THEME.spacing.sm         // 8px
UI_THEME.spacing.md         // 12px
UI_THEME.spacing.lg         // 16px

// 字体
UI_THEME.fontSize.base      // 14px
UI_THEME.fontSize.lg        // 16px
```

## 🔧 性能优化建议

### 1. 图片优化
- 使用 `v-lazy` 指令进行懒加载
- 为高DPI屏幕准备@2x图片
- 使用WebP格式（如果支持）

### 2. 组件优化
- 使用 `SkeletonLoader` 改善加载体验
- 合理使用 `v-show` vs `v-if`
- 避免在模板中使用复杂计算

### 3. 路由优化
- 所有路由已配置懒加载
- 重要页面已配置预加载
- 使用路由缓存（keep-alive）

### 4. 状态管理
- 使用 Pinia 进行状态管理
- 合理拆分 store 模块
- 避免不必要的响应式数据

## 🐛 常见问题

### Q: 组件导入失败
A: 确保从正确路径导入：
```javascript
// ✅ 正确
import { BaseButton } from '@/components/ui'

// ❌ 错误
import BaseButton from '@/components/ui/BaseButton.vue'
```

### Q: 懒加载不生效
A: 检查图片路径和指令使用：
```vue
<!-- ✅ 正确 -->
<img v-lazy="'/images/photo.jpg'" alt="photo" />

<!-- ❌ 错误 -->
<img v-lazy="imageUrl" alt="photo" />  <!-- imageUrl未定义 -->
```

### Q: 响应式工具不工作
A: 确保在组件内使用：
```javascript
// ✅ 正确 - 在setup中使用
export default {
  setup() {
    const { isMobile } = useResponsive()
    return { isMobile }
  }
}

// ❌ 错误 - 在组件外使用
const { isMobile } = useResponsive()
```

## 📚 更多资源

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)

---

如有问题，请查看 `PROJECT_OPTIMIZATION_SUMMARY.md` 了解详细的优化内容。
