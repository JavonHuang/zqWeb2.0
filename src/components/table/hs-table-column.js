import Handsontable from 'handsontable'
import Vue from 'vue'
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
    renderHeader: Function
  },
  computed: {
    owner() {
      let parent = this.$parent;
      // while (parent && !parent.tableId) {
      //   parent = parent.$parent;
      // }
      return parent;
    }
  },
  data(){
    return {
      cellNode: null,
      hasScopedSlots:false
    }
  },
  mounted() {
    if(this.$scopedSlots.default){
      this.hasScopedSlots = true
    }
    const owner = this.owner
    const children = owner.$el.children[2].children
    const columnIndex = this.getColumnElIndex(children, this.$el)
    const props = {... this.$props}
    if(props.type=='seletextction'){
      props.type = 'checkbox'
      props.data = 'seletextction'
      props.renderHeader = this.seletextctionRenderHeader
    }

    props['columnIndex'] = columnIndex
    if(this.hasScopedSlots){
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.renderer(instance, td, row, col, prop, value, cellProperties, props)
      }
    }
    owner.store.commit('insertColumn', props, columnIndex)
  },
  methods:{
    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child);
    },
    renderer(instance, td, row, col, prop, value, cellProperties, item){
      const that = this
      const rowData = instance.getSourceDataAtRow(row)
      if (that.hasScopedSlots) {
        const VNode = that.$scopedSlots.default({
          rowData:rowData,
          row:row,
          col:col,
          prop:prop,
          value:value,
          column:item
        })
        const deidom = document.createElement('div')
        Handsontable.dom.empty(td)
        if(that.owner.className){
          const classNameList = that.owner.className.split(' ')
          classNameList.forEach(cl=>{
            td.classList.add(cl)
          })
        }
        td.appendChild(deidom)
        new Vue({
          render: function (createElement) {
            return createElement(
              'div',
              [VNode]
            )
          }
        }).$mount(deidom)
      }
      return td
    },
    seletextctionRenderHeader (selectAll) {
      const that = this
      if(selectAll){
        return `<input class="htCheckboxRendererInput" type="checkbox" autocomplete="false" checked>`
      }else{
        return `<input class="htCheckboxRendererInput" type="checkbox" autocomplete="false">`
      }
    },
  },
  render (h) {
    return h('div',{
      style:{
        display:'none'
      },
      scopedSlots: {
        default: ()=>{
          test:980909
        }
      },
    })
  }
}
