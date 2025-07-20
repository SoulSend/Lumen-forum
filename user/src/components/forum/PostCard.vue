<template>
  <div class="post-card card card-interactive" @click="navigateToPost">
    <div class="post-content">
      <div class="post-header">
        <!-- 帖子分类和置顶标记 -->
        <div class="category-wrapper">
          <router-link
            v-if="post.category && post.category.id"
            :to="{ name: 'category', params: { id: post.category.id } }"
            class="badge badge--category font--rounded"
            @click.stop
          >
            {{ post.category.name }}
          </router-link>
          <span v-if="post.isPinned || post.is_pinned" class="badge badge--pin font--rounded">
            <i class="icon-pin"></i>置顶
          </span>
          <span v-if="post.isSolved || post.is_solved" class="badge badge--solved font--rounded">
            <i class="icon-check"></i>已解决
          </span>
        </div>

        <!-- 帖子标题 -->
        <h3 class="post-title font--rounded">
          <router-link
            v-if="hasValidId(safePostData)"
            :to="{ name: 'postDetail', params: { id: safePostData.id } }"
          >
            {{ safePostData.title }}
          </router-link>
          <span v-else>{{ safePostData.title }}</span>
        </h3>
      </div>

      <!-- 帖子摘要 -->
      <p class="post-excerpt">{{ truncateText(safePostData.content) }}</p>

      <!-- 帖子标签 -->
      <div class="post-tags" v-if="safePostData.tags && safePostData.tags.length">
        <router-link
          v-for="tag in safePostData.tags.slice(0, 3)"
          :key="tag.id"
          :to="{ name: 'search', query: { tag_id: tag.id } }"
          class="tag"
          @click.stop
        >
          {{ tag.name }}
        </router-link>
        <span v-if="safePostData.tags.length > 3" class="more-tags">+{{ safePostData.tags.length - 3 }}</span>
      </div>
    </div>
    
    <div class="post-meta">
      <!-- 作者信息 -->
      <div class="author-info">
        <router-link
          v-if="hasValidId(safeUserData)"
          :to="{ name: 'userProfile', params: { id: safeUserData.id } }"
          class="author-link"
          @click.stop
        >
          <img
            :src="getUserAvatar(safeUserData)"
            :alt="getUserDisplayName(safeUserData)"
            class="avatar avatar--small"
          >
          <span class="author-name font--rounded">{{ getUserDisplayName(safeUserData) }}</span>
        </router-link>
        <div v-else class="author-link">
          <img
            :src="getUserAvatar(null)"
            :alt="getUserDisplayName(null)"
            class="avatar avatar--small"
          >
          <span class="author-name font--rounded">{{ getUserDisplayName(null) }}</span>
        </div>
      </div>
      
      <!-- 时间和统计 -->
      <div class="post-stats">
        <span class="post-time">
          <i class="icon-time"></i>{{ formatRelativeTime(safePostData.createdAt || safePostData.created_at) }}
        </span>
        <span class="stat views">
          <i class="icon-view"></i>{{ formatNumber(safeNumber(safePostData.viewCount)) }}
        </span>
        <span class="stat comments">
          <i class="icon-comment"></i>{{ formatNumber(safeNumber(safePostData.commentCount)) }}
        </span>
        <span class="stat likes">
          <i class="icon-like"></i>{{ formatNumber(safeNumber(safePostData.likeCount)) }}
        </span>
        <!-- 添加编辑按钮，仅当前用户是作者时显示 -->
        <router-link
          v-if="isCurrentUserAuthor && hasValidId(safePostData)"
          :to="{ name: 'editPost', params: { id: safePostData.id } }"
          class="edit-link"
          @click.stop
        >
          <span class="material-icons-round edit-icon">edit</span>
          编辑
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '../../stores/userStore'
import type { Post } from '../../types/forum'
import { safePost, safeUser, getUserDisplayName, getUserAvatar, safeNumber, hasValidId } from '../../utils/dataValidation'
import { truncateText, formatNumber, formatRelativeTime } from '../../utils/format'
const props = defineProps<{
  post: Post
}>()

const router = useRouter()
const userStore = useUserStore()

// 确保post数据的安全性
const safePostData = computed(() => safePost(props.post))
const safeUserData = computed(() => safeUser(props.post.user))

// 判断当前用户是否为帖子作者
const isCurrentUserAuthor = computed(() => {
  if (!userStore.currentUser) return false
  const postUserId = safePostData.value.userId
  return postUserId === userStore.currentUser.id && postUserId !== 0
})

// 使用统一的工具函数，避免重复代码

// 导航到帖子详情页 - 添加防御式编程
const navigateToPost = () => {
  if (!props.post?.id) {
    console.warn('无法导航：帖子ID不存在', props.post)
    return
  }

  router.push({
    name: 'postDetail',
    params: { id: String(props.post.id) }
  });
}
</script>

<style scoped>
.post-card {
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  display: flex;
  flex-direction: column;
}

.post-header {
  margin-bottom: var(--spacing-3);
}

.category-wrapper {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
  flex-wrap: wrap;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--spacing-2);
  height: 24px;
  background-color: rgba(249, 168, 38, 0.1);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  text-decoration: none;
  transition: all var(--transition-normal);
  letter-spacing: 0.01em;
}

.category-badge:hover {
  background-color: var(--primary-color);
  color: var(--white);
  transform: translateY(-1px);
}

.pin-badge, .solved-badge {
  display: inline-flex;
  align-items: center;
  padding: 0 var(--spacing-2);
  height: 24px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.01em;
}

.pin-badge {
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.solved-badge {
  background-color: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.post-title {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-2) 0;
  line-height: 1.3;
}

.post-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color var(--transition-normal);
}

.post-title a:hover {
  color: var(--primary-color);
}

.post-excerpt {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3);
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.post-tag {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background-color: var(--bg-subtle);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: all var(--transition-normal);
  letter-spacing: 0.01em;
}

.post-tag:hover {
  color: var(--primary-color);
  background-color: rgba(249, 168, 38, 0.1);
  transform: translateY(-1px);
}

.more-tags {
  display: inline-block;
  padding: 0 var(--spacing-2);
  height: 22px;
  line-height: 22px;
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-light);
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
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--spacing-2);
  border: 1px solid var(--border-light);
}

.author-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  transition: color var(--transition-normal);
  letter-spacing: -0.01em;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

.post-time, .stat {
  display: flex;
  align-items: center;
}

.icon-pin:before { content: "📌"; margin-right: 2px; }
.icon-check:before { content: "✅"; margin-right: 2px; }
.icon-time:before { content: "🕒"; margin-right: 2px; }
.icon-view:before { content: "👁️"; margin-right: 2px; }
.icon-comment:before { content: "💬"; margin-right: 2px; }
.icon-like:before { content: "👍"; margin-right: 2px; }

.stat.comments i::before {
  content: "💬";
}

.stat.likes i::before {
  content: "👍";
}

/* 编辑按钮样式 */
.edit-link {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  text-decoration: none;
  transition: all var(--transition-fast);
  margin-left: 8px;
}

.edit-link:hover {
  background-color: var(--primary-color);
  color: white;
}

.edit-link .material-icons-round {
  font-size: 14px;
  margin-right: 2px;
  /* 确保图标颜色跟随文字颜色 */
  color: inherit;
}

@media (max-width: 640px) {
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .post-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .post-excerpt {
    -webkit-line-clamp: 3;
  }
}

@media screen and (max-width: 480px) {
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .post-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .post-excerpt {
    -webkit-line-clamp: 3;
  }
}
</style> 