<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

onMounted(async () => {
  // 初始化用户状态
  userStore.initFromLocalStorage()

  // 如果有token，验证其有效性并获取最新用户信息
  if (userStore.token) {
    await userStore.validateTokenAndFetchUser()
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
