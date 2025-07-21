<template>
  <div class="home-page">
      <!-- 顶部横幅 - 重新设计为更简洁的风格 -->
      <section class="forum-banner">
        <div class="banner-content">
          <div class="banner-text">
            <h1 class="banner-title">Lumen 论坛</h1>
            <p class="banner-description">分享生活智慧，发现日常精彩</p>
          </div>
          
          <div class="banner-actions">
            <el-button type="primary" size="large" class="action-button" @click="navigateTo('/create-post')">
              <i class="icon-plus"></i> 发布新帖
            </el-button>
            <div class="search-form">
              <el-input
                v-model="searchQuery" 
                placeholder="搜索感兴趣的内容..."
                :prefix-icon="Search"
                class="search-input"
                @keyup.enter="handleSearch"
                clearable
              />
            </div>
          </div>
        </div>
        
        <!-- 论坛统计数据 -->
        <div class="forum-stats">
          <div class="stat-item">
            <div class="stat-icon stat-posts"><i class="icon-document"></i></div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(communityStats.posts) }}</div>
              <div class="stat-label">总帖子</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon stat-users"><i class="icon-users"></i></div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(communityStats.users) }}</div>
              <div class="stat-label">注册用户</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon stat-solutions"><i class="icon-check-circle"></i></div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(communityStats.solutions) }}</div>
              <div class="stat-label">解决方案</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 主要内容区 -->
      <div class="forum-content">
        <!-- 左侧内容区 -->
        <div class="content-main">
          <!-- 热门帖子区域 -->
          <section class="content-section posts-section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="material-icons-round">local_fire_department</span>
                热门讨论
              </h2>
              <div class="section-actions">
                <el-radio-group v-model="selectedTimeFrame" size="small" class="time-filter">
                  <el-radio-button value="day">今日</el-radio-button>
                  <el-radio-button value="week">本周</el-radio-button>
                  <el-radio-button value="month">本月</el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="postLoading" class="posts-loading">
              <el-skeleton :rows="3" animated class="skeleton-card" />
              <el-skeleton :rows="3" animated class="skeleton-card" />
            </div>
            
            <!-- 空状态 -->
            <div v-else-if="posts && posts.length === 0" class="no-posts">
              <el-empty description="暂无帖子" />
            </div>
            
            <!-- 帖子列表 -->
            <div v-else class="posts-list">
              <post-card v-for="post in posts" :key="post.id" :post="post" class="animated-post-card" />
              
              <!-- 加载更多 -->
              <div class="load-more" v-if="posts && posts.length > 0">
                <el-button 
                  type="primary"
                  :loading="loadingMore" 
                  :disabled="pagination.currentPage >= pagination.totalPages"
                  @click="loadMorePosts"
                  class="load-more-btn"
                >
                  {{ pagination.currentPage >= pagination.totalPages ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </div>
          </section>

          <!-- 推荐阅读区域（替换原来的生活技巧部分）-->
          <section class="content-section featured-section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="material-icons-round">star</span>
                推荐阅读
              </h2>
              <div class="section-actions">
                <a href="#" class="view-all-link">
                  更多推荐 <span class="material-icons-round">chevron_right</span>
                </a>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="featuredPostsLoading" class="loading-container">
              <el-skeleton :rows="3" animated class="skeleton-card" />
              <el-skeleton :rows="3" animated class="skeleton-card" />
            </div>

            <!-- 空状态 -->
            <div v-else-if="featuredPosts && featuredPosts.length === 0" class="no-content">
              <el-empty description="暂无推荐内容" />
            </div>

            <!-- 内容区域 -->
            <div v-else class="featured-grid">
              <div class="featured-main" v-if="safeFeaturedPosts && safeFeaturedPosts.length > 0">
                <div class="featured-card main-feature">
                  <div class="featured-image">
                    <img :src="safeFeaturedPosts[0]?.image || '../assets/default-avatar.png'" :alt="safeFeaturedPosts[0]?.title">
                  </div>
                  <div class="featured-content">
                    <div class="featured-category">{{ safeFeaturedPosts[0]?.category?.name }}</div>
                    <h3 class="featured-title">{{ safeFeaturedPosts[0]?.title }}</h3>
                    <p class="featured-excerpt">{{ truncateText(safeFeaturedPosts[0]?.content, 120) }}</p>
                    <div class="featured-meta">
                      <div class="featured-author">
                        <img :src="getUserAvatar(safeFeaturedPosts[0]?.user)" :alt="getUserDisplayName(safeFeaturedPosts[0]?.user)" class="author-avatar">
                        <span class="author-name">{{ getUserDisplayName(safeFeaturedPosts[0]?.user) }}</span>
                      </div>
                      <div class="featured-date">{{ formatDate(safeFeaturedPosts[0]?.createdAt || safeFeaturedPosts[0]?.created_at) }}</div>
                    </div>
                    <router-link
                      v-if="hasValidId(safeFeaturedPosts[0])"
                      :to="{ name: 'postDetail', params: { id: safeFeaturedPosts[0].id } }"
                      class="read-more-link"
                    >
                      阅读全文 <i class="icon-arrow-right"></i>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="featured-side" v-if="safeFeaturedPosts && safeFeaturedPosts.length > 1">
                <div v-for="post in safeFeaturedPosts.slice(1, 4)" :key="post.id" class="featured-card side-feature">
                  <div class="side-feature-content">
                    <div class="featured-category small">{{ post.category?.name }}</div>
                    <h4 class="featured-title small">{{ post.title }}</h4>
                    <div class="featured-meta small">
                      <span class="author-name">{{ getUserDisplayName(post.user) }}</span>
                      <span class="featured-date">{{ formatDate(post.createdAt || post.created_at) }}</span>
                    </div>
                    <router-link
                      v-if="hasValidId(post)"
                      :to="{ name: 'postDetail', params: { id: post.id } }"
                      class="read-more-link small"
                    >
                      阅读全文
                    </router-link>
                  </div>
                  <div class="side-feature-image">
                    <img :src="post.image || '../assets/default-avatar.png'" :alt="post.title">
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 生活技巧文章区域 -->
          <section class="content-section life-tips-section">
            <div class="section-header">
              <h2 class="section-title">
                <span class="material-icons-round">lightbulb</span>
                生活技巧
              </h2>
              <div class="section-actions">
                <router-link to="/category/2" class="view-all-link">
                  查看更多 <span class="material-icons-round">chevron_right</span>
                </router-link>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="lifeTipsLoading" class="loading-container">
              <el-skeleton :rows="3" animated class="skeleton-card" />
              <el-skeleton :rows="3" animated class="skeleton-card" />
            </div>

            <!-- 空状态 -->
            <div v-else-if="lifeTipsArticles && lifeTipsArticles.length === 0" class="no-content">
              <el-empty description="暂无生活技巧内容" />
            </div>

            <!-- 内容区域 -->
            <div v-else class="life-tips-grid">
              <div v-for="article in safeLifeTipsArticles" :key="article.id" class="life-tip-card card">
                <div class="tip-card-image">
                  <img :src="article.image || '../assets/default-avatar.png'" :alt="article.title" class="tip-image">
                </div>
                <div class="tip-card-content">
                  <router-link
                    v-if="hasValidId(article)"
                    :to="{ name: 'postDetail', params: { id: article.id } }"
                    class="tip-title-link"
                  >
                    <h3 class="tip-title">{{ article.title }}</h3>
                  </router-link>
                  <h3 v-else class="tip-title">{{ article.title }}</h3>
                  <p class="tip-excerpt">{{ truncateText(article.content, TEXT_CONFIG.COMMENT_PREVIEW_LENGTH) }}</p>
                  <div class="tip-meta">
                    <div class="tip-author">
                      <router-link
                        v-if="article.user?.id"
                        :to="{ name: 'userProfile', params: { id: article.user.id } }"
                        class="author-link"
                      >
                        <img :src="getUserAvatarUrl(article.user?.avatar)" :alt="article.user?.username || '用户'" class="avatar avatar--small">
                        <span class="author-name">{{ article.user?.username }}</span>
                      </router-link>
                      <div v-else class="author-link">
                        <img :src="getUserAvatarUrl()" alt="用户" class="avatar avatar--small">
                        <span class="author-name">{{ DEFAULT_TEXTS.UNKNOWN_USER }}</span>
                      </div>
                    </div>
                    <div class="tip-stats">
                      <span class="stat views">
                        <span class="material-icons-round">visibility</span>{{ formatNumber(article.view_count) }}
                      </span>
                      <span class="stat comments">
                        <span class="material-icons-round">comment</span>{{ formatNumber(article.comment_count) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <!-- 右侧边栏 -->
        <div class="content-sidebar">
          <Sidebar />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// @ts-ignore
import PostCard from '../components/forum/PostCard.vue'
import { useCategoryStore } from '../stores/categoryStore'
import { usePostStore } from '../stores/postStore'
import { useGlobalDataStore } from '../stores/globalDataStore'
// import { useStatsStore } from '../stores/statsStore' // 🚧 统计功能未完成，暂时注释
import type { Category, Post } from '../types/forum'
import { Search } from '@element-plus/icons-vue'
// @ts-ignore
import Sidebar from '../components/layout/Sidebar.vue'
import { postApi } from '../services/api'
import { safePost, safeUser, getUserDisplayName, getUserAvatar, hasValidId } from '../utils/dataValidation'
import { truncateText, formatNumber, formatDate } from '../utils/format'
import { CATEGORY_ICONS, DEFAULT_TEXTS, TEXT_CONFIG } from '../constants'
import { getUserAvatarUrl } from '../utils/assets'

const router = useRouter()
const categoryStore = useCategoryStore()
const postStore = usePostStore()
const globalDataStore = useGlobalDataStore()
// const statsStore = useStatsStore() // 🚧 统计功能未完成，暂时注释

// 搜索
const searchQuery = ref('')

// 社区统计数据
const communityStats = reactive({
  posts: 0,
  users: 0,
  solutions: 0
})

// 使用全局数据store中的分类数据
const categories = computed(() => globalDataStore.categories)
const categoryLoading = computed(() => globalDataStore.categoriesLoading)
const selectedCategory = ref('all')

// 帖子相关
const posts = ref<Post[]>([])
const postLoading = ref(false)
const loadingMore = ref(false)
const selectedTimeFrame = ref('week')
const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  total: 0
})

// 推荐阅读帖子
const featuredPosts = ref<Post[]>([])
const featuredPostsLoading = ref(false)

// 生活技巧文章
const lifeTipsArticles = ref<Post[]>([])
const lifeTipsLoading = ref(false)

// 安全的数据访问
const safeFeaturedPosts = computed(() => featuredPosts.value.map(post => safePost(post)))
const safeLifeTipsArticles = computed(() => lifeTipsArticles.value.map(post => safePost(post)))

// 最新活动
const recentActivities = ref([])
const recentActivitiesLoading = ref(false)

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value }
    })
  }
}

