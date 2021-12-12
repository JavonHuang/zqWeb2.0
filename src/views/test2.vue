<template>
  <div>
    <div id="example1"></div>
  </div>
</template>

<script>
import Handsontable from 'handsontable'
export default {
  data(){
    return{
      hot:null
    }
  },
  mounted(){
    const that = this
    const container = document.getElementById('example1');

    const data = [
      { id: 1, name: '54678', address: '' },
      { id: 2, name: '54678', address: '' },// HOT will create missing properties on demand
      { id: 3, name: 'tugyu', address: '' },
      { id: 4, name: 'tugyu', address: '' },
      { id: 5, name: 'tugyu', address: '' },
      { id: 6, name: 'tugyu', address: '' },
      { id: 7, name: 'tugyu', address: '' }
    ];

    that.hot = new Handsontable(container, {
      data:data,
      colHeaders: true,
      height: 'auto',
      width: 'auto',
      rowHeights:'100',
     hiddenColumns: true,
     mergeCells:true,
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
      licenseKey: 'non-commercial-and-evaluation',
      afterLoadData:()=>{
        if(that.hot){
          let mergeCellIntance = that.hot.getPlugin('mergeCells')
          mergeCellIntance.merge(0,0,1,0)
          mergeCellIntance.merge(2,0,6,0)
        }
      }
    });
    that.hot.loadData(data)
  }
}
</script>

<style>

</style>