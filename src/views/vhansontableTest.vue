<template>
  <div>
    <pageVHandsontable 
      :url="'/gzList/getGzList'"
      :mergeCellsKey="['SECURITY_CODE','CLOSE_PRICE','CHANGE_RATE']" 
      >
      <VhTableColumn type="text" data="SECURITY_CODE" :readOnly="false" title="代码" width="120" :show-overflow-tooltip="true"></VhTableColumn>
      <VhTableColumn type="text" data="CLOSE_PRICE" :readOnly="true" title="收价" width="180"></VhTableColumn>
      <VhTableColumn type="text" data="CHANGE_RATE" :readOnly="true" title="波动" width="180"></VhTableColumn>
      <VhTableColumn type="text" data="TRADE_DATE" :readOnly="true" width="200" title="日期">
        <template slot="header" slot-scope="slotProps">
          <div>
            <div>{{slotProps.columns.title}}</div>
          </div>
        </template>
        <template slot-scope="slotProps">
          <div>
            <div>{{ dateF(slotProps.rowData.TRADE_DATE)}}</div>
          </div>
        </template>
      </VhTableColumn>
      <VhTableColumn type="text" data="A_SHARES_RATIO" :readOnly="true" title="占比" width="180" :formatter="(rowData,prop,value,rowIndex)=>{return value +'%'}"></VhTableColumn>
      <VhTableColumn type="text" data="HOLD_SHARES" :readOnly="true" title="数量" width="40" :show-overflow-tooltip="true"></VhTableColumn>
      <VhTableColumn type="text" data="HOLD_MARKET_CAP" :readOnly="true" title="规模" width="40"></VhTableColumn>
      <VhTableColumn type="text" data="HOLD_MARKET_CAP" :readOnly="true" title="图片" width="180"></VhTableColumn>
    </pageVHandsontable>
  </div>
</template>

<script>
import moment from 'moment'
import pageVHandsontable from './../components/Handsontable/pageVHandsontable.vue'
import VhTableColumn from './../components/Handsontable/vh-table-column'
export default {
  components:{
    pageVHandsontable,
    VhTableColumn
  },
  methods:{
    dateF(e){
      return moment(e).format('YYYY-MM-DD')
    }
  }
}
</script>

<style>

</style>