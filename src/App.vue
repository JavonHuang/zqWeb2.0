<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<style src='./assets/iconfont/iconfont.css'></style>
<style>
*{
  margin: 0;
}
#app{
  height: 100%;
}
</style>
<style lang="scss">
html,body{
  background-color: #F2F1F6;
  overflow-y:hidden;
  height: 100%;
}
.el-form{

  .el-form-item__label{
    line-height: 30px;
  }
  .el-form-item__content,.el-input{
    line-height: 30px;
    input{
      height: 30px;
      line-height: 30px;
    }
    i{
      line-height: 30px;
    }
  }
}
  .el-button{
    padding: 7px 20px!important;
    font-weight: normal!important;
  }
  .row-block{
    margin: 10px 0;
  }
</style>
