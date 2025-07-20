<template>
  <div class="comments-sidebar">
    <div class="sidebar-block">
      <div class="sidebar-header">
        <h3 class="sidebar-title">热门评论</h3>
        <el-tooltip content="发表新评论" placement="top" :hide-after="0">
          <el-button type="primary" size="small" @click="scrollToCommentForm">
            <span class="material-icons-round">edit</span> 发表评论
          </el-button>
        </el-tooltip>
      </div>
      
      <div v-if="loading" class="comments-loading">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div v-else-if="hotComments.length === 0" class="empty-comments">
        <p class="empty-text">暂无评论</p>
        <el-button size="small" type="primary" @click="scrollToCommentForm">
          添加第一条评论
        </el-button>
      </div>
      
      <div v-else class="comments-list">
        <div v-for="comment in hotComments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <router-link
              v-if="comment.user && comment.user.id"
              :to="{ name: 'userProfile', params: { id: comment.user.id } }"
              class="user-link"
            >
              <img :src="getUserAvatarUrl(comment.user?.avatar)" :alt="comment.user?.username || '用户'" class="avatar avatar--small">
              <span class="user-name">{{ comment.user.username }}</span>
            </router-link>
            <div v-else class="user-link">
              <img :src="getUserAvatarUrl()" alt="用户" class="avatar avatar--small">
              <span class="user-name">{{ DEFAULT_TEXTS.UNKNOWN_USER }}</span>
            </div>
            <span class="comment-time">{{ formatRelativeTime(comment.created_at) }}</span>
          </div>
          
          <div class="comment-content">
            <div 
              :class="['comment-text', {'expanded': expandedCommentTexts.includes(comment.id)}]"
              :style="!expandedCommentTexts.includes(comment.id) && comment.content && comment.content.length > 100 ? 'max-height: 80px;' : ''"
            >
              {{ comment.content }}
            </div>
            <div
              v-if="comment.content && comment.content.length > 100"
              class="expand-toggle"
              @click="toggleCommentText(comment.id)"
            >
              {{ expandedCommentTexts.includes(comment.id) ? '收起' : '展开' }}
              <span class="material-icons-round">
                {{ expandedCommentTexts.includes(comment.id) ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
              </span>
            </div>
          </div>
          
          <div class="comment-footer">
            <div class="comment-actions">
              <el-tooltip content="点赞此评论" placement="top" :hide-after="0">
                <el-button size="small" text @click="handleLike(comment.id)">
                  <span class="material-icons-round">thumb_up</span> {{ comment.like_count }}
                </el-button>
              </el-tooltip>
              
              <el-tooltip content="回复此评论" placement="top" :hide-after="0">
                <el-button size="small" text @click="handleReply(comment.id)">
                  <span class="material-icons-round">reply</span> 回复
                </el-button>
              </el-tooltip>
            </div>
          </div>
          
          <div v-if="comment.is_solution" class="solution-badge">
            <span class="material-icons-round">verified</span> 最佳回答
          </div>
        </div>
      </div>
      
      <div class="view-all-comments">
        <el-button type="primary" plain @click="openCommentsDrawer">
          查看全部评论 ({{ comments.length }})
        </el-button>
      </div>
    </div>
    
    <!-- 评论详情侧边抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="评论列表"
      direction="rtl"
      size="50%"
      :with-header="true"
      :destroy-on-close="false"
      :before-close="handleDrawerClose"
    >
      <template #header>
        <div class="drawer-header">
          <h3 class="drawer-title">评论列表 ({{ comments.length }})</h3>
          <el-button type="primary" size="small" @click="scrollToCommentForm">
            <span class="material-icons-round">edit</span> 发表评论
          </el-button>
        </div>
      </template>
      
      <div class="drawer-content">
        <div v-if="loading" class="comments-loading">
          <el-skeleton :rows="5" animated />
        </div>
        
        <div v-else-if="comments.length === 0" class="empty-comments">
          <p class="empty-text">暂无评论</p>
          <el-button size="small" type="primary" @click="scrollToCommentForm">
            添加第一条评论
          </el-button>
        </div>
        
        <div v-else class="drawer-comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <router-link
                v-if="comment.user && comment.user.id"
                :to="{ name: 'userProfile', params: { id: comment.user.id } }"
                class="user-link"
              >
                <img :src="getUserAvatarUrl(comment.user?.avatar)" :alt="comment.user?.username || '用户'" class="avatar avatar--small">
                <span class="user-name">{{ comment.user.username }}</span>
              </router-link>
              <div v-else class="user-link">
                <img :src="getUserAvatarUrl()" alt="用户" class="avatar avatar--small">
                <span class="user-name">{{ DEFAULT_TEXTS.UNKNOWN_USER }}</span>
              </div>
              <span class="comment-time">{{ formatRelativeTime(comment.created_at) }}</span>
            </div>
            
            <div class="comment-content drawer-comment-content">
              <div 
                :class="['comment-text', {'expanded': expandedDrawerTexts.includes(comment.id)}]"
                :style="!expandedDrawerTexts.includes(comment.id) && comment.content && comment.content.length > 250 ? 'max-height: 120px;' : ''"
              >
                {{ comment.content }}
              </div>
              <div
                v-if="comment.content && comment.content.length > 250"
                class="expand-toggle"
                @click="toggleDrawerText(comment.id)"
              >
                {{ expandedDrawerTexts.includes(comment.id) ? '收起' : '展开' }}
                <span class="material-icons-round">
                  {{ expandedDrawerTexts.includes(comment.id) ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                </span>
              </div>
            </div>
            
            <div class="comment-footer">
              <div class="comment-actions">
                <el-tooltip content="点赞此评论" placement="top" :hide-after="0">
                  <el-button size="small" text @click="handleLike(comment.id)">
                    <span class="material-icons-round">thumb_up</span> {{ comment.like_count }}
                  </el-button>
                </el-tooltip>
                
                <el-tooltip content="回复此评论" placement="top" :hide-after="0">
                  <el-button size="small" text @click="handleReply(comment.id)">
                    <span class="material-icons-round">reply</span> 回复
                  </el-button>
                </el-tooltip>
                
                <el-tooltip content="查看此评论的所有回复" placement="top" :hide-after="0" v-if="comment.replies && comment.replies.length > 0">
                  <el-button size="small" text @click="toggleReplies(comment.id)">
                    <span class="material-icons-round">forum</span> {{ comment.replies?.length || 0 }}
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            
            <div v-if="expandedComments.includes(comment.id) && comment.replies && comment.replies.length > 0" class="comment-replies">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <div class="reply-header">
                  <router-link
                    v-if="reply.user && reply.user.id"
                    :to="{ name: 'userProfile', params: { id: reply.user.id } }"
                    class="user-link"
                  >
                    <span class="reply-username">{{ reply.user.username }}</span>
                  </router-link>
                  <span v-else class="reply-username">未知用户</span>
                  <span class="reply-time">{{ formatRelativeTime(reply.created_at) }}</span>
                </div>
                <div class="reply-content">
                  {{ reply.content }}
                </div>
                <div class="reply-actions">
                  <el-button size="small" text @click="handleLike(reply.id)">
                    <span class="material-icons-round">thumb_up</span> {{ reply.like_count || 0 }}
                  </el-button>
                  <el-button size="small" text @click="handleReply(comment.id, reply.user.id)">
                    <span class="material-icons-round">reply</span> 回复
                  </el-button>
                </div>
              </div>
            </div>
            
            <div v-if="comment.is_solution" class="solution-badge">
              <span class="material-icons-round">verified</span> 最佳回答
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="handleDrawerClose">关闭</el-button>
          <el-button type="primary" @click="scrollToCommentForm">发表评论</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElDrawer } from 'element-plus'
import type { Comment } from '../../types/forum'
import { useUserStore } from '../../stores/userStore'
// 移除硬编码的头像导入，使用统一的资源管理
// import { commentApi } from '../../services/api' // 🚧 评论API未完成，暂时注释
import { formatRelativeTime } from '../../utils/format'
import { getUserAvatarUrl } from '../../utils/assets'
import { DEFAULT_TEXTS } from '../../constants'

const props = defineProps<{
  postId: string | number
}>()

const emit = defineEmits(['scrollToComments', 'scrollToCommentForm', 'replyToComment'])

const comments = ref<Comment[]>([])
const loading = ref(true)
const drawerVisible = ref(false)
const expandedComments = ref<number[]>([])
const expandedCommentTexts = ref<number[]>([])
const expandedDrawerTexts = ref<number[]>([])

const userStore = useUserStore()

// 热门评论，动态调整展示数量
const hotComments = computed(() => {
  // 根据屏幕宽度和评论长度动态调整显示数量
  let displayCount = 3; // 默认显示3条
  
  // 如果有评论内容特别短，可以多显示几条
  const shortComments = comments.value.filter(c => c.content.length < 100);
  if (shortComments.length > 3) {
    displayCount = Math.min(5, shortComments.length);
  }
  
  // 按点赞数排序
  return [...comments.value]
    .sort((a, b) => b.like_count - a.like_count)
    .slice(0, displayCount);
})

// 获取评论列表 - API文档中没有评论接口，返回空数据
const fetchComments = async () => {
  loading.value = true
  try {
    // API文档中没有评论相关接口，返回空数据
    comments.value = []
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  } finally {
    loading.value = false
  }
}

// 打开评论抽屉
const openCommentsDrawer = () => {
  drawerVisible.value = true
}

// 关闭评论抽屉
const handleDrawerClose = () => {
  drawerVisible.value = false
}

// 切换评论文本展开/收起状态（热门评论）
const toggleCommentText = (commentId: number) => {
  if (expandedCommentTexts.value.includes(commentId)) {
    expandedCommentTexts.value = expandedCommentTexts.value.filter(id => id !== commentId)
  } else {
    expandedCommentTexts.value.push(commentId)
  }
}

// 切换抽屉中评论文本展开/收起状态
const toggleDrawerText = (commentId: number) => {
  if (expandedDrawerTexts.value.includes(commentId)) {
    expandedDrawerTexts.value = expandedDrawerTexts.value.filter(id => id !== commentId)
  } else {
    expandedDrawerTexts.value.push(commentId)
  }
}

// 切换回复的显示/隐藏
const toggleReplies = (commentId: number) => {
  if (expandedComments.value.includes(commentId)) {
    expandedComments.value = expandedComments.value.filter(id => id !== commentId)
  } else {
    expandedComments.value.push(commentId)
  }
}

// 使用统一的格式化工具函数

// 点赞评论
const handleLike = async (commentId: number) => {
  // 检查用户是否登录
  if (!userStore.isAuthenticated) {
    ElMessage.warning('请登录后再进行点赞操作')
    return
  }
  
  try {
    // 获取要点赞的评论
    const commentIndex = comments.value.findIndex(c => c.id === commentId)
    if (commentIndex === -1) return
    
    const comment = comments.value[commentIndex]
    const isLiked = comment.is_liked || comment.isLiked || false

    // 更新UI状态
    comments.value[commentIndex] = {
      ...comment,
      is_liked: !isLiked,
      isLiked: !isLiked,
      like_count: isLiked ? (comment.like_count || comment.likeCount || 0) - 1 : (comment.like_count || comment.likeCount || 0) + 1,
      likeCount: isLiked ? (comment.like_count || comment.likeCount || 0) - 1 : (comment.like_count || comment.likeCount || 0) + 1
    }
    
    // 在实际项目中，应调用API来实现点赞/取消点赞
    // const response = isLiked 
    //   ? await commentApi.unlikeComment(commentId)
    //   : await commentApi.likeComment(commentId)
    
    // 显示操作结果提示
    ElMessage.success(isLiked ? '已取消点赞' : '点赞成功')
  } catch (error) {
    console.error('点赞操作失败:', error)
    ElMessage.error('操作失败，请稍后再试')
    
    // 如果API调用失败，恢复UI状态
    const commentIndex = comments.value.findIndex(c => c.id === commentId)
    if (commentIndex !== -1) {
      const comment = comments.value[commentIndex]
      const isLiked = comment.is_liked || comment.isLiked || false
      comments.value[commentIndex] = {
        ...comment,
        is_liked: !isLiked,
        isLiked: !isLiked,
        like_count: isLiked ? (comment.like_count || comment.likeCount || 0) - 1 : (comment.like_count || comment.likeCount || 0) + 1,
        likeCount: isLiked ? (comment.like_count || comment.likeCount || 0) - 1 : (comment.like_count || comment.likeCount || 0) + 1
      }
    }
  }
}

// 回复评论
const handleReply = (commentId: number, replyToUserId?: number) => {
  // 获取要回复的评论
  const comment = comments.value.find(c => c.id === commentId);
  if (!comment) return;
  
  // 触发回复事件，传递评论ID和用户名
  const event = new CustomEvent('replyToComment', {
    detail: {
      commentId: commentId,
      username: comment.user?.username || '未知用户'
    }
  });
  window.dispatchEvent(event);
  
  handleDrawerClose(); // 关闭抽屉
  scrollToCommentForm();
}

// 滚动到评论区
const scrollToCommentSection = () => {
  emit('scrollToComments')
}

// 滚动到评论表单
const scrollToCommentForm = () => {
  handleDrawerClose() // 关闭抽屉
  emit('scrollToCommentForm')
}

onMounted(() => {
  fetchComments()
  
  // 监听刷新评论事件
  window.addEventListener('refreshComments', () => {
    fetchComments()
  })
})
</script>

<style scoped>
.comments-sidebar {
  width: 100%;
}

.sidebar-block {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-light);
}

.sidebar-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--spacing-2);
  margin-bottom: var(--spacing-3);
  margin-left: var(--spacing-1);
  padding-bottom: var(--spacing-2);
  padding-left: var(--spacing-1);
  text-align: center;
}

