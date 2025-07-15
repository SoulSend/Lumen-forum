'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // 页面标题

// 如果端口设置为80，
// 使用管理员权限执行命令行。
// 例如，Mac: sudo npm run
// 您可以通过以下方法更改端口：
// port = 9528 npm run dev 或 npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // 开发端口

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * 如果您计划在子路径下部署站点，则需要设置publicPath，
   * 例如GitHub页面。如果您计划将站点部署到https://foo.github.io/bar/，
   * 那么publicPath应该设置为"/bar/"。
   * 在大多数情况下，请使用'/'！
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false, // 生产环境不生成source map，提高构建速度
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用程序的标题，
    // 以便可以在index.html中访问它以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 完全禁用性能警告 - 我们已经通过其他方式优化了打包
    performance: false
  },
  chainWebpack(config) {
    // 可以提高首屏速度，建议开启预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // 忽略runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 当有很多页面时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

    // 设置svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 更详细的图片处理配置
    // 对于小于10KB的图片，转换为base64以减少HTTP请求
    // 对于大于10KB的图片，使用file-loader处理
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10240, // 10KB
        name: 'static/img/[name].[hash:8].[ext]',
        esModule: false // 避免一些加载问题
      })
      .end()

    // 移除图片压缩配置以避免错误
    // 在生产环境中，可以考虑手动压缩图片资源

    // 生产环境优化
    config.when(process.env.NODE_ENV !== 'development', config => {
      // 启用gzip压缩
      if (process.env.NODE_ENV === 'production') {
        config
          .plugin('compression')
          .use(require('compression-webpack-plugin'), [{
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            threshold: 10240, // 只有大于10kb的资源会被处理
            minRatio: 0.8 // 只有压缩率小于这个值的资源才会被处理
          }])
      }

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime`必须与runtimeChunk名称相同。默认是`runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()
      config
        .optimization.splitChunks({
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 300000, // 调整块的最小大小
          automaticNameDelimiter: '-',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // 获取包名
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                // 避免名字太长和特殊字符
                return `npm.${packageName.replace('@', '')}`;
              },
              priority: 10
            },
            elementUI: {
              name: 'chunk-elementUI',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/
            },
            echarts: {
              name: 'chunk-echarts',
              priority: 25,
              test: /[\\/]node_modules[\\/]_?echarts(.*)/
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'),
              minChunks: 3,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })
      // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
