<!--
 * 系统设置页面
 * 
 * 功能说明：
 * 1. 系统基础配置管理
 * 2. 界面显示设置
 * 3. 安全配置
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-05-20
 -->

<template>
  <div class="app-container">
    <el-card class="setting-card">
      <div slot="header" class="card-header">
        <span>系统设置</span>
      </div>
      
      <el-tabs v-model="activeTab">
        <!-- 基础设置 -->
        <el-tab-pane label="基础设置" name="basic">
          <el-form ref="basicForm" :model="basicForm" :rules="basicRules" label-width="120px">
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="basicForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            
            <el-form-item label="系统Logo">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
                :http-request="uploadLogo"
              >
                <img v-if="basicForm.logo" :src="basicForm.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="upload-tip">建议尺寸：120px * 120px，支持jpg、png格式</div>
            </el-form-item>
            
            <el-form-item label="系统描述" prop="description">
              <el-input 
                v-model="basicForm.description" 
                type="textarea" 
                :rows="3"
                placeholder="请输入系统描述" 
              />
            </el-form-item>
            
            <el-form-item label="管理员邮箱" prop="adminEmail">
              <el-input v-model="basicForm.adminEmail" placeholder="请输入管理员邮箱" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings" :loading="loading.basic">保存设置</el-button>
              <el-button @click="resetBasicForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 界面设置 -->
        <el-tab-pane label="界面设置" name="ui">
          <el-form ref="uiForm" :model="uiForm" label-width="120px">
            <el-form-item label="主题颜色">
              <el-color-picker v-model="uiForm.primaryColor" show-alpha />
            </el-form-item>
            
            <el-form-item label="侧边栏主题">
              <el-radio-group v-model="uiForm.sideTheme">
                <el-radio label="dark">暗色主题</el-radio>
                <el-radio label="light">亮色主题</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="菜单布局">
              <el-radio-group v-model="uiForm.layout">
                <el-radio label="left">左侧菜单</el-radio>
                <el-radio label="top">顶部菜单</el-radio>
                <el-radio label="mix">混合菜单</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="标签页显示">
              <el-switch v-model="uiForm.tagsView" />
            </el-form-item>
            
            <el-form-item label="固定头部">
              <el-switch v-model="uiForm.fixedHeader" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveUiSettings" :loading="loading.ui">保存设置</el-button>
              <el-button @click="resetUiForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form ref="securityForm" :model="securityForm" :rules="securityRules" label-width="160px">
            <el-form-item label="密码最小长度" prop="passwordLength">
              <el-input-number v-model="securityForm.passwordLength" :min="6" :max="20" />
            </el-form-item>
            
            <el-form-item label="密码强度要求">
              <el-checkbox-group v-model="securityForm.passwordRequirements">
                <el-checkbox label="number">必须包含数字</el-checkbox>
                <el-checkbox label="lowercase">必须包含小写字母</el-checkbox>
                <el-checkbox label="uppercase">必须包含大写字母</el-checkbox>
                <el-checkbox label="special">必须包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item label="密码过期时间(天)" prop="passwordExpireDays">
              <el-input-number v-model="securityForm.passwordExpireDays" :min="0" :max="365" />
              <span class="form-tip">设置为0表示永不过期</span>
            </el-form-item>
            
            <el-form-item label="登录失败锁定阈值" prop="loginFailLimit">
              <el-input-number v-model="securityForm.loginFailLimit" :min="0" :max="10" />
              <span class="form-tip">设置为0表示不锁定</span>
            </el-form-item>
            
            <el-form-item label="锁定时间(分钟)" prop="lockTime">
              <el-input-number v-model="securityForm.lockTime" :min="1" :max="1440" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings" :loading="loading.security">保存设置</el-button>
              <el-button @click="resetSecurityForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
/**
 * 系统设置页面组件
 */
