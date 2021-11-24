<template>
  <div>
    <div id="example1"></div>
  </div>
</template>

<script>
import Handsontable from 'handsontable'
export default {
  mounted(){
    const container = document.getElementById('example1');

    const data = [
      { id: 1, name: '54678', address: '' },
      { id: 2, name: '54678', address: '' },// HOT will create missing properties on demand
      { id: 3, name: 'tugyu', address: '' }
    ];

    const hot = new Handsontable(container, {
      data:data,
      colHeaders: true,
      height: 'auto',
      width: 'auto',
     hiddenColumns: true,
     columns:[
       {
         data: 'id',
         title:'id'
       },
       {
         data: 'name',
         title:'name'
       },
       {
         data: 'address',
         title:'address',
         renderer: (instance, td, row, col, prop, value, cellProperties) => {
           td.innerHTML="567890"
           return td
         }
       }
     ],
      mergeCells: [
        { row: 0, col: 2, rowspan: 3, colspan: 1 }
      ],
      licenseKey: 'non-commercial-and-evaluation'
    });
    hot.loadData(data)
  }
}
</script>

<style>

</style>