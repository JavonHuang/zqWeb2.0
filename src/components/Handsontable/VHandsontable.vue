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
import {deepList2} from './store/group'
const lodash = require('lodash')
export default {
  props:{
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
      default: null
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
      handler: function (newVal) {
        if (newVal) {
          this.initComponent()
        }
      }
    }
  },
  data () {
    this.store = createStore(this, {
      columns:[],
      selectAll:false,
      columnsMap:{}
    })
    return {
      hot: null,
      mergeCells:[]
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
        mergeCells:this.mergeCellsKey.length>0,
        licenseKey: 'non-commercial-and-evaluation',
        afterLoadData:this.afterLoadData,
        afterGetColHeader:this.afterGetColHeader
      })
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
      const appDom = TH.querySelector('.colHeader')
      if(col!=-1 && this.columns && this.columns[col].renderHeader){
       this.columns[col].renderHeader(col, TH)
      }
    },
    loadData(sourceData){
      if(this.mergeCellsKey.length>0){
        let list = lodash.sortBy(sourceData,this.mergeCellsKey)
        list.forEach((item,index)=>{
          item['seletextction'] = this.selectAll
          item['rowIndex'] = index
        })
        let mergeCells = []
        if(list.length>0){
          deepList2(list,this.mergeCellsKey,mergeCells,this.columnsMap,0)
          this.mergeCells = mergeCells
        }
        this.hot.loadData(list)
      }else{
        sourceData.forEach((item,index)=>{
          item['seletextction'] = this.selectAll
        })
        this.hot.loadData(sourceData)
      }
    },
    unmerge(){
      if(this.mergeCells.length>0 && this.hot){
        let mergeCellIntance = this.hot.getPlugin('mergeCells')
        mergeCellIntance.clearCollections()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.VHandsontable{
  display: flex;
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
}
</style>