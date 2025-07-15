<template>
  <div class="app-layout">
    <Header />
    
    <main class="main-content">
      <div class="container main-container">
        <div class="content-wrapper" :class="{ 'full-width': isFullWidthPage, 'post-detail-layout': isPostDetailPage }">
          <aside v-if="showSidebar" class="sidebar">
            <div class="sidebar-inner">
              <!-- 分类导航 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">category</span>
                  分类导航
                </h3>
                <div v-if="loading.categories" class="sidebar-loading">
                  <span class="material-icons-round loading-icon">sync</span>
                  <span>加载中...</span>
                </div>
                <ul v-else class="sidebar-menu">
                  <li v-for="category in categories" :key="category.id">
                    <router-link :to="{ name: 'category', params: { id: category.id } }">
                      <span class="material-icons-round menu-icon">{{ getCategoryIcon(category.name) }}</span>
                      {{ category.name }}
                    </router-link>
                  </li>
                </ul>
              </div>
              
              <!-- 热门话题 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">local_fire_department</span>
                  热门话题
                </h3>
                <div v-if="loading.popularTags" class="sidebar-loading">
                  <span class="material-icons-round loading-icon">sync</span>
                  <span>加载中...</span>
                </div>
                <div v-else class="tag-cloud">
                  <router-link 
                    v-for="tag in popularTags" 
                    :key="tag.id"
                    :to="{ name: 'search', query: { tag: tag.id } }"
                    class="tag-item font-rounded"
                  >
                    {{ tag.name }}
                  </router-link>
                </div>
              </div>
              
              <!-- 社区统计 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">analytics</span>
                  社区统计
                </h3>
                <div v-if="loading.stats" class="sidebar-loading">
                  <span class="material-icons-round loading-icon">sync</span>
                  <span>加载中...</span>
                </div>
                <div v-else class="stats-list">
                  <div class="stat-item">
                    <div class="stat-icon-wrapper">
                      <span class="material-icons-round stat-icon">people</span>
                      <span class="stat-label">用户</span>
                    </div>
                    <span class="stat-value font-rounded">{{ stats.users }}</span>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon-wrapper">
                      <span class="material-icons-round stat-icon">article</span>
                      <span class="stat-label">帖子</span>
                    </div>
                    <span class="stat-value font-rounded">{{ stats.posts }}</span>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon-wrapper">
                      <span class="material-icons-round stat-icon">comment</span>
                      <span class="stat-label">评论</span>
                    </div>
                    <span class="stat-value font-rounded">{{ stats.comments }}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          <div class="content-main">
            <!-- 页面主要内容 -->
            <slot></slot>
          </div>
          
          <!-- 右侧边栏 - 常规页面 -->
          <aside v-if="showRightSidebar && !isPostDetailPage && !isAboutPage" class="sidebar sidebar-right">
            <div class="sidebar-inner">
              <!-- 活跃用户 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">group</span>
                  活跃用户
                </h3>
                <div v-if="loading.activeUsers" class="sidebar-loading">
                  <span class="material-icons-round loading-icon">sync</span>
                  <span>加载中...</span>
                </div>
                <ul v-else class="user-list">
                  <li v-for="user in activeUsers" :key="user.id" class="user-item">
                    <router-link :to="{ name: 'userProfile', params: { id: user.id } }">
                      <img :src="user.avatar || '/default-avatar.png'" :alt="user.username" class="user-avatar">
                      <div class="user-info">
                        <span class="user-name font-rounded">{{ user.username }}</span>
                        <small class="user-title">{{ user.title || '论坛用户' }}</small>
                      </div>
                    </router-link>
                  </li>
                </ul>
              </div>
              
              <!-- 热门话题 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">trending_up</span>
                  热门话题
                </h3>
                <div v-if="loading.hotTopics" class="sidebar-loading">
                  <span class="material-icons-round loading-icon">sync</span>
                  <span>加载中...</span>
                </div>
                <div v-else class="hot-topics">
                  <div v-for="(topic, index) in hotTopics" :key="index" class="hot-topic-item">
                    <div class="topic-rank font-rounded" :class="{ 'top-rank': index < 3 }">{{ index + 1 }}</div>
                    <div class="topic-content">
                      <router-link :to="{ name: 'postDetail', params: { id: topic.id } }" class="topic-title font-rounded">
                        {{ topic.title }}
                      </router-link>
                      <div class="topic-meta">
                        <span class="topic-views">
                          <span class="material-icons-round">visibility</span>
                          {{ topic.views }}
                        </span>
                        <span class="topic-comments">
                          <span class="material-icons-round">comment</span>
                          {{ topic.comments }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 推荐阅读 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">bookmark</span>
                  推荐阅读
                </h3>
                <div v-if="loading.recommendedPosts" class="sidebar-loading">
                  <span class="material-icons-round loading-icon">sync</span>
                  <span>加载中...</span>
                </div>
                <div v-else class="recommended-posts">
                  <div v-for="(post, index) in recommendedPosts" :key="index" class="recommended-post">
                    <router-link :to="{ name: 'postDetail', params: { id: post.id } }">
                      <div class="post-category">{{ post.category }}</div>
                      <div class="post-title">{{ post.title }}</div>
                      <div class="post-author">
                        <img :src="post.author.avatar || '/default-avatar.png'" :alt="post.author.name" class="author-avatar">
                        <span class="author-name">{{ post.author.name }}</span>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
              
              <!-- 社区公告 -->
              <div class="sidebar-block announcement-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">campaign</span>
                  社区公告
                </h3>
                <div class="announcements">
                  <div v-for="(announcement, index) in announcements" :key="index" class="announcement-item">
                    <div class="announcement-date">{{ formatAnnouncementDate(announcement.date) }}</div>
                    <div class="announcement-content">{{ announcement.content }}</div>
                  </div>
                </div>
              </div>
              
              <!-- 最近活动 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">history</span>
                  最近活动
                </h3>
                <div v-if="loading.recentActivities" class="sidebar-loading">
                  <span class="material-icons-round loading-icon">sync</span>
                  <span>加载中...</span>
                </div>
                <ul v-else class="activity-list">
                  <li v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                    <span class="material-icons-round activity-icon" :class="activityIconClass(activity.type)">
                      {{ getActivityIcon(activity.type) }}
                    </span>
                    <div class="activity-content">
                      <p v-html="formatActivity(activity)"></p>
                      <small class="activity-time">{{ formatTime(activity.time) }}</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
          
          <!-- 右侧边栏 - 帖子详情页专用 -->
          <aside v-if="isPostDetailPage" class="sidebar sidebar-right post-detail-sidebar">
            <div class="sidebar-inner">
              <CommentList 
                :postId="currentPostId" 
                @scrollToComments="emitScrollToComments" 
                @scrollToCommentForm="emitScrollToCommentForm"
              />
            </div>
          </aside>
          
          <!-- 右侧边栏 - 关于页面专用 -->
          <aside v-if="isAboutPage" class="sidebar sidebar-right">
            <div class="sidebar-inner">
              <!-- 联系我们 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">contact_support</span>
                  联系我们
                </h3>
                <div class="contact-card">
                  <div class="contact-item">
                    <span class="material-icons-round">email</span>
                    <a href="mailto:contact@lumen-forum.com" class="font-rounded">contact@lumen-forum.com</a>
                  </div>
                  <div class="contact-item">
                    <span class="material-icons-round">phone</span>
                    <span class="font-rounded">400-123-4567</span>
                  </div>
                  <div class="contact-item">
                    <span class="material-icons-round">location_on</span>
                    <span>北京市海淀区科技园区88号</span>
                  </div>
                </div>
              </div>
              
              <!-- 社区指南 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">menu_book</span>
                  社区指南
                </h3>
                <div class="guide-list">
                  <a href="#" class="guide-item">
                    <span class="material-icons-round">description</span>
                    <span>社区规则</span>
                  </a>
                  <a href="#" class="guide-item">
                    <span class="material-icons-round">security</span>
                    <span>隐私政策</span>
                  </a>
                  <a href="#" class="guide-item">
                    <span class="material-icons-round">info</span>
                    <span>常见问题</span>
                  </a>
                  <a href="#" class="guide-item">
                    <span class="material-icons-round">help</span>
                    <span>帮助中心</span>
                  </a>
                </div>
              </div>
              
              <!-- 社区数据 -->
              <div class="sidebar-block">
                <h3 class="sidebar-title">
                  <span class="material-icons-round">bar_chart</span>
                  社区数据
                </h3>
                <div class="data-grid">
                  <div class="data-item">
                    <div class="data-value">{{ stats.users }}</div>
                    <div class="data-label">注册用户</div>
                  </div>
                  <div class="data-item">
                    <div class="data-value">{{ stats.posts }}</div>
                    <div class="data-label">发布帖子</div>
                  </div>
                  <div class="data-item">
                    <div class="data-value">{{ stats.comments }}</div>
                    <div class="data-label">回复评论</div>
                  </div>
                  <div class="data-item">
                    <div class="data-value">99%</div>
                    <div class="data-label">用户满意度</div>
                  </div>
                </div>
              </div>
              
              <!-- 加入社区 -->
              <div class="sidebar-block join-block">
                <h3 class="sidebar-title font-rounded letter-tight">
                  <span class="material-icons-round">person_add</span>
                  加入我们的社区
                </h3>
                <p class="join-text">成为Lumen社区的一员，分享你的知识和经验</p>
                <el-button type="primary" class="join-btn" @click="showLoginModal">立即加入</el-button>
              </div>
            </div>
          </aside>
          
          <!-- 右侧边栏 - 用户详情页专用 -->
          <aside v-if="isUserProfilePage" class="sidebar sidebar-right user-profile-sidebar">
            <div class="sidebar-inner">
              <!-- 用户成就 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">emoji_events</span>
                    用户成就
                  </h3>
                </div>
                <div class="card-body">
                  <div v-if="userAchievements.length === 0" class="empty-achievements">
                    <p>暂无成就</p>
                  </div>
                  <div v-else class="achievements-list">
                    <div v-for="(achievement, index) in userAchievements" :key="index" class="achievement-item">
                      <div class="achievement-icon" :class="achievement.level">
                        <span class="material-icons-round">{{ achievement.icon }}</span>
                      </div>
                      <div class="achievement-info">
                        <div class="achievement-name">{{ achievement.name }}</div>
                        <div class="achievement-desc">{{ achievement.description }}</div>
                        <div class="achievement-date">获得于 {{ formatDate(achievement.date) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 联系信息 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">contact_mail</span>
                    联系信息
                  </h3>
                </div>
                <div class="card-body">
                  <div class="contact-info">
                    <div v-if="profileUser && profileUser.email && (isCurrentUserProfile || profileUser.show_email)" class="contact-item">
                      <span class="material-icons-round">email</span>
                      <span class="contact-text">{{ profileUser.email }}</span>
                    </div>
                    <div v-if="profileUser && profileUser.website" class="contact-item">
                      <span class="material-icons-round">language</span>
                      <a :href="profileUser.website" target="_blank" class="contact-link">{{ formatWebsiteUrl(profileUser.website) }}</a>
                    </div>
                    <div v-if="profileUser && profileUser.location" class="contact-item">
                      <span class="material-icons-round">location_on</span>
                      <span class="contact-text">{{ profileUser.location }}</span>
                    </div>
                    <div v-if="!profileUser || (!profileUser.email && !profileUser.website && !profileUser.location)" class="empty-contact">
                      <p>暂无联系信息</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 技能标签 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">auto_awesome</span>
                    技能标签
                  </h3>
                </div>
                <div class="card-body">
                  <div v-if="userSkills.length === 0" class="empty-skills">
                    <p>暂无技能标签</p>
                  </div>
                  <div v-else class="skills-list">
                    <el-tag
                      v-for="(skill, index) in userSkills"
                      :key="index"
                      :type="getSkillTagType(index)"
                      class="skill-tag"
                      effect="light"
                    >
                      {{ skill.name }}
                      <el-progress 
                        :percentage="skill.level" 
                        :show-text="false"
                        :stroke-width="4"
                        class="skill-progress"
                      />
                    </el-tag>
                  </div>
                </div>
              </div>
              
              <!-- 社交媒体 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">share</span>
                    社交媒体
                  </h3>
                </div>
                <div class="card-body">
                  <div v-if="socialLinks.length === 0" class="empty-social">
                    <p>暂无社交媒体链接</p>
                  </div>
                  <div v-else class="social-links">
                    <a 
                      v-for="(social, index) in socialLinks" 
                      :key="index"
                      :href="social.url"
                      target="_blank"
                      class="social-link"
                      :title="social.name"
                    >
                      <span class="material-icons-round">{{ social.icon }}</span>
                      <span class="social-name">{{ social.name }}</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <!-- 推荐关注 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">person_add</span>
                    推荐关注
                  </h3>
                </div>
                <div class="card-body">
                  <div v-if="recommendedProfileUsers.length === 0" class="empty-recommended">
                    <p>暂无推荐用户</p>
                  </div>
                  <div v-else class="recommended-users">
                    <div v-for="(user, index) in recommendedProfileUsers" :key="index" class="recommended-user">
                      <router-link :to="{ name: 'userProfile', params: { id: user.id } }" class="user-link">
                        <img :src="user.avatar || '/default-avatar.png'" :alt="user.username" class="user-avatar">
                        <div class="user-info">
                          <div class="user-name">{{ user.username }}</div>
                          <div class="user-title">{{ user.title || '论坛用户' }}</div>
                        </div>
                      </router-link>
                      <el-button size="small" type="primary" plain @click="followUser(user.id)">
                        <span class="material-icons-round">person_add</span>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 活跃分类 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">category</span>
                    活跃分类
                  </h3>
                </div>
                <div class="card-body">
                  <div v-if="userActiveCategories.length === 0" class="empty-categories">
                    <p>暂无活跃分类</p>
                  </div>
                  <div v-else class="categories-list">
                    <div v-for="(category, index) in userActiveCategories" :key="index" class="category-item">
                      <div class="category-info">
                        <router-link :to="{ name: 'category', params: { id: category.id } }" class="category-name">
                          {{ category.name }}
                        </router-link>
                        <div class="category-count">{{ category.post_count }} 帖子</div>
                      </div>
                      <el-progress 
                        :percentage="calculateCategoryPercentage(category)" 
                        :color="getCategoryColor(index)"
                        :show-text="false"
                        :stroke-width="8"
                        class="category-progress"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 最近活动 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">history</span>
                    最近活动
                  </h3>
                </div>
                <div class="card-body">
                  <div v-if="userRecentActivities.length === 0" class="empty-activities">
                    <p>暂无活动记录</p>
                  </div>
                  <div v-else class="activities-list">
                    <div v-for="(activity, index) in userRecentActivities" :key="index" class="activity-item">
                      <div class="activity-icon">
                        <span class="material-icons-round">{{ getUserActivityIcon(activity.type) }}</span>
                      </div>
                      <div class="activity-content">
                        <div class="activity-text" v-html="formatUserActivity(activity)"></div>
                        <div class="activity-time">{{ formatRelativeTime(activity.time) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 相关标签 -->
              <div class="sidebar-card">
                <div class="card-header">
                  <h3 class="card-title">
                    <span class="material-icons-round">tag</span>
                    常用标签
                  </h3>
                </div>
                <div class="card-body">
                  <div v-if="userTags.length === 0" class="empty-tags">
                    <p>暂无常用标签</p>
                  </div>
                  <div v-else class="tags-cloud">
                    <router-link 
                      v-for="(tag, index) in userTags" 
                      :key="index"
                      :to="{ name: 'search', query: { tag: tag.id } }"
                      class="tag-item"
                      :style="{ fontSize: getTagSize(tag.count) }"
                    >
                      {{ tag.name }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Footer from './Footer.vue'
import CommentList from '../forum/CommentList.vue'
import LoginModal from '../common/LoginModal.vue'
import { useCategoryStore } from '../../stores/categoryStore'
import { useUserStore } from '../../stores/userStore'
import { categoryApi, tagApi, userApi, postApi, activityApi, statsApi } from '../../services/api'

const categoryStore = useCategoryStore()
const userStore = useUserStore()
const route = useRoute()
const showLoginModal = ref(false)

// 是否显示侧边栏
const showSidebar = computed(() => {
  // 排除不需要侧边栏的页面
  const excludedRoutes = ['login', 'notFound', 'createPost', 'editPost']
  return !excludedRoutes.includes(route.name as string)
})

// 是否显示右侧边栏
const showRightSidebar = computed(() => {
  // 只在特定页面显示右侧边栏
  const includedRoutes = ['home', 'category', 'search']
  return includedRoutes.includes(route.name as string)
})

// 是否为帖子详情页
const isPostDetailPage = computed(() => {
  return route.name === 'postDetail'
})

// 是否为关于页面
const isAboutPage = computed(() => {
  return route.name === 'about'
})

// 是否为用户详情页
const isUserProfilePage = computed(() => {
  return route.name === 'userProfile'
})

// 是否需要全宽布局的页面（发帖和编辑帖子）
const isFullWidthPage = computed(() => {
  const fullWidthRoutes = ['createPost', 'editPost']
  return fullWidthRoutes.includes(route.name as string)
})

// 当前帖子ID
const currentPostId = computed(() => {
  return isPostDetailPage.value ? route.params.id : null
})

// 用户详情页数据
const profileUser = ref(null)
const isCurrentUserProfile = computed(() => {
  return userStore.currentUser && profileUser.value && userStore.currentUser.id === profileUser.value.id
})

// API数据
const loading = ref({
  categories: false,
  popularTags: false,
  stats: false,
  activeUsers: false,
  recentActivities: false,
  hotTopics: false,
  recommendedPosts: false
})

// 分类数据
const categories = ref([])
const fetchCategories = async () => {
  loading.value.categories = true
  try {
    const response = await categoryApi.getCategories()
    categories.value = response.data || []
  } catch (error) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value.categories = false
  }
}

// 热门标签
const popularTags = ref([])
const fetchPopularTags = async () => {
  loading.value.popularTags = true
  try {
    const response = await tagApi.getPopularTags(10)
    popularTags.value = response.data || []
  } catch (error) {
    console.error('获取热门标签失败:', error)
  } finally {
    loading.value.popularTags = false
  }
}

// 论坛统计数据
const stats = ref({
  users: '0',
  posts: '0',
  comments: '0'
})
const fetchForumStats = async () => {
  loading.value.stats = true
  try {
    const response = await statsApi.getForumStats()
    if (response.data) {
      stats.value = {
        users: formatNumber(response.data.userCount || 0),
        posts: formatNumber(response.data.postCount || 0),
        comments: formatNumber(response.data.commentCount || 0)
      }
    }
  } catch (error) {
    console.error('获取论坛统计数据失败:', error)
  } finally {
    loading.value.stats = false
  }
}

// 活跃用户
const activeUsers = ref([])
const fetchActiveUsers = async () => {
  loading.value.activeUsers = true
  try {
    const response = await userApi.getActiveUsers(5)
    activeUsers.value = response.data || []
  } catch (error) {
    console.error('获取活跃用户失败:', error)
  } finally {
    loading.value.activeUsers = false
  }
}

// 最近活动
const recentActivities = ref([])
const fetchRecentActivities = async () => {
  loading.value.recentActivities = true
  try {
    const response = await activityApi.getRecentActivities(3)
    recentActivities.value = response.data || []
  } catch (error) {
    console.error('获取最近活动失败:', error)
  } finally {
    loading.value.recentActivities = false
  }
}

// 热门话题
const hotTopics = ref([])
const fetchHotTopics = async () => {
  loading.value.hotTopics = true
  try {
    const response = await postApi.getHotTopics(5)
    hotTopics.value = response.data || []
  } catch (error) {
    console.error('获取热门话题失败:', error)
  } finally {
    loading.value.hotTopics = false
  }
}

// 推荐阅读
const recommendedPosts = ref([])
const fetchRecommendedPosts = async () => {
  loading.value.recommendedPosts = true
  try {
    const response = await postApi.getRecommendedPosts(3)
    recommendedPosts.value = response.data || []
  } catch (error) {
    console.error('获取推荐阅读失败:', error)
  } finally {
    loading.value.recommendedPosts = false
  }
}

// 社区公告数据
const announcements = ref([
  { 
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 2, // 2天前
    content: '论坛将于本周六进行系统升级，可能会有短暂的服务中断'
  },
  { 
    date: new Date().getTime() - 1000 * 60 * 60 * 24 * 5, // 5天前
    content: '欢迎参与"我的家居改造"主题征文活动，优秀作品将获得精美礼品'
  }
])

// 用户成就
const userAchievements = ref([
  {
    name: '优质创作者',
    description: '发布10篇高质量帖子',
    icon: 'auto_awesome',
    level: 'gold',
    date: '2023-04-15T00:00:00Z'
  },
  {
    name: '活跃评论者',
    description: '发表30条评论',
    icon: 'comment',
    level: 'silver',
    date: '2023-03-10T00:00:00Z'
  },
  {
    name: '新手上路',
    description: '成功注册并完善个人资料',
    icon: 'person',
    level: 'bronze',
    date: '2023-01-01T00:00:00Z'
  }
])

// 用户技能数据
const userSkills = ref([
  { name: '家居设计', level: 90 },
  { name: '植物养护', level: 75 },
  { name: '摄影', level: 60 },
  { name: '烹饪', level: 85 },
  { name: 'DIY手工', level: 70 }
])

// 社交媒体链接
const socialLinks = ref([
  { name: '微博', icon: 'public', url: 'https://weibo.com/username' },
  { name: '知乎', icon: 'help_outline', url: 'https://zhihu.com/people/username' },
  { name: '小红书', icon: 'book', url: 'https://xiaohongshu.com/user/profile/username' },
  { name: 'GitHub', icon: 'code', url: 'https://github.com/username' }
])

// 推荐关注用户
const recommendedProfileUsers = ref([
  {
    id: 101,
    username: '创意达人',
    avatar: '',
    title: '家居设计师'
  },
  {
    id: 102,
    username: '美食家',
    avatar: '',
    title: '烹饪爱好者'
  },
  {
    id: 103,
    username: '旅行者',
    avatar: '',
    title: '环球旅行家'
  }
])

// 用户标签数据
const userTags = ref([
  { id: 1, name: '家居装饰', count: 8 },
  { id: 2, name: '厨房收纳', count: 5 },
  { id: 3, name: '极简主义', count: 7 },
  { id: 4, name: '手工DIY', count: 3 },
  { id: 5, name: '植物养护', count: 6 },
  { id: 6, name: '旅行攻略', count: 4 },
  { id: 7, name: '摄影技巧', count: 2 }
])

// 用户活跃分类
const userActiveCategories = ref([
  { id: 2, name: '家居装饰', post_count: 8, total_posts: 12 },
  { id: 1, name: '生活技巧', post_count: 3, total_posts: 12 },
  { id: 4, name: '旅行探索', post_count: 1, total_posts: 12 }
])

// 用户最近活动
const userRecentActivities = ref([
  {
    type: 'post',
    content: '发布了帖子 <a href="#">如何打造舒适的居家办公环境</a>',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2小时前
  },
  {
    type: 'comment',
    content: '评论了帖子 <a href="#">10种常见室内植物的养护方法</a>',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5小时前
  },
  {
    type: 'like',
    content: '收藏了帖子 <a href="#">小户型收纳技巧分享</a>',
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1天前
  },
  {
    type: 'achievement',
    content: '获得成就 <strong>活跃评论者</strong>',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3天前
  }
])

// 格式化数字
const formatNumber = (num: number): string => {
  if (num < 1000) return String(num);
  if (num < 10000) return (num / 1000).toFixed(1) + 'k';
  return (num / 10000).toFixed(1) + 'w';
};

// 格式化公告日期
const formatAnnouncementDate = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化活动内容
const formatActivity = (activity) => {
  switch (activity.type) {
    case 'post':
      return `<strong>${activity.user.username}</strong> 发布了 <strong>${activity.post.title}</strong>`
    case 'comment':
      return `<strong>${activity.user.username}</strong> 评论了 <strong>${activity.post.title}</strong>`
    case 'like':
      return `<strong>${activity.user.username}</strong> 赞了 <strong>${activity.post.title}</strong>`
    default:
      return ''
  }
}

// 获取活动图标
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'post':
      return 'post_add'
    case 'comment':
      return 'comment'
    case 'like':
      return 'thumb_up'
    default:
      return 'notifications'
  }
}

// 活动图标类名
const activityIconClass = (type: string) => {
  return `activity-icon-${type}`
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = new Date().getTime()
  const diff = now - timestamp
  
  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  
  // 小于24小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  
  // 小于7天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}天前`
  }
  
  // 其他情况显示日期
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化相对时间
const formatRelativeTime = (dateString) => {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 30) {
    return formatDate(dateString)
  } else if (diffDays > 0) {
    return `${diffDays}天前`
  } else if (diffHours > 0) {
    return `${diffHours}小时前`
  } else if (diffMins > 0) {
    return `${diffMins}分钟前`
  } else {
    return '刚刚'
  }
}

// 获取用户活动图标
const getUserActivityIcon = (type) => {
  switch (type) {
    case 'post':
      return 'post_add'
    case 'comment':
      return 'comment'
    case 'like':
      return 'favorite'
    case 'achievement':
      return 'emoji_events'
    default:
      return 'notifications'
  }
}

// 格式化用户活动内容
const formatUserActivity = (activity) => {
  return activity.content
}

// 计算分类百分比
const calculateCategoryPercentage = (category) => {
  return Math.round((category.post_count / category.total_posts) * 100)
}

// 获取分类颜色
const getCategoryColor = (index) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
  return colors[index % colors.length]
}

// 获取分类图标
const getCategoryIcon = (name) => {
  switch (name) {
    case '生活技巧':
      return 'lightbulb_outline'
    case '家居装饰':
      return 'home'
    case '美食烹饪':
      return 'restaurant'
    case '旅行探索':
      return 'directions_walk'
    case '健康养生':
      return 'healing'
    case '职场技能':
      return 'work'
    default:
      return 'category'
  }
}

// 获取技能标签类型
const getSkillTagType = (index) => {
  const types = ['', 'success', 'warning', 'danger', 'info']
  return types[index % types.length]
}

// 格式化网站URL显示
const formatWebsiteUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

// 获取标签大小
const getTagSize = (count) => {
  const minSize = 12;
  const maxSize = 20;
  const maxCount = Math.max(...userTags.value.map(tag => tag.count));
  const size = minSize + (count / maxCount) * (maxSize - minSize);
  return `${size}px`;
}

// 关注用户
const followUser = (userId) => {
  // 实际项目中应该调用API进行关注操作
  // 例如：userApi.followUser(userId)
}

// 向父组件传递滚动事件
const emitScrollToComments = (commentId) => {
  const event = new CustomEvent('scrollToComments', {
    detail: { commentId }
  })
  window.dispatchEvent(event)
}

// 向父组件传递滚动到评论表单事件
const emitScrollToCommentForm = () => {
  const event = new CustomEvent('scrollToCommentForm')
  window.dispatchEvent(event)
}

onMounted(async () => {
  // 获取数据
  fetchCategories()
  fetchPopularTags()
  fetchForumStats()
  
  // 如果是常规页面，获取右侧边栏数据
  if (showRightSidebar.value) {
    fetchActiveUsers()
    fetchRecentActivities()
    fetchHotTopics()
    fetchRecommendedPosts()
  }
  
  // 如果是用户详情页，获取用户数据
  if (isUserProfilePage.value) {
    const userId = route.params.id
    try {
      const response = await userApi.getUserById(userId)
      profileUser.value = response.data || null
    } catch (error) {
      // 记录错误信息，但不影响整体页面加载
      console.error('获取用户数据失败:', error)
    }
  }
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: var(--header-height);
  background-color: var(--bg-body);
}

.main-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: var(--spacing-6);
  padding-bottom: var(--spacing-6);
  width: 100%;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

/* 创建帖子和编辑帖子页面使用全宽布局 */
.content-wrapper.full-width {
  max-width: 900px;
  margin: 0 auto;
}

/* 大于768px的屏幕显示侧边栏 */
@media (min-width: 768px) {
  .content-wrapper:not(.full-width) {
    grid-template-columns: 220px 1fr;
  }
}

/* 大于1024px的屏幕显示右侧边栏 */
@media (min-width: 1024px) {
  .content-wrapper:not(.full-width) {
    grid-template-columns: 250px 1fr  300px;
  }
  
  /* 帖子详情页使用更宽的右侧边栏 */
  .content-wrapper:not(.full-width) .sidebar-right.post-detail-sidebar {
    width: 100%;
  }
  
  /* 在帖子详情页调整网格布局 */
  .content-wrapper:not(.full-width) .post-detail-layout {
    grid-template-columns: 250px 1fr 380px;
  }
}

.content-main {
  min-width: 0; /* 防止内容溢出 */
}

.sidebar {
  position: relative;
}

.sidebar-inner {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-6));
}

