<template>
  <div> 
    <input v-if="selectAll" ref="selDom" class="htCheckboxRendererInput" v-on:change="change" type="checkbox" autocomplete="false" checked>
    <input v-else ref="selDom" class="htCheckboxRendererInput" v-on:change="change" type="checkbox" autocomplete="false">
  </div>
</template>

<script>
export default {
  name:'VhTableColumnSelect',
  props:{
    owner:null
  },
  data(){
    return{
      selectAll:false
    }
  },
  mounted(){
    if(this.owner.selectAll){
      this.selectAll = this.owner.selectAll
    }
    this.$nextTick(()=>{
      if(this.owner.selectAll===null){
        this.$refs.selDom.indeterminate = true
      }else{
        this.$refs.selDom.indeterminate = false 
      }
    })
  },
  methods:{
    change(e){
      this.selectAll = e.target.checked
      this.owner.store.commit('setSelectAll', e.target.checked)
    }
  }
}
</script>

<style>

</style>