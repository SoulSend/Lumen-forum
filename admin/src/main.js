/**
 * HRC后台管理系统 - 主入口文件
 * 
 * 功能说明：
 * 1. 初始化Vue应用
 * 2. 配置Element UI组件库
 * 3. 引入全局样式和图标
 * 4. 配置路由和状态管理
 * 5. 初始化权限控制
 * 6. 初始化日志系统
 * 
 * @author HRC Team
 * @version 1.1.0
 * @date 2024-05-20
 */

import Vue from 'vue'

// 引入CSS重置样式，确保跨浏览器一致性
import 'normalize.css/normalize.css'

// 引入Element UI组件库 - 按需引入
import {
  Button, 
  Menu, 
  Submenu, 
  MenuItem, 
  Form, 
  FormItem, 
  Input, 
  Select, 
  Option, 
  Pagination,
  Table, 
  TableColumn, 
  Dialog, 
  Loading, 
  Message, 
  MessageBox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Breadcrumb,
  BreadcrumbItem,
  Tooltip,
  Scrollbar,
  Switch,
  DatePicker,
  Popover,
  Card,
  Tabs,
  TabPane,
  Tag
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // 使用中文语言包

// 按需注册Element UI组件
Vue.use(Button, { locale })
Vue.use(Menu, { locale })
Vue.use(Submenu, { locale })
Vue.use(MenuItem, { locale })
Vue.use(Form, { locale })
Vue.use(FormItem, { locale })
Vue.use(Input, { locale })
Vue.use(Select, { locale })
Vue.use(Option, { locale })
Vue.use(Pagination, { locale })
Vue.use(Table, { locale })
Vue.use(TableColumn, { locale })
Vue.use(Dialog, { locale })
Vue.use(Dropdown, { locale })
Vue.use(DropdownMenu, { locale })
Vue.use(DropdownItem, { locale })
Vue.use(Breadcrumb, { locale })
Vue.use(BreadcrumbItem, { locale })
Vue.use(Tooltip, { locale })
Vue.use(Scrollbar, { locale })
Vue.use(Switch, { locale })
Vue.use(DatePicker, { locale })
Vue.use(Popover, { locale })
Vue.use(Card, { locale })
Vue.use(Tabs, { locale })
Vue.use(TabPane, { locale })
Vue.use(Tag, { locale })

// 注册全局服务方法
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

// 引入全局样式
import '@/styles/index.scss'

// 引入核心模块
import App from './App'
import store from './store'
import router from './router'

// 引入图标和权限控制
import '@/icons'
import '@/permission'

// 引入日志系统
import logger from '@/utils/logger'

// 初始化日志系统
Vue.prototype.$logger = logger

// 全局错误处理
Vue.config.errorHandler = function(err, vm, info) {
  // 记录Vue全局错误
  logger.error('Vue错误', {
    message: err.message,
    stack: err.stack,
    info,
    component: vm ? vm.$options.name || vm.$options._componentTag : 'unknown'
  }, 'ERROR')
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }
}

// 全局Promise错误处理
window.addEventListener('unhandledrejection', event => {
  // 记录未处理的Promise错误
  logger.error('未处理的Promise错误', {
    reason: event.reason ? (event.reason.stack || event.reason.message || event.reason) : '未知原因'
  }, 'ERROR')
})

/**
 * 系统启动日志
 */
// 记录系统启动日志
logger.info(`系统启动 - ${process.env.NODE_ENV}环境`, {
  time: new Date().toISOString(),
  version: '1.1.0'
})

// 关闭生产环境提示
Vue.config.productionTip = false

// 创建Vue实例
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
