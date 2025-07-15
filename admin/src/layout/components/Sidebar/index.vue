<template>
  <div class="sidebar-container" :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="menu-wrapper">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.sidebar-container {
  background-color: $white;
  display: flex;
  flex-direction: column;
  height: 100%;

  .menu-wrapper {
    flex: 1;
    overflow: hidden;
  }

  .el-scrollbar {
    height: 100%;
    background: $white;

    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }

    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }
  }

  .el-menu {
    border-right: none;

    .el-menu-item, .el-submenu__title {
      height: 48px;
      line-height: 48px;
      color: $gray-700;
      position: relative;
      margin: 2px 0;
      padding: 0 16px 0 20px !important;

      &:hover {
        background-color: $gray-100;
        color: $primary;
      }

      &.is-active {
        background-color: $primary-mix-white-8;
        color: $primary;
        font-weight: 600;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: $primary;
        }
      }
    }

    .el-submenu .el-menu-item {
      min-width: $sideBarWidth !important;
      background-color: $gray-100;
      padding-left: 48px !important;

      &:hover {
        background-color: $gray-200;
      }

      &.is-active {
        background-color: $primary-mix-white-8;
      }
    }
  }
}
</style>
