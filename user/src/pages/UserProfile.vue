<template>
  <div class="user-profile-page" v-loading="loading">
      <!-- 用户信息卡片 -->
      <div v-if="user" class="profile-container">
        <div class="profile-header">
          <div class="cover-image" :style="coverStyle">
            <div v-if="isCurrentUser" class="cover-edit-overlay" @click="openCoverUpload">
              <span class="material-icons-round">photo_camera</span>
              <span class="edit-text">更换封面</span>
            </div>
          </div>
          <div class="user-info-wrapper">
            <div class="avatar-container">
              <img :src="getUserAvatarUrl(user?.avatar)" :alt="user?.username || '用户'" class="avatar avatar--xlarge">
              <div v-if="isOnline" class="status-badge online"></div>
              <div v-if="isCurrentUser" class="avatar-edit-overlay" @click="openAvatarUpload">
                <span class="material-icons-round">photo_camera</span>
                <span class="edit-text">更换头像</span>
              </div>
            </div>
            
            <div class="user-info">
              <div class="name-row">
                <h1 class="user-name">{{ user.username }}</h1>
                <div v-if="user.isAdmin || user.is_admin" class="role-badge admin">
                  <span class="material-icons-round">verified</span> 管理员
                </div>
                <div v-else-if="user.isModerator || user.is_moderator" class="role-badge moderator">
                  <span class="material-icons-round">shield</span> 版主
                </div>
              </div>
              
              <div class="user-meta">
                <div class="meta-item">
                  <span class="material-icons-round">calendar_today</span>
                  <span>加入于 {{ formatDate(user.createdAt || user.created_at) }}</span>
                </div>
                <div class="meta-item">
                  <span class="material-icons-round">schedule</span>
                  <span>最后活跃 {{ formatRelativeTime(user.lastActiveAt || user.last_active_at) }}</span>
                </div>
              </div>
              
              <p class="user-bio">{{ user.bio || '这个用户很懒，什么都没留下' }}</p>
            </div>
            
            <div class="action-buttons">
              <div class="action-buttons-container" v-if="!isCurrentUser">
                <el-button type="primary" size="small" class="follow-btn">
                  <span class="material-icons-round">person_add</span> 关注
                </el-button>
                <el-button type="primary" size="small" class="message-btn">
                  <span class="material-icons-round">mail</span> 私信
                </el-button>
              </div>
              
              <el-dropdown v-if="isCurrentUser">
                <el-button type="primary" size="small" class="edit-profile-btn">
                  <span class="material-icons-round edit-icon">edit</span> 编辑资料
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editBio">
                      <span class="material-icons-round">subject</span> 编辑简介
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <router-link to="/settings" class="dropdown-link">
                        <span class="material-icons-round">settings</span> 账号设置
                      </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click="openAvatarUpload">
                      <span class="material-icons-round">image</span> 更换头像
                    </el-dropdown-item>
                    <el-dropdown-item @click="openCoverUpload">
                      <span class="material-icons-round">wallpaper</span> 更换封面
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-card">
            <div class="stat-value">{{ user.post_count }}</div>
            <div class="stat-label">
              <span class="material-icons-round">description</span> 帖子
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ user.comment_count }}</div>
            <div class="stat-label">
              <span class="material-icons-round">comment</span> 评论
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ user.reputation }}</div>
            <div class="stat-label">
              <span class="material-icons-round">trending_up</span> 声望
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ followersCount }}</div>
            <div class="stat-label">
              <span class="material-icons-round">people</span> 关注者
            </div>
          </div>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <div v-if="user" class="profile-main">
        <div class="profile-content">
          <!-- 内容标签页 -->
          <div class="content-tabs-container">
            <el-tabs v-model="activeTab" class="profile-tabs">
              <el-tab-pane name="posts">
                <template #label>
                  <span class="tab-label">
                    <span class="material-icons-round">description</span>
                    帖子
                  </span>
                </template>
                
                <div class="tab-content">
                  <div class="content-header">
                    <h2 class="content-title">{{ user.username }} 的帖子</h2>
                    <div class="content-filters">
                      <el-radio-group v-model="postSortBy" size="small">
                        <el-radio-button value="recent">最新</el-radio-button>
                        <el-radio-button value="popular">热门</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  
                  <div v-if="postsLoading" class="loading-content">
                    <el-skeleton :rows="3" animated />
                    <el-skeleton :rows="3" animated class="mt-4" />
                  </div>
                  
                  <div v-else-if="posts && posts.length === 0" class="empty-content">
                    <el-empty description="暂无帖子" :image-size="120">
                      <template #description>
                        <p>该用户尚未发布任何帖子</p>
                      </template>
                      <el-button v-if="isCurrentUser" type="primary" @click="navigateToCreatePost">
                        <span class="material-icons-round">add</span> 发布第一篇帖子
                      </el-button>
                    </el-empty>
                  </div>
                  
                  <div v-else class="post-list">
                    <post-card 
                      v-for="post in posts" 
                      :key="post.id" 
                      :post="post" 
                      class="post-card-item"
                    />
                    
                    <div class="pagination-container">
                      <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[5, 10, 20]"
                        :total="totalPosts"
                        layout="total, sizes, prev, pager, next"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        background
                      />
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane name="comments">
                <template #label>
                  <span class="tab-label">
                    <span class="material-icons-round">comment</span>
                    评论
                  </span>
                </template>
                
                <div class="tab-content">
                  <div class="content-header">
                    <h2 class="content-title">{{ user.username }} 的评论</h2>
                  </div>
                  
                  <div class="empty-content">
                    <el-empty description="暂无评论" :image-size="120">
                      <template #description>
                        <p>该用户尚未发表任何评论</p>
                      </template>
                    </el-empty>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane name="liked">
                <template #label>
                  <span class="tab-label">
                    <span class="material-icons-round">favorite</span>
                    收藏
                  </span>
                </template>
                
                <div class="tab-content">
                  <div class="content-header">
                    <h2 class="content-title">{{ user.username }} 的收藏</h2>
                  </div>
                  
                  <div class="empty-content">
                    <el-empty description="暂无收藏" :image-size="120">
                      <template #description>
                        <p>该用户尚未收藏任何内容</p>
                      </template>
                    </el-empty>
                  </div>
                </div>
              </el-tab-pane>
              
              <el-tab-pane name="following" v-if="isCurrentUser">
                <template #label>
                  <span class="tab-label">
                    <span class="material-icons-round">people</span>
                    关注
                  </span>
                </template>
                
                <div class="tab-content">
                  <div class="content-header">
                    <h2 class="content-title">我的关注</h2>
                  </div>
                  
                  <div class="empty-content">
                    <el-empty description="暂无关注" :image-size="120">
                      <template #description>
                        <p>你尚未关注任何用户</p>
                      </template>
                    </el-empty>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      
      <div v-else-if="!loading" class="not-found">
        <el-empty description="用户不存在"></el-empty>
      </div>
    </div>
    
    <!-- 编辑简介对话框 -->
    <el-dialog
      v-model="bioDialogVisible"
      title="编辑个人简介"
      width="500px"
      :close-on-click-modal="false"
      class="bio-dialog"
    >
      <div class="bio-edit-container">
        <p class="bio-edit-hint">介绍一下自己，让大家更了解你（最多200字）</p>
        <el-input
          v-model="editedBio"
          type="textarea"
          :rows="5"
          maxlength="200"
          show-word-limit
          placeholder="介绍一下自己吧..."
          class="bio-textarea"
        />
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelBioEdit">取消</el-button>
          <el-button type="primary" @click="saveBioEdit" :loading="savingBio">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 头像上传对话框 -->
    <el-dialog
      v-model="avatarUploadVisible"
      title="更换头像"
      width="400px"
      class="upload-dialog"
      :close-on-click-modal="false"
    >
      <div class="avatar-preview" :style="{ backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none' }"></div>
      
      <div class="upload-hint">
        <p>请选择一张图片作为您的新头像</p>
        <p>支持 JPG、PNG 格式，文件大小不超过 2MB</p>
      </div>
      
      <el-upload
        class="avatar-uploader"
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleAvatarUpload"
        accept="image/jpeg,image/png"
      >
        <el-button type="primary" plain>选择图片</el-button>
      </el-upload>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="avatarUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadAvatar" :loading="uploadingAvatar">
            上传头像
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 封面上传对话框 -->
    <el-dialog
      v-model="coverUploadVisible"
      title="更换封面"
      width="500px"
      class="upload-dialog"
      :close-on-click-modal="false"
    >
      <div class="upload-preview" :style="{ backgroundImage: coverPreview ? `url(${coverPreview})` : 'none' }"></div>
      
      <div class="upload-hint">
        <p>请选择一张图片作为您的个人主页封面</p>
        <p>建议尺寸：1200 x 300 像素，支持 JPG、PNG 格式，文件大小不超过 5MB</p>
      </div>
      
      <el-upload
        class="cover-uploader"
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleCoverUpload"
        accept="image/jpeg,image/png"
      >
        <el-button type="primary" plain>选择图片</el-button>
      </el-upload>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="coverUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadCover" :loading="uploadingCover">
            上传封面
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElUpload } from 'element-plus'
// @ts-ignore
import PostCard from '../components/forum/PostCard.vue'
import { usePostStore } from '../stores/postStore'
import { useUserStore } from '../stores/userStore'
import { postApi } from '../services/api'
import type { Post, User } from '../types/forum'
import { getUserAvatarUrl } from '../utils/assets'
import { DEFAULT_TEXTS, UPLOAD_CONFIG, UI_CONFIG } from '../constants'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const userStore = useUserStore()

