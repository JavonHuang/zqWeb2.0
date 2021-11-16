<template>
  <div>
    <el-button v-on:click="handelClick" type="text" size="small">查看</el-button>
  </div>
</template>

<script>
export default {
  props: {
    rowdata: null,
    row: null,
    indexData: null,
    hot: null
  },
  methods: {
    handelClick () {
      console.log(this.rowdata, this.row, this.indexData, this.hot)
    }
  }
}
</script>

<style>

</style>
