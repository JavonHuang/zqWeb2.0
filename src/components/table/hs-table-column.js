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
      default: (rowData, row, col, data, hot) => {}
    }
  },
  computed: {
    owner() {
      let parent = this.$parent;
      // while (parent && !parent.tableId) {
      //   parent = parent.$parent;
      // }
      return parent;
    },
  },

  mounted() {
    const owner = this.owner;
    const children = owner.$el.children[2].children
    const columnIndex = this.getColumnElIndex(children, this.$el)
    console.log(children, columnIndex)
    owner.store.commit('insertColumn', this);
  },
  methods:{
    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child);
    },
  },
  render (h) {
    return h('div',{
      style:{
        display:'none'
      }
    })
  }
}
