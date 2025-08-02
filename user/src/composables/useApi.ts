import { ref, computed, readonly } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

/**
 * API调用通用 Composable
 * 提供统一的API调用、错误处理和状态管理
 */
export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()
  const userStore = useUserStore()

  /**
   * 执行API调用
   * @param apiCall API调用函数
   * @param options 配置选项
   */
  const call = async <T>(
    apiCall: () => Promise<T>,
    options: {
      showLoading?: boolean
      showError?: boolean
      showSuccess?: boolean
      successMessage?: string
      errorMessage?: string
      requireAuth?: boolean
      onSuccess?: (data: T) => void
      onError?: (error: any) => void
    } = {}
  ): Promise<T | null> => {
    const {
      showLoading = true,
      showError = true,
      showSuccess = false,
      successMessage = '操作成功',
      errorMessage = '操作失败，请稍后再试',
      requireAuth = false,
      onSuccess,
      onError
    } = options

    // 检查认证状态
    if (requireAuth && !userStore.isAuthenticated) {
      ElMessage.warning('请先登录')
      router.push('/login')
      return null
    }

    if (showLoading) {
      loading.value = true
    }
    error.value = null

    try {
      const result = await apiCall()
      
      if (showSuccess) {
        ElMessage.success(successMessage)
      }
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err: any) {
      console.error('API call failed:', err)
      
      // 处理特定错误码
      if (err.response?.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        userStore.logout()
        router.push('/login')
        return null
      }
      
      if (err.response?.status === 403) {
        ElMessage.error('权限不足')
        return null
      }
      
      if (err.response?.status === 404) {
        ElMessage.error('请求的资源不存在')
        return null
      }
      
      const message = err.response?.data?.message || err.message || errorMessage
      error.value = message
      
      if (showError) {
        ElMessage.error(message)
      }
      
      if (onError) {
        onError(err)
      }
      
      return null
    } finally {
      if (showLoading) {
        loading.value = false
      }
    }
  }

  /**
   * 分页API调用
   * @param apiCall API调用函数
   * @param options 配置选项
   */
  const callPaginated = async <T>(
    apiCall: () => Promise<T>,
    options: {
      isLoadMore?: boolean
      onSuccess?: (data: T) => void
      onError?: (error: any) => void
    } = {}
  ): Promise<T | null> => {
    const { isLoadMore = false, onSuccess, onError } = options
    
    const loadingRef = isLoadMore ? ref(false) : loading
    loadingRef.value = true
    error.value = null

    try {
      const result = await apiCall()
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err: any) {
      console.error('Paginated API call failed:', err)
      
      const message = err.response?.data?.message || err.message || '加载失败'
      error.value = message
      ElMessage.error(message)
      
      if (onError) {
        onError(err)
      }
      
      return null
    } finally {
      loadingRef.value = false
    }
  }

  /**
   * 清除错误状态
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * 是否有错误
   */
  const hasError = computed(() => error.value !== null)

  return {
    loading: readonly(loading),
    error: readonly(error),
    hasError,
    call,
    callPaginated,
    clearError
  }
}

/**
 * 文件上传 Composable
 */
export function useFileUpload() {
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  /**
   * 上传文件
   * @param uploadFn 上传函数
   * @param options 配置选项
   */
  const upload = async <T>(
    uploadFn: () => Promise<T>,
    options: {
      onProgress?: (progress: number) => void
      onSuccess?: (result: T) => void
      onError?: (error: any) => void
      successMessage?: string
    } = {}
  ): Promise<T | null> => {
    const {
      onProgress,
      onSuccess,
      onError,
      successMessage = '上传成功'
    } = options

    uploading.value = true
    progress.value = 0
    error.value = null

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        if (progress.value < 90) {
          progress.value += 10
          if (onProgress) {
            onProgress(progress.value)
          }
        }
      }, 100)

      const result = await uploadFn()
      
      clearInterval(progressInterval)
      progress.value = 100
      
      if (onProgress) {
        onProgress(100)
      }
      
      ElMessage.success(successMessage)
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err: any) {
      console.error('File upload failed:', err)
      
      const message = err.response?.data?.message || err.message || '上传失败'
      error.value = message
      ElMessage.error(message)
      
      if (onError) {
        onError(err)
      }
      
      return null
    } finally {
      uploading.value = false
      progress.value = 0
    }
  }

  return {
    uploading: readonly(uploading),
    progress: readonly(progress),
    error: readonly(error),
    upload
  }
}
