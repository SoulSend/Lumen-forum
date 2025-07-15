<template>
  <main-layout>
    <div class="category-page">
      <!-- 分类标题区域 -->
      <div v-if="category" class="category-header">
        <div class="category-icon">
          <span class="material-icons-round">{{ getCategoryIcon(category.name) }}</span>
        </div>
        <div class="category-info">
          <div class="category-meta">
            <h1 class="category-title">{{ category.name }}</h1>
            <div class="category-stats">
              <div class="stat-item">
                <span class="material-icons-round">description</span>
                <span>{{ category.post_count || 0 }} 帖子</span>
              </div>
              <div class="stat-item">
                <span class="material-icons-round">comment</span>
                <span>{{ category.comment_count || 0 }} 评论</span>
              </div>
              <div class="stat-item">
                <span class="material-icons-round">person</span>
                <span>{{ category.follower_count || 0 }} 关注者</span>
              </div>
            </div>
          </div>
          <p class="category-description">{{ category.description }}</p>
          
          <div class="category-actions">
            <el-button type="primary" @click="navigateToCreatePost">
              <span class="material-icons-round">add</span> 发布帖子
            </el-button>
            <el-button :type="isFollowing ? 'success' : 'default'" @click="toggleFollow">
              <span class="material-icons-round">{{ isFollowing ? 'check' : 'add' }}</span>
              {{ isFollowing ? '已关注' : '关注分类' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="category-content">
        <div class="content-main">
          <!-- 过滤和排序 -->
          <div class="filter-bar">
            <div class="filter-options">
              <el-radio-group v-model="filterOption" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="featured">精华</el-radio-button>
                <el-radio-button label="solved">已解决</el-radio-button>
              </el-radio-group>
            </div>
            <div class="sort-options">
              <span class="sort-label">排序：</span>
              <el-select v-model="sortOption" size="small" style="width: 120px">
                <el-option label="最新发布" value="newest"></el-option>
                <el-option label="最多评论" value="most_comments"></el-option>
                <el-option label="最多浏览" value="most_views"></el-option>
                <el-option label="最多点赞" value="most_likes"></el-option>
              </el-select>
            </div>
          </div>
          
          <!-- 帖子列表 -->
          <div v-loading="loading" class="posts-container">
            <div v-if="!loading && posts.length === 0" class="empty-state">
              <el-empty description="暂无帖子">
                <template #description>
                  <p>该分类下暂无帖子</p>
                </template>
                <el-button type="primary" @click="navigateToCreatePost">
                  <span class="material-icons-round">add</span> 发布第一篇帖子
                </el-button>
              </el-empty>
            </div>
            <template v-else>
              <post-card v-for="post in posts" :key="post.id" :post="post" class="post-item" />
              
              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 30, 50]"
                  :total="totalPosts"
                  layout="total, sizes, prev, pager, next"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  background
                />
              </div>
            </template>
          </div>
        </div>
        
        <!-- 侧边栏 -->
        <div class="content-sidebar">
          <!-- 关于分类 -->
          <div class="sidebar-card">
            <div class="card-header">
              <h3 class="card-title">关于本分类</h3>
            </div>
            <div class="card-body">
              <div class="about-category">
                <p>{{ category?.description || '暂无描述' }}</p>
                <div class="category-rules" v-if="category?.rules">
                  <h4>分类规则：</h4>
                  <div v-html="category.rules"></div>
                </div>
                <div class="category-created">
                  创建于 {{ formatDate(category?.created_at) }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 热门标签 -->
          <div class="sidebar-card">
            <div class="card-header">
              <h3 class="card-title">热门标签</h3>
            </div>
            <div class="card-body">
              <div class="tags-cloud">
                <router-link 
                  v-for="(tag, index) in popularTags" 
                  :key="index"
                  :to="{ name: 'search', query: { category: category?.id, tag: tag.id } }"
                  class="tag-item"
                >
                  {{ tag.name }}
                  <span class="tag-count">{{ tag.count }}</span>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- 相关分类 -->
          <div class="sidebar-card">
            <div class="card-header">
              <h3 class="card-title">相关分类</h3>
            </div>
            <div class="card-body">
              <div class="related-categories">
                <router-link 
                  v-for="(relatedCategory, index) in relatedCategories" 
                  :key="index"
                  :to="{ name: 'category', params: { id: relatedCategory.id } }"
                  class="related-category"
                >
                  <span class="material-icons-round">{{ getCategoryIcon(relatedCategory.name) }}</span>
                  <span class="category-name">{{ relatedCategory.name }}</span>
                  <span class="post-count">{{ relatedCategory.post_count }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MainLayout from '../components/layout/MainLayout.vue'
import PostCard from '../components/forum/PostCard.vue'
import { useCategoryStore } from '../stores/categoryStore'
import { usePostStore } from '../stores/postStore'
import type { Category, Post } from '../types/forum'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const postStore = usePostStore()

const category = ref<Category | null>(null)
const posts = ref<Post[]>([])
const loading = ref(false)
const isFollowing = ref(false)
const filterOption = ref('all')
const sortOption = ref('newest')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(0)

// 模拟数据 - 热门标签
const popularTags = ref([
  { id: 1, name: '装修', count: 42 },
  { id: 2, name: '收纳', count: 36 },
  { id: 3, name: '小户型', count: 28 },
  { id: 4, name: 'DIY', count: 24 },
  { id: 5, name: '北欧风', count: 19 },
  { id: 6, name: '绿植', count: 15 }
])

// 模拟数据 - 活跃用户
const activeUsers = ref([
  { id: 101, username: '创意达人', avatar: '', post_count: 24 },
  { id: 102, username: '家居控', avatar: '', post_count: 18 },
  { id: 103, username: '设计师小王', avatar: '', post_count: 15 },
  { id: 104, username: '收纳达人', avatar: '', post_count: 12 }
])

// 模拟数据 - 相关分类
const relatedCategories = ref([
  { id: 1, name: '生活技巧', post_count: 326 },
  { id: 3, name: '美食烹饪', post_count: 189 },
  { id: 5, name: '健康养生', post_count: 137 }
])

// 获取分类图标
const getCategoryIcon = (categoryName: string) => {
  const iconMap: {[key: string]: string} = {
    '生活技巧': 'lightbulb',
    '家居装饰': 'chair',
    '美食烹饪': 'restaurant',
    '旅行探索': 'flight',
    '健康养生': 'spa',
    '职场技能': 'work'
  }
  
  return iconMap[categoryName] || 'category'
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取分类信息
const fetchCategory = async () => {
  const categoryId = route.params.id as string
  try {
    const result = await categoryStore.fetchCategory(categoryId)
    if (result) {
      category.value = result
      document.title = `${result.name} - Lumen论坛`
      
      // 模拟关注状态
      isFollowing.value = Math.random() > 0.5
    }
  } catch (error) {
    console.error('Failed to fetch category:', error)
    ElMessage.error('获取分类信息失败')
  }
}

// 获取帖子列表
const fetchPosts = async () => {
  loading.value = true
  const categoryId = route.params.id as string
  
  try {
    const result = await postStore.fetchPosts({
      category_id: categoryId,
      page: currentPage.value,
      per_page: pageSize.value,
      filter: filterOption.value,
      sort_by: sortOption.value
    })
    
    if (result) {
      posts.value = result.data
      totalPosts.value = result.total || posts.value.length
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    ElMessage.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

// 切换关注状态
const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  const message = isFollowing.value ? '已关注分类' : '已取消关注'
  ElMessage.success(message)
  // 实际项目中应该调用API进行关注/取消关注操作
}

// 导航到创建帖子页面
const navigateToCreatePost = () => {
  if (category.value) {
    router.push({ 
      name: 'createPost',
      query: { category: category.value.id }
    })
  } else {
    router.push({ name: 'createPost' })
  }
}

// 页码改变
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchPosts()
}

// 每页条数改变
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchPosts()
}

// 监听筛选和排序变化
watch([filterOption, sortOption], () => {
  currentPage.value = 1
  fetchPosts()
})

// 监听路由参数变化
watch(
  () => route.params.id,
  () => {
    fetchCategory()
    currentPage.value = 1
    fetchPosts()
  }
)

onMounted(() => {
  fetchCategory()
  fetchPosts()
})
</script>

<style scoped>
.category-page {
  padding: var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
}

.category-header {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  display: flex;
  gap: var(--spacing-6);
  border: 1px solid var(--border-light);
}

.category-icon {
  width: 64px;
  height: 64px;
  background-color: var(--primary-light);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon .material-icons-round {
  font-size: 32px;
  color: var(--primary-color);
}

.category-info {
  flex: 1;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-3);
}

.category-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.category-stats {
  display: flex;
  gap: var(--spacing-4);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.stat-item .material-icons-round {
  font-size: 16px;
  color: var(--text-tertiary);
}

.category-description {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-4);
  line-height: 1.5;
}

.category-actions {
  display: flex;
  gap: var(--spacing-3);
}

.category-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-6);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.sort-label {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.post-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.pagination-container {
  margin-top: var(--spacing-6);
  display: flex;
  justify-content: center;
}

.empty-state {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-8);
  text-align: center;
  border: 1px solid var(--border-light);
}

/* 侧边栏样式 */
.sidebar-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
}

.card-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-light);
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--text-primary);
}

