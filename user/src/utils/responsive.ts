import { ref, computed, onMounted, onUnmounted } from 'vue'

// 断点定义
export const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

// 响应式状态管理
export const useResponsive = () => {
  const windowWidth = ref(0)
  const windowHeight = ref(0)

  // 更新窗口尺寸
  const updateSize = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  // 计算当前断点
  const currentBreakpoint = computed((): BreakpointKey => {
    const width = windowWidth.value
    if (width < BREAKPOINTS.xs) return 'xs'
    if (width < BREAKPOINTS.sm) return 'sm'
    if (width < BREAKPOINTS.md) return 'md'
    if (width < BREAKPOINTS.lg) return 'lg'
    return 'xl'
  })

  // 断点检查函数
  const isXs = computed(() => windowWidth.value < BREAKPOINTS.xs)
  const isSm = computed(() => windowWidth.value >= BREAKPOINTS.xs && windowWidth.value < BREAKPOINTS.sm)
  const isMd = computed(() => windowWidth.value >= BREAKPOINTS.sm && windowWidth.value < BREAKPOINTS.md)
  const isLg = computed(() => windowWidth.value >= BREAKPOINTS.md && windowWidth.value < BREAKPOINTS.lg)
  const isXl = computed(() => windowWidth.value >= BREAKPOINTS.lg)

  // 移动端检查
  const isMobile = computed(() => windowWidth.value < BREAKPOINTS.md)
  const isTablet = computed(() => windowWidth.value >= BREAKPOINTS.md && windowWidth.value < BREAKPOINTS.lg)
  const isDesktop = computed(() => windowWidth.value >= BREAKPOINTS.lg)

  // 屏幕方向
  const isLandscape = computed(() => windowWidth.value > windowHeight.value)
  const isPortrait = computed(() => windowWidth.value <= windowHeight.value)

  // 大于等于某个断点
  const isGte = (breakpoint: BreakpointKey) => {
    return computed(() => windowWidth.value >= BREAKPOINTS[breakpoint])
  }

  // 小于某个断点
  const isLt = (breakpoint: BreakpointKey) => {
    return computed(() => windowWidth.value < BREAKPOINTS[breakpoint])
  }

  // 在某个断点范围内
  const isBetween = (min: BreakpointKey, max: BreakpointKey) => {
    return computed(() => 
      windowWidth.value >= BREAKPOINTS[min] && windowWidth.value < BREAKPOINTS[max]
    )
  }

  // 生命周期管理
  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return {
    // 尺寸
    windowWidth: computed(() => windowWidth.value),
    windowHeight: computed(() => windowHeight.value),
    
    // 断点
    currentBreakpoint,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    
    // 设备类型
    isMobile,
    isTablet,
    isDesktop,
    
    // 屏幕方向
    isLandscape,
    isPortrait,
    
    // 工具函数
    isGte,
    isLt,
    isBetween
  }
}

// 响应式值工具
export const useResponsiveValue = <T>(values: Partial<Record<BreakpointKey, T>>, defaultValue: T) => {
  const { currentBreakpoint } = useResponsive()
  
  return computed(() => {
    const breakpoints: BreakpointKey[] = ['xl', 'lg', 'md', 'sm', 'xs']
    const currentIndex = breakpoints.indexOf(currentBreakpoint.value)
    
    // 从当前断点开始向下查找
    for (let i = currentIndex; i < breakpoints.length; i++) {
      const bp = breakpoints[i]
      if (values[bp] !== undefined) {
        return values[bp]!
      }
    }
    
    return defaultValue
  })
}

// CSS媒体查询生成器
export const generateMediaQuery = (breakpoint: BreakpointKey, type: 'min' | 'max' = 'min') => {
  const width = BREAKPOINTS[breakpoint]
  return `@media (${type}-width: ${width}px)`
}

// 响应式网格系统
export const useResponsiveGrid = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  
  const getColumns = (mobile: number, tablet: number, desktop: number) => {
    return computed(() => {
      if (isMobile.value) return mobile
      if (isTablet.value) return tablet
      return desktop
    })
  }
  
  const getGap = (mobile: string, tablet: string, desktop: string) => {
    return computed(() => {
      if (isMobile.value) return mobile
      if (isTablet.value) return tablet
      return desktop
    })
  }
  
  return {
    getColumns,
    getGap
  }
}

// 响应式字体大小
export const useResponsiveFontSize = () => {
  const { currentBreakpoint } = useResponsive()
  
  const getFontSize = (sizes: Partial<Record<BreakpointKey, string>>) => {
    return useResponsiveValue(sizes, '14px')
  }
  
  const getLineHeight = (heights: Partial<Record<BreakpointKey, string>>) => {
    return useResponsiveValue(heights, '1.5')
  }
  
  return {
    getFontSize,
    getLineHeight,
    currentBreakpoint
  }
}

// 响应式间距
export const useResponsiveSpacing = () => {
  const { isMobile, isTablet } = useResponsive()
  
  const getPadding = (mobile: string, tablet: string, desktop: string) => {
    return computed(() => {
      if (isMobile.value) return mobile
      if (isTablet.value) return tablet
      return desktop
    })
  }
  
  const getMargin = (mobile: string, tablet: string, desktop: string) => {
    return computed(() => {
      if (isMobile.value) return mobile
      if (isTablet.value) return tablet
      return desktop
    })
  }
  
  return {
    getPadding,
    getMargin
  }
}

// 触摸设备检测
export const useTouchDevice = () => {
  const isTouchDevice = computed(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })
  
  const hasHover = computed(() => {
    return window.matchMedia('(hover: hover)').matches
  })
  
  return {
    isTouchDevice,
    hasHover
  }
}

// 设备像素比
export const useDevicePixelRatio = () => {
  const pixelRatio = ref(window.devicePixelRatio || 1)
  
  const updatePixelRatio = () => {
    pixelRatio.value = window.devicePixelRatio || 1
  }
  
  onMounted(() => {
    const mediaQuery = window.matchMedia(`(resolution: ${pixelRatio.value}dppx)`)
    mediaQuery.addEventListener('change', updatePixelRatio)
    
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', updatePixelRatio)
    })
  })
  
  const isHighDPI = computed(() => pixelRatio.value > 1)
  const isRetinaDisplay = computed(() => pixelRatio.value >= 2)
  
  return {
    pixelRatio: computed(() => pixelRatio.value),
    isHighDPI,
    isRetinaDisplay
  }
}

// 响应式图片工具
export const useResponsiveImage = () => {
  const { currentBreakpoint } = useResponsive()
  const { isHighDPI } = useDevicePixelRatio()
  
  const getImageSrc = (baseSrc: string, sizes?: Partial<Record<BreakpointKey, string>>) => {
    return computed(() => {
      let src = baseSrc
      
      // 根据断点选择不同尺寸的图片
      if (sizes && sizes[currentBreakpoint.value]) {
        src = sizes[currentBreakpoint.value]!
      }
      
      // 高DPI屏幕使用2x图片
      if (isHighDPI.value && !src.includes('@2x')) {
        const parts = src.split('.')
        if (parts.length > 1) {
          parts[parts.length - 2] += '@2x'
          src = parts.join('.')
        }
      }
      
      return src
    })
  }
  
  return {
    getImageSrc
  }
}
