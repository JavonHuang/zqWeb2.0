<template>
  <div>
    <el-menu class="menu-title el-menu-vertical-demo" :collapse="isCollapse">
        <el-menu-item>
          <i class="iconfont icon-jinxiaocuntubiao main-icon" style="color:#188FFF"></i>
          <span>web脚手架</span>
        </el-menu-item>
      </el-menu>
      <div class="menu">
        <el-menu class="el-menu-vertical-demo" :default-active="defaultActive" :unique-opened="true" :collapse="isCollapse">
          <el-menu-item index="PME00000000" class="header-main" style="padding-left: 16px!important;" v-on:click="goPage(indexMenu)">
            <i class="iconfont icon-gongzuotaicopy"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu v-bind:key="item.menuId" v-bind:index="item.menuId" v-for="(item) in menuList">
              <template slot="title">
                <i v-bind:class="['iconfont '+item.icon]"></i>
                <span>{{item.descr}}</span>
              </template>
              <el-menu-item-group v-bind:key="itemB.menuId" v-for="(itemB) in item.lstChild">
                <el-menu-item v-on:click="goPage(itemB)" v-bind:index="itemB.menuId">{{itemB.descr}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
        </el-menu>
      </div>
  </div>
</template>
<script>
import menuMutationType from './../../store/menuStoreModule/mutationType'
export default {
  name: 'portalmenu',
  data () {
    return {
      isCollapse: true,
      menuList: [],
      menuArray: [],
      defaultActive: null,
      indexMenu: {
        menuId: 'PME00000000',
        url: '/index/index',
        descr: '首页',
        parentId: null
      }
    }
  },
  methods: {
    getUserMenu () {
      const that = this
      that.menuList = [
        {
          menuId: 'PME10000000',
          url: '/index/index',
          descr: '首页',
          parentId: null,
          lstChild: [
            {
              menuId: 'ME100000001',
              url: '/zList/list',
              descr: '证券列表',
              parentId: 'PME10000001'
            },
            {
              menuId: 'ME100000002',
              url: '/gzList/list',
              descr: '港资列表',
              parentId: 'PME10000002'
            }
          ]
        },
        {
          menuId: 'PME20000000',
          url: '/index/index',
          descr: '测试技术',
          parentId: null,
          lstChild: [
            {
              menuId: 'ME20000001',
              url: '/test/handsontable',
              descr: 'table',
              parentId: 'PME20000000'
            },
            {
              menuId: 'ME20000002',
              url: '/test/handsontable2',
              descr: 'table',
              parentId: 'PME20000000'
            },
            {
              menuId: 'ME20000003',
              url: '/test/handsontable3',
              descr: 'table3',
              parentId: 'PME20000000'
            },
            {
              menuId: 'ME20000004',
              url: '/test/vhansontableTest',
              descr: 'vhansontableTest',
              parentId: 'PME20000000'
            }
          ]
        }
      ]
      that.$store.commit(menuMutationType.SAVE_CACHE_LIST, that.menuList)
    },
    goPage (d) {
      const that = this
      if (d === null) {
        that.defaultActive = null
      } else {
        that.$router.push(d.url)
        that.defaultActive = d.menuId
        that.$emit('goPage', d)
      }
    },
    onSwitch () {
      const that = this
      that.isCollapse = !that.isCollapse
    }
  },
  created () {
    const that = this
    that.getUserMenu()
  }
}
</script>
<style lang="scss" scoped>
/*导航菜单-标题栏*/
.menu-title{
  height: 64px;
  line-height: 64px;
  border-right: none;
  background-color: #011E3F;
  .el-menu-item, .el-submenu__title{
    height: 64px!important;
    line-height: 64px!important;
  }
  span{
    color: #A3AFBD;
  }
  li{
    background-color: #011E3F;
    color: #A3AFBD;
  }
}
/*导航菜单-菜单栏*/
.menu{
  position: absolute;
  bottom: 0;
  top: 64px;
  overflow-y: scroll;
  background-color: #022854;
  .el-menu{
    border-right: none;
  }
  span{
    color: #A3AFBD;
  }
  li{
    background-color: #022854;
    color: #A3AFBD;
  }
  ::v-deep .el-submenu__title{
    &:hover{
      background-color:#188FFF!important;
      color: #FFFFFF;
      span,i{
        color: #FFFFFF;
      }
    }
  }
   ::v-deep .el-menu-item, .el-menu-item{
    &:hover{
      background-color:#188FFF!important;
      color: #FFFFFF;
    }
    &:focus{
      background-color:#188FFF!important;
      color: #FFFFFF;
    }
    ::v-deep.el-menu-item.is-active{
      background-color: #188FFF!important;
      color: #FFFFFF;
    }
  }
}
/*滚动条设置*/
 .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
  /*隐藏滚动条*/
  /* 使用伪类选择器 ::-webkit-scrollbar ,兼容chrome和safari浏览器 */
  .menu::-webkit-scrollbar {
    width: 0 !important;
    /* remove scrollbar space */
    background: transparent;
    /* optional: just make scrollbar invisible */
  }
  /* 兼容IE10+ */
  .menu{
      -ms-overflow-style: none;
  }
  /* 但是firefox代码无效 */
  .menu {
    overflow: -moz-scrollbars-none;
  }
  .menu::-webkit-scrollbar {
    width: 0px;
  }
</style>
