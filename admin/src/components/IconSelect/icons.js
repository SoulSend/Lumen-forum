/**
 * 图标选择组件辅助方法
 * 
 * @author HRC Team
 * @version 1.0.0
 * @date 2024-06-17
 */

// Element UI内置图标
const ELEMENT_ICONS = [
  'platform-eleme', 'eleme', 'delete-solid', 'delete', 's-tools', 'setting',
  'user-solid', 'user', 'phone', 'phone-outline', 'more', 'more-outline',
  'star-on', 'star-off', 's-goods', 'goods', 'warning', 'warning-outline',
  'question', 'info', 'remove', 'circle-plus', 'success', 'error', 'zoom-in',
  'zoom-out', 'remove-outline', 'circle-plus-outline', 'circle-check', 'circle-close',
  'sort', 'sort-up', 'sort-down', 'rank', 'loading', 'view', 'c-scale-to-original',
  'date', 'edit', 'edit-outline', 'folder', 'folder-opened', 'folder-add',
  'folder-remove', 'folder-delete', 'folder-checked', 'tickets', 'document-remove',
  'document-delete', 'document-copy', 'document-checked', 'document', 'document-add',
  'printer', 'paperclip', 'takeaway-box', 'search', 'monitor', 'attract',
  'mobile', 'scissors', 'umbrella', 'headset', 'brush', 'mouse', 'coordinate',
  'magic-stick', 'reading', 'data-line', 'data-board', 'pie-chart', 'data-analysis',
  'collection-tag', 'film', 'suitcase', 'suitcase-1', 'receiving', 'collection',
  'files', 'notebook-1', 'notebook-2', 'toilet-paper', 'office-building',
  'school', 'table-lamp', 'house', 'no-smoking', 'smoking', 'shopping-cart-full',
  'shopping-cart-1', 'shopping-cart-2', 'shopping-bag-1', 'shopping-bag-2',
  'sold-out', 'sell', 'present', 'box', 'bank-card', 'money', 'coin', 'wallet',
  'discount', 'price-tag', 'news', 'guide', 'share', 'star', 'goods-filled',
  'goods-collection', 'location', 'location-outline', 'location-information',
  'add-location', 'delete-location', 'map-location', 'alarm-clock', 'timer',
  'watch-1', 'watch', 'lock', 'unlock', 'key', 'service', 'mobile-phone',
  'bicycle', 'truck', 'ship', 'basketball', 'football', 'soccer', 'baseball',
  'wind-power', 'light-rain', 'lightning', 'heavy-rain', 'sunrise', 'sunrise-1',
  'sunset', 'sunny', 'cloudy', 'partly-cloudy', 'cloudy-and-sunny', 'moon',
  'moon-night', 'dish', 'dish-1', 'food', 'chicken', 'fork-spoon', 'knife-fork',
  'burger', 'tableware', 'sugar', 'dessert', 'ice-cream', 'hot-water', 'water-cup',
  'coffee-cup', 'cold-drink', 'goblet', 'goblet-full', 'goblet-square',
  'goblet-square-full', 'refrigerator', 'grape', 'watermelon', 'cherry', 'apple',
  'pear', 'orange', 'coffee', 'ice-tea', 'ice-drink', 'milk-tea', 'potato-strips',
  'lollipop', 'ice-cream-square', 'ice-cream-round', 'cpu', 'camera', 'camera-solid',
  'video-camera', 'video-camera-solid', 'message', 'bell', 'chat-line-square',
  'chat-dot-square', 'chat-dot-round', 'chat-square', 'chat-line-round', 'chat-round',
  'set-up', 'turn-off', 'open', 'connection', 'link', 'link-unlink', 'picture',
  'picture-outline', 'picture-outline-round', 'crop', 'picture-rounded', 'upload',
  'upload2', 'download', 'download2', 'camera-upload', 'camera-download', 'video-upload',
  'video-download', 'component', 'code', 'thumb', 'crop', 'data-board', 'aim',
  'guide', 'switch-button', 'data-line', 'operation', 'opportunity', 'odometer',
  'histogram', 'trend-charts', 'mark', 'female', 'male', 'guide', 'news', 'refresh',
  'refresh-right', 'refresh-left', 'message-solid', 'close', 'check', 'plus', 'minus',
  'close-bold', 'check-bold', 'arrow-left', 'arrow-down', 'arrow-right', 'arrow-up',
  'back', 'right', 'd-arrow-left', 'd-arrow-right', 'menu', 'top-left', 'top-right',
  'bottom-left', 'bottom-right', 'caret-top', 'caret-bottom', 'caret-right',
  'caret-left', 'd-caret', 'share', 's-marketing', 's-management', 's-ticket',
  's-release', 's-home', 's-promotion', 's-operation', 's-unfold', 's-fold',
  's-platform', 's-order', 's-cooperation', 'bell', 's-flag', 's-comment',
  's-finance', 's-claim', 's-custom', 's-opportunity', 's-data', 's-check',
  's-grid', 'menu', 'help', 'minus', 'plus', 'delete', 'mic', 'stopwatch',
  'scissors', 'document', 'document-copy', 'delete-solid', 'upload', 'download',
  'position', 'picture', 'help', 'clock', 'finished', 'refresh-left', 'refresh-right',
  'data-analysis', 'pie-chart', 'data-board', 'data-line', 'reading', 'magic-stick',
  'coordinate', 'mouse', 'brush', 'headset', 'umbrella', 'scissor', 'mobile',
  'attract', 'monitor', 'search', 'takeaway-box', 'paperclip', 'printer'
]

/**
 * 加载Element UI内置图标
 * @returns {Promise<Array>}
 */
export function loadElementIcons() {
  return Promise.resolve(ELEMENT_ICONS)
}

/**
 * 加载SVG图标
 * @returns {Promise<Array>}
 */
export function loadSvgIcons() {
  return new Promise((resolve) => {
    const requireAll = requireContext => requireContext.keys().map(requireContext)
    const req = require.context('@/icons/svg', false, /\.svg$/)
    const iconNames = req.keys().map(item => item.match(/\.\/(.*)\.svg/)[1])
    resolve(iconNames)
  })
} 