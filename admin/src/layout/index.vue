<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    background-color: $gray-100;

    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .main-container {
    min-height: 100%;
    transition: margin-left $transition-base;
    margin-left: $sideBarWidth;
    position: relative;
  }

  .sidebar-container {
    transition: width $transition-base;
    width: $sideBarWidth !important;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width $transition-base;
    background-color: rgba($white, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .hideSidebar {
    .main-container {
      margin-left: 54px;
    }

    .sidebar-container {
      width: 54px !important;
    }

    .fixed-header {
      width: calc(100% - 54px);
    }
  }

  .mobile {
    .main-container {
      margin-left: 0;
    }

    .sidebar-container {
      transition: transform $transition-base;
      width: $sideBarWidth !important;
    }

    &.openSidebar {
      position: fixed;
      top: 0;

      .sidebar-container {
        transition-duration: 0.3s;
        transform: translateX(0);
      }
    }

    &.hideSidebar {
      .sidebar-container {
        transition-duration: 0.3s;
        transform: translateX(-$sideBarWidth);
      }
    }

    .fixed-header {
      width: 100%;
    }
  }

  .withoutAnimation {
    .main-container,
    .sidebar-container {
      transition: none;
    }
  }
</style>
