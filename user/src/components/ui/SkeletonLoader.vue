<template>
  <div :class="skeletonClasses">
    <div v-if="type === 'post'" class="skeleton-post">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
          <div class="skeleton-date"></div>
        </div>
        <div class="skeleton-text">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div class="skeleton-stats">
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="type === 'comment'" class="skeleton-comment">
      <div class="skeleton-avatar small"></div>
      <div class="skeleton-content">
        <div class="skeleton-username"></div>
        <div class="skeleton-text">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="type === 'user'" class="skeleton-user">
      <div class="skeleton-avatar large"></div>
      <div class="skeleton-content">
        <div class="skeleton-username large"></div>
        <div class="skeleton-bio">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div class="skeleton-stats">
          <div class="skeleton-stat"></div>
          <div class="skeleton-stat"></div>
        </div>
      </div>
    </div>
    
    <div v-else class="skeleton-custom">
      <div
        v-for="(line, index) in lines"
        :key="index"
        class="skeleton-line"
        :style="{ width: getLineWidth(index) }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'post' | 'comment' | 'user' | 'custom'
  lines?: number
  animated?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'custom',
  lines: 3,
  animated: true,
  loading: true
})

const skeletonClasses = computed(() => [
  'skeleton-loader',
  {
    'skeleton-loader--animated': props.animated,
    'skeleton-loader--loading': props.loading
  }
])

const getLineWidth = (index: number) => {
  const widths = ['100%', '90%', '75%', '85%', '60%']
  return widths[index % widths.length]
}
</script>

<style scoped lang="scss">
.skeleton-loader {
  &--animated {
    .skeleton-avatar,
    .skeleton-line,
    .skeleton-title,
    .skeleton-username,
    .skeleton-tag,
    .skeleton-date,
    .skeleton-stat,
    .skeleton-bio {
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.6),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }
    }
  }
}

.skeleton-post {
  display: flex;
  gap: 12px;
  padding: 16px;
  
  .skeleton-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .skeleton-meta {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .skeleton-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 8px 0;
  }
  
  .skeleton-stats {
    display: flex;
    gap: 16px;
  }
}

.skeleton-comment {
  display: flex;
  gap: 8px;
  padding: 12px;
  
  .skeleton-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .skeleton-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}

.skeleton-user {
  display: flex;
  gap: 16px;
  padding: 20px;
  align-items: center;
  
  .skeleton-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .skeleton-bio {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 8px 0;
  }
  
  .skeleton-stats {
    display: flex;
    gap: 20px;
  }
}

.skeleton-custom {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 基础元素样式
.skeleton-avatar {
  background-color: #f0f0f0;
  border-radius: 50%;
  flex-shrink: 0;
  
  &:not(.small):not(.large) {
    width: 40px;
    height: 40px;
  }
  
  &.small {
    width: 32px;
    height: 32px;
  }
  
  &.large {
    width: 60px;
    height: 60px;
  }
}

.skeleton-line {
  height: 16px;
  background-color: #f0f0f0;
  border-radius: 4px;
  
  &.short {
    width: 60% !important;
  }
}

.skeleton-title {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  width: 80%;
}

.skeleton-username {
  height: 16px;
  background-color: #f0f0f0;
  border-radius: 4px;
  width: 120px;
  
  &.large {
    height: 18px;
    width: 150px;
  }
}

.skeleton-tag {
  height: 20px;
  width: 60px;
  background-color: #f0f0f0;
  border-radius: 12px;
}

.skeleton-date {
  height: 14px;
  width: 80px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.skeleton-stat {
  height: 16px;
  width: 50px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// 深色主题支持
@media (prefers-color-scheme: dark) {
  .skeleton-avatar,
  .skeleton-line,
  .skeleton-title,
  .skeleton-username,
  .skeleton-tag,
  .skeleton-date,
  .skeleton-stat {
    background-color: #2d2d2d;
  }
  
  .skeleton-loader--animated {
    .skeleton-avatar,
    .skeleton-line,
    .skeleton-title,
    .skeleton-username,
    .skeleton-tag,
    .skeleton-date,
    .skeleton-stat {
      &::after {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
      }
    }
  }
}
</style>
