<template>
  <el-dialog 
    :title="user ? '编辑用户' : '新增用户'" 
    :visible.sync="visible" 
    width="600px" 
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="user-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :disabled="user && user.username === 'admin'" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="dept">
            <el-select v-model="form.dept" placeholder="请选择部门" filterable clearable style="width: 100%">
              <el-option 
                v-for="dept in depts" 
                :key="dept.id" 
                :label="dept.name" 
                :value="dept.name" 
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色" prop="role">
            <el-select 
              v-model="form.role" 
              placeholder="请选择角色"
              filterable 
              :disabled="user && user.username === 'admin'"
              style="width: 100%"
            >
              <el-option 
                v-for="role in roles" 
                :key="role.id" 
                :label="role.name" 
                :value="role.name" 
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status" :disabled="user && user.username === 'admin'">
              <el-radio label="1">正常</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleAvatarChange"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="avatar-tips">
              <p class="tips-text">建议尺寸 128x128，支持 JPG、PNG 格式</p>
              <el-button type="text" v-if="avatarUrl" @click="clearAvatar">清空</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row v-if="!user">
        <el-col :span="24">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" show-password clearable />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row v-if="!user">
        <el-col :span="24">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" placeholder="请再次输入密码" show-password clearable />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input 
              v-model="form.remark" 
              type="textarea" 
              :rows="3"
              placeholder="请输入备注信息（选填）" 
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, updateUser } from '@/api/user'

export default {
  name: 'UserForm',
  props: {
    visible: Boolean,
    user: {
      type: Object,
      default: () => null
    },
    roles: {
      type: Array,
      default: () => []
    },
    depts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // 密码验证器
    const validatePassword = (rule, value, callback) => {
      if (!this.user && !value) {
        callback(new Error('请输入密码'))
      } else if (!this.user && value && value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        if (this.form.confirmPassword) {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }
    
    // 确认密码验证器
    const validateConfirmPassword = (rule, value, callback) => {
      if (!this.user && !value) {
        callback(new Error('请再次输入密码'))
      } else if (!this.user && value !== this.form.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (value && !phoneRegex.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    
    // 邮箱验证
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (value && !emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    
    return {
      form: {
        username: '',
        phone: '',
        email: '',
        role: '',
        dept: '',
        status: '1',
        avatar: '',
        password: '',
        confirmPassword: '',
        remark: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        dept: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false,
      avatarFile: null,
      avatarUrl: ''
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(val) {
        if (val) {
          // 编辑用户，填充表单
          this.form = {
            ...val,
            password: '',
            confirmPassword: ''
          }
          this.avatarUrl = val.avatar || ''
        } else {
          // 重置表单
          this.resetForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.form = {
        username: '',
        phone: '',
        email: '',
        role: '',
        dept: '',
        status: '1',
        avatar: '',
        password: '',
        confirmPassword: '',
        remark: ''
      }
      this.avatarUrl = ''
      this.avatarFile = null
      
      // 如果表单已经创建，则重置校验结果
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    
    handleAvatarChange(file) {
      this.avatarFile = file.raw
      this.avatarUrl = URL.createObjectURL(file.raw)
    },
    
    clearAvatar() {
      this.avatarUrl = ''
      this.avatarFile = null
      this.form.avatar = ''
    },
    
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      
      return true
    },
    
    // 处理头像上传
    handleAvatarUpload() {
      if (this.avatarFile) {
        // 实际项目中此处需上传文件到服务器
        // 模拟文件上传成功
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.avatarUrl)
          }, 200)
        })
      } else if (this.avatarUrl) {
        return Promise.resolve(this.avatarUrl)
      } else {
        return Promise.resolve('')
      }
    },
    
    async handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            // 处理头像上传
            const avatarUrl = await this.handleAvatarUpload()
            
            const submitData = {
              ...this.form,
              avatar: avatarUrl
            }
            
            // 删除不需要提交的字段
            delete submitData.confirmPassword
            
            // 模拟API请求
            setTimeout(() => {
              this.$message.success(this.user ? '编辑成功' : '新增成功')
              this.$emit('update:visible', false)
              this.$emit('refresh')
              this.resetForm()
              this.loading = false
            }, 500)
            
            // 实际项目中应该调用API
            // let response
            // if (this.user) {
            //   // 更新用户
            //   response = await updateUser(submitData)
            // } else {
            //   // 创建用户
            //   response = await addUser(submitData)
            // }
            // 
            // if (response.code === 20000) {
            //   this.$message.success(this.user ? '编辑成功' : '新增成功')
            //   this.$emit('update:visible', false)
            //   this.$emit('refresh')
            //   this.resetForm()
            // }
          } catch (error) {
            console.error(this.user ? '编辑用户失败' : '新增用户失败', error)
            this.$message.error(this.user ? '编辑用户失败' : '新增用户失败')
            this.loading = false
          }
        }
      })
    },
    
    handleClose() {
      // 提示有未保存的更改
      if (this.isFormChanged()) {
        this.$confirm('有未保存的更改，确定要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('update:visible', false)
          this.resetForm()
        }).catch(() => {})
      } else {
        this.$emit('update:visible', false)
        this.resetForm()
      }
    },
    
    // 检查表单是否有更改
    isFormChanged() {
      if (this.user) {
        // 对比原始数据和当前表单数据
        const originalData = this.user
        return Object.keys(originalData).some(key => {
          if (key in this.form && key !== 'password' && key !== 'confirmPassword') {
            return originalData[key] !== this.form[key]
          }
          return false
        }) || this.avatarUrl !== (this.user.avatar || '')
      } else {
        // 检查是否输入了任何内容
        return Object.values(this.form).some(value => {
          if (typeof value === 'string') {
            return value.trim() !== ''
          }
          return false
        }) || this.avatarUrl !== ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-form {
  margin: 0 $spacing-md;
  
  .avatar-uploader {
    display: flex;
    
    .avatar-uploader-icon {
      font-size: 28px;
      color: $gray-500;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      border: 1px dashed $gray-300;
      border-radius: $border-radius-base;
      background: $gray-100;
      cursor: pointer;
      
      &:hover {
        border-color: $primary;
        color: $primary;
        background: mix($primary, $white, 5%);
      }
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: $border-radius-base;
      display: block;
      object-fit: cover;
      border: 1px solid $gray-200;
    }
  }
  
  .avatar-tips {
    margin-top: $spacing-sm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .tips-text {
      color: $gray-600;
      font-size: $font-size-xs;
      margin: 0;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 $spacing-lg $spacing-md;
}

// Mobile responsive
@media (max-width: 600px) {
  .el-dialog {
    width: 90% !important;
  }
  
  .el-form-item {
    display: block;
  }
}
</style>
