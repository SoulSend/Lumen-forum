<template>
  <div :class="spinnerClasses">
    <div v-if="type === 'dots'" class="spinner-dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    
    <div v-else-if="type === 'circle'" class="spinner-circle">
      <svg viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray="31.416"
          stroke-dashoffset="31.416"
        />
      </svg>
    </div>
    
    <div v-else-if="type === 'pulse'" class="spinner-pulse">
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
    </div>
    
    <div v-else class="spinner-default">
      <div class="spinner-border"></div>
    </div>
    
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'default' | 'dots' | 'circle' | 'pulse'
  size?: 'small' | 'default' | 'large'
  color?: string
  text?: string
  overlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  color: '#409eff',
  overlay: false
})

const spinnerClasses = computed(() => [
  'loading-spinner',
  `loading-spinner--${props.size}`,
  {
    'loading-spinner--overlay': props.overlay
  }
])
</script>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  &--overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  }
  
  &--small {
    .spinner-default,
    .spinner-circle {
      width: 20px;
      height: 20px;
    }
    
    .spinner-dots .dot {
      width: 4px;
      height: 4px;
    }
    
    .spinner-pulse .pulse-ring {
      width: 20px;
      height: 20px;
    }
  }
  
  &--large {
    .spinner-default,
    .spinner-circle {
      width: 48px;
      height: 48px;
    }
    
    .spinner-dots .dot {
      width: 12px;
      height: 12px;
    }
    
    .spinner-pulse .pulse-ring {
      width: 48px;
      height: 48px;
    }
  }
}

.spinner-default {
  width: 32px;
  height: 32px;
  
  .spinner-border {
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid v-bind(color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.spinner-dots {
  display: flex;
  gap: 4px;
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: v-bind(color);
    border-radius: 50%;
    animation: dots 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
}

.spinner-circle {
  width: 32px;
  height: 32px;
  color: v-bind(color);
  
  svg {
    width: 100%;
    height: 100%;
    animation: rotate 2s linear infinite;
    
    circle {
      animation: dash 1.5s ease-in-out infinite;
    }
  }
}

.spinner-pulse {
  position: relative;
  width: 32px;
  height: 32px;
  
  .pulse-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid v-bind(color);
    border-radius: 50%;
    animation: pulse 1.5s ease-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.5s; }
    &:nth-child(3) { animation-delay: 1s; }
  }
}

.spinner-text {
  margin: 0;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
