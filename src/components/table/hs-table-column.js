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
    // owner.store.commit('insertColumn', this);
  },
  // data () {
  //   return {
  //     vnode: []
  //   }
  // },
  created(){
    console.log(this)
  },
  render (h) {
    return h()
  }
}
