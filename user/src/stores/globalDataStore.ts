/**
 * 全局数据管理Store
 * 统一管理全局共享数据，避免重复请求
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryApi, postApi, userApi } from '@/services/api'
import type { Category, Post, User } from '@/types/forum'

// 简单的请求去重工具
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>()

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key)
    })

    this.pendingRequests.set(key, promise)
    return promise
  }
}

const requestDeduplicator = new RequestDeduplicator()

export const useGlobalDataStore = defineStore('globalData', () => {
  // 分类数据
  const categories = ref<Category[]>([])
  const categoriesLoading = ref(false)
  const categoriesLoaded = ref(false)

  // 热门标签
  const popularTags = ref([
    { name: '生活技巧', count: 156 },
    { name: '美食推荐', count: 89 },
    { name: '户外探险', count: 67 },
    { name: '职场经验', count: 45 },
    { name: '装修攻略', count: 34 },
    { name: '养生健康', count: 28 },
    { name: '旅游景点', count: 23 },
    { name: '学习方法', count: 19 }
  ])

  // 论坛统计数据
  const forumStats = ref({
    users: '0',
    posts: '0',
    comments: '0'
  })
  const forumStatsLoading = ref(false)
  const forumStatsLoaded = ref(false)

  // 活跃用户
  const activeUsers = ref<User[]>([])
  const activeUsersLoading = ref(false)
  const activeUsersLoaded = ref(false)

  // 热门话题
  const hotTopics = ref<Post[]>([])
  const hotTopicsLoading = ref(false)
  const hotTopicsLoaded = ref(false)

  // 推荐帖子
  const recommendedPosts = ref<Post[]>([])
  const recommendedPostsLoading = ref(false)
  const recommendedPostsLoaded = ref(false)

  // 计算属性
  const isInitialized = computed(() => 
    categoriesLoaded.value && forumStatsLoaded.value
  )

  /**
   * 获取分类列表（带去重）
   */
  const fetchCategories = async (force = false) => {
    if (categoriesLoaded.value && !force) {
      return categories.value
    }

    return requestDeduplicator.deduplicate('categories', async () => {
      categoriesLoading.value = true
      try {
        const response = await categoryApi.getCategories()
        categories.value = response || []
        categoriesLoaded.value = true
        return categories.value
      } catch (error) {
        console.error('获取分类列表失败:', error)
        return []
      } finally {
        categoriesLoading.value = false
      }
    })
  }

  /**
   * 获取论坛统计数据（带去重）
   */
  const fetchForumStats = async (force = false) => {
    if (forumStatsLoaded.value && !force) {
      return forumStats.value
    }

    return requestDeduplicator.deduplicate('forumStats', async () => {
      forumStatsLoading.value = true
      try {
        // 模拟统计数据，实际项目中应该调用真实API
        await new Promise(resolve => setTimeout(resolve, 300))
        forumStats.value = {
          users: '1,234',
          posts: '5,678',
          comments: '12,345'
        }
        forumStatsLoaded.value = true
        return forumStats.value
      } catch (error) {
        console.error('获取论坛统计失败:', error)
        return forumStats.value
      } finally {
        forumStatsLoading.value = false
      }
    })
  }

  /**
   * 获取活跃用户（带去重）
   */
  const fetchActiveUsers = async (force = false) => {
    if (activeUsersLoaded.value && !force) {
      return activeUsers.value
    }

    return requestDeduplicator.deduplicate('activeUsers', async () => {
      activeUsersLoading.value = true
      try {
        const response = await userApi.getActiveUsers(0, 10)
        activeUsers.value = response?.content || []
        activeUsersLoaded.value = true
        return activeUsers.value
      } catch (error) {
        console.error('获取活跃用户失败:', error)
        activeUsers.value = []
        return activeUsers.value
      } finally {
        activeUsersLoading.value = false
      }
    })
  }

  /**
   * 获取热门话题（带去重）
   */
  const fetchHotTopics = async (force = false) => {
    if (hotTopicsLoaded.value && !force) {
      return hotTopics.value
    }

    return requestDeduplicator.deduplicate('hotTopics', async () => {
      hotTopicsLoading.value = true
      try {
        const response = await postApi.getHotPostsSide(0, 5)
        hotTopics.value = response || []
        hotTopicsLoaded.value = true
        return hotTopics.value
      } catch (error) {
        console.error('获取热门话题失败:', error)
        // 使用模拟数据
        hotTopics.value = [
          { id: 1, title: '生活小技巧分享', viewCount: 1200, commentCount: 45 },
          { id: 2, title: '美食制作心得', viewCount: 980, commentCount: 32 },
          { id: 3, title: '旅游攻略推荐', viewCount: 756, commentCount: 28 },
          { id: 4, title: '健康养生知识', viewCount: 634, commentCount: 21 },
          { id: 5, title: '职场经验分享', viewCount: 523, commentCount: 18 }
        ] as Post[]
        return hotTopics.value
      } finally {
        hotTopicsLoading.value = false
      }
    })
  }

  /**
   * 获取推荐帖子（带去重）
   */
  const fetchRecommendedPosts = async (force = false) => {
    if (recommendedPostsLoaded.value && !force) {
      return recommendedPosts.value
    }

    return requestDeduplicator.deduplicate('recommendedPosts', async () => {
      recommendedPostsLoading.value = true
      try {
        const response = await postApi.getRecommendedPosts(0, 10)
        recommendedPosts.value = response?.content || []
        recommendedPostsLoaded.value = true
        return recommendedPosts.value
      } catch (error) {
        console.error('获取推荐帖子失败:', error)
        recommendedPosts.value = []
        return recommendedPosts.value
      } finally {
        recommendedPostsLoading.value = false
      }
    })
  }

  /**
   * 初始化全局数据
   */
  const initializeGlobalData = async () => {
    const promises = [
      fetchCategories(),
      fetchForumStats()
    ]

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.error('初始化全局数据失败:', error)
    }
  }

  /**
   * 初始化侧边栏数据
   */
  const initializeSidebarData = async () => {
    const promises = [
      fetchActiveUsers(),
      fetchHotTopics(),
      fetchRecommendedPosts()
    ]

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.error('初始化侧边栏数据失败:', error)
    }
  }

  /**
   * 刷新所有数据
   */
  const refreshAllData = async () => {
    const promises = [
      fetchCategories(true),
      fetchForumStats(true),
      fetchActiveUsers(true),
      fetchHotTopics(true),
      fetchRecommendedPosts(true)
    ]

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.error('刷新数据失败:', error)
    }
  }

  /**
   * 清除缓存
   */
  const clearCache = () => {
    categoriesLoaded.value = false
    forumStatsLoaded.value = false
    activeUsersLoaded.value = false
    hotTopicsLoaded.value = false
    recommendedPostsLoaded.value = false
  }

  return {
    // 状态
    categories,
    categoriesLoading,
    categoriesLoaded,
    popularTags,
    forumStats,
    forumStatsLoading,
    forumStatsLoaded,
    activeUsers,
    activeUsersLoading,
    activeUsersLoaded,
    hotTopics,
    hotTopicsLoading,
    hotTopicsLoaded,
    recommendedPosts,
    recommendedPostsLoading,
    recommendedPostsLoaded,
    
    // 计算属性
    isInitialized,
    
    // 方法
    fetchCategories,
    fetchForumStats,
    fetchActiveUsers,
    fetchHotTopics,
    fetchRecommendedPosts,
    initializeGlobalData,
    initializeSidebarData,
    refreshAllData,
    clearCache
  }
})
