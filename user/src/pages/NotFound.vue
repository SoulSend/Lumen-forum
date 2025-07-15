<template>
  <main-layout>
    <div class="not-found-page">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面不存在</h2>
        <p class="error-message">您访问的页面可能已被删除、移动或从未存在过</p>
        <router-link to="/">
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </div>
    </div>
  </main-layout>
</template>

<script setup lang="ts">
import MainLayout from '../components/layout/MainLayout.vue'
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 250px);
}

.not-found-content {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.error-message {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

@media (max-width: 576px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
}
</style> 