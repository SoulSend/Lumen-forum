<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo-container">
          <router-link to="/" class="logo">
            <span class="logo-text font-rounded text-gradient">Lumen</span>
          </router-link>
        </div>

        <!-- 主导航菜单 -->
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link font-rounded">首页</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/search" class="nav-link font-rounded">热门</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link font-rounded">关于</router-link>
            </li>
          </ul>
        </nav>

        <!-- 搜索框 -->
        <div class="search-container">
          <el-popover
            :visible="showSearchSuggestions && searchQuery.trim().length > 0"
            placement="bottom-start"
            :width="320"
            trigger="manual"
            popper-class="search-popover"
            transition="el-zoom-in-top"
          >
            <template #reference>
              <form @submit.prevent="handleSearch" class="search-form">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索帖子、话题或用户..."
                  :prefix-icon="Search"
                  class="search-input"
                  @keyup.enter="handleSearch"
                  @focus="handleSearchFocus"
                  @blur="handleSearchBlur"
                  @input="handleSearchInput"
                  clearable
                >
                  <template #append>
                    <el-button type="primary" @click="handleSearch">
                      搜索
                    </el-button>
                  </template>
                </el-input>
              </form>
            </template>
            
            <div class="search-suggestions">
              <!-- 搜索建议 -->
              <div v-if="searchQuery && searchSuggestions.length > 0" class="suggestion-section">
                <h4 class="section-title">
                  <i class="icon-search"></i>搜索建议
                </h4>
                <div class="suggestion-list">
                  <div 
                    v-for="(suggestion, index) in searchSuggestions" 
                    :key="`suggestion-${index}`"
                    class="suggestion-item"
                    @click="selectSuggestion(suggestion)"
                    @mousedown.prevent
                  >
                    <i class="icon-search-item"></i>
                    <span v-html="highlightQuery(suggestion)"></span>
                  </div>
                </div>
              </div>
              
              <!-- 搜索历史 -->
              <div v-if="!searchQuery && searchHistory.length > 0" class="suggestion-section">
                <h4 class="section-title">
                  <i class="icon-history"></i>最近搜索
                  <el-button 
                    type="text" 
                    class="clear-button" 
                    @click.stop="clearSearchHistory"
                    @mousedown.prevent
                  >
                    清除
                  </el-button>
                </h4>
                <div class="suggestion-list">
                  <div 
                    v-for="(item, index) in searchHistory.slice(0, 5)" 
                    :key="`history-${index}`"
                    class="suggestion-item"
                    @click="selectHistoryItem(item)"
                    @mousedown.prevent
                  >
                    <i class="icon-history-item"></i>
                    <span>{{ item }}</span>
                    <el-button 
                      type="text" 
                      class="remove-button" 
                      @click.stop="removeHistoryItem(index)"
                      @mousedown.prevent
                    >
                      <i class="icon-close"></i>
                    </el-button>
                  </div>
                </div>
              </div>
              
              <!-- 热门搜索 -->
              <div class="suggestion-section" v-if="!searchQuery || searchSuggestions.length === 0">
                <h4 class="section-title">
                  <i class="icon-fire"></i>热门搜索
                </h4>
                <div class="hot-tags">
                  <el-tag
                    v-for="(tag, index) in hotSearchTags"
                    :key="`tag-${index}`"
                    size="small"
                    @click="selectHotTag(tag)"
                    @mousedown.prevent
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-popover>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="打开菜单">
          <span class="menu-icon" :class="{ 'active': mobileMenuOpen }"></span>
        </button>

        <!-- 用户菜单 -->
        <div class="user-actions">
          <template v-if="isAuthenticated">
            <el-dropdown trigger="click" class="user-dropdown">
              <div class="user-profile">
                <img :src="currentUser?.avatar || '/default-avatar.png'" alt="用户头像" class="user-avatar">
                <span class="user-name hide-on-mobile">{{ currentUser?.username }}</span>
                <span class="material-icons-round dropdown-icon">expand_more</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link :to="{ name: 'userProfile', params: { id: currentUser?.id } }" class="dropdown-link">
                      <span class="material-icons-round">person</span>个人资料
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link :to="{ name: 'notifications' }" class="dropdown-link">
                      <span class="material-icons-round">notifications</span>通知
                      <el-badge v-if="unreadNotifications > 0" :value="unreadNotifications" class="notifications-badge" />
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link :to="{ name: 'settings' }" class="dropdown-link">
                      <span class="material-icons-round">settings</span>设置
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <a href="#" @click.prevent="handleLogout" class="dropdown-link">
                      <span class="material-icons-round">logout</span>退出登录
                    </a>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button 
              type="primary" 
              class="create-post-btn"
              @click="navigateToCreatePost"
            >
              <span class="material-icons-round hide-on-mobile">add</span>
              <span>发布帖子</span>
            </el-button>
          </template>
          <template v-else>
            <el-button 
              type="primary" 
              class="login-btn"
              @click="handleShowLogin"
            >
              登录
            </el-button>
          </template>
        </div>
      </div>
    </div>
    
    <!-- 移动端导航抽屉 -->
    <div class="mobile-nav" :class="{ 'active': mobileMenuOpen }">
      <div class="mobile-nav-container">
        <div class="mobile-nav-header">
          <span class="logo-text">Lumen</span>
          <button class="close-menu-btn" @click="toggleMobileMenu">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="mobile-search">
          <el-input
            v-model="searchQuery"
            placeholder="搜索帖子、话题或用户..."
            :prefix-icon="Search"
            @keyup.enter="handleMobileSearch"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
            @input="handleSearchInput"
            clearable
          >
            <template #append>
              <el-button type="primary" @click="handleMobileSearch">
                搜索
              </el-button>
            </template>
          </el-input>
          
          <div v-if="showSearchSuggestions && searchQuery.trim().length > 0" class="mobile-search-suggestions">
            <!-- 搜索建议 -->
            <div v-if="searchSuggestions.length > 0" class="mobile-suggestion-section">
              <h4 class="mobile-section-title">
                <i class="icon-search"></i>搜索建议
              </h4>
              <div class="mobile-suggestion-list">
                <div 
                  v-for="(suggestion, index) in searchSuggestions" 
                  :key="`mobile-suggestion-${index}`"
                  class="mobile-suggestion-item"
                  @click="selectSuggestion(suggestion)"
                >
                  <i class="icon-search-item"></i>
                  <span v-html="highlightQuery(suggestion)"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ul class="mobile-nav-list">
          <li class="mobile-nav-item">
            <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/search" class="mobile-nav-link" @click="closeMobileMenu">热门</router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">关于</router-link>
          </li>
          <template v-if="isAuthenticated">
            <li class="mobile-nav-item">
              <router-link to="/notifications" class="mobile-nav-link" @click="closeMobileMenu">
                通知
                <el-badge v-if="unreadNotifications > 0" :value="unreadNotifications" class="notifications-badge" />
              </router-link>
            </li>
            <li class="mobile-nav-item">
              <router-link :to="{ name: 'userProfile', params: { id: currentUser?.id } }" class="mobile-nav-link" @click="closeMobileMenu">个人资料</router-link>
            </li>
            <li class="mobile-nav-item">
              <router-link to="/settings" class="mobile-nav-link" @click="closeMobileMenu">设置</router-link>
            </li>
            <li class="mobile-nav-item">
              <a href="#" class="mobile-nav-link" @click.prevent="handleLogout">退出登录</a>
            </li>
          </template>
          <template v-else>
            <li class="mobile-nav-item">
              <a href="#" class="mobile-nav-link" @click.prevent="handleShowLogin">登录</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </header>
  
  <!-- 登录模态框 -->
  <LoginModal v-model:visible="showLoginModal" @login-success="handleLoginSuccess" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Loading } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/userStore'
