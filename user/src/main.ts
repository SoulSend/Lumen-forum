import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 按需导入常用图标，而不是全量导入
import {
  Search,
  User,
  Bell,
  Setting,
  Plus,
  Edit,
  Delete,
  ArrowRight,
  ArrowLeft,
  Star,
  ChatDotRound,
  View,
  Share,
  Download
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import { registerPermissionDirectives } from './directives/permission'
import { registerLazyLoadDirective } from './directives/lazyLoad'
import { setupGlobalErrorHandler } from './utils/errorHandler'

const app = createApp(App)

// 只注册常用的Element Plus图标，减少初始包大小
const icons = {
  Search,
  User,
  Bell,
  Setting,
  Plus,
  Edit,
  Delete,
  ArrowRight,
  ArrowLeft,
  Star,
  ChatDotRound,
  View,
  Share,
  Download
}

for (const [key, component] of Object.entries(icons)) {
  app.component(key, component)
}

// 注册权限指令
registerPermissionDirectives(app)

// 注册懒加载指令
registerLazyLoadDirective(app)

// 设置全局错误处理
setupGlobalErrorHandler()

// 配置全局属性
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误处理:', err, instance, info)
}
app.use(createPinia())
   .use(router)
   .use(ElementPlus, {
     locale: zhCn,
     size: 'default'
   })

app.mount('#app')
