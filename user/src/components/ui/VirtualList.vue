<template>
  <div ref="containerRef" class="virtual-list" @scroll="handleScroll">
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    
    <div class="virtual-list-content" :style="contentStyle">
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item.data)"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item.data" :index="item.index">
          {{ item.data }}
        </slot>
      </div>
    </div>
    
    <!-- 加载更多指示器 -->
    <div v-if="loading" class="virtual-list-loading">
      <LoadingSpinner size="small" text="加载中..." />
    </div>
    
    <!-- 无更多数据提示 -->
    <div v-if="!hasMore && items.length > 0" class="virtual-list-end">
      <span>没有更多数据了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { LoadingSpinner } from './index'

/**
 * 虚拟列表组件属性接口
 */
interface Props {
  /** 列表数据 */
  items: any[]
  /** 每项高度（固定高度） */
  itemHeight: number
  /** 容器高度 */
  containerHeight?: number
  /** 缓冲区大小（渲染额外的项目数） */
  bufferSize?: number
  /** 获取项目唯一键的函数 */
  itemKey?: string | ((item: any) => string | number)
  /** 是否正在加载 */
  loading?: boolean
  /** 是否还有更多数据 */
  hasMore?: boolean
  /** 滚动到底部的阈值 */
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  containerHeight: 400,
  bufferSize: 5,
  itemKey: 'id',
  loading: false,
  hasMore: true,
  threshold: 50
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 滚动到底部事件 */
  loadMore: []
  /** 滚动事件 */
  scroll: [scrollTop: number]
}>()

// 响应式数据
const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

/**
 * 获取项目的唯一键
 */
const getItemKey = (item: any): string | number => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  return item[props.itemKey] || item.id || Math.random()
}

/**
 * 计算总高度
 */
const totalHeight = computed(() => {
  return props.items.length * props.itemHeight
})

/**
 * 计算可见区域的起始和结束索引
 */
const visibleRange = computed(() => {
  const containerHeight = props.containerHeight
  const startIndex = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.bufferSize)
  const endIndex = Math.min(
    props.items.length - 1,
    Math.floor((scrollTop.value + containerHeight) / props.itemHeight) + props.bufferSize
  )
  
  return { startIndex, endIndex }
})

/**
 * 计算可见的项目
 */
const visibleItems = computed(() => {
  const { startIndex, endIndex } = visibleRange.value
  const items = []
  
  for (let i = startIndex; i <= endIndex; i++) {
    if (props.items[i]) {
      items.push({
        data: props.items[i],
        index: i
      })
    }
  }
  
  return items
})

/**
 * 计算内容区域样式
 */
const contentStyle = computed(() => {
  const { startIndex } = visibleRange.value
  const offsetY = startIndex * props.itemHeight
  
  return {
    transform: `translateY(${offsetY}px)`
  }
})

/**
 * 处理滚动事件
 */
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
  
  emit('scroll', scrollTop.value)
  
  // 检查是否需要加载更多
  const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = target
  if (
    props.hasMore &&
    !props.loading &&
    scrollHeight - currentScrollTop - clientHeight <= props.threshold
  ) {
    emit('loadMore')
  }
}

/**
 * 滚动到指定位置
 */
const scrollTo = (index: number) => {
  if (containerRef.value) {
    const targetScrollTop = index * props.itemHeight
    containerRef.value.scrollTop = targetScrollTop
  }
}

/**
 * 滚动到顶部
 */
const scrollToTop = () => {
  scrollTo(0)
}

/**
 * 滚动到底部
 */
const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }
}

// 监听数据变化，重置滚动位置
watch(() => props.items.length, (newLength, oldLength) => {
  // 如果是新数据（长度变为0），重置滚动位置
  if (newLength === 0 || (oldLength > 0 && newLength < oldLength)) {
    nextTick(() => {
      scrollToTop()
    })
  }
})

// 暴露方法给父组件
defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom
})
</script>

<style scoped lang="scss">
.virtual-list {
  position: relative;
  overflow-y: auto;
  height: v-bind('props.containerHeight + "px"');
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
}

.virtual-list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-list-item {
  box-sizing: border-box;
}

.virtual-list-loading {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

.virtual-list-end {
  padding: 16px;
  text-align: center;
  color: #909399;
  font-size: 14px;
  border-top: 1px solid #ebeef5;
}
</style>
