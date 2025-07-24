<template>
  <div class="sidebar">  
    <!-- 最新动态 -->
    <div class="sidebar-section activities-section">
      <h3 class="sidebar-title">社区动态</h3>
      <div class="activity-list">
        <div v-for="(activity, index) in recentActivities.slice(0, 3)" :key="index" class="activity-item">
          <div class="activity-header">
            <router-link :to="{ name: 'userProfile', params: { id: activity.user.id } }" class="user-avatar-link">
              <img :src="getUserAvatarUrl(activity.user?.avatar)" :alt="activity.user?.username || '用户'" class="avatar avatar--small">
            </router-link>
            <div class="activity-info">
              <div class="activity-content">
                <router-link :to="{ name: 'userProfile', params: { id: activity.user.id } }" class="user-name-link">
                  {{ activity.user.username }}
                </router-link>
                <span v-html="getActivityAction(activity.type)"></span>
              </div>
              <div class="activity-time">{{ formatTime(activity.time) }}</div>
            </div>
          </div>
          <div class="activity-target" v-if="activity.post">
            <router-link :to="{ name: 'postDetail', params: { id: activity.post.id } }" class="target-link">
              {{ activity.post.title }}
            </router-link>
          </div>
        </div>
        <router-link to="/notifications" class="view-all-link">
          查看更多动态 <span class="material-icons-round">chevron_right</span>
        </router-link>
      </div>
    </div>

    <!-- 生活技巧 -->
    <div class="sidebar-section tips-section">
      <h3 class="sidebar-title">生活小技巧</h3>
      <div class="tips-list">
        <div v-for="(tip, index) in lifeTips" :key="index" class="tip-item">
          <div class="tip-icon">
            <span class="material-icons-round">{{ getTipIcon(tip.icon) }}</span>
          </div>
          <div class="tip-content">
            <h4 class="tip-title">{{ tip.title }}</h4>
            <p class="tip-description">{{ tip.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '../../stores/categoryStore';
import type { Category } from '../../types/forum';
import { formatNumber } from '../../utils/format';
import { getUserAvatarUrl } from '../../utils/assets';
import { DEFAULT_TEXTS } from '../../constants';

const categoryStore = useCategoryStore();

// 分类相关
const categories = ref<Category[]>([
]);
const categoryLoading = ref(false);

// 最新活动
const recentActivities = ref([
  { 
    type: 'post', 
    time: Date.now() - 1000 * 60 * 25,
    user: { id: 1, username: '生活家', avatar: '../assets/default-avatar.png' },
    post: { id: 101, title: '10个最实用的收纳技巧，让小户型秒变大空间' }
  },
  { 
    type: 'comment', 
    time: Date.now() - 1000 * 60 * 120,
    user: { id: 3, username: '旅行者', avatar: '../assets/default-avatar.png' },
    post: { id: 102, title: '欧洲自助游攻略：如何用最少的钱玩转欧洲' }
  },
  { 
    type: 'like', 
    time: Date.now() - 1000 * 60 * 180,
    user: { id: 2, username: '美食控', avatar: '../assets/default-avatar.png' },
    post: { id: 103, title: '在家做出餐厅级美味的5个小窍门' }
  }
]);

// 生活技巧
const lifeTips = ref([
  {
    icon: 'icon-bulb',
    title: '快速去除衣物皱褶',
    description: '把衣服挂在浴室里，淋浴时产生的蒸汽能帮助去除轻微皱褶。'
  },
  {
    icon: 'icon-home',
    title: '自然除臭妙招',
    description: '将小苏打和几滴精油混合，放在房间角落，能有效吸收异味。'
  },
  {
    icon: 'icon-food',
    title: '保持蔬菜新鲜',
    description: '在保鲜盒底部铺一层厨房纸巾，可以延长蔬菜的保鲜期。'
  }
]);

// 获取分类列表
const fetchCategories = async () => {
  // 使用模拟数据，不再调用API
  categoryLoading.value = false;
};

// 获取分类图标
const getCategoryIcon = (category: Category) => {
  const iconMap: Record<string, string> = {
    '生活技巧': 'icon-life',
    '家居装饰': 'icon-home',
    '美食烹饪': 'icon-food',
    '旅行探索': 'icon-travel',
    '健康养生': 'icon-health',
    '职场技能': 'icon-work'
  };
  
  return iconMap[category.name] || 'icon-default';
};

// 使用统一的格式化工具函数

// 获取活动动作文本
const getActivityAction = (type: string): string => {
  switch (type) {
    case 'post':
      return '<span class="material-icons-round activity-icon">edit</span> 发布了新帖子';
    case 'comment':
      return '<span class="material-icons-round activity-icon">comment</span> 评论了帖子';
    case 'like':
      return '<span class="material-icons-round activity-icon">thumb_up</span> 点赞了帖子';
    default:
      return '<span class="material-icons-round activity-icon">notifications</span> 有了新动态';
  }
};

// 获取技巧图标
const getTipIcon = (iconName: string): string => {
  const iconMap: Record<string, string> = {
    'icon-bulb': 'lightbulb',
    'icon-home': 'home',
    'icon-food': 'restaurant'
  };
  
  return iconMap[iconName] || 'tips_and_updates';
};

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}分钟前`;
  }
  
  // 小于24小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }
  
  // 小于7天
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}天前`;
  }
  
  // 其他情况显示日期
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 在<script setup>部分添加图标映射
const iconMapping = {
  'icon-bulb': '\uf0eb', // fa-lightbulb
  'icon-home': '\uf015', // fa-home
  'icon-food': '\uf2e7', // fa-utensils
  'icon-travel': '\uf072', // fa-plane
  'icon-health': '\uf21e', // fa-heartbeat
  'icon-work': '\uf0b1', // fa-briefcase
  'icon-default': '\uf02d', // fa-book
  'icon-arrow-right': '\uf054' // fa-chevron-right
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.sidebar {
  width: 100%;
}

.sidebar-section {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.sidebar-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-top: var(--spacing-2);
  margin-bottom: var(--spacing-4);
  margin-left: var(--spacing-1);
  padding-bottom: var(--spacing-2);
  padding-left: var(--spacing-1);
  border-bottom: 1px solid var(--border-light);
  text-align: center;
}

/* 分类导航样式 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.category-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.category-item:hover {
  background-color: var(--bg-hover);
}

.category-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  margin-right: var(--spacing-3);
  color: var(--white);
}

.category-icon-1 { background-color: var(--primary-color); }
.category-icon-2 { background-color: var(--success-color); }
.category-icon-3 { background-color: var(--info-color); }
.category-icon-4 { background-color: var(--warning-color); }
.category-icon-5 { background-color: var(--danger-color); }
.category-icon-6 { background-color: var(--secondary-color); }

.category-info {
  flex: 1;
}

.category-name {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-1);
}

.category-count {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

/* 活动列表样式 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.activity-item {
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--border-light);
}

.activity-item:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-header {
  display: flex;
  margin-bottom: var(--spacing-2);
}

.activity-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--spacing-3);
}

.activity-info {
  flex: 1;
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

.activity-time {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
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

.view-all-link {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  text-decoration: none;
  margin-top: var(--spacing-3);
  transition: color var(--transition-fast);
}

.view-all-link:hover {
  color: var(--primary-dark);
}

.view-all-link i {
  margin-left: var(--spacing-2);
  transition: transform var(--transition-fast);
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.view-all-link:hover i {
  transform: translateX(3px);
}

/* 生活技巧样式 */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.tip-item {
  display: flex;
  align-items: flex-start;
}

.tip-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  color: var(--primary-color);
  margin-right: var(--spacing-3);
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}

