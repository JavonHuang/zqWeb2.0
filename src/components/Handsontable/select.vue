<template>
  <el-select :popper-append-to-body="false" class="editorsSel" v-on:change="change" v-model="mydq" placeholder="请选择">
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
        mydq: null
      }
    },
    created(){
      this.mydq = this.slotProps.originalValue
      console.log(this.mydq)
      this.slotProps['setValue'] = this.setValue
      this.slotProps['getValue'] = this.getValue
      this.slotProps['initComponent'] =this.initComponent
    },
    methods:{
      change(e){
        this.mydq = e
        this.slotProps.value = e
      },
      setValue(value){
        this.slotProps.value = value
        this.mydq = this.slotProps.value
      },
      getValue(){
        return this.slotProps.value
      },
      initComponent(originalValue){
        this.slotProps.value = originalValue
        this.mydq = this.slotProps.value
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