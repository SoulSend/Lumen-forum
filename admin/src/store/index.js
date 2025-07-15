/**
 * Vuex状态管理配置
 * 
 * 功能说明：
 * 1. 配置Vuex store实例
 * 2. 注册各个功能模块
 * 3. 配置全局getters
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-01-15
 */

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

// 引入各个功能模块
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

// 注册Vuex
Vue.use(Vuex)

/**
 * 创建Vuex store实例
 */
const store = new Vuex.Store({
  // 注册模块
  modules: {
    app,      // 应用状态模块
    settings, // 设置状态模块
    user      // 用户状态模块
  },
  // 全局getters
  getters
})

export default store
