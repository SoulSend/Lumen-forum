<template>
  <div class="dashboard-main">
    <div class="dashboard-header">
      <div class="header-title">仪表盘</div>
      <div class="header-actions">
        <el-button 
          size="small" 
          icon="el-icon-refresh" 
          @click="refreshAllData" 
          :loading="isRefreshing"
        >
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 顶部欢迎区 - 增加背景渐变和卡片效果 -->
    <div class="dashboard-welcome">
      <div class="welcome-left">
        <div class="welcome-title">欢迎回来，{{ name || '管理员' }}</div>
        <div class="welcome-desc">祝您工作愉快，今天是 {{ currentDate }}</div>
        <!-- 添加工作进度提示 -->
        <div v-if="workSummary" class="welcome-status">
          <el-progress
            :percentage="workSummary.completionRate"
            :color="customColorMethod"
            :format="percentFormat"
            :stroke-width="8"
            class="progress-bar"
          />
          <div class="status-text">{{ workSummary.statusText }}</div>
        </div>
        <div v-else-if="loading.progress" class="welcome-status">
          <el-skeleton style="width: 320px" :loading="true" animated>
            <template slot="template">
              <el-skeleton-item variant="text" style="height: 12px; margin-bottom: 12px" />
              <el-skeleton-item variant="text" style="width: 70%; height: 8px" />
            </template>
          </el-skeleton>
        </div>
      </div>
      <div class="welcome-right">
        <div class="weather-info" v-if="weatherData">
          <div class="weather-temp">{{ weatherData.temperature }}°</div>
          <div class="weather-desc">{{ weatherData.description }}</div>
          <div class="weather-loc">{{ weatherData.location }}</div>
      </div>
      <div class="welcome-avatar">
          <el-avatar :size="60" :src="avatar || ''" icon="el-icon-user-solid" />
        </div>
      </div>
    </div>

    <!-- 统计卡片区 - 优化卡片效果 -->
    <el-row :gutter="20" class="dashboard-stats">
      <template v-if="stats.length > 0">
        <el-col v-for="item in stats" :key="item.title" :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{ background: item.bg }">
            <i :class="item.icon" />
          </div>
          <div class="stat-info">
              <div class="stat-value">{{ formatStatValue(item) }}</div>
            <div class="stat-title">{{ item.title }}</div>
              <div class="stat-trend" v-if="item.trend">
                <span
                  class="trend-value"
                  :class="{ 
                    'trend-up': item.trend > 0, 
                    'trend-down': item.trend < 0, 
                    'trend-flat': item.trend === 0 
                  }"
                >
                  <i :class="getTrendIcon(item.trend)"></i>
                  {{ Math.abs(item.trend) }}%
                </span>
                <span class="trend-period">较上周</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </template>
      <template v-else>
        <el-col v-for="i in 4" :key="i" :xs="12" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <el-skeleton :loading="loading.stats" animated>
              <template slot="template">
                <div class="stat-skeleton">
                  <el-skeleton-item variant="circle" style="width: 48px; height: 48px" />
                  <div class="skeleton-content">
                    <el-skeleton-item variant="h3" style="width: 80%" />
                    <el-skeleton-item variant="text" style="width: 60%; margin-top: 5px" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </template>
    </el-row>

    <!-- 图表分析区 - 新增图表展示 -->
    <el-row :gutter="20" class="dashboard-charts">
      <el-col :xs="24" :md="16">
        <el-card class="chart-card">
          <div class="card-header">
            <span class="card-title">访问量趋势</span>
            <div class="card-actions">
              <el-radio-group v-model="visitChartPeriod" size="mini" :disabled="loading.visit">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-container" v-loading="loading.visit">
            <!-- 访问量走势图 -->
            <div ref="visitChart" class="echarts-container"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card class="chart-card">
          <div class="card-header">
            <span class="card-title">用户分布</span>
          </div>
          <div class="chart-container" v-loading="loading.userDist">
            <!-- 用户分布图 -->
            <div ref="userDistChart" class="echarts-container"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口区 - 增加视觉美感 -->
    <el-row :gutter="20" class="dashboard-quick-entries">
      <el-col :xs="24" :md="16">
    <el-card class="dashboard-quick">
      <div class="card-header">
        <span class="card-title">快捷入口</span>
            <div class="card-actions">
              <el-button type="text" size="mini" @click="customizeQuickEntries">
                <i class="el-icon-setting"></i> 自定义
              </el-button>
            </div>
      </div>
      <el-row :gutter="16">
            <el-col v-for="entry in quickEntries" :key="entry.title" :xs="12" :sm="8" :md="6" :lg="4">
              <div class="quick-entry" @click="entry.action">
                <div class="entry-icon" :style="{ background: entry.color || '#f0f2ff' }">
                  <i :class="entry.icon"></i>
                </div>
                <div class="entry-title">{{ entry.title }}</div>
              </div>
        </el-col>
      </el-row>
    </el-card>
      </el-col>
      
      <!-- 待办任务 - 新增模块 -->
      <el-col :xs="24" :md="8">
        <el-card class="dashboard-todo">
          <div class="card-header">
            <span class="card-title">待办任务</span>
            <div class="card-actions">
              <el-button type="text" size="mini" @click="addTodoItem">
                <i class="el-icon-plus"></i> 添加任务
              </el-button>
            </div>
          </div>
          <div class="todo-list">
            <div v-for="(todo, index) in todoList" :key="index" class="todo-item">
              <el-checkbox v-model="todo.done" @change="updateTodoStatus(index)">
                <span :class="{'todo-done': todo.done}">{{ todo.text }}</span>
              </el-checkbox>
              <div class="todo-actions">
                <el-tag size="mini" :type="todo.priority">{{ todo.tagText }}</el-tag>
                <el-button type="text" icon="el-icon-delete" @click="removeTodoItem(index)" />
              </div>
            </div>
            <div class="empty-tip" v-if="todoList.length === 0">
              <i class="el-icon-check"></i>
              <span>暂无待办任务</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 公告/帮助区 - 优化展现形式 -->
    <el-row :gutter="20" class="dashboard-bottom">
      <el-col :xs="24" :md="16">
        <el-card class="dashboard-announcement">
          <div class="card-header">
            <span class="card-title">系统公告</span>
            <div class="card-actions">
              <el-button type="text" size="mini" @click="refreshAnnouncements">
                <i class="el-icon-refresh"></i> 刷新
              </el-button>
            </div>
          </div>
          <ul class="announcement-list">
            <li v-for="(item, idx) in announcements" :key="idx" class="announcement-item">
              <div class="announcement-content">
                <i :class="item.icon || 'el-icon-info'" :style="{color: item.color || '#2196f3'}" />
                <div class="announcement-text">
                  <div class="announcement-title">{{ item.title || item }}</div>
                  <div class="announcement-desc" v-if="item.description">{{ item.description }}</div>
                </div>
              </div>
              <div class="announcement-time" v-if="item.time">{{ item.time }}</div>
            </li>
            <div class="empty-tip" v-if="announcements.length === 0">
              <i class="el-icon-chat-line-round"></i>
              <span>暂无系统公告</span>
            </div>
          </ul>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card class="dashboard-help">
          <div class="card-header">
            <span class="card-title">帮助与客服</span>
          </div>
          <div class="help-content">
          <div class="help-desc">如有疑问，请联系管理员或客服，或查阅帮助文档。</div>
            <div class="help-actions">
              <el-button type="primary" icon="el-icon-service" @click="handleHelp">联系客服</el-button>
              <el-button icon="el-icon-document" @click="openUserManual">使用手册</el-button>
            </div>
            <div class="help-info">
              <div class="info-item">
                <span class="label">客服电话：</span>
                <span class="value">400-123-4567</span>
              </div>
              <div class="info-item">
                <span class="label">客服邮箱：</span>
                <span class="value">support@example.com</span>
              </div>
              <div class="info-item">
                <span class="label">服务时间：</span>
                <span class="value">工作日 9:00-18:00</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 添加待办对话框 -->
    <el-dialog
      title="添加待办任务"
      :visible.sync="todoDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="newTodo" label-width="80px">
        <el-form-item label="任务内容" required>
          <el-input v-model="newTodo.text" placeholder="请输入任务内容"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="newTodo.priority" placeholder="请选择优先级">
            <el-option label="高" value="danger"></el-option>
            <el-option label="中" value="warning"></el-option>
            <el-option label="低" value="info"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="todoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddTodo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts/core'