.card-body {
  padding: var(--spacing-4);
}

.about-category {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.category-rules {
  margin-top: var(--spacing-3);
}

.category-rules h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
  color: var(--text-primary);
}

.category-created {
  margin-top: var(--spacing-3);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* 标签云样式 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
}

.tag-item:hover {
  background-color: var(--primary-color);
  color: var(--white);
  transform: translateY(-2px);
}

.tag-count {
  font-size: var(--font-size-xs);
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.tag-item:hover .tag-count {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 活跃用户样式 */
.active-users {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.active-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2) 0;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s ease;
}

.active-user:hover {
  transform: translateX(4px);
}

.active-user .user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.active-user .user-name {
  font-weight: var(--font-weight-medium);
  margin-bottom: 2px;
}

.active-user .user-posts {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* 相关分类样式 */
.related-categories {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.related-category {
  display: flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: background-color 0.2s ease;
}

.related-category:hover {
  background-color: var(--bg-subtle);
}

.related-category .material-icons-round {
  font-size: 20px;
  color: var(--primary-color);
  margin-right: var(--spacing-2);
}

.related-category .category-name {
  flex: 1;
}

.related-category .post-count {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  background-color: var(--bg-subtle);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .category-content {
    grid-template-columns: 1fr;
  }
  
  .content-sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-4);
  }
}

@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: center;
    text-align: center;
  }
  
  .category-meta {
    flex-direction: column;
    align-items: center;
  }
  
  .category-stats {
    margin-top: var(--spacing-3);
  }
  
  .category-actions {
    justify-content: center;
  }
  
  .filter-bar {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .content-sidebar {
    grid-template-columns: 1fr;
  }
}
</style> 