.comment-text {
  overflow: hidden;
  position: relative;
  transition: max-height 0.3s ease;
}

.comment-text.expanded {
  max-height: none !important;
}

.expand-toggle {
  color: var(--primary-color);
  font-size: var(--font-size-xs);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) 0;
  margin-top: var(--spacing-1);
  user-select: none;
}

.expand-toggle:hover {
  text-decoration: underline;
}

.comments-loading,
.empty-comments {
  padding: var(--spacing-4);
}

.empty-text {
  color: var(--text-tertiary);
  text-align: center;
  margin-bottom: var(--spacing-4);
}

.comments-list {
  max-height: 650px;
  overflow-y: auto;
  padding: 0 var(--spacing-2);
}

.comment-item {
  position: relative;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.2s ease;
}

.comment-item:hover {
  background-color: var(--bg-subtle);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.user-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: var(--spacing-2);
  object-fit: cover;
}

.user-name {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.comment-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.comment-content {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin-bottom: var(--spacing-3);
  color: var(--text-primary);
  word-break: break-word;
}

.drawer-comment-content {
  font-size: var(--font-size-md);
  line-height: 1.6;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-actions {
  display: flex;
  gap: var(--spacing-2);
}

.solution-badge {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
  background-color: rgba(var(--success-rgb), 0.15);
  color: var(--primary-color);
  font-size: var(--font-size-xs);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  border: 1px solid rgba(var(--success-rgb), 0.3);
}

.solution-badge .material-icons-round {
  font-size: 14px;
  margin-right: 0;
  color: var(--success-color);
}

.comment-replies {
  margin: var(--spacing-3) 0 var(--spacing-2) var(--spacing-6);
  padding: var(--spacing-2) 0 0 var(--spacing-2);
  border-left: 2px solid var(--border-light);
}

.reply-item {
  padding: var(--spacing-2);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-2);
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-1);
}