.sidebar-block {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
}

.sidebar-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--spacing-2);
  margin-bottom: var(--spacing-3);
  margin-left: var(--spacing-1);
  padding-bottom: var(--spacing-2);
  padding-left: var(--spacing-1);
  border-bottom: 1px solid var(--border-light);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

.sidebar-title .material-icons-round {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  border-bottom: 1px solid var(--border-light);
}

.sidebar-menu li:last-child {
  border-bottom: none;
}

.sidebar-menu a {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--text-primary);
  transition: background-color var(--transition-fast);
}

.menu-icon {
  font-size: 1.1rem;
  margin-right: var(--spacing-3);
  color: var(--primary-color);
}

.sidebar-menu a:hover,
.sidebar-menu a.router-link-active {
  background-color: var(--bg-subtle);
  color: var(--primary-color);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tag-item {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-2);
  background-color: rgba(249, 168, 38, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.tag-item:hover {
  background-color: var(--primary-color);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.stats-list {
  padding: var(--spacing-4);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) 0;
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 1.1rem;
  color: var(--primary-color);
  margin-right: var(--spacing-2);
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  font-weight: var(--font-weight-semibold);
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  border-bottom: 1px solid var(--border-light);
}

.user-item:last-child {
  border-bottom: none;
}

.user-item a {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--text-primary);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--spacing-3);
  border: 2px solid var(--border-light);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
}

