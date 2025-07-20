<template>
  <div class="settings-page">
      <div class="page-header">
        <h1 class="page-title">账号设置</h1>
      </div>
      
      <div class="settings-container">
        <el-tabs type="border-card">
          <!-- 个人资料设置 -->
          <el-tab-pane label="个人资料">
            <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-position="top"
              @submit.prevent="updateProfile"
              :validate-on-rule-change="false"
            >
              <el-form-item label="头像" prop="avatar">
                <div class="avatar-upload">
                  <img :src="avatarUrl" alt="头像" class="avatar-preview">
                  <el-upload
                    class="avatar-uploader"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="handleAvatarChange"
                  >
                    <el-button type="primary">更换头像</el-button>
                  </el-upload>
                </div>
              </el-form-item>
              
              <el-form-item label="用户名" prop="username">
                <el-input v-model="profileForm.username" placeholder="输入用户名"></el-input>
              </el-form-item>
              
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" placeholder="输入邮箱" type="email" disabled></el-input>
                <small>邮箱地址不可修改，请联系管理员更改</small>
              </el-form-item>
              
              <el-form-item label="个人简介" prop="bio">
                <el-input
                  v-model="profileForm.bio"
                  type="textarea"
                  placeholder="介绍一下自己吧"
                  rows="4"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" native-type="submit" :loading="profileLoading">保存个人资料</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <!-- 账号安全设置（增加手机绑定功能） -->
          <el-tab-pane label="安全设置">
            <div class="security-settings">
              <h3>登录密码</h3>
              <el-divider></el-divider>
              
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-position="top"
                @submit.prevent="changePassword"
                :validate-on-rule-change="false"
              >
                <el-form-item label="当前密码" prop="currentPassword">
                  <el-input 
                    v-model="passwordForm.currentPassword" 
                    placeholder="输入当前密码"
                    type="password"
                    show-password
                  ></el-input>
                </el-form-item>
                
                <el-form-item label="新密码" prop="newPassword">
                  <el-input 
                    v-model="passwordForm.newPassword" 
                    placeholder="输入新密码"
                    type="password"
                    show-password
                  ></el-input>
                  <small>密码长度不少于8个字符，包含字母和数字</small>
                </el-form-item>
                
                <el-form-item label="确认新密码" prop="confirmPassword">
                  <el-input 
                    v-model="passwordForm.confirmPassword" 
                    placeholder="再次输入新密码"
                    type="password"
                    show-password
                  ></el-input>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" native-type="submit" :loading="passwordLoading">修改密码</el-button>
                </el-form-item>
              </el-form>
              
              <h3 class="section-title">账号绑定</h3>
              <el-divider></el-divider>
              
              <!-- 手机绑定表单 -->
              <div class="binding-section">
                <div class="binding-status">
                  <div class="binding-type">
                    <span class="material-icons-round">smartphone</span>
                    <div class="binding-info">
                      <strong>手机绑定</strong>
                      <p v-if="phoneForm.isBound">
                        已绑定：{{ maskPhone(phoneForm.phone) }}
                        <el-button type="danger" link @click="unbindPhone" :loading="phoneLoading">解绑</el-button>
                      </p>
                      <p v-else>未绑定手机号，绑定后可用于登录和找回密码</p>
                    </div>
                  </div>
                  <el-button v-if="!phoneForm.isBound" @click="showPhoneForm = true">立即绑定</el-button>
                  <el-button v-else @click="showPhoneForm = true">修改绑定</el-button>
                </div>
                
                <el-collapse-transition>
                  <div v-show="showPhoneForm">
                    <el-form
                      ref="phoneFormRef"
                      :model="phoneForm"
                      :rules="phoneRules"
                      label-position="top"
                      @submit.prevent="bindPhone"
                      :validate-on-rule-change="false"
                      class="phone-form"
                    >
                      <el-form-item label="手机号码" prop="phone">
                        <el-input
                          v-model="phoneForm.phone"
                          placeholder="请输入手机号码"
                          maxlength="11"
                        ></el-input>
                      </el-form-item>
                      
                      <el-form-item label="验证码" prop="code">
                        <div class="code-input">
                          <el-input
                            v-model="phoneForm.code"
                            placeholder="请输入验证码"
                            maxlength="6"
                          ></el-input>
                          <el-button
                            :disabled="countDown > 0"
                            @click="sendVerificationCode"
                            :loading="sendingCode"
                          >
                            {{ countDown > 0 ? `${countDown}秒后重发` : '获取验证码' }}
                          </el-button>
                        </div>
                      </el-form-item>
                      
                      <el-form-item>
                        <el-button type="primary" native-type="submit" :loading="phoneLoading">
                          {{ phoneForm.isBound ? '更新手机绑定' : '绑定手机' }}
                        </el-button>
                        <el-button @click="showPhoneForm = false">取消</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-transition>
              </div>
              
              <!-- 邮箱绑定状态 -->
              <div class="binding-section">
                <div class="binding-status">
                  <div class="binding-type">
                    <span class="material-icons-round">email</span>
                    <div class="binding-info">
                      <strong>邮箱绑定</strong>
                      <p>已绑定：{{ maskEmail(profileForm.email) }}</p>
                    </div>
                  </div>
                  <el-tag type="success">已绑定</el-tag>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- 通知设置 -->
          <el-tab-pane label="通知设置">
            <div class="notification-settings">
              <h3>通知接收设置</h3>
              <el-divider></el-divider>
              
              <div class="settings-section">
                <div class="setting-item" v-for="(setting, index) in notificationSettings" :key="index">
                  <div class="setting-label">
                    <h4>{{ setting.label }}</h4>
                    <p>{{ setting.description }}</p>
                  </div>
                  <el-switch v-model="setting.value"></el-switch>
                </div>
                
                <div class="save-button">
                  <el-button type="primary" :loading="notificationLoading" @click="saveNotificationSettings">保存设置</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '../stores/userStore'
