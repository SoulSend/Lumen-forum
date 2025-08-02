<template>
  <div class="notifications-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">通知中心</h1>
          <p class="page-subtitle">管理您的通知消息</p>
        </div>
        
        <div class="header-actions">
          <el-button
            type="primary"
            size="default"
            class="mark-all-read-btn"
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
          >
            <el-icon><Check /></el-icon>
            全部已读 ({{ unreadCount }})
          </el-button>
        </div>
      </div>
      
      <!-- 过滤器 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <div
            class="filter-tab"
            :class="{ active: currentFilter === 'all' }"
            @click="changeFilter('all')"
          >
            <span class="tab-label">全部</span>
            <span class="tab-count">{{ totalElements }}</span>
          </div>
          <div
            class="filter-tab"
            :class="{ active: currentFilter === 'unread' }"
            @click="changeFilter('unread')"
          >
            <span class="tab-label">未读</span>
            <span class="tab-count">{{ unreadCount }}</span>
          </div>
          <div
            class="filter-tab"
            :class="{ active: currentFilter === 'read' }"
            @click="changeFilter('read')"
          >
            <span class="tab-label">已读</span>
            <span class="tab-count">{{ totalElements - unreadCount }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 通知内容区域 -->
    <div class="notifications-content">
      <div class="notifications-container">
        <!-- 动态通知列表 -->
        <div class="notifications-list">
          <!-- 加载状态 -->
          <div v-if="loading && notifications.length === 0" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>

          <!-- 空状态 -->
          <div v-else-if="filteredNotifications.length === 0" class="empty-state">
            <div class="empty-icon">
              <el-icon size="48"><ChatDotRound /></el-icon>
            </div>
            <div class="empty-text">暂无通知</div>
          </div>

          <!-- 通知列表 -->
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-card"
            :class="{ unread: !notification.readAt }"
          >
            <div v-if="!notification.readAt" class="unread-indicator"></div>
            <div class="notification-avatar">
              <div class="avatar-container" :class="getNotificationTypeClass(notification.type)">
                <el-icon><component :is="getNotificationIcon(notification.type)" /></el-icon>
              </div>
            </div>
            <div class="notification-body">
              <div class="notification-main">
                <div class="notification-message">
                  {{ notification.title || notification.content }}
                </div>
                <div class="notification-meta">
                  <span class="notification-time">{{ formatNotificationTime(notification.createdAt) }}</span>
                  <span class="notification-category">{{ notification.type === 'comment' ? '评论通知' : notification.type === 'like' ? '点赞通知' : notification.type === 'follow' ? '关注通知' : '系统通知' }}</span>
                </div>
              </div>
              <div v-if="notification.content && notification.title" class="notification-preview">
                {{ notification.content }}
              </div>
            </div>
            <div class="notification-actions">
              <el-button
                v-if="!notification.readAt"
                circle
                size="small"
                class="action-btn read-btn"
                @click="markAsRead(notification.id)"
              >
                <el-icon><Check /></el-icon>
              </el-button>
              <el-button
                circle
                size="small"
                class="action-btn delete-btn"
                @click="deleteNotification(notification.id)"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && !loading" class="load-more">
            <el-button @click="loadMore" :loading="loading">加载更多</el-button>
          </div>

          <!-- 底部加载状态 -->
          <div v-if="loading && notifications.length > 0" class="loading-more">
            <el-skeleton :rows="2" animated />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Check,
  Setting,
  ChatDotRound,
  Star,
  User,
  Close
} from '@element-plus/icons-vue'
import { notificationApi } from '../services/api'
import { formatDate } from '../utils/format'

// 通知数据
const notifications = ref<any[]>([])
const loading = ref(false)
const currentFilter = ref('all') // all, unread, read
const currentPage = ref(0)
const pageSize = ref(20)
const totalElements = ref(0)
const hasMore = ref(true)

// 未读通知数量
const unreadCount = ref(0)

// 过滤后的通知
const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') return notifications.value
  if (currentFilter.value === 'unread') return notifications.value.filter(n => !n.readAt)
  if (currentFilter.value === 'read') return notifications.value.filter(n => n.readAt)
  return notifications.value
})

// 获取通知列表
const fetchNotifications = async (reset = false) => {
  if (loading.value) return

  loading.value = true
  try {
    const page = reset ? 0 : currentPage.value
    const result = await notificationApi.getNotifications(
      page,
      pageSize.value,
      'all',
      currentFilter.value === 'all' ? 'all' : currentFilter.value
    )

    if (result && result.content) {
      if (reset) {
        notifications.value = result.content
        currentPage.value = 0
      } else {
        notifications.value.push(...result.content)
      }

      totalElements.value = result.totalElements || 0
      hasMore.value = !result.last
      currentPage.value = result.pageable?.pageNumber || 0
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    ElMessage.error('获取通知失败')
  } finally {
    loading.value = false
  }
}

// 获取未读通知数量
const fetchUnreadCount = async () => {
  try {
    const result = await notificationApi.getUnreadCount()
    if (result) {
      unreadCount.value = result.total || 0
    }
  } catch (error) {
    console.error('Failed to fetch unread count:', error)
  }
}

// 标记单个通知为已读
const markAsRead = async (notificationId: number) => {
  try {
    await notificationApi.markAsRead(notificationId)

    // 更新本地状态
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.readAt) {
      notification.readAt = new Date().toISOString()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }

    ElMessage.success('已标记为已读')
  } catch (error) {
    console.error('Failed to mark as read:', error)
    ElMessage.error('操作失败')
  }
}

// 标记所有通知为已读
const markAllAsRead = async () => {
  try {
    await ElMessageBox.confirm('确定要标记所有通知为已读吗？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })

    await notificationApi.markAllAsRead()

    // 更新本地状态
    notifications.value.forEach(notification => {
      if (!notification.readAt) {
        notification.readAt = new Date().toISOString()
      }
    })
    unreadCount.value = 0

    ElMessage.success('所有通知已标记为已读')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to mark all as read:', error)
      ElMessage.error('操作失败')
    }
  }
}

// 删除通知
const deleteNotification = async (notificationId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await notificationApi.deleteNotification(notificationId)

    // 从本地列表中移除
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      const notification = notifications.value[index]
      if (!notification.readAt) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
      totalElements.value = Math.max(0, totalElements.value - 1)
    }

    ElMessage.success('通知已删除')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete notification:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 切换过滤器
const changeFilter = (filter: string) => {
  currentFilter.value = filter
  fetchNotifications(true)
}

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    fetchNotifications(false)
  }
}

// 获取通知类型图标
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'comment': return ChatDotRound
    case 'like': return Star
    case 'follow': return User
    case 'system': return Setting
    default: return ChatDotRound
  }
}

// 获取通知类型样式类
const getNotificationTypeClass = (type: string) => {
  switch (type) {
    case 'comment': return 'comment-type'
    case 'like': return 'like-type'
    case 'follow': return 'follow-type'
    case 'system': return 'system-type'
    default: return 'comment-type'
  }
}

// 格式化通知时间
const formatNotificationTime = (dateString: string) => {
  return formatDate(dateString)
}

// 初始化
onMounted(() => {
  fetchNotifications(true)
  fetchUnreadCount()
})
</script>

<style scoped>
.notifications-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-6);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: calc(100vh - var(--header-height));
}

/* 页面头部 */
.page-header {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border-light);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-5);
}

.title-section {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.875rem;
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  margin-top: var(--spacing-1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.mark-all-read-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2) var(--spacing-4);
}

/* 过滤器 */
.filter-section {
  border-top: 1px solid var(--border-light);
  padding-top: var(--spacing-5);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-muted);
  border: 1px solid transparent;
}

.filter-tab:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

.filter-tab.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
}

.tab-label {
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
}

.tab-count {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
  line-height: 1.2;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* 通知内容区域 */
.notifications-content {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.notifications-container {
  padding: var(--spacing-6);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* 通知卡片 */
.notification-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.notification-card.unread {
  background: linear-gradient(135deg, #fef7ff 0%, #faf5ff 100%);
  border-left: 4px solid var(--primary-color);
}

/* 未读指示器 */
.unread-indicator {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 通知头像 */
.notification-avatar {
  flex-shrink: 0;
}

.avatar-container {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  position: relative;
}

.avatar-container.comment-type {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.avatar-container.like-type {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.avatar-container.mention-type {
  background: linear-gradient(135deg, #10b981, #059669);
}

.avatar-container.system-type {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

/* 通知内容 */
.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-main {
  margin-bottom: var(--spacing-2);
}

.notification-message {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.notification-message strong {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.notification-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.notification-category {
  padding: 2px 8px;
  background: var(--bg-muted);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}

.notification-preview {
  background: var(--bg-muted);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
  border-left: 3px solid var(--border-light);
  margin-top: var(--spacing-2);
}

/* 通知操作按钮 */
.notification-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  opacity: 0;
  transition: all 0.3s ease;
}

.notification-card:hover .notification-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-light);
  background: white;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.read-btn:hover {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notifications-page {
    padding: var(--spacing-4);
  }

  .page-header {
    padding: var(--spacing-4);
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }

  .filter-tabs {
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }

  .filter-tab {
    padding: var(--spacing-2) var(--spacing-3);
  }

  .notifications-container {
    padding: var(--spacing-4);
  }

  .notification-card {
    padding: var(--spacing-4);
    gap: var(--spacing-3);
  }

  .avatar-container {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .notification-message {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .notifications-page {
    padding: var(--spacing-3);
  }

  .page-header {
    padding: var(--spacing-3);
  }

  .filter-tab {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  .notification-card {
    padding: var(--spacing-3);
  }

  .notification-actions {
    opacity: 1;
  }
}
</style>