.user-title {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

.activity-list {
  list-style: none;
  padding: var(--spacing-3) var(--spacing-4);
  margin: 0;
}

.activity-item {
  display: flex;
  padding: var(--spacing-2) 0;
  gap: var(--spacing-3);
}

.activity-icon {
  width: 32px;
  height: 32px;
  background-color: var(--bg-subtle);
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0;
}

.activity-icon-post {
  color: var(--primary-color);
}

.activity-icon-comment {
  color: var(--info-color);
}

.activity-icon-like {
  color: var(--success-color);
}

.activity-content {
  flex-grow: 1;
}

.activity-content p {
  margin-bottom: var(--spacing-1);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.activity-time {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

/* 关于页面右侧边栏样式 */
.contact-card {
  padding: var(--spacing-4);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item i {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-3);
  color: var(--primary-color);
  font-size: var(--font-size-lg);
}

.contact-item a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-item a:hover {
  color: var(--primary-color);
}

.guide-list {
  padding: var(--spacing-4);
}

.guide-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-2) 0;
  color: var(--text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.guide-item:hover {
  color: var(--primary-color);
}

.guide-item i {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-3);
  color: var(--text-secondary);
}

.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
}

.data-item {
  text-align: center;
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  background-color: var(--bg-subtle);
}

.data-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-1);
}

