<template>
  <div class="hs-page-handsontable">
    <Handsontable v-bind="$attrs" v-on="$listeners" ref="handsontableDom">
      <slot v-for="item in slotList" :slot="item" :name="item"></slot>
    </Handsontable>
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
import Handsontable from './Handsontable.vue'
export default {
  components: {
    Handsontable
  },
  // 继承插槽
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