import { getUserAvatarUrl } from '../utils/assets'

const userStore = useUserStore()

// 表单引用
const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const phoneFormRef = ref<FormInstance>()

// 表单数据
const profileForm = reactive({
  username: userStore.currentUser?.username || '',
  email: userStore.currentUser?.email || '',
  bio: userStore.currentUser?.bio || '',
  avatar: null as File | null
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const phoneForm = reactive({
  phone: '',
  code: '',
  isBound: false
})

// 控制状态
const showPhoneForm = ref(false)
const phoneLoading = ref(false)
const sendingCode = ref(false)
const countDown = ref(0)

// 防止重复验证，仅在失焦或提交时验证
const validateOnRules = { trigger: ['blur', 'submit'] }

// 头像预览
const avatarUrl = computed(() => {
  if (profileForm.avatar) {
    return URL.createObjectURL(profileForm.avatar)
  }
  return getUserAvatarUrl(userStore.currentUser?.avatar)
})

// 表单规则 - 优化验证时机
const profileRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', ...validateOnRules },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', ...validateOnRules }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', ...validateOnRules },
    { type: 'email', message: '请输入有效的邮箱地址', ...validateOnRules }
  ],
  bio: [
    { max: 200, message: '个人简介不能超过200个字符', ...validateOnRules }
  ]
}

// 验证密码是否一致 - 优化为延迟验证
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请确认新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules: FormRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', ...validateOnRules }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', ...validateOnRules },
    { min: 8, message: '密码长度不能少于8个字符', ...validateOnRules },
    { 
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: '密码必须包含字母和数字',
      ...validateOnRules
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', ...validateOnRules },
    { validator: validateConfirmPassword, ...validateOnRules }
  ]
}

// 手机号验证规则
const validatePhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入手机号码'))
  }
  const pattern = /^1[3-9]\d{9}$/
  if (!pattern.test(value)) {
    return callback(new Error('请输入有效的手机号码'))
  }
  callback()
}

const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号码', ...validateOnRules },
    { validator: validatePhone, ...validateOnRules }
  ],
  code: [
    { required: true, message: '请输入验证码', ...validateOnRules },
    { min: 6, max: 6, message: '验证码长度应为6位', ...validateOnRules }
  ]
}

// 通知设置
const notificationSettings = reactive([
  {
    label: '评论通知',
    description: '当有用户评论您的帖子时接收通知',
    value: true
  },
  {
    label: '点赞通知',
    description: '当有用户点赞您的帖子或评论时接收通知',
    value: true
  },
  {
    label: '@提及通知',
    description: '当有用户在帖子或评论中@您时接收通知',
    value: true
  },
  {
    label: '系统通知',
    description: '接收系统公告和重要信息的通知',
    value: true
  },
  {
    label: '邮件通知',
    description: '将重要通知同时发送到您的邮箱',
    value: false
  },
  {
    label: '短信通知',
    description: '将重要通知同时发送到您的手机',
    value: false
  }
])

// 加载状态
const profileLoading = ref(false)
const passwordLoading = ref(false)
const notificationLoading = ref(false)

// 隐藏手机号中间4位
const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 11) return ''
  return phone.substring(0, 3) + '****' + phone.substring(7)
}

// 隐藏邮箱用户名部分
const maskEmail = (email: string): string => {
  if (!email) return ''
  const parts = email.split('@')
  if (parts.length !== 2) return email
  
  const username = parts[0]
  const domain = parts[1]
  
  let maskedUsername = username
  if (username.length > 3) {
    maskedUsername = username.substring(0, 3) + '*'.repeat(username.length - 3)
  }
  
  return maskedUsername + '@' + domain
}

