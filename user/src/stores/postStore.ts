import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { postApi } from '../services/api'
import type { Post, PaginatedResponse, CreatePostRequest } from '../types/forum'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0
  })

  // 获取帖子列表
  async function fetchPosts(params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await postApi.getPosts(params.page || 0, params.size || 10)
      if (response && response.content) {
        posts.value = response.content
        pagination.value = {
          currentPage: response.pageable?.pageNumber || 0,
          totalPages: response.totalPages || 1,
          perPage: response.pageable?.pageSize || 10,
          total: response.totalElements || 0
        }
      }
      return response
    } catch (e: any) {
      error.value = e?.message || '获取帖子列表失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 获取单个帖子详情
  async function fetchPost(id: number | string) {
    loading.value = true
    error.value = null
    
    try {
      // 测试编辑文章 ID=888
      if (id === '888') {
        // 返回一个用于测试编辑功能的文章
        const testEditPost: Post = {
          id: 888,
          title: '测试可编辑文章：前端开发最佳实践',
          content: `
            <h2>前端开发最佳实践指南</h2>
            <p>这是一篇专门用于测试编辑功能的文章，登录后可以尝试编辑这篇文章的内容。</p>
            
            <h3>1. 代码规范与一致性</h3>
            <p>保持代码风格一致对于团队协作至关重要。使用ESLint和Prettier这样的工具可以帮助自动化代码格式化和检查。</p>
            <pre><code>
// .eslintrc 配置示例
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"]
  }
}
            </code></pre>
            
            <h3>2. 性能优化技巧</h3>
            <p>前端性能优化应当从多个层面考虑：</p>
            <ul>
              <li>资源加载优化（懒加载、代码分割）</li>
              <li>运行时性能（减少重绘和回流）</li>
              <li>打包优化（Tree-shaking、压缩）</li>
              <li>缓存策略（HTTP缓存、Service Worker）</li>
            </ul>
            
            <h3>3. 组件设计原则</h3>
            <p>优秀的组件设计应遵循以下原则：</p>
            <ul>
              <li>单一职责原则</li>
              <li>可组合性</li>
              <li>可重用性</li>
              <li>可测试性</li>
            </ul>
            
            <p>你可以编辑这篇文章来测试编辑功能是否正常工作。</p>
          `,
          user_id: 123,
          user: {
            id: 123,
            username: '测试用户',
            email: 'test@example.com',
            avatar: '/default-avatar/1.png',
            bio: '这是一个测试账号',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            reputation: 100,
            post_count: 5,
            comment_count: 10,
            is_admin: false,
            is_moderator: false,
            last_active_at: new Date().toISOString()
          },
          category_id: 2,
          category: {
            id: 2,
            name: '开发经验',
            description: '分享开发经验和最佳实践',
            icon: 'icon-experience',
            slug: 'experience',
            post_count: 36,
            parent_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          view_count: 78,
          like_count: 25,
          comment_count: 8,
          is_pinned: false,
          is_featured: false,
          tags: [
            { id: 3, name: '前端开发', description: '前端开发技术', slug: 'frontend-dev', post_count: 42, created_at: '', updated_at: '' },
            { id: 4, name: '最佳实践', description: '编程最佳实践', slug: 'best-practices', post_count: 29, created_at: '', updated_at: '' }
          ],
          is_solved: false,
          solution_comment_id: null
        };
        
        currentPost.value = testEditPost;
        return testEditPost;
      }
      
      // 测试帖子 ID=999
      if (id === '999') {
        // 返回一个测试帖子
        const testPost: Post = {
          id: 999,
          title: '测试文章：Vue3 和 TypeScript 实战指南',
          content: `
            <h2>Vue3 和 TypeScript 的完美结合</h2>
            <p>Vue3 的发布带来了许多令人兴奋的新特性，特别是对 TypeScript 的原生支持大大提升了开发体验。</p>
            <h3>1. 组合式 API (Composition API)</h3>
            <p>组合式 API 是 Vue3 最显著的特性之一，它允许我们按照逻辑关注点组织代码，而不是按照选项来组织。</p>
            <pre><code>
export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    onMounted(() => {
      // 组件挂载完成
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
            </code></pre>
            <h3>2. TypeScript 集成</h3>
            <p>Vue3 是用 TypeScript 重写的，这意味着它提供了出色的类型推断和类型检查。</p>
            <p>使用 TypeScript 定义 props：</p>
            <pre><code>
interface Props {
  message: string
  count?: number
  isActive?: boolean
}

defineProps<Props>()
            </code></pre>
            <h3>3. 性能提升</h3>
            <p>Vue3 通过优化虚拟 DOM 和编译器，实现了显著的性能提升：</p>
            <ul>
              <li>更小的包体积</li>
              <li>更快的初始渲染</li>
              <li>更高效的更新</li>
              <li>更好的内存使用</li>
            </ul>
            <p>这篇测试文章展示了 Lumen 论坛的文章详情页功能是否正常工作。</p>
          `,
          user_id: 123,
          user: {
            id: 123,
            username: '测试用户',
            email: 'test@example.com',
            avatar: '/default-avatar/1.png',
            bio: '这是一个测试账号',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            reputation: 100,
            post_count: 5,
            comment_count: 10,
            is_admin: false,
            is_moderator: false,
            last_active_at: new Date().toISOString()
          },
          category_id: 1,
          category: {
            id: 1,
            name: '前端开发',
            description: '前端开发相关讨论',
            icon: 'icon-frontend',
            slug: 'frontend',
            post_count: 42,
            parent_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          view_count: 156,
          like_count: 38,
          comment_count: 12,
          is_pinned: false,
          is_featured: true,
          tags: [
            { id: 1, name: 'Vue3', description: 'Vue3框架', slug: 'vue3', post_count: 28, created_at: '', updated_at: '' },
            { id: 2, name: 'TypeScript', description: 'TypeScript语言', slug: 'typescript', post_count: 35, created_at: '', updated_at: '' }
          ],
          is_solved: false,
          solution_comment_id: null
        };
        
        currentPost.value = testPost;
        return testPost;
      }
      
      const post = await postApi.getPostById(id)
      currentPost.value = post
      return post
    } catch (e: any) {
      error.value = e.response?.data?.message || '获取帖子详情失败'
      return null
    } finally {
      loading.value = false
    }
  }

  // 🚧 创建帖子 - 后端未完成，暂时注释
  // async function createPost(postData: CreatePostRequest) {
  //   loading.value = true
  //   error.value = null
  //
  //   try {
  //     const createdPost = await postApi.createPost(postData)
  //     return createdPost
  //   } catch (e: any) {
  //     error.value = e?.message || '创建帖子失败'
  //     return null
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // 🚧 更新帖子 - 后端未完成，暂时注释
  // async function updatePost(id: number | string, postData: Partial<CreatePostRequest>) {
  //   loading.value = true
  //   error.value = null
  //
  //   try {
  //     const updatedPost = await postApi.updatePost(id, postData)
  //     if (currentPost.value?.id === Number(id)) {
  //       currentPost.value = updatedPost
  //     }
  //     return updatedPost
  //   } catch (e: any) {
  //     error.value = e?.message || '更新帖子失败'
  //     return null
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // 🚧 删除帖子 - 后端未完成，暂时注释
  // async function deletePost(id: number | string) {
  //   loading.value = true
  //   error.value = null
  //
  //   try {
  //     await postApi.deletePost(id)
  //     if (currentPost.value?.id === Number(id)) {
  //       currentPost.value = null
  //     }
  //     return true
  //   } catch (e: any) {
  //     error.value = e?.message || '删除帖子失败'
  //     return false
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // 🚧 点赞帖子 - 后端未完成，暂时注释
  // async function likePost(id: number | string) {
  //   try {
  //     const result = await postApi.likePost(id)
  //     return result
  //   } catch (e: any) {
  //     error.value = e?.message || '点赞操作失败'
  //     return null
  //   }
  // }

  // 🚧 收藏帖子 - 后端未完成，暂时注释
  // async function bookmarkPost(id: number | string) {
  //   try {
  //     const result = await postApi.bookmarkPost(id)
  //     return result
  //   } catch (e: any) {
  //     error.value = e?.message || '收藏操作失败'
  //     return null
  //   }
  // }

  return {
    posts,
    currentPost,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPost,
    // 🚧 未完成的功能暂时注释
    // createPost,
    // updatePost,
    // deletePost,
    // likePost,
    // bookmarkPost
  }
}) 