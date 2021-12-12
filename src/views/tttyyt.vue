<template>
  <div class="hs-page-handsontable">
    <div id="example2"></div>
    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 100, 1000, 10000]"
      :page-size="20"
      :total="count">
    </el-pagination>
  </div>
</template>

<script>
import Handsontable from 'handsontable'
const lodash = require('lodash')
import {deepList2} from './../components/table/store/group'
export default {
  data () {
    return {
      hot: null,
      hscolumnList: [],
      list: [],
      count: 0,
      pageSize: 20,
      currentPage: 1,
      sort: {
        order: null,
        prop: null
      },
      mergeCellsKey:['SECURITY_CODE','CLOSE_PRICE','CHANGE_RATE'],
      mergeCells:[],
      columnsMap:{
        SECURITY_CODE:0,
        CLOSE_PRICE:1,
        CHANGE_RATE:2,
        TRADE_DATE:3
      }
    }
  },
  mounted () {
    const that = this
    const container = document.getElementById('example2')
    that.hot = new Handsontable(container, {
      data:[],
      colHeaders: true,
      height: 'auto',
      width: 'auto',
      rowHeights:100,
      hiddenColumns: true,
      // stretchH:'all',
      columns:[
        {
          data: 'SECURITY_CODE',
          title:'代码'
        },
        {
          data: 'CLOSE_PRICE',
          title:'收盘价'
        },
        {
          data: 'CHANGE_RATE',
          title:'波动'
        },
        {
          data: 'TRADE_DATE',
          title:'日期'
        },
        {
          data: 'rowIndex',
          title:'序号'
        },
      ],
      mergeCells:true,
      licenseKey: 'non-commercial-and-evaluation',
      beforeLoadData:(sourceData)=>{
        const that = this
        let list = lodash.sortBy(sourceData,that.mergeCellsKey)
        list.forEach((item,index)=>{
          item['seletextction'] = that.selectAll
          item['rowIndex'] = index
        })
        let mergeCells = []
        if(list.length>0){
          deepList2(list,that.mergeCellsKey,mergeCells,that.columnsMap,0)
          that.mergeCells = mergeCells
        }
        console.log(that.mergeCells)
        return list
      },
      afterLoadData:(sourceData)=>{
        const that = this
        if(sourceData.length>0 && that.hot){
          let mergeCellIntance = that.hot.getPlugin('mergeCells')
          that.mergeCells.forEach(item=>{
            mergeCellIntance.merge(item.startRow,item.startCol,item.endRow,item.endCol)
          })
        }
      },
    });
    that.getDataSource()
  },
  methods: {
    getDataSource () {
      const that = this
      if(that.mergeCells.length>0 && that.hot){
        let mergeCellIntance = that.hot.getPlugin('mergeCells')
        that.mergeCells.forEach(item=>{
          mergeCellIntance.unmerge(item.startRow,item.startCol,item.endRow,item.endCol)
        })
      }
      that.$axios.post('/gzList/getGzList', { sort: that.sort, currentPage: that.currentPage, pageSize: that.pageSize, ...that.query }, false, true).then(res => {
        if (res.data.code === '200') {
          that.list = res.data.data
          that.count = res.data.count
          that.hot.loadData(that.list)
        } else {
        }
      })
    },
    handleSizeChange (val) {
      const that = this
      that.pageSize = val
      that.getDataSource()
    },
    handleCurrentChange (val) {
      const that = this
      that.currentPage = val
      that.getDataSource()
    },
    sortChange (column) {
      const that = this
      that.sort = {
        order: column.order === 'ascending' ? 'ASC' : ' DESC',
        prop: column.prop
      }
      that.getDataSource()
    }
  }
}
</script>

<style lang="scss" scoped>
.hs-page-handsontable{
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .pagination{
    border:1px solid #ccc;
    border-top: none;
  }
}
</style>