import LoginModal from '../common/LoginModal.vue'
import { ElMessage } from 'element-plus'

// 用户状态
const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.isAuthenticated)
const currentUser = computed(() => userStore.currentUser)
const isAdmin = computed(() => userStore.isAdmin)
const unreadNotifications = ref(5) // 模拟未读通知数量

// 搜索
const searchQuery = ref('')
const showSearchSuggestions = ref(false)
const searchSuggestions = ref([])
const searchHistory = ref([])
const searchTimeout = ref(null)
const hotSearchTags = ref([
  '前端开发',
  '美食推荐',
  '户外探险',
  '职场经验',
  '装修攻略',
  '养生健康',
  '旅游景点',
  '学习方法'
])

// 导航状态
const mobileMenuOpen = ref(false)
const showCategories = ref(false)
const showMobileCategories = ref(false)
const categoryLoading = ref(false)
const categoryError = ref(false)

// 登录模态框
const showLoginModal = ref(false)

// 路由
const router = useRouter()

// 静态分类数据
const categories = ref([
  {
    id: 1,
    name: '生活技巧',
    post_count: 256,
    description: '日常生活中的各种实用技巧和窍门'
  },
  {
    id: 2,
    name: '家居装饰',
    post_count: 185,
    description: '家居装饰、布置和DIY创意'
  },
  {
    id: 3,
    name: '美食烹饪',
    post_count: 324,
    description: '美食菜谱、烹饪技巧和餐饮体验'
  },
  {
    id: 4,
    name: '旅行探索',
    post_count: 217,
    description: '旅行攻略、目的地推荐和旅途体验'
  },
  {
    id: 5,
    name: '健康养生',
    post_count: 198,
    description: '健康生活方式、运动健身和养生知识'
  },
  {
    id: 6,
    name: '职场技能',
    post_count: 176,
    description: '职场发展、技能提升和工作经验分享'
  }
])

