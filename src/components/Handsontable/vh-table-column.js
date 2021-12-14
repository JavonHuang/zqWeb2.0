import Handsontable from 'handsontable'
import VhTableColumnSort from './VhTableColumnSort.vue'
import VhTableColumnSelect from './VhTableColumnSelect.vue'
import Vue from 'vue'
import {generateUUID} from './store/group'
export default {
  name: 'VhTableColumn',
  components:{
    VhTableColumnSort
  },
  props: {
    type: {
      type: String,
      default: null
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
    formatter:Function,//rowData,prop,value,rowIndex
    showOverflowTooltip:Boolean,
    sortable: {
      type: Boolean,
      default: false
    }
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
      hasHeaderScopedSlots:false,
      hasHeaderTipsScopedSlots:false,
      sort:null
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

    if(!props.type){
      props.type='text',
      props.data = generateUUID('operate')
      owner.store.commit('insertOperateColumn', props.data)
    }
    if(this.hasScopedSlots){
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCellSlot(instance, td, row, col, prop, value, cellProperties, props)
      }
    }else if(props.formatter){
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCellByfFormatter(instance, td, row, col, prop, value, cellProperties, props)
      }
    }else if(props.type!=='selection') {
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCell(instance, td, row, col, prop, value, cellProperties, props)
      }
    }

    //全选勾选
    if(props.type=='selection'){
      props.type = 'checkbox'
      props.data = 'seletextction'
      props.width= props.width|| 40
      props.renderHeader =(col,TH)=>{
        this.seletextctionRenderHeader(col,TH,props)
      }
    }else{
      //设置模板插槽列头&&设置排序
      if(this.$scopedSlots.header){
        this.hasHeaderScopedSlots = true
      }
      if(this.$scopedSlots.headerTips){
        this.hasHeaderTipsScopedSlots = true
      }
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
      const appDom = TH.querySelector('.colHeader')
      appDom.innerHTML = ''
      const deidom = document.createElement('span')
      appDom.appendChild(deidom)
      let renderNode = []
      if(this.hasHeaderScopedSlots){
        renderNode.push(this.$scopedSlots.header({col:col,TH:TH,columns:props}))
      }else{
        renderNode.push(<div>{props.title}</div>)
      }
      if(this.hasHeaderTipsScopedSlots){
        renderNode.push(this.$scopedSlots.headerTips({col:col,TH:TH,columns:props}))
      }
      if(props.sortable){
        const node = <VhTableColumnSort owner={this.owner} columnKey={props.data}/>
        renderNode.push(node)
      }
      new Vue({
        render: function (createElement) {
          return createElement(
            'span',
            {
              'class':{
                'header-sort':true
              }
            },
            [...renderNode]
          )
        }
      }).$mount(deidom)
    },
    seletextctionRenderHeader (col,TH,props) {
      const appDom = TH.querySelector('.colHeader')
      appDom.innerHTML = ''
      const deidom = document.createElement('span')
      appDom.appendChild(deidom)
      const nodeDom = <VhTableColumnSelect owner={this.owner}/>
      new Vue({
        render: function (createElement) {
          return createElement(
            'span',
            [nodeDom]
          )
        }
      }).$mount(deidom)
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