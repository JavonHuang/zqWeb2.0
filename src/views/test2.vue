<template>
  <div>
    <div id="example1"></div>
  </div>
</template>

<script>
import Handsontable from 'handsontable'
export default {
  mounted(){
    const container = document.querySelector('#example1');

    const hot = new Handsontable(container, {
      licenseKey: 'non-commercial-and-evaluation',
      data: [],
      colHeaders: true,
      rowHeaders: true,
      columns: [
        {data: 'id'},
        {data: 'name.first'},
        {data: 'name.last'},
        {data: 'address'}
      ],
      // enable the `HiddenColumns` plugin
      hiddenColumns: true,
    });

    const plugin = hot.getPlugin('hiddenColumns')
    plugin.hideColumns([1,2])
    hot.render()
  }
}
</script>

<style>

</style>