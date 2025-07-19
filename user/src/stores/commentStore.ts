import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { commentApi } from '../services/api' // 🚧 评论API未完成，暂时注释
import type { Comment, CreateCommentRequest } from '../types/forum'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 🚧 获取帖子的评论 - 后端未完成，暂时使用模拟数据
  async function fetchPostComments(postId: number | string, params = {}) {
    loading.value = true
    error.value = null

    try {
      // 🚧 暂时使用模拟数据，等后端完成后替换为真实API调用
      // const response = await commentApi.getPostComments(postId, params)

      // 模拟数据
      const mockComments: Comment[] = []
      comments.value = mockComments

      return { content: mockComments, totalElements: 0 }
    } catch (e: any) {
      error.value = e?.message || '获取评论失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 🚧 创建评论 - 后端未完成，暂时注释
  // async function createComment(commentData: CreateCommentRequest) {
  //   loading.value = true
  //   error.value = null
  //
  //   try {
  //     const comment = await commentApi.createComment(commentData.post_id, commentData)
  //     return comment
  //   } catch (e: any) {
  //     error.value = e?.message || '发表评论失败'
  //     return null
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // 🚧 更新评论 - 后端未完成，暂时注释
  // async function updateComment(id: number | string, content: string) {
  //   loading.value = true
  //   error.value = null
  //
  //   try {
  //     const updatedComment = await commentApi.updateComment(id, { content })
  //     return updatedComment
  //   } catch (e: any) {
  //     error.value = e?.message || '更新评论失败'
  //     return null
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // 🚧 删除评论 - 后端未完成，暂时注释
  // async function deleteComment(id: number | string) {
  //   loading.value = true
  //   error.value = null
  //
  //   try {
  //     await commentApi.deleteComment(id)
  //     return true
  //   } catch (e: any) {
  //     error.value = e?.message || '删除评论失败'
  //     return false
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // 🚧 点赞评论 - 后端未完成，暂时注释
  // async function likeComment(id: number | string) {
  //   try {
  //     const result = await commentApi.likeComment(id)
  //     return result
  //   } catch (e: any) {
  //     error.value = e?.message || '点赞操作失败'
  //     return null
  //   }
  // }

  // 🚧 标记为最佳答案 - 后端未完成，暂时注释
  // async function markAsSolution(id: number | string) {
  //   try {
  //     const result = await commentApi.markAsSolution(id)
  //     return result
  //   } catch (e: any) {
  //     error.value = e?.message || '标记最佳答案失败'
  //     return null
  //   }
  // }

  // 这些方法已经在上面重新定义了，删除重复的定义

  return {
    comments,
    loading,
    error,
    fetchPostComments,
    // 🚧 未完成的功能暂时注释
    // createComment,
    // updateComment,
    // deleteComment,
    // likeComment,
    // markAsSolution
  }
}) 