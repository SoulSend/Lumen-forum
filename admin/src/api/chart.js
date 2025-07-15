/**
 * 图表数据API接口
 * 
 * 功能说明：
 * 1. 提供仪表盘所需的各类图表数据
 * 2. 模拟数据，用于前端开发
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-05-20
 */

/**
 * 获取统计卡片数据
 * @returns {Promise} 返回统计卡片数据的Promise对象
 */
export function getStatCards() {
  // 模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: [
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
      })
    }, 500)
  })
}

/**
 * 获取访问趋势数据
 * @param {string} period - 时间周期（week=本周, month=本月, year=全年）
 * @returns {Promise} 返回访问趋势数据的Promise对象
 */
export function getVisitTrend(period = 'week') {
  // 模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      // 根据选择的周期生成不同的数据
      let xAxis = []
      let visitData = []
      let registerData = []
      
      if (period === 'week') {
        xAxis = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        visitData = [120, 132, 101, 134, 90, 230, 210]
        registerData = [20, 32, 11, 34, 30, 50, 40]
      } else if (period === 'month') {
        xAxis = Array.from({length: 30}, (_, i) => (i + 1) + '日')
        visitData = Array.from({length: 30}, () => Math.floor(Math.random() * 300) + 100)
        registerData = Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 10)
      } else {
        xAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        visitData = [320, 302, 301, 334, 390, 330, 320, 302, 301, 334, 390, 330]
        registerData = [120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230]
      }
      
      resolve({
        code: 20000,
        data: {
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
      })
    }, 500)
  })
}

/**
 * 获取用户分布数据
 * @returns {Promise} 返回用户分布数据的Promise对象
 */
export function getUserDistribution() {
  // 模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: [
          { value: 1048, name: '普通用户' },
          { value: 735, name: '会员用户' },
          { value: 580, name: 'VIP用户' },
          { value: 484, name: '企业用户' },
          { value: 300, name: '其他' }
        ]
      })
    }, 500)
  })
}

/**
 * 获取工作进度数据
 * @returns {Promise} 返回工作进度数据的Promise对象
 */
export function getWorkProgress() {
  // 模拟数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: {
          completionRate: 68,
          statusText: '本周工作进度良好，按计划推进中'
        }
      })
    }, 500)
  })
} 