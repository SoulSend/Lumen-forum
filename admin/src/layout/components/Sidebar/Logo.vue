<template>
  <div class="sidebar-header" :class="{'collapse':collapse}">
    <div class="header-content">
      <i class="el-icon-s-management" />
      <h1 v-if="!collapse" class="system-title">企业管理系统</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.sidebar-header {
  height: 60px;
  background: $white;
  overflow: hidden;
  position: relative;
  z-index: 2;
  border-bottom: 1px solid $gray-200;
  display: flex;
  align-items: center;
  justify-content: center;

  &.collapse {
    i {
      margin: 0;
    }
  }

  .header-content {
    display: flex;
    align-items: center;
    padding: 0 16px;
    width: 100%;

    i {
      font-size: 18px;
      color: $primary;
      margin-right: 12px;
    }

    .system-title {
      margin: 0;
      padding: 0;
      color: $gray-800;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      letter-spacing: 0.5px;
    }
  }
}
</style>
