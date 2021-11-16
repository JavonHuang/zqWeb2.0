export default {
  name: 'HsTableColumn',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    width: {},
    data: {},
    title: {
      type: String,
      default: null
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    renderHeader: {
      type: Function,
      default: (col, hot) => {}
    },
    renderCellFormat: {
      type: Function,
      default: (rowData, row, data, hot) => {}
    }
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
