<template>
  <div class="hs-handsontable">
    <div class="toolbar">
      <div><input placeholder="请输入内容"/></div>
      <el-dropdown trigger="click">
        <i class="el-icon-s-grid"></i>
        <el-dropdown-menu class="handsontable-hide-column" slot="dropdown">
          <el-checkbox-group class="column-list" v-on:change="showColumnChange" v-model="showColumnList">
            <el-checkbox :label="item.columnIndex" :key="item.columnIndex" v-for="item in columns">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div ref="tablemain">
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Handsontable from 'handsontable'
import { createStore, mapStates } from './store/helper'
import {generateGroup} from './store/group'
const lodash = require('lodash')
export default {
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
    },
    mergeCellsKey:{
      type:Array,
      default:()=>{
        return []
      }
      //合并key依据
    }
  },
  computed:{
    ...mapStates({
      columns: 'columns',
      selectAll:'selectAll',
      columnsMap:'columnsMap'
    })
  },
  watch: {
    columns: {
      handler: function (newVal, oldVal) {
        const that = this
        if (newVal) {
          that.showColumnList = newVal.map(item => item.columnIndex)
          that.nestedHeadersColumnName = newVal.map(item => item.title)
          that.initDom()
        }
      },
      immediate: true
    }
  },
  data () {
    this.store = createStore(this, {
      columns:[],
      selectAll:false,
      columnsMap:{},
      nestedHeaderTite:[]
    })
    return {
      hot: null,
      nestedHeadersColumnName: [],
      selectInputDom: null,
      showColumnList: [],
      mergeCells:[]
    }
  },
  methods: {
    initDom () {
      const that = this
      if (!that.$el) {
        return false
      }
      if (that.hot) {
        that.hot.updateSettings({
          columns:that.columns
        })
        that.hot.render()
        return false
      }
      that.hot = new Handsontable(that.$refs.tablemain, {
        language: 'zh-CN', // 设置语言
        data: [],
        ...that.$props,
        columns:that.columns,
        currentRowClassName: 'currentSelRow',
        search: true,
        licenseKey: 'non-commercial-and-evaluation',
        nestedHeaders: [
        ['A', { label: (()=> '<span>99</span>')(), colspan: 5 }, 'C89'],
        ['D', { label: 'E', colspan: 2 }, { label: 'F', colspan: 3 }, 'G'],
        that.nestedHeadersColumnName
        ],
        hiddenColumns: true,
        comments: true,
        cell: [
          { row: 1, col: 1, comment: { value: 'Some comment' } },
          { row: 2, col: 2, comment: { value: 'More comments' } }
        ],
        mergeCells:true,
        afterChange: that.afterChange,
        beforeLoadData: that.beforeLoadData,
        afterLoadData:that.afterLoadData,
        afterGetColHeader : that.afterGetColHeader,
        afterUpdateSettings:that.afterUpdateSettings
      })
    },
    afterChange(changes){
      const that = this
      // 设置全选、半选、全不选
      if(that.hot && that.selectInputDom){
        const list = that.hot.getSourceData()
        const hasFalse = list.find(item=>!item.seletextction)
        const hasTrue = list.find(item=>item.seletextction)
        if(hasFalse && hasTrue){
          that.store.commit('setSelectAll',false)
          that.selectInputDom.indeterminate = true
        } else if(hasFalse && !hasTrue){
          that.store.commit('setSelectAll',false)
          that.selectInputDom.indeterminate = false
          that.selectInputDom.checked = false
        }else if(!hasFalse && hasTrue){
          that.store.commit('setSelectAll',true)
          that.selectInputDom.indeterminate = false
          that.selectInputDom.checked = true
        }
      }
    },
    beforeLoadData(sourceData, initialLoad, source){
      const that = this
      let list = lodash.sortBy(sourceData,that.mergeCellsKey)
      list.forEach((item,index)=>{
        item['seletextction'] = that.selectAll
        item['rowIndex'] = index
      })
      let mergeCells = []
      if(list.length>0){
        generateGroup(list,that.mergeCellsKey,mergeCells,that.columnsMap,0)
        that.mergeCells = mergeCells
      }
      console.log(that.mergeCells)
      return list
    },
    afterLoadData(sourceData){
      const that = this
      if(sourceData.length>0 && that.hot){
        let mergeCellIntance = that.hot.getPlugin('mergeCells')
        // mergeCellIntance.merge(0,1,19,1)
        // merge(startRow: number, startCol: number, endRow: number, endCol): void;
        // mergeCellIntance.merge(that.mergeCells[0].row,that.mergeCells[0].col,that.mergeCells[0].rowspan,that.mergeCells[0].colspan)
        that.mergeCells.forEach(item=>{
          mergeCellIntance.merge(item.startRow,item.startCol,item.endRow,item.endCol)
        })
        // setTimeout(()=>{
        //   that.hot.render()
        // })
      }
    },
    afterUpdateSettings(){
      const that = this
    },
    afterGetColHeader(col, TH){
      const that = this;
      const appDom = TH.querySelector('.colHeader')
      if(col!=-1 && that.columns && that.columns[col].renderHeader){
        appDom.innerHTML = ''
        const deidom = document.createElement('div')
        const VNode = that.columns[col].renderHeader({selectAll:that.selectAll,col:col,TH:TH,columns:that.columns[col]})
        appDom.appendChild(deidom)
        if (typeof VNode ==='string'){
          deidom.innerHTML = VNode
          if(that.columns[col].data =='seletextction'){
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
        }
      }
    },
    seletextctionDomInit (dom) {
      const that = this
      that.selectInputDom = dom.querySelector('input')
      that.selectInputDom.addEventListener('change', function(e){
        that.store.commit('setSelectAll',e.target.checked)
        const list = that.hot.getSourceData()
        that.hot.loadData(list)
      },false)
    },
    showColumnChange(e){
      const that = this
      let hideList = []
      let showList = []
      that.columns.forEach(item=>{
        let noExit = e.find(_item=>_item===item.columnIndex)
        if(typeof noExit ==='undefined'){
          hideList.push(item.columnIndex)
        }else{
          showList.push(item.columnIndex)
        }
      })
      const plugin = that.hot.getPlugin('hiddenColumns')
      plugin.showColumns(showList)
      plugin.hideColumns(hideList)
      that.hot.render()
    },
    // 更新表格数据
    setDataAtCell (rowIndex, cellIndex, value, source = null) {
      const that = this
      that.hot.setDataAtCell(rowIndex, cellIndex, value, source)
    },
    loadData(list){
      const that = this
      that.hot.loadData(list)
    },
    unmerge(){
      const that = this
      if(that.mergeCells.length>0 && that.hot){
        let mergeCellIntance = that.hot.getPlugin('mergeCells')
        that.mergeCells.forEach(item=>{
          mergeCellIntance.unmerge(item.startRow,item.startCol,item.endRow,item.endCol)
        })
      }
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