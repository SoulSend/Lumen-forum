<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    custom-class="login-modal"
    width="800px"
    :append-to-body="true"
    :destroy-on-close="true"
    :before-close="handleClose"
    :lock-scroll="true"
    :modal-class="'login-modal-overlay'"
  >
    <div class="login-container">
      <!-- 左侧信息区域 -->
      <div class="login-info">
        <div class="brand">
          <h2 class="brand-name">Lumen论坛</h2>
          <p class="brand-slogan">分享知识，连接世界</p>
        </div>
        <div class="info-content">
          <p>欢迎加入我们的社区！</p>
          <p>在这里，您可以发现精彩内容，结交志同道合的朋友。</p>
        </div>
        
        <!-- 装饰元素 -->
        <div class="decoration">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
          <div class="floating-dots"></div>
        </div>
      </div>
      
      <!-- 右侧登录表单 -->
      <div class="login-form">
        <h3 class="form-title">账号登录</h3>
        
        <!-- 登录方式切换 -->
        <div class="login-tabs">
          <div 
            class="tab-item" 
            :class="{ 'active': loginType === 'phone' }"
            @click="switchLoginType('phone')"
          >
            <i class="tab-icon phone-icon"></i>
            手机号登录
          </div>
          <div 
            class="tab-item" 
            :class="{ 'active': loginType === 'email' }"
            @click="switchLoginType('email')"
          >
            <i class="tab-icon email-icon"></i>
            邮箱登录
          </div>
        </div>
        
        <!-- 表单内容 -->
        <transition name="fade" mode="out-in">
          <!-- 手机号登录表单 -->
          <div v-if="loginType === 'phone'" class="form-content" key="phone">
            <el-form :model="phoneForm" ref="phoneFormRef" :rules="phoneRules">
              <el-form-item prop="phone">
                <el-input 
                  v-model="phoneForm.phone" 
                  placeholder="请输入手机号"
                  :prefix-icon="PhoneIcon"
                  clearable
                  @keyup.enter="handlePhoneLogin"
                  @compositionstart="handleCompositionStart"
                  @compositionend="handleCompositionEnd"
                />
              </el-form-item>
              <el-form-item prop="code">
                <div class="verification-code">
                  <el-input 
                    v-model="phoneForm.code" 
                    placeholder="请输入验证码"
                    :prefix-icon="KeyIcon"
                    clearable
                    @keyup.enter="handlePhoneLogin"
                    @compositionstart="handleCompositionStart"
                    @compositionend="handleCompositionEnd"
                  />
                  <el-button 
                    type="primary" 
                    :disabled="isGettingCode" 
                    @click="getVerificationCode('phone')"
                    class="code-button"
                    :class="{ 'is-getting': isGettingCode }"
                  >
                    <span v-if="isGettingCode" class="countdown-wrapper">
                      <span class="countdown-number">{{ countdown }}</span>
                      <svg class="countdown-circle" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" stroke-width="2" fill="none" stroke-linecap="round"
                          :style="{ 'stroke-dashoffset': countdownProgress }" />
                      </svg>
                    </span>
                    <span v-else>获取验证码</span>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button 
                  type="primary" 
                  class="submit-btn" 
                  :loading="isLoggingIn" 
                  @click="handlePhoneLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 邮箱登录表单 -->
          <div v-else class="form-content" key="email">
            <el-form :model="emailForm" ref="emailFormRef" :rules="emailRules">
              <el-form-item prop="email">
                <el-input 
                  v-model="emailForm.email" 
                  placeholder="请输入邮箱"
                  :prefix-icon="MessageIcon"
                  clearable
                  @keyup.enter="handleEmailLogin"
                  @compositionstart="handleCompositionStart"
                  @compositionend="handleCompositionEnd"
                />
              </el-form-item>
              <el-form-item prop="code">
                <div class="verification-code">
                  <el-input 
                    v-model="emailForm.code" 
                    placeholder="请输入验证码"
                    :prefix-icon="KeyIcon"
                    clearable
                    @keyup.enter="handleEmailLogin"
                    @compositionstart="handleCompositionStart"
                    @compositionend="handleCompositionEnd"
                  />
                  <el-button 
                    type="primary" 
                    :disabled="isGettingCode" 
                    @click="getVerificationCode('email')"
                    class="code-button"
                    :class="{ 'is-getting': isGettingCode }"
                  >
                    <span v-if="isGettingCode" class="countdown-wrapper">
                      <span class="countdown-number">{{ countdown }}</span>
                      <svg class="countdown-circle" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" stroke-width="2" fill="none" stroke-linecap="round"
                          :style="{ 'stroke-dashoffset': countdownProgress }" />
                      </svg>
                    </span>
                    <span v-else>获取验证码</span>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button 
                  type="primary" 
                  class="submit-btn" 
                  :loading="isLoggingIn" 
                  @click="handleEmailLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Phone as PhoneIcon, Message as MessageIcon, Key as KeyIcon } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/userStore'

