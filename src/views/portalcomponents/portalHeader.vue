<template>
  <div class="pageheader">
    <div class="switch">
      <img v-on:click="onSwitch" src='./../../assets/img/swich.png'/>
      <span style="color:#999999">{{122}}</span>
      <span>{{2323}}</span>
    </div>
    <div class="company">
      <span>JavonHuang-web</span>
    </div>
    <div>
      <el-dropdown>
        <span class="el-dropdown-link">
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'portalHeader',
  data () {
    return {

    }
  },
  methods: {
    onSwitch () {
      const that = this
      that.$emit('onSwitch')
    },
    loginOut () {
      const that = this
      that.$axios.loginOut()
      that.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
/*页头块*/
.pageheader{
  height: 64px;
  line-height: 64px;
  display: flex;
  justify-content: space-between;
  .switch{
    img{
      height: 32px;
      width: 34px;
      vertical-align: middle;
      margin-left: 13px;
      cursor: pointer;
    }
    span{
      color: #999999;
      font-size: 16px;
      margin-left: 12px;
    }
  }
  .company{
    span{
      color: #000000;
      font-size: 18px;
      font-weight:500;
    }
  }
}
</style>
