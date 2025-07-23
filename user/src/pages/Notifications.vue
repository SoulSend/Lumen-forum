<template>
  <div class="notifications-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">通知中心</h1>
          <p class="page-subtitle">静态演示页面</p>
        </div>
        
        <div class="header-actions">
          <el-button type="primary" size="default" class="mark-all-read-btn">
            <el-icon><Check /></el-icon>
            全部已读
          </el-button>
        </div>
      </div>
      
      <!-- 过滤器 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <div class="filter-tab active">
            <span class="tab-label">全部</span>
            <span class="tab-count">5</span>
          </div>
          <div class="filter-tab">
            <span class="tab-label">未读</span>
            <span class="tab-count">2</span>
          </div>
          <div class="filter-tab">
            <span class="tab-label">评论</span>
            <span class="tab-count">3</span>
          </div>
          <div class="filter-tab">
            <span class="tab-label">点赞</span>
            <span class="tab-count">1</span>
          </div>
          <div class="filter-tab">
            <span class="tab-label">系统</span>
            <span class="tab-count">1</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 通知内容区域 -->
    <div class="notifications-content">
      <div class="notifications-container">
        <!-- 静态通知列表 -->
        <div class="notifications-list">
          <!-- 未读通知 -->
          <div class="notification-card unread">
            <div class="unread-indicator"></div>
            <div class="notification-avatar">
              <div class="avatar-container comment-type">
                <el-icon><ChatDotRound /></el-icon>
              </div>
            </div>
            <div class="notification-body">
              <div class="notification-main">
                <div class="notification-message">
                  <strong>张三</strong> 评论了您的帖子 "Vue3开发技巧分享"
                </div>
                <div class="notification-meta">
                  <span class="notification-time">2分钟前</span>
                  <span class="notification-category">评论通知</span>
                </div>
              </div>
              <div class="notification-preview">
                这个技巧很实用，感谢分享！我在项目中也遇到过类似的问题...
              </div>
            </div>
            <div class="notification-actions">
              <el-button circle size="small" class="action-btn read-btn">
                <el-icon><Check /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 已读通知 -->
          <div class="notification-card">
            <div class="notification-avatar">
              <div class="avatar-container like-type">
                <el-icon><Star /></el-icon>
              </div>
            </div>
            <div class="notification-body">
              <div class="notification-main">
                <div class="notification-message">
                  <strong>李四</strong> 点赞了您的帖子 "前端性能优化实践"
                </div>
                <div class="notification-meta">
                  <span class="notification-time">1小时前</span>
                  <span class="notification-category">点赞通知</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统通知 -->
          <div class="notification-card">
            <div class="notification-avatar">
              <div class="avatar-container system-type">
                <el-icon><Setting /></el-icon>
              </div>
            </div>
            <div class="notification-body">
              <div class="notification-main">
                <div class="notification-message">
                  系统维护通知：平台将于今晚23:00-01:00进行系统维护
                </div>
                <div class="notification-meta">
                  <span class="notification-time">3小时前</span>
                  <span class="notification-category">系统通知</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 未读评论通知 -->
          <div class="notification-card unread">
            <div class="unread-indicator"></div>
            <div class="notification-avatar">
              <div class="avatar-container comment-type">
                <el-icon><ChatDotRound /></el-icon>
              </div>
            </div>
            <div class="notification-body">
              <div class="notification-main">
                <div class="notification-message">
                  <strong>王五</strong> 回复了您的评论
                </div>
                <div class="notification-meta">
                  <span class="notification-time">5小时前</span>
                  <span class="notification-category">评论通知</span>
                </div>
              </div>
              <div class="notification-preview">
                我觉得你说得很对，这个方法确实能提升不少性能...
              </div>
            </div>
            <div class="notification-actions">
              <el-button circle size="small" class="action-btn read-btn">
                <el-icon><Check /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 提及通知 -->
          <div class="notification-card">
            <div class="notification-avatar">
              <div class="avatar-container mention-type">
                <el-icon><User /></el-icon>
              </div>
            </div>
            <div class="notification-body">
              <div class="notification-main">
                <div class="notification-message">
                  <strong>赵六</strong> 在帖子中提及了您
                </div>
                <div class="notification-meta">
                  <span class="notification-time">1天前</span>
                  <span class="notification-category">提及通知</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Check, 
  Setting, 
  ChatDotRound,
  Star,
  User
} from '@element-plus/icons-vue'

// 静态页面，无需复杂逻辑
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
