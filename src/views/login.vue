<template>
  <div>
    <el-input  @keyup.enter.native="systemLogin" prefix-icon="iconfont icon-dianhua1" v-model="loginInfo.telephone" class="input_name"></el-input>
    <el-input  @keyup.enter.native="systemLogin" prefix-icon="iconfont icon-dianhua1" v-model="loginInfo.password" class="input_name"></el-input>
    <button v-on:click="systemLogin">登录</button>
  </div>
</template>
<style scoped>

</style>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginInfo: {
        telephone: '',
        password: ''
      }
    }
  },
  methods: {
    systemLogin () {
      var that = this
      that.$router.push('/portal')
    }
  }
}
</script>