import { 
  BarChart,
  LineChart,
  PieChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
import { 
  CanvasRenderer
} from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer
])

export default {
  name: 'Dashboard',
  data() {
    return {
      currentDate: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
      stats: [],
      loading: {
        stats: false,
        visit: false,
        userDist: false,
        progress: false
      },
      quickEntries: [
        { title: '用户管理', icon: 'el-icon-user', color: '#e3f2fd', action: () => this.$router.push('/user') },
        { title: '日志管理', icon: 'el-icon-document', color: '#e8f5e9', action: () => this.$router.push('/log') },
        { title: '通知公告', icon: 'el-icon-bell', color: '#fff8e1', action: () => this.$router.push('/notice') },
        { title: '个人中心', icon: 'el-icon-user', color: '#f3e5f5', action: () => this.$router.push('/profile') },
        { title: '系统设置', icon: 'el-icon-setting', color: '#e0f7fa', action: () => this.$router.push('/setting') },
        { title: '帮助中心', icon: 'el-icon-question', color: '#f1f8e9', action: () => this.$message.info('帮助中心功能即将上线') }
      ],
      announcements: [
        { 
          title: '欢迎使用企业管理平台', 
          description: '祝您工作顺利！',
          icon: 'el-icon-bell',
          color: '#2196f3',
          time: '今天'
        },
        { 
          title: '系统将于本周五晚进行维护升级', 
          description: '预计停机时间为2小时，请提前做好工作安排',
          icon: 'el-icon-warning',
          color: '#ff9800',
          time: '昨天'
        },
        { 
          title: '请及时更新个人信息', 
          description: '保障账号安全',
          icon: 'el-icon-info',
          color: '#4caf50',
          time: '3天前'
        }
      ],
      workSummary: null,
      weatherData: {
        temperature: 25,
        description: '晴',
        location: '北京市'
      },
      todoList: [
        { text: '完成月度工作报告', done: false, priority: 'danger', tagText: '高' },
        { text: '参加产品讨论会', done: false, priority: 'warning', tagText: '中' },
        { text: '回复客户邮件', done: true, priority: 'info', tagText: '低' }
      ],
      todoDialogVisible: false,
      newTodo: {
        text: '',
        done: false,
        priority: 'info',
        tagText: '低'
      },
      visitChartPeriod: 'week',
      // 图表实例
      visitChart: null,
      userDistChart: null,
      // 图表数据
      visitChartData: {},
      userDistData: [],
      isRefreshing: false
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar'])
  },
  watch: {
    // 监听图表周期变化，更新图表
    visitChartPeriod(newVal) {
      this.fetchVisitData()
    }
  },
  created() {
    this.loadTodoList()
  },
  mounted() {
    this.fetchData()
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    // 销毁图表实例，避免内存泄漏
    if (this.visitChart) {
      this.visitChart.dispose()
    }
    if (this.userDistChart) {
      this.userDistChart.dispose()
    }
    
    // 移除事件监听
    window.removeEventListener('resize', this.resizeCharts)
  },
  methods: {
    // 获取所有数据
    fetchData() {
      this.fetchStatsData()
      this.fetchVisitData()
      this.fetchUserDistData()
      this.fetchWorkProgress()
    },
    
    // 获取统计卡片数据
    async fetchStatsData() {
      this.loading.stats = true
      try {
        // 模拟API调用
        setTimeout(() => {
          this.stats = [
            {
              title: '访问量',
              value: 12345,
              icon: 'el-icon-view',
              bg: '#3f51b5',
              trend: 5.2
            },
            {
              title: '用户数',
              value: 2468,
              icon: 'el-icon-user',
              bg: '#4caf50',
              trend: 2.1
            },
            {
              title: '订单量',
              value: 6789,
              icon: 'el-icon-s-order',
              bg: '#ff9800',
              trend: -1.8
            },
            {
              title: '收入',
              value: 89562,
              unit: '¥',
              icon: 'el-icon-money',
              bg: '#2196f3',
              trend: 3.5
            }
          ]
          this.loading.stats = false
        }, 500)
        
        // 实际项目中应该调用API
        // const res = await getStatCards()
        // if (res.code === 20000) {
        //   this.stats = res.data
        // }
      } catch (error) {
        console.error('获取统计卡片数据失败', error)
      } finally {
        this.loading.stats = false
      }
    },
    
    // 获取工作进度数据
    async fetchWorkProgress() {
      this.loading.progress = true
      try {
        // 模拟API调用
        setTimeout(() => {
          this.workSummary = {
            completionRate: 68,
            statusText: '本周工作进度良好，按计划推进中'
          }
          this.loading.progress = false
        }, 500)
        
        // 实际项目中应该调用API
        // const res = await getWorkProgress()
        // if (res.code === 20000) {
        //   this.workSummary = res.data
        // }
      } catch (error) {
        console.error('获取工作进度数据失败', error)
      } finally {
        this.loading.progress = false
      }
    },
    
    // 获取访问趋势数据并更新图表
    async fetchVisitData() {
      this.loading.visit = true
      try {
        // 模拟API调用
        setTimeout(() => {
          // 根据选择的周期生成不同的数据
          let xAxis = []
          let visitData = []
          let registerData = []
          
          if (this.visitChartPeriod === 'week') {
            xAxis = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            visitData = [120, 132, 101, 134, 90, 230, 210]
            registerData = [20, 32, 11, 34, 30, 50, 40]
          } else if (this.visitChartPeriod === 'month') {
            xAxis = Array.from({length: 30}, (_, i) => (i + 1) + '日')
            visitData = Array.from({length: 30}, () => Math.floor(Math.random() * 300) + 100)
            registerData = Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 10)
          } else {
            xAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            visitData = [320, 302, 301, 334, 390, 330, 320, 302, 301, 334, 390, 330]
            registerData = [120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230]
          }
          
          this.visitChartData = {
            xAxis,
            series: [
              {
                name: '访问量',
                data: visitData
              },
              {
                name: '注册量',
                data: registerData
              }
            ]
          }
          
          this.$nextTick(() => {
            this.initVisitChart()
          })
          
          this.loading.visit = false
        }, 500)
        
        // 实际项目中应该调用API
        // const res = await getVisitTrend(this.visitChartPeriod)
        // if (res.code === 20000) {
        //   this.visitChartData = res.data
        //   this.$nextTick(() => {
        //     this.initVisitChart()
        //   })
        // }
      } catch (error) {
        console.error('获取访问趋势数据失败', error)
      } finally {
        this.loading.visit = false
      }
    },
    
    // 获取用户分布数据并更新图表
    async fetchUserDistData() {
      this.loading.userDist = true
      try {
        // 模拟API调用
        setTimeout(() => {
          this.userDistData = [
            { value: 1048, name: '普通用户' },
            { value: 735, name: '会员用户' },
            { value: 580, name: 'VIP用户' },
            { value: 484, name: '企业用户' },
            { value: 300, name: '其他' }
          ]
          
          this.$nextTick(() => {
            this.initUserDistChart()
          })
          
          this.loading.userDist = false
        }, 500)
        
        // 实际项目中应该调用API
        // const res = await getUserDistribution()
        // if (res.code === 20000) {
        //   this.userDistData = res.data
        //   this.$nextTick(() => {
        //     this.initUserDistChart()
        //   })
        // }
      } catch (error) {
        console.error('获取用户分布数据失败', error)
      } finally {
        this.loading.userDist = false
      }
    },
    
    initCharts() {
      // 初始化访问量趋势图
      this.initVisitChart()
      
      // 初始化用户分布图
      this.initUserDistChart()
    },
    
    // 初始化访问量趋势图
    initVisitChart() {
      if (!this.$refs.visitChart || !this.visitChartData.xAxis) return
      
      if (!this.visitChart) {
        // 创建图表实例
        this.visitChart = echarts.init(this.$refs.visitChart)
      }
      
      // 配置图表选项
      const options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['访问量', '注册量'],
          right: '5%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.visitChartData.xAxis,
          axisLine: {
            lineStyle: {
              color: '#909399'
            }
          },
          axisLabel: {
            color: '#606266'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          axisLabel: {
            color: '#606266'
          }
        },
        series: this.visitChartData.series.map((item, index) => {
          const colors = ['#3f51b5', '#4caf50']
          return {
            name: item.name,
            type: 'line',
            stack: 'Total',
            data: item.data,
            smooth: true,
            lineStyle: {
              width: 3,
              color: colors[index]
            },
            itemStyle: {
              color: colors[index]
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: `rgba(${index === 0 ? '63, 81, 181' : '76, 175, 80'}, 0.3)`
                  },
                  {
                    offset: 1,
                    color: `rgba(${index === 0 ? '63, 81, 181' : '76, 175, 80'}, 0.1)`
                  }
                ]
              }
            }
          }
        })
      }
      
      // 应用配置
      this.visitChart.setOption(options)
    },
    
    // 初始化用户分布图
    initUserDistChart() {
      if (!this.$refs.userDistChart || !this.userDistData.length) return
      
      if (!this.userDistChart) {
        // 创建图表实例
        this.userDistChart = echarts.init(this.$refs.userDistChart)
      }
      
      // 配置图表选项
      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          top: 'center',
          data: this.userDistData.map(item => item.name)
        },
        series: [
          {
            name: '用户类型',
            type: 'pie',
            radius: '60%',
            center: ['65%', '50%'],
            data: this.userDistData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            color: ['#3f51b5', '#4caf50', '#ff9800', '#2196f3', '#9c27b0']
          }
        ]
      }
      
      // 应用配置
      this.userDistChart.setOption(options)
    },
    
    // 调整图表大小
    resizeCharts() {
      if (this.visitChart) {
        this.visitChart.resize()
      }
      if (this.userDistChart) {
        this.userDistChart.resize()
      }
    },
    
    formatStatValue(item) {
      if (item.value >= 10000) {
        return (item.unit || '') + (item.value / 10000).toFixed(1) + '万'
      }
      return (item.unit || '') + item.value
    },
    getTrendIcon(trend) {
      if (trend > 0) return 'el-icon-caret-top'
      if (trend < 0) return 'el-icon-caret-bottom'
      return 'el-icon-minus'
    },
    percentFormat(percentage) {
      return percentage + '%'
    },
    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#f56c6c'
      } else if (percentage < 70) {
        return '#e6a23c'
      } else {
        return '#67c23a'
      }
    },
    // 待办事项相关
    addTodoItem() {
      this.newTodo = {
        text: '',
        done: false,
        priority: 'info',
        tagText: '低'
      }
      this.todoDialogVisible = true
    },
    confirmAddTodo() {
      if (!this.newTodo.text) {
        this.$message.warning('请输入任务内容')
        return
      }

      // 设置对应的标签文本
      switch (this.newTodo.priority) {
        case 'danger':
          this.newTodo.tagText = '高'
          break
        case 'warning':
          this.newTodo.tagText = '中'
          break
        default:
          this.newTodo.tagText = '低'
      }

      this.todoList.unshift({ ...this.newTodo })
      this.todoDialogVisible = false
      
      // 保存到本地存储，实际项目中应该调用API保存
      this.saveTodoList()
      
      this.$message.success('任务添加成功')
    },
    updateTodoStatus(index) {
      const isDone = this.todoList[index].done
      this.$message({
        type: 'success',
        message: isDone ? '任务已完成' : '已恢复任务',
        duration: 1500
      })
      
      // 保存到本地存储，实际项目中应该调用API保存
      this.saveTodoList()
    },
    removeTodoItem(index) {
      this.$confirm('确定要删除该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.todoList.splice(index, 1)
        
        // 保存到本地存储，实际项目中应该调用API保存
        this.saveTodoList()
        
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {})
    },
    // 保存待办事项到本地存储
    saveTodoList() {
      try {
        localStorage.setItem('todoList', JSON.stringify(this.todoList))
      } catch (e) {
        console.error('保存待办事项失败', e)
      }
    },
    // 从本地存储加载待办事项
    loadTodoList() {
      try {
        const savedList = localStorage.getItem('todoList')
        if (savedList) {
          this.todoList = JSON.parse(savedList)
        }
      } catch (e) {
        console.error('加载待办事项失败', e)
      }
    },
    // 其他功能
    refreshAnnouncements() {
      // 模拟刷新公告
      this.$message.success('公告已更新')
      setTimeout(() => {
        this.announcements = [
          { 
            title: '系统更新通知', 
            description: '系统将于本周六晚上22:00-24:00进行版本更新',
            icon: 'el-icon-bell',
            color: '#2196f3',
            time: '刚刚'
          },
          { 
            title: '欢迎使用企业管理平台', 
            description: '祝您工作顺利！',
            icon: 'el-icon-bell',
            color: '#2196f3',
            time: '今天'
          },
          { 
            title: '安全提醒', 
            description: '请定期修改您的账号密码，确保账号安全',
            icon: 'el-icon-warning',
            color: '#ff9800',
            time: '昨天'
          }
        ]
      }, 500)
      
      // 实际项目中应该调用API获取最新公告
      // getLatestAnnouncements().then(res => {
      //   if (res.code === 20000) {
      //     this.announcements = res.data
      //     this.$message.success('公告已更新')
      //   }
      // })
    },
    customizeQuickEntries() {
      this.$message.info('自定义功能将在后续版本开放')
    },
    handleHelp() {
      this.$message.info('正在连接客服中心，请稍候...')
      // 模拟客服连接
      setTimeout(() => {
        this.$alert('客服工作时间：工作日 9:00-18:00，如需帮助请拨打400-123-4567或发送邮件至support@example.com', '客服中心', {
          confirmButtonText: '确定',
          callback: () => {
            this.$message({
              type: 'info',
              message: '您可以在工作时间内联系客服'
            })
          }
        })
      }, 1000)
    },
    openUserManual() {
      this.$message.info('正在打开用户手册...')
      // 模拟打开用户手册
      setTimeout(() => {
        window.open('https://example.com/manual', '_blank')
      }, 500)
    },
    // 刷新所有数据
    async refreshAllData() {
      if (this.isRefreshing) return
      
      this.isRefreshing = true
      try {
        // 并行请求所有数据
        await Promise.all([
          this.fetchStatsData(),
          this.fetchVisitData(),
          this.fetchUserDistData(),
          this.fetchWorkProgress()
        ])
        
        this.$message({
          type: 'success',
          message: '数据已更新',
          duration: 1500
        })
      } catch (error) {
        console.error('刷新数据失败', error)
        this.$message({
          type: 'error',
          message: '数据更新失败',
          duration: 2000
        })
      } finally {
        this.isRefreshing = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

// 主要布局
.dashboard-main {
  padding: $spacing-lg;
  background: $gray-100;
  min-height: calc(100vh - #{$navbarHeight});
}

// 头部
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
  
  .header-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $gray-800;
}

  .header-actions {
    display: flex;
    gap: $spacing-sm;
  }
}

// 欢迎区域
.dashboard-welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, $primary, $primary-dark);
  border-radius: $border-radius-lg;
  padding: $spacing-lg $spacing-xl;
  margin-bottom: $spacing-lg;
  color: $white;
  box-shadow: $box-shadow-lg;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBkPSJNMCw2NFM0NS45MSw5NiwxNTIsMTI4cy0xMC45MSw5Ni04MCwxMjhTMzA0LDMyMCwzODQsMzIwczk2LTY0LDE5Mi02NHMxNjAsNjQsMjI0LDY0czE2MC02NCwxOTItNjRzMjI0LTMyLDMyMCwzMnYtMjg4SDBaIi8+PC9zdmc+') bottom center;
    background-size: cover;
    opacity: 0.3;
    pointer-events: none;
  }
  
  .welcome-left {
    z-index: 1;
  }

  .welcome-title {
    font-size: $font-size-xxl;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-sm;
  }

  .welcome-desc {
    font-size: $font-size-sm;
    opacity: 0.85;
    margin-bottom: $spacing-md;
  }
  
  .welcome-status {
    max-width: 320px;
    margin-top: $spacing-md;
    
    .progress-bar {
      margin-bottom: $spacing-xs;
    }
    
    .status-text {
      font-size: $font-size-sm;
      opacity: 0.9;
    }
  }
  
  .welcome-right {
    display: flex;
    align-items: center;
    z-index: 1;
  }
  
  .weather-info {
    text-align: right;
    margin-right: $spacing-lg;
    
    .weather-temp {
      font-size: 28px;
      font-weight: $font-weight-bold;
    }
    
    .weather-desc {
      font-size: $font-size-sm;
      opacity: 0.9;
    }
    
    .weather-loc {
      font-size: $font-size-xs;
      opacity: 0.8;
    }
  }

  .welcome-avatar {
    .el-avatar {
      background: rgba($white, 0.2);
      border: 2px solid rgba($white, 0.5);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

// 统计卡片区域
.dashboard-stats {
  margin-bottom: $spacing-lg;

  .stat-card {
    display: flex;
    align-items: center;
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-sm;
    border: none;
    padding: $spacing-md;
    height: 100%;
    transition: $transition-base;

    &:hover {
      transform: translateY(-3px);
      box-shadow: $box-shadow-base;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: $border-radius-base;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: $spacing-md;
      font-size: $font-size-xxl + 4px;
      color: $white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    .stat-info {
      flex: 1;
      
      .stat-value {
        font-size: $font-size-xxl;
        font-weight: $font-weight-bold;
        color: $gray-800;
        line-height: 1.2;
      }

      .stat-title {
        font-size: $font-size-sm;
        color: $gray-600;
        margin-top: $spacing-xs;
      }
      
      .stat-trend {
        display: flex;
        align-items: center;
        margin-top: $spacing-xs;
        font-size: $font-size-xs;
        
        .trend-value {
          display: flex;
          align-items: center;
          
          &.trend-up {
            color: $success;
          }
          
          &.trend-down {
            color: $danger;
          }
          
          &.trend-flat {
            color: $gray-500;
          }
          
          i {
            margin-right: 2px;
            font-size: $font-size-xs;
          }
        }
        
        .trend-period {
          color: $gray-500;
          margin-left: 4px;
        }
      }
    }
  }
}

// 图表区域
.dashboard-charts {
  margin-bottom: $spacing-lg;
  
  .chart-card {
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  border: none;
  margin-bottom: $spacing-lg;

    .chart-container {
      height: 300px;
      padding: $spacing-sm;
    }
    
    .echarts-container {
      width: 100%;
      height: 100%;
    }
  }
}

// 卡片通用头部样式
  .card-header {
  padding: $spacing-md 0;
    margin-bottom: $spacing-md;
    border-bottom: 1px solid $gray-200;
  display: flex;
  align-items: center;
  justify-content: space-between;

    .card-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $gray-800;
      position: relative;
      padding-left: $spacing-sm + 4px;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 16px;
        width: 4px;
        background: $primary;
        border-radius: 2px;
      }
    }
  
  .card-actions {
    display: flex;
    align-items: center;
  }
}

// 快捷入口区域
.dashboard-quick-entries {
  margin-bottom: $spacing-lg;
}

.dashboard-quick {
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  border: none;
  margin-bottom: $spacing-lg;
  
  .quick-entry {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-md;
    cursor: pointer;
    border-radius: $border-radius-base;
    transition: $transition-base;
    margin-bottom: $spacing-md;

    &:hover {
      background: $gray-100;
      transform: translateY(-3px);
      box-shadow: $box-shadow-sm;
    }
    
    .entry-icon {
      width: 50px;
      height: 50px;
      border-radius: $border-radius-base;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: $spacing-sm;
      
      i {
        font-size: 24px;
        color: $primary;
  }
}
    
    .entry-title {
      font-size: $font-size-sm;
      color: $gray-700;
      text-align: center;
    }
  }
}

// 待办任务区域
.dashboard-todo {
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  border: none;
  margin-bottom: $spacing-lg;
  
  .todo-list {
    max-height: 280px;
    overflow-y: auto;
    
    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-sm;
      border-bottom: 1px solid $gray-200;
      
      &:last-child {
        border-bottom: none;
      }
      
      .todo-done {
        text-decoration: line-through;
        color: $gray-500;
      }
      
      .todo-actions {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        
        .el-button {
          padding: 2px;
        }
      }
    }
  }
}

