import type { App, DirectiveBinding } from 'vue'

interface LazyLoadElement extends HTMLElement {
  _lazyLoadObserver?: IntersectionObserver
  _lazyLoadSrc?: string
  _lazyLoadLoaded?: boolean
}

interface LazyLoadOptions {
  src?: string
  loading?: string
  error?: string
  threshold?: number
  rootMargin?: string
  once?: boolean
}

// 默认配置
const defaultOptions: Required<LazyLoadOptions> = {
  src: '',
  loading: '/img/loading.gif',
  error: '/img/error.png',
  threshold: 0.1,
  rootMargin: '50px',
  once: true
}

// 创建 Intersection Observer
const createObserver = (options: Required<LazyLoadOptions>) => {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target as LazyLoadElement
      
      if (entry.isIntersecting) {
        loadImage(el, options)
        
        // 如果设置了 once，加载后停止观察
        if (options.once && el._lazyLoadObserver) {
          el._lazyLoadObserver.unobserve(el)
        }
      }
    })
  }, {
    threshold: options.threshold,
    rootMargin: options.rootMargin
  })
}

// 加载图片
const loadImage = (el: LazyLoadElement, options: Required<LazyLoadOptions>) => {
  if (el._lazyLoadLoaded) return
  
  const src = el._lazyLoadSrc || options.src
  if (!src) return
  
  // 添加加载状态
  el.classList.add('lazy-loading')
  
  // 创建新的图片对象来预加载
  const img = new Image()
  
  img.onload = () => {
    // 加载成功
    if (el.tagName === 'IMG') {
      (el as HTMLImageElement).src = src
    } else {
      el.style.backgroundImage = `url(${src})`
    }
    
    el.classList.remove('lazy-loading')
    el.classList.add('lazy-loaded')
    el._lazyLoadLoaded = true
    
    // 触发自定义事件
    el.dispatchEvent(new CustomEvent('lazy-loaded', { detail: { src } }))
  }
  
  img.onerror = () => {
    // 加载失败
    const errorSrc = options.error
    if (errorSrc) {
      if (el.tagName === 'IMG') {
        (el as HTMLImageElement).src = errorSrc
      } else {
        el.style.backgroundImage = `url(${errorSrc})`
      }
    }
    
    el.classList.remove('lazy-loading')
    el.classList.add('lazy-error')
    
    // 触发自定义事件
    el.dispatchEvent(new CustomEvent('lazy-error', { detail: { src, error: 'Failed to load image' } }))
  }
  
  // 开始加载
  img.src = src
}

// 设置占位图
const setPlaceholder = (el: LazyLoadElement, options: Required<LazyLoadOptions>) => {
  if (options.loading) {
    if (el.tagName === 'IMG') {
      (el as HTMLImageElement).src = options.loading
    } else {
      el.style.backgroundImage = `url(${options.loading})`
    }
  }
  
  el.classList.add('lazy-placeholder')
}

// 懒加载指令
const lazyLoad = {
  mounted(el: LazyLoadElement, binding: DirectiveBinding<string | LazyLoadOptions>) {
    // 解析配置
    let options: Required<LazyLoadOptions>
    
    if (typeof binding.value === 'string') {
      options = { ...defaultOptions, src: binding.value }
    } else {
      options = { ...defaultOptions, ...binding.value }
    }
    
    // 保存原始 src
    el._lazyLoadSrc = options.src
    
    // 检查是否支持 Intersection Observer
    if (!window.IntersectionObserver) {
      // 不支持则直接加载
      loadImage(el, options)
      return
    }
    
    // 设置占位图
    setPlaceholder(el, options)
    
    // 创建观察器
    el._lazyLoadObserver = createObserver(options)
    el._lazyLoadObserver.observe(el)
  },
  
  updated(el: LazyLoadElement, binding: DirectiveBinding<string | LazyLoadOptions>) {
    // 更新时重新设置 src
    let newSrc: string
    
    if (typeof binding.value === 'string') {
      newSrc = binding.value
    } else {
      newSrc = binding.value?.src || ''
    }
    
    // 如果 src 发生变化，重新加载
    if (newSrc !== el._lazyLoadSrc) {
      el._lazyLoadSrc = newSrc
      el._lazyLoadLoaded = false
      el.classList.remove('lazy-loaded', 'lazy-error')
      
      // 解析新配置
      let options: Required<LazyLoadOptions>
      if (typeof binding.value === 'string') {
        options = { ...defaultOptions, src: binding.value }
      } else {
        options = { ...defaultOptions, ...binding.value }
      }
      
      // 如果在视口内，立即加载
      if (el._lazyLoadObserver) {
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isVisible) {
          loadImage(el, options)
        } else {
          setPlaceholder(el, options)
        }
      }
    }
  },
  
  unmounted(el: LazyLoadElement) {
    // 清理观察器
    if (el._lazyLoadObserver) {
      el._lazyLoadObserver.disconnect()
      delete el._lazyLoadObserver
    }
    
    // 清理属性
    delete el._lazyLoadSrc
    delete el._lazyLoadLoaded
  }
}

// 注册指令的函数
export const registerLazyLoadDirective = (app: App) => {
  app.directive('lazy', lazyLoad)
}

// 工具函数：预加载图片
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// 工具函数：批量预加载图片
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage))
}

export default lazyLoad
