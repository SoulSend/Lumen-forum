<template>
  <div class="navbar">
    <div class="navbar-left">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <div class="logo-container" v-if="!sidebar.opened">
        <img src="@/assets/login_images/1.jpg" class="logo-image" alt="Logo">
        <span class="logo-text">HRC系统</span>
      </div>
      <breadcrumb class="breadcrumb-container" />
    </div>

    <div class="right-menu">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索..."
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="handleSearch"
        />
      </div>

      <el-tooltip content="消息通知" effect="dark" placement="bottom">
        <div class="right-menu-item notice-item">
          <el-badge :value="unreadNoticeCount" class="notice-badge">
            <i class="el-icon-bell" />
          </el-badge>
        </div>
      </el-tooltip>

      <el-tooltip content="全屏" effect="dark" placement="bottom">
        <div class="right-menu-item fullscreen-item" @click="toggleFullScreen">
          <i class="el-icon-full-screen" />
        </div>
      </el-tooltip>

      <el-tooltip content="主题" effect="dark" placement="bottom">
        <div class="right-menu-item theme-item" @click="toggleTheme">
          <i class="el-icon-brush" />
        </div>
      </el-tooltip>

      <el-tooltip content="帮助中心" effect="dark" placement="bottom">
        <div class="right-menu-item help-item" @click="showHelp">
          <i class="el-icon-question" />
        </div>
      </el-tooltip>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              <i class="el-icon-user" />
              个人中心
            </el-dropdown-item>
          </router-link>
          <router-link to="/notice/index">
            <el-dropdown-item>
              <i class="el-icon-bell" />
              通知中心
            </el-dropdown-item>
          </router-link>
          <router-link to="/setting/index">
            <el-dropdown-item>
              <i class="el-icon-setting" />
              系统设置
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">
              <i class="el-icon-switch-button" />
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      searchQuery: '',
      isDarkTheme: false,
      unreadNoticeCount: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'roles',
      'nickname',
      'username'
    ]),
    userRole() {
      if (this.roles && this.roles.length > 0) {
        if (this.roles.includes('admin')) {
          return '超级管理员'
        } else if (this.roles.includes('user')) {
          return '普通用户'
        } else {
          return this.roles[0]
        }
      }
      return '访客'
    }
  },
  created() {
    // 这里可以添加获取未读消息数量的逻辑
    this.fetchUnreadNoticeCount()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      try {
        await this.$store.dispatch('user/logout')
        this.$message.success('退出登录成功')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      } catch (error) {
        this.$message.error('退出登录失败，请重试')
        console.error('登出失败:', error)
      }
    },
    handleSearch() {
      if (this.searchQuery) {
        this.$message.info(`搜索: ${this.searchQuery}`)
        this.searchQuery = ''
      }
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          this.$message.error(`全屏切换失败: ${err.message}`)
        })
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    },
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
      document.body.classList.toggle('dark-theme', this.isDarkTheme)
      // 保存主题设置到本地存储
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light')
      this.$message.success(`已切换到${this.isDarkTheme ? '深色' : '浅色'}主题`)
    },
    showHelp() {
      this.$message({
        message: '帮助中心即将上线',
        type: 'info'
      })
    },
    fetchUnreadNoticeCount() {
      // 模拟获取未读消息数量
      // 实际项目中，这里应该调用API获取未读消息数量
      setTimeout(() => {
        this.unreadNoticeCount = Math.floor(Math.random() * 10)
      }, 1000)
    }
  },
  mounted() {
    // 初始化主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      this.isDarkTheme = true
      document.body.classList.add('dark-theme')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.navbar {
  height: $navbarHeight;
  overflow: hidden;
  position: relative;
  background: $white;
  box-shadow: $box-shadow-base;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-md;
  transition: all 0.3s;
  color: $gray-700;

  .navbar-left {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .logo-container {
    display: flex;
    align-items: center;
    margin-right: $spacing-md;
    
    .logo-image {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      margin-right: $spacing-xs;
      object-fit: cover;
      box-shadow: $box-shadow-sm;
    }
    
    .logo-text {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $primary;
      letter-spacing: 1px;
    }
  }

  .hamburger-container {
    line-height: $navbarHeight;
    height: $navbarHeight;
    display: flex;
    align-items: center;
    padding: 0 $spacing-md;
    margin-left: -$spacing-md;
    cursor: pointer;
    transition: $transition-base;
    color: $gray-700;

    &:hover {
      background: rgba($primary, 0.05);
      color: $primary;
    }
  }

  .breadcrumb-container {
    margin-left: $spacing-md;
    line-height: $navbarHeight;

    ::v-deep .el-breadcrumb__inner {
      color: $gray-600;
      font-weight: $font-weight-normal;

      &.is-link {
        color: $primary;
        font-weight: $font-weight-medium;

        &:hover {
          color: $primary-light;
        }
      }
    }

    ::v-deep .el-breadcrumb__separator {
      color: $gray-500;
    }
  }

  .right-menu {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;

    .search-container {
      margin-right: $spacing-md;
      width: 220px;

      .el-input {
        ::v-deep .el-input__inner {
          height: 36px;
          border-radius: 18px;
          background: $gray-100;
          border: 1px solid $gray-200;
          transition: $transition-base;
          padding-left: 36px;
          color: $gray-700;

          &::placeholder {
            color: $gray-500;
          }

          &:focus {
            background: $white;
            border-color: $primary-light;
            box-shadow: 0 0 0 2px rgba($primary, 0.1);
          }
        }

        ::v-deep .el-input__prefix {
          left: 12px;

          .el-input__icon {
            line-height: 36px;
            color: $gray-500;
          }
        }

        ::v-deep .el-input__suffix {
          right: 12px;
          
          .el-input__icon {
            color: $gray-500;
          }
        }
      }
    }

    .right-menu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      color: $gray-700;
      font-size: 18px;
      border-radius: $border-radius-base;
      margin: 0 $spacing-xs;
      cursor: pointer;
      transition: $transition-base;
      position: relative;
      overflow: hidden;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba($primary, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
      }

      &:hover {
        background: rgba($primary, 0.05);
        color: $primary;
        transform: translateY(-2px);
        
        &:after {
          animation: ripple 1s ease-out;
        }
      }
    }

    .notice-item {
      position: relative;

      .notice-badge {
        ::v-deep .el-badge__content {
          background-color: $secondary;
          box-shadow: 0 0 0 2px $white;
        }
      }
    }

    .avatar-container {
      margin-left: $spacing-md;
      cursor: pointer;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        padding: $spacing-xs $spacing-sm;
        border-radius: $border-radius-base;
        transition: $transition-base;

        &:hover {
          background: rgba($primary, 0.05);

          .el-icon-caret-bottom {
            transform: rotate(180deg);
          }
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: $box-shadow-sm;
          transition: $transition-base;
          border: 2px solid $white;

          &:hover {
            box-shadow: $box-shadow-base;
            transform: scale(1.05);
          }
        }

        .el-icon-caret-bottom {
          margin-left: $spacing-sm;
          font-size: 12px;
          color: $gray-600;
          transition: $transition-base;
        }
      }
    }
  }
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

::v-deep .user-dropdown {
  margin-top: $spacing-sm;
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-base;
  border: none;
  overflow: hidden;

  .el-dropdown-menu__item {
    padding: $spacing-sm $spacing-md;
    line-height: 1.5;
    display: flex;
    align-items: center;

    i {
      margin-right: $spacing-sm;
      font-size: 16px;
      color: $gray-600;
    }

    &:hover {
      background-color: rgba($primary, 0.05);
      color: $primary;

      i {
        color: $primary;
      }
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 $spacing-sm;

    .logo-container {
      display: none;
    }

    .breadcrumb-container {
      margin-left: $spacing-xs;
    }

    .search-container {
      display: none;
    }

    .right-menu {
      .right-menu-item {
        margin: 0 2px;
      }

      .theme-item, .help-item {
        display: none;
      }

      .avatar-container {
        margin-left: $spacing-xs;

        .avatar-wrapper {
          padding: $spacing-xs;

          .user-info {
            display: none;
          }
        }
      }
    }
  }
}
</style>
