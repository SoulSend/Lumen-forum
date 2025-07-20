<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="nativeType"
    @click="handleClick"
  >
    <el-icon v-if="loading" class="is-loading">
      <Loading />
    </el-icon>
    <el-icon v-else-if="icon && iconPosition === 'left'">
      <component :is="icon" />
    </el-icon>
    
    <span v-if="$slots.default" class="button-text">
      <slot />
    </span>
    
    <el-icon v-if="icon && iconPosition === 'right'">
      <component :is="icon" />
    </el-icon>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  loading?: boolean
  round?: boolean
  circle?: boolean
  icon?: any
  iconPosition?: 'left' | 'right'
  nativeType?: 'button' | 'submit' | 'reset'
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  round: false,
  circle: false,
  iconPosition: 'left',
  nativeType: 'button',
  block: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.type}`,
  `base-button--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-loading': props.loading,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-block': props.block
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
  
  // 尺寸变体
  &--large {
    padding: 12px 20px;
    font-size: 16px;
  }
  
  &--small {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  // 类型变体
  &--default {
    background-color: #ffffff;
    border-color: #dcdfe6;
    color: #606266;
    
    &:hover:not(.is-disabled) {
      background-color: #ecf5ff;
      border-color: #409eff;
      color: #409eff;
    }
  }
  
  &--primary {
    background-color: #409eff;
    border-color: #409eff;
    color: #ffffff;
    
    &:hover:not(.is-disabled) {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }
  
  &--success {
    background-color: #67c23a;
    border-color: #67c23a;
    color: #ffffff;
    
    &:hover:not(.is-disabled) {
      background-color: #85ce61;
      border-color: #85ce61;
    }
  }
  
  &--warning {
    background-color: #e6a23c;
    border-color: #e6a23c;
    color: #ffffff;
    
    &:hover:not(.is-disabled) {
      background-color: #ebb563;
      border-color: #ebb563;
    }
  }
  
  &--danger {
    background-color: #f56c6c;
    border-color: #f56c6c;
    color: #ffffff;
    
    &:hover:not(.is-disabled) {
      background-color: #f78989;
      border-color: #f78989;
    }
  }
  
  &--info {
    background-color: #909399;
    border-color: #909399;
    color: #ffffff;
    
    &:hover:not(.is-disabled) {
      background-color: #a6a9ad;
      border-color: #a6a9ad;
    }
  }
  
  &--text {
    background-color: transparent;
    border-color: transparent;
    color: #409eff;
    padding: 8px 12px;
    
    &:hover:not(.is-disabled) {
      background-color: #ecf5ff;
    }
  }
  
  // 状态变体
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.is-loading {
    cursor: not-allowed;
  }
  
  &.is-round {
    border-radius: 20px;
  }
  
  &.is-circle {
    border-radius: 50%;
    padding: 8px;
    width: 40px;
    height: 40px;
    
    &.base-button--large {
      width: 48px;
      height: 48px;
      padding: 12px;
    }
    
    &.base-button--small {
      width: 32px;
      height: 32px;
      padding: 6px;
    }
  }
  
  &.is-block {
    width: 100%;
  }
  
  .button-text {
    flex: 1;
  }
  
  .is-loading {
    animation: rotating 2s linear infinite;
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