// 切换分类下拉菜单
const toggleCategories = () => {
  showCategories.value = !showCategories.value
  if (showCategories.value) {
    // 点击其他区域关闭下拉菜单
    document.addEventListener('click', handleOutsideClick)
  } else {
    document.removeEventListener('click', handleOutsideClick)
  }
}

// 处理点击外部区域
const handleOutsideClick = (event) => {
  const dropdown = document.querySelector('.nav-dropdown-toggle')
  if (dropdown && !dropdown.contains(event.target)) {
    showCategories.value = false
    document.removeEventListener('click', handleOutsideClick)
  }
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// 切换移动端分类
const toggleMobileCategories = () => {
  showMobileCategories.value = !showMobileCategories.value
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 保存搜索历史
    saveSearchToHistory(searchQuery.value)
    
    router.push({
      name: 'search',
      query: { q: searchQuery.value }
    })
    
    // 关闭搜索建议
    showSearchSuggestions.value = false
  }
}

// 移动端搜索
const handleMobileSearch = () => {
  handleSearch()
  closeMobileMenu()
}

// 搜索框获取焦点
const handleSearchFocus = () => {
  showSearchSuggestions.value = true
  
  // 从localStorage加载搜索历史
  loadSearchHistory()
}

// 搜索框失去焦点
const handleSearchBlur = () => {
  // 使用延迟关闭，避免点击建议项时就关闭了弹出框
  setTimeout(() => {
    showSearchSuggestions.value = false
  }, 200)
}

// 处理搜索输入
const handleSearchInput = () => {
  // 清除之前的超时
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  
  // 设置新的超时，避免频繁请求
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim().length > 0) {
      fetchSearchSuggestions()
    } else {
      searchSuggestions.value = []
    }
  }, 300)
}

// 获取搜索建议
const fetchSearchSuggestions = async () => {
  try {
    // 这里应该是真实API调用，现在使用模拟数据
    const query = searchQuery.value.toLowerCase()
    
    // 模拟API返回的建议
    const mockSuggestions = [
      query + ' 相关文章',
      '关于' + query + '的讨论',
      query + ' 使用技巧',
      query + ' 推荐',
      query + ' 最佳实践'
    ]
    
    searchSuggestions.value = mockSuggestions
  } catch (error) {
    console.error('Failed to fetch search suggestions:', error)
    searchSuggestions.value = []
  }
}

// 高亮显示查询词
const highlightQuery = (text) => {
  if (!searchQuery.value.trim()) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 选择搜索建议
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  handleSearch()
}

// 选择历史记录项
const selectHistoryItem = (item) => {
  searchQuery.value = item
  handleSearch()
}

// 选择热门标签
const selectHotTag = (tag) => {
  searchQuery.value = tag
  handleSearch()
}

// 移除历史记录项
const removeHistoryItem = (index) => {
  searchHistory.value.splice(index, 1)
  saveSearchHistoryToStorage()
}

// 清空搜索历史
const clearSearchHistory = () => {
  searchHistory.value = []
  saveSearchHistoryToStorage()
}

// 保存搜索到历史
const saveSearchToHistory = (query) => {
  if (!query.trim()) return
  
  // 移除重复项
  const index = searchHistory.value.indexOf(query)
  if (index !== -1) {
    searchHistory.value.splice(index, 1)
  }
  
  // 添加到历史记录开头
  searchHistory.value.unshift(query)
  
  // 限制历史记录长度
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop()
  }
  
  // 保存到localStorage
  saveSearchHistoryToStorage()
}

