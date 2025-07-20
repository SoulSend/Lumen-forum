<template>
  <div :class="errorClasses">
    <div class="error-image">
      <el-icon v-if="icon" :size="iconSize">
        <component :is="icon" />
      </el-icon>
      <img v-else-if="image" :src="image" :alt="title" />
      <el-icon v-else :size="iconSize">
        <WarningFilled />
      </el-icon>
    </div>
    
    <div class="error-content">
      <h3 v-if="title" class="error-title">{{ title }}</h3>
      <p v-if="description" class="error-description">{{ description }}</p>
      
      <div v-if="showDetails && errorDetails" class="error-details">
        <el-collapse>
          <el-collapse-item title="错误详情" name="details">
            <pre class="error-details-content">{{ errorDetails }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
      
      <div v-if="$slots.default || showRetry" class="error-actions">
        <slot>
          <el-button v-if="showRetry" type="primary" @click="handleRetry">
            <el-icon><Refresh /></el-icon>
            {{ retryText }}
          </el-button>
          <el-button v-if="showHome" @click="handleGoHome">
            <el-icon><HomeFilled /></el-icon>
            {{ homeText }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { WarningFilled, Refresh, HomeFilled } from '@element-plus/icons-vue'

/**
 * 错误状态组件属性接口
 */
interface Props {
  /** 错误标题 */
  title?: string
  /** 错误描述文本 */
  description?: string
  /** 错误详情（用于开发调试） */
  errorDetails?: string
  /** 自定义图标组件 */
  icon?: any
  /** 自定义图片URL */
  image?: string
  /** 图标大小 */
  iconSize?: number
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 重试按钮文本 */
  retryText?: string
  /** 是否显示返回首页按钮 */
  showHome?: boolean
  /** 返回首页按钮文本 */
  homeText?: string
  /** 是否显示错误详情 */
  showDetails?: boolean
  /** 错误类型 */
  type?: 'network' | 'server' | 'permission' | 'notfound' | 'default'
  /** 组件大小 */
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  title: '出现错误',
  description: '请稍后重试或联系管理员',
  iconSize: 64,
  showRetry: true,
  retryText: '重试',
  showHome: false,
  homeText: '返回首页',
  showDetails: false,
  type: 'default',
  size: 'medium'
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 重试按钮点击事件 */
  retry: []
  /** 返回首页按钮点击事件 */
  goHome: []
}>()

const router = useRouter()

/**
 * 处理重试按钮点击
 */
const handleRetry = () => {
  emit('retry')
}

/**
 * 处理返回首页按钮点击
 */
const handleGoHome = () => {
  emit('goHome')
  router.push('/')
}

/**
 * 计算组件样式类
 */
const errorClasses = computed(() => [
  'base-error',
  `base-error--${props.type}`,
  `base-error--${props.size}`
])
</script>

<style scoped lang="scss">
.base-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  
  &--network {
    .error-image .el-icon {
      color: #f56c6c;
    }
  }
  
  &--server {
    .error-image .el-icon {
      color: #e6a23c;
    }
  }
  
  &--permission {
    .error-image .el-icon {
      color: #909399;
    }
  }
  
  &--notfound {
    .error-image .el-icon {
      color: #409eff;
    }
  }
  
  &--default {
    .error-image .el-icon {
      color: #f56c6c;
    }
  }
  
  &--small {
    padding: 20px 10px;
    
    .error-image {
      margin-bottom: 12px;
    }
    
    .error-title {
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .error-description {
      font-size: 12px;
      margin-bottom: 12px;
    }
  }
  
  &--medium {
    padding: 40px 20px;
    
    .error-image {
      margin-bottom: 16px;
    }
    
    .error-title {
      font-size: 16px;
      margin-bottom: 8px;
    }
    
    .error-description {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
  
  &--large {
    padding: 60px 30px;
    
    .error-image {
      margin-bottom: 24px;
    }
    
    .error-title {
      font-size: 18px;
      margin-bottom: 12px;
    }
    
    .error-description {
      font-size: 16px;
      margin-bottom: 24px;
    }
  }
}

.error-image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  img {
    max-width: 100%;
    height: auto;
  }
}

.error-content {
  max-width: 500px;
}

.error-title {
  margin: 0 0 8px 0;
  font-weight: 500;
  color: #303133;
}

.error-description {
  margin: 0 0 16px 0;
  line-height: 1.5;
  color: #606266;
}

.error-details {
  margin: 16px 0;
  text-align: left;
  
  .error-details-content {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    color: #606266;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
}

.error-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
