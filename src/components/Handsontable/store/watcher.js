import Vue from 'vue'


export default Vue.extend({
  data() {
    return {
      states:{
        columns: [],
        columnsMap:{},
        selectAll:false,
        nestedHeaderTitle:[],
        columnsSort:[],
        operateColumns:[],//操列生成动态id
        columnsFooterMap:{},
        columnsFooterLeftMap:{}
      }
    }
  }
})
