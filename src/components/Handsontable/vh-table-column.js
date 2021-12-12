import Handsontable from 'handsontable'
import Vue from 'vue'
export default {
  name: 'VhTableColumn',
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
    formatter:Function,
    showOverflowTooltip:Boolean
    //rowData,prop,value,rowIndex
  },
  computed: {
    owner() {
      let parent = this.$parent;
      return parent;
    }
  },
  data(){
    return {
      hasScopedSlots:false,
    }
  },
  mounted() {
    const owner = this.owner
    const children = owner.$el.children
    const columnIndex = this.getColumnElIndex(children, this.$el)
    const props = {... this.$props}

    //设置模板格显示
    if(this.$scopedSlots.default){
      this.hasScopedSlots = true
    }
    if(this.hasScopedSlots){
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCellSlot(instance, td, row, col, prop, value, cellProperties, props)
      }
    }else if(props.formatter){
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCellByfFormatter(instance, td, row, col, prop, value, cellProperties, props)
      }
    }else {
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCell(instance, td, row, col, prop, value, cellProperties, props)
      }
    }

    //设置模板插槽列头
    if(this.$scopedSlots.header){
      this.hasHeaderScopedSlots = true
    }
    if(this.hasHeaderScopedSlots){
      props['renderHeader']=(col,TH)=>{
        this.rendererHeader(col,TH,props)
      }
    }

    owner.store.commit('insertColumn', props, columnIndex)
  },
  methods:{
    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child);
    },
    rendererCellSlot(instance, td, rowIndex, colIndex, prop, value, cellProperties, props){
      const rowData = instance.getSourceDataAtRow(rowIndex)
      if(this.hasScopedSlots){
        const VNode = this.$scopedSlots.default({
          rowData:rowData,
          rowIndex:rowIndex,
          colIndex:colIndex,
          prop:prop,
          value:value,
          column:props
        })
        const deidom = document.createElement('div')
        Handsontable.dom.empty(td)
        this.setTdClasss(td)
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
    rendererCellByfFormatter(instance, td, rowIndex, colIndex, prop, value, cellProperties, props){
      const rowData = instance.getSourceDataAtRow(rowIndex)
      let result = props.formatter(rowData,prop,value,rowIndex)
      const deidom = document.createElement('div')
      Handsontable.dom.empty(td)
      deidom.innerHTML=result
      this.setTdClasss(td)
      td.appendChild(deidom)
      return td
    },
    rendererCell(instance, td, rowIndex, colIndex, prop, value, cellProperties, props){
      const deidom = document.createElement('div')
      Handsontable.dom.empty(td)
      deidom.innerHTML=value
      this.setTdClasss(td)
      td.appendChild(deidom)
      return td
    },
    setTdClasss(td){
      if(this.showOverflowTooltip){
        td.classList.add('show-overflow-tooltip')
      }else{
        td.classList.add('show-all')
      }
      if(this.owner.className){
        const classNameList = this.owner.className.split(' ')
        classNameList.forEach(cl=>{
          td.classList.add(cl)
        })
      }
    },
    rendererHeader(col,TH,props){
      const VNode = this.$scopedSlots.header({col:col,TH:TH,columns:props})
      const appDom = TH.querySelector('.colHeader')
      appDom.innerHTML = ''
      const deidom = document.createElement('div')
      appDom.appendChild(deidom)
      if (typeof VNode ==='string'){
        deidom.innerHTML = VNode
      }else{
        new Vue({
          render: function (createElement) {
            return createElement(
              'div',
              [VNode]
            )
          }
        }).$mount(deidom)
      }
    },
    rendererHeaderSort(){
      
    }
  },
  render (h) {
    return h('div',{
      style:{
        display:'none'
      }
    })
  }
}
