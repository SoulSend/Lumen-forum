import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post as apiPost, put, del } from '../services/api'
import type { Comment, CreateCommentRequest } from '../types/forum'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取帖子的评论
  async function fetchPostComments(postId: number | string, params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await get<Comment[]>(`/posts/${postId}/comments`, params)
      comments.value = response
      return response
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取评论失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 创建评论
  async function createComment(commentData: CreateCommentRequest) {
    loading.value = true
    error.value = null
    
    try {
      const comment = await apiPost<Comment>('/comments', commentData)
      return comment
    } catch (e: any) {
      error.value = e.response?.data?.message || '发表评论失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新评论
  async function updateComment(id: number | string, content: string) {
    loading.value = true
    error.value = null
    
    try {
      const updatedComment = await put<Comment>(`/comments/${id}`, { content })
      return updatedComment
    } catch (e: any) {
      error.value = e.response?.data?.message || '更新评论失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 删除评论
  async function deleteComment(id: number | string) {
    loading.value = true
    error.value = null
    
    try {
      await del(`/comments/${id}`)
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || '删除评论失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 点赞评论
  async function likeComment(id: number | string) {
    try {
      const response = await apiPost(`/comments/${id}/like`)
      return response
    } catch (e: any) {
      error.value = e.response?.data?.message || '点赞失败'
      return null
    }
  }

  // 设置评论为最佳回答
  async function markAsSolution(commentId: number | string, postId: number | string) {
    try {
      const response = await apiPost(`/posts/${postId}/solution`, { comment_id: commentId })
      return response
    } catch (e: any) {
      error.value = e.response?.data?.message || '设置最佳回答失败'
      return null
    }
  }

  return {
    comments,
    loading,
    error,
    fetchPostComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    markAsSolution
  }
}) 