// 保存搜索历史到localStorage
const saveSearchHistoryToStorage = () => {
  try {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  } catch (e) {
    console.error('Failed to save search history to localStorage:', e)
  }
}

// 从localStorage加载搜索历史
const loadSearchHistory = () => {
  try {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      searchHistory.value = JSON.parse(history)
    }
  } catch (e) {
    console.error('Failed to load search history from localStorage:', e)
    searchHistory.value = []
  }
}

// 显示登录模态框
const handleShowLogin = () => {
  showLoginModal.value = true
}

// 登录成功处理
const handleLoginSuccess = async () => {
  // 更新用户状态
  isAuthenticated.value = true
  // 获取并更新当前用户信息
  try {
    await userStore.getCurrentUser()
    // 更新用户数据
    currentUser.value = userStore.currentUser
    // 可以在这里处理其他登录后的操作，如加载用户偏好设置等
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout();
    ElMessage({
      message: '您已成功退出登录',
      type: 'success',
      duration: 2000
    });
    // 关闭移动端菜单
    closeMobileMenu();
    // 导航到首页
    router.push('/');
  } catch (error) {
    console.error('退出登录失败:', error);
    ElMessage({
      message: '退出登录失败，请稍后再试',
      type: 'error',
      duration: 3000
    });
  }
}

// 导航到发帖页面
const navigateToCreatePost = () => {
  router.push({ name: 'createPost' })
}

// 生命周期钩子
onMounted(async () => {
  // 检查用户登录状态
  const token = localStorage.getItem('token')
  if (token) {
    try {
      // 验证token并获取用户信息
      await userStore.getCurrentUser()
      isAuthenticated.value = true
      currentUser.value = userStore.currentUser
    } catch (error) {
      // token无效或过期，清除本地存储
      console.error('验证用户状态失败:', error)
      localStorage.removeItem('token')
      isAuthenticated.value = false
    }
  }
  
  // 加载搜索历史
  loadSearchHistory()
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
.app-header {
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-sm);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-height);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: var(--spacing-8);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  letter-spacing: -0.02em;
  transition: all var(--transition-normal);
  font-family: 'Quicksand', 'Varela Round', 'Nunito', sans-serif !important;
}

.main-nav {
  display: flex;
  margin: 0 var(--spacing-8);
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-right: var(--spacing-8);
  position: relative;
}

.nav-item:last-child {
  margin-right: 0;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  letter-spacing: 0.01em;
}

.nav-link:hover, .nav-link.router-link-active {
  color: var(--primary-color);
  background-color: rgba(249, 168, 38, 0.1);
}

.nav-dropdown-toggle {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: var(--spacing-2) 0;
}

.dropdown-icon {
  margin-left: var(--spacing-1);
  width: 0.75rem;
  height: 0.75rem;
  border: solid var(--gray-500);
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 2px;
  transform: rotate(45deg);
  transition: transform var(--transition-fast);
}

.dropdown-icon.active {
  transform: rotate(-135deg);
  margin-top: 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: -12px;
  min-width: 180px;
  background-color: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-2) 0;
  z-index: 10;
  margin-top: var(--spacing-2);
  border: 1px solid var(--border-light);
  animation: fadeIn 0.2s ease;
}

.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: 0;
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--text-primary);
  text-decoration: none;
  font-family: 'Nunito', 'Quicksand', 'HarmonyOS Sans', 'Noto Sans SC', sans-serif;
  transition: color var(--transition-normal);
  width: 100%;
}

.dropdown-link .material-icons-round {
  font-size: 1rem;
  color: var(--primary-color);
}

.dropdown-link:hover {
  color: var(--primary-color);
}

.dropdown-loading,
.dropdown-error {
  padding: var(--spacing-4);
  text-align: center;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

.search-container {
  margin-left: auto;
  margin-right: var(--spacing-4);
  width: 280px;
  position: relative;
}

.search-form {
  display: flex;
  position: relative;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-full) 0 0 var(--radius-full);
  background-color: var(--gray-100);
  box-shadow: none;
  transition: all 0.3s ease;
  padding-left: 16px;
  height: 40px;
}

.search-input :deep(.el-input__wrapper:hover) {
  background-color: var(--gray-200);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  background-color: var(--white);
  box-shadow: 0 0 0 2px var(--primary-color);
}

