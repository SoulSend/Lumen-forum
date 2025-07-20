import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      // 只在开发环境启用开发工具
      ...(command === 'serve' ? [vueDevTools()] : []),
      // 打包分析工具
      ...(mode === 'analyze' ? [
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        })
      ] : [])
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: 5173,
      host: true,
      // 开发环境代理配置
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      // 生产环境构建优化
      target: 'es2015',
      minify: 'esbuild',
      // 代码分割
      rollupOptions: {
        output: {
          // 手动分包
          manualChunks: {
            // Vue核心
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            // UI库
            'ui-vendor': ['element-plus', '@element-plus/icons-vue'],
            // 工具库
            'utils-vendor': ['axios', '@vueuse/core'],
            // 编辑器
            'editor-vendor': ['@vueup/vue-quill']
          },
          // 文件命名
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              const fileName = facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '')
              return `js/${fileName}-[hash].js`
            }
            return 'js/[name]-[hash].js'
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name || '')) {
              return `media/[name]-[hash].${ext}`
            }
            if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(assetInfo.name || '')) {
              return `img/[name]-[hash].${ext}`
            }
            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || '')) {
              return `fonts/[name]-[hash].${ext}`
            }
            return `assets/[name]-[hash].${ext}`
          }
        }
      },
      // 资源内联阈值
      assetsInlineLimit: 4096,
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 生成source map
      sourcemap: mode === 'development'
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        '@vueuse/core'
      ],
      exclude: ['@vueup/vue-quill']
    },

    // 定义全局常量
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  }
})