// 公告区域
.dashboard-announcement {
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  border: none;
  margin-bottom: $spacing-lg;

.announcement-list {
  padding-left: 0;
  list-style: none;
    margin: 0;

    .announcement-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    margin-bottom: $spacing-sm;
      padding: $spacing-md;
    background: $gray-100;
    border-radius: $border-radius-sm;

      &:last-child {
        margin-bottom: 0;
      }
      
      .announcement-content {
        display: flex;
        align-items: flex-start;
        flex: 1;
        
        i {
      margin-right: $spacing-sm;
          font-size: $font-size-lg;
          margin-top: 2px;
        }
        
        .announcement-text {
          flex: 1;
        }
        
        .announcement-title {
          font-size: $font-size-sm;
          font-weight: $font-weight-medium;
          color: $gray-800;
          margin-bottom: 4px;
        }
        
        .announcement-desc {
          font-size: $font-size-xs;
          color: $gray-600;
        }
      }
      
      .announcement-time {
        font-size: $font-size-xs;
        color: $gray-500;
        white-space: nowrap;
        margin-left: $spacing-md;
      }
    }
  }
}

// 帮助区域
.dashboard-help {
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-sm;
  border: none;
  margin-bottom: $spacing-lg;
  
  .help-content {
.help-desc {
  font-size: $font-size-sm;
  color: $gray-700;
  margin-bottom: $spacing-md;
  line-height: 1.6;
}

    .help-actions {
      display: flex;
      gap: $spacing-md;
      margin-bottom: $spacing-lg;
    }
    
    .help-info {
      background: $gray-100;
      padding: $spacing-md;
      border-radius: $border-radius-base;
      
      .info-item {
        display: flex;
        margin-bottom: $spacing-xs;
        font-size: $font-size-sm;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .label {
          color: $gray-600;
          margin-right: $spacing-xs;
        }
        
        .value {
          color: $gray-800;
        }
      }
    }
  }
}

// 空数据提示
.empty-tip {
  padding: $spacing-lg;
  text-align: center;
  color: $gray-500;
  
  i {
    font-size: $font-size-xl;
    margin-bottom: $spacing-xs;
    display: block;
  }
}

// 响应式调整
@media (max-width: 900px) {
  .dashboard-main {
    padding: $spacing-sm;
  }

  .dashboard-welcome {
    flex-direction: column;
    align-items: flex-start;
    padding: $spacing-lg;

    .welcome-right {
      margin-top: $spacing-md;
      width: 100%;
      justify-content: flex-end;
    }
  }

  .dashboard-stats {
    .stat-card {
      margin-bottom: $spacing-md;
    }
  }
  
  .dashboard-quick {
    .quick-entry {
      margin-bottom: $spacing-md;
    }
  }
  
  .help-actions {
    flex-direction: column;
    gap: $spacing-xs;
  }
}

.stat-skeleton {
  display: flex;
  align-items: center;
  
  .skeleton-content {
    margin-left: $spacing-md;
    flex: 1;
  }
}
</style>