// 获取分类列表（使用全局store）
const fetchCategories = async () => {
  await globalDataStore.fetchCategories()
}

// 获取热门帖子
const fetchPosts = async (page = 1) => {
  if (page === 1) {
    postLoading.value = true
    posts.value = []
  } else {
    loadingMore.value = true
  }

  try {
    // 根据选择的时间范围和分类获取帖子
    let response: any
    if (selectedCategory.value === 'all') {
      response = await postApi.getHotPosts(page - 1, pagination.perPage)
    } else {
      response = await postApi.getCategoryPosts(selectedCategory.value, page - 1, pagination.perPage)
    }

    if (response && response.content) {
      if (page === 1) {
        posts.value = response.content
      } else {
        posts.value = [...posts.value, ...response.content]
      }

      pagination.currentPage = response.pageable?.pageNumber + 1 || page
      pagination.totalPages = response.totalPages || 1
      pagination.total = response.totalElements || 0
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    ElMessage.error('获取帖子失败')

    // 确保在错误情况下 posts 是空数组而不是 undefined
    if (page === 1) {
      posts.value = []
      pagination.currentPage = 1
      pagination.totalPages = 5
      pagination.total = 50
    }
  } finally {
    postLoading.value = false
    loadingMore.value = false
  }
}

// 获取推荐阅读帖子
const fetchFeaturedPosts = async () => {
  featuredPostsLoading.value = true
  try {
    const response = await postApi.getRecommendedPostsSide(0, 4)
    featuredPosts.value = response || []
  } catch (error) {
    // API不可用时使用模拟数据
    featuredPosts.value = [
      {
        id: 1,
        title: '新手必看：如何快速融入社区',
        content: '欢迎来到我们的生活技巧分享社区！这里有一些小贴士帮助你快速上手...',
        category: { name: '新手指南' },
        viewCount: 1500,
        likeCount: 89,
        commentCount: 23
      },
      {
        id: 2,
        title: '精选：最实用的厨房收纳技巧',
        content: '厨房空间有限？这些收纳技巧让你的厨房井井有条...',
        category: { name: '生活技巧' },
        viewCount: 1200,
        likeCount: 76,
        commentCount: 18
      },
      {
        id: 3,
        title: '健康生活：每日养生小贴士',
        content: '简单易行的养生方法，让你每天都充满活力...',
        category: { name: '健康养生' },
        viewCount: 980,
        likeCount: 65,
        commentCount: 15
      },
      {
        id: 4,
        title: '旅游攻略：周末短途游推荐',
        content: '不用走太远，周边就有很多值得一去的好地方...',
        category: { name: '旅游攻略' },
        viewCount: 756,
        likeCount: 42,
        commentCount: 12
      }
    ]
  } finally {
    featuredPostsLoading.value = false
  }
}

// 获取生活技巧文章
const fetchLifeTipsArticles = async () => {
  lifeTipsLoading.value = true
  try {
    const categoryId = categories.value.find(c => c.name === '生活技巧')?.id || 1
    const response = await postApi.getCategoryPosts(categoryId, 0, 4)
    lifeTipsArticles.value = response?.content || []
  } catch (error) {
    // API不可用时使用模拟数据
    lifeTipsArticles.value = [
      {
        id: 1,
        title: '厨房收纳的5个小技巧',
        content: '让你的厨房空间利用率翻倍...',
        userId: 1,
        categoryId: 1,
        viewCount: 856,
        likeCount: 45,
        commentCount: 12,
        isPinned: false,
        isFeatured: false,
        isSolved: false,
        isRecommended: false,
        solutionCommentId: null
      },
      {
        id: 2,
        title: '衣物保养实用指南',
        content: '延长衣物寿命的小窍门...',
        userId: 1,
        categoryId: 1,
        viewCount: 723,
        likeCount: 38,
        commentCount: 9,
        isPinned: false,
        isFeatured: false,
        isSolved: false,
        isRecommended: false,
        solutionCommentId: null
      },
      {
        id: 3,
        title: '家居清洁的高效方法',
        content: '省时省力的清洁技巧分享...',
        userId: 1,
        categoryId: 1,
        viewCount: 645,
        likeCount: 32,
        commentCount: 7,
        isPinned: false,
        isFeatured: false,
        isSolved: false,
        isRecommended: false,
        solutionCommentId: null
      },
      {
        id: 4,
        title: '节能环保生活小贴士',
        content: '从小事做起，保护我们的地球...',
        userId: 1,
        categoryId: 1,
        viewCount: 567,
        likeCount: 28,
        commentCount: 6,
        isPinned: false,
        isFeatured: false,
        isSolved: false,
        isRecommended: false,
        solutionCommentId: null
      }
    ]
  } finally {
    lifeTipsLoading.value = false
  }
}

// 获取社区统计数据
const fetchCommunityStats = async () => {
  communityStats.posts = 3500
  communityStats.users = 1200
  communityStats.solutions = 890
}

// 加载更多帖子
const loadMorePosts = () => {
  fetchPosts(pagination.currentPage + 1)
}

// 导航方法
const navigateTo = (link: string) => {
  router.push(link)
}

// 监听时间范围变化
watch(selectedTimeFrame, () => {
  fetchPosts(1)
})

// 获取分类图标
const getCategoryIcon = (category: Category) => {
  return CATEGORY_ICONS[category.name] || 'category'
}

// 生命周期钩子
onMounted(async () => {
  // 确保全局数据已初始化（如果还没有的话）
  if (!globalDataStore.categoriesLoaded) {
    await fetchCategories()
  }

  fetchPosts()
  fetchFeaturedPosts()
  fetchCommunityStats()
  // 等待分类加载完成后再获取生活技巧文章
  fetchLifeTipsArticles()
})
</script>

<style scoped>
/* 主页基础样式 */
.home-page {
  padding-top: var(--spacing-4);
}

/* 论坛横幅样式 */
.forum-banner {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6) var(--spacing-8);
  margin-bottom: var(--spacing-8);
  color: var(--white);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.forum-banner::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  transform: translate(30%, -30%);
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-2);
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.banner-description {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.9;
  max-width: 500px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.banner-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.action-button {
  height: 48px;
  font-weight: var(--font-weight-semibold);
  width: 100%;
  border-radius: var(--radius-md);
  border: 2px solid var(--white);
  padding: 0 var(--spacing-6);
}

.search-form {
  width: 240px;
}

.search-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: none !important;
  border-radius: var(--radius-md);
}

