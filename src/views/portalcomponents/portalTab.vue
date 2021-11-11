<template>
  <div class="tabs">
    <el-tabs closable v-model="chosenTab" @tab-click="selTab" @tab-remove="removeTab">
      <el-tab-pane v-for="(item) in tabList" :key="item.menuId" :label="item.descr" :name="item.menuId">
        {{item.descr}}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'portalTab',
  data () {
    return {
      chosenTab: null,
      tabList: []
    }
  },
  computed: {
    menuList () {
      const list = this.$store.state.menuStoreModule.menuList
      list.forEach(item => {
        item.show = false
      })
      return list
    }
  },
  methods: {
    removeTab (d) {
      const that = this
      // 需删除的索引
      const index = that.tabList.findIndex(item => {
        return item.menuId === d
      })
      // 获取当前选中tab索引
      const chosenIndex = that.tabList.findIndex(item => {
        return item.menuId === that.chosenTab
      })
      that.tabList.splice(index, 1)
      if (index === chosenIndex) {
        if (chosenIndex === 0 && that.tabList.length > 0) {
          that.$emit('goPage', that.tabList[0])
        } else if (chosenIndex === 0 && that.tabList.length === 0) {
          that.$emit('goPage', null)
        } else if (chosenIndex !== 0) {
          that.$emit('goPage', that.tabList[chosenIndex - 1])
        }
      } else {
        if (index > chosenIndex) {
          that.$emit('goPage', that.tabList[chosenIndex])
        } else {
          that.$emit('goPage', that.tabList[chosenIndex - 1])
        }
      }
    },
    selTab (d) {
      const that = this
      const index = that.tabList.findIndex(item => {
        return item.menuId === d.name
      })
      that.$emit('goPage', that.tabList[index])
    },
    setTab (d) {
      const that = this
      that.chosenTab = d.menuId
      const index = that.tabList.findIndex(item => {
        return item.menuId === d.menuId
      })
      if (index === -1) {
        that.tabList.push(d)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/*页签块*/
.tabs ::v-deep {
  .el-tabs__nav-scroll{
    border-top: 1px solid #F2F3F7;
  }
  .el-tabs__header{
    margin: 0;
  }
  .el-tabs__nav-wrap::after{
    display: none !important;
    height: 0;
  }
  .el-tabs__item{
    height: 45px;
    // width: 100px;
    color: #909399;
    font-size: 12px;
    border-right: 1px solid #F2F3F7;
    .el-icon-close{
      position:absolute;
      top:7px;
    }
  }
  .el-tabs__active-bar{
    display: none;
  }
  .el-tabs__item.is-active{
    background: #F2F3F7;
    color: #188FFF;
    border-bottom: 2px solid #188FFF;
  }
  .el-tabs__content{
    display: none !important;
  }
  .el-tabs__item.is-top:nth-child(2){
    padding-left: 20px;
  }
  .el-tabs--top .el-tabs__item.is-top:last-child{
    padding-right: 20px;
  }
}
</style>