.data-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.join-block {
  padding: var(--spacing-4);
  text-align: center;
  background-image: linear-gradient(to bottom right, var(--primary-light), var(--bg-surface));
}

.join-title {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
  border-bottom: none;
  padding: 0;
}

.join-text {
  margin-bottom: var(--spacing-4);
  color: var(--text-secondary);
}

.join-btn {
  width: 100%;
}

/* 图标样式 */
.icon-email::before {
  content: "✉️";
}

.icon-phone::before {
  content: "📞";
}

.icon-location::before {
  content: "📍";
}

.icon-doc::before {
  content: "📄";
}

.icon-shield::before {
  content: "🛡️";
}

.icon-info::before {
  content: "ℹ️";
}

.icon-help::before {
  content: "❓";
}

/* 响应式调整 */
@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}

/* 添加Material Icons样式 */
.material-icons-round {
  font-size: 1.1rem;
  margin-right: var(--spacing-2);
  vertical-align: middle;
  color: var(--primary-color) !important; /* 添加!important确保优先级 */
}

/* 确保关于页面专用的联系我们区域图标颜色一致 */
.contact-item .material-icons-round {
  font-size: 1.2rem;
  margin-right: var(--spacing-3);
  color: var(--primary-color) !important; /* 确保联系信息图标颜色一致 */
}

