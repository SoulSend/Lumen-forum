import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '../services/api'
import type { Category } from '../types/forum'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取所有分类
  async function fetchCategories() {
    loading.value = true
    error.value = null
    
    try {
      const response = await get<Category[]>('/categories')
      categories.value = response
      return response
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取分类列表失败'
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
      const category = await get<Category>(`/categories/${id}`)
      return category
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取分类详情失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 获取分类下的帖子
  async function fetchCategoryPosts(id: number | string, params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const posts = await get(`/categories/${id}/posts`, params)
      return posts
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取分类下的帖子失败'
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