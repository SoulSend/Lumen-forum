/**
 * 用户状态管理模块
 * 
 * 功能说明：
 * 1. 用户登录、登出逻辑
 * 2. 获取用户信息
 * 3. 重置令牌
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-05-20
 */

import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import logger from '@/utils/logger'

// 初始状态
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置状态
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置令牌
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 设置用户名
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 设置头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 设置角色
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          
          // 记录登录成功日志
          logger.info('用户登录', {
            username,
            time: new Date().toISOString()
          })
          
          resolve()
        })
        .catch(error => {
          // 记录登录失败日志
          logger.warn('登录失败', {
            username,
            error: error.message,
            time: new Date().toISOString()
          })
          
          reject(error)
        })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response
          
          if (!data) {
            reject(new Error('验证失败，请重新登录'))
          }
          
          const { roles, username, avatar } = data
          
          // 角色必须是非空数组
          if (!roles || roles.length <= 0) {
            reject(new Error('用户角色必须是非空数组!'))
          }
          
          commit('SET_ROLES', roles)
          commit('SET_NAME', username)
          commit('SET_AVATAR', avatar)
          
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 用户登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken() // 必须先移除token
          resetRouter()
          commit('RESET_STATE')
          
          // 记录登出日志
          logger.info('用户登出', {
            time: new Date().toISOString()
          })
          
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 重置令牌
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先移除token
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}