.guide-item .material-icons-round {
  font-size: 1.1rem;
  margin-right: var(--spacing-2);
  color: var(--primary-color) !important; /* 确保社区指南图标颜色一致 */
}

/* 直接选择关于页面专用区域中的图标 */
.sidebar-right[class*="about"] span.material-icons-round {
  color: var(--primary-color) !important;
}

/* 直接选择用户详情页专用区域中的图标 */
.sidebar-right[class*="user-profile"] span.material-icons-round,
.user-profile-sidebar span.material-icons-round,
.card-title span.material-icons-round,
.contact-info span.material-icons-round,
.activity-icon span.material-icons-round,
.social-links span.material-icons-round,
.recommended-users span.material-icons-round {
  color: var(--primary-color) !important;
}

/* 热门话题样式 */
.hot-topics {
  padding: var(--spacing-3) var(--spacing-4);
}

.hot-topic-item {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-2) 0;
  gap: var(--spacing-3);
  border-bottom: 1px solid var(--border-light);
}

.hot-topic-item:last-child {
  border-bottom: none;
}

.topic-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}

.topic-rank.top-rank {
  background-color: var(--primary-color);
  color: var(--white);
}

.topic-content {
  flex: 1;
}

.topic-title {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-decoration: none;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--spacing-1);
}

