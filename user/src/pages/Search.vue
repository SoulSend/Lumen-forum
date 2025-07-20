<template>
  <main-layout>
    <div class="search-page">
      <div class="container">
        <!-- 搜索结果头部 -->
        <div class="search-header">
          <h1 class="search-title">搜索结果</h1>
          <div class="search-form">
            <el-input
              v-model="searchQuery"
              placeholder="搜索帖子、话题或用户..."
              :prefix-icon="Search"
              @keyup.enter="handleSearch"
              clearable
              class="search-input"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
        </div>

        <div class="search-content">
          <!-- 左侧内容区 -->
          <div class="content-main">
            <!-- 搜索结果过滤器 -->
            <div class="search-filters card">
              <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane label="帖子" name="posts"></el-tab-pane>
                <el-tab-pane label="用户" name="users"></el-tab-pane>
                <el-tab-pane label="标签" name="tags"></el-tab-pane>
              </el-tabs>
            </div>

            <!-- 搜索结果列表 -->
            <div v-if="loading" class="search-loading">
              <el-skeleton :rows="3" animated class="skeleton-card" />
              <el-skeleton :rows="3" animated class="skeleton-card" />
            </div>
            
            <div v-else-if="searchResults && searchResults.length === 0" class="no-results card">
              <el-empty description="未找到相关结果" />
              <div class="search-tips">
                <h3>搜索建议：</h3>
                <ul>
                  <li>检查您的拼写</li>
                  <li>尝试使用更通用的关键词</li>
                  <li>尝试使用相关的同义词</li>
                </ul>
              </div>
            </div>
            
            <div v-else class="search-results">
              <!-- 帖子结果 -->
              <template v-if="activeTab === 'all' || activeTab === 'posts'">
                <post-card v-for="post in postResults" :key="post.id" :post="post" />
              </template>
              
              <!-- 用户结果 -->
              <template v-if="activeTab === 'all' || activeTab === 'users'">
                <div v-for="user in userResults" :key="user.id" class="user-card card">
                  <router-link :to="{ name: 'userProfile', params: { id: user.id } }" class="user-link">
                    <img :src="user?.avatar || '/src/assets/default-avatar.png'" :alt="user?.username || '用户'" class="user-avatar">
                    <div class="user-info">
                      <h3 class="user-name">{{ user.username }}</h3>
                      <p class="user-bio">{{ user.bio || '这个用户很懒，还没有填写个人简介' }}</p>
                    </div>
                  </router-link>
                </div>
              </template>
              
              <!-- 标签结果 -->
              <template v-if="activeTab === 'all' || activeTab === 'tags'">
                <div class="tags-container card">
                  <h3 class="section-title">相关标签</h3>
                  <div class="tags-list">
                    <router-link 
                      v-for="tag in tagResults" 
                      :key="tag.id" 
                      :to="{ name: 'search', query: { tag_id: tag.id } }"
                      class="tag-item"
                    >
                      <span class="tag-name">{{ tag.name }}</span>
                      <span class="tag-count">{{ tag.post_count || 0 }} 帖子</span>
                    </router-link>
                  </div>
                </div>
              </template>
              
              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  :page-size="perPage"
                  :total="totalItems"
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
                />
              </div>
            </div>
          </div>
          
          <!-- 右侧边栏 -->
          <div class="content-sidebar">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import MainLayout from '../components/layout/MainLayout.vue';
import PostCard from '../components/forum/PostCard.vue';
import Sidebar from '../components/layout/Sidebar.vue';
import { usePostStore } from '../stores/postStore';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();

// 搜索状态
const searchQuery = ref('');
const loading = ref(false);
const activeTab = ref('all');
const currentPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);

// 搜索结果
const searchResults = ref<any[]>([]);
const postResults = computed(() => searchResults.value.filter(item => item.type === 'post'));
const userResults = computed(() => searchResults.value.filter(item => item.type === 'user'));
const tagResults = computed(() => searchResults.value.filter(item => item.type === 'tag'));

// 初始化搜索
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q as string;
    performSearch();
  } else if (route.query.tag_id) {
    searchByTag(route.query.tag_id as string);
  }
});

// 监听路由变化
watch(() => route.query, (newQuery) => {
  if (newQuery.q) {
    searchQuery.value = newQuery.q as string;
    performSearch();
  } else if (newQuery.tag_id) {
    searchByTag(newQuery.tag_id as string);
  }
});

// 执行搜索
const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  loading.value = true;
  try {
    // 这里应该调用实际的API
    // const result = await searchService.search({
    //   query: searchQuery.value,
    //   type: activeTab.value === 'all' ? undefined : activeTab.value,
    //   page: currentPage.value,
    //   per_page: perPage.value
    // });
    
    // 模拟搜索结果
    await new Promise(resolve => setTimeout(resolve, 500));
    
    searchResults.value = [
      {
        id: 1,
        type: 'post',
        title: '如何提高工作效率的10个小技巧',
        content: '在现代快节奏的工作环境中，提高效率变得越来越重要...',
        user: { id: 1, username: '效率达人', avatar: '/default-avatar.png' },
        created_at: '2023-05-15T10:30:00',
        comment_count: 24,
        like_count: 56,
        view_count: 342,
        category: { id: 1, name: '职场技能' },
        tags: [{ id: 1, name: '效率' }, { id: 2, name: '工作' }]
      },
      {
        id: 2,
        type: 'post',
        title: '居家办公的环境布置建议',
        content: '随着远程工作的普及，如何打造一个高效的居家办公环境变得尤为重要...',
        user: { id: 2, username: '家居达人', avatar: '/default-avatar.png' },
        created_at: '2023-05-10T14:20:00',
        comment_count: 18,
        like_count: 42,
        view_count: 286,
        category: { id: 2, name: '家居装饰' },
        tags: [{ id: 3, name: '居家办公' }, { id: 4, name: '环境' }]
      },
      {
        id: 1,
        type: 'user',
        username: '效率达人',
        avatar: '/default-avatar.png',
        bio: '专注分享提高工作和生活效率的方法和工具',
        post_count: 45,
        follower_count: 1200
      },
      {
        id: 1,
        type: 'tag',
        name: '效率',
        post_count: 128
      },
      {
        id: 3,
        type: 'tag',
        name: '居家办公',
        post_count: 86
      }
    ];
    
    totalItems.value = 25; // 模拟总数
  } catch (error) {
    console.error('搜索失败:', error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

// 按标签搜索
const searchByTag = async (tagId: string) => {
  loading.value = true;
  try {
    // 实际应该调用API
    // const result = await tagService.getPostsByTag(tagId, {
    //   page: currentPage.value,
    //   per_page: perPage.value
    // });
    
    // 模拟结果
    await new Promise(resolve => setTimeout(resolve, 500));
    
    searchResults.value = [
      {
        id: 1,
        type: 'post',
        title: '如何提高工作效率的10个小技巧',
        content: '在现代快节奏的工作环境中，提高效率变得越来越重要...',
        user: { id: 1, username: '效率达人', avatar: '/default-avatar.png' },
        created_at: '2023-05-15T10:30:00',
        comment_count: 24,
        like_count: 56,
        view_count: 342,
        category: { id: 1, name: '职场技能' },
        tags: [{ id: 1, name: '效率' }, { id: 2, name: '工作' }]
      }
    ];
    
    totalItems.value = 1;
    activeTab.value = 'posts'; // 标签搜索默认显示帖子标签页
  } catch (error) {
    console.error('按标签搜索失败:', error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    currentPage.value = 1;
    router.push({
      name: 'search',
      query: { q: searchQuery.value }
    });
    performSearch();
  }
};

// 处理标签页切换
const handleTabChange = () => {
  currentPage.value = 1;
  performSearch();
};

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page;
  performSearch();
};
</script>

<style scoped>
.search-page {
  padding-top: var(--spacing-4);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.search-header {
  margin-bottom: var(--spacing-6);
}

.search-title {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-4);
  color: var(--text-primary);
}

.search-form {
  display: flex;
  gap: var(--spacing-3);
}

.search-input {
  flex: 1;
}

.search-content {
  display: flex;
  gap: var(--spacing-6);
}

.content-main {
  flex: 1;
  min-width: 0;
}

.content-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
}

.search-filters {
  margin-bottom: var(--spacing-6);
}

.search-loading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.skeleton-card {
  padding: var(--spacing-4);
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.no-results {
  text-align: center;
  padding: var(--spacing-8);
}

.search-tips {
  margin-top: var(--spacing-6);
  text-align: left;
  color: var(--text-secondary);
}

.search-tips h3 {
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-md);
}

.search-tips ul {
  padding-left: var(--spacing-6);
}

.search-tips li {
  margin-bottom: var(--spacing-2);
}

.user-card {
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.user-link {
  display: flex;
  text-decoration: none;
  color: var(--text-primary);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: var(--spacing-4);
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-2);
}

.user-bio {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.tags-container {
  padding: var(--spacing-4);
}

.section-title {
  margin-bottom: var(--spacing-4);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.tag-item {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-3);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.tag-item:hover {
  background-color: var(--bg-hover);
  transform: translateY(-2px);
}

.tag-name {
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  margin-bottom: var(--spacing-1);
}

.tag-count {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-8);
  margin-bottom: var(--spacing-8);
}

@media (max-width: 992px) {
  .search-content {
    flex-direction: column;
  }
  
  .content-sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }
  
  .search-title {
    font-size: var(--font-size-xl);
  }
}
</style> 