const user = ref<User | null>(null)
const posts = ref<Post[]>([])
const loading = ref(true)
const postsLoading = ref(false)
const followersCount = ref(0)
const isOnline = ref(false)
const activeTab = ref('posts')
const postSortBy = ref('recent')
const currentPage = ref(1)
const pageSize = ref(5)
const totalPosts = ref(0)
const isEditingBio = ref(false)
const editedBio = ref('')
const savingBio = ref(false)

// 头像上传相关
const avatarUploadVisible = ref(false)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref('')
const uploadingAvatar = ref(false)

// 封面上传相关
const coverUploadVisible = ref(false)
const coverFile = ref<File | null>(null)
const coverPreview = ref('')
const uploadingCover = ref(false)

// 编辑简介对话框
const bioDialogVisible = ref(false)

// 计算封面样式
const coverStyle = computed(() => {
  if (user.value?.cover_image) {
    return {
      backgroundImage: `url(${user.value.cover_image})`
    }
  }
  return {}
})

// 用户成就
const achievements = ref([
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

// 活跃分类
const activeCategories = ref([
  { id: 2, name: '家居装饰', post_count: 8, total_posts: 12 },
  { id: 1, name: '生活技巧', post_count: 3, total_posts: 12 },
  { id: 4, name: '旅行探索', post_count: 1, total_posts: 12 }
])

// 最近活动
const recentActivities = ref([
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

// 添加推荐用户数据
const recommendedUsers = ref([
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

// 添加用户标签数据
const userTags = ref([
  { id: 1, name: '家居装饰', count: 8 },
  { id: 2, name: '厨房收纳', count: 5 },
  { id: 3, name: '极简主义', count: 7 },
  { id: 4, name: '手工DIY', count: 3 },
  { id: 5, name: '植物养护', count: 6 },
  { id: 6, name: '旅行攻略', count: 4 },
  { id: 7, name: '摄影技巧', count: 2 }
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

// 是否为当前登录用户
const isCurrentUser = computed(() => {
  return userStore.currentUser && user.value && userStore.currentUser.id === user.value.id
})

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化相对时间
const formatRelativeTime = (dateString: string) => {
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

// 获取活动图标
const getActivityIcon = (type: string) => {
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

// 格式化活动内容
const formatActivity = (activity: any) => {
  return activity.content
}

// 计算分类百分比
const calculateCategoryPercentage = (category: any) => {
  return Math.round((category.post_count / category.total_posts) * 100)
}

// 获取分类颜色
const getCategoryColor = (index: number) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
  return colors[index % colors.length]
}

// 获取用户资料
const fetchUserProfile = async () => {
  loading.value = true
  const userId = route.params.id as string
  
  try {
    // 模拟获取用户资料
    // 实际项目中应该使用userStore.fetchUserProfile(userId)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    user.value = {
      id: Number(userId),
      username: '示例用户',
      email: 'user@example.com',
      avatar: '',
      bio: '这是一个示例用户资料，用于展示页面布局和设计。喜欢分享生活技巧和美食烹饪经验。',
      showEmail: false,
      reputation: 150,
      postCount: 12,
      commentCount: 45,
      isAdmin: false,
      isModerator: true,
      // 兼容字段
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      post_count: 12,
      comment_count: 45,
      is_admin: false,
      is_moderator: true,
      last_active_at: new Date().toISOString(),
      // 新字段
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      lastActiveAt: new Date().toISOString()
    }
    
    // 模拟关注者数量
    followersCount.value = 28
    
    // 模拟在线状态
    isOnline.value = Math.random() > 0.5
    
    // 设置页面标题
    document.title = `${user.value.username} - Lumen论坛`
    
    // 获取用户帖子总数
    totalPosts.value = user.value.post_count
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    ElMessage.error('获取用户资料失败')
  } finally {
    loading.value = false
  }
}

// 获取用户帖子
const fetchUserPosts = async () => {
  const userId = route.params.id as string
  postsLoading.value = true
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 使用正确的API调用获取用户帖子
    const result = await postApi.getUserPosts(userId, currentPage.value, pageSize.value)
    
    if (result && result.data) {
      posts.value = result.data
    } else {
      posts.value = []
    }
  } catch (error) {
    console.error('Failed to fetch user posts:', error)
    ElMessage.error('获取用户帖子失败')
    posts.value = [] // 确保在错误情况下 posts 是空数组而不是 undefined
  } finally {
    postsLoading.value = false
  }
}

// 页码改变
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchUserPosts()
}

// 每页条数改变
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchUserPosts()
}

// 导航到创建帖子页面
const navigateToCreatePost = () => {
  router.push({ name: 'createPost' })
}

// 监听排序方式变化
watch(postSortBy, () => {
  currentPage.value = 1
  fetchUserPosts()
})

// 关注用户
const followUser = (userId: number) => {
  ElMessage.success(`已关注用户 ID: ${userId}`)
  // 实际项目中应该调用API进行关注操作
}

// 格式化网站URL显示
const formatWebsiteUrl = (url: string) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

// 获取技能标签类型 - 修复Element Plus type警告
const getSkillTagType = (index: number) => {
  const types = ['primary', 'success', 'warning', 'danger', 'info'];
  return types[index % types.length];
}

// 获取标签大小 - 添加防御式编程
const getTagSize = (count: number | null | undefined) => {
  const minSize = 12; // 可以考虑添加到UI_CONFIG中
  const maxSize = 20; // 可以考虑添加到UI_CONFIG中

  if (!count || count <= 0) return `${minSize}px`

  if (!userTags.value || userTags.value.length === 0) return `${minSize}px`

  try {
    const validCounts = userTags.value.map(tag => tag?.count || 0).filter(c => c > 0)
    if (validCounts.length === 0) return `${minSize}px`

    const maxCount = Math.max(...validCounts)
    if (maxCount === 0) return `${minSize}px`

    const size = minSize + (count / maxCount) * (maxSize - minSize)
    return `${Math.round(size)}px`
  } catch (error) {
    console.warn('计算标签大小失败:', count, error)
    return `${minSize}px`
  }
}

// 打开头像上传窗口
const openAvatarUpload = () => {
  avatarUploadVisible.value = true
  avatarPreview.value = user.value?.avatar || ''
  avatarFile.value = null
}

// 打开封面上传窗口
const openCoverUpload = () => {
  coverUploadVisible.value = true
  coverPreview.value = user.value?.cover_image || ''
  coverFile.value = null
}

// 处理头像上传包装函数
const handleAvatarUpload = (file: any) => {
  if (file && file.raw) {
    handleAvatarChange(file.raw as File)
  }
}

// 处理头像文件上传
const handleAvatarChange = (file: File) => {
  if (!file) return
  
  // 验证文件类型和大小
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  
  // 创建预览
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

// 处理封面上传包装函数
const handleCoverUpload = (file: any) => {
  if (file && file.raw) {
    handleCoverChange(file.raw as File)
  }
}

// 处理封面文件上传
const handleCoverChange = (file: File) => {
  if (!file) return
  
  // 验证文件类型和大小
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  
  // 创建预览
  coverFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

// 上传头像
const uploadAvatar = async () => {
  if (!avatarFile.value) {
    ElMessage.warning('请先选择图片')
    return
  }
  
  uploadingAvatar.value = true
  try {
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户头像
    if (user.value) {
      user.value.avatar = avatarPreview.value
      ElMessage.success('头像更新成功')
      avatarUploadVisible.value = false
    }
  } catch (error) {
    console.error('Failed to upload avatar:', error)
    ElMessage.error('头像上传失败')
  } finally {
    uploadingAvatar.value = false
  }
}

// 上传封面
const uploadCover = async () => {
  if (!coverFile.value) {
    ElMessage.warning('请先选择图片')
    return
  }
  
  uploadingCover.value = true
  try {
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户封面
    if (user.value) {
      user.value.cover_image = coverPreview.value
      ElMessage.success('封面更新成功')
      coverUploadVisible.value = false
    }
  } catch (error) {
    console.error('Failed to upload cover:', error)
    ElMessage.error('封面上传失败')
  } finally {
    uploadingCover.value = false
  }
}

// 编辑简介
const editBio = () => {
  editedBio.value = user.value?.bio || ''
  bioDialogVisible.value = true
}

// 取消编辑简介
const cancelBioEdit = () => {
  bioDialogVisible.value = false
  editedBio.value = ''
}

// 保存编辑简介
const saveBioEdit = async () => {
  savingBio.value = true
  try {
    // 实现保存编辑简介的逻辑
    user.value!.bio = editedBio.value
    await fetchUserProfile()
    ElMessage.success('简介保存成功')
    bioDialogVisible.value = false
  } catch (error) {
    console.error('Failed to save bio:', error)
    ElMessage.error('保存简介失败')
  } finally {
    savingBio.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
  fetchUserPosts()
})
</script>

<style scoped>
.user-profile-page {
  padding: var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
}

.profile-container {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
}

.profile-header {
  position: relative;
}

.cover-image {
  height: 200px;
  background-color: var(--bg-subtle);
  background-image: linear-gradient(to right, var(--primary-color-light), var(--primary-color));
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  position: relative;
  overflow: hidden;
}

.user-info-wrapper {
  display: flex;
  padding: var(--spacing-6);
  position: relative;
  align-items: flex-start;
}

.avatar-container {
  position: relative;
  margin-right: var(--spacing-5);
  flex-shrink: 0;
  /* 确保容器尺寸与头像一致 */
  width: 100px;
  height: 100px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: var(--shadow-md);
  transition: filter 0.3s ease;
}

/* 头像编辑悬浮层 */
.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  color: white;
  /* 确保悬浮层与头像完全对齐 */
  box-sizing: border-box;
}

.avatar-container:hover .avatar-edit-overlay {
  opacity: 1;
}

.avatar-edit-overlay .material-icons-round {
  font-size: 20px;
  margin-bottom: 2px;
}

.edit-text {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

.status-badge {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  bottom: 5px;
  right: 5px;
  border: 2px solid white;
}

.online {
  background-color: #10b981;
}

/* 用户简介 */
.user-bio {
  margin-top: var(--spacing-4);
  color: var(--text-secondary);
  white-space: pre-line;
  position: relative;
  min-height: 60px; /* 确保有最小高度 */
  padding: var(--spacing-2) 0; /* 添加内边距 */
  line-height: 1.6;
}

/* 资料编辑按钮 */
.edit-profile-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transition: all 0.3s ease;
}

/* 修复悬浮状态下的颜色 */
.edit-profile-btn:hover,
.edit-profile-btn:focus {
  background-color: var(--primary-dark) !important; /* 使用深色背景 */
  border-color: var(--primary-dark) !important;
  color: white !important;
  box-shadow: var(--shadow-md);
}

/* 编辑图标颜色修复 */
.edit-icon {
  color: white !important; /* 强制白色 */
}

/* 确保按钮中的图标在悬浮状态下保持可见 */
.edit-profile-btn:hover .edit-icon,
.edit-profile-btn:focus .edit-icon {
  color: white !important; /* 确保悬浮状态下图标颜色不变 */
}

/* 下拉菜单链接 */
.dropdown-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  width: 100%;
}

/* 修改表单按钮样式 */
.el-button--primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border-light);
}

.stat-card {
  padding: var(--spacing-4);
  text-align: center;
  transition: background-color 0.2s ease;
}

.stat-card:hover {
  background-color: var(--bg-subtle);
}

.stat-card:not(:last-child) {
  border-right: 1px solid var(--border-light);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-1);
}

.stat-label {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  gap: var(--spacing-1);
}

.stat-label .material-icons-round {
  font-size: 16px;
}

.not-found {
  padding: var(--spacing-10) 0;
  text-align: center;
}

@media (max-width: 768px) {
  .user-info-wrapper {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: var(--spacing-4);
  }
  
  .user-info {
    width: 100%;
  }
  
  .name-row {
    justify-content: center;
  }
  
  .user-meta {
    justify-content: center;
  }
  
  .action-buttons {
    justify-content: center;
    margin-top: var(--spacing-4);
  }
  
  .profile-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card:nth-child(2) {
    border-right: none;
  }
  
  .stat-card:nth-child(1),
  .stat-card:nth-child(2) {
    border-bottom: 1px solid var(--border-light);
  }
}

/* 主要内容区域布局 */
.profile-main {
  margin-top: var(--spacing-6);
}

/* 内容标签页样式 */
.content-tabs-container {
  margin-top: var(--spacing-6);
}

.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--border-light);
}

