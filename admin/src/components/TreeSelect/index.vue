<!--
 * 树形选择组件
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-06-17
 -->

<template>
  <div class="tree-select">
    <el-select
      v-model="selectedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :multiple="multiple"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      @change="handleChange"
      :size="size"
      :filterable="filterable"
      :popper-class="popperClass"
      ref="selectRef"
    >
      <el-option :value="valueForSelect" style="height: auto; padding: 0;">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          :node-key="nodeKey"
          :default-expanded-keys="defaultExpandedKeys"
          :show-checkbox="multiple"
          :check-strictly="checkStrictly"
          :default-checked-keys="defaultCheckedKeys"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          @check="handleTreeCheck"
          @node-click="handleNodeClick"
        />
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    // 选中值
    value: {
      type: [String, Number, Array],
      default: ''
    },
    // 树形数据
    treeData: {
      type: Array,
      default: () => []
    },
    // 树形配置选项
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })
    },
    // 节点键值
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 占位文本
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 多选时是否折叠标签
    collapseTags: {
      type: Boolean,
      default: true
    },
    // 默认展开的节点
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    // 默认选中的节点
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 组件尺寸
    size: {
      type: String,
      default: 'medium'
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 下拉框的自定义类名
    popperClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedValue: this.value,
      valueForSelect: '__tree_select_value__',
      filterText: ''
    }
  },
  watch: {
    value(val) {
      this.selectedValue = val
    },
    filterText(val) {
      this.$refs.treeRef.filter(val)
    }
  },
  methods: {
    // 处理树节点点击事件
    handleNodeClick(node) {
      if (this.multiple) return
      this.selectedValue = node[this.nodeKey]
      this.$refs.selectRef.blur()
      this.$emit('input', this.selectedValue)
      this.$emit('change', this.selectedValue)
    },
    // 处理树节点选中事件
    handleTreeCheck(node, checked) {
      if (!this.multiple) return
      this.selectedValue = this.$refs.treeRef.getCheckedKeys()
      this.$emit('input', this.selectedValue)
      this.$emit('change', this.selectedValue)
    },
    // 处理选择框变化事件
    handleChange(val) {
      if (val !== this.valueForSelect) {
        this.selectedValue = ''
        this.$emit('input', this.selectedValue)
        this.$emit('change', this.selectedValue)
      }
    },
    // 过滤节点方法
    filterNode(value, data) {
      if (!value) return true
      const label = data[this.treeProps.label] || ''
      return label.indexOf(value) !== -1
    },
    // 设置过滤文本
    setFilterText(text) {
      this.filterText = text
    },
    // 获取树组件实例
    getTree() {
      return this.$refs.treeRef
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-select {
  width: 100%;
  
  ::v-deep .el-select {
    width: 100%;
  }
  
  ::v-deep .el-tree {
    padding: 5px 0;
    min-width: 100%;
  }
  
  ::v-deep .el-select-dropdown__item {
    padding: 0;
    height: auto;
    overflow: visible;
  }
}
</style> 