<template>
<div class="mymain">
  <div class="tablemain">
    <pageHandsontable :url="'/gzList/getGzList'">
      <HsTableColumn :type="'select'" :width="'100px'" :prop="'SECURITY_CODE'" :name="'证券代码'"></HsTableColumn>
      <HsTableColumn :type="'select'" :width="'100px'" :prop="'SECURITY_CODE'" :name="'证券代码'"></HsTableColumn>
    </pageHandsontable>
  </div>
</div>
</template>

<script>
import pageHandsontable from './../components/table/pageHandsontable.vue'
import HsTableColumn from './../components/table/hs-table-column'
export default {
  name: 'bda-handsontable',
  components: {
    pageHandsontable,
    HsTableColumn
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.mymain{
  display: flex;
  flex-direction: column;
  height: 100%;
  .header{
    height: 50px;
    border:1px solid red
  }
  .tablemain{
    height: 100%;
    border:1px solid blue
  }
}
#example{
  width: 100%;
  height: 100px;
}
</style>
