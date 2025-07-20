<template>
  <div :class="cardClasses" :style="cardStyles">
    <div v-if="$slots.header || title" class="base-card__header">
      <slot name="header">
        <h3 v-if="title" class="base-card__title">{{ title }}</h3>
      </slot>
      <div v-if="$slots.extra" class="base-card__extra">
        <slot name="extra" />
      </div>
    </div>
    
    <div class="base-card__body" :style="bodyStyles">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  shadow?: 'always' | 'hover' | 'never'
  bodyPadding?: string | number
  headerPadding?: string | number
  footerPadding?: string | number
  bordered?: boolean
  hoverable?: boolean
  loading?: boolean
  size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'always',
  bodyPadding: '20px',
  headerPadding: '20px',
  footerPadding: '20px',
  bordered: true,
  hoverable: false,
  loading: false,
  size: 'default'
})

const cardClasses = computed(() => [
  'base-card',
  `base-card--${props.size}`,
  `base-card--shadow-${props.shadow}`,
  {
    'base-card--bordered': props.bordered,
    'base-card--hoverable': props.hoverable,
    'is-loading': props.loading
  }
])

const cardStyles = computed(() => ({}))

const bodyStyles = computed(() => ({
  padding: typeof props.bodyPadding === 'number' ? `${props.bodyPadding}px` : props.bodyPadding
}))
</script>

<style scoped lang="scss">
.base-card {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  &--bordered {
    border: 1px solid #ebeef5;
  }
  
  &--hoverable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  &--shadow-always {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  &--shadow-hover {
    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  
  &--shadow-never {
    box-shadow: none;
  }
  
  &--small {
    .base-card__header {
      padding: 12px 16px;
    }
    
    .base-card__body {
      padding: 12px 16px;
    }
    
    .base-card__footer {
      padding: 12px 16px;
    }
  }
  
  &--large {
    .base-card__header {
      padding: 24px 32px;
    }
    
    .base-card__body {
      padding: 24px 32px;
    }
    
    .base-card__footer {
      padding: 24px 32px;
    }
  }
  
  &.is-loading {
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: loading 1.5s infinite;
      z-index: 1;
    }
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    background-color: #fafafa;
  }
  
  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
  
  &__extra {
    color: #909399;
  }
  
  &__body {
    padding: 20px;
    color: #606266;
    line-height: 1.6;
  }
  
  &__footer {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    background-color: #fafafa;
  }
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
