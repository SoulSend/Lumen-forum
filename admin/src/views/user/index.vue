<template>
  <div class="user-main">
    <!-- 页面头部 -->
    <div class="user-header">
      <div class="header-title">用户管理</div>
      <div class="header-actions">
        <el-button 
          size="small" 
          icon="el-icon-refresh" 
          @click="refreshUserList" 
          :loading="loading"
        >
          刷新
        </el-button>
      </div>
    </div>
    
    <el-card class="user-search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="user-search-form" @submit.native.prevent>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable @keyup.enter.native="handleSearch" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable @keyup.enter.native="handleSearch" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.dept" placeholder="全部部门" clearable>
            <el-option label="全部" value="" />
            <el-option v-for="dept in deptOptions" :key="dept.id" :label="dept.name" :value="dept.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="全部" value="" />
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" :loading="loading">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="table-operations">
      <div class="left">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="selectedUsers.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>
      <div class="right">
        <el-tooltip content="密度" placement="top">
          <el-dropdown trigger="click" @command="handleSizeChange">
            <el-button type="text" icon="el-icon-menu"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="large">宽松</el-dropdown-item>
              <el-dropdown-item command="default">默认</el-dropdown-item>
              <el-dropdown-item command="small">紧凑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
        
        <el-tooltip content="列设置" placement="top">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
          >
            <el-checkbox-group v-model="visibleColumns">
              <el-checkbox 
                v-for="col in allColumns.filter(c => !c.fixed)" 
                :key="col.prop" 
                :label="col.prop"
              >
                {{ col.label }}
              </el-checkbox>
            </el-checkbox-group>
            <el-button type="text" slot="reference" icon="el-icon-s-operation"></el-button>
          </el-popover>
        </el-tooltip>
      </div>
    </div>
    
    <el-card class="user-table-card" shadow="hover">
      <div class="card-body">
        <el-table
          ref="userTable"
          v-loading="loading"
          :data="userList"
          border
          stripe
          :size="tableSize"
          style="width: 100%"
          class="user-table"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ background: '#f6f8fa', color: '#606266' }"
        >
          <el-table-column type="selection" width="50" fixed="left" />
          
          <el-table-column prop="avatar" label="头像" width="70" align="center" fixed="left" v-if="isColumnVisible('avatar')">
            <template slot-scope="scope">
              <el-avatar :src="scope.row.avatar" icon="el-icon-user-solid" size="small" />
            </template>
          </el-table-column>
          
          <el-table-column prop="username" label="用户名" min-width="120" fixed="left" v-if="isColumnVisible('username')" />
          
          <el-table-column prop="phone" label="手机号" min-width="120" v-if="isColumnVisible('phone')" />
          
          <el-table-column prop="email" label="邮箱" min-width="180" v-if="isColumnVisible('email')" />
          
          <el-table-column prop="role" label="角色" min-width="100" v-if="isColumnVisible('role')" />
          
          <el-table-column prop="dept" label="部门" min-width="100" v-if="isColumnVisible('dept')" />
          
          <el-table-column prop="status" label="状态" width="80" v-if="isColumnVisible('status')">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'info'" size="small">
                {{ scope.row.status === '1' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="createTime" label="创建时间" min-width="160" v-if="isColumnVisible('createTime')" />
          
          <el-table-column label="操作" width="210" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button 
                type="text" 
                size="mini" 
                icon="el-icon-view"
                @click="handleViewDetail(scope.row)"
              >
                查看
              </el-button>
              <el-dropdown size="mini" split-button type="primary" @click="handleEdit(scope.row)" @command="handleCommand(scope.row, $event)">
                编辑
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="reset">重置密码</el-dropdown-item>
                  <el-dropdown-item command="status" :disabled="scope.row.username === 'admin'">
                    {{ scope.row.status === '1' ? '禁用' : '启用' }}
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided :disabled="scope.row.username === 'admin'">
                    <span style="color: #f56c6c;">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="user-pagination">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :current-page.sync="pageNum"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </el-card>
    
    <user-form
      v-if="showForm"
      :visible.sync="showForm"
      :user="currentUser"
      :roles="roleOptions"
      :depts="deptOptions"
      @refresh="fetchUserList"
    />

    <!-- 重置密码结果展示 -->
    <el-dialog
      title="密码重置成功"
      :visible.sync="pwdDialogVisible"
      width="400px"
      center
    >
      <div class="reset-dialog-content">
        <i class="el-icon-success success-icon"></i>
        <div class="reset-message">
          <p>用户 <strong>{{ currentUser && currentUser.username }}</strong> 的密码已成功重置为</p>
          <div class="password-box">
            <span class="password-text">{{ resetPassword }}</span>
            <el-button type="text" icon="el-icon-copy-document" @click="copyPassword">复制</el-button>
          </div>
          <p class="reset-tip">请妥善保存并尽快通知用户修改</p>
        </div>
      </div>
    </el-dialog>

    <user-detail
      v-if="showDetail"
      :visible.sync="showDetail"
      :user="currentUser"
      @edit="handleEditFromDetail"
    />
  </div>
</template>

<script>
import UserForm from './components/UserForm.vue'
import UserDetail from './components/UserDetail.vue'
import {
  getUserList,
  deleteUser,
  resetUserPassword,
  updateUser,
  getRoleList,
  getDeptList
} from '@/api/user'
import { MessageBox } from 'element-ui'
import Clipboard from 'clipboard'

export default {
  name: 'User',
  components: { 
    UserForm,
    UserDetail
  },
  data() {
    return {
      searchForm: { 
        username: '', 
        phone: '', 
        status: '',
        dept: ''
      },
      userList: [],
      selectedUsers: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      loading: false,
      showForm: false,
      showDetail: false,
      currentUser: null,
      resetPassword: '',
      pwdDialogVisible: false,
      roleOptions: [],
      deptOptions: [],
      tableSize: 'default',
      allColumns: [
        { prop: 'avatar', label: '头像', fixed: true },
        { prop: 'username', label: '用户名', fixed: true },
        { prop: 'phone', label: '手机号' },
        { prop: 'email', label: '邮箱' },
        { prop: 'role', label: '角色' },
        { prop: 'dept', label: '部门' },
        { prop: 'status', label: '状态' },
        { prop: 'createTime', label: '创建时间' }
      ],
      visibleColumns: ['avatar', 'username', 'phone', 'email', 'role', 'dept', 'status', 'createTime']
    }
  },
  created() {
    this.fetchUserList()
    this.fetchRoles()
    this.fetchDepts()
  },
  methods: {
    // 判断列是否显示
    isColumnVisible(prop) {
      return this.visibleColumns.includes(prop)
    },
    
    // 获取用户列表
    async fetchUserList() {
      this.loading = true
      try {
        // 构建查询参数
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.searchForm
        }
        
        // 模拟API请求
        setTimeout(() => {
          // 生成模拟数据
          const mockUsers = []
          const total = 35
          const roles = [['admin'], ['user'], ['user', 'editor']]
          const depts = ['技术部', '市场部', '销售部', '人事部', '财务部']
          const statuses = ['1', '0']
          
          // 根据搜索条件过滤
          let filteredTotal = total
          
          // 生成当前页数据
          for (let i = 0; i < params.pageSize; i++) {
            const index = (params.pageNum - 1) * params.pageSize + i
            if (index >= filteredTotal) break
            
            const username = `user${index + 1}`
            const phone = `1380013${String(index + 1).padStart(4, '0')}`
            const email = `user${index + 1}@example.com`
            const role = roles[Math.floor(Math.random() * roles.length)]
            const dept = depts[Math.floor(Math.random() * depts.length)]
            const status = statuses[Math.floor(Math.random() * statuses.length)]
            const createTime = this.formatDateTime(new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000))
            
            // 应用搜索过滤
            if (
              (params.username && !username.includes(params.username)) ||
              (params.phone && !phone.includes(params.phone)) ||
              (params.status && status !== params.status) ||
              (params.dept && dept !== params.dept)
            ) {
              filteredTotal--
              continue
            }
            
            mockUsers.push({
              id: index + 1,
              username,
              name: `用户${index + 1}`,
              phone,
              email,
              role: role[0],
              roles: role,
              dept,
              status,
              createTime
            })
          }
          
          this.userList = mockUsers
          this.total = filteredTotal
          this.loading = false
        }, 500)
        
        // 实际项目中应该调用API
        // const response = await getUserList(params)
        // if (response.code === 20000) {
        //   this.userList = response.data.list
        //   this.total = response.data.total
        // }
      } catch (error) {
        console.error('获取用户列表失败', error)
        this.$message.error('获取用户列表失败')
      } finally {
        this.loading = false
      }
    },
    
    // 获取角色列表
    async fetchRoles() {
      try {
        // 模拟角色数据
        setTimeout(() => {
          this.roleOptions = [
            { id: 1, name: '管理员', value: 'admin' },
            { id: 2, name: '普通用户', value: 'user' },
            { id: 3, name: '编辑', value: 'editor' },
            { id: 4, name: '访客', value: 'visitor' }
          ]
        }, 300)
        
        // 实际项目中应该调用API
        // const response = await getRoleList()
        // if (response.code === 20000) {
        //   this.roleOptions = response.data
        // }
      } catch (error) {
        console.error('获取角色列表失败', error)
      }
    },
    
    // 获取部门列表
    async fetchDepts() {
      try {
        // 模拟部门数据
        setTimeout(() => {
          this.deptOptions = [
            { id: 1, name: '技术部' },
            { id: 2, name: '市场部' },
            { id: 3, name: '销售部' },
            { id: 4, name: '人事部' },
            { id: 5, name: '财务部' }
          ]
        }, 300)
        
        // 实际项目中应该调用API
        // const response = await getDeptList()
        // if (response.code === 20000) {
        //   this.deptOptions = response.data
        // }
      } catch (error) {
        console.error('获取部门列表失败', error)
      }
    },
    
    // 刷新用户列表
    refreshUserList() {
      this.fetchUserList()
    },
    
    // 搜索
    handleSearch() {
      this.pageNum = 1
      this.fetchUserList()
    },
    
    // 重置搜索
    handleReset() {
      this.searchForm = { username: '', phone: '', status: '', dept: '' }
      this.pageNum = 1
      this.fetchUserList()
    },
    
    // 新增用户
    handleAdd() {
      this.currentUser = null
      this.showForm = true
    },
    
    // 编辑用户
    handleEdit(row) {
      this.currentUser = { ...row }
      this.showForm = true
    },
    
    // 重置密码
    async handleResetPwd(row) {
      try {
        this.currentUser = row
        
        // 模拟重置密码
        setTimeout(() => {
          // 生成随机密码
          const randomPassword = Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10)
          this.resetPassword = randomPassword
          this.pwdDialogVisible = true
        }, 500)
        
        // 实际项目中应该调用API
        // const response = await resetUserPassword(row.id)
        // if (response.code === 20000) {
        //   this.resetPassword = response.data.password
        //   this.pwdDialogVisible = true
        // }
      } catch (error) {
        console.error('重置密码失败', error)
        this.$message.error('重置密码失败')
      }
    },
    
    // 复制密码
    copyPassword() {
      // 创建临时DOM元素
      const clipboard = new Clipboard('.el-icon-copy-document', {
        text: () => this.resetPassword
      })
      
      clipboard.on('success', () => {
        this.$message.success('密码已复制到剪贴板')
        clipboard.destroy()
      })
      
      clipboard.on('error', () => {
        this.$message.error('复制失败，请手动复制')
        clipboard.destroy()
      })
      
      // 触发点击事件
      document.querySelector('.el-icon-copy-document').click()
    },
    
    // 处理下拉菜单命令
    async handleCommand(row, command) {
      if (command === 'delete') {
        this.handleDelete(row)
      } else if (command === 'status') {
        this.handleToggleStatus(row)
      } else if (command === 'reset') {
        this.handleResetPwd(row)
      }
    },
    
    // 切换状态
    async handleToggleStatus(row) {
      const status = row.status === '1' ? '0' : '1'
      const statusText = status === '1' ? '启用' : '禁用'
      
      try {
        // 模拟状态切换
        setTimeout(() => {
          // 更新本地数据
          const index = this.userList.findIndex(item => item.id === row.id)
          if (index !== -1) {
            this.userList[index].status = status
            this.$message.success(`${statusText}成功`)
          }
        }, 500)
        
        // 实际项目中应该调用API
        // const result = await updateUser({
        //   ...row,
        //   status
        // })
        // 
        // if (result.code === 20000) {
        //   this.$message.success(`${statusText}成功`)
        //   // 更新本地数据
        //   const index = this.userList.findIndex(item => item.id === row.id)
        //   if (index !== -1) {
        //     this.userList[index].status = status
        //   }
        // }
      } catch (error) {
        console.error(`${statusText}失败`, error)
        this.$message.error(`${statusText}失败`)
      }
    },
    
    // 删除用户
    handleDelete(row) {
      if (row.username === 'admin') {
        this.$message.warning('管理员账号不能删除')
        return
      }
      
      this.$confirm(`确定要删除用户 ${row.username} 吗？此操作不可恢复！`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // 模拟删除操作
          setTimeout(() => {
            this.$message.success('删除成功')
            this.fetchUserList()
          }, 500)
          
          // 实际项目中应该调用API
          // const response = await deleteUser(row.id)
          // if (response.code === 20000) {
          //   this.$message.success('删除成功')
          //   this.fetchUserList()
          // }
        } catch (error) {
          console.error('删除用户失败', error)
          this.$message.error('删除用户失败')
        }
      }).catch(() => {})
    },
    
    // 批量删除
    handleBatchDelete() {
      if (this.selectedUsers.length === 0) {
        this.$message.warning('请选择要删除的用户')
        return
      }
      
      // 检查是否包含admin用户
      if (this.selectedUsers.some(user => user.username === 'admin')) {
        this.$message.warning('管理员账号不能删除')
        return
      }
      
      this.$confirm(`确定要删除选中的 ${this.selectedUsers.length} 个用户吗？此操作不可恢复！`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        
        try {
          // 模拟批量删除操作
          setTimeout(() => {
            this.$message.success(`成功删除 ${this.selectedUsers.length} 个用户`)
            this.fetchUserList()
            this.loading = false
          }, 800)
          
          // 实际项目中应该调用API
          // // 批量删除请求
          // const promises = this.selectedUsers.map(user => deleteUser(user.id))
          // const results = await Promise.all(promises)
          // 
          // if (results.every(res => res.code === 20000)) {
          //   this.$message.success(`成功删除 ${this.selectedUsers.length} 个用户`)
          //   this.fetchUserList()
          // }
        } catch (error) {
          console.error('批量删除失败', error)
          this.$message.error('批量删除失败')
        } finally {
          this.loading = false
        }
      }).catch(() => {})
    },
    
    // 表格选择变化
    handleSelectionChange(selection) {
      this.selectedUsers = selection
    },
    
    // 页码变化
    handlePageChange(val) {
      this.pageNum = val
      this.fetchUserList()
    },
    
    // 每页条数变化
    handlePageSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.fetchUserList()
    },
    
    // 表格密度变化
    handleSizeChange(size) {
      this.tableSize = size
    },

    // 查看详情
    handleViewDetail(row) {
      this.currentUser = { ...row }
      this.showDetail = true
    },

    // 编辑详情页面
    handleEditFromDetail() {
      this.showForm = true
    },
    
    // 格式化日期时间
    formatDateTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-main {
  padding: $spacing-lg;
  background: $gray-100;
  min-height: calc(100vh - #{$navbarHeight});
}

// 头部
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
  
  .header-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $gray-800;
  }
  
  .header-actions {
    display: flex;
    gap: $spacing-sm;
  }
}

