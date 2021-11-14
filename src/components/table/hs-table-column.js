export default {
  name: 'HsTableColumn',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    width: {},
    data: {},
    title: {},
    readOnly: {
      type: Boolean | String,
      default: true
    },
    renderCellFormat: {}
  },
  data () {
    return {
      vnode: []
    }
  },
  render (h) {
    return h()
  }
}
