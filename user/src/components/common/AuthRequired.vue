<template>
  <div>
    <div v-if="hasPermission">
      <slot></slot>
    </div>
    <div v-else>
      <slot name="fallback">
        <div class="auth-required-fallback">
          <div class="auth-required-message">
            <span class="material-icons-round">lock</span>
            <p>{{ message }}</p>
            <el-button type="primary" size="small" @click="handleLogin" v-if="!isAuthenticated">
              登录
            </el-button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '../../stores/userStore';
import { checkPermission, PermissionLevel, canEditResource, canDeleteResource, isResourceOwner } from '../../utils/permission';

// 定义组件属性
const props = defineProps({
  // 权限级别
  level: {
    type: String,
    default: 'user'
  },
  // 权限类型
  type: {
    type: String,
    default: 'level' // 'level', 'edit', 'delete', 'owner'
  },
  // 资源所有者ID
  resourceUserId: {
    type: Number,
    default: undefined
  },
  // 自定义消息
  customMessage: {
    type: String,
    default: ''
  }
});

// 获取用户状态
const userStore = useUserStore();
const isAuthenticated = computed(() => userStore.isAuthenticated);

// 检查权限
const hasPermission = computed(() => {
  if (props.type === 'level') {
    return checkPermission(props.level as PermissionLevel);
  } else if (props.type === 'edit') {
    return canEditResource(props.resourceUserId);
  } else if (props.type === 'delete') {
    return canDeleteResource(props.resourceUserId);
  } else if (props.type === 'owner') {
    return isResourceOwner(props.resourceUserId);
  }
  return false;
});

// 获取显示消息
const message = computed(() => {
  if (props.customMessage) {
    return props.customMessage;
  }
  
  if (!isAuthenticated.value) {
    return '您需要登录才能访问此内容';
  }
  
  if (props.type === 'owner') {
    return '只有内容创建者才能执行此操作';
  } else if (props.type === 'edit' || props.type === 'delete') {
    return '您没有权限执行此操作';
  } else {
    return '您的权限不足，无法访问此内容';
  }
});

// 登录模态框状态
const showLoginModal = ref(false);

// 处理登录按钮点击
const handleLogin = () => {
  // 触发登录模态框显示
  // 这里可以通过事件总线或其他方式触发登录模态框
  showLoginModal.value = true;
};
</script>

<style scoped>
.auth-required-fallback {
  padding: var(--spacing-4);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-light);
}

.auth-required-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-4);
}

.auth-required-message .material-icons-round {
  font-size: 32px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-3);
}

.auth-required-message p {
  margin-bottom: var(--spacing-3);
  color: var(--text-secondary);
}
</style> 