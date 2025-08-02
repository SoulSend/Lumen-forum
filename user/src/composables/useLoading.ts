import { ref, computed, readonly } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 加载状态管理 Composable
 * 提供统一的加载状态管理和错误处理
 */
export function useLoading() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 执行异步操作并管理加载状态
   * @param asyncFn 异步函数
   * @param options 配置选项
   */
  const execute = async <T>(
    asyncFn: () => Promise<T>,
    options: {
      showError?: boolean
      errorMessage?: string
      showSuccess?: boolean
      successMessage?: string
    } = {}
  ): Promise<T | null> => {
    const {
      showError = true,
      errorMessage = '操作失败，请稍后再试',
      showSuccess = false,
      successMessage = '操作成功'
    } = options

    loading.value = true
    error.value = null

    try {
      const result = await asyncFn()
      
      if (showSuccess) {
        ElMessage.success(successMessage)
      }
      
      return result
    } catch (err: any) {
      console.error('Operation failed:', err)
      error.value = err.message || errorMessage
      
      if (showError) {
        ElMessage.error(error.value)
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 清除错误状态
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * 设置加载状态
   */
  const setLoading = (state: boolean) => {
    loading.value = state
  }

  /**
   * 是否有错误
   */
  const hasError = computed(() => error.value !== null)

  return {
    loading: readonly(loading),
    error: readonly(error),
    hasError,
    execute,
    clearError,
    setLoading
  }
}

/**
 * 分页加载状态管理 Composable
 */
export function usePaginatedLoading() {
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)

  /**
   * 执行分页加载
   * @param asyncFn 异步函数
   * @param isLoadMore 是否为加载更多
   */
  const execute = async <T>(
    asyncFn: () => Promise<T>,
    isLoadMore = false
  ): Promise<T | null> => {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
    }
    
    error.value = null

    try {
      const result = await asyncFn()
      return result
    } catch (err: any) {
      console.error('Paginated operation failed:', err)
      error.value = err.message || '加载失败，请稍后再试'
      ElMessage.error(error.value)
      return null
    } finally {
      if (isLoadMore) {
        loadingMore.value = false
      } else {
        loading.value = false
      }
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    loading.value = false
    loadingMore.value = false
    error.value = null
    hasMore.value = true
  }

  return {
    loading: readonly(loading),
    loadingMore: readonly(loadingMore),
    error: readonly(error),
    hasMore,
    execute,
    reset
  }
}

/**
 * 表单提交状态管理 Composable
 */
export function useFormSubmit() {
  const submitting = ref(false)
  const error = ref<string | null>(null)

  /**
   * 执行表单提交
   * @param submitFn 提交函数
   * @param options 配置选项
   */
  const submit = async <T>(
    submitFn: () => Promise<T>,
    options: {
      successMessage?: string
      errorMessage?: string
      onSuccess?: (result: T) => void
      onError?: (error: any) => void
    } = {}
  ): Promise<boolean> => {
    const {
      successMessage = '提交成功',
      errorMessage = '提交失败，请稍后再试',
      onSuccess,
      onError
    } = options

    submitting.value = true
    error.value = null

    try {
      const result = await submitFn()
      
      ElMessage.success(successMessage)
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return true
    } catch (err: any) {
      console.error('Form submit failed:', err)
      error.value = err.message || errorMessage
      
      ElMessage.error(error.value)
      
      if (onError) {
        onError(err)
      }
      
      return false
    } finally {
      submitting.value = false
    }
  }

  return {
    submitting: readonly(submitting),
    error: readonly(error),
    submit
  }
}
