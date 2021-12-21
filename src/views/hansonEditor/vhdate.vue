<template>
  <el-date-picker
      class="editors-date"
      v-model="value"
      v-on:change="change"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
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
    this.slotProps['setValue'] = this.setValue
    this.slotProps['getValue'] = this.getValue
  },
  methods:{
    setValue(value){
      this.value = value
    },
    getValue(){
      return this.value
    },
    change(e){
      //由于element-ui的下拉层是挂在body的，这样点击日历后，table会先取消了变状态，在getValue返回的不是当前选中的值
      //所以需要这里手动设置值
      this.slotProps.hot.setSourceDataAtCell(this.slotProps.row,'TRADE_DATE',e)
    }
  }
}
</script>

<style lang="scss" scoped>
.editors-date{
  height: 100%;
  width: 100%;
  ::v-deep
  input{
    height: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    border: none;
    padding-left: 30px;
  }
  ::v-deep
  .el-input__suffix{
    .el-input__icon{
      line-height: inherit;
    }
  }
  ::v-deep
  .el-input__prefix{
    .el-input__icon{
      line-height: inherit;
    }
  }
}
</style>