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
    const _self = this
    const owner = this.owner
    const children = owner.$el.children
    const columnIndex = this.getColumnElIndex(children, this.$el)
    const props = {... this.$props}

    //设置模板格显示
    if(this.$scopedSlots.default){
      this.hasScopedSlots = true
    }

    //操作列设置
    if(!props.type){
      props.type='text',
      props.readOnly= true
      props.data = generateUUID('operate')
      owner.store.commit('insertOperateColumn', props.data)
    }

    /**
     * 渲染cell
     * */
    if(this.hasScopedSlots){
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCellSlot(instance, td, row, col, prop, value, cellProperties, props)
      }
    }else if(props.formatter){
      props['renderer']= (instance, td, row, col, prop, value, cellProperties) => {
        return this.rendererCellByfFormatter(instance, td, row, col, prop, value, cellProperties, props)
      }
    }else if(props.type=='selection'){
      props['renderer']=function (instance, td, row, col, prop, value, cellProperties){
        td.setAttribute('data-columns',props.data)
        if(_self.owner.dataMaxNum!=(row+1)){
          Handsontable.renderers.CheckboxRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties])
        }
        // return td
      }
    }
    else if(props.type!=='selection') {
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
      if(this.renderCountFixedRowsBottom(td,rowIndex,props.data)){
        return td
      }
      const rowData = instance.getSourceDataAtRow(rowIndex)
      if(this.hasScopedSlots){
        const VNode = this.$scopedSlots.default({
          td:td,
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
      if(this.renderCountFixedRowsBottom(td,rowIndex,props.data)){
        return td
      }
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
      if(this.renderCountFixedRowsBottom(td,rowIndex,props.data)){
        return td
      }
      const deidom = document.createElement('div')
      Handsontable.dom.empty(td)
      deidom.innerHTML=value
      this.setTdClasss(td)
      td.appendChild(deidom)
      return td
    },
    setTdClasss(td){
      td.style.height= `${this.owner.rowHeights}px`
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
    },
    renderCountFixedRowsBottom(td,rowIndex,columnsKey){
      if(!this.owner.countFixedRowsBottom){
        return false
      }
      /**
       * 处理计算，bottom悬浮行显示
       * case1:悬浮行显示自定义
       * case2:因为是使用底部悬浮行模拟的的合计行，所以要隐藏掉在原View table内的显示行
       * */
      const ht_clone_bottom = this.owner.$el.querySelector('.ht_clone_bottom table tbody')
      if(ht_clone_bottom.contains(td)){
        const deidom = document.createElement('div')
        Handsontable.dom.empty(td)
        this.setTdClasss(td)
        deidom.innerHTML=''
        td.appendChild(deidom)
        this.owner.store.commit('insertColumnsFooterMap', columnsKey, deidom)
        return td
      } else if(this.owner.dataMaxNum==(rowIndex+1)){
        const deidom = document.createElement('div')
        Handsontable.dom.empty(td)
        this.setTdClasss(td)
        deidom.innerHTML=''
        td.appendChild(deidom)
        td.setAttribute('data-columns',columnsKey)
        // td.parentNode.childNodes.forEach(item=>{
        //   // item.style.visibility='hidden'
        // })
        return td
      }else{
        return false
      }
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