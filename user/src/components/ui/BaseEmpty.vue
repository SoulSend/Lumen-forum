<template>
  <div class="base-empty">
    <div class="empty-image">
      <el-icon v-if="icon" :size="iconSize">
        <component :is="icon" />
      </el-icon>
      <img v-else-if="image" :src="image" :alt="description" />
      <el-icon v-else :size="iconSize">
        <Box />
      </el-icon>
    </div>
    
    <div class="empty-content">
      <h3 v-if="title" class="empty-title">{{ title }}</h3>
      <p v-if="description" class="empty-description">{{ description }}</p>
      
      <div v-if="$slots.default || showAction" class="empty-actions">
        <slot>
          <el-button v-if="showAction" :type="actionType" @click="handleAction">
            {{ actionText }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Box } from '@element-plus/icons-vue'

/**
 * 空状态组件属性接口
 */
interface Props {
  /** 空状态标题 */
  title?: string
  /** 空状态描述文本 */
  description?: string
  /** 自定义图标组件 */
  icon?: any
  /** 自定义图片URL */
  image?: string
  /** 图标大小 */
  iconSize?: number
  /** 是否显示操作按钮 */
  showAction?: boolean
  /** 操作按钮文本 */
  actionText?: string
  /** 操作按钮类型 */
  actionType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  /** 组件大小 */
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  title: '暂无数据',
  description: '当前没有可显示的内容',
  iconSize: 64,
  showAction: false,
  actionText: '刷新',
  actionType: 'primary',
  size: 'medium'
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 操作按钮点击事件 */
  action: []
}>()

/**
 * 处理操作按钮点击
 */
const handleAction = () => {
  emit('action')
}

/**
 * 计算组件样式类
 */
const emptyClasses = computed(() => [
  'base-empty',
  `base-empty--${props.size}`
])
</script>

<style scoped lang="scss">
.base-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #909399;
  
  &--small {
    padding: 20px 10px;
    
    .empty-image {
      margin-bottom: 12px;
    }
    
    .empty-title {
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .empty-description {
      font-size: 12px;
      margin-bottom: 12px;
    }
  }
  
  &--medium {
    padding: 40px 20px;
    
    .empty-image {
      margin-bottom: 16px;
    }
    
    .empty-title {
      font-size: 16px;
      margin-bottom: 8px;
    }
    
    .empty-description {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
  
  &--large {
    padding: 60px 30px;
    
    .empty-image {
      margin-bottom: 24px;
    }
    
    .empty-title {
      font-size: 18px;
      margin-bottom: 12px;
    }
    
    .empty-description {
      font-size: 16px;
      margin-bottom: 24px;
    }
  }
}

.empty-image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  img {
    max-width: 100%;
    height: auto;
    opacity: 0.6;
  }
  
  .el-icon {
    opacity: 0.6;
  }
}

.empty-content {
  max-width: 400px;
}

.empty-title {
  margin: 0 0 8px 0;
  font-weight: 500;
  color: #606266;
}

.empty-description {
  margin: 0 0 16px 0;
  line-height: 1.5;
  color: #909399;
}

.empty-actions {
  margin-top: 16px;
}
</style>