.tip-description {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 添加Font Awesome图标样式 */
.icon-arrow-right::before {
  content: "\f054"; /* fa-chevron-right */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.category-icon i::before {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.icon-bulb::before {
  content: "\f0eb"; /* fa-lightbulb */
}

.icon-home::before {
  content: "\f015"; /* fa-home */
}

.icon-food::before {
  content: "\f2e7"; /* fa-utensils */
}

.icon-travel::before {
  content: "\f072"; /* fa-plane */
}

.icon-health::before {
  content: "\f21e"; /* fa-heartbeat */
}

.icon-work::before {
  content: "\f0b1"; /* fa-briefcase */
}

.icon-default::before {
  content: "\f02d"; /* fa-book */
}

.icon-edit-alt::before {
  content: "\f304"; /* fa-pen */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}

.icon-comment-alt::before {
  content: "\f075"; /* fa-comment */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}

.icon-like-alt::before {
  content: "\f164"; /* fa-thumbs-up */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}

.icon-bell::before {
  content: "\f0f3"; /* fa-bell */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: var(--spacing-2);
}

/* 调整Material Icons样式 */
.material-icons-round {
  font-size: 1.1rem;
  color: var(--primary-color);
  vertical-align: middle;
}

.activity-icon {
  font-size: 0.9rem;
  margin-right: var(--spacing-2);
  position: relative;
  top: -1px;
}

.view-all-link .material-icons-round {
  font-size: 0.9rem;
  margin-left: var(--spacing-2);
  margin-right: 0;
  transition: transform var(--transition-fast);
}

.view-all-link:hover .material-icons-round {
  transform: translateX(3px);
}

.tip-icon .material-icons-round {
  font-size: 1.2rem;
}

/* 调整tip-icon样式 */
.tip-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  color: var(--primary-color);
  margin-right: var(--spacing-3);
  flex-shrink: 0;
}
</style> 