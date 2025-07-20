import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postApi } from '../services/api'
import type { Post } from '../types/forum'
import { ErrorHandler } from '../utils/errorHandler'
import { ERROR_MESSAGES, API_CONFIG } from '../constants'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0
  })

  // 数据映射函数：将API响应映射为前端Post对象
  const mapApiPostToPost = (apiPost: any): Post => {
    return {
      // API文档标准字段
      id: apiPost.id,
      title: apiPost.title,
      content: apiPost.content,
      userId: apiPost.userId,
      categoryId: apiPost.categoryId,
      viewCount: apiPost.viewCount ?? 0,
      likeCount: apiPost.likeCount ?? 0,
      commentCount: apiPost.commentCount ?? 0,
      isPinned: apiPost.isPinned ?? false,
      isFeatured: apiPost.isFeatured ?? false,
      isSolved: apiPost.isSolved ?? false,
      isRecommended: apiPost.isRecommended ?? false,
      solutionCommentId: apiPost.solutionCommentId,

      // SQL表字段（如果API返回）
      deleted: apiPost.deleted,
      createdAt: apiPost.createdAt,
      updatedAt: apiPost.updatedAt,

      // 关联对象
      user: apiPost.user,
      category: apiPost.category,
      tags: apiPost.tags || [],

      // 兼容旧字段名
      created_at: apiPost.created_at || apiPost.createdAt,
      updated_at: apiPost.updated_at || apiPost.updatedAt,
      user_id: apiPost.user_id || apiPost.userId,
      category_id: apiPost.category_id || apiPost.categoryId,
      view_count: apiPost.view_count || apiPost.viewCount,
      like_count: apiPost.like_count || apiPost.likeCount,
      comment_count: apiPost.comment_count || apiPost.commentCount,
      is_pinned: apiPost.is_pinned || apiPost.isPinned,
      is_featured: apiPost.is_featured || apiPost.isFeatured,
      is_solved: apiPost.is_solved || apiPost.isSolved,
      solution_comment_id: apiPost.solution_comment_id || apiPost.solutionCommentId,

      // 前端状态字段
      is_liked: apiPost.is_liked,
      is_bookmarked: apiPost.is_bookmarked
    }
  }

  // 获取帖子列表 - 根据API文档更新参数类型
  async function fetchPosts(params: { page?: number; size?: number } = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await postApi.getPosts(params.page || 0, params.size || API_CONFIG.DEFAULT_PAGE_SIZE)
      if (response && response.content) {
        // 使用映射函数转换数据
        posts.value = response.content.map(mapApiPostToPost)
        pagination.value = {
          currentPage: response.pageable?.pageNumber || 0,
          totalPages: response.totalPages || 1,
          perPage: response.pageable?.pageSize || API_CONFIG.DEFAULT_PAGE_SIZE,
          total: response.totalElements || 0
        }
      }
      return response
    } catch (e: any) {
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.FETCH_POSTS_FAILED
      ErrorHandler.showError(errorInfo)
      return null
    } finally {
      loading.value = false
    }
  }

  // 获取单个帖子详情
  async function fetchPost(id: number | string) {
    loading.value = true
    error.value = null

    try {
      const apiPost = await postApi.getPostById(id)
      const post = mapApiPostToPost(apiPost)
      currentPost.value = post
      return post
    } catch (e: any) {
      const errorInfo = ErrorHandler.handleApiError(e)
      error.value = ERROR_MESSAGES.FETCH_POSTS_FAILED
      ErrorHandler.showError(errorInfo)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    currentPost,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPost,
  }
}) 