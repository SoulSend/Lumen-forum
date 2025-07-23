<template>
  <auth-required level="user" type="level" custom-message="您需要登录才能发布帖子">
      <div class="create-post-page">
        <div class="page-header">
          <h1 class="page-title">发布帖子</h1>
          <p class="page-description">分享您的观点、问题或创意与社区一起讨论</p>
        </div>
        
        <div class="post-form-container">
          <div class="form-progress">
            <div class="progress-bar" :style="{ width: formProgress + '%' }"></div>
            <div class="progress-steps">
              <div class="progress-step" :class="{ 'active': formProgress >= 25 }">
                <div class="step-icon">1</div>
                <div class="step-label">基本信息</div>
              </div>
              <div class="progress-step" :class="{ 'active': formProgress >= 50 }">
                <div class="step-icon">2</div>
                <div class="step-label">内容编辑</div>
              </div>
              <div class="progress-step" :class="{ 'active': formProgress >= 75 }">
                <div class="step-icon">3</div>
                <div class="step-label">发布设置</div>
              </div>
              <div class="progress-step" :class="{ 'active': formProgress >= 100 }">
                <div class="step-icon">4</div>
                <div class="step-label">完成发布</div>
              </div>
            </div>
          </div>
          
          <el-form
            ref="postFormRef"
            :model="postForm"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleSubmit"
          >
            <!-- 标题输入 -->
            <div class="form-section">
              <div class="section-header">
                <h2 class="section-title">
                  <el-icon><Document /></el-icon>
                  基本信息
                </h2>
                <p class="section-description">设置帖子的标题、分类和标签</p>
              </div>
              
              <el-form-item label="标题" prop="title">
                <el-input 
                  v-model="postForm.title" 
                  placeholder="请输入一个吸引人的标题" 
                  maxlength="100"
                  show-word-limit
                  class="title-input"
                >
                  <template #prefix>
                    <el-icon><Edit /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <div class="form-row">
                <!-- 分类选择 -->
                <el-form-item label="分类" prop="category_id" class="category-form-item">
                  <el-select 
                    v-model="postForm.category_id" 
                    placeholder="请选择分类"
                    class="category-select"
                  >
                    <el-option
                      v-for="category in categories"
                      :key="category.id"
                      :label="category.name"
                      :value="category.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                
                <!-- 标签选择 -->
                <el-form-item label="标签" class="tags-form-item">
                  <el-select
                    v-model="postForm.tags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="选择或创建标签"
                    class="tag-select"
                  >
                    <el-option
                      v-for="tag in tags"
                      :key="tag.id"
                      :label="tag.name"
                      :value="tag.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            
            <!-- 封面图上传 -->
            <div class="form-section">
              <div class="section-header">
                <h2 class="section-title">
                  <el-icon><Picture /></el-icon>
                  封面图片
                </h2>
                <p class="section-description">上传一张吸引人的封面图片（可选）</p>
              </div>
              
              <el-form-item>
                <el-upload
                  class="cover-uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleCoverSuccess"
                  :before-upload="beforeCoverUpload"
                  accept="image/jpeg,image/png,image/gif"
                >
                  <div class="cover-preview" v-if="postForm.cover_image">
                    <img :src="postForm.cover_image" class="cover-image" />
                    <div class="cover-overlay">
                      <el-button type="primary" circle>
                        <el-icon><Edit /></el-icon>
                      </el-button>
                    </div>
                  </div>
                  <div v-else class="upload-placeholder">
                    <el-icon class="cover-uploader-icon"><Plus /></el-icon>
                    <div class="el-upload__tip">
                      点击上传封面图片<br>
                      <span class="upload-tip-sub">建议尺寸 1200x400 像素</span>
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
            
            <!-- 富文本编辑器 -->
            <div class="form-section">
              <div class="section-header">
                <h2 class="section-title">
                  <el-icon><DocumentCopy /></el-icon>
                  内容编辑
                </h2>
                <p class="section-description">使用富文本编辑器编写帖子内容</p>
              </div>
              
              <el-form-item label="内容" prop="content">
                <div class="editor-container">
                  <el-input
                    v-model="postForm.content"
                    type="textarea"
                    :rows="12"
                    placeholder="请输入帖子内容..."
                    maxlength="5000"
                    show-word-limit
                    class="content-editor"
                  />
                </div>
              </el-form-item>
            </div>
            
            <!-- 发布设置 -->
            <div class="form-section">
              <div class="section-header">
                <h2 class="section-title">
                  <el-icon><Setting /></el-icon>
                  发布设置
                </h2>
                <p class="section-description">设置帖子的发布选项</p>
              </div>
              
              <div class="settings-options">
                <div class="setting-item">
                  <el-switch
                    v-model="postForm.allow_comments"
                    active-text="允许评论"
                    inactive-text="禁止评论"
                  />
                  <div class="setting-description">允许其他用户在您的帖子下发表评论</div>
                </div>
                
                <div class="setting-item">
                  <el-switch
                    v-model="postForm.is_original"
                    active-text="原创内容"
                    inactive-text="转载内容"
                  />
                  <div class="setting-description">标记为您的原创内容，获得更多曝光</div>
                </div>
                
                <div class="setting-item">
                  <el-switch
                    v-model="postForm.notify_followers"
                    active-text="通知关注者"
                    inactive-text="不通知"
                  />
                  <div class="setting-description">发布后通知您的关注者</div>
                </div>
              </div>
            </div>
            
            <!-- 提交按钮 -->
            <div class="form-actions-container">
              <div class="form-actions">
                <div class="action-left">
                  <el-checkbox v-model="postForm.save_draft">保存为草稿</el-checkbox>
                  <span class="draft-hint" v-if="postForm.save_draft">草稿将保存在您的个人中心</span>
                </div>
                <div class="action-right">
                  <el-button 
                    @click="cancel" 
                    class="cancel-btn"
                    size="large"
                  >
                    <el-icon><Close /></el-icon>
                    取消
                  </el-button>
                  <el-button 
                    type="primary" 
                    native-type="submit" 
                    :loading="loading"
                    class="submit-btn"
                    size="large"
                  >
                    <el-icon v-if="!loading"><DocumentChecked /></el-icon>
                    <span>{{ postForm.save_draft ? '保存草稿' : '发布帖子' }}</span>
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 发帖指南 -->
            <div class="posting-guidelines">
              <div class="guidelines-header" @click="toggleGuidelines">
                <h4>发帖须知</h4>
                <el-icon :class="{ 'rotate': showGuidelines }"><ArrowDown /></el-icon>
              </div>
              <transition name="fade">
                <ul v-show="showGuidelines">
                  <li>请确保帖子内容符合社区规范</li>
                  <li>尊重版权，引用他人内容请注明出处</li>
                  <li>帖子发布后可以编辑，但有24小时时间限制</li>
                  <li>高质量的内容更容易获得推荐</li>
                </ul>
              </transition>
            </div>
          </el-form>
        </div>
      </div>
      
      <template #fallback>
        <login-prompt type="create" />
      </template>
    </auth-required>

    <!-- 自动保存提示 -->
    <transition name="fade">
      <div v-if="showSaveNotification" class="save-notification">
        <el-icon><Check /></el-icon>
        草稿已自动保存
      </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch, computed, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Document, Picture, DocumentCopy, Setting, Close, ArrowDown, Check, DocumentChecked } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { usePostStore } from '../stores/postStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useUserStore } from '../stores/userStore'