.topic-title:hover {
  color: var(--primary-color);
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.topic-views, .topic-comments {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.topic-meta .material-icons-round {
  font-size: 14px;
  margin-right: 0;
}

/* 推荐阅读样式 */
.recommended-posts {
  padding: var(--spacing-3) var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.recommended-post {
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.recommended-post:hover {
  transform: translateY(-2px);
}

.recommended-post a {
  display: block;
  text-decoration: none;
  padding: var(--spacing-3);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
}

.post-category {
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  margin-bottom: var(--spacing-1);
  font-weight: var(--font-weight-medium);
}

.post-title {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
  line-height: 1.4;
  font-weight: var(--font-weight-medium);
}

.post-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

/* 社区公告样式 */
.announcements {
  padding: var(--spacing-3) var(--spacing-4);
}

.announcement-block {
  background-color: var(--bg-surface);
  border-left: 3px solid var(--primary-color);
}

.announcement-item {
  padding: var(--spacing-2) 0;
  border-bottom: 1px dashed var(--border-light);
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-date {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-1);
}

.announcement-content {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: 1.5;
}

/* 用户详情页右侧边栏样式 */
.user-profile-sidebar {
  width: 100%;
}

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
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.card-title .material-icons-round {
  font-size: 18px;
  color: var(--primary-color);
}

.card-body {
  padding: var(--spacing-4);
}

/* 成就列表样式 */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.achievement-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.achievement-icon.gold {
  background-color: rgba(255, 187, 0, 0.1);
  color: #ffbb00;
}

.achievement-icon.silver {
  background-color: rgba(160, 174, 192, 0.1);
  color: #a0aec0;
}

.achievement-icon.bronze {
  background-color: rgba(194, 127, 88, 0.1);
  color: #c27f58;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.achievement-date {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* 联系信息样式 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--text-secondary);
}

.contact-item .material-icons-round {
  font-size: 18px;
  color: var(--primary-color) !important; /* 确保图标颜色正确 */
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}

/* 技能标签样式 */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.skill-tag {
  margin-bottom: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-3);
  position: relative;
  overflow: hidden;
}

.skill-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.skill-progress :deep(.el-progress-bar__outer) {
  background-color: transparent;
}

/* 社交媒体链接样式 */
.social-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.social-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--text-secondary);
  text-decoration: none;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  transition: background-color 0.2s ease;
}

.social-link:hover {
  background-color: var(--bg-hover);
}

.social-link .material-icons-round {
  font-size: 18px;
  color: var(--primary-color);
}

/* 推荐用户样式 */
.recommended-users {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.recommended-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--text-primary);
  text-decoration: none;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
}

.user-title {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

/* 分类列表样式 */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  text-decoration: none;
}

.category-name:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.category-count {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* 活动列表样式 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.activity-item {
  display: flex;
  gap: var(--spacing-3);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon .material-icons-round {
  font-size: 18px;
  color: var(--primary-color);
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
  line-height: 1.4;
}

.activity-text a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.activity-text a:hover {
  text-decoration: underline;
}

.activity-time {
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
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.tag-item:hover {
  background-color: var(--primary-color);
  color: var(--white) !important; /* 确保悬浮时文字为白色 */
}

/* 空状态样式 */
.empty-achievements,
.empty-categories,
.empty-activities,
.empty-tags,
.empty-contact,
.empty-skills,
.empty-social,
.empty-recommended {
  text-align: center;
  padding: var(--spacing-2) 0;
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

/* 响应式调整 */
.sidebar-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6);
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

.loading-icon {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-2);
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<!-- 登录模态框 -->
<LoginModal v-model:visible="showLoginModal" /> 