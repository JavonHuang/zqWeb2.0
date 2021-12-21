<template>
  <el-select :popper-append-to-body="false" class="editorsSel" v-on:change="change" v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props:{
      slotProps:Object
    },
    data() {
      return {
        options: [{
          value: '000750',
          label: '国海证券'
        }, {
          value: '600326',
          label: '西藏天路'
        }],
        value: null
      }
    },
    created(){
      this.slotProps['setValue'] = this.setValue
      this.slotProps['getValue'] = this.getValue
    },
    methods:{
      change(e){
        let obj = this.options.find(item=>item.value==e)
        this.value = obj.value
      },
      setValue(e){
        //获取row的值，设置下拉默认选中值
        let SECURITY_CODE = this.slotProps.hot.getDataAtRowProp(this.slotProps.row,'SECURITY_CODE')
        let obj = this.options.find(item=>item.value==SECURITY_CODE)
        this.value = obj.value
      },
      getValue(){
        let obj = this.options.find(item=>item.value==this.value)
        //由于下拉显示的label和value是不一样的字段，这里需要设置对应的源数据值
        this.slotProps.hot.setSourceDataAtCell(this.slotProps.row,'SECURITY_CODE',obj.value)
        return obj.label
      }
    }
  }
</script>
<style lang="scss" scoped>
.editorsSel{
  &.el-select{
    height: 100%;
    ::v-deep
    .el-input{
      height: 100%;
      .el-input__inner{
        height: 100%;
        width: 100%;
        padding: 0 8px;
        border: none;
        line-height:1;
        box-sizing: border-box;
      }
      .el-input__suffix{
        .el-input__icon{
          line-height:1;
        }
      }
    }
  }
}
</style>