import type { Category, Tag } from '../types/forum'
// 暂时移除Quill编辑器，使用简单的文本编辑器
// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css'
// @ts-ignore
import AuthRequired from '../components/common/AuthRequired.vue'
// @ts-ignore
import LoginPrompt from '../components/common/LoginPrompt.vue'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const userStore = useUserStore()

const postFormRef = ref<FormInstance>()
const loading = ref(false)
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([]) 
const draftSaveInterval = ref<number | null>(null)

// 简化的编辑器配置（移除Quill相关代码）

// 移除Quill相关的处理函数

// 表单数据
const postForm = reactive({
  title: '',
  content: '',
  category_id: null as number | null,
  tags: [] as number[],
  cover_image: '',
  allow_comments: true,
  is_original: true,
  notify_followers: false,
  save_draft: false
})

// 表单进度
const formProgress = computed(() => {
  let progress = 0;
  
  // 标题和分类 (25%)
  if (postForm.title.trim().length > 0) progress += 12.5;
  if (postForm.category_id !== null) progress += 12.5;
  
  // 内容 (50%)
  if (postForm.content.trim().length > 0) {
    // 根据内容长度增加进度
    const contentLength = postForm.content.trim().length;
    if (contentLength > 20) progress += 25;
    if (contentLength > 100) progress += 25;
  }
  
  // 设置选项已设置 (完成)
  if (progress >= 75) progress = 100;
  
  return progress;
});

