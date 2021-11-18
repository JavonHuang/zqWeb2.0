<template>
  <div class="hs-handsontable">
    <div class="toolbar">
      <div><el-input placeholder="请输入内容"></el-input></div>
      <el-dropdown trigger="click">
        <i class="el-icon-s-grid"></i>
        <el-dropdown-menu class="handsontable-hide-column" slot="dropdown">
          <el-checkbox-group class="column-list" v-on:change="showColumnChange" v-model="showColumnList">
            <el-checkbox :label="item.index" :key="item.index" v-for="item in showColumnListALL">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div ref="tablemain">
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
          const  showColumnList = []
          const showColumnListALL =[]
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
            showColumnList.push(index)
            showColumnListALL.push({
              index:index,
              title:item.componentOptions.propsData.data =='seletextction'?'选择':item.componentOptions.propsData.title
            })
          })
          that.hscolumnList = columnList
          that.hscolumnListMap = hscolumnListMap
          that.showColumnListALL = [...showColumnListALL]
          that.showColumnList = [...showColumnList]
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
      type: String,
      default: 'htCenter htMiddle',
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
      selectInputDom: null,
      showColumnList: [],
      showColumnListALL:[]
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
      that.hot = new Handsontable(that.$refs.tablemain, {
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
        hiddenColumns: true,
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
          if(col!=-1 && that.hscolumnList[col].renderHeader){
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
                    [VNode]
                  )
                }
              }).$mount(deidom)
              that.hscolumnListMap[col] = VNode.data.attrs.title
              that.showColumnListALL[col].title = VNode.data.attrs.title
            }
          }
        }
      })
    },
    seletextctionRenderHeader (col, hot) {
      const that = this
      that.hscolumnListMap[col] = "选择"
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
    showColumnChange(e){
      const that = this
      let hideList = []
      let showList = []
      that.showColumnListALL.forEach(item=>{
        let noExit = e.find(_item=>_item===item.index)
        if(typeof noExit ==='undefined'){
          hideList.push(item.index)
        }else{
          showList.push(item.index)
        }
      })
      const plugin = that.hot.getPlugin('hiddenColumns')
      plugin.showColumns(showList)
      plugin.hideColumns(hideList)
      that.hot.render()
    },
    renderCellFormat (instance, td, row, col, prop, value, cellProperties, item) {
      const that = this
      const rowData = instance.getSourceDataAtRow(row)
      if (item.componentOptions.propsData.renderCellFormat) {
        const VNode = item.componentOptions.propsData.renderCellFormat(rowData, row, col,item.componentOptions.propsData.data, that.hot)
        const deidom = document.createElement('div')
        Handsontable.dom.empty(td)
        if(that.className){
          const classNameList = that.className.split(' ')
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
  .toolbar{
    border-bottom:1px solid #ccc;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
<style lang="scss">
.handsontable-hide-column{
  padding: 10px 10px;
  .column-list{
    display: flex;
    flex-direction: column;
  }
}
</style>