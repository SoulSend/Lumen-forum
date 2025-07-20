import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface LoadingState {
  id: string
  message?: string
  progress?: number
  type?: 'default' | 'upload' | 'download' | 'processing'
}

export const useLoadingStore = defineStore('loading', () => {
  // 状态
  const loadingStates = ref<Map<string, LoadingState>>(new Map())
  const globalLoading = ref(false)
  const globalMessage = ref('')

  // 计算属性
  const isLoading = computed(() => globalLoading.value || loadingStates.value.size > 0)
  const loadingCount = computed(() => loadingStates.value.size)
  const currentLoadings = computed(() => Array.from(loadingStates.value.values()))

  // 方法
  const startLoading = (id: string, options?: Omit<LoadingState, 'id'>) => {
    const state: LoadingState = {
      id,
      message: options?.message,
      progress: options?.progress,
      type: options?.type || 'default'
    }
    
    loadingStates.value.set(id, state)
    
    // 触发事件
    document.dispatchEvent(new CustomEvent('loading:start', { 
      detail: state 
    }))
  }

  const updateLoading = (id: string, updates: Partial<Omit<LoadingState, 'id'>>) => {
    const existing = loadingStates.value.get(id)
    if (existing) {
      const updated = { ...existing, ...updates }
      loadingStates.value.set(id, updated)
      
      // 触发事件
      document.dispatchEvent(new CustomEvent('loading:update', { 
        detail: updated 
      }))
    }
  }

  const stopLoading = (id: string) => {
    const state = loadingStates.value.get(id)
    if (state) {
      loadingStates.value.delete(id)
      
      // 触发事件
      document.dispatchEvent(new CustomEvent('loading:stop', { 
        detail: state 
      }))
    }
  }

  const setGlobalLoading = (loading: boolean, message?: string) => {
    globalLoading.value = loading
    globalMessage.value = message || ''
    
    // 触发事件
    document.dispatchEvent(new CustomEvent('loading:global', { 
      detail: { loading, message } 
    }))
  }

  const clearAllLoading = () => {
    loadingStates.value.clear()
    globalLoading.value = false
    globalMessage.value = ''
    
    // 触发事件
    document.dispatchEvent(new CustomEvent('loading:clear'))
  }

  // 便捷方法
  const withLoading = async <T>(
    id: string,
    asyncFn: () => Promise<T>,
    options?: Omit<LoadingState, 'id'>
  ): Promise<T> => {
    try {
      startLoading(id, options)
      const result = await asyncFn()
      return result
    } finally {
      stopLoading(id)
    }
  }

  const withGlobalLoading = async <T>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      setGlobalLoading(true, message)
      const result = await asyncFn()
      return result
    } finally {
      setGlobalLoading(false)
    }
  }

  // 进度更新方法
  const updateProgress = (id: string, progress: number, message?: string) => {
    updateLoading(id, { progress, message })
  }

  // 获取特定加载状态
  const getLoadingState = (id: string) => {
    return loadingStates.value.get(id)
  }

  // 检查是否正在加载
  const isLoadingById = (id: string) => {
    return loadingStates.value.has(id)
  }

  return {
    // 状态
    loadingStates: computed(() => loadingStates.value),
    globalLoading: computed(() => globalLoading.value),
    globalMessage: computed(() => globalMessage.value),
    
    // 计算属性
    isLoading,
    loadingCount,
    currentLoadings,
    
    // 方法
    startLoading,
    updateLoading,
    stopLoading,
    setGlobalLoading,
    clearAllLoading,
    withLoading,
    withGlobalLoading,
    updateProgress,
    getLoadingState,
    isLoadingById
  }
})

// 装饰器函数，用于自动处理加载状态
export const withLoadingDecorator = (
  loadingId: string,
  options?: Omit<LoadingState, 'id'>
) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      const loadingStore = useLoadingStore()
      
      try {
        loadingStore.startLoading(loadingId, options)
        const result = await originalMethod.apply(this, args)
        return result
      } finally {
        loadingStore.stopLoading(loadingId)
      }
    }
    
    return descriptor
  }
}

// 组合式函数，用于在组件中使用加载状态
export const useLoading = (id?: string) => {
  const store = useLoadingStore()
  
  const start = (options?: Omit<LoadingState, 'id'>) => {
    if (!id) {
      throw new Error('Loading ID is required')
    }
    store.startLoading(id, options)
  }
  
  const stop = () => {
    if (!id) {
      throw new Error('Loading ID is required')
    }
    store.stopLoading(id)
  }
  
  const update = (updates: Partial<Omit<LoadingState, 'id'>>) => {
    if (!id) {
      throw new Error('Loading ID is required')
    }
    store.updateLoading(id, updates)
  }
  
  const isLoading = computed(() => {
    if (!id) return false
    return store.isLoadingById(id)
  })
  
  const state = computed(() => {
    if (!id) return null
    return store.getLoadingState(id)
  })
  
  return {
    start,
    stop,
    update,
    isLoading,
    state,
    withLoading: store.withLoading
  }
}
