<template>
  <el-input class="editors-input" v-model="value" placeholder="请输入内容"></el-input>
</template>

<script>
export default {
  props:{
    slotProps:Object
  },
  data(){
    return{
      value:899898
    }
  },
  created(){
    //务必注册这两个钩子
    this.slotProps['setValue'] = this.setValue
    this.slotProps['getValue'] = this.getValue
  },
  methods:{
    //编辑触发，e是当前cell值
    setValue(value){
      this.value = value
    },
    //编辑完成会调用，返回cell显示值并更新对例，
    getValue(){
      return this.value
    }
  }
}
</script>

<style lang="scss" scoped>
.editors-input{
  height: 100%;
  ::v-deep
  input{
    height: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    border: none;
  }
}
</style>