.search-input :deep(.el-input__wrapper:hover) {
  background-color: rgba(255, 255, 255, 0.3);
}

.search-input :deep(.el-input__inner) {
  color: var(--white);
}

.search-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}

.search-input :deep(.el-input__prefix-inner svg) {
  color: var(--white);
}

/* 论坛统计数据 */
.forum-stats {
  display: flex;
  justify-content: space-around;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.forum-stats .stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-weight: var(--font-weight-bold);
  font-size: 1.5rem;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 主要内容区布局 */
.forum-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-6);
}

/* 左侧主内容区 */
.content-section {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-6);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 2px solid var(--border-light);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.section-title .material-icons-round {
  color: var(--primary-color);
  font-size: 24px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* 帖子列表样式 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.animated-post-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animated-post-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.posts-loading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.load-more {
  margin-top: var(--spacing-4);
  text-align: center;
}

.load-more-btn {
  width: 180px;
}

/* 侧边栏样式 */
.content-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.sidebar-section {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.sidebar-title {
  padding: var(--spacing-4) var(--spacing-6);
  margin-top: var(--spacing-2);
  margin-bottom: 0;
  margin-left: var(--spacing-1);
  padding-left: var(--spacing-1);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  border-bottom: 1px solid var(--border-light);
  text-align: center;
}

/* 分类列表样式 */
.category-list {
  padding: var(--spacing-3);
}

.category-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-3);
  text-decoration: none;
  color: var(--text-primary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-1);
  transition: all var(--transition-fast);
}