// 显示发帖指南
const showGuidelines = ref(true);
const toggleGuidelines = () => {
  showGuidelines.value = !showGuidelines.value;
};

// 自动保存通知
const showSaveNotification = ref(false);
const saveNotificationTimeout = ref<number | null>(null);

// 显示自动保存通知
const showSaveNotificationMessage = () => {
  showSaveNotification.value = true;
  
  // 清除之前的超时
  if (saveNotificationTimeout.value !== null) {
    clearTimeout(saveNotificationTimeout.value);
  }
  
  // 设置新的超时，3秒后隐藏通知
  saveNotificationTimeout.value = window.setTimeout(() => {
    showSaveNotification.value = false;
  }, 3000);
};

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度应在5-100个字符之间', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 20, message: '内容长度不能少于20个字符', trigger: 'blur' }
  ]
}

// 封面图片上传前检查
const beforeCoverUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('上传封面只能是图片格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传封面图片大小不能超过 2MB!');
    return false;
  }
  return true;
}

// 封面图片上传成功回调
const handleCoverSuccess = (res, file) => {
  // 实际项目中应该从API响应中获取URL
  postForm.cover_image = URL.createObjectURL(file.raw);
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const result = await categoryStore.fetchCategories()
    if (result) {
      categories.value = result
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 自动保存草稿
const saveDraft = async () => {
  // 检查是否有内容可以保存
  if (!postForm.title.trim() && !postForm.content.trim()) {
    return
  }
  
  try {
    // 保存草稿到本地存储
    // 在实际项目中，应该调用API保存草稿到服务器
    localStorage.setItem('post_draft', JSON.stringify({
      title: postForm.title,
      content: postForm.content,
      category_id: postForm.category_id,
      tags: postForm.tags,
      cover_image: postForm.cover_image,
      timestamp: Date.now()
    }))
    
    // 显示自动保存通知
    showSaveNotificationMessage();
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

// 加载草稿
const loadDraft = () => {
  try {
    const savedDraft = localStorage.getItem('post_draft')
    if (savedDraft) {
      const draft = JSON.parse(savedDraft)
      // 检查草稿是否是24小时内保存的
      const now = Date.now()
      const draftTime = draft.timestamp || 0
      const isRecent = (now - draftTime) < (24 * 60 * 60 * 1000) // 24小时

      if (isRecent) {
        ElMessageBox.confirm(
          '发现您有未完成的草稿，是否继续编辑？',
          '加载草稿',
          {
            confirmButtonText: '继续编辑',
            cancelButtonText: '丢弃',
            type: 'info',
          }
        ).then(() => {
          // 加载草稿内容
          postForm.title = draft.title || ''
          postForm.content = draft.content || ''
          postForm.category_id = draft.category_id
          postForm.tags = draft.tags || []
          postForm.cover_image = draft.cover_image || ''
          ElMessage.success('已加载草稿')
        }).catch(() => {
          // 清除草稿
          localStorage.removeItem('post_draft')
          ElMessage.info('已丢弃草稿')
        })
      }
    }
  } catch (error) {
    console.error('Failed to load draft:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!postFormRef.value) return
  
  await postFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟创建帖子
        await new Promise(resolve => setTimeout(resolve, 1000))
        const result = {
          id: Math.floor(Math.random() * 1000),
          title: postForm.title,
          content: postForm.content
        }
        
        if (result) {
          // 清除草稿
          localStorage.removeItem('post_draft')
          
          const message = postForm.save_draft ? '草稿保存成功！' : '帖子发布成功！'
          ElMessage.success(message)
          
          if (postForm.save_draft) {
            const currentUserId = userStore.currentUser?.id
            if (currentUserId) {
              router.push({
                name: 'userProfile',
                params: { id: currentUserId },
                query: { tab: 'drafts' }
              })
            } else {
              router.push({ name: 'home' })
            }
          } else {
            router.push({
              name: 'postDetail',
              params: { id: result.id }
            })
          }
        } else {
          const action = postForm.save_draft ? '保存草稿' : '发布帖子'
          ElMessage.error(`${action}失败，请稍后再试`)
        }
      } catch (error) {
        console.error('Failed to create post:', error)
        const action = postForm.save_draft ? '保存草稿' : '发布帖子'
        ElMessage.error(`${action}失败，请稍后再试`)
      } finally {
        loading.value = false
      }
    }
  })
}

// 取消发布
const cancel = () => {
  if (postForm.title || postForm.content) {
    ElMessageBox.confirm(
      '离开页面将丢失未保存的内容，是否继续？',
      '确认离开',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      router.back()
    }).catch(() => {
      // 取消离开，继续编辑
    })
  } else {
    router.back()
  }
}

// 监听页面离开事件
const handleBeforeUnload = (e) => {
  if (postForm.title || postForm.content) {
    // 保存草稿
    saveDraft()
    
    // 显示提示
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(async () => {
  // 获取分类列表
  await fetchCategories()
  
  // 如果URL中有category_id参数，设置默认分类
  const categoryId = route.query.category_id
  if (categoryId) {
    postForm.category_id = Number(categoryId)
  }
  
  // 加载草稿
  loadDraft()
  
  // 设置自动保存
  draftSaveInterval.value = window.setInterval(saveDraft, 60000) // 每分钟自动保存
  
  // 添加页面离开事件监听
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // 模拟的标签数据，实际项目中应该从API获取
  tags.value = [
    { id: 1, name: '生活技巧', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 2, name: '家居', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 3, name: '美食', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 4, name: '旅行', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 5, name: '健康', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' }
  ]
})

// 组件卸载时清理
onBeforeUnmount(() => {
  // 清除自动保存定时器
  if (draftSaveInterval.value !== null) {
    clearInterval(draftSaveInterval.value)
  }
  
  // 移除页面离开事件监听
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.create-post-page {
  padding: 0;
  max-width: 100%;
}

.page-header {
  margin-bottom: 1.5rem;
  text-align: center;
  animation: fadeInDown 0.6s ease;
}

.page-title {
  font-size: 1.75rem;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.page-description {
  color: var(--gray-600);
  font-size: 1rem;
  margin-top: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.post-form-container {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 2rem;
  animation: fadeIn 0.8s ease;
}

.form-progress {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 6px;
  background-color: var(--gray-200);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--progress, 0%);
  background-color: var(--primary-color);
  transition: width 0.6s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.progress-step {
  flex: 1;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.progress-step.active {
  font-weight: bold;
  transform: translateY(-2px);
}

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--gray-200);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--gray-700);
  transition: all 0.3s ease;
}

.progress-step.active .step-icon {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.step-label {
  display: block;
  margin-top: 0.5rem;
  color: var(--gray-600);
  font-size: 0.75rem;
  transition: all 0.3s ease;
}

.progress-step.active .step-label {
  color: var(--primary-color);
}

.form-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  background-color: var(--white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid var(--gray-100);
  width: 100%;
  box-sizing: border-box;
}

.form-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--gray-200);
}

/* 确保所有表单项占满宽度 */
.form-section :deep(.el-form-item) {
  width: 100%;
  margin-bottom: var(--spacing-4);
}

.form-section :deep(.el-form-item__content) {
  width: 100%;
}

.form-section :deep(.el-input),
.form-section :deep(.el-select),
.form-section :deep(.el-textarea) {
  width: 100%;
}

.form-section :deep(.el-input__wrapper),
.form-section :deep(.el-select__wrapper) {
  width: 100%;
  box-sizing: border-box;
}

.section-header {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.25rem;
  color: var(--gray-800);
  margin-top: 0;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title .el-icon {
  color: var(--primary-color);
}

.section-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-top: 0;
}

.title-input {
  font-size: 1.2rem;
}

.title-input :deep(.el-input__wrapper) {
  padding-left: 0;
  box-shadow: none;
  border-bottom: 2px solid var(--gray-200);
  border-radius: 0;
  transition: all 0.3s ease;
}

.title-input :deep(.el-input__wrapper:hover),
.title-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-color: var(--primary-color);
}

.title-input :deep(.el-input__prefix) {
  color: var(--gray-400);
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.category-form-item {
  flex: 1;
}

.tags-form-item {
  flex: 2;
}

.category-select,
.tag-select {
  width: 100%;
}

.editor-container {
  margin-top: 8px;
  border-radius: var(--radius-md);
  width: 100%;
  position: relative;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
}

.editor-container:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px rgba(var(--primary-rgb), 0.1);
}

.content-editor {
  width: 100%;
  font-size: 16px;
  line-height: 1.6;
}

.content-editor :deep(.el-textarea) {
  width: 100%;
}

.content-editor :deep(.el-textarea__inner) {
  width: 100%;
  min-height: 320px;
  font-size: 16px;
  line-height: 1.6;
  border: none;
  border-radius: 0;
  padding: var(--spacing-4);
  resize: vertical;
  box-sizing: border-box;
  background: transparent;
  transition: all 0.3s ease;
}

.content-editor :deep(.el-textarea__inner:focus) {
  outline: none;
  box-shadow: none;
  background: rgba(var(--primary-rgb), 0.02);
}

.content-editor :deep(.el-input__count) {
  background: var(--bg-muted);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  position: absolute;
  bottom: var(--spacing-2);
  right: var(--spacing-2);
}

/* 编辑器工具栏样式 */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--bg-muted);
  border-bottom: 1px solid var(--border-light);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.editor-toolbar .toolbar-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.cover-uploader {
  display: block;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
}

.cover-uploader:hover {
  border-color: var(--primary-color);
  background-color: var(--gray-50);
}

.cover-uploader-icon {
  font-size: 2.5rem;
  color: var(--gray-400);
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
}

.upload-placeholder:hover .cover-uploader-icon {
  transform: scale(1.1);
  color: var(--primary-color);
}

.cover-preview {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.cover-image {
  max-width: 100%;
  max-height: 250px;
  display: block;
  margin: 0 auto;
  border-radius: var(--radius-md);
  transition: transform 0.3s ease;
}

.cover-preview:hover .cover-image {
  transform: scale(1.02);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-preview:hover .cover-overlay {
  opacity: 1;
}

/* 确保封面编辑按钮中的图标为白色 */
.cover-overlay .el-button {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.cover-overlay .el-button:hover,
.cover-overlay .el-button:focus {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.cover-overlay .el-button .el-icon {
  color: white !important;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.el-upload__tip {
  margin-top: 0.5rem;
  text-align: center;
  line-height: 1.4;
}

.upload-tip-sub {
  display: block;
  margin-top: 0.25rem;
  color: var(--gray-500);
  font-size: 0.75rem;
}

.settings-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.setting-item {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  background-color: var(--gray-50);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.setting-item:hover {
  background-color: var(--gray-100);
}

.setting-description {
  display: block;
  margin-top: 0.5rem;
  color: var(--gray-600);
  font-size: 0.875rem;
}

.form-actions-container {
  margin-top: 2.5rem;
  border-top: 1px solid var(--gray-200);
  padding-top: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-left {
  color: var(--gray-600);
  display: flex;
  align-items: center;
}

.action-left .el-checkbox {
  margin-right: 1rem;
}

.action-right {
  display: flex;
  gap: 1rem;
}

.cancel-btn, .submit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.5rem;
  height: 40px;
  font-size: 14px;
  min-width: 120px;
  justify-content: center;
}

.cancel-btn {
  transition: all 0.3s ease;
  border: 1px solid var(--gray-300);
  background-color: white;
}

.cancel-btn:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-400);
}

.submit-btn {
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: left 0.7s ease;
}

.submit-btn:hover::before {
  left: 100%;
}

.posting-guidelines {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--gray-50);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--primary-color);
  transition: all 0.3s ease;
}

.posting-guidelines:hover {
  background-color: var(--gray-100);
}

.guidelines-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.guidelines-header h4 {
  margin-top: 0;
  color: var(--gray-800);
  margin-bottom: 0;
}

.guidelines-header .el-icon {
  transition: transform 0.3s ease;
}

.guidelines-header .rotate {
  transform: rotate(180deg);
}

.posting-guidelines ul {
  padding-left: 1.2rem;
  margin-bottom: 0;
  margin-top: 1rem;
}

.posting-guidelines li {
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.posting-guidelines li:last-child {
  margin-bottom: 0;
}

.save-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--success-color, #67c23a);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .post-form-container {
    padding: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .settings-options {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .progress-steps {
    display: none;
  }
  
  .form-section {
    padding: 1rem;
  }
}

.draft-hint {
  font-size: 0.85rem;
  color: var(--gray-500);
  margin-left: 0.5rem;
}
</style> 