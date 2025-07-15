<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

onMounted(() => {
  // 初始化用户状态
  userStore.initFromLocalStorage()
  
  // 如果有token但没有当前用户信息，则获取用户信息
  if (userStore.token && !userStore.currentUser) {
    userStore.fetchCurrentUser()
  }
})
</script>

<template>
  <router-view />
</template>

<style>
@import './assets/base.css';
@import './assets/main.css';
</style>
