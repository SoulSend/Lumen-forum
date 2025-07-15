<template>
  <el-dialog 
    title="用户详情" 
    :visible.sync="visible" 
    width="500px"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <el-card class="user-detail-card" shadow="never">
      <div class="user-detail-header">
        <div class="user-avatar">
          <el-avatar :size="80" :src="user && user.avatar" icon="el-icon-user-solid"></el-avatar>
        </div>
        <div class="user-basic-info">
          <div class="user-name">{{ user && user.username }}</div>
          <div class="user-role">
            <el-tag size="small">{{ user && user.role }}</el-tag>
          </div>
          <div class="user-status">
            <el-tag :type="user && user.status === '1' ? 'success' : 'info'" size="small">
              {{ user && user.status === '1' ? '正常' : '禁用' }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <el-divider></el-divider>
      
      <div class="user-detail-content">
        <ul class="info-list">
          <li class="info-item">
            <span class="info-label">用户ID</span>
            <span class="info-value">{{ user && user.id }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">部门</span>
            <span class="info-value">{{ user && user.dept || '无' }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">手机号</span>
            <span class="info-value">{{ user && user.phone || '无' }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ user && user.email || '无' }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">创建时间</span>
            <span class="info-value">{{ user && user.createTime || '无' }}</span>
          </li>
          <li class="info-item">
            <span class="info-label">备注</span>
            <span class="info-value">{{ user && user.remark || '无' }}</span>
          </li>
        </ul>
      </div>
      
      <template v-if="loginHistory && loginHistory.length > 0">
        <el-divider>登录历史</el-divider>
        <el-table
          :data="loginHistory"
          style="width: 100%"
          size="small"
          :header-cell-style="{ background: '#f6f8fa', color: '#606266' }"
        >
          <el-table-column prop="loginTime" label="登录时间" width="160"></el-table-column>
          <el-table-column prop="ip" label="IP地址"></el-table-column>
          <el-table-column prop="device" label="设备"></el-table-column>
        </el-table>
      </template>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleEdit">编辑</el-button>
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserDetail',
  props: {
    visible: Boolean,
    user: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loginHistory: [
        { loginTime: '2024-01-20 09:32:45', ip: '192.168.1.100', device: 'Chrome / Windows 10' },
        { loginTime: '2024-01-19 14:21:33', ip: '192.168.1.100', device: 'Chrome / Windows 10' },
        { loginTime: '2024-01-18 08:56:12', ip: '192.168.1.105', device: 'Safari / macOS' }
      ]
    }
  },
  methods: {
    handleEdit() {
      this.$emit('update:visible', false)
      this.$emit('edit')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-detail-card {
  border: none;
  
  .user-detail-header {
    display: flex;
    align-items: center;
    
    .user-avatar {
      margin-right: $spacing-lg;
    }
    
    .user-basic-info {
      .user-name {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $gray-800;
        margin-bottom: $spacing-xs;
      }
      
      .user-role, .user-status {
        margin-top: $spacing-xs;
      }
    }
  }
  
  .user-detail-content {
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      .info-item {
        display: flex;
        margin-bottom: $spacing-md;
        align-items: center;
        
        .info-label {
          width: 100px;
          color: $gray-600;
          flex-shrink: 0;
        }
        
        .info-value {
          color: $gray-800;
          word-break: break-all;
        }
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style> 