<template>
  <main-layout>
    <div class="edit-post-page" v-loading="initialLoading">
      <div class="page-header">
        <h1 class="page-title">编辑帖子</h1>
      </div>
      
      <div class="post-form-container" v-if="post">
        <el-form
          ref="postForm"
          :model="postForm"
          :rules="rules"
          label-position="top"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="标题" prop="title">
            <el-input 
              v-model="postForm.title" 
              placeholder="请输入帖子标题" 
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          
          <el-form-item label="分类" prop="category_id">
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
          
          <el-form-item label="内容" prop="content">
            <div class="editor-container">
              <QuillEditor
                v-model:content="postForm.content"
                contentType="html"
                :options="editorOptions"
                :toolbar="toolbarOptions"
                theme="snow"
                @ready="onEditorReady"
                @textChange="onTextChange"
              />
            </div>
          </el-form-item>
          
          <el-form-item label="标签">
            <el-select
              v-model="postForm.tags"
              multiple
              placeholder="选择标签（可选）"
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
          
          <el-form-item>
            <div class="form-actions">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" native-type="submit" :loading="submitting">保存修改</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      
      <div v-else-if="!initialLoading" class="not-found">
        <el-empty description="帖子不存在或您没有编辑权限"></el-empty>
        <div class="back-button">
          <el-button @click="router.push('/')">返回首页</el-button>
        </div>
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import MainLayout from '../components/layout/MainLayout.vue'
import { usePostStore } from '../stores/postStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useUserStore } from '../stores/userStore'
import type { Post, Category, Tag } from '../types/forum'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()
const categoryStore = useCategoryStore()
const userStore = useUserStore()

const post = ref<Post | null>(null)
const formRef = ref<FormInstance>()
const initialLoading = ref(true)
const submitting = ref(false)
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([]) // 实际项目中应该从API获取

// Quill编辑器配置
const editorOptions = {
  placeholder: '请输入帖子内容...',
  modules: {
    toolbar: '#toolbar'
  }
}

// 工具栏选项
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'code-block'],
  ['clean']
]

// 编辑器就绪回调
const onEditorReady = (quill) => {
  // 编辑器已加载完成，可以在此进行初始化设置
}

// 内容变化回调
const onTextChange = (delta, oldDelta, source) => {
  // 监听内容变化，可以在此处理变更
  // delta: 变化的内容
  // source: 变化的来源，用户输入或API
}

// 表单数据
const postForm = reactive({
  title: '',
  content: '',
  category_id: null as number | null,
  tags: [] as number[]
})

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
    { min: 10, message: '内容长度不能少于10个字符', trigger: 'blur' }
  ]
}

// 获取帖子详情
const fetchPostData = async () => {
  const postId = route.params.id as string
  try {
    const result = await postStore.fetchPost(postId)
    if (result) {
      post.value = result
      
      // 检查是否有权限编辑
      const currentUser = userStore.currentUser
      if (!currentUser || (currentUser.id !== result.user_id && !currentUser.is_admin && !currentUser.is_moderator)) {
        post.value = null
        ElMessage.error('您没有权限编辑此帖子')
        return
      }
      
      // 填充表单
      postForm.title = result.title
      postForm.content = result.content
      postForm.category_id = result.category_id
      postForm.tags = result.tags.map(tag => tag.id)
      
      // 设置页面标题
      document.title = `编辑: ${result.title} - Lumen论坛`
    }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    ElMessage.error('获取帖子信息失败')
  } finally {
    initialLoading.value = false
  }
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value || !post.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const result = await postStore.updatePost(post.value.id, {
          title: postForm.title,
          content: postForm.content,
          category_id: postForm.category_id as number,
          tags: postForm.tags
        })
        
        if (result) {
          ElMessage({
            message: '帖子更新成功！即将返回帖子详情页',
            type: 'success',
            duration: 2000
          })
          
          // 延迟跳转，让用户看到成功提示
          setTimeout(() => {
            router.push({
              name: 'postDetail',
              params: { id: post.value!.id }
            })
          }, 1500)
        } else {
          ElMessage.error('帖子更新失败，请稍后再试')
        }
      } catch (error) {
        console.error('Failed to update post:', error)
        ElMessage.error('帖子更新失败，请稍后再试')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 取消编辑
const cancel = () => {
  // 如果有内容已修改，则弹出确认提示
  if (
    postForm.title !== post.value?.title || 
    postForm.content !== post.value?.content || 
    postForm.category_id !== post.value?.category_id ||
    !areTagsEqual(postForm.tags, post.value?.tags.map(t => t.id) || [])
  ) {
    ElMessageBox.confirm(
      '您有未保存的修改，确定要离开吗？',
      '确认离开',
      {
        confirmButtonText: '确认离开',
        cancelButtonText: '继续编辑',
        type: 'warning'
      }
    )
      .then(() => {
        router.back()
      })
      .catch(() => {
        // 用户选择继续编辑，不做任何操作
      })
  } else {
    router.back()
  }
}

// 比较两个标签数组是否相等
const areTagsEqual = (arr1: number[], arr2: number[]) => {
  if (arr1.length !== arr2.length) return false
  const sortedArr1 = [...arr1].sort()
  const sortedArr2 = [...arr2].sort()
  return sortedArr1.every((val, idx) => val === sortedArr2[idx])
}

onMounted(async () => {
  // 获取分类列表
  await fetchCategories()
  
  // 模拟的标签数据，实际项目中应该从API获取
  tags.value = [
    { id: 1, name: '生活技巧', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 2, name: '家居', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 3, name: '美食', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 4, name: '旅行', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' },
    { id: 5, name: '健康', description: '', slug: '', post_count: 0, created_at: '', updated_at: '' }
  ]
  
  // 获取帖子详情
  await fetchPostData()
})
</script>

<style scoped>
.edit-post-page {
  padding: 0 1rem;
}

.page-header {
  margin-bottom: 2rem;
  background-color: var(--bg-subtle);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.page-title {
  font-size: 1.75rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-title::before {
  content: '\f044';  /* 编辑图标 */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.post-form-container {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  margin-bottom: 2rem;
}

.category-select, .tag-select {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  gap: 1rem;
}

/* 富文本编辑器样式 */
.editor-container {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

:deep(.ql-toolbar) {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid var(--border-light);
  background-color: var(--bg-subtle);
}

:deep(.ql-container) {
  border: none;
  font-family: var(--font-family);
  font-size: 1rem;
  height: 350px;
}

:deep(.ql-editor) {
  min-height: 350px;
  max-height: 500px;
  overflow-y: auto;
  line-height: 1.6;
}

.not-found {
  text-align: center;
  padding: 3rem 0;
}

.back-button {
  margin-top: 1.5rem;
}

:deep(.el-textarea__inner) {
  font-family: var(--font-family);
  line-height: 1.6;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--text-primary);
}

/* 编辑器增强样式 */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: var(--shadow-xs);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--primary-color-light);
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px var(--primary-color);
}
</style> 