// 头像上传处理
const handleAvatarChange = (file: any) => {
  profileForm.avatar = file.raw
}

// 更新个人资料 - 表单提交前验证
const updateProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate((valid) => {
    if (valid) {
      submitProfileForm()
    }
  })
}

// 实际提交表单 - 与验证分离
const submitProfileForm = async () => {
  profileLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('个人资料已更新')
  } catch (error) {
    console.error('Failed to update profile:', error)
    ElMessage.error('更新个人资料失败')
  } finally {
    profileLoading.value = false
  }
}

// 修改密码 - 表单提交前验证
const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate((valid) => {
    if (valid) {
      submitPasswordForm()
    }
  })
}

// 实际提交密码表单 - 与验证分离
const submitPasswordForm = async () => {
  passwordLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('密码已修改，请使用新密码登录')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // 重置表单状态
    nextTick(() => {
      passwordFormRef.value?.clearValidate()
    })
  } catch (error) {
    console.error('Failed to change password:', error)
    ElMessage.error('修改密码失败，请检查当前密码是否正确')
  } finally {
    passwordLoading.value = false
  }
}

// 发送手机验证码
const sendVerificationCode = async () => {
  if (!phoneForm.phone) {
    return ElMessage.warning('请先输入手机号码')
  }
  
  const pattern = /^1[3-9]\d{9}$/
  if (!pattern.test(phoneForm.phone)) {
    return ElMessage.warning('请输入有效的手机号码')
  }
  
  sendingCode.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success(`验证码已发送至 ${maskPhone(phoneForm.phone)}`)
    
    // 开始倒计时
    countDown.value = 60
    const timer = setInterval(() => {
      countDown.value--
      if (countDown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
  } catch (error) {
    console.error('Failed to send verification code:', error)
    ElMessage.error('验证码发送失败，请稍后重试')
  } finally {
    sendingCode.value = false
  }
}

// 绑定手机号
const bindPhone = async () => {
  if (!phoneFormRef.value) return
  
  await phoneFormRef.value.validate((valid) => {
    if (valid) {
      submitPhoneForm()
    }
  })
}

// 提交手机绑定表单
const submitPhoneForm = async () => {
  phoneLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    phoneForm.isBound = true
    showPhoneForm.value = false
    ElMessage.success('手机号绑定成功')
    
    // 重置验证码
    phoneForm.code = ''
    countDown.value = 0
    
    // 重置表单状态
    nextTick(() => {
      phoneFormRef.value?.clearValidate()
    })
  } catch (error) {
    console.error('Failed to bind phone:', error)
    ElMessage.error('手机绑定失败，请检查验证码是否正确')
  } finally {
    phoneLoading.value = false
  }
}

// 解除手机绑定
const unbindPhone = async () => {
  phoneLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    phoneForm.isBound = false
    phoneForm.phone = ''
    ElMessage.success('手机号解绑成功')
  } catch (error) {
    console.error('Failed to unbind phone:', error)
    ElMessage.error('手机解绑失败，请稍后重试')
  } finally {
    phoneLoading.value = false
  }
}

// 保存通知设置
const saveNotificationSettings = async () => {
  notificationLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('通知设置已保存')
  } catch (error) {
    console.error('Failed to save notification settings:', error)
    ElMessage.error('保存通知设置失败')
  } finally {
    notificationLoading.value = false
  }
}
</script>

<style scoped>
.settings-page {
  padding: 0 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  color: #333;
}

.settings-container {
  margin-bottom: 2rem;
  max-width: 800px; /* 限制表单最大宽度，提高可读性 */
}

.section-title {
  margin: 2rem 0 0.5rem;
  font-size: 1.25rem;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

/* 绑定模块样式 */
.binding-section {
  margin-bottom: 2rem;
}

.binding-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.binding-type {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.binding-info {
  display: flex;
  flex-direction: column;
}

.binding-info p {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.875rem;
}

.phone-form {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.code-input {
  display: flex;
  gap: 0.5rem;
}

.code-input .el-button {
  min-width: 120px;
}

/* 图标样式 */
.material-icons-round {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-right: var(--spacing-3);
  background-color: var(--bg-subtle);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 通知设置 */
.settings-section {
  margin-top: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.setting-label {
  flex: 1;
}

.setting-label h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #333;
}

.setting-label p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.save-button {
  margin-top: 2rem;
}

small {
  color: #999;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .avatar-upload {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .setting-label {
    margin-bottom: 0.5rem;
  }
  
  .binding-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .code-input {
    flex-direction: column;
  }
}
</style> 