.profile-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.profile-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}

.profile-tabs :deep(.el-tabs__item) {
  font-size: var(--font-size-md);
  padding: var(--spacing-3) var(--spacing-4);
  height: auto;
}

.profile-tabs :deep(.el-tabs__item.is-active) {
  font-weight: var(--font-weight-semibold);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.tab-label .material-icons-round {
  font-size: 18px;
}

.tab-content {
  min-height: 400px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.content-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.content-filters {
  display: flex;
  gap: var(--spacing-3);
}

.loading-content {
  padding: var(--spacing-4);
}

.empty-content {
  padding: var(--spacing-10) 0;
  text-align: center;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.post-card-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.pagination-container {
  margin-top: var(--spacing-6);
  display: flex;
  justify-content: center;
}

.mt-4 {
  margin-top: var(--spacing-4);
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }
  
  .profile-tabs :deep(.el-tabs__item) {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-sm);
  }
  
  .tab-label .material-icons-round {
    font-size: 16px;
  }
}

/* 封面编辑覆盖层 */
.cover-edit-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: var(--radius-md);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-image:hover .cover-edit-overlay {
  opacity: 1;
}

/* 上传对话框样式 */
.upload-dialog .el-upload {
  width: 100%;
  text-align: center;
}

/* 确保上传按钮中的图标为白色 */
.upload-dialog .el-button {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.upload-dialog .el-button:hover,
.upload-dialog .el-button:focus {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  color: white;
}

.upload-dialog .el-button .el-icon,
.upload-dialog .el-button .material-icons-round {
  color: white !important;
}

.upload-preview {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  border-radius: var(--radius-md);
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  border: 2px dashed var(--border-light);
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 20px;
  background-size: cover;
  background-position: center;
  border: 2px dashed var(--border-light);
}

.upload-hint {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: var(--font-size-sm);
}

/* 编辑简介对话框样式 */
.bio-dialog .el-dialog__body {
  padding-top: 10px;
}

.bio-edit-container {
  padding: 0 10px;
}

.bio-edit-hint {
  color: var(--text-secondary);
  margin-bottom: 15px;
  font-size: var(--font-size-sm);
}

.bio-textarea {
  width: 100%;
}

.bio-textarea .el-textarea__inner {
  resize: none;
  font-family: var(--font-family);
  line-height: 1.6;
}

/* 对话框底部按钮样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-buttons {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.action-buttons-container {
  display: flex;
  gap: var(--spacing-3);
}

.follow-btn,
.message-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
}

.follow-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.follow-btn:hover,
.follow-btn:focus {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.follow-btn .material-icons-round,
.message-btn .material-icons-round {
  color: white !important;
  font-size: 16px;
}

.message-btn {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.message-btn:hover,
.message-btn:focus {
  background-color: #3c5a87; /* 深一点的蓝色 */
  border-color: #3c5a87;
}
</style> 