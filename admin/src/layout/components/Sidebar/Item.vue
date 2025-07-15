<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'menu-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} class='menu-icon'/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title' class='menu-title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.menu-icon {
  margin-right: 10px;
  width: 16px;
  text-align: center;
  font-size: 16px;
  vertical-align: middle;
  color: #666;
}

.menu-title {
  vertical-align: middle;
  font-size: 14px;
  color: #333;
  letter-spacing: 0.2px;
}
</style>
