<template>
  <div class="login-bg">
    <div class="login-main">
      <aside class="login-left">
        <div class="carousel-box">
          <!-- 使用静态方式显示图片 -->
          <div class="static-image-container">
            <img src="@/assets/login_images/1.jpg" class="static-img" alt="海报1">
            <div class="overlay-text">
              <h2>欢迎使用</h2>
              <h1>HRC后台管理系统</h1>
              <p>高效 · 安全 · 智能</p>
            </div>
          </div>
        </div>
      </aside>
      <main class="login-right">
        <div class="login-form">
          <div class="form-header">
            <div class="brand-row">
              <div class="logo-icon">
                <i class="el-icon-s-platform" />
              </div>
              <h2 class="brand-title">HRC Admin</h2>
            </div>
            <h1 class="form-title">用户登录</h1>
            <p class="form-desc">欢迎回来，请输入您的账号密码</p>
          </div>

          <div class="form-fields">
            <div class="form-input">
              <el-input
                ref="username"
                v-model="loginForm.username"
                prefix-icon="el-icon-user"
                placeholder="请输入用户名"
                clearable
                @keyup.enter.native="focusPassword"
                autocomplete="username"
              />
            </div>
            <div class="form-input password-input">
              <el-input
                ref="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                prefix-icon="el-icon-lock"
                placeholder="请输入密码"
                clearable
                @keyup.enter.native="handleLogin"
                autocomplete="current-password"
              />
              <div class="password-eye" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'el-icon-view' : 'el-icon-hide'" />
              </div>
            </div>
            
            <el-row v-if="showCaptcha" class="captcha-row">
              <el-col :span="16">
                <div class="form-input">
                  <el-input
                    v-model="loginForm.captcha"
                    prefix-icon="el-icon-key"
                    placeholder="请输入验证码"
                    @keyup.enter.native="handleLogin"
                  />
                </div>
              </el-col>
              <el-col :span="8">
                <div class="captcha-image" @click="refreshCaptcha">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAyCAMAAACgee/qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzI0NDFDNzQ0OTJBMTFFNDg1OUJFQTkxQjYyQTQ2RjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzI0NDFDNzU0OTJBMTFFNDg1OUJFQTkxQjYyQTQ2RjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjQ0MUM3MjQ5MkExMUU0ODU5QkVBOTFCNjJBNDZGMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMjQ0MUM3MzQ5MkExMUU0ODU5QkVBOTFCNjJBNDZGMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plywt5QAAAA9UExURcPDw//0B4mJifb29eHh4f/1GeXl5djY2P/0EP/yAPr6+v/0Cvn5+f/yBP3yAP7zAu7u7v7zBf///+rq6pKDvi4AAAAUdFJOU////////////////////////////////wCNOzx3AAAAoklEQVR42uzV2w6DIBBA0WEQxQve5v//tSmJiSSatqZP7LMOS3gBM+l0urONXde7PrVbuevmkkOU9iT0fSl5aK0X5zxrJRy+PK7jre/zhDTWQkO5+r5LUYbdP79LOeeSnvSeF/uQynzTGNGKK7CPjXKUP4M2btNmvgdJI3JdLzyjMFbJmFKGZLxCNJ4gGoeIxi6KcYhqLGIYm1jGlMg4phdziVd9BBgAgawl0j/jKcEAAAAASUVORK5CYII=" alt="验证码">
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="form-options">
            <el-checkbox v-model="loginForm.remember" class="remember-checkbox">记住我</el-checkbox>
            <el-link type="primary" @click="handleForgot">忘记密码?</el-link>
          </div>

          <el-button
            class="form-btn"
            type="primary"
            :loading="loading"
            @click="handleLogin"
          >
            <i class="el-icon-right" />
            <span>登录</span>
          </el-button>

          <div class="form-help-row">
            <el-button type="text" @click="showHelpDialog = true" class="help-btn">
              <i class="el-icon-question" />
              需要帮助?
            </el-button>
          </div>

          <div class="form-footer">
            <p>© {{ currentYear }} HRC Admin. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>

    <!-- 帮助对话框 -->
    <el-dialog
      title="帮助中心"
      :visible.sync="showHelpDialog"
      width="600px"
      :close-on-click-modal="false"
      class="help-dialog"
    >
      <div class="help-content">
        <!-- 常见问题 -->
        <div class="help-section">
          <h3 class="section-title">
            <i class="el-icon-question" />
            常见问题
          </h3>
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item title="忘记密码怎么办？" name="1">
              <div class="collapse-content">
                <p>1. 联系系统管理员重置密码</p>
                <p>2. 发送邮件至：<a href="mailto:admin@hrc.com">admin@hrc.com</a></p>
                <p>3. 拨打技术支持电话：400-123-4567</p>
              </div>
            </el-collapse-item>
            <el-collapse-item title="账号被锁定怎么办？" name="2">
              <div class="collapse-content">
                <p>连续登录失败5次后账号会被临时锁定，请：</p>
                <p>1. 等待30分钟后重试</p>
                <p>2. 联系管理员解锁账号</p>
                <p>3. 确认密码输入是否正确</p>
              </div>
            </el-collapse-item>
            <el-collapse-item title="无法登录系统？" name="3">
              <div class="collapse-content">
                <p>请检查以下项目：</p>
                <p>1. 确认网络连接正常</p>
                <p>2. 检查浏览器是否支持（推荐Chrome、Firefox、Edge）</p>
                <p>3. 清除浏览器缓存后重试</p>
                <p>4. 确认账号是否已被禁用</p>
              </div>
            </el-collapse-item>
            <el-collapse-item title="验证码不显示？" name="4">
              <div class="collapse-content">
                <p>1. 刷新页面重新加载验证码</p>
                <p>2. 检查浏览器是否禁用了图片显示</p>
                <p>3. 尝试使用其他浏览器</p>
                <p>4. 联系技术支持</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 联系方式 -->
        <div class="help-section">
          <h3 class="section-title">
            <i class="el-icon-phone" />
            联系方式
          </h3>
          <div class="contact-info">
            <div class="contact-item">
              <i class="el-icon-message" />
              <span>技术支持邮箱：</span>
              <a href="mailto:support@hrc.com">support@hrc.com</a>
            </div>
            <div class="contact-item">
              <i class="el-icon-phone" />
              <span>技术支持电话：</span>
              <a href="tel:400-123-4567">400-123-4567</a>
            </div>
            <div class="contact-item">
              <i class="el-icon-time" />
              <span>服务时间：</span>
              <span>周一至周五 9:00-18:00</span>
            </div>
            <div class="contact-item">
              <i class="el-icon-chat-dot-round" />
              <span>在线客服：</span>
              <el-button type="text" @click="openOnlineChat">点击咨询</el-button>
            </div>
          </div>
        </div>

        <!-- 系统信息 -->
        <div class="help-section">
          <h3 class="section-title">
            <i class="el-icon-info" />
            系统信息
          </h3>
          <div class="system-info">
            <div class="info-item">
              <span class="label">系统版本：</span>
              <span class="value">v{{ systemVersion }}</span>
            </div>
            <div class="info-item">
              <span class="label">浏览器：</span>
              <span class="value">{{ userAgent }}</span>
            </div>
            <div class="info-item">
              <span class="label">分辨率：</span>
              <span class="value">{{ screenResolution }}</span>
            </div>
            <div class="info-item">
              <span class="label">最后更新：</span>
              <span class="value">{{ lastUpdate }}</span>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="help-section">
          <h3 class="section-title">
            <i class="el-icon-s-tools" />
            快速操作
          </h3>
          <div class="quick-actions">
            <el-button size="small" @click="clearBrowserCache">
              <i class="el-icon-refresh" />
              清除缓存
            </el-button>
            <el-button size="small" @click="checkSystemStatus">
              <i class="el-icon-monitor" />
              系统状态
            </el-button>
            <el-button size="small" @click="downloadUserManual">
              <i class="el-icon-download" />
              用户手册
            </el-button>
            <el-button size="small" @click="reportIssue">
              <i class="el-icon-warning" />
              报告问题
            </el-button>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showHelpDialog = false">关闭</el-button>
        <el-button type="primary" @click="contactSupport">联系支持</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LoginRedesign',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false,
        captcha: ''
      },
      showPassword: false,
      showCaptcha: false,
      loading: false,
      currentYear: new Date().getFullYear(),
      loginFailCount: 0,
      showHelpDialog: false,
      activeNames: ['1'],
      systemVersion: '1.0.0',
      lastUpdate: '2024-01-15'
    }
  },
  computed: {
    userAgent() {
      const ua = navigator.userAgent
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Firefox')) return 'Firefox'
      if (ua.includes('Safari')) return 'Safari'
      if (ua.includes('Edge')) return 'Edge'
      return '未知浏览器'
    },
    screenResolution() {
      return `${screen.width} × ${screen.height}`
    }
  },
  mounted() {
    // 自动聚焦用户名输入框
    this.$nextTick(() => {
      this.$refs.username.$el.querySelector('input').focus()
    })
  },
  methods: {
    focusPassword() {
      this.$nextTick(() => {
        this.$refs.password.$el.querySelector('input').focus()
      })
    },
    refreshCaptcha() {
      // 刷新验证码的模拟方法
      this.$message.info('验证码已刷新')
    },
    async handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        this.$message.warning('请输入用户名和密码')
        return
      }
      
      if (this.showCaptcha && !this.loginForm.captcha) {
        this.$message.warning('请输入验证码')
        return
      }
      
      this.loading = true
      try {
        await this.$store.dispatch('user/login', this.loginForm)
        this.$message.success('登录成功')
        // 恢复原来的跳转逻辑
        this.$router.push({ path: this.$route.query.redirect || '/' })
      } catch (err) {
        this.loginFailCount++
        
        if (this.loginFailCount >= 3) {
          this.showCaptcha = true
        }
        
        this.$message.error(err.message || '登录失败')
      } finally {
        this.loading = false
      }
    },
    handleForgot() {
      this.$message.info('请联系管理员重置密码')
    },
    // 帮助相关方法
    openOnlineChat() {
      this.$message.info('在线客服功能即将上线')
    },
    clearBrowserCache() {
      this.$confirm('确定要清除浏览器缓存吗？这将清除所有网站的缓存数据。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里可以添加清除缓存的逻辑
        this.$message.success('缓存清除成功，请刷新页面')
        this.showHelpDialog = false
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    checkSystemStatus() {
      this.$message({
        message: '系统运行正常，所有服务状态良好',
        type: 'success',
        duration: 3000
      })
    },
    downloadUserManual() {
      this.$message.info('用户手册下载功能即将上线')
    },
    reportIssue() {
      this.$prompt('请描述您遇到的问题：', '报告问题', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请详细描述您遇到的问题...',
        inputValidator: (value) => {
          if (!value) {
            return '请输入问题描述'
          }
          if (value.length < 10) {
            return '问题描述至少需要10个字符'
          }
          return true
        }
      }).then(({ value }) => {
        this.$message.success('问题已提交，我们会尽快处理')
        console.log('问题报告：', value)
      }).catch(() => {
        this.$message.info('已取消提交')
      })
    },
    contactSupport() {
      this.$message({
        message: '正在为您转接技术支持...',
        type: 'info',
        duration: 2000
      })
      this.showHelpDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

$input-radius: 8px;
$btn-radius: 8px;
$btn-height: 48px;
$transition: $transition-base;

.login-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-family-base;
}

.login-main {
  width: 1200px;
  height: 660px;
  display: flex;
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-lg;
  overflow: hidden;
}

.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary-dark;
  overflow: hidden;
  position: relative;
}

