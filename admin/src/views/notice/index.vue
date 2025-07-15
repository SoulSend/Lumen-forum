<template>
  <div class="app-container notice-container">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 通知公告 -->
      <el-tab-pane label="通知公告" name="notice">
        <div class="notice-header">
          <div class="notice-search">
            <el-input
              v-model="noticeQuery.title"
              placeholder="搜索通知标题"
              clearable
              prefix-icon="el-icon-search"
              @keyup.enter.native="searchNotices"
            />
          </div>
          <div class="notice-filter">
            <el-select v-model="noticeQuery.type" placeholder="全部类型" clearable @change="searchNotices">
              <el-option label="全部类型" value=""></el-option>
              <el-option label="通知" value="1"></el-option>
              <el-option label="公告" value="2"></el-option>
            </el-select>
          </div>
          <div class="notice-actions">
            <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchNoticeList">刷新</el-button>
          </div>
        </div>
        
        <el-card v-loading="noticeLoading" class="notice-list">
          <div class="notice-item" v-for="item in noticeList" :key="item.id" @click="viewNoticeDetail(item)">
            <div class="notice-item-header">
              <div class="notice-item-title">
                <el-tag size="mini" :type="item.type === '1' ? 'primary' : 'success'" class="notice-tag">
                  {{ item.type === '1' ? '通知' : '公告' }}
                </el-tag>
                <span class="title-text">{{ item.title }}</span>
              </div>
              <div class="notice-item-time">{{ item.createTime }}</div>
            </div>
            <div class="notice-item-content">{{ item.content }}</div>
            <div class="notice-item-footer">
              <span class="notice-author">发布人：{{ item.createBy }}</span>
              <el-button type="text" size="mini" @click.stop="viewNoticeDetail(item)">查看详情</el-button>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="noticeList.length === 0 && !noticeLoading" class="empty-state">
            <i class="el-icon-chat-dot-square empty-icon"></i>
            <p class="empty-text">暂无通知公告</p>
          </div>
          
          <!-- 分页 -->
          <div class="pagination-container" v-if="noticeList.length > 0">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="noticeQuery.pageSize"
              :current-page="noticeQuery.pageNum"
              :total="noticeTotal"
              @size-change="handleNoticeSizeChange"
              @current-change="handleNoticeCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
      </el-tab-pane>
      
      <!-- 我的消息 -->
      <el-tab-pane label="我的消息" name="message">
        <div class="message-header">
          <div class="message-filter">
            <el-radio-group v-model="messageFilter" size="small" @change="filterMessages">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="unread">未读</el-radio-button>
              <el-radio-button label="read">已读</el-radio-button>
            </el-radio-group>
          </div>
          <div class="message-actions">
            <el-button type="primary" size="small" plain icon="el-icon-check" @click="markAllRead">全部已读</el-button>
            <el-button type="danger" size="small" plain icon="el-icon-delete" @click="clearMessages">清空消息</el-button>
          </div>
        </div>
        
        <el-card v-loading="messageLoading" class="message-list">
          <div class="message-item" 
               v-for="item in messageList" 
               :key="item.id" 
               :class="{ 'unread': !item.isRead }"
               @click="readMessage(item)">
            <div class="message-item-header">
              <div class="message-item-title">
                <div class="unread-dot" v-if="!item.isRead"></div>
                <span class="title-text">{{ item.title }}</span>
              </div>
              <div class="message-item-time">{{ item.createTime }}</div>
            </div>
            <div class="message-item-content">{{ item.content }}</div>
            <div class="message-item-footer">
              <el-button type="text" size="mini" @click.stop="readMessage(item)">
                {{ item.isRead ? '查看详情' : '标记已读' }}
              </el-button>
              <el-button type="text" size="mini" @click.stop="deleteMessage(item)">删除</el-button>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="messageList.length === 0 && !messageLoading" class="empty-state">
            <i class="el-icon-message empty-icon"></i>
            <p class="empty-text">暂无消息</p>
          </div>
          
          <!-- 分页 -->
          <div class="pagination-container" v-if="messageList.length > 0">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="messageQuery.pageSize"
              :current-page="messageQuery.pageNum"
              :total="messageTotal"
              @size-change="handleMessageSizeChange"
              @current-change="handleMessageCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 通知详情对话框 -->
    <el-dialog :title="currentNotice.title" :visible.sync="noticeDialogVisible" width="600px">
      <div class="notice-detail">
        <div class="notice-detail-header">
          <div class="notice-detail-meta">
            <span class="notice-detail-type">
              <el-tag size="small" :type="currentNotice.type === '1' ? 'primary' : 'success'">
                {{ currentNotice.type === '1' ? '通知' : '公告' }}
              </el-tag>
            </span>
            <span class="notice-detail-author">发布人：{{ currentNotice.createBy }}</span>
            <span class="notice-detail-time">发布时间：{{ currentNotice.createTime }}</span>
          </div>
        </div>
        <div class="notice-detail-content" v-html="currentNotice.content"></div>
        <div class="notice-detail-footer" v-if="currentNotice.remark">
          <div class="notice-detail-remark">
            <span class="remark-label">备注：</span>
            <span class="remark-content">{{ currentNotice.remark }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 消息详情对话框 -->
    <el-dialog :title="currentMessage.title" :visible.sync="messageDialogVisible" width="500px">
      <div class="message-detail">
        <div class="message-detail-time">{{ currentMessage.createTime }}</div>
        <div class="message-detail-content">{{ currentMessage.content }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">关闭</el-button>
        <el-button type="danger" @click="deleteMessageAndClose">删除</el-button>
      </span>
    </el-dialog>
    
    <!-- 清空消息确认对话框 -->
    <el-dialog title="清空消息" :visible.sync="clearDialogVisible" width="400px">
      <div class="clear-dialog-content">
        <i class="el-icon-warning warning-icon"></i>
        <span>确定要清空所有消息吗？此操作不可恢复！</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmClear">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNoticeList, getNoticeDetail, getUserNoticeList, readNotice } from '@/api/notice'

export default {
  name: 'Notice',
  data() {
    return {
      activeTab: 'notice',
      
      // 通知公告
      noticeQuery: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        type: ''
      },
      noticeList: [],
      noticeTotal: 0,
      noticeLoading: false,
      currentNotice: {},
      noticeDialogVisible: false,
      
      // 我的消息
      messageFilter: 'all',
      messageQuery: {
        pageNum: 1,
        pageSize: 10,
        isRead: ''
      },
      messageList: [],
      messageTotal: 0,
      messageLoading: false,
      currentMessage: {},
      messageDialogVisible: false,
      clearDialogVisible: false
    }
  },
  created() {
    this.fetchNoticeList()
    this.fetchMessageList()
  },
  methods: {
    // 通知公告相关方法
    async fetchNoticeList() {
      this.noticeLoading = true
      try {
        // 模拟数据
        setTimeout(() => {
          const list = []
          const total = 23
          const types = ['1', '2']
          const authors = ['管理员', '系统', '技术部']
          
          for (let i = 0; i < this.noticeQuery.pageSize; i++) {
            const index = (this.noticeQuery.pageNum - 1) * this.noticeQuery.pageSize + i
            if (index >= total) break
            
            const date = new Date()
            date.setDate(date.getDate() - Math.floor(Math.random() * 30))
            const type = types[Math.floor(Math.random() * types.length)]
            const author = authors[Math.floor(Math.random() * authors.length)]
            
            list.push({
              id: index + 1,
              title: `${type === '1' ? '通知' : '公告'}：${['系统升级', '功能上线', '维护公告', '重要提醒'][Math.floor(Math.random() * 4)]} ${index + 1}`,
              type,
              content: `这是一条${type === '1' ? '通知' : '公告'}内容，详细描述了${['系统升级', '功能上线', '维护公告', '重要提醒'][Math.floor(Math.random() * 4)]}的相关信息。`,
              createBy: author,
              createTime: this.formatDateTime(date),
              remark: Math.random() > 0.5 ? '请相关人员注意' : ''
            })
          }
          
          this.noticeList = list
          this.noticeTotal = total
          this.noticeLoading = false
        }, 500)
        
        // 实际项目中，这里应该调用API获取通知列表
        // const res = await getNoticeList(this.noticeQuery)
        // this.noticeList = res.data.list
        // this.noticeTotal = res.data.total
      } catch (error) {
        console.error('获取通知列表失败', error)
        this.$message.error('获取通知列表失败')
      } finally {
        this.noticeLoading = false
      }
    },
    searchNotices() {
      this.noticeQuery.pageNum = 1
      this.fetchNoticeList()
    },
    handleNoticeSizeChange(size) {
      this.noticeQuery.pageSize = size
      this.fetchNoticeList()
    },
    handleNoticeCurrentChange(page) {
      this.noticeQuery.pageNum = page
      this.fetchNoticeList()
    },
    viewNoticeDetail(notice) {
      this.currentNotice = notice
      this.noticeDialogVisible = true
      
      // 实际项目中，这里应该调用API获取通知详情
      // getNoticeDetail(notice.id).then(res => {
      //   this.currentNotice = res.data
      // })
    },
    
    // 我的消息相关方法
    async fetchMessageList() {
      this.messageLoading = true
      try {
        // 模拟数据
        setTimeout(() => {
          const list = []
          const total = 18
          const isReadFilter = this.messageQuery.isRead
          
          for (let i = 0; i < this.messageQuery.pageSize; i++) {
            const index = (this.messageQuery.pageNum - 1) * this.messageQuery.pageSize + i
            if (index >= total) break
            
            const date = new Date()
            date.setDate(date.getDate() - Math.floor(Math.random() * 30))
            const isRead = Math.random() > 0.3
            
            // 根据过滤条件跳过
            if (isReadFilter === '1' && !isRead) continue
            if (isReadFilter === '0' && isRead) continue
            
            list.push({
              id: index + 1,
              title: `${['系统通知', '任务提醒', '消息提醒', '安全提醒'][Math.floor(Math.random() * 4)]} ${index + 1}`,
              content: `这是一条${['系统通知', '任务提醒', '消息提醒', '安全提醒'][Math.floor(Math.random() * 4)]}内容，请注意查看。`,
              isRead,
              createTime: this.formatDateTime(date)
            })
          }
          
          this.messageList = list
          this.messageTotal = total
          this.messageLoading = false
        }, 500)
        
        // 实际项目中，这里应该调用API获取消息列表
        // const res = await getUserNoticeList(this.messageQuery)
        // this.messageList = res.data.list
        // this.messageTotal = res.data.total
      } catch (error) {
        console.error('获取消息列表失败', error)
        this.$message.error('获取消息列表失败')
      } finally {
        this.messageLoading = false
      }
    },
    filterMessages() {
      switch (this.messageFilter) {
        case 'unread':
          this.messageQuery.isRead = '0'
          break
        case 'read':
          this.messageQuery.isRead = '1'
          break
        default:
          this.messageQuery.isRead = ''
      }
      this.messageQuery.pageNum = 1
      this.fetchMessageList()
    },
    handleMessageSizeChange(size) {
      this.messageQuery.pageSize = size
      this.fetchMessageList()
    },
    handleMessageCurrentChange(page) {
      this.messageQuery.pageNum = page
      this.fetchMessageList()
    },
    readMessage(message) {
      if (!message.isRead) {
        // 标记为已读
        message.isRead = true
        
        // 实际项目中，这里应该调用API标记消息为已读
        // readNotice(message.id).then(() => {
        //   this.$message.success('标记已读成功')
        // })
      }
      
      this.currentMessage = message
      this.messageDialogVisible = true
    },
    deleteMessage(message) {
      this.$confirm('确定要删除这条消息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟删除成功
        this.messageList = this.messageList.filter(item => item.id !== message.id)
        this.$message.success('删除成功')
        
        // 实际项目中，这里应该调用API删除消息
        // deleteMessage(message.id).then(() => {
        //   this.fetchMessageList()
        // })
      }).catch(() => {})
    },
    deleteMessageAndClose() {
      this.deleteMessage(this.currentMessage)
      this.messageDialogVisible = false
    },
    markAllRead() {
      this.$confirm('确定要将所有消息标记为已读吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 模拟标记全部已读
        this.messageList.forEach(item => {
          item.isRead = true
        })
        this.$message.success('已全部标记为已读')
        
        // 实际项目中，这里应该调用API标记全部已读
        // readAllNotice().then(() => {
        //   this.fetchMessageList()
        // })
      }).catch(() => {})
    },
    clearMessages() {
      this.clearDialogVisible = true
    },
    confirmClear() {
      // 模拟清空成功
      this.messageList = []
      this.messageTotal = 0
      this.clearDialogVisible = false
      this.$message.success('清空成功')
      
      // 实际项目中，这里应该调用API清空消息
      // clearUserNotice().then(() => {
      //   this.fetchMessageList()
      // })
    },
    formatDateTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-container {
  padding: 20px;
  
  .notice-header,
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .notice-search {
      width: 250px;
    }
    
    .notice-filter,
    .message-filter {
      margin: 0 20px;
    }
  }
  
  .notice-list,
  .message-list {
    margin-bottom: 20px;
    
    .notice-item,
    .message-item {
      padding: 15px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f9f9f9;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      &.unread {
        background-color: #f0f9ff;
        
        &:hover {
          background-color: #ecf5ff;
        }
      }
      
      .notice-item-header,
      .message-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        
        .notice-item-title,
        .message-item-title {
          display: flex;
          align-items: center;
          
          .notice-tag {
            margin-right: 10px;
          }
          
          .unread-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #409EFF;
            margin-right: 10px;
          }
          
          .title-text {
            font-size: 16px;
            font-weight: 500;
            color: #303133;
          }
        }
        
        .notice-item-time,
        .message-item-time {
          font-size: 12px;
          color: #909399;
        }
      }
      
      .notice-item-content,
      .message-item-content {
        margin-bottom: 10px;
        color: #606266;
        font-size: 14px;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      
      .notice-item-footer,
      .message-item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .notice-author {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
  
  .empty-state {
    padding: 40px 0;
    text-align: center;
    
    .empty-icon {
      font-size: 60px;
      color: #909399;
    }
    
    .empty-text {
      margin-top: 10px;
      font-size: 14px;
      color: #909399;
    }
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
  
  .notice-detail {
    .notice-detail-header {
      margin-bottom: 20px;
      
      .notice-detail-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 10px;
        color: #909399;
        font-size: 14px;
      }
    }
    
    .notice-detail-content {
      padding: 20px 0;
      line-height: 1.8;
      color: #303133;
      font-size: 14px;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
    
    .notice-detail-footer {
      margin-top: 20px;
      
      .notice-detail-remark {
        color: #606266;
        font-size: 14px;
        
        .remark-label {
          font-weight: bold;
        }
      }
    }
  }
  
  .message-detail {
    .message-detail-time {
      text-align: right;
      color: #909399;
      font-size: 12px;
      margin-bottom: 15px;
    }
    
    .message-detail-content {
      line-height: 1.8;
      color: #303133;
      font-size: 14px;
    }
  }
  
  .clear-dialog-content {
    display: flex;
    align-items: center;
    
    .warning-icon {
      font-size: 24px;
      color: #E6A23C;
      margin-right: 10px;
    }
  }
}
</style>
