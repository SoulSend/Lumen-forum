<template>
  <div class="login-prompt">
    <div class="login-prompt-content">
      <span class="material-icons-round">{{ icon }}</span>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="login-prompt-actions">
        <el-button type="primary" @click="handleLogin">
          登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';

// 定义组件属性
const props = defineProps({
  // 提示类型
  type: {
    type: String,
    default: 'default' // 'default', 'create', 'like', 'comment', 'follow'
  },
  // 自定义标题
  customTitle: {
    type: String,
    default: ''
  },
  // 自定义消息
  customMessage: {
    type: String,
    default: ''
  },
  // 自定义图标
  customIcon: {
    type: String,
    default: ''
  },
  // 登录后重定向的路径
  redirectPath: {
    type: String,
    default: ''
  }
});

// 获取用户状态
const userStore = useUserStore();
const router = useRouter();

// 根据类型获取图标
const icon = computed(() => {
  if (props.customIcon) {
    return props.customIcon;
  }
  
  switch (props.type) {
    case 'create':
      return 'post_add';
    case 'like':
      return 'favorite';
    case 'comment':
      return 'comment';
    case 'follow':
      return 'person_add';
    default:
      return 'lock';
  }
});

// 根据类型获取标题
const title = computed(() => {
  if (props.customTitle) {
    return props.customTitle;
  }
  
  switch (props.type) {
    case 'create':
      return '创建内容需要登录';
    case 'like':
      return '点赞收藏需要登录';
    case 'comment':
      return '发表评论需要登录';
    case 'follow':
      return '关注用户需要登录';
    default:
      return '需要登录';
  }
});

// 根据类型获取消息
const message = computed(() => {
  if (props.customMessage) {
    return props.customMessage;
  }
  
  switch (props.type) {
    case 'create':
      return '登录后即可发布帖子、分享内容';
    case 'like':
      return '登录后即可点赞、收藏喜欢的内容';
    case 'comment':
      return '登录后即可参与讨论，发表您的观点';
    case 'follow':
      return '登录后即可关注感兴趣的用户';
    default:
      return '请登录后继续操作';
  }
});

// 登录模态框状态
const showLoginModal = ref(false);

// 处理登录按钮点击
const handleLogin = () => {
  // 在实际项目中，这里应该触发登录模态框
  showLoginModal.value = true;
};
</script>

<style scoped>
.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6);
  background-color: var(--bg-subtle);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-light);
  text-align: center;
  margin: var(--spacing-4) 0;
}

.login-prompt-content {
  max-width: 400px;
}

.login-prompt .material-icons-round {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-4);
}

.login-prompt h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-3);
  color: var(--text-primary);
}

.login-prompt p {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-4);
}

.login-prompt-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-3);
}
</style> 