.user-search-card {
  margin-bottom: $spacing-md;
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  border: none;
  
  .user-search-form {
    .el-form-item {
      margin-right: $spacing-md;
      margin-bottom: 0;
      
      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.table-operations {
  margin-bottom: $spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    display: flex;
    gap: $spacing-sm;
  }
  
  .right {
    display: flex;
    gap: $spacing-sm;
  }
}

.user-table-card {
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  border: none;
  margin-bottom: $spacing-lg;
  
  .card-body {
    padding: 0;
  }
  
  .user-table {
    margin-bottom: 0;
  }
  
  .user-pagination {
    padding: $spacing-md;
    display: flex;
    justify-content: flex-end;
    background-color: $white;
  }
}

// 重置密码弹窗样式
.reset-dialog-content {
  display: flex;
  align-items: center;
  padding: $spacing-md 0;
  
  .success-icon {
    font-size: 48px;
    color: $success;
    margin-right: $spacing-lg;
  }
  
  .reset-message {
    flex: 1;
    
    p {
      margin-top: 0;
      margin-bottom: $spacing-sm;
    }
    
    .password-box {
      background-color: $gray-100;
      padding: $spacing-md;
      border-radius: $border-radius-sm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: $spacing-md 0;
      
      .password-text {
        font-family: monospace;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $gray-700;
      }
    }
    
    .reset-tip {
      color: $warning;
      font-size: $font-size-sm;
      margin-bottom: 0;
    }
  }
}

@media (max-width: 900px) {
  .user-main {
    padding: $spacing-sm;
  }
  
  .user-search-form {
    .el-form-item {
      margin-bottom: $spacing-sm !important;
    }
  }
  
  .table-operations {
    flex-direction: column;
    gap: $spacing-sm;
    align-items: flex-start;
    
    .right {
      align-self: flex-end;
    }
  }
}
</style>