.category-item:hover {
  background-color: var(--bg-subtle);
  transform: translateX(3px);
}

.category-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-3);
  font-size: 1rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-weight: var(--font-weight-medium);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-count {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.view-all-link {
  display: block;
  text-align: center;
  padding: var(--spacing-3);
  margin-top: var(--spacing-2);
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  font-size: var(--font-size-sm);
  border-top: 1px solid var(--border-light);
}

.view-all-link:hover {
  text-decoration: underline;
}

/* 活动区域样式 */
.activity-section {
  margin-bottom: var(--spacing-12);
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

.activity-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  transition: box-shadow var(--transition-normal);
}

.activity-card:hover {
  box-shadow: var(--shadow-md);
}

.activity-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-3);
}

.activity-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  margin-right: var(--spacing-3);
  object-fit: cover;
  border: 1px solid var(--border-light);
}

.activity-info {
  flex: 1;
}

.activity-content {
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
  line-height: 1.4;
}

.activity-content strong {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
}

.activity-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.activity-target {
  margin-top: var(--spacing-2);
  margin-left: calc(32px + var(--spacing-3));
  font-size: var(--font-size-sm);
}

.target-link {
  display: block;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--bg-subtle);
  border-left: 3px solid var(--primary-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  text-decoration: none;
  transition: all var(--transition-fast);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.target-link:hover {
  background-color: var(--bg-hover);
  transform: translateX(2px);
}

/* 活动列表样式 */
.activity-list {
  padding: var(--spacing-3);
}

.activity-item {
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--border-light);
}

