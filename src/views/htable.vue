<template>
<div class="mymain">
  <div class="tablemain">
    <pageHandsontable :url="'/gzList/getGzList'">
      <HsTableColumn type="text" data="TRADE_DATE" readOnly="true" title="交易日期" width="120" :renderCellFormat="renderCellFormatTime"></HsTableColumn>
      <HsTableColumn type="text" data="SECURITY_CODE" readOnly="true" title="证券代码" width="120"></HsTableColumn>
      <HsTableColumn type="text" data="CLOSE_PRICE" readOnly="true" title="当日收盘价" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="CHANGE_RATE" readOnly="true" title="涨幅" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="A_SHARES_RATIO" readOnly="true" title="A股占比" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_SHARES" readOnly="true" title="持股数量" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_MARKET_CAP" readOnly="true" title="当日市值(亿)" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_MARKET_CAP_1" readOnly="true" title="操作" width="200" :renderCellFormat="renderCellFormat"></HsTableColumn>
    </pageHandsontable>
  </div>
</div>
</template>

<script>
import pageHandsontable from '../components/table/pageHandsontable.vue'
import HsTableColumn from '../components/table/hs-table-column'
import tes from './tes.vue'
import moment from 'moment'
export default {
  name: 'bda-handsontable',
  components: {
    pageHandsontable,
    HsTableColumn
  },
  data () {
    return {
      test: null
    }
  },
  mounted () {
  },
  methods: {
    handleClick (e) {
      console.log(e)
    },
    renderCellFormat (rowdata) {
      return (
        <tes row={rowdata}></tes>
      )
    },
    renderCellFormatTime (rowdata, indexData) {
      return (
        <span>{moment(rowdata[indexData]).format('YYYY-MM-DD')}</span>
      )
    }
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
    // border:1px solid blue
  }
}
#example{
  width: 100%;
  height: 100px;
}
</style>
