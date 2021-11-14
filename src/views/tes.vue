<template>
  <div>
    <el-button v-on:click="handelClick" type="text" size="small">查看</el-button>
  </div>
</template>

<script>
export default {
  props: {
    row: null
  },
  methods: {
    handelClick () {
      console.log(this.row)
    }
  }
}
</script>

<style>

</style>
