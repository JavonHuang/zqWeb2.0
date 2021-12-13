<template>
  <div class="pageVHandsontable">
    <VHandsontable v-bind="$attrs" v-on="$listeners" v-on:onColumnsSort="sortChange" ref="handsontableDom">
      <slot v-for="item in slotList" :slot="item" :name="item"></slot>
    </VHandsontable>
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
import VHandsontable from './VHandsontable'
export default {
  components: {
    VHandsontable
  },
  computed: {
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
      hot: null,
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
      that.$refs.handsontableDom.unmerge()
      that.$axios.post(that.url, { sort: that.sort, currentPage: that.currentPage, pageSize: that.pageSize, ...that.query }, false, true).then(res => {
        if (res.data.code === '200') {
          that.list = res.data.data
          this.count = res.data.count
          that.$refs.handsontableDom.loadData(that.list)
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
        order: column.sort,
        prop: column.data
      }
      that.getDataSource()
    }
  }
}
</script>

<style lang="scss" scoped>
.pageVHandsontable{
  display: flex;
  height: 100%;
  flex-direction: column;
  border:1px solid #ccc;
  box-sizing: content-box;
  .VHandsontable{
    flex:1;
    margin: 0px -1px 0px 0px;
  }
  .pagination{
    border-top:1px solid #ccc;
  }
}
</style>