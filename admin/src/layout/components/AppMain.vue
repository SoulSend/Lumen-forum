<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView ? this.$store.state.tagsView.cachedViews : []
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.app-main {
  min-height: calc(100vh - #{$navbarHeight});
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: $spacing-lg;
  background-color: $gray-100;
}

.fixed-header + .app-main {
  padding-top: calc(#{$navbarHeight} + #{$spacing-lg});
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>

<style lang="scss">
@import "@/styles/variables.scss";

// 全局样式优化
body {
  font-family: $font-family-base;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $gray-800;
  background-color: $gray-100;
  font-size: $font-size-base;
  line-height: 1.5;
}

// 卡片样式统一
.el-card {
  border-radius: $border-radius-base;
  border: none;
  box-shadow: $box-shadow-sm !important;
  margin-bottom: $spacing-lg;
  overflow: hidden;

  .el-card__header {
    padding: $spacing-md $spacing-lg;
    font-weight: $font-weight-semibold;
    color: $gray-800;
    border-bottom: 1px solid $gray-200;
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background: $primary;
      border-radius: 2px;
      margin-right: $spacing-sm;
      vertical-align: middle;
    }
  }

  .el-card__body {
    padding: $spacing-lg;
    background-color: $white;
  }
}

// 按钮样式统一
.el-button--primary {
  background-color: $primary;
  border-color: $primary;
  color: $white;
  box-shadow: $box-shadow-sm;
  transition: $transition-base;

  &:hover, &:focus {
    background-color: $primary-light;
    border-color: $primary-light;
    box-shadow: $box-shadow-base;
  }

  &.is-plain {
    background-color: transparent;
    border: 1px solid $primary;
    color: $primary;

    &:hover, &:focus {
      background-color: rgba($primary, 0.05);
      color: $primary-light;
      border-color: $primary-light;
    }
  }
}

.el-button--success {
  background-color: $success;
  border-color: $success;

  &:hover, &:focus {
    background-color: $success-light;
    border-color: $success-light;
  }
}

.el-button--danger {
  background-color: $danger;
  border-color: $danger;

  &:hover, &:focus {
    background-color: $danger-light;
    border-color: $danger-light;
  }
}

.el-button--warning {
  background-color: $warning;
  border-color: $warning;

  &:hover, &:focus {
    background-color: $warning-light;
    border-color: $warning-light;
  }
}

.el-button--info {
  background-color: $info;
  border-color: $info;

  &:hover, &:focus {
    background-color: $info-light;
    border-color: $info-light;
  }
}

// 表单样式统一
.el-form-item__label {
  font-weight: $font-weight-medium;
  color: $gray-700;
}

.el-input__inner,
.el-textarea__inner {
  border-radius: $border-radius-base;
  border: 1px solid $gray-300;
  transition: $transition-base;

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba($primary, 0.1);
  }
}

// 表格样式统一
.el-table {
  border-radius: $border-radius-base;
  overflow: hidden;

  th {
    background-color: $gray-100 !important;
    color: $gray-800;
    font-weight: $font-weight-semibold;
    padding: $spacing-md 0;
  }

  td {
    padding: $spacing-md 0;
    color: $gray-700;
  }

  .el-table__row:hover > td {
    background-color: rgba($primary, 0.03);
  }
}

// 分页样式统一
.el-pagination {
  margin-top: $spacing-lg;
  text-align: right;

  .el-pagination__sizes .el-input .el-input__inner,
  .btn-prev, .btn-next, .el-pager li {
    border-radius: $border-radius-sm;
    transition: $transition-base;
  }

  .el-pager li.active {
    background-color: $primary;
    color: $white;
    font-weight: $font-weight-semibold;
  }
}

// 对话框样式统一
.el-dialog {
  border-radius: $border-radius-base;
  overflow: hidden;
  box-shadow: $box-shadow-lg;

  .el-dialog__header {
    padding: $spacing-md $spacing-lg;
    background-color: $primary;

    .el-dialog__title {
      color: $white;
      font-weight: $font-weight-semibold;
      font-size: $font-size-lg;
    }

    .el-dialog__headerbtn {
      top: $spacing-md;

      .el-dialog__close {
        color: rgba($white, 0.9);

        &:hover {
          color: $white;
        }
      }
    }
  }

  .el-dialog__body {
    padding: $spacing-lg;
  }

  .el-dialog__footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $gray-200;
  }
}

// 标签样式统一
.el-tag {
  border-radius: $border-radius-sm;

  &.el-tag--primary {
    background-color: rgba($primary, 0.1);
    border-color: rgba($primary, 0.2);
    color: $primary;
  }

  &.el-tag--success {
    background-color: rgba($success, 0.1);
    border-color: rgba($success, 0.2);
    color: $success;
  }

  &.el-tag--warning {
    background-color: rgba($warning, 0.1);
    border-color: rgba($warning, 0.2);
    color: $warning;
  }

  &.el-tag--danger {
    background-color: rgba($danger, 0.1);
    border-color: rgba($danger, 0.2);
    color: $danger;
  }

  &.el-tag--info {
    background-color: rgba($info, 0.1);
    border-color: rgba($info, 0.2);
    color: $info;
  }
}

// 全局页面容器
.page-container {
  background-color: $white;
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;

  .page-header {
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $gray-200;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .page-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $gray-800;
      margin: 0;
      display: flex;
      align-items: center;

      &:before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 18px;
        background: $primary;
        border-radius: 2px;
        margin-right: $spacing-sm;
      }
    }
  }
}
</style>
