<template>
  <div class="VhTableColumnSort">
    <i v-bind:class="[{'ascending':true,'active':sort=='asc'}]" v-on:click="setSort('asc')"></i>
    <i v-bind:class="[{'descending':true,'active':sort=='desc'}]" v-on:click="setSort('desc')"></i>
  </div>
</template>

<script>
export default {
  props:{
    owner:null,
    columnKey:null
  },
  data(){
    return{
      sort:null
    }
  },
  mounted(){
    if(this.owner.columnsSort && this.owner.columnsSort.data ==this.columnKey){
      this.sort = this.owner.columnsSort.sort
    }else{
      this.sort = null
    }
  },
  methods:{
    setSort(sort){
      if(this.sort == sort){
        this.sort = null
      }else {
        this.sort = sort
      }
      this.owner.store.commit('setColumnSort', this.columnKey, this.sort)
    }
  }
}
</script>

<style lang="scss" scoped>
.VhTableColumnSort{
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  .ascending{
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    border-bottom-color: #c0c4cc;
    top: 0;
    &.active{
     border-bottom-color: #409eff
    }
  }
  .descending{
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    border-top-color: #c0c4cc;
    bottom: 0;
    &.active{
     border-top-color: #409eff
    }
  }
}
</style>