.reply-username {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-xs);
}

.reply-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.reply-content {
  font-size: var(--font-size-xs);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.reply-actions {
  display: flex;
  gap: var(--spacing-2);
}

.view-all-comments {
  padding: var(--spacing-4);
  text-align: center;
  border-top: 1px solid var(--border-light);
}

/* 抽屉样式 */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.drawer-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.drawer-content {
  padding: var(--spacing-4);
}

.drawer-comments-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* 提高sidebar宽度后的特定样式 */
@media (min-width: 1024px) {
  .post-detail-sidebar .comments-list {
    max-height: 700px;
  }
  
  .post-detail-sidebar .comment-content {
    font-size: var(--font-size-md);
    margin-bottom: var(--spacing-4);
  }
  
  .post-detail-sidebar .user-avatar {
    width: 32px;
    height: 32px;
  }
  
  .post-detail-sidebar .sidebar-header {
    padding: var(--spacing-5) var(--spacing-4);
  }
  
  .post-detail-sidebar .sidebar-title {
    font-size: var(--font-size-lg);
    margin-top: var(--spacing-2);
    margin-left: var(--spacing-1);
    padding-left: var(--spacing-1);
    text-align: center;
  }
}

/* Material Icons样式 */
.material-icons-round {
  font-size: 1rem;
  vertical-align: middle;
}

.expand-toggle .material-icons-round {
  font-size: 16px;
  margin-left: 4px;
}

.solution-badge .material-icons-round {
  font-size: 0.8rem;
  margin-right: 2px;
}

.sidebar-header .material-icons-round {
  font-size: 0.9rem;
  margin-right: 4px;
}

.comment-actions .material-icons-round {
  font-size: 0.9rem;
  margin-right: 2px;
}
</style> 