.activity-item:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.activity-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-2);
}

.activity-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--spacing-3);
  border: 1px solid var(--border-light);
}

.activity-info {
  flex: 1;
}

.activity-content {
  font-size: var(--font-size-sm);
  margin-bottom: 2px;
  line-height: 1.4;
}

.activity-content strong {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
}

.activity-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.activity-target {
  background-color: var(--bg-subtle);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  margin-left: calc(32px + var(--spacing-3));
}

.target-link {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-decoration: none;
  line-height: 1.4;
  transition: color var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.target-link:hover {
  color: var(--primary-color);
}

/* 图标样式 */
.icon-plus:before { 
  content: "\f067"; /* fa-plus */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2); 
}
.icon-document:before { 
  content: "\f15c"; /* fa-file-alt */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-users:before { 
  content: "\f0c0"; /* fa-users */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-check-circle:before { 
  content: "\f058"; /* fa-check-circle */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-fire:before { 
  content: "\f06d"; /* fa-fire */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-arrow-right:before { 
  content: "\f054"; /* fa-chevron-right */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-left: var(--spacing-2);
}
.icon-life:before { 
  content: "\f015"; /* fa-home */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-home:before { 
  content: "\f4b8"; /* fa-couch */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-food:before { 
  content: "\f2e7"; /* fa-utensils */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-travel:before { 
  content: "\f072"; /* fa-plane */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-health:before { 
  content: "\f21e"; /* fa-heartbeat */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-work:before { 
  content: "\f0b1"; /* fa-briefcase */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-default:before { 
  content: "\f02d"; /* fa-book */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}

/* 在Home.vue中添加视图图标 */
.icon-view:before { 
  content: "\f06e"; /* fa-eye */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-1);
}
.icon-comment:before { 
  content: "\f075"; /* fa-comment */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-1);
}
.icon-like:before { 
  content: "\f164"; /* fa-thumbs-up */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-1);
}
.icon-star:before { 
  content: "\f005"; /* fa-star */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}
.icon-bulb:before { 
  content: "\f0eb"; /* fa-lightbulb */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}

/* 分类图标颜色 */
.category-icon-1 { background-color: #FFF0E6; color: #E67E22; }
.category-icon-2 { background-color: #EDF6FF; color: #4A6FA5; }
.category-icon-3 { background-color: #FFF5F5; color: #F56565; }
.category-icon-4 { background-color: #FFF8E6; color: #F9A826; }
.category-icon-5 { background-color: #F7F5FF; color: #805AD5; }
.category-icon-6 { background-color: #F0FFF4; color: #68D391; }

/* 响应式调整 */
@media (max-width: 1024px) {
  .forum-content {
    grid-template-columns: 1fr;
  }
  
  .content-sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-4);
  }
  
  .banner-title {
    font-size: 2rem;
  }
  
  .banner-description {
    font-size: 1.1rem;
  }
  
  .forum-stats {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: center;
  }
  
  .forum-stats .stat-item {
    width: 100%;
    max-width: 200px;
    justify-content: flex-start;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .search-form {
    width: 100%;
  }
  
  .banner-actions {
    gap: var(--spacing-3);
  }
}

@media (max-width: 480px) {
  .forum-banner {
    padding: var(--spacing-5) var(--spacing-4);
  }
  
  .banner-title {
    font-size: 1.75rem;
  }
  
  .content-sidebar {
    grid-template-columns: 1fr;
  }
  
  .activity-target {
    margin-left: 0;
    margin-top: var(--spacing-2);
  }
  
  .action-button {
    height: 44px;
    font-size: 0.9rem;
  }
  
  .forum-stats {
    margin-top: var(--spacing-4);
    padding-top: var(--spacing-4);
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}

.user-avatar-link {
  display: block;
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.user-avatar-link:hover {
  transform: scale(1.05);
}

.user-name-link {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
}

.user-name-link:hover {
  text-decoration: underline;
}

.activity-content {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-1);
}

/* 生活技巧文章区域样式 */
.life-tips-section {
  margin-top: var(--spacing-8);
}

.life-tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.life-tip-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.life-tip-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.tip-card-image {
  height: 180px;
  overflow: hidden;
}

.tip-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.life-tip-card:hover .tip-image {
  transform: scale(1.05);
}

.tip-card-content {
  padding: var(--spacing-4);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tip-title-link {
  text-decoration: none;
  color: var(--text-primary);
}

.tip-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-3);
  line-height: 1.4;
  transition: color var(--transition-fast);
}

.tip-title-link:hover .tip-title {
  color: var(--primary-color);
}

.tip-excerpt {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-4);
  line-height: 1.6;
  font-size: var(--font-size-sm);
  flex: 1;
}

.tip-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--border-light);
}

.tip-author {
  display: flex;
  align-items: center;
}

.author-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: var(--spacing-2);
}

.author-name {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.tip-stats {
  display: flex;
  gap: var(--spacing-3);
}

.stat {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.stat i {
  margin-right: var(--spacing-1);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .life-tips-grid {
    grid-template-columns: 1fr;
  }
}

/* 热门帖子区域样式 */
.posts-section {
  margin-bottom: var(--spacing-10);
}

/* 推荐阅读区域样式 */
.featured-section {
  margin-bottom: var(--spacing-10);
}

.featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .featured-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-6);
  }
}

.featured-main {
  grid-column: span 2;
}

.featured-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.featured-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.main-feature {
  display: flex;
  flex-direction: column;
}

@media (min-width: 640px) {
  .main-feature {
    flex-direction: row;
    height: 320px;
  }
  
  .featured-image {
    width: 50%;
  }
  
  .featured-content {
    width: 50%;
  }
}

.featured-image {
  height: 240px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.featured-card:hover .featured-image img {
  transform: scale(1.05);
}

.featured-content {
  padding: var(--spacing-6);
  display: flex;
  flex-direction: column;
}

.featured-category {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  margin-bottom: var(--spacing-3);
  font-weight: var(--font-weight-medium);
}

.featured-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
  line-height: 1.4;
}

.featured-excerpt {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-4);
  flex-grow: 1;
  line-height: 1.6;
}

.featured-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.featured-author {
  display: flex;
  align-items: center;
}

.featured-author .author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: var(--spacing-2);
  object-fit: cover;
}

.featured-author .author-name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.featured-date {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

.read-more-link {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.read-more-link:hover {
  color: var(--primary-dark);
}

.read-more-link i {
  margin-left: var(--spacing-1);
  transition: transform var(--transition-fast);
}

.read-more-link:hover i {
  transform: translateX(3px);
}

.featured-side {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .featured-side {
    grid-column: span 2;
    grid-template-columns: repeat(3, 1fr);
  }
}

.side-feature {
  display: flex;
  height: 120px;
}

.side-feature-content {
  flex: 1;
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
}

.featured-category.small {
  font-size: var(--font-size-xxs);
  padding: var(--spacing-1) var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.featured-title.small {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-2);
}

.featured-meta.small {
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-xs);
}

.read-more-link.small {
  font-size: var(--font-size-xs);
}

.side-feature-image {
  width: 120px;
  overflow: hidden;
}

.side-feature-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 调整统计信息中的图标间距 */
.tip-stats .stat {
  display: flex;
  align-items: center;
  margin-right: var(--spacing-3);
}

.tip-stats .stat i {
  margin-right: var(--spacing-1);
}

/* 调整标题中的图标间距 */
.section-title i {
  margin-right: var(--spacing-2);
}

/* 调整Material Icons样式 */
.material-icons-round {
  font-size: 1.1rem;
  margin-right: var(--spacing-2);
  vertical-align: middle;
  color: var(--primary-color);
}

.view-all-link .material-icons-round {
  font-size: 0.9rem;
  margin-left: var(--spacing-2);
  margin-right: 0;
}

.tip-stats .stat .material-icons-round {
  font-size: 0.9rem;
  margin-right: var(--spacing-1);
  opacity: 0.8;
}

/* 调整标题中的图标样式 */
.section-title .material-icons-round {
  position: relative;
  top: -1px;
}

/* 为Material Icons添加轻微动画效果 */
.view-all-link:hover .material-icons-round {
  transform: translateX(3px);
  transition: transform var(--transition-fast);
}

/* 时间筛选器样式 */
.time-filter {
  border-radius: var(--radius-md);
  overflow: hidden;
}

:deep(.el-radio-button__inner) {
  padding: 8px 15px;
  border-color: var(--border-light);
  transition: all 0.3s ease;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: -1px 0 0 0 var(--primary-color);
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-left-color: var(--border-light);
}

.loading-container {
  padding: var(--spacing-6);
  border-radius: var(--radius-md);
  background-color: var(--bg-surface);
}

.skeleton-card {
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-4);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
}

.no-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: var(--bg-surface);
  border-radius: var(--radius-md);
  color: var(--text-tertiary);
}
</style> 