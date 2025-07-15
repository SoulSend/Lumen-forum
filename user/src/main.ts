import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import { registerPermissionDirectives } from './directives/permission'

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册权限指令
registerPermissionDirectives(app)

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
