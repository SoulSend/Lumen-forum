<template>
  <div class="log-main">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="log-stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="log-stats-card">
          <div class="log-stats-item">
            <div class="log-stats-icon blue">
              <i class="el-icon-document"></i>
            </div>
            <div class="log-stats-info">
              <div class="log-stats-value">{{ stats.totalCount }}</div>
              <div class="log-stats-label">总日志数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="log-stats-card">
          <div class="log-stats-item">
            <div class="log-stats-icon green">
              <i class="el-icon-date"></i>
            </div>
            <div class="log-stats-info">
              <div class="log-stats-value">{{ stats.todayCount }}</div>
              <div class="log-stats-label">今日日志</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="log-stats-card">
          <div class="log-stats-item">
            <div class="log-stats-icon orange">
              <i class="el-icon-warning"></i>
            </div>
            <div class="log-stats-info">
              <div class="log-stats-value">{{ stats.warnCount }}</div>
              <div class="log-stats-label">警告日志</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="log-stats-card">
          <div class="log-stats-item">
            <div class="log-stats-icon red">
              <i class="el-icon-error"></i>
            </div>
            <div class="log-stats-info">
              <div class="log-stats-value">{{ stats.errorCount }}</div>
              <div class="log-stats-label">错误日志</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <el-card class="log-search-card">
      <el-form :inline="true" :model="searchForm" class="log-search-form">
        <div class="log-search-flex">
          <el-form-item label="操作人">
            <el-input v-model="searchForm.user" placeholder="请输入操作人" clearable />
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select v-model="searchForm.type" placeholder="全部" clearable>
              <el-option label="全部" value="" />
              <el-option label="登录" value="登录" />
              <el-option label="新增" value="新增" />
              <el-option label="编辑" value="编辑" />
              <el-option label="删除" value="删除" />
              <el-option label="查询" value="查询" />
              <el-option label="系统" value="系统" />
              <el-option label="错误" value="错误" />
              <el-option label="安全" value="安全" />
            </el-select>
          </el-form-item>
          <el-form-item label="日志级别">
            <el-select v-model="searchForm.level" placeholder="全部" clearable>
              <el-option label="全部" value="" />
              <el-option label="INFO" value="INFO" />
              <el-option label="WARN" value="WARN" />
              <el-option label="ERROR" value="ERROR" />
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input v-model="searchForm.ip" placeholder="请输入IP地址" clearable />
          </el-form-item>
          <el-form-item label="操作结果">
            <el-select v-model="searchForm.result" placeholder="全部" clearable>
              <el-option label="全部" value="" />
              <el-option label="成功" value="成功" />
              <el-option label="失败" value="失败" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <div class="log-search-btns">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 日志表格 -->
    <el-card class="log-table-card">
      <div class="log-table-header">
        <span class="log-table-title">操作日志</span>
        <div class="log-table-actions">
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" :disabled="selectedLogs.length === 0" @click="handleBatchDelete">批量删除</el-button>
          <el-button type="primary" size="small" icon="el-icon-download" @click="handleExport">导出</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleClear">清空</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="logList"
        border
        stripe
        style="width: 100%"
        class="log-table"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :empty-text="loading ? '' : '暂无日志数据'"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="user" label="操作人" min-width="100" />
        <el-table-column prop="type" label="操作类型" min-width="80" />
        <el-table-column prop="content" label="操作内容" min-width="180" />
        <el-table-column prop="time" label="操作时间" min-width="160" sortable="custom" @sort-change="handleSortChange" />
        <el-table-column prop="ip" label="IP地址" min-width="120" />
        <el-table-column prop="level" label="日志级别" min-width="80">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.level === 'INFO' ? 'success' : scope.row.level === 'WARN' ? 'warning' : 'danger'"
              size="small"
            >
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="操作结果" min-width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.result === '成功' ? 'success' : 'danger'" size="small">
              {{ scope.row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-view"
              circle
              @click="handleDetail(scope.row)"
              title="查看详情"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="log-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="pageNum"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 日志统计图表 -->
    <el-row :gutter="20" class="log-chart-row">
      <el-col :span="12">
        <el-card class="log-chart-card" shadow="hover">
          <div slot="header" class="log-chart-header">
            <span>日志类型分布</span>
          </div>
          <div class="log-chart-container" id="typeChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="log-chart-card" shadow="hover">
          <div slot="header" class="log-chart-header">
            <span>用户操作分布</span>
          </div>
          <div class="log-chart-container" id="userChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="log-chart-row">
      <el-col :span="24">
        <el-card class="log-chart-card" shadow="hover">
          <div slot="header" class="log-chart-header">
            <span>日志时间分布</span>
          </div>
          <div class="log-chart-container" id="timeChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 日志详情对话框 -->
    <el-dialog title="日志详情" :visible.sync="detailVisible" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作人">{{ currentLog.user }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">{{ currentLog.type }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ currentLog.time }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog.ip }}</el-descriptions-item>
        <el-descriptions-item label="日志级别">
          <el-tag
            :type="currentLog.level === 'INFO' ? 'success' : currentLog.level === 'WARN' ? 'warning' : 'danger'"
          >
            {{ currentLog.level }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作结果">
          <el-tag :type="currentLog.result === '成功' ? 'success' : 'danger'">
            {{ currentLog.result }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作内容" :span="2">{{ currentLog.content }}</el-descriptions-item>
        <el-descriptions-item label="详细信息" :span="2">
          <pre class="log-detail-json">{{ currentLog.data ? JSON.stringify(currentLog.data, null, 2) : '无' }}</pre>
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="danger" @click="handleDeleteFromDetail">删除</el-button>
      </span>
    </el-dialog>

    <!-- 清空日志确认对话框 -->
    <el-dialog title="清空日志" :visible.sync="clearVisible" width="400px">
      <div class="clear-dialog-content">
        <i class="el-icon-warning warning-icon"></i>
        <span>确定要清空所有日志吗？此操作不可恢复！</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmClear">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLogList, getLogStats, deleteLog, batchDeleteLogs, clearLogs, exportLogs } from '@/api/log'
import * as echarts from 'echarts'

export default {
  name: 'Log',
  data() {
    return {
      // 搜索表单
      searchForm: { 
        user: '', 
        type: '', 
        level: '',
        ip: '',
        result: '',
        startTime: '',
        endTime: '',
        sortBy: '',
        sortOrder: ''
      },
      dateRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 日志数据
      logList: [],
      loading: false,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      selectedLogs: [],
      // 日志详情
      detailVisible: false,
      currentLog: {},
      // 清空日志
      clearVisible: false,
      // 统计数据
      stats: {
        totalCount: 0,
        todayCount: 0,
        errorCount: 0,
        warnCount: 0,
        typeDistribution: [],
        userDistribution: [],
        hourlyDistribution: []
      },
      // 图表实例
      charts: {
        typeChart: null,
        userChart: null,
        timeChart: null
      }
    }
  },
  watch: {
    dateRange(val) {
      if (val) {
        this.searchForm.startTime = val[0]
        this.searchForm.endTime = val[1]
      } else {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
      }
    }
  },
  created() {
    this.fetchLogList()
    this.fetchLogStats()
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.resizeCharts)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts)
    this.disposeCharts()
  },
  methods: {
    // 获取日志列表
    async fetchLogList() {
      this.loading = true
      try {
        const query = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.searchForm
        }
        
        // 模拟API请求
        setTimeout(() => {
          // 生成模拟数据
          const mockLogs = []
          const total = 235
          
          // 日志类型
          const types = ['登录', '新增', '编辑', '删除', '查询', '系统', '错误', '安全']
          // 用户
          const users = ['admin', 'user1', 'user2', 'user3', 'system']
          // 日志级别
          const levels = ['INFO', 'WARN', 'ERROR']
          // 操作结果
          const results = ['成功', '失败']
          // IP地址
          const ips = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '10.0.0.1', '127.0.0.1']
          
          // 根据搜索条件过滤
          let filteredTotal = total
          
          // 生成当前页数据
          for (let i = 0; i < query.pageSize; i++) {
            const index = (query.pageNum - 1) * query.pageSize + i
            if (index >= filteredTotal) break
            
            const type = types[Math.floor(Math.random() * types.length)]
            const user = users[Math.floor(Math.random() * users.length)]
            const level = levels[Math.floor(Math.random() * levels.length)]
            const result = results[Math.floor(Math.random() * results.length)]
            const ip = ips[Math.floor(Math.random() * ips.length)]
            
            // 生成随机时间（过去30天内）
            const date = new Date()
            date.setDate(date.getDate() - Math.floor(Math.random() * 30))
            date.setHours(Math.floor(Math.random() * 24))
            date.setMinutes(Math.floor(Math.random() * 60))
            date.setSeconds(Math.floor(Math.random() * 60))
            const time = this.formatDateTime(date)
            
            // 生成操作内容
            let content = ''
            switch (type) {
              case '登录':
                content = `用户 ${user} 登录系统`
                break
              case '新增':
                content = `用户 ${user} 新增数据`
                break
              case '编辑':
                content = `用户 ${user} 修改数据`
                break
              case '删除':
                content = `用户 ${user} 删除数据`
                break
              case '查询':
                content = `用户 ${user} 查询数据`
                break
              case '系统':
                content = '系统自动处理'
                break
              case '错误':
                content = '系统发生错误'
                break
              case '安全':
                content = '安全检查'
                break
            }
            
            // 应用搜索过滤
            if (
              (query.user && !user.includes(query.user)) ||
              (query.type && type !== query.type) ||
              (query.level && level !== query.level) ||
              (query.ip && !ip.includes(query.ip)) ||
              (query.result && result !== query.result) ||
              (query.startTime && new Date(time) < new Date(query.startTime)) ||
              (query.endTime && new Date(time) > new Date(query.endTime))
            ) {
              filteredTotal--
              continue
            }
            
            // 生成详细数据
            const data = {
              method: type === '查询' ? 'GET' : (type === '新增' ? 'POST' : (type === '编辑' ? 'PUT' : 'DELETE')),
              url: `/api/${type === '登录' ? 'auth/login' : 'data'}`,
              params: { id: Math.floor(Math.random() * 1000) },
              duration: Math.floor(Math.random() * 500),
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            mockLogs.push({
              id: index + 1,
              user,
              type,
              content,
              time,
              ip,
              level,
              result,
              data
            })
          }
          
          this.logList = mockLogs
          this.total = filteredTotal
          this.loading = false
        }, 500)
        
        // 实际项目中应该调用API
        // const res = await getLogList(query)
        // this.logList = res.data.list
        // this.total = res.data.total
      } catch (error) {
        console.error('获取日志列表失败', error)
        this.$message.error('获取日志列表失败')
      } finally {
        this.loading = false
      }
    },
    
    // 获取日志统计数据
    async fetchLogStats() {
      try {
        // 模拟API请求
        setTimeout(() => {
          // 生成模拟统计数据
          this.stats = {
            totalCount: 235,
            todayCount: 24,
            errorCount: 18,
            warnCount: 37,
            typeDistribution: [
              { type: '登录', count: 45 },
              { type: '新增', count: 32 },
              { type: '编辑', count: 28 },
              { type: '删除', count: 15 },
              { type: '查询', count: 65 },
              { type: '系统', count: 30 },
              { type: '错误', count: 12 },
              { type: '安全', count: 8 }
            ],
            userDistribution: [
              { user: 'admin', count: 78 },
              { user: 'user1', count: 45 },
              { user: 'user2', count: 36 },
              { user: 'user3', count: 28 },
              { user: 'system', count: 48 }
            ],
            hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
              hour: `${i}:00`,
              count: Math.floor(Math.random() * 20) + 1
            }))
          }
          
          this.$nextTick(() => {
            this.initCharts()
          })
        }, 500)
        
        // 实际项目中应该调用API
        // const res = await getLogStats()
        // this.stats = res.data
        // this.$nextTick(() => {
        //   this.initCharts()
        // })
      } catch (error) {
        console.error('获取日志统计数据失败', error)
        this.$message.error('获取日志统计数据失败')
      }
    },
    // 初始化图表
    initCharts() {
      this.initTypeChart()
      this.initUserChart()
      this.initTimeChart()
    },
    // 初始化日志类型分布图表
    initTypeChart() {
      const chartDom = document.getElementById('typeChart')
      if (!chartDom) return
      
      this.disposeChart('typeChart')
      this.charts.typeChart = echarts.init(chartDom)
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: this.stats.typeDistribution.map(item => item.type)
        },
        series: [
          {
            name: '日志类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.stats.typeDistribution.map(item => ({
              name: item.type,
              value: item.count
            }))
          }
        ]
      }
      
      this.charts.typeChart.setOption(option)
    },
    // 初始化用户操作分布图表
    initUserChart() {
      const chartDom = document.getElementById('userChart')
      if (!chartDom) return
      
      this.disposeChart('userChart')
      this.charts.userChart = echarts.init(chartDom)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.stats.userDistribution.map(item => item.user)
        },
        series: [
          {
            name: '操作次数',
            type: 'bar',
            data: this.stats.userDistribution.map(item => item.count)
          }
        ]
      }
      
      this.charts.userChart.setOption(option)
    },
    // 初始化时间分布图表
    initTimeChart() {
      const chartDom = document.getElementById('timeChart')
      if (!chartDom) return
      
      this.disposeChart('timeChart')
      this.charts.timeChart = echarts.init(chartDom)
      
      const option = {
        tooltip: {
          trigger: 'axis'
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
          data: this.stats.hourlyDistribution.map(item => item.hour)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '日志数量',
            type: 'line',
            smooth: true,
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: this.stats.hourlyDistribution.map(item => item.count)
          }
        ]
      }
      
      this.charts.timeChart.setOption(option)
    },
    // 释放图表实例
    disposeChart(chartName) {
      if (this.charts[chartName]) {
        this.charts[chartName].dispose()
        this.charts[chartName] = null
      }
    },
    // 释放所有图表实例
    disposeCharts() {
      Object.keys(this.charts).forEach(key => {
        this.disposeChart(key)
      })
    },
    // 调整图表大小
    resizeCharts() {
      Object.keys(this.charts).forEach(key => {
        if (this.charts[key]) {
          this.charts[key].resize()
        }
      })
    },
    // 搜索
    handleSearch() {
      this.pageNum = 1
      this.fetchLogList()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        user: '',
        type: '',
        level: '',
        ip: '',
        result: '',
        startTime: '',
        endTime: '',
        sortBy: '',
        sortOrder: ''
      }
      this.dateRange = []
      this.pageNum = 1
      this.fetchLogList()
    },
    // 页码变化
    handlePageChange(val) {
      this.pageNum = val
      this.fetchLogList()
    },
    // 每页条数变化
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.fetchLogList()
    },
    // 选择变化
    handleSelectionChange(selection) {
      this.selectedLogs = selection
    },
    // 查看详情
    handleDetail(row) {
      this.currentLog = { ...row }
      this.detailVisible = true
    },
    // 删除日志
    handleDelete(row) {
      this.$confirm('确定要删除该日志吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          // 模拟API调用
          setTimeout(() => {
            this.$message.success('删除成功')
            this.fetchLogList()
            this.fetchLogStats()
          }, 500)
          
          // 实际项目中应该调用API
          // await deleteLog(row.id)
          // this.$message.success('删除成功')
          // this.fetchLogList()
          // this.fetchLogStats()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    // 导出日志
    handleExport() {
      this.$confirm('确定要导出日志吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 模拟导出操作
        this.$message({
          message: '正在导出日志，请稍候...',
          type: 'info'
        })
        
        setTimeout(() => {
          this.$message.success('导出成功，文件已下载')
        }, 1500)
        
        // 实际项目中应该调用API
        // const query = { ...this.searchForm }
        // exportLogs(query)
      }).catch(() => {})
    },
    // 清空日志
    handleClear() {
      this.clearVisible = true
    },
    // 确认清空
    async confirmClear() {
      try {
        // 模拟API调用
        setTimeout(() => {
          this.$message.success('清空成功')
          this.clearVisible = false
          this.fetchLogList()
          this.fetchLogStats()
        }, 800)
        
        // 实际项目中应该调用API
        // await clearLogs()
        // this.$message.success('清空成功')
        // this.clearVisible = false
        // this.fetchLogList()
        // this.fetchLogStats()
      } catch (error) {
        this.$message.error('清空失败')
      }
    },
    // 批量删除日志
    handleBatchDelete() {
      if (this.selectedLogs.length === 0) {
        this.$message.warning('请选择要删除的日志')
        return
      }
      
      this.$confirm(`确定要删除选中的 ${this.selectedLogs.length} 条日志吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const ids = this.selectedLogs.map(item => item.id)
          
          // 模拟API调用
          setTimeout(() => {
            this.$message.success('批量删除成功')
            this.fetchLogList()
            this.fetchLogStats()
          }, 800)
          
          // 实际项目中应该调用API
          // await batchDeleteLogs(ids)
          // this.$message.success('批量删除成功')
          // this.fetchLogList()
          // this.fetchLogStats()
        } catch (error) {
          this.$message.error('批量删除失败')
        }
      }).catch(() => {})
    },
    // 为表格添加行样式和工具提示
    tableRowClassName({ row }) {
      if (row.level === 'ERROR') {
        return 'error-row'
      } else if (row.level === 'WARN') {
        return 'warning-row'
      }
      return ''
    },
    // 从详情对话框删除日志
    handleDeleteFromDetail() {
      this.handleDelete(this.currentLog)
      this.detailVisible = false
    },
    // 刷新数据
    handleRefresh() {
      this.fetchLogList()
      this.fetchLogStats()
      this.$message.success('数据已刷新')
    },
    // 处理排序变化
    handleSortChange({ prop, order }) {
      this.searchForm.sortBy = prop
      this.searchForm.sortOrder = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      this.fetchLogList()
    },
    // 格式化日期时间
    formatDateTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style lang="scss" scoped>
.log-main {
  padding: 24px;
  background: #f6f8fa;
  min-height: 100vh;
}

/* 表格行样式 */
::v-deep .error-row {
  background-color: rgba(245, 108, 108, 0.1);
}

::v-deep .warning-row {
  background-color: rgba(230, 162, 60, 0.1);
}

/* 表格操作按钮样式 */
::v-deep .el-button.is-circle {
  margin-right: 8px;
}

/* 工具提示样式 */
[title] {
  position: relative;
  cursor: help;
}

.log-stats-row {
  margin-bottom: 20px;
}

.log-stats-card {
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(54,209,196,0.08);
  border: none;
}

.log-stats-item {
  display: flex;
  align-items: center;
}

.log-stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  i {
    font-size: 24px;
    color: #fff;
  }
  
  &.blue {
    background: linear-gradient(135deg, #1890ff 0%, #36a4ff 100%);
  }
  
  &.green {
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  }
  
  &.orange {
    background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
  }
  
  &.red {
    background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%);
  }
}

.log-stats-info {
  .log-stats-value {
    font-size: 24px;
    font-weight: 600;
    color: #22304a;
    line-height: 1.2;
  }
  
  .log-stats-label {
    font-size: 14px;
    color: #8c8c8c;
    margin-top: 4px;
  }
}

.log-search-card {
  margin-bottom: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(54,209,196,0.08);
  border: none;
}

.log-search-form {
  .log-search-flex {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 8px 16px;
  }
  
  .el-form-item {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .log-search-btns {
    margin-left: auto;
    display: flex;
    align-items: center;
    min-width: 180px;
    justify-content: flex-end;
  }
}

.log-table-card {
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(54,209,196,0.08);
  border: none;
  margin-bottom: 20px;
  
  .log-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .log-table-title {
      font-size: 18px;
      font-weight: 600;
      color: #22304a;
    }
    
    .log-table-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .log-table {
    margin-bottom: 12px;
  }
  
  .log-pagination {
    text-align: right;
    margin-top: 16px;
  }
}

.log-chart-row {
  margin-bottom: 20px;
}

.log-chart-card {
  border-radius: 14px;
  box-shadow: 0 2px 12px 0 rgba(54,209,196,0.08);
  border: none;
  
  .log-chart-header {
    font-size: 16px;
    font-weight: 600;
    color: #22304a;
  }
  
  .log-chart-container {
    height: 300px;
  }
}

.log-detail-json {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-family: monospace;
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.clear-dialog-content {
  display: flex;
  align-items: center;
  padding: 20px 0;
  
  .warning-icon {
    font-size: 24px;
    color: #e6a23c;
    margin-right: 12px;
  }
}
</style>