export default {
  name: 'Setting',
  data() {
    return {
      // 当前激活的标签页
      activeTab: 'basic',
      
      // 加载状态
      loading: {
        basic: false,
        ui: false,
        security: false
      },
      
      // 基础设置表单
      basicForm: {
        systemName: 'HRC管理系统',
        logo: '',
        description: '一个功能完善的后台管理系统',
        adminEmail: 'admin@example.com'
      },
      
      // 基础设置表单验证规则
      basicRules: {
        systemName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        adminEmail: [
          { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      
      // 界面设置表单
      uiForm: {
        primaryColor: '#409EFF',
        sideTheme: 'dark',
        layout: 'left',
        tagsView: true,
        fixedHeader: true
      },
      
      // 安全设置表单
      securityForm: {
        passwordLength: 8,
        passwordRequirements: ['number', 'lowercase'],
        passwordExpireDays: 90,
        loginFailLimit: 5,
        lockTime: 30
      },
      
      // 安全设置表单验证规则
      securityRules: {
        passwordLength: [
          { required: true, message: '请设置密码最小长度', trigger: 'blur' }
        ],
        passwordExpireDays: [
          { required: true, message: '请设置密码过期时间', trigger: 'blur' }
        ],
        loginFailLimit: [
          { required: true, message: '请设置登录失败锁定阈值', trigger: 'blur' }
        ],
        lockTime: [
          { required: true, message: '请设置锁定时间', trigger: 'blur' }
        ]
      }
    }
  },
  
  created() {
    // 加载设置数据
    this.loadSettings()
  },
  
  methods: {
    /**
     * 加载设置数据
     */
    loadSettings() {
      // 这里应该从后端API获取设置数据
      // 目前使用模拟数据
      console.log('加载系统设置')
    },
    
    /**
     * Logo上传前的验证
     * @param {File} file - 上传的文件
     * @returns {boolean} 是否通过验证
     */
    beforeLogoUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isJPG && !isPNG) {
        this.$message.error('上传Logo只能是 JPG 或 PNG 格式!')
        return false
      }
      
      if (!isLt2M) {
        this.$message.error('上传Logo大小不能超过 2MB!')
        return false
      }
      
      return true
    },
    
    /**
     * 上传Logo
     * @param {Object} options - 上传选项
     */
    uploadLogo(options) {
      // 模拟上传
      const file = options.file
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.basicForm.logo = reader.result
      }
    },
    
    /**
     * 保存基础设置
     */
    saveBasicSettings() {
      this.$refs.basicForm.validate(valid => {
        if (valid) {
          this.loading.basic = true
          
          // 模拟API请求
          setTimeout(() => {
            this.loading.basic = false
            this.$message.success('基础设置保存成功')
            console.log('保存基础设置:', this.basicForm)
          }, 500)
        }
      })
    },
    
    /**
     * 重置基础设置表单
     */
    resetBasicForm() {
      this.$refs.basicForm.resetFields()
    },
    
    /**
     * 保存界面设置
     */
    saveUiSettings() {
      this.loading.ui = true
      
      // 模拟API请求
      setTimeout(() => {
        this.loading.ui = false
        this.$message.success('界面设置保存成功')
        console.log('保存界面设置:', this.uiForm)
      }, 500)
    },
    
    /**
     * 重置界面设置表单
     */
    resetUiForm() {
      this.uiForm = {
        primaryColor: '#409EFF',
        sideTheme: 'dark',
        layout: 'left',
        tagsView: true,
        fixedHeader: true
      }
    },
    
    /**
     * 保存安全设置
     */
    saveSecuritySettings() {
      this.$refs.securityForm.validate(valid => {
        if (valid) {
          this.loading.security = true
          
          // 模拟API请求
          setTimeout(() => {
            this.loading.security = false
            this.$message.success('安全设置保存成功')
            console.log('保存安全设置:', this.securityForm)
          }, 500)
        }
      })
    },
    
    /**
     * 重置安全设置表单
     */
    resetSecurityForm() {
      this.$refs.securityForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background-color: #f6f8fa;
}

.setting-card {
  margin-bottom: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  
  &:hover {
    border-color: #409EFF;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 5px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}
</style>
