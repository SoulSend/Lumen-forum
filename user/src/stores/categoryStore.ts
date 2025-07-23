import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryApi, postApi } from '../services/api'
import type { Category } from '../types/forum'
import { ErrorHandler } from '../utils/errorHandler'
import { ERROR_MESSAGES } from '../constants'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 数据映射函数：将API响应映射为前端Category对象
  const mapApiCategoryToCategory = (apiCategory: any): Category => {
    return {
      // API文档标准字段
      id: apiCategory.id,
      name: apiCategory.name,
      description: apiCategory.description,
      icon: apiCategory.icon,
      parent: apiCategory.parent,
      postCount: apiCategory.postCount ?? 0,
      displayOrder: apiCategory.displayOrder ?? 0,

      // SQL表字段（如果API返回）
      deleted: apiCategory.deleted,
      createdAt: apiCategory.createdAt,
      updatedAt: apiCategory.updatedAt,

      // 前端扩展字段
      children: apiCategory.children || [],
      slug: apiCategory.slug

      // 兼容旧字段名（仅映射到已知属性）
      // 如果需要兼容旧字段名，请在 Category 类型中添加这些属性
    }
  }

  // 获取所有分类
  async function fetchCategories() {
    loading.value = true
    error.value = null

    try {
      const response = await categoryApi.getCategories()
      // 使用映射函数转换数据
      categories.value = (response || []).map(mapApiCategoryToCategory)
      return categories.value
    } catch (e: any) {
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.FETCH_CATEGORIES_FAILED
      ErrorHandler.showError(errorInfo)
      return null
    } finally {
      loading.value = false
    }
  }

  // 获取单个分类详情
  async function fetchCategory(id: number | string) {
    loading.value = true
    error.value = null

    try {
      const apiCategory = await categoryApi.getCategoryById(id)
      const category = mapApiCategoryToCategory(apiCategory)
      return category
    } catch (e: any) {
      error.value = e?.message || '获取分类详情失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 获取分类下的帖子 - 根据API文档更新参数传递方式
  async function fetchCategoryPosts(id: number | string, params: { page?: number; size?: number } = {}) {
    loading.value = true
    error.value = null

    try {
      const posts = await postApi.getCategoryPosts(id, params.page || 0, params.size || 10)
      return posts
    } catch (e: any) {
      error.value = e?.message || '获取分类下的帖子失败'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategory,
    fetchCategoryPosts
  }
}) 