.search-input :deep(.el-input-group__append) {
  background-color: var(--primary-color);
  border-top-right-radius: var(--radius-full);
  border-bottom-right-radius: var(--radius-full);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0 16px;
  color: white;
  border: none;
  box-shadow: none;
  transition: all 0.3s ease;
  height: 40px;
  display: flex;
  align-items: center;
}

.search-form:focus-within {
  transform: translateY(-2px);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.search-form:focus-within .search-input :deep(.el-input__wrapper) {
  background-color: var(--white);
  box-shadow: 0 0 0 2px var(--primary-color);
}

.search-form:focus-within .search-input :deep(.el-input-group__append) {
  background-color: var(--primary-hover);
  box-shadow: 0 0 0 2px var(--primary-color);
}

.search-popover {
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: none;
  overflow: hidden;
}

.search-suggestions {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

.suggestion-section {
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-200);
}

.suggestion-section:last-child {
  border-bottom: none;
}

.section-title {
  font-family: 'Quicksand', 'Varela Round', 'Nunito', 'OPPO Sans', 'HarmonyOS Sans', 'Noto Sans SC', sans-serif;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.01em;
  margin-bottom: var(--spacing-2);
  color: var(--text-secondary);
}

.section-title i {
  margin-right: 8px;
  font-size: 14px;
  color: var(--primary-color);
}

.suggestion-list {
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background-color: var(--gray-100);
}

.suggestion-item i {
  margin-right: 10px;
  color: var(--gray-500);
  font-size: 14px;
}

.suggestion-item .remove-button {
  margin-left: auto;
  padding: 2px;
  font-size: 12px;
  visibility: hidden;
  color: var(--gray-500);
  transition: all 0.2s ease;
}

.suggestion-item:hover .remove-button {
  visibility: visible;
}

.suggestion-item .remove-button:hover {
  color: var(--danger-color);
  background-color: var(--gray-200);
  border-radius: 50%;
}

.clear-button {
  font-size: 12px;
  padding: 0;
  height: auto;
  line-height: 1;
  color: var(--gray-500);
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: var(--danger-color);
}

.hot-tags {
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tags .el-tag {
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--gray-100);
  border-color: var(--gray-200);
}

.hot-tags .el-tag:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.highlight {
  color: var(--primary-color);
  font-weight: bold;
}

/* 移动端搜索样式 */
.mobile-search {
  padding: 1rem;
  position: relative;
}

.mobile-search-suggestions {
  position: absolute;
  left: 1rem;
  right: 1rem;
  background-color: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  margin-top: 0.5rem;
  border: 1px solid var(--border-light);
  max-height: 300px;
  overflow-y: auto;
  animation: fadeIn 0.3s ease;
}

.mobile-suggestion-section {
  padding: 10px 0;
}

.mobile-section-title {
  margin: 0;
  padding: 0 16px 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-600);
  display: flex;
  align-items: center;
}

.mobile-suggestion-list {
  max-height: 250px;
  overflow-y: auto;
}

.mobile-suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
}

.mobile-suggestion-item:hover,
.mobile-suggestion-item:active {
  background-color: var(--gray-100);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-actions {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-3);
}

.create-post-btn {
  margin-left: 15px;
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: 8px 16px;
  height: auto;
}

.create-post-btn:active,
.create-post-btn:focus {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.login-btn {
  height: 36px;
  padding: 0 20px;
  font-size: 14px;
}

.login-btn:active,
.login-btn:focus,
.login-btn:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--white);
}

.user-dropdown {
  margin-left: var(--spacing-2);
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 24px;
  transition: background-color 0.2s ease;
}

.user-profile:hover {
  background-color: var(--bg-hover);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.user-name {
  font-weight: var(--font-weight-medium);
  margin: 0 var(--spacing-2);
  font-family: 'Nunito', 'Quicksand', 'HarmonyOS Sans', 'Noto Sans SC', sans-serif;
}

.dropdown-icon {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-left: 2px;
}

.notifications-badge {
  margin-left: auto;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: var(--spacing-2);
  cursor: pointer;
  position: relative;
  z-index: 10;
}

.menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--gray-800);
  position: relative;
  transition: background-color var(--transition-fast);
}

.menu-icon:before,
.menu-icon:after {
  content: '';
  width: 24px;
  height: 2px;
  background-color: var(--gray-800);
  position: absolute;
  left: 0;
  transition: all var(--transition-fast);
}

.menu-icon:before {
  top: -8px;
}

.menu-icon:after {
  bottom: -8px;
}

