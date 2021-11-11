
export default {
  name: 'HsTableColumn',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    width: {},
    prop: {},
    name: {}
  },
  render () {
    // slots 也要渲染，需要计算合并表头
    return null
  }
}
