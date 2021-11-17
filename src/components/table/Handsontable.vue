<template>
  <div class="hs-handsontable">
    <div id="example" class="handsontable">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Handsontable from 'handsontable'
import elCheckEditor from './custom-editors'
export default {
  watch: {
    $slots: {
      handler: function (newVal, oldVal) {
        const that = this
        if (newVal.default) {
          const columnList = []
          const hscolumnListMap = {}
          newVal.default.forEach((item, index) => {
            let _item = {}
            if(item.componentOptions.propsData.type ==='seletextction'){
              item.componentOptions.propsData.type = 'checkbox'
              item.componentOptions.propsData.data = 'seletextction'
              item.componentOptions.propsData.renderHeader = that.seletextctionRenderHeader
            }
            if (item.componentOptions.propsData.renderCellFormat) {
              _item = {
                ...item.componentOptions.propsData,
                renderer: (instance, td, row, col, prop, value, cellProperties) => {
                  return that.renderCellFormat(instance, td, row, col, prop, value, cellProperties, item)
                }
              }
            } else {
              _item = {
                ...item.componentOptions.propsData
              }
            }
            columnList.push(_item)
            hscolumnListMap[index] = item.componentOptions.propsData.title
          })
          that.hscolumnList = columnList
          that.hscolumnListMap = hscolumnListMap
          that.nestedHeadersColumnName = columnList.map(item => item.title)
          that.initDom()
        }
      },
      immediate: true
    }
  },
  props: {
    width: {
      type: String,
      default: '100%'
      // 表格size
    },
    height: {
      type: String,
      default: '100%'
      // 表格size
    },
    rowHeights: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: 30
      // 表格行高
    },
    colWidths: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | Array,
      default: 30
      // 列宽，数组可以指定列宽
    },
    stretchH: {
      type: String,
      default: 'all'
      // 平分列宽自适应 none|last|all
    },
    className: {
      type: Array,
      default: () => {
        return ['htCenter', 'htMiddle']
      }
      // 对齐样式Horizontal: htLeft, htCenter, htRight, htJustify,Vertical: htTop, htMiddle, htBottom
    },
    rowHeaders: {
      type: Boolean,
      default: true
    },
    fixedRowsTop: {
      type: Number,
      default: 0
      // 行数 //固定顶部多少行不能垂直滚动
    },
    fixedColumnsLeft: {
      type: Number,
      default: 0
      // 列数 //固定左侧多少列不能水平滚动
    },
    fillHandle:{
      type: Boolean,
      default: false
      // 允许填充
    },
    contextMenu: {
      type: Boolean,
      default: true
      // 右键菜单
    }
  },
  data () {
    return {
      hot: null,
      hotDom: null,
      hscolumnList: [],
      hscolumnListMap: {},
      nestedHeadersColumnName: [],
      selectAll: false,
      selectInputDom: null
    }
  },
  created () {
  },
  mounted () {
    this.initDom()
  },
  methods: {
    initDom () {
      const that = this
      if (!that.$el) {
        return false
      }
      if (that.hot) {
        that.hot.render()
        return false
      }
      that.hot = new Handsontable(that.$el.firstChild, {
        language: 'zh-CN', // 设置语言
        data: [],
        ...that.$props,
        columns: that.hscolumnList,
        currentRowClassName: 'currentSelRow',
        search: true,
        licenseKey: 'non-commercial-and-evaluation',
        // nestedHeaders: [
        // ['A', { label: (()=> '<span>99</span>')(), colspan: 5 }, 'C89'],
        // ['D', { label: 'E', colspan: 2 }, { label: 'F', colspan: 3 }, 'G'],
        // that.nestedHeadersColumnName
        // ],
        comments: true,
        cell: [
          { row: 1, col: 1, comment: { value: 'Some comment' } },
          { row: 2, col: 2, comment: { value: 'More comments' } }
        ],
        afterRenderer:function(){
        },
        afterChange:function(changes){
          console.log(changes)
          // 设置全选、半选、全不选
          if(that.hot && that.selectInputDom){
            const list = that.hot.getSourceData()
            const hasFalse = list.find(item=>!item.seletextction)
            const hasTrue = list.find(item=>item.seletextction)
            if(hasFalse && hasTrue){
              that.selectAll = false
              that.selectInputDom.indeterminate = true
            } else if(hasFalse && !hasTrue){
              that.selectAll = false
              that.selectInputDom.indeterminate = false
              that.selectInputDom.checked = false
            }else if(!hasFalse && hasTrue){
              that.selectAll = true
              that.selectInputDom.indeterminate = false
              that.selectInputDom.checked = true
            }
          }
        },
        beforeLoadData:function(sourceData, initialLoad, source){
          sourceData.forEach(item=>{
            item['seletextction'] = that.selectAll
          })
          return sourceData
        },
        afterGetColHeader :function(col, TH){
          const appDom = TH.querySelector('.colHeader')
          if(col!=-1 && !that.hscolumnListMap[col] && that.hscolumnList[col].renderHeader){
            appDom.innerHTML = ''
            const deidom = document.createElement('div')
            appDom.appendChild(deidom)
            const VNode = that.hscolumnList[col].renderHeader(col, that.hot)
            if (typeof VNode ==='string'){
              deidom.innerHTML = VNode
              if(that.hscolumnList[col].data =='seletextction'){
                that.seletextctionDomInit(deidom)
              }
            }else{
              new Vue({
                render: function (createElement) {
                  return createElement(
                    'div',
                    [that.hscolumnList[col].renderHeader(col, that.hot)]
                  )
                }
              }).$mount(deidom)
            }
          }
        }
      })
    },
    seletextctionRenderHeader (col, hot) {
      const that = this
      if(that.selectAll){
        return `<input class="htCheckboxRendererInput" type="checkbox" autocomplete="false" checked>`
      }else{
        return `<input class="htCheckboxRendererInput" type="checkbox" autocomplete="false">`
      }
    },
    seletextctionDomInit (dom) {
      const that = this
      that.selectInputDom = dom.querySelector('input')
      that.selectInputDom.addEventListener('change', function(e){
        that.selectAll = e.target.checked
        const list = that.hot.getSourceData()
        that.hot.loadData(list)
      },false)
    },
    renderCellFormat (instance, td, row, col, prop, value, cellProperties, item) {
      const that = this
      const rowData = instance.getSourceDataAtRow(row)
      if (item.componentOptions.propsData.renderCellFormat) {
        const VNode = item.componentOptions.propsData.renderCellFormat(rowData, row, col,item.componentOptions.propsData.data, that.hot)
        const deidom = document.createElement('div')
        Handsontable.dom.empty(td)
        that.className.forEach(clName => {
          td.classList.add(clName)
        })
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
    // 更新表格数据
    setDataAtCell (rowIndex, cellIndex, value, source = null) {
      const that = this
      that.hot.setDataAtCell(rowIndex, cellIndex, value, source)
    }
  }
}
</script>

<style lang="scss" scoped>
.hs-handsontable{
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #ccc;
  ::v-deep
  .handsontable{
    th:first-child{
      border-left:none;
    }
    thead tr:first-child th{
      border-top:none;
    }
    table tbody tr:hover{
      background: #f7f7f7;
      th,td{
        background: #f7f7f7;
      }
    }
    table tbody tr{
      td.currentSelRow{
        background-color: #dcdcdc;
      }
    }
  }
  .pagination{
    border:none;
    border-top: 1px solid #ccc;
  }
}
</style>