// 状态管理
const userStore = useUserStore()

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:visible', 'login-success'])

// 响应式状态
const loginType = ref('phone') // 'phone' 或 'email'
const isLoggingIn = ref(false)
const isGettingCode = ref(false)
const countdown = ref(0)
const isComposing = ref(false) // 是否正在使用中文输入法

// 表单引用
const phoneFormRef = ref()
const emailFormRef = ref()

// 表单数据
const phoneForm = ref({
  phone: '',
  code: ''
})

const emailForm = ref({
  email: '',
  code: ''
})

// 表单验证规则
const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入正确的11位手机号', 
      trigger: 'blur' 
    },
    { 
      validator: (rule, value, callback) => {
        if (value && !/^1[3-9]\d{9}$/.test(value) && value !== '123') {
          callback(new Error('手机号格式不正确'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { 
      pattern: /^\d{6}$/, 
      message: '验证码必须为6位数字', 
      trigger: 'blur' 
    },
    { 
      validator: (rule, value, callback) => {
        if (value && !/^\d{6}$/.test(value) && value !== '123456') {
          callback(new Error('验证码必须为6位数字'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

const emailRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { 
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
      message: '请输入正确的邮箱地址', 
      trigger: 'blur' 
    },
    { 
      validator: (rule, value, callback) => {
        if (value === 'test@example.com') {
          // 允许测试邮箱
          callback();
        } else if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          callback(new Error('邮箱格式不正确'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { 
      pattern: /^\d{6}$/, 
      message: '验证码必须为6位数字', 
      trigger: 'blur' 
    },
    { 
      validator: (rule, value, callback) => {
        if (emailForm.value.email === 'test@example.com' && value === '123456') {
          // 测试账号验证码
          callback();
        } else if (value && !/^\d{6}$/.test(value)) {
          callback(new Error('验证码必须为6位数字'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// 计算属性
const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}秒后重新获取` : '获取验证码'
})

const countdownProgress = computed(() => {
  // 计算圆环进度，从113.1 (2π*18) 到 0
  const circumference = 2 * Math.PI * 18
  const progress = (countdown.value / 60) * circumference
  return circumference - progress
})

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 方法
const handleClose = () => {
  emit('update:visible', false)
}

// 切换登录类型时添加动画效果
const switchLoginType = (type) => {
  if (loginType.value !== type) {
    loginType.value = type
  }
}

const getVerificationCode = async (type: 'phone' | 'email') => {
  try {
    let success = false

    if (type === 'phone') {
      await phoneFormRef.value.validateField('phone')
      // 发送手机验证码
      success = await userStore.sendVerificationCode('SMS', phoneForm.value.phone)
    } else {
      await emailFormRef.value.validateField('email')
      // 发送邮箱验证码
      success = await userStore.sendVerificationCode('EMAIL', emailForm.value.email)
    }

    if (success) {
      // 开始倒计时
      isGettingCode.value = true
      countdown.value = 60

      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          isGettingCode.value = false
        }
      }, 1000)

      ElMessage({
        message: '验证码已发送，请查收',
        type: 'success',
        duration: 2000
      })
    } else {
      ElMessage({
        message: userStore.error || '发送验证码失败，请稍后重试',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    // 表单验证失败，不做处理
  }
}

const handlePhoneLogin = async () => {
  try {
    await phoneFormRef.value.validate()
    isLoggingIn.value = true
    
    try {
      // 测试用户登录：手机号为123，验证码为123456
      if (phoneForm.value.phone === '123' && phoneForm.value.code === '123456') {
        // 模拟登录成功
        setTimeout(() => {
          isLoggingIn.value = false
          
          // 创建测试用户
          const testUser = {
            id: 123,
            username: '测试用户',
            avatar: '/default-avatar/1.png',
            email: 'test@example.com',
            phone: '123',
            bio: '这是一个测试账号，用于演示登录功能',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            reputation: 100,
            post_count: 5,
            comment_count: 10,
            is_admin: false,
            is_moderator: false,
            last_active_at: new Date().toISOString(),
            token: 'test-token-123'
          }
          
          // 使用store的login方法直接设置用户
          userStore.login(testUser)
          
          ElMessage({
            message: '测试用户登录成功',
            type: 'success',
            duration: 2000
          })
          emit('login-success')
          handleClose()
        }, 1000)
      } else {
        // 实际登录逻辑
        const success = await userStore.loginWithPhone(
          phoneForm.value.phone,
          phoneForm.value.code,
          phoneForm.value.rememberMe
        )

        isLoggingIn.value = false

        if (success) {
          ElMessage({
            message: '登录成功！',
            type: 'success',
            duration: 2000
          })
          emit('login-success')
          handleClose()
        } else {
          ElMessage({
            message: userStore.error || '登录失败，请检查手机号和验证码',
            type: 'error',
            duration: 3000
          })
        }
      }
    } catch (error) {
      isLoggingIn.value = false
      ElMessage.error('登录失败，请检查手机号和验证码是否正确')
    }
  } catch (error) {
    // 表单验证失败，不做处理
  }
}

const handleEmailLogin = async () => {
  try {
    await emailFormRef.value.validate()
    isLoggingIn.value = true
    
    try {
      // 测试用户登录：邮箱为test@example.com
      if (emailForm.value.email === 'test@example.com') {
        // 模拟登录成功
        setTimeout(() => {
          isLoggingIn.value = false
          
          // 创建测试用户
          const testUser = {
            id: 123,
            username: '测试用户',
            avatar: '/default-avatar/1.png',
            email: 'test@example.com',
            phone: '',
            bio: '这是一个测试账号，用于演示登录功能',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            reputation: 100,
            post_count: 5,
            comment_count: 10,
            is_admin: false,
            is_moderator: false,
            last_active_at: new Date().toISOString(),
            token: 'test-token-123'
          }
          
          // 使用store的login方法直接设置用户
          userStore.login(testUser)
          
          ElMessage({
            message: '测试用户登录成功',
            type: 'success',
            duration: 2000
          })
          emit('login-success')
          handleClose()
        }, 1000)
      } else {
        // 实际登录逻辑
        const success = await userStore.loginWithEmail(
          emailForm.value.email,
          emailForm.value.code,
          emailForm.value.rememberMe
        )

        isLoggingIn.value = false

        if (success) {
          ElMessage({
            message: '登录成功！',
            type: 'success',
            duration: 2000
          })
          emit('login-success')
          handleClose()
        } else {
          ElMessage({
            message: userStore.error || '登录失败，请检查邮箱和验证码',
            type: 'error',
            duration: 3000
          })
        }
      }
    } catch (error) {
      isLoggingIn.value = false
      ElMessage.error('登录失败，请检查邮箱和验证码是否正确')
    }
  } catch (error) {
    // 表单验证失败，不做处理
  }
}

// 处理中文输入法开始
const handleCompositionStart = () => {
  isComposing.value = true
}

// 处理中文输入法结束
const handleCompositionEnd = () => {
  isComposing.value = false
}
</script>

<style scoped>
/* 对话框样式优化 */
.login-modal :deep(.el-dialog__body) {
  padding: 0;
}

.login-modal :deep(.el-dialog__header) {
  display: none;
}

.login-modal :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-light);
  position: relative;
  z-index: 2001; /* 确保对话框在最上层 */
}

/* 修复中文输入法导致的遮挡问题 */
.login-modal-overlay {
  z-index: 2000 !important; /* 确保遮罩在对话框下方 */
}

:deep(.el-overlay) {
  z-index: 2000 !important;
}

:deep(.el-overlay-dialog) {
  position: relative;
  z-index: 2001 !important;
}

/* 登录容器 */
.login-container {
  display: flex;
  width: 100%;
  height: 460px;
}

/* 左侧信息区域样式优化 */
.login-info {
  flex: 1;
  padding: 50px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, var(--primary-color) 10%, var(--primary-hover) 100%);
  overflow: hidden;
  min-width: 300px;
}

.brand {
  text-align: center;
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
}

.brand-name {
  font-size: 32px;
  margin: 0 0 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeInDown 0.8s;
  color: white;
}

.brand-slogan {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s;
}

.info-content {
  margin-top: 0;
  position: relative;
  z-index: 2;
  animation: fadeIn 1s;
}

.info-content p {
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 装饰元素 */
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: white;
}

.circle-1 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  right: -100px;
  animation: pulse 15s infinite alternate;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -50px;
  animation: pulse 10s infinite alternate-reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: -75px;
  animation: pulse 8s infinite alternate;
}

.floating-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  animation: floatingDots 20s infinite linear;
}

.floating-dots::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: 10px 10px;
  animation: floatingDots 15s infinite linear reverse;
}

/* 右侧登录表单样式优化 */
.login-form {
  flex: 2;
  padding: 50px 60px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-title {
  text-align: center;
  margin: 0 0 30px;
  font-size: 26px;
  color: #333;
  font-weight: 600;
}

.login-tabs {
  display: flex;
  margin-bottom: 35px;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: all 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.6;
  transition: all 0.3s;
}

.phone-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16z'/%3E%3Cpath d='M12 19c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z'/%3E%3C/svg%3E");
}

.email-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z'/%3E%3C/svg%3E");
}

.tab-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  animation: slideIn 0.3s ease;
}

.tab-item.active .tab-icon {
  opacity: 1;
}

.tab-item.active .phone-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F9A826'%3E%3Cpath d='M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16z'/%3E%3Cpath d='M12 19c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z'/%3E%3C/svg%3E");
}

.tab-item.active .email-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F9A826'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z'/%3E%3C/svg%3E");
}

.form-content {
  margin-top: 20px;
  flex: 1;
}

/* 表单元素样式优化 */
.verification-code {
  display: flex;
  gap: 12px;
}

.verification-code .el-input {
  flex: 1;
}

.code-button {
  width: 130px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
}

.code-button.is-getting {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.countdown-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
}

.countdown-number {
  position: relative;
  z-index: 2;
  font-size: 15px;
  font-weight: bold;
}

.countdown-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 26px;
  height: 26px;
  transform: rotate(-90deg);
}

.countdown-circle circle {
  stroke: white;
  stroke-dasharray: 113.1;
  transition: stroke-dashoffset 1s linear;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-top: 15px;
  transition: all 0.3s;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(230, 126, 34, 0.2);
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.submit-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.submit-btn:hover::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

/* 表单元素样式优化 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 0 15px;
  height: 44px;
  transition: all 0.3s;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color), 0 3px 8px rgba(249, 168, 38, 0.1);
  transform: translateY(-1px);
}

:deep(.el-input__inner) {
  color: #333;
  font-size: 15px;
}

:deep(.el-input__prefix) {
  margin-right: 8px;
}

:deep(.el-input__prefix-inner svg) {
  width: 18px;
  height: 18px;
}

:deep(.el-input__inner::placeholder) {
  color: #aaa;
  transition: all 0.3s;
}

:deep(.el-input__wrapper.is-focus .el-input__inner::placeholder) {
  opacity: 0.7;
}

:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger);
}

:deep(.el-form-item__error) {
  padding-top: 4px;
  font-size: 12px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes floatingDots {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 20px;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-modal :deep(.el-dialog) {
    width: 95% !important;
    margin-top: 10vh;
  }
  
  .login-container {
    flex-direction: column;
    height: auto;
  }
  
  .login-info {
    padding: 40px 30px;
    min-height: 200px;
  }
  
  .login-form {
    padding: 40px 30px;
  }
  
  .brand {
    margin-bottom: 20px;
  }
  
  .form-title {
    margin-bottom: 25px;
  }
  
  .login-tabs {
    margin-bottom: 25px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

/* 修复表单按钮样式 */
:deep(.el-button--primary) {
  --el-button-active-bg-color: var(--primary-dark);
  --el-button-active-border-color: var(--primary-dark);
  --el-button-active-text-color: var(--white);
  --el-button-focus-bg-color: var(--primary-color);
  --el-button-focus-border-color: var(--primary-color);
}

.code-button:active,
.code-button:focus {
  background-color: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
  color: var(--white) !important;
}

.code-button.is-getting {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}
</style> 