/**
 * 用户相关API接口
 * 
 * 功能说明：
 * 1. 用户认证相关接口（登录、登出、刷新令牌）
 * 2. 用户信息获取与修改接口
 * 3. 用户管理相关接口（仅管理员可用）
 * 
 * @author HRC Team
 * @version 1.1.0
 * @date 2024-05-20
 */

import request from '@/utils/request'
import { getToken } from '@/utils/auth'

/**
 * 用户登录
 * @param {Object} data 登录参数
 * @returns {Promise} 返回登录结果的Promise对象
 * 
 * @example 响应数据结构
 * {
 *   code: 20000,
 *   data: {
 *     token: 'admin-token'
 *   }
 * }
 */
export function login(data) {
  // 模拟登录接口，实际项目中应该调用真实接口
  if (data.username === 'admin') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 20000,
          data: {
            token: 'admin-token'
          }
        })
      }, 300)
    })
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('用户名或密码错误'))
      }, 300)
    })
  }

  // 实际请求地址，需要替换为真实接口
  // return request({
  //   url: '/api/auth/login',
  //   method: 'post',
  //   data
  // })
}

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息的Promise对象
 * 
 * @example 响应数据结构
 * {
 *   code: 20000,
 *   data: {
 *     roles: ['admin'],
 *     name: 'Admin',
 *     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
 *   }
 * }
 */
export function getInfo() {
  // 模拟获取用户信息接口，实际项目中应该调用真实接口
  const token = getToken()
  if (token === 'admin-token') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 20000,
          data: {
            roles: ['admin'],
            name: 'Admin',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          }
        })
      }, 300)
    })
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('获取用户信息失败，请重新登录'))
      }, 300)
    })
  }

  // 实际请求地址，需要替换为真实接口
  // return request({
  //   url: '/api/auth/info',
  //   method: 'get'
  // })
}

/**
 * 用户登出
 * @returns {Promise} 返回登出结果的Promise对象
 * 
 * @example 响应数据结构
 * {
 *   code: 20000,
 *   message: '退出成功'
 * }
 */
export function logout() {
  // 为admin用户提供模拟登出功能
  const token = getToken()
  if (token === 'admin-token') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 20000,
          message: '退出成功'
        })
      }, 300)
    })
  }
  
  // 实际请求地址，需要替换为真实接口
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
  // 接口返回数据格式：
  // {
  //   code: 20000,
  //   message: '退出成功'
  // }
}

/**
 * 获取用户列表
 * @param {Object} query 查询参数
 * @returns {Promise} 返回用户列表的Promise对象
 */
export function getUserList(query) {
  return request({
    url: '/api/system/user/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户详情
 * @param {number} userId 用户ID
 * @returns {Promise} 返回用户详情的Promise对象
 */
export function getUserDetail(userId) {
  return request({
    url: `/api/system/user/${userId}`,
    method: 'get'
  })
}

/**
 * 新增用户
 * @param {Object} data 用户数据
 * @returns {Promise} 返回新增结果的Promise对象
 */
export function addUser(data) {
  return request({
    url: '/api/system/user',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param {Object} data 用户数据
 * @returns {Promise} 返回修改结果的Promise对象
 */
export function updateUser(data) {
  return request({
    url: '/api/system/user',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {number|string} userId 用户ID
 * @returns {Promise} 返回删除结果的Promise对象
 */
export function deleteUser(userId) {
  return request({
    url: `/api/system/user/${userId}`,
    method: 'delete'
  })
}

/**
 * 修改用户状态
 * @param {number|string} userId 用户ID
 * @param {string} status 状态（0=禁用，1=正常）
 * @returns {Promise} 返回修改结果的Promise对象
 */
export function changeUserStatus(userId, status) {
  return request({
    url: `/api/system/user/changeStatus`,
    method: 'put',
    data: {
      userId,
      status
    }
  })
}

/**
 * 重置用户密码
 * @param {number|string} userId 用户ID
 * @param {string} password 新密码
 * @returns {Promise} 返回重置结果的Promise对象
 */
export function resetUserPassword(userId, password) {
  return request({
    url: `/api/system/user/resetPassword`,
    method: 'put',
    data: {
      userId,
      password
    }
  })
}

/**
 * 更新用户个人资料
 * @param {Object} data 用户个人资料
 * @returns {Promise} 返回更新结果的Promise对象
 */
export function updateUserProfile(data) {
  return request({
    url: '/api/system/user/profile',
    method: 'put',
    data
  })
}

/**
 * 更新用户密码
 * @param {Object} data 密码信息
 * @returns {Promise} 返回更新结果的Promise对象
 */
export function updateUserPassword(data) {
  return request({
    url: '/api/system/user/profile/updatePwd',
    method: 'put',
    data
  })
}

/**
 * 更新用户头像
 * @param {FormData} data 头像文件数据
 * @returns {Promise} 返回更新结果的Promise对象
 */
export function updateUserAvatar(data) {
  return request({
    url: '/api/system/user/profile/avatar',
    method: 'post',
    data
  })
}

/**
 * 获取角色列表
 * @returns {Promise} 返回角色列表的Promise对象
 * 
 * @example 响应数据结构
 * {
 *   code: 20000,
 *   data: [
 *     {
 *       id: 1,
 *       name: '管理员',
 *       key: 'admin',
 *       status: '1',
 *       createTime: '2023-01-01 00:00:00'
 *     },
 *     // ...更多角色
 *   ]
 * }
 */
export function getRoleList() {
  // 模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: [
          {
            id: 1,
            name: '管理员',
            key: 'admin',
            status: '1',
            createTime: '2023-01-01 00:00:00'
          },
          {
            id: 2,
            name: '普通用户',
            key: 'user',
            status: '1',
            createTime: '2023-01-01 00:00:00'
          },
          {
            id: 3,
            name: '访客',
            key: 'visitor',
            status: '1',
            createTime: '2023-01-01 00:00:00'
          }
        ]
      })
    }, 300)
  })
  
  // 实际请求地址，需要替换为真实接口
  // return request({
  //   url: '/api/role/list',
  //   method: 'get'
  // })
}

/**
 * 获取部门列表
 * @returns {Promise} 返回部门列表的Promise对象
 * 
 * @example 响应数据结构
 * {
 *   code: 20000,
 *   data: [
 *     {
 *       id: 1,
 *       name: '总公司',
 *       parentId: 0,
 *       leader: '张三',
 *       status: '1'
 *     },
 *     // ...更多部门
 *   ]
 * }
 */
export function getDeptList() {
  // 模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: [
          {
            id: 1,
            name: '总公司',
            parentId: 0,
            leader: '张三',
            status: '1'
          },
          {
            id: 2,
            name: '研发部',
            parentId: 1,
            leader: '李四',
            status: '1'
          },
          {
            id: 3,
            name: '市场部',
            parentId: 1,
            leader: '王五',
            status: '1'
          },
          {
            id: 4,
            name: '财务部',
            parentId: 1,
            leader: '赵六',
            status: '1'
          }
        ]
      })
    }, 300)
  })
  
  // 实际请求地址，需要替换为真实接口
  // return request({
  //   url: '/api/dept/list',
  //   method: 'get'
  // })
}