.menu-icon.active {
  background-color: transparent;
}

.menu-icon.active:before {
  transform: rotate(45deg);
  top: 0;
}

.menu-icon.active:after {
  transform: rotate(-45deg);
  bottom: 0;
}

.mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background-color: var(--white);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 99;
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  overflow-y: auto;
}

.mobile-nav.active {
  transform: translateX(0);
}

.mobile-nav-container {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--border-light);
}

.close-menu-btn {
  background: none;
  border: none;
  padding: var(--spacing-2);
  cursor: pointer;
  color: var(--gray-700);
  font-size: 1.25rem;
}

.mobile-dropdown {
  list-style: none;
  padding-left: var(--spacing-4);
  margin-bottom: var(--spacing-4);
  display: none;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-dropdown-item {
  margin-bottom: var(--spacing-2);
}

.mobile-dropdown-item:last-child {
  margin-bottom: 0;
}

.mobile-dropdown-link {
  color: var(--gray-700);
  text-decoration: none;
  padding: var(--spacing-2);
  display: block;
  transition: color var(--transition-fast);
}

.mobile-dropdown-link:hover {
  color: var(--primary-color);
}

.auth-item {
  margin-top: var(--spacing-4);
}

.mobile-auth-link {
  display: inline-block;
  padding: var(--spacing-2) var(--spacing-4);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.notifications-badge {
  margin-left: var(--spacing-2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }
  
  .search-container {
    display: none;
  }
  
  .hide-on-mobile {
    display: none;
  }
  
  .auth-buttons {
    display: none;
  }
}

/* 黑暗模式调整 */
:root[data-theme="dark"] .app-header {
  background-color: var(--bg-surface);
  border-bottom-color: var(--border-light);
}

/* 响应式设计 */
@media (max-width: 800px) {
  .column-login-modal :deep(.el-dialog) {
    width: 95% !important;
    margin-top: 2vh;
  }
  
  .column-login-container {
    flex-direction: column;
    min-height: auto;
  }
  
  .column-left {
    flex: 0 0 auto;
    padding: 2rem;
    min-height: 180px;
  }
  
  .brand-logo {
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }
  
  .brand-title {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }
  
  .brand-desc {
    font-size: 1rem;
  }
  
  .circle-1 {
    width: 200px;
    height: 200px;
  }
  
  .column-right {
    flex: 0 0 auto;
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .column-login-modal :deep(.el-dialog) {
    width: 100% !important;
    margin: 0;
    border-radius: 0;
    height: 100%;
  }
  
  .column-login-container {
    height: 100%;
  }
  
  .column-left {
    padding: 1.5rem;
    min-height: 140px;
  }
  
  .brand-logo {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .brand-title {
    font-size: 1.4rem;
  }
  
  .brand-desc {
    font-size: 0.9rem;
  }
  
  .column-right {
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  .form-header h3 {
    font-size: 1.5rem;
  }
  
  .login-type-tabs :deep(.el-tabs__item) {
    font-size: 0.9rem;
    height: 44px;
    line-height: 44px;
  }
  
  .login-form :deep(.el-input__wrapper),
  .get-code-btn,
  .submit-login-btn {
    height: 46px;
  }
  
  .code-input-wrap {
    flex-direction: column;
  }
  
  .get-code-btn {
    flex: 0 0 auto;
    width: 100%;
  }
}

.mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-item {
  border-bottom: 1px solid var(--border-light);
}

.mobile-nav-link {
  display: block;
  padding: var(--spacing-4) var(--spacing-2);
  color: var(--gray-800);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.mobile-nav-link:hover {
  color: var(--primary-color);
}

.icon-search, .icon-history, .icon-fire {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-search::before {
  content: '🔍';
}

.icon-history::before {
  content: '⏱️';
}

.icon-fire::before {
  content: '🔥';
}

.icon-search-item::before {
  content: '🔍';
}

.icon-history-item::before {
  content: '⏱️';
}

.icon-close::before {
  content: '✖';
  font-size: 10px;
}

.search-input :deep(.el-input__prefix-inner) {
  display: flex;
  color: var(--primary-color);
}

.search-input :deep(.el-input__suffix) {
  display: flex;
}

.search-input :deep(.el-input__suffix-inner) {
  display: flex;
}

.search-input :deep(.el-input__clear) {
  color: var(--gray-500);
}

.search-input :deep(.el-input-group__append:hover) {
  background-color: var(--primary-hover);
}
</style> 