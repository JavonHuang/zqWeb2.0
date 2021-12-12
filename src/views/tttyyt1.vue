<template>
  <div class="hs-page-handsontable">
    <div id="example1"></div>
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
import {deepList2} from '../components/table/store/group'
export default {
  data () {
    return {
      hot: null,
      mergeCellsKey:['SECURITY_CODE','CLOSE_PRICE','CHANGE_RATE'],
      hscolumnList: [],
      list: [],
      count: 0,
      pageSize: 20,
      currentPage: 1,
      sort: {
        order: null,
        prop: null
      }
    }
  },
  mounted () {
    const that = this
    const container = document.getElementById('example1')
    that.hot = new Handsontable(container, {
      data:[],
      colHeaders: true,
      height: 'auto',
      width: 'auto',
      hiddenColumns: true,
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
      ],
      licenseKey: 'non-commercial-and-evaluation',
    });
    that.getDataSource()
  },
  methods: {
    getDataSource () {
      const that = this
      that.$axios.post('/gzList/getGzList', { sort: that.sort, currentPage: that.currentPage, pageSize: that.pageSize, ...that.query }, false, true).then(res => {
        if (res.data.code === '200') {
          that.list = res.data.data
          that.count = res.data.count
          let list = lodash.sortBy(that.list,that.mergeCellsKey)
          that.hot.loadData(list)
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
