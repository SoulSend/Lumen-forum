<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'
// @ts-ignore
import MainLayout from './components/layout/MainLayout.vue'

const userStore = useUserStore()

onMounted(async () => {
  // 初始化用户状态（同步操作，不阻塞渲染）
  userStore.initFromLocalStorage()

  // 延迟验证token，避免阻塞首屏渲染
  if (userStore.token) {
    setTimeout(() => {
      userStore.validateTokenAndFetchUser()
    }, 100)
  }
})
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<style>
@import './assets/base.css';
@import './assets/main.css';
</style>
