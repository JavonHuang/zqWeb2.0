<template>
  <div class="VHandsontable">
    <slot></slot>
    <div ref="tablemain">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Handsontable from 'handsontable'
import { createStore, mapStates } from './store/helper'
import { renderIndexCell } from './vh-column-footer'
import {deepList2} from './store/group'
const lodash = require('lodash')
export default {
  props:{
    defaultSort:{
      type:Object,
      default:()=>{
        return null
      }
    },
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
    rowHeaders: {
      type: Boolean,
      default: true
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
    currentRowClassName:{
      type: String,
      default: 'currentSelRow',
    },
    mergeCellsKey:{
      type:Array,
      default:()=>{
        return []
      }
      //合并key依据
    },
    //列宽拖动
    manualColumnResize:{
      type: Boolean,
      default: false
    },
    nestedHeaders:{
      type:Array,
      default:()=>{
        return []
      }
    },
    fixedRowsBottom:{
      type: Number,
      default: null
    },
    fixedColumnsLeft:{
      type: Number,
      default: null
    },
    countFixedRowsBottom:{
      type: Number,
      default: null
    },
    columnsFooter:{
      type: Object,
      default: ()=>null
    }
  },
  computed:{
    ...mapStates({
      columns: 'columns',
      selectAll:'selectAll',
      columnsMap:'columnsMap',
      columnsSort:'columnsSort',
      nestedHeaderTitle:'nestedHeaderTitle',
      operateColumns:'operateColumns',
      columnsFooterMap:'columnsFooterMap'
    })
  },
  watch: {
    columns: {
      handler: function (newVal) {
        if (newVal) {
          this.initComponent()
        }
      }
    },
    columnsSort:{
      handler: function (newVal) {
        if (newVal) {
          this.$emit('onColumnsSort',newVal)
        }
      },
      deep:true
    },
    selectAll:{
      handler: function (newVal) {
        this.selectAllChange(newVal)
      },
    },
    columnsFooter:{
      handler: function () {
        this.updateFooter()
      },
      deep:true
    }
  },
  data () {
    this.store = createStore(this, {
      columns:[],
      selectAll:false,
      columnsMap:{},
      columnsSort:this.defaultSort||null,
      nestedHeaderTitle:[],
      operateColumns:[],
      columnsFooterMap:{}
    })
    return {
      hot: null,
      mergeCells:[],
      dataMaxNum:0,
      dispalyNode:[]
    }
  },
  methods:{
    initComponent(){
      if (this.hot) {
        this.hot.updateSettings({
          columns:this.columns
        })
        return false
      }
      this.hot = new Handsontable(this.$refs.tablemain,{
        language: 'zh-CN', // 设置语言
        data: [],
        ...this.$props,
        columns:this.columns,
        nestedHeaders: this.nestedHeaders.length>0?[this.nestedHeaders,this.nestedHeaderTitle]:null,
        mergeCells:this.mergeCellsKey.length>0,
        licenseKey: 'non-commercial-and-evaluation',
        beforeLoadData:this.beforeLoadData,
        afterLoadData:this.afterLoadData,
        afterGetColHeader:this.afterGetColHeader,
        afterChange:this.afterChange,
        afterRender:this.afterRender
      })
    },
    beforeLoadData(){
    },
    afterLoadData(sourceData){
      if(sourceData.length>0 && this.hot){
        let mergeCellIntance = this.hot.getPlugin('mergeCells')
        this.mergeCells.forEach(item=>{
          mergeCellIntance.merge(item.startRow,item.startCol,item.endRow,item.endCol)
        })
      }
    },
    afterGetColHeader(col, TH){
      let obj = TH.querySelector('._nested-header-title')
      if(!this.nestedHeaders.length>0 || obj){
        if(col!=-1 && this.columns && this.columns[col].renderHeader){
          this.columns[col].renderHeader(col, TH)
        }
      }
    },
    afterChange(changes){
      // 设置全选、半选、全不选
      if(this.hot){
        const list = this.hot.getSourceData()
        const hasFalse = list.find(item=>!item.seletextction)
        const hasTrue = list.find(item=>item.seletextction)
        if(hasFalse && hasTrue){
          this.store.commit('setSelectAll',null)
          const selList = list.filter(item=>{
            return item.seletextction
          })
          this.$emit('selection-change',selList)
        } else if(hasFalse && !hasTrue){
          this.store.commit('setSelectAll',false)
        }else if(!hasFalse && hasTrue){
          this.store.commit('setSelectAll',true)
        }
      }
    },
    afterRender(isForced){
      /**
       * 底部计算时处理视图逻辑
       * */
      if(isForced && this.countFixedRowsBottom){
        this.dispalyNode.forEach(item=>{
          item.style.visibility= null
        })
        this.dispalyNode = []
        renderIndexCell(this.$el,this.dataMaxNum,this.dispalyNode)
        this.updateFooter()
      }
    },
    updateFooter(){
      lodash.forIn(this.columnsFooter,(value, key)=>{
        !lodash.isEmpty(this.columnsFooterMap) && (this.columnsFooterMap[key].innerHTML = value)
      })
    },
    loadData(sourceData){
      if(this.countFixedRowsBottom){
        let last = {}
        lodash.forIn(sourceData[0],(value, key)=>{
          last[key] = null
        })
        sourceData.push(last)
      }
      this.dataMaxNum = sourceData.length
      if(this.mergeCellsKey.length>0){
        let list = lodash.sortBy(sourceData,this.mergeCellsKey)
        list.forEach((item,index)=>{
          item['seletextction'] = this.selectAll
          item['rowIndex'] = index
          this.operateColumns.forEach(_key=>{
            item[_key] = null
          })
        })
        let mergeCells = []
        if(list.length>0){
          deepList2(list,this.mergeCellsKey,mergeCells,this.columnsMap,0)
          this.mergeCells = mergeCells
        }
        this.hot.loadData(list)
      }else{
        sourceData.forEach((item,index)=>{
          item['seletextction'] = this.selectAll,
          this.operateColumns.forEach(_key=>{
            item[_key] = null
          })
        })
        this.hot.loadData(sourceData)
      }
    },
    unmerge(){
      if(this.mergeCells.length>0 && this.hot){
        let mergeCellIntance = this.hot.getPlugin('mergeCells')
        mergeCellIntance.clearCollections()
      }
    },
    selectAllChange(selectAll){
      if(selectAll===null){
        return false
      }
      let list = this.hot.getSourceData()
      list.forEach(item=>{
        item.seletextction= selectAll
      })
      this.$emit('selection-change',selectAll?list:[])
      this.hot.loadData(list)
    }
  }
}
</script>

<style lang="scss" scoped>
.VHandsontable{
  display: flex;
  flex-direction: column;
  ::v-deep
  .show-overflow-tooltip{
    div{
      overflow:hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
    }
  }
  ::v-deep
  .show-all{
    div{
      word-break:break-all;
      word-break:keep-all;
      word-wrap:break-word;
    }
  }
  ::v-deep
  .handsontable{
    table thead{
      th.ht__highlight.ht__active_highlight{
        background-color: #dcdcdc;
      }
    }
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
    .header-sort{
      display: flex;
    }
    .colHeader{
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>