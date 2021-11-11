<template>
  <div class="portal">
    <portalMenu ref="portalmenu" v-on:goPage="goPage"></portalMenu>
    <div class="left">
      <div class="header">
        <portalHeader v-on:onSwitch="onSwitch()"></portalHeader>
        <portalTab ref="portaltab" v-on:goPage="goMenu"></portalTab>
      </div>
      <div class="context">
        <div style="padding:20px;height: 100%;box-sizing: border-box;" >
          <keep-alive :include="cacheList">
            <router-view class="router-context"/>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import portalMenu from './portalcomponents/portalMenu'
import portalTab from './portalcomponents/portalTab'
import portalHeader from './portalcomponents/portalHeader'
export default {
  name: 'portal',
  data () {
    return {
      menuList: [],
      menuArray: [],
      isCollapse: false
    }
  },
  computed: {
    ...mapState({
      cacheList: state => state.menuStoreModule.cacheList.join(',')
    })
  },
  components: {
    portalMenu,
    portalHeader,
    portalTab
  },
  methods: {
    onSwitch () {
      const that = this
      that.$refs.portalmenu.onSwitch()
    },
    goPage (d) {
      const that = this
      that.$refs.portaltab.setTab(d)
    },
    goMenu (d) {
      const that = this
      that.$refs.portalmenu.goPage(d)
    }
  }
}
</script>
<style lang="scss" scoped>
.portal{
  display: flex;
  height: 100%;
}
.left{
  width: 100%;
  position: relative;
  height: 100%;
  overflow-x: hidden;
}
/*页头块*/
.header{
  width: 100%;
  background-color: #fff;
}
/*中间内容块*/
.context{
  // margin: 20px;
  background-color: #f2f1f6;
  overflow-y: overlay;
  left: 0;
  right: 0;
  top: 120px;
  overflow-y: auto;
  bottom: 20px;
  position: absolute;
}
.router-context{
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 10px 10px 10px;
  box-sizing: border-box;
}
</style>