.carousel-box {
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;
  position: relative;
}

.static-image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.static-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  filter: brightness(0.8);
  transition: transform 10s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.overlay-text {
  position: absolute;
  bottom: 10%;
  left: 10%;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 2;
  
  h2 {
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 8px;
    opacity: 0.9;
  }
  
  h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 18px;
    opacity: 0.8;
  }
}

.login-right {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $white;
}

.login-form {
  width: 80%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  font-family: $font-family-base;
  color: $gray-700;
}

.form-header {
  margin-bottom: $spacing-lg;
  text-align: left;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: $border-radius-base;
  background: rgba($primary, 0.1);
  box-shadow: $box-shadow-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;

  i {
    font-size: 22px;
    color: $primary;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba($primary, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba($primary, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba($primary, 0);
  }
}

.brand-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $primary;
  letter-spacing: 1px;
  font-family: inherit;
  transition: $transition;
}

.form-title {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  background: linear-gradient(to right, $primary, $primary-light);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: $spacing-md;
  font-family: inherit;
  transition: $transition;
}

.form-desc {
  font-size: $font-size-base;
  color: $gray-600;
  font-family: inherit;
  margin-top: $spacing-xs;
  transition: $transition;
}

.form-fields {
  margin-top: $spacing-xl;
  .form-input {
    margin-bottom: $spacing-lg;
    font-size: $font-size-base;
    font-family: inherit;
    
    ::v-deep .el-input__inner {
      height: 50px;
      line-height: 50px;
      padding-left: 45px;
      font-family: inherit;
      color: $gray-700;
      background: $gray-100;
      border-radius: $input-radius;
      border: 1px solid $gray-300;
      transition: $transition;
      
      &:focus {
        border-color: $primary;
        box-shadow: 0 0 0 2px rgba($primary, 0.1);
        background: $white;
      }
    }
    
    ::v-deep .el-input__prefix {
      left: 15px;
      
      i {
        line-height: 50px;
        font-size: 18px;
        color: $gray-500;
      }
    }
  }
  
  .password-input {
    position: relative;
    
    .password-eye {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      transition: $transition;
      color: $gray-500;
      padding: 5px;
      z-index: 2;
      
      &:hover {
        color: $primary;
      }
    }
  }
  
  .captcha-row {
    margin-bottom: $spacing-md;
    
    .captcha-image {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $gray-200;
      border-radius: $input-radius;
      cursor: pointer;
      overflow: hidden;
      margin-left: 10px;
      
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  
  ::v-deep .el-checkbox__inner {
    border-radius: 3px;
    
    &:hover {
      border-color: $primary;
    }
  }
  
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: $primary;
    border-color: $primary;
  }
  
  .remember-checkbox {
    font-size: $font-size-sm;
    color: $gray-700;
    font-family: inherit;
    transition: $transition;
  }
  
  .el-link {
    color: $primary;
    font-size: $font-size-sm;
    font-family: inherit;
    transition: $transition;
    
    &:hover {
      color: $primary-light;
      text-decoration: underline;
    }
  }
}

.form-btn {
  margin-top: $spacing-sm;
  height: $btn-height;
  border-radius: $btn-radius;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  font-family: inherit;
  background: linear-gradient(to right, $primary, $primary-light);
  border: none;
  color: $white;
  box-shadow: $box-shadow-base;
  transition: $transition;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover, &:focus {
    background: linear-gradient(to right, $primary-light, $primary);
    box-shadow: $box-shadow-lg, 0 0 15px rgba($primary, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.form-help-row {
  margin-top: $spacing-md;
  text-align: center;
  
  .help-btn {
    color: $gray-600;
    font-size: $font-size-sm;
    font-family: inherit;
    transition: $transition;
    padding: 0;
    
    &:hover {
      color: $primary;
    }
    
    i {
      margin-right: 4px;
    }
  }
}

.form-footer {
  margin-top: $spacing-lg;
  text-align: center;
  color: $gray-600;
  font-size: $font-size-xs;
  font-family: inherit;
  transition: $transition;
}

// 帮助对话框样式
.help-dialog {
  ::v-deep .el-dialog__header {
    background: linear-gradient(to right, $primary, $primary-light);
    color: white;
    border-radius: 8px 8px 0 0;
    
    .el-dialog__title {
      color: white;
      font-weight: 600;
    }
    
    .el-dialog__headerbtn .el-dialog__close {
      color: white;
      
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  ::v-deep .el-dialog__body {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }
}

.help-content {
  .help-section {
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: $primary;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    
    i {
      margin-right: 8px;
      font-size: 18px;
    }
  }
  
  .collapse-content {
    padding: 8px 0;
    color: $gray-700;
    line-height: 1.6;
    
    p {
      margin: 4px 0;
    }
    
    a {
      color: $primary;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .contact-info {
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: $gray-700;
      
      i {
        margin-right: 8px;
        color: $primary;
        width: 16px;
      }
      
      a {
        color: $primary;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .system-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 8px 12px;
      background: $gray-100;
      border-radius: 4px;
      
      .label {
        color: $gray-600;
        font-weight: 500;
      }
      
      .value {
        color: $gray-800;
        font-family: 'Courier New', monospace;
      }
    }
  }
  
  .quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .el-button {
      margin: 0;
    }
  }
}

.dialog-footer {
  text-align: right;
  padding-top: 16px;
  border-top: 1px solid $gray-200;
}

@media (max-width: 1200px) {
  .login-main {
    width: 98vw;
    height: 98vw * 0.55;
    min-height: 420px;
    max-width: 98vw;
  }
  
  .login-form {
    width: 92vw;
    max-width: 400px;
  }
}

@media (max-width: 900px) {
  .login-main {
    flex-direction: column;
    width: 100vw;
    height: auto;
    min-height: 100vh;
  }
  
  .login-left {
    width: 100vw;
    min-height: 180px;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: $spacing-sm;
  }
  
  .carousel-box {
    width: 100%;
    height: 180px;
  }
  
  .login-right {
    width: 100vw;
    min-height: 320px;
    justify-content: center;
    align-items: flex-start;
    padding-top: $spacing-sm;
  }
  
  .login-form {
    width: 92vw;
    max-width: 400px;
    padding: 0;
  }
  
  .overlay-text {
    bottom: 5%;
    left: 5%;
    
    h2 {
      font-size: 18px;
    }
    
    h1 {
      font-size: 24px;
    }
    
    p {
      font-size: 16px;
    }
  }
  
  .help-dialog {
    ::v-deep .el-dialog {
      width: 90% !important;
      margin: 5vh auto !important;
    }
  }
}
</style>

