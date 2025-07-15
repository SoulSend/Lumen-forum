<template>
  <main-layout>
    <div class="notifications-page">
      <div class="page-header">
        <h1 class="page-title">通知中心</h1>
        <div class="header-actions">
          <!-- 通知过滤器 -->
          <div class="notification-filters">
            <el-radio-group v-model="activeFilter" size="small" @change="handleFilterChange">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="unread">
                未读
                <el-badge v-if="unreadCount > 0" :value="unreadCount" class="unread-badge" />
              </el-radio-button>
              <el-radio-button label="comment">评论</el-radio-button>
              <el-radio-button label="like">点赞</el-radio-button>
              <el-radio-button label="system">系统</el-radio-button>
            </el-radio-group>
          </div>
          
          <el-button 
            type="primary"
            plain
            size="small"
            :disabled="!hasUnread || markingAllAsRead" 
            @click="markAllAsRead"
            class="mark-read-btn"
          >
            <span class="material-icons-round">done_all</span>
            全部标为已读
          </el-button>
        </div>
      </div>
      
      <div class="notifications-content" v-loading="loading">
        <div class="notifications-card">
          <!-- 通知列表 -->
          <transition-group name="list" tag="div" class="notifications-list">
            <div 
              v-for="notification in filteredNotifications" 
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read_at }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon" :class="getNotificationIconClass(notification)">
                <span class="material-icons-round">{{ getNotificationIcon(notification) }}</span>
              </div>
              <div class="notification-content">
                <div class="notification-header">
                  <div class="notification-message" v-html="formatNotificationMessage(notification)"></div>
                  <div class="notification-actions">
                    <el-tooltip content="标记为已读" placement="top" v-if="!notification.read_at">
                      <span class="action-icon" @click.stop="markAsRead(notification)">
                        <span class="material-icons-round">done</span>
                      </span>
                    </el-tooltip>
                    <el-tooltip content="删除通知" placement="top">
                      <span class="action-icon" @click.stop="deleteNotification(notification)">
                        <span class="material-icons-round">delete</span>
                      </span>
                    </el-tooltip>
                  </div>
                </div>
                <div class="notification-details">
                  <div class="notification-time">
                    <span class="material-icons-round time-icon">schedule</span>
                    {{ formatTime(notification.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
          
          <!-- 空状态 -->
          <div v-if="filteredNotifications.length === 0 && !loading" class="empty-notifications">
            <el-empty :description="getEmptyDescription()">
              <template #image>
                <div class="empty-icon">
                  <span class="material-icons-round">notifications_off</span>
                </div>
              </template>
            </el-empty>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="notifications.length > 0 && totalPages > 1" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="perPage"
            :total="total"
            :background="true"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    
    <!-- 确认删除对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除通知"
      width="360px"
      center
    >
      <span>确定要删除这条通知吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete" :loading="deleting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </main-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MainLayout from '../components/layout/MainLayout.vue'
import type { Notification } from '../types/forum'

const router = useRouter()

const notifications = ref<Notification[]>([])
const loading = ref(true)
const markingAllAsRead = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const total = ref(0)
const totalPages = ref(1)
const activeFilter = ref('all')
const deleteDialogVisible = ref(false)
const notificationToDelete = ref<Notification | null>(null)
const deleting = ref(false)

// 计算未读通知数量
const unreadCount = computed(() => {
  return notifications.value.filter(notification => !notification.read_at).length
})

// 根据筛选条件过滤通知
const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications.value
  } else if (activeFilter.value === 'unread') {
    return notifications.value.filter(notification => !notification.read_at)
  } else {
    return notifications.value.filter(notification => notification.type === activeFilter.value)
  }
})

// 计算是否有未读通知
const hasUnread = computed(() => {
  return notifications.value.some(notification => !notification.read_at)
})

// 获取通知图标
const getNotificationIcon = (notification: Notification) => {
  switch (notification.type) {
    case 'comment':
      return 'comment'
    case 'like':
      return 'thumb_up'
    case 'mention':
      return 'alternate_email'
    case 'system':
      return 'announcement'
    default:
      return 'notifications'
  }
}

// 获取通知图标类名
const getNotificationIconClass = (notification: Notification) => {
  return `icon-bg ${notification.type}-icon`
}

// 格式化通知消息
const formatNotificationMessage = (notification: Notification) => {
  switch (notification.type) {
    case 'comment':
      return `<strong>${notification.data.user_name}</strong> 在您的帖子 <strong>${notification.data.post_title}</strong> 中发表了评论`
    case 'like':
      return `<strong>${notification.data.user_name}</strong> 赞了您的帖子 <strong>${notification.data.post_title}</strong>`
    case 'mention':
      return `<strong>${notification.data.user_name}</strong> 在帖子 <strong>${notification.data.post_title}</strong> 中提到了您`
    case 'system':
      return notification.data.message || '系统通知'
    default:
      return '未知通知'
  }
}

// 根据当前筛选获取空状态描述
const getEmptyDescription = () => {
  switch (activeFilter.value) {
    case 'unread':
      return '没有未读通知'
    case 'comment':
      return '没有评论通知'
    case 'like':
      return '没有点赞通知'
    case 'system':
      return '没有系统通知'
    default:
      return '暂无通知'
  }
}

// 格式化时间
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 模拟数据 - 实际应该从API获取
const fetchNotifications = async (page = 1, filter = 'all') => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = [
      {
        id: 1,
        user_id: 1,
        type: 'comment',
        data: {
          post_id: 123,
          post_title: '如何整理小户型空间',
          comment_id: 456,
          user_name: '用户A',
          user_avatar: ''
        },
        read_at: null,
        created_at: '2023-06-20T10:30:00Z',
        updated_at: '2023-06-20T10:30:00Z'
      },
      {
        id: 2,
        user_id: 1,
        type: 'like',
        data: {
          post_id: 123,
          post_title: '如何整理小户型空间',
          user_name: '用户B',
          user_avatar: ''
        },
        read_at: '2023-06-19T08:45:00Z',
        created_at: '2023-06-19T08:45:00Z',
        updated_at: '2023-06-19T08:45:00Z'
      },
      {
        id: 3,
        user_id: 1,
        type: 'mention',
        data: {
          post_id: 789,
          post_title: '推荐一些家居好物',
          comment_id: 567,
          user_name: '用户C',
          user_avatar: ''
        },
        read_at: null,
        created_at: '2023-06-18T15:20:00Z',
        updated_at: '2023-06-18T15:20:00Z'
      },
      {
        id: 4,
        user_id: 1,
        type: 'system',
        data: {
          message: '您的帐户已成功验证，欢迎加入我们的社区！',
          link: ''
        },
        read_at: null,
        created_at: '2023-06-15T09:00:00Z',
        updated_at: '2023-06-15T09:00:00Z'
      },
      {
        id: 5,
        user_id: 1,
        type: 'like',
        data: {
          post_id: 456,
          post_title: '分享我的工作空间布置',
          user_name: '用户D',
          user_avatar: ''
        },
        read_at: null,
        created_at: '2023-06-14T14:30:00Z',
        updated_at: '2023-06-14T14:30:00Z'
      }
    ] as Notification[]
    
    // 根据筛选条件过滤模拟数据
    let filteredData = mockData
    if (filter !== 'all') {
      if (filter === 'unread') {
        filteredData = mockData.filter(item => !item.read_at)
      } else {
        filteredData = mockData.filter(item => item.type === filter)
      }
    }
    
    notifications.value = filteredData
    total.value = filteredData.length
    totalPages.value = Math.ceil(total.value / perPage.value)
    
    return filteredData
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    ElMessage.error('获取通知失败')
    return []
  } finally {
    loading.value = false
  }
}

// 处理通知点击事件
const handleNotificationClick = async (notification: Notification) => {
  // 标记已读
  if (!notification.read_at) {
    await markAsRead(notification)
  }
  
  // 根据不同类型的通知跳转到不同页面
  switch (notification.type) {
    case 'comment':
    case 'like':
    case 'mention':
      router.push({
        name: 'postDetail',
        params: { id: notification.data.post_id }
      })
      break
    case 'system':
      // 系统通知可能有特定的跳转链接
      if (notification.data.link) {
        router.push(notification.data.link)
      }
      break
    default:
      break
  }
}

// 标记单个通知为已读
const markAsRead = async (notification: Notification) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 更新本地状态
    notification.read_at = new Date().toISOString()
    
    ElMessage({
      message: '标记已读成功',
      type: 'success',
      duration: 2000
    })
    
    return true
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
    ElMessage.error('标记已读失败')
    return false
  }
}

// 标记所有通知为已读
const markAllAsRead = async () => {
  markingAllAsRead.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地状态
    notifications.value.forEach(notification => {
      if (!notification.read_at) {
        notification.read_at = new Date().toISOString()
      }
    })
    
    ElMessage({
      message: '已将所有通知标记为已读',
      type: 'success',
      duration: 2000
    })
  } catch (error) {
    console.error('Failed to mark all as read:', error)
    ElMessage.error('标记全部已读失败')
  } finally {
    markingAllAsRead.value = false
  }
}

// 处理页面变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchNotifications(page, activeFilter.value)
}

// 处理筛选器变化
const handleFilterChange = (filter: string) => {
  activeFilter.value = filter
  currentPage.value = 1
  fetchNotifications(1, filter)
}

// 删除通知
const deleteNotification = (notification: Notification) => {
  notificationToDelete.value = notification
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!notificationToDelete.value) return
  
  deleting.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 从本地状态中移除
    notifications.value = notifications.value.filter(
      n => n.id !== notificationToDelete.value!.id
    )
    
    ElMessage({
      message: '通知已删除',
      type: 'success',
      duration: 2000
    })
    
    deleteDialogVisible.value = false
    notificationToDelete.value = null
  } catch (error) {
    console.error('Failed to delete notification:', error)
    ElMessage.error('删除通知失败')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchNotifications(currentPage.value, activeFilter.value)
})
</script>

<style scoped>
.notifications-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-4);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.page-title {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.notification-filters {
  margin-right: var(--spacing-2);
}

.unread-badge {
  margin-left: 4px;
  transform: scale(0.8);
  transform-origin: right;
}

.mark-read-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mark-read-btn .material-icons-round {
  font-size: 16px;
}

.notifications-content {
  min-height: 300px;
}

.notifications-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.notifications-list {
  position: relative;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.notification-item {
  display: flex;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.2s ease;
  position: relative;
  cursor: pointer;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: var(--bg-hover);
}

.notification-item.unread {
  background-color: rgba(var(--primary-rgb), 0.05);
}

.notification-item.unread:hover {
  background-color: rgba(var(--primary-rgb), 0.1);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--primary-color);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-4);
  flex-shrink: 0;
}

.icon-bg {
  background-color: var(--bg-subtle);
}

.comment-icon {
  background-color: rgba(var(--info-rgb), 0.15);
  color: var(--info-color);
}

.like-icon {
  background-color: rgba(var(--danger-rgb), 0.15);
  color: var(--danger-color);
}

.mention-icon {
  background-color: rgba(var(--warning-rgb), 0.15);
  color: var(--warning-color);
}

.system-icon {
  background-color: rgba(var(--success-rgb), 0.15);
  color: var(--success-color);
}

.notification-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-2);
}

.notification-message {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: var(--spacing-4);
}

.notification-message strong {
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
}

.notification-actions {
  display: flex;
  gap: var(--spacing-2);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.notification-item:hover .notification-actions {
  opacity: 1;
}

.action-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-subtle);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-icon:hover {
  background-color: var(--bg-hover);
}

.action-icon .material-icons-round {
  font-size: 16px;
  color: var(--text-secondary);
}

.notification-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-time {
  display: flex;
  align-items: center;
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

.time-icon {
  font-size: 14px;
  margin-right: 4px;
}

.empty-notifications {
  padding: var(--spacing-10) var(--spacing-4);
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background-color: var(--bg-subtle);
}

.empty-icon .material-icons-round {
  font-size: 40px;
  color: var(--text-tertiary);
}

.pagination-container {
  margin-top: var(--spacing-6);
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .notification-filters {
    margin-right: 0;
    margin-bottom: var(--spacing-2);
  }
}
</style> 