/**
 * 通知中心API接口
 * 
 * 功能说明：
 * 1. 通知公告查询
 * 2. 通知公告管理
 * 3. 用户消息管理
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-05-20
 */

import request from '@/utils/request'

/**
 * 获取通知公告列表
 * @param {Object} query 查询参数
 * @returns {Promise} 返回通知公告列表的Promise对象
 */
export function getNoticeList(query) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取通知公告详情
 * @param {number} noticeId 通知公告ID
 * @returns {Promise} 返回通知公告详情的Promise对象
 */
export function getNoticeDetail(id) {
  return request({
    url: `/notice/${id}`,
    method: 'get'
  })
}

/**
 * 新增通知公告
 * @param {Object} data 通知公告数据
 * @returns {Promise} 返回新增结果的Promise对象
 */
export function addNotice(data) {
  return request({
    url: '/api/system/notice',
    method: 'post',
    data
  })
}

/**
 * 修改通知公告
 * @param {Object} data 通知公告数据
 * @returns {Promise} 返回修改结果的Promise对象
 */
export function updateNotice(data) {
  return request({
    url: '/api/system/notice',
    method: 'put',
    data
  })
}

/**
 * 删除通知公告
 * @param {number|string} noticeId 通知公告ID
 * @returns {Promise} 返回删除结果的Promise对象
 */
export function deleteNotice(noticeId) {
  return request({
    url: `/api/system/notice/${noticeId}`,
    method: 'delete'
  })
}

/**
 * 获取用户消息列表
 * @param {Object} query 查询参数
 * @returns {Promise} 返回用户消息列表的Promise对象
 */
export function getUserNoticeList(query) {
  return request({
    url: '/notice/user/list',
    method: 'get',
    params: query
  })
}

/**
 * 标记消息已读
 * @param {number|string} noticeId 消息ID
 * @returns {Promise} 返回标记结果的Promise对象
 */
export function readNotice(id) {
  return request({
    url: `/notice/read/${id}`,
    method: 'put'
  })
}

/**
 * 标记所有消息已读
 * @returns {Promise} 返回标记结果的Promise对象
 */
export function readAllNotice() {
  return request({
    url: '/notice/read/all',
    method: 'put'
  })
}

/**
 * 删除用户消息
 * @param {number|string} noticeId 消息ID
 * @returns {Promise} 返回删除结果的Promise对象
 */
export function deleteUserNotice(noticeId) {
  return request({
    url: `/api/system/notice/user/${noticeId}`,
    method: 'delete'
  })
}

/**
 * 清空用户消息
 * @returns {Promise} 返回清空结果的Promise对象
 */
export function clearUserNotice() {
  return request({
    url: '/notice/clear',
    method: 'delete'
  })
}

/**
 * 获取未读消息数量
 * @returns {Promise} 返回未读消息数量的Promise对象
 */
export function getUnreadCount() {
  return request({
    url: '/api/system/notice/unread/count',
    method: 'get'
  })
}

/**
 * 删除消息
 * @param {number|string} noticeId 消息ID
 * @returns {Promise} 返回删除结果的Promise对象
 */
export function deleteMessage(id) {
  return request({
    url: `/notice/${id}`,
    method: 'delete'
  })
} 