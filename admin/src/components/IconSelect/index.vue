<!--
 * 图标选择组件
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-06-17
 -->

<template>
  <div class="icon-select">
    <el-popover
      placement="bottom-start"
      trigger="click"
      :width="popoverWidth"
      popper-class="icon-select-popover"
      v-model="visible"
    >
      <div class="icon-select-header">
        <el-input
          v-model="searchText"
          placeholder="搜索图标"
          clearable
          prefix-icon="el-icon-search"
          size="small"
        ></el-input>
        <div class="icon-select-tabs">
          <el-radio-group v-model="currentTab" size="small">
            <el-radio-button label="element">Element</el-radio-button>
            <el-radio-button label="svg">SVG</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="icon-select-content" v-loading="loading">
        <!-- Element图标 -->
        <template v-if="currentTab === 'element'">
          <div class="icon-grid">
            <div
              v-for="(icon, index) in filteredElementIcons"
              :key="'el-' + index"
              class="icon-item"
              @click="selectIcon('el-icon-' + icon)"
              :class="{ 'is-selected': value === 'el-icon-' + icon }"
            >
              <i :class="'el-icon-' + icon"></i>
              <span class="icon-name">{{ icon }}</span>
            </div>
            <div v-if="filteredElementIcons.length === 0" class="no-result">
              没有找到匹配的图标
            </div>
          </div>
        </template>
        <!-- SVG图标 -->
        <template v-else>
          <div class="icon-grid">
            <div
              v-for="(icon, index) in filteredSvgIcons"
              :key="'svg-' + index"
              class="icon-item"
              @click="selectIcon(icon)"
              :class="{ 'is-selected': value === icon }"
            >
              <svg-icon :icon-class="icon" />
              <span class="icon-name">{{ icon }}</span>
            </div>
            <div v-if="filteredSvgIcons.length === 0" class="no-result">
              没有找到匹配的图标
            </div>
          </div>
        </template>
      </div>
      <div slot="reference" class="icon-select-trigger">
        <el-input
          v-model="value"
          :placeholder="placeholder"
          :disabled="disabled"
          :clearable="clearable"
          :size="size"
          @clear="clearIcon"
          readonly
        >
          <template slot="prepend">
            <i v-if="value && value.startsWith('el-icon-')" :class="value"></i>
            <svg-icon v-else-if="value" :icon-class="value" />
            <i v-else class="el-icon-picture-outline"></i>
          </template>
        </el-input>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { loadElementIcons, loadSvgIcons } from './icons'

export default {
  name: 'IconSelect',
  props: {
    // 选中的图标
    value: {
      type: String,
      default: ''
    },
    // 占位文本
    placeholder: {
      type: String,
      default: '点击选择图标'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 组件尺寸
    size: {
      type: String,
      default: 'medium'
    },
    // 弹出框宽度
    popoverWidth: {
      type: Number,
      default: 460
    }
  },
  data() {
    return {
      visible: false,
      searchText: '',
      currentTab: 'element',
      loading: false,
      elementIcons: [],
      svgIcons: []
    }
  },
  computed: {
    filteredElementIcons() {
      if (!this.searchText) {
        return this.elementIcons
      }
      return this.elementIcons.filter(icon => 
        icon.toLowerCase().includes(this.searchText.toLowerCase())
      )
    },
    filteredSvgIcons() {
      if (!this.searchText) {
        return this.svgIcons
      }
      return this.svgIcons.filter(icon => 
        icon.toLowerCase().includes(this.searchText.toLowerCase())
      )
    }
  },
  watch: {
    visible(val) {
      if (val && (this.elementIcons.length === 0 || this.svgIcons.length === 0)) {
        this.loadIcons()
      }
    }
  },
  methods: {
    // 加载图标
    async loadIcons() {
      this.loading = true
      try {
        // 加载Element UI内置图标
        if (this.elementIcons.length === 0) {
          this.elementIcons = await loadElementIcons()
        }
        
        // 加载SVG图标
        if (this.svgIcons.length === 0) {
          this.svgIcons = await loadSvgIcons()
        }
      } catch (error) {
        console.error('加载图标失败:', error)
        this.$message.error('加载图标失败')
      } finally {
        this.loading = false
      }
    },
    // 选择图标
    selectIcon(icon) {
      this.$emit('input', icon)
      this.$emit('change', icon)
      this.visible = false
    },
    // 清空图标
    clearIcon() {
      this.$emit('input', '')
      this.$emit('change', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-select {
  width: 100%;
  
  .icon-select-trigger {
    width: 100%;
    cursor: pointer;
    
    ::v-deep .el-input-group__prepend {
      padding: 0 10px;
      width: 40px;
      text-align: center;
      
      i, svg {
        font-size: 18px;
        vertical-align: middle;
      }
    }
  }
}

::v-deep .icon-select-popover {
  .icon-select-header {
    margin-bottom: 10px;
    
    .icon-select-tabs {
      margin-top: 10px;
      text-align: center;
    }
  }
  
  .icon-select-content {
    height: 320px;
    overflow-y: auto;
    
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-gap: 10px;
      
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80px;
        padding: 10px;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background-color: #f5f7fa;
          color: #409eff;
          border-color: #c6e2ff;
        }
        
        &.is-selected {
          background-color: #ecf5ff;
          color: #409eff;
          border-color: #409eff;
        }
        
        i, svg {
          font-size: 24px;
          margin-bottom: 5px;
        }
        
        .icon-name {
          font-size: 12px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
      }
      
      .no-result {
        grid-column: span 6;
        text-align: center;
        padding: 20px;
        color: #909399;
      }
    }
  }
}
</style> 