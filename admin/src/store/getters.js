/**
 * Vuex全局状态getters
 * 
 * 功能说明：
 * 定义全局状态的计算属性，方便在组件中访问
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-05-20
 */

const getters = {
  // 侧边栏状态
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  
  // 用户信息
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles
}

export default getters
