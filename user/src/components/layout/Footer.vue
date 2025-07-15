<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-section brand-section">
          <div class="footer-logo">
            <span class="logo-text">Lumen</span>
          </div>
          <p class="footer-description">Lumen是一个现代生活技巧分享社区，帮助用户发现和分享提升生活质量的知识和经验。</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="微信">
              <i class="icon-wechat"></i>
            </a>
            <a href="#" class="social-link" aria-label="微博">
              <i class="icon-weibo"></i>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <i class="icon-github"></i>
            </a>
            <a href="#" class="social-link" aria-label="知乎">
              <i class="icon-zhihu"></i>
            </a>
          </div>
        </div>

        <div class="footer-section links-section">
          <h3 class="footer-heading">快速链接</h3>
          <ul class="footer-links">
            <li><router-link to="/" class="footer-link">首页</router-link></li>
            <li><router-link to="/search" class="footer-link">搜索</router-link></li>
            <li><router-link to="/create-post" class="footer-link">发布帖子</router-link></li>
            <li><router-link to="/about" class="footer-link">关于我们</router-link></li>
            <li><router-link to="/terms" class="footer-link">使用条款</router-link></li>
            <li><router-link to="/privacy" class="footer-link">隐私政策</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section categories-section">
          <h3 class="footer-heading">热门分类</h3>
          <ul class="footer-links">
            <li v-for="category in popularCategories" :key="category.id">
              <router-link :to="{ name: 'category', params: { id: category.id } }" class="footer-link">
                {{ category.name }}
                <span class="category-count">({{ category.post_count }})</span>
              </router-link>
            </li>
          </ul>
        </div>
        
        <div class="footer-section contact-section">
          <h3 class="footer-heading">联系我们</h3>
          <ul class="contact-info">
            <li class="contact-item">
              <span class="material-icons-round">email</span>
              <span>contact@lumen-forum.com</span>
            </li>
            <li class="contact-item">
              <span class="material-icons-round">location_on</span>
              <span>北京市海淀区科技园区</span>
            </li>
          </ul>
          <div class="newsletter">
            <h4 class="newsletter-heading">订阅我们的周刊</h4>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <el-input
                v-model="email"
                placeholder="输入您的邮箱"
                class="newsletter-input"
              ></el-input>
              <el-button 
                type="primary" 
                native-type="submit"
                :loading="subscribing"
                class="newsletter-button"
              >
                订阅
              </el-button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">
          &copy; {{ currentYear }} Lumen. 保留所有权利.
        </p>
        <div class="bottom-links">
          <router-link to="/sitemap" class="bottom-link">网站地图</router-link>
          <span class="divider">•</span>
          <router-link to="/faq" class="bottom-link">常见问题</router-link>
          <span class="divider">•</span>
          <a href="#" class="bottom-link" @click.prevent="scrollToTop">返回顶部</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '../../stores/categoryStore'
import type { Category } from '../../types/forum'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()
const popularCategories = ref<Category[]>([])
const email = ref('')
const subscribing = ref(false)

const currentYear = computed(() => new Date().getFullYear())

// 订阅通讯
const subscribeNewsletter = async () => {
  if (!email.value || !validateEmail(email.value)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }
  
  subscribing.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('订阅成功！感谢您的关注')
    email.value = ''
  } catch (error) {
    console.error('Failed to subscribe:', error)
    ElMessage.error('订阅失败，请稍后再试')
  } finally {
    subscribing.value = false
  }
}

// 验证邮箱格式
const validateEmail = (email: string) => {
  const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  return re.test(email)
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  try {
    // 获取热门分类，实际情况可能需要专门的API
    const categories = await categoryStore.fetchCategories()
    if (categories) {
      // 按帖子数量排序并取前5个作为热门分类
      popularCategories.value = [...categories]
        .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
        .slice(0, 5)
    }
  } catch (error) {
    console.error('Failed to load popular categories:', error)
  }
})
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-light);
  padding: var(--spacing-10) 0 var(--spacing-6);
  margin-top: var(--spacing-8);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-8) var(--spacing-6);
}

@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
  }
}

.footer-section {
  margin-bottom: var(--spacing-6);
}

.brand-section {
  max-width: 320px;
}

.footer-logo {
  margin-bottom: var(--spacing-4);
}

.logo-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.footer-description {
  margin-bottom: var(--spacing-6);
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: var(--font-size-sm);
}

.social-links {
  display: flex;
  gap: var(--spacing-3);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  color: var(--text-secondary);
  transition: all var(--transition-normal);
}

.social-link:hover {
  background-color: var(--primary-color);
  color: var(--white);
  transform: translateY(-2px);
}

/* 图标 */
.icon-wechat:before { content: "WeChat"; font-size: 8px; }
.icon-weibo:before { content: "Weibo"; font-size: 8px; }
.icon-github:before { content: "GitHub"; font-size: 8px; }
.icon-zhihu:before { content: "知乎"; font-size: 8px; }
.icon-email:before { content: "✉️"; margin-right: var(--spacing-2); }
.icon-location:before { content: "📍"; margin-right: var(--spacing-2); }

.footer-heading {
  margin-bottom: var(--spacing-4);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: var(--spacing-2);
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-normal);
  font-size: var(--font-size-sm);
}

.footer-link:hover {
  color: var(--primary-color);
}

.category-count {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
}

.contact-info {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-6) 0;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.contact-item .material-icons-round {
  font-size: 1.2rem;
  margin-right: var(--spacing-3);
  color: var(--primary-color);
}

.newsletter {
  margin-top: var(--spacing-6);
}

.newsletter-heading {
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.newsletter-form {
  display: flex;
  gap: var(--spacing-2);
}

.newsletter-input {
  flex: 1;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-6);
  margin-top: var(--spacing-6);
  border-top: 1px solid var(--border-light);
  text-align: center;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    text-align: left;
  }
}

.copyright {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
  margin: 0;
}

.bottom-links {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-4);
}

@media (min-width: 768px) {
  .bottom-links {
    margin-top: 0;
  }
}

.bottom-link {
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: var(--font-size-xs);
  transition: color var(--transition-normal);
}

.bottom-link:hover {
  color: var(--primary-color);
}

.divider {
  color: var(--text-tertiary);
}
</style> 