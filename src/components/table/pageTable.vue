<template>
  <div class="mytable">
    <el-table
      :height="'100%'"
      border
      :data="list"
      @sort-change="sortChange"
      v-bind="$attrs"
      v-on="$listeners">
      <slot v-for="item in slotList" :slot="item" :name="item"></slot>
    </el-table>
    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 100]"
      :page-size="20"
      :total="count">
    </el-pagination>
  </div>
</template>

<script>
export default {
  computed: {
    // 继承插槽
    slotList () {
      const slotList = []
      const slots = this.$slots
      for (const key in slots) {
        slotList.push(key)
      }
      return slotList
    }
  },
  props: {
    url: {
      type: String,
      default: null
    },
    query: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
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
    if (this.$attrs['default-sort']) {
      this.sort = {
        order: this.$attrs['default-sort'].order === 'ascending' ? 'ASC' : ' DESC',
        prop: this.$attrs['default-sort'].prop
      }
    }
    this.getDataSource()
  },
  methods: {
    getDataSource () {
      const that = this
      that.$axios.post(that.url, { sort: that.sort, currentPage: that.currentPage, pageSize: that.pageSize, ...that.query }, false, true).then(res => {
        if (res.data.code === '200') {
          that.list = res.data.data
          this.count = res.data.count
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
.mytable{
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  ::v-deep
  .el-table__header{
    tr,th{
      background-color: #F2F2F2;
    }
    tr{
      th{
        padding: 8px 0;
        .cell{
          line-height:inherit;
          font-size: 12px;
          color: #4D4D4D;
          letter-spacing: 0;
          font-weight: bold;
        }
      }
    }
  }
  ::v-deep
  .el-table__header-wrapper{
    .el-table__header{
      .has-gutter{
        th:nth-last-child(2){
          border-right:none;
          .cell{
            padding-right: 25px;
          }
        }
      }
      .is-sortable{
        .caret-wrapper{
          height: 20px;
          .sort-caret{
            &.ascending{
              top: -1px;
            }
            &.descending{
              bottom: -1px;
            }
          }
        }
      }
    }
  }
  ::v-deep
  .el-table__fixed-header-wrapper{
    .is-sortable{
      .caret-wrapper{
        height: 20px;
        .sort-caret{
          &.ascending{
            top: -1px;
          }
          &.descending{
            bottom: -1px;
          }
        }
      }
    }
  }
  ::v-deep
  .el-table__body-wrapper{
    .el-table__row{
      td:last-of-type{
        .cell{
          padding-right: 25px;
        }
      }
    }
  }
  ::v-deep
  th.gutter{
    display: table-cell!important;
  }
  ::v-deep
  td{
    font-size: 12px;
    color: #4D4D4D;
    padding: 3px 0;
  }
  ::v-deep
  .hover-row>td{
    background-color: #F1F8FF;
  }
  ::v-deep
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: 1px solid #E6E6E6;
  }
  ::v-deep
  .el-table td, .el-table th.is-leaf{
    border-bottom: 1px solid #E6E6E6;
  }
  ::v-deep
  .el-table--border, .el-table--group{
    border: 1px solid #E6E6E6;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .pagination{
    border: 1px solid #EBEEF5;
    border-top: none;
  }
}
</style>
