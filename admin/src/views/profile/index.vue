<template>
  <div class="app-container profile-container">
    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :span="6">
        <el-card class="user-card">
          <div class="user-header">
            <div class="avatar-wrapper">
              <img :src="user.avatar || defaultAvatar" class="user-avatar" />
              <div class="avatar-edit" @click="handleAvatarEdit">
                <i class="el-icon-camera"></i>
              </div>
            </div>
            <div class="user-info">
              <h2 class="username">{{ user.name }}</h2>
              <p class="user-role">{{ user.role }}</p>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ user.loginCount }}</div>
              <div class="stat-label">登录次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ user.lastLoginTime }}</div>
              <div class="stat-label">上次登录</div>
            </div>
          </div>
          <div class="user-contact">
            <div class="contact-item">
              <i class="el-icon-phone"></i>
              <span>{{ user.phone || '未设置' }}</span>
            </div>
            <div class="contact-item">
              <i class="el-icon-message"></i>
              <span>{{ user.email || '未设置' }}</span>
            </div>
            <div class="contact-item">
              <i class="el-icon-office-building"></i>
              <span>{{ user.dept || '未设置' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧内容区域 -->
      <el-col :span="18">
        <el-card>
          <el-tabs v-model="activeTab">
            <!-- 基本资料 -->
            <el-tab-pane label="基本资料" name="userInfo">
              <el-form 
                :model="userForm" 
                :rules="userRules" 
                ref="userForm" 
                label-width="80px" 
                class="user-form"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="userForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="userForm.sex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                    <el-radio label="2">保密</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateUserInfo">保存</el-button>
                  <el-button @click="resetForm('userForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="changePwd">
              <el-form 
                :model="pwdForm" 
                :rules="pwdRules" 
                ref="pwdForm" 
                label-width="100px" 
                class="pwd-form"
              >
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input 
                    v-model="pwdForm.oldPassword" 
                    type="password" 
                    placeholder="请输入旧密码"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input 
                    v-model="pwdForm.newPassword" 
                    type="password" 
                    placeholder="请输入新密码"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                  <el-input 
                    v-model="pwdForm.confirmPassword" 
                    type="password" 
                    placeholder="请再次输入新密码"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updatePassword">保存</el-button>
                  <el-button @click="resetForm('pwdForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <!-- 登录日志 -->
            <el-tab-pane label="登录日志" name="loginLog">
              <el-table
                :data="loginLogs"
                v-loading="logLoading"
                border
                style="width: 100%"
              >
                <el-table-column prop="loginTime" label="登录时间" width="180"></el-table-column>
                <el-table-column prop="ipaddr" label="登录IP" width="160"></el-table-column>
                <el-table-column prop="location" label="登录地点"></el-table-column>
                <el-table-column prop="browser" label="浏览器"></el-table-column>
                <el-table-column prop="os" label="操作系统"></el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
                      {{ scope.row.status === '0' ? '成功' : '失败' }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
              
              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="logQuery.pageSize"
                  :current-page="logQuery.pageNum"
                  :total="logTotal"
                  @size-change="handleLogSizeChange"
                  @current-change="handleLogCurrentChange"
                ></el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 修改头像对话框 -->
    <el-dialog title="修改头像" :visible.sync="avatarDialogVisible" width="400px">
      <div class="avatar-upload-container">
        <el-upload
          class="avatar-uploader"
          action="#"
          :http-request="uploadAvatar"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar-preview">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="avatar-tip">请上传JPG或PNG格式图片，且不超过2MB</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAvatarUpload">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultAvatar from '@/assets/login_images/1.jpg'
import { getInfo, updateUserProfile, updateUserPassword, updateUserAvatar } from '@/api/user'
import { getUserLoginLogs } from '@/api/log'

export default {
  name: 'Profile',
  data() {
    // 验证密码是否一致
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    
    return {
      defaultAvatar,
      activeTab: 'userInfo',
      user: {
        name: '',
        username: '',
        avatar: '',
        role: '',
        phone: '',
        email: '',
        dept: '',
        loginCount: 0,
        lastLoginTime: ''
      },
      
      // 用户表单
      userForm: {
        username: '',
        name: '',
        phone: '',
        email: '',
        sex: '0'
      },
      userRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      
      // 密码表单
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      pwdRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      
      // 登录日志
      loginLogs: [],
      logQuery: {
        pageNum: 1,
        pageSize: 10
      },
      logTotal: 0,
      logLoading: false,
      
      // 头像上传
      avatarDialogVisible: false,
      avatarUrl: '',
      avatarFile: null
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'roles'
    ])
  },
  created() {
    this.getUserInfo()
    this.getLoginLogs()
  },
  methods: {
    // 获取用户信息
    async getUserInfo() {
      try {
        // 模拟数据
        setTimeout(() => {
          this.user = {
            name: this.name || 'Admin',
            username: 'admin',
            avatar: this.avatar,
            role: this.roles.join(', ') || '管理员',
            phone: '13800138000',
            email: 'admin@example.com',
            dept: '技术部',
            loginCount: 128,
            lastLoginTime: '2024-06-17 10:30:45'
          }
          
          // 填充表单数据
          this.userForm = {
            username: this.user.username,
            name: this.user.name,
            phone: this.user.phone,
            email: this.user.email,
            sex: '0'
          }
        }, 300)
        
        // 实际项目中，这里应该调用API获取用户详细信息
        // const res = await getInfo()
        // this.user = res.data
        // this.userForm = {
        //   username: res.data.username,
        //   name: res.data.name,
        //   phone: res.data.phone,
        //   email: res.data.email,
        //   sex: res.data.sex
        // }
      } catch (error) {
        console.error('获取用户信息失败', error)
      }
    },
    
    // 更新用户信息
    updateUserInfo() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          try {
            // 模拟更新成功
            setTimeout(() => {
              this.$message.success('个人信息修改成功')
              // 更新页面显示的用户信息
              this.user.name = this.userForm.name
              this.user.phone = this.userForm.phone
              this.user.email = this.userForm.email
            }, 500)
            
            // 实际项目中，这里应该调用API更新用户信息
            // await updateUserProfile(this.userForm)
            // this.$message.success('个人信息修改成功')
            // this.getUserInfo()
          } catch (error) {
            console.error('修改个人信息失败', error)
            this.$message.error('修改个人信息失败，请重试')
          }
        }
      })
    },
    
    // 修改密码
    updatePassword() {
      this.$refs.pwdForm.validate(async valid => {
        if (valid) {
          try {
            // 模拟更新成功
            setTimeout(() => {
              this.$message.success('密码修改成功，请重新登录')
              this.$store.dispatch('user/logout').then(() => {
                this.$router.push('/login')
              })
            }, 500)
            
            // 实际项目中，这里应该调用API更新密码
            // await updateUserPassword(this.pwdForm)
            // this.$message.success('密码修改成功，请重新登录')
            // this.$store.dispatch('user/logout').then(() => {
            //   this.$router.push('/login')
            // })
          } catch (error) {
            console.error('修改密码失败', error)
            this.$message.error('修改密码失败，请重试')
          }
        }
      })
    },
    
    // 获取登录日志
    async getLoginLogs() {
      this.logLoading = true
      try {
        // 模拟数据
        setTimeout(() => {
          const logs = []
          const total = 35
          
          for (let i = 0; i < this.logQuery.pageSize; i++) {
            const index = (this.logQuery.pageNum - 1) * this.logQuery.pageSize + i
            if (index >= total) break
            
            const date = new Date()
            date.setDate(date.getDate() - index)
            
            logs.push({
              id: index + 1,
              loginTime: this.formatDateTime(date),
              ipaddr: `192.168.1.${Math.floor(Math.random() * 255)}`,
              location: '中国 广东 深圳',
              browser: ['Chrome', 'Firefox', 'Edge', 'Safari'][Math.floor(Math.random() * 4)],
              os: ['Windows 10', 'Windows 11', 'macOS', 'Ubuntu'][Math.floor(Math.random() * 4)],
              status: Math.random() > 0.1 ? '0' : '1'
            })
          }
          
          this.loginLogs = logs
          this.logTotal = total
          this.logLoading = false
        }, 500)
        
        // 实际项目中，这里应该调用API获取登录日志
        // const res = await getUserLoginLogs(this.logQuery)
        // this.loginLogs = res.data.list
        // this.logTotal = res.data.total
      } catch (error) {
        console.error('获取登录日志失败', error)
      } finally {
        this.logLoading = false
      }
    },
    
    // 分页处理
    handleLogSizeChange(size) {
      this.logQuery.pageSize = size
      this.getLoginLogs()
    },
    handleLogCurrentChange(page) {
      this.logQuery.pageNum = page
      this.getLoginLogs()
    },
    
    // 头像处理
    handleAvatarEdit() {
      this.avatarDialogVisible = true
      this.avatarUrl = this.user.avatar || this.defaultAvatar
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      
      if (isJPG && isLt2M) {
        this.avatarFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.avatarUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
      return false // 阻止自动上传
    },
    uploadAvatar() {
      // 这个方法不会被调用，因为我们阻止了自动上传
    },
    async confirmAvatarUpload() {
      if (!this.avatarFile) {
        this.$message.warning('请先选择要上传的头像')
        return
      }
      
      try {
        // 模拟上传成功
        setTimeout(() => {
          this.$message.success('头像修改成功')
          this.user.avatar = this.avatarUrl
          this.$store.commit('user/SET_AVATAR', this.avatarUrl)
          this.avatarDialogVisible = false
        }, 500)
        
        // 实际项目中，这里应该调用API上传头像
        // const formData = new FormData()
        // formData.append('avatarfile', this.avatarFile)
        // const res = await updateUserAvatar(formData)
        // this.$message.success('头像修改成功')
        // this.user.avatar = res.data.imgUrl
        // this.$store.commit('user/SET_AVATAR', res.data.imgUrl)
        // this.avatarDialogVisible = false
      } catch (error) {
        console.error('上传头像失败', error)
        this.$message.error('上传头像失败，请重试')
      }
    },
    
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
.profile-container {
  padding: 20px;
  
  .user-card {
    .user-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      
      .avatar-wrapper {
        position: relative;
        margin-bottom: 15px;
        
        .user-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #eaeaea;
        }
        
        .avatar-edit {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #409EFF;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background-color: #66b1ff;
          }
        }
      }
      
      .user-info {
        text-align: center;
        
        .username {
          margin: 0 0 5px;
          font-size: 20px;
          font-weight: 500;
        }
        
        .user-role {
          margin: 0;
          color: #909399;
          font-size: 14px;
        }
      }
    }
    
    .user-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      padding: 15px 0;
      border-top: 1px solid #eaeaea;
      border-bottom: 1px solid #eaeaea;
      
      .stat-item {
        text-align: center;
        
        .stat-value {
          font-size: 18px;
          font-weight: 500;
          color: #409EFF;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #909399;
        }
      }
    }
    
    .user-contact {
      .contact-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        i {
          margin-right: 10px;
          color: #909399;
        }
        
        span {
          color: #606266;
        }
      }
    }
  }
  
  .user-form,
  .pwd-form {
    max-width: 600px;
    margin: 20px auto;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}

// 头像上传
.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    margin-bottom: 15px;
    
    &:hover {
      border-color: #409EFF;
    }
    
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    
    .avatar-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .avatar-tip {
    color: #909399;
    font-size: 12px;
    text-align: center;
  }
}
</style> 