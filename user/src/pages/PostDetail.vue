<template>
  <main-layout>
    <div class="post-detail-page">
      <div class="container">
        <!-- 左侧内容区 -->
        <div class="content-main">
          <div v-loading="loading">
            <!-- 帖子内容 -->
            <div v-if="post" class="post-container card">
              <div class="post-header">
                <h1 class="post-title">{{ post.title }}</h1>
                <div class="post-meta">
                  <div class="author-info">
                    <router-link :to="{ name: 'userProfile', params: { id: post.user.id } }" class="author-link">
                      <img :src="post.user.avatar || '/default-avatar.png'" :alt="post.user.username" class="author-avatar">
                      <span class="author-name">{{ post.user.username }}</span>
                    </router-link>
                    <span class="post-time">{{ formatDate(post.created_at) }}</span>
                  </div>
                  <div class="category-tag">
                    <router-link :to="{ name: 'category', params: { id: post.category.id } }">
                      {{ post.category.name }}
                    </router-link>
                  </div>
                </div>
                
                <!-- 帖子统计信息（低调版本） -->
                <div class="post-stats-subtle">
                  <div class="stat-item">
                    <span class="material-icons-round">visibility</span>
                    <span>{{ formatNumber(post.view_count) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="material-icons-round">comment</span>
                    <span>{{ formatNumber(post.comment_count) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="material-icons-round">thumb_up</span>
                    <span>{{ formatNumber(post.like_count) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="material-icons-round">bookmark</span>
                    <span>{{ formatNumber(bookmarkCount) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="post-content">
                <!-- 帖子内容 -->
                <div class="content-html" v-html="post.content"></div>
                
                <!-- 标签列表 -->
                <div class="post-tags" v-if="post.tags && post.tags.length > 0">
                  <span class="tag-label">标签：</span>
                  <router-link 
                    v-for="tag in post.tags" 
                    :key="tag.id" 
                    :to="{ name: 'search', query: { tag_id: tag.id } }"
                    class="tag"
                  >
                    {{ tag.name }}
                  </router-link>
                </div>
              </div>
              
              <div class="post-actions">
                <div class="action-buttons">
                  <!-- 添加编辑按钮 - 仅当用户是作者时显示 -->
                  <el-button 
                    v-if="isCurrentUserAuthor" 
                    @click="editPost" 
                    type="primary" 
                    class="action-button edit-button"
                  >
                    <span class="material-icons-round">edit</span>
                    编辑帖子
                  </el-button>
                  
                  <auth-required level="user" type="level">
                    <el-button @click="handleLike" :type="post.is_liked ? 'primary' : ''" class="action-button">
                      <span class="material-icons-round">thumb_up</span>
                      {{ post.like_count }} 点赞
                    </el-button>
                    
                    <template #fallback>
                      <el-button @click="showLoginPrompt('like')" class="action-button">
                        <span class="material-icons-round">thumb_up</span>
                        {{ post.like_count }} 点赞
                      </el-button>
                    </template>
                  </auth-required>
                  
                  <auth-required level="user" type="level">
                    <el-button @click="handleBookmark" :type="isBookmarked ? 'primary' : ''" class="action-button">
                      <span class="material-icons-round">bookmark</span>
                      {{ isBookmarked ? '已收藏' : '收藏' }}
                    </el-button>
                    
                    <template #fallback>
                      <el-button @click="showLoginPrompt('bookmark')" class="action-button">
                        <span class="material-icons-round">bookmark</span>
                        收藏
                      </el-button>
                    </template>
                  </auth-required>
                  
                  <el-button @click="showShareOptions" class="action-button">
                    <span class="material-icons-round">share</span>
                    分享
                  </el-button>
                  
                  <el-button @click="scrollToCommentForm" class="action-button">
                    <span class="material-icons-round">edit</span>
                    评论
                  </el-button>
                </div>
              </div>
              
              <!-- 分享弹窗 -->
              <el-dialog
                v-model="shareDialogVisible"
                title="分享文章"
                width="360px"
                :show-close="true"
                center
              >
                <div class="share-options">
                  <div class="share-option" @click="shareVia('wechat')">
                    <div class="share-icon wechat-icon">
                      <i class="icon-wechat"></i>
                    </div>
                    <div class="share-name">微信</div>
                  </div>
                  <div class="share-option" @click="shareVia('weibo')">
                    <div class="share-icon weibo-icon">
                      <i class="icon-weibo"></i>
                    </div>
                    <div class="share-name">微博</div>
                  </div>
                  <div class="share-option" @click="shareVia('qq')">
                    <div class="share-icon qq-icon">
                      <i class="icon-qq"></i>
                    </div>
                    <div class="share-name">QQ</div>
                  </div>
                  <div class="share-option" @click="copyLink">
                    <div class="share-icon link-icon">
                      <i class="icon-link"></i>
                    </div>
                    <div class="share-name">复制链接</div>
                  </div>
                </div>
                
                <div class="share-link-section">
                  <div class="share-link-container">
                    <el-input v-model="shareLink" readonly />
                    <el-button type="primary" @click="copyLink">复制</el-button>
                  </div>
                </div>
              </el-dialog>
            </div>
            
            <el-empty v-else description="帖子不存在或已被删除"></el-empty>
          </div>
          
          <!-- 评论区 -->
          <div v-if="post" class="comments-section card" id="comments-section">
            <div class="comments-header">
              <h2 class="section-title">评论区</h2>
            </div>
            
            <!-- 评论表单 -->
            <div class="comment-form-container" id="comment-form">
              <div class="comment-form-header">
                <h3 class="form-title">
                  {{ replyingTo ? '回复评论' : '发表评论' }}
                  <span v-if="replyingTo" class="replying-to">
                    回复给：{{ replyingTo.username }}
                    <el-button type="text" @click="cancelReply" class="cancel-reply">
                      <i class="icon-close"></i> 取消回复
                    </el-button>
                  </span>
                </h3>
              </div>
              
              <auth-required level="user" type="level">
                <div class="comment-form">
                  <el-form :model="commentForm" :rules="commentRules" ref="commentFormRef">
                    <el-form-item prop="content">
                      <el-input
                        v-model="commentForm.content"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入您的评论内容..."
                        resize="none"
                        maxlength="1000"
                        show-word-limit
                      />
                    </el-form-item>
                    
                    <el-form-item class="form-actions">
                      <el-button 
                        type="primary" 
                        :loading="submitting" 
                        @click="submitComment"
                        :disabled="!commentForm.content.trim()"
                      >
                        {{ replyingTo ? '提交回复' : '发表评论' }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
                
                <template #fallback>
                  <login-prompt type="comment" />
                </template>
              </auth-required>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import MainLayout from '../components/layout/MainLayout.vue'
import AuthRequired from '../components/common/AuthRequired.vue'
import LoginPrompt from '../components/common/LoginPrompt.vue'
import { usePostStore } from '../stores/postStore'
import { useCommentStore } from '../stores/commentStore'
import { useUserStore } from '../stores/userStore'
// import { useBookmarkStore } from '../stores/bookmarkStore' // 🚧 收藏功能未完成，暂时注释
import type { Post } from '../types/forum'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const commentStore = useCommentStore()
const userStore = useUserStore()
// const bookmarkStore = useBookmarkStore() // 🚧 收藏功能未完成，暂时注释

const post = ref<Post | null>(null)
const loading = ref(true)
const isBookmarked = ref(false)
const bookmarkCount = ref(0)
const submitting = ref(false)
const commentFormRef = ref<FormInstance>()
const shareDialogVisible = ref(false)
const shareLink = ref('')

// 判断当前用户是否为帖子作者
const isCurrentUserAuthor = computed(() => {
  if (!post.value || !userStore.currentUser) return false
  return post.value.user_id === userStore.currentUser.id
})

// 评论表单数据
const commentForm = reactive({
  content: '',
  parent_id: null as number | null
})

// 表单验证规则
const commentRules = reactive<FormRules>({
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' },
    { min: 3, max: 1000, message: '评论长度在3到1000个字符之间', trigger: 'blur' }
  ]
})

// 回复信息
const replyingTo = ref<{ id: number, username: string } | null>(null)

// 显示登录提示
const loginPromptType = ref<string>('default')
const loginPromptVisible = ref(false)

// 获取帖子详情
const fetchPostDetail = async () => {
  loading.value = true
  const postId = route.params.id as string
  
  try {
    const result = await postStore.fetchPost(postId)
    if (result) {
      post.value = result
      
      // 模拟增加浏览量
      if (post.value) {
        post.value.view_count += 1
      }
      
      // 模拟收藏数据
      bookmarkCount.value = Math.floor(Math.random() * 50) + 5
      
      // 检查用户是否已收藏
      checkBookmarkStatus()
    }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    ElMessage.error('获取帖子详情失败')
  } finally {
    loading.value = false
  }
}

// 格式化数字，简化数值显示
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 🚧 点赞帖子 - 后端未完成，暂时使用模拟操作
const handleLike = async () => {
  if (!userStore.isAuthenticated) {
    showLoginPrompt('like')
    return
  }

  // 🚧 暂时只做UI更新，等后端完成后替换为真实API调用
  post.value.is_liked = !post.value.is_liked

  if (post.value.is_liked) {
    post.value.like_count++
    ElMessage.success('点赞成功')
  } else {
    post.value.like_count--
    ElMessage.info('已取消点赞')
  }

  // 🚧 等后端完成后启用以下代码
  // try {
  //   const result = await postStore.likePost(post.value.id)
  //   if (result) {
  //     post.value.is_liked = result.isLiked
  //     post.value.like_count = result.likeCount
  //   }
  // } catch (error) {
  //   // 回滚UI状态
  //   post.value.is_liked = !post.value.is_liked
  //   if (post.value.is_liked) {
  //     post.value.like_count++
  //   } else {
  //     post.value.like_count--
  //   }
  //   ElMessage.error('操作失败，请稍后再试')
  // }
}

// 🚧 收藏帖子 - 后端未完成，暂时使用模拟操作
const handleBookmark = async () => {
  if (!userStore.isAuthenticated) {
    showLoginPrompt('bookmark')
    return
  }

  // 🚧 暂时只做UI更新，等后端完成后替换为真实API调用
  isBookmarked.value = !isBookmarked.value
  if (isBookmarked.value) {
    bookmarkCount.value++
    ElMessage.success('收藏成功')
  } else {
    bookmarkCount.value--
    ElMessage.info('已取消收藏')
  }

  // 🚧 等后端完成后启用以下代码
  // try {
  //   const result = await bookmarkStore.toggleBookmark(post.value.id)
  //   if (result) {
  //     isBookmarked.value = result.isBookmarked
  //     bookmarkCount.value = result.bookmarkCount || bookmarkCount.value
  //   }
  // } catch (error) {
  //   // 回滚UI状态
  //   isBookmarked.value = !isBookmarked.value
  //   if (isBookmarked.value) {
  //     bookmarkCount.value--
  //   } else {
  //     bookmarkCount.value++
  //   }
  //   ElMessage.error('操作失败，请稍后再试')
  // }
}

// 🚧 检查收藏状态 - 后端未完成，暂时使用模拟数据
const checkBookmarkStatus = async () => {
  if (!userStore.isAuthenticated || !post.value) {
    return
  }

  // 🚧 暂时使用随机状态，等后端完成后替换为真实API调用
  isBookmarked.value = Math.random() > 0.7

  // 🚧 等后端完成后启用以下代码
  // try {
  //   const result = await bookmarkStore.checkBookmarkStatus(post.value.id)
  //   if (result) {
  //     isBookmarked.value = result.isBookmarked
  //   }
  // } catch (error) {
  //   isBookmarked.value = false
  // }
}

// 显示分享选项
const showShareOptions = () => {
  // 生成分享链接
  shareLink.value = window.location.href
  shareDialogVisible.value = true
}

// 通过特定平台分享
const shareVia = (platform: string) => {
  // 根据不同平台构建分享URL
  let shareUrl = ''
  const encodedUrl = encodeURIComponent(window.location.href)
  const encodedTitle = encodeURIComponent(post.value?.title || '分享文章')
  
  switch (platform) {
    case 'wechat':
      // 微信分享通常需要使用微信SDK，这里只是示例
      ElMessage.success('请使用微信扫描二维码分享')
      break
    case 'weibo':
      shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`
      window.open(shareUrl, '_blank')
      break
    case 'qq':
      shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`
      window.open(shareUrl, '_blank')
      break
    default:
      break
  }
  
  shareDialogVisible.value = false
}

// 复制链接
const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value)
    .then(() => {
      ElMessage.success('链接已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

// 编辑帖子
const editPost = () => {
  if (!post.value) return
  
  router.push({
    name: 'editPost',
    params: { id: post.value.id }
  })
}

// 提交评论
const submitComment = async () => {
  if (!commentFormRef.value) return
  
  await commentFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      // 构建评论数据
      const commentData = {
        content: commentForm.content,
        post_id: post.value?.id,
        parent_id: commentForm.parent_id
      }
      
      // 🚧 调用评论API - 后端未完成，暂时使用模拟操作
      // const result = await commentStore.createComment(commentData)

      // 🚧 暂时模拟成功，等后端完成后替换为真实API调用
      ElMessage.success(replyingTo.value ? '回复成功' : '评论发布成功')

      // 清空表单
      commentForm.content = ''
      cancelReply()

      // 🚧 暂时不触发评论列表刷新，等后端完成后启用
      // const event = new CustomEvent('refreshComments')
      // window.dispatchEvent(event)
    } catch (error) {
      console.error('Failed to submit comment:', error)
      ElMessage.error('评论提交失败，请稍后再试')
    } finally {
      submitting.value = false
    }
  })
}

// 设置回复对象
const handleReplyToComment = (commentId: number, username: string) => {
  replyingTo.value = { id: commentId, username }
  commentForm.parent_id = commentId
  
  // 滚动到评论表单
  scrollToCommentForm()
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  commentForm.parent_id = null
}

// 滚动到评论表单
const scrollToCommentForm = () => {
  setTimeout(() => {
    const commentForm = document.getElementById('comment-form')
    if (commentForm) {
      commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
}

// 显示登录提示
const showLoginPrompt = (type: string) => {
  loginPromptType.value = type
  loginPromptVisible.value = true
  
  // 如果是点赞或收藏，可以显示一个提示
  if (type === 'like' || type === 'bookmark') {
    ElMessage.info('请先登录才能进行此操作')
  }
  
  // 滚动到评论区，因为评论区有登录提示
  if (type === 'like' || type === 'bookmark') {
    scrollToCommentForm()
  }
}

onMounted(() => {
  fetchPostDetail()
  
  // 监听来自CommentList的事件
  window.addEventListener('scrollToComments', (event: Event) => {
    const commentsSection = document.getElementById('comments-section')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
  
  window.addEventListener('scrollToCommentForm', () => {
    scrollToCommentForm()
  })
  
  // 监听回复评论事件
  window.addEventListener('replyToComment', (event: Event) => {
    const detail = (event as CustomEvent).detail
    if (detail && detail.commentId) {
      handleReplyToComment(detail.commentId, detail.username || '用户')
    }
  })
})
</script>

<style scoped>
.post-detail-page {
  padding-top: var(--spacing-4);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.content-main {
  width: 100%;
  min-width: 0; /* 防止内容溢出 */
}

@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }
}

.card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-6);
}

.post-container {
  overflow: hidden;
}

.post-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-light);
}

.post-title {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-4);
  color: var(--text-primary);
  line-height: 1.4;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.author-info {
  display: flex;
  align-items: center;
}

.author-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  margin-right: var(--spacing-4);
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: var(--spacing-2);
  object-fit: cover;
}

.author-name {
  font-weight: var(--font-weight-medium);
}

.post-time {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

/* 更低调的统计信息样式 */
.post-stats-subtle {
  display: flex;
  border-top: 1px solid var(--border-lighter);
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  opacity: 0.8;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.post-stats-subtle .stat-item {
  display: flex;
  align-items: center;
  margin-right: var(--spacing-6);
  gap: var(--spacing-1);
}

.post-stats-subtle .material-icons-round {
  font-size: 0.95rem;
  margin-right: var(--spacing-1);
  opacity: 0.7;
}

.action-button .material-icons-round {
  font-size: 1.2rem;
  margin-right: var(--spacing-2);
}

.icon-view::before {
  content: "\f06e"; /* fa-eye */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.icon-comment::before {
  content: "\f075"; /* fa-comment */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.icon-like::before {
  content: "\f164"; /* fa-thumbs-up */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.icon-bookmark::before {
  content: "\f02e"; /* fa-bookmark */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.icon-share::before {
  content: "\f064"; /* fa-share */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.icon-edit::before {
  content: "\f304"; /* fa-pen */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.category-tag a {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.category-tag a:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

.post-content {
  padding: var(--spacing-8) var(--spacing-10);
  max-width: 900px;
  margin: 0 auto;
}

.content-html {
  line-height: 1.8;
  color: var(--text-primary);
  overflow-wrap: break-word;
  word-break: break-word;
  font-size: 1.05rem;
}

/* 调整代码块样式 */
.content-html pre {
  margin: var(--spacing-4) 0;
  padding: var(--spacing-4);
  background-color: var(--bg-code);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.content-html code {
  font-family: 'Courier New', Courier, monospace;
}

/* 调整标题样式 */
.content-html h2 {
  margin-top: var(--spacing-8);
  margin-bottom: var(--spacing-4);
  font-size: 1.75rem;
  color: var(--text-primary);
}

.content-html h3 {
  margin-top: var(--spacing-6);
  margin-bottom: var(--spacing-3);
  font-size: 1.4rem;
  color: var(--text-primary);
}

/* 调整段落样式 */
.content-html p {
  margin-bottom: var(--spacing-4);
}

/* 调整列表样式 */
.content-html ul, .content-html ol {
  margin: var(--spacing-4) 0;
  padding-left: var(--spacing-6);
}

.content-html li {
  margin-bottom: var(--spacing-2);
}

.post-tags {
  margin-top: var(--spacing-6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
}

.tag-label {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.tag {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-xs);
  transition: all var(--transition-fast);
}

.tag:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

.post-actions {
  border-top: 1px solid var(--border-light);
  padding: var(--spacing-5) var(--spacing-6);
  margin-top: var(--spacing-5);
  margin-bottom: var(--spacing-4);
  background-color: var(--bg-subtle);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

/* 按钮样式优化 */
.action-button {
  margin: var(--spacing-1) 0;
  padding: 10px 16px;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

/* 确保所有按钮中的图标颜色正确 */
.action-button .material-icons-round {
  font-size: 18px;
}

/* 确保主要按钮中的图标为白色，且悬浮时背景不变为白色 */
.el-button--primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.el-button--primary:hover,
.el-button--primary:focus {
  background-color: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
  color: white !important;
}

.el-button--primary .material-icons-round {
  color: white !important;
}

/* 确保悬浮状态下图标颜色不变 */
.el-button--primary:hover .material-icons-round,
.el-button--primary:focus .material-icons-round {
  color: white !important;
}

/* 编辑按钮样式调整 */
.edit-button .material-icons-round {
  color: white !important;
}

/* 用户互动操作图标样式 */
.share-options {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--spacing-6);
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-option:hover {
  transform: scale(1.1);
}

.share-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-2);
  color: white;
  font-size: 24px;
}

.wechat-icon {
  background-color: #07C160;
}

.weibo-icon {
  background-color: #E6162D;
}

.qq-icon {
  background-color: #12B7F5;
}

.link-icon {
  background-color: #666666;
}

.share-name {
  font-size: var(--font-size-sm);
}

.share-link-section {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-light);
}

.share-link-container {
  display: flex;
  gap: var(--spacing-2);
}

.icon-wechat::before {
  content: "\f1d7"; /* fa-wechat */
  font-family: 'Font Awesome 5 Brands';
}

.icon-weibo::before {
  content: "\f18a"; /* fa-weibo */
  font-family: 'Font Awesome 5 Brands';
}

.icon-qq::before {
  content: "\f1d6"; /* fa-qq */
  font-family: 'Font Awesome 5 Brands';
}

.icon-link::before {
  content: "\f0c1"; /* fa-link */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

@media (max-width: 768px) {
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .post-stats-subtle {
    margin-top: var(--spacing-2);
    padding-top: var(--spacing-2);
    font-size: var(--font-size-xs);
    flex-wrap: wrap;
  }
  
  .post-stats-subtle .stat-item {
    margin-bottom: var(--spacing-2);
    margin-right: var(--spacing-3);
  }
  
  .post-title {
    font-size: var(--font-size-xl);
  }
  
  .action-buttons {
    justify-content: space-between;
    width: 100%;
  }
  
  .post-content {
    padding: var(--spacing-4);
  }
  
  .content-html {
    font-size: 1rem;
  }
  
  .content-html h2 {
    font-size: 1.5rem;
  }
  
  .content-html h3 {
    font-size: 1.25rem;
  }
}

.comments-section {
  margin-top: var(--spacing-6);
}

.comments-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-light);
}

.section-title {
  font-size: var(--font-size-xl);
  margin: 0;
  color: var(--text-primary);
}

.comment-form-container {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-light);
}

.comment-form-header {
  margin-bottom: var(--spacing-4);
}

.form-title {
  font-size: var(--font-size-lg);
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.replying-to {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.cancel-reply {
  font-size: var(--font-size-xs);
  padding: 0;
}

.icon-close::before {
  content: "\f00d"; /* fa-times */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .comment-form-container {
    padding: var(--spacing-4);
  }
  
  .form-title {
    font-size: var(--font-size-md);
  }
}

/* 调整Material Icons样式 */
.material-icons-round {
  font-size: 1.1rem;
  vertical-align: middle;
}
</style> 