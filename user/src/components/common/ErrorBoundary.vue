<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-content">
      <div class="error-icon">
        <el-icon size="48" color="#f56c6c">
          <WarningFilled />
        </el-icon>
      </div>
      
      <div class="error-info">
        <h3 class="error-title">{{ errorTitle }}</h3>
        <p class="error-message">{{ errorMessage }}</p>
        
        <div v-if="showDetails && errorDetails" class="error-details">
          <el-collapse>
            <el-collapse-item title="错误详情" name="details">
              <pre class="error-stack">{{ errorDetails }}</pre>
            </el-collapse-item>
          </el-collapse>
        </div>
        
        <div class="error-actions">
          <base-button type="primary" @click="handleRetry">
            <el-icon><Refresh /></el-icon>
            重试
          </base-button>
          
          <base-button @click="handleGoHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </base-button>
          
          <base-button v-if="!showDetails" type="text" @click="showDetails = true">
            查看详情
          </base-button>
        </div>
      </div>
    </div>
    
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { WarningFilled, Refresh, HomeFilled } from '@element-plus/icons-vue'
import { BaseButton } from '../ui'

interface Props {
  fallbackTitle?: string
  fallbackMessage?: string
  showRetry?: boolean
  onRetry?: () => void | Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  fallbackTitle: '页面出现错误',
  fallbackMessage: '抱歉，页面遇到了一些问题。请尝试刷新页面或返回首页。',
  showRetry: true
})

const emit = defineEmits<{
  error: [error: Error, instance: any, info: string]
  retry: []
}>()

const router = useRouter()

const hasError = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')
const errorDetails = ref('')
const showDetails = ref(false)

// 捕获子组件错误
onErrorCaptured((error: Error, instance: any, info: string) => {
  console.error('ErrorBoundary caught error:', error, instance, info)
  
  hasError.value = true
  errorTitle.value = props.fallbackTitle
  errorMessage.value = getErrorMessage(error)
  errorDetails.value = `${error.stack}\n\nComponent Info: ${info}`
  
  emit('error', error, instance, info)
  
  // 阻止错误继续向上传播
  return false
})

// 监听全局未捕获的错误
onMounted(() => {
  const handleGlobalError = (event: ErrorEvent) => {
    if (!hasError.value) {
      hasError.value = true
      errorTitle.value = '应用程序错误'
      errorMessage.value = getErrorMessage(event.error || new Error(event.message))
      errorDetails.value = event.error?.stack || event.message
    }
  }
  
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (!hasError.value) {
      hasError.value = true
      errorTitle.value = '网络请求错误'
      errorMessage.value = getErrorMessage(event.reason)
      errorDetails.value = event.reason?.stack || String(event.reason)
    }
  }
  
  window.addEventListener('error', handleGlobalError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  
  return () => {
    window.removeEventListener('error', handleGlobalError)
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }
})

const getErrorMessage = (error: any): string => {
  if (!error) return props.fallbackMessage
  
  // 网络错误
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network')) {
    return '网络连接失败，请检查您的网络连接后重试。'
  }
  
  // API错误
  if (error.response?.status) {
    const status = error.response.status
    switch (status) {
      case 401:
        return '登录已过期，请重新登录。'
      case 403:
        return '您没有权限访问此内容。'
      case 404:
        return '请求的内容不存在。'
      case 500:
        return '服务器内部错误，请稍后重试。'
      default:
        return `请求失败 (${status})，请稍后重试。`
    }
  }
  
  // 其他错误
  if (error.message) {
    return error.message
  }
  
  return props.fallbackMessage
}

const handleRetry = async () => {
  try {
    if (props.onRetry) {
      await props.onRetry()
    } else {
      // 默认重试：重新加载当前页面
      window.location.reload()
    }
    
    // 重置错误状态
    hasError.value = false
    showDetails.value = false
    emit('retry')
  } catch (error) {
    ElMessage.error('重试失败，请稍后再试')
  }
}

const handleGoHome = () => {
  router.push('/')
}

// 暴露重置方法
const reset = () => {
  hasError.value = false
  showDetails.value = false
  errorTitle.value = ''
  errorMessage.value = ''
  errorDetails.value = ''
}

defineExpose({
  reset,
  hasError
})
</script>

<style scoped lang="scss">
.error-boundary {
  min-height: 200px;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 400px;
}

.error-icon {
  margin-bottom: 24px;
}

.error-info {
  max-width: 600px;
  width: 100%;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.error-message {
  font-size: 16px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.error-details {
  margin: 24px 0;
  text-align: left;
  
  .error-stack {
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 12px;
    font-size: 12px;
    color: #606266;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-content {
    padding: 20px 16px;
    min-height: 300px;
  }
  
  .error-title {
    font-size: 20px;
  }
  
  .error-message {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    
    .base-button {
      width: 100%;
      max-width: 200px;
    }
  }
}
</style>
