// 通用UI组件库
export { default as BaseButton } from './BaseButton.vue'
export { default as BaseCard } from './BaseCard.vue'
export { default as LoadingSpinner } from './LoadingSpinner.vue'
export { default as SkeletonLoader } from './SkeletonLoader.vue'

// 组件类型定义
export interface UIComponentProps {
  loading?: boolean
  disabled?: boolean
  size?: 'small' | 'default' | 'large'
}

// 主题配置
export const UI_THEME = {
  colors: {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399',
    text: {
      primary: '#303133',
      regular: '#606266',
      secondary: '#909399',
      placeholder: '#c0c4cc'
    },
    border: {
      base: '#dcdfe6',
      light: '#e4e7ed',
      lighter: '#ebeef5',
      extra_light: '#f2f6fc'
    },
    background: {
      base: '#f5f7fa',
      light: '#fafafa'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px'
  },
  borderRadius: {
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    round: '20px',
    circle: '50%'
  },
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '20px'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  },
  boxShadow: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  transition: {
    fast: '0.15s',
    base: '0.2s',
    slow: '0.3s'
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070
  }
} as const

// 响应式断点
export const BREAKPOINTS = {
  xs: '480px',
  sm: '768px',
  md: '992px',
  lg: '1200px',
  xl: '1920px'
} as const

// 工具函数
export const getResponsiveValue = (
  value: string | Record<string, string>,
  breakpoint: keyof typeof BREAKPOINTS = 'md'
): string => {
  if (typeof value === 'string') {
    return value
  }
  
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl'] as const
  const currentIndex = breakpointOrder.indexOf(breakpoint)
  
  // 从当前断点向下查找最近的值
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (value[bp]) {
      return value[bp]
    }
  }
  
  // 如果没找到，返回第一个可用值
  return Object.values(value)[0] || ''
}

// CSS变量生成器
export const generateCSSVariables = (theme = UI_THEME) => {
  const variables: Record<string, string> = {}
  
  const flattenObject = (obj: any, prefix = '--ui') => {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const newKey = `${prefix}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      
      if (typeof value === 'object' && value !== null) {
        flattenObject(value, newKey)
      } else {
        variables[newKey] = value
      }
    })
  }
  
  flattenObject(theme)
  return variables
}

// 组件注册函数
export const registerUIComponents = (app: any) => {
  // 这里可以批量注册组件
  // app.component('BaseButton', BaseButton)
  // app.component('BaseCard', BaseCard)
  // app.component('LoadingSpinner', LoadingSpinner)
  // app.component('SkeletonLoader', SkeletonLoader)
}
