<template>
<div class="mymain">
  <div class="tablemain">
    <pageHandsontable rowHeights="50" :url="'/gzList/getGzList'">
      <HsTableColumn v-for="item in numles" :key="item" type="seletextction" data="SECURITY_CODE" :readOnly="false" width="120"></HsTableColumn>
      <HsTableColumn type="text" data="TRADE_DATE" :readOnly="true" width="120" :renderHeader="renderHeader" :renderCellFormat="renderCellFormatTime"></HsTableColumn>
      <HsTableColumn type="text" data="SECURITY_CODE" :readOnly="false" title="代码" width="120"></HsTableColumn>
      <HsTableColumn type="text" data="CLOSE_PRICE" :readOnly="true" title="收价" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="CHANGE_RATE" :readOnly="true" title="波动" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="A_SHARES_RATIO" :readOnly="true" title="占比" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_SHARES" :readOnly="true" title="数量" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_MARKET_CAP" :readOnly="true" title="规模" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_MARKET_CAP" :readOnly="true" title="图片" width="180" :renderCellFormat="renderCellImgFormat"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_MARKET_CAP_1" :readOnly="true" title="操作" width="200" :renderCellFormat="renderCellFormat"></HsTableColumn>
    </pageHandsontable>
  </div>
</div>
</template>

<script>
import pageHandsontable from '../components/table/pageHandsontable.vue'
import HsTableColumn from '../components/table/hs-table-column'
import operate from './operate.vue'
import moment from 'moment'
export default {
  name: 'bda-handsontable',
  components: {
    pageHandsontable,
    HsTableColumn
  },
  data () {
    return {
      test: null,
      numles:0
    }
  },
  mounted () {
    this.numles=5
  },
  methods: {
    handleClick (e) {
      console.log(e)
    },
    renderCellFormat (rowdata, row, indexData, hot) {
      return (
        <operate rowdata={rowdata} row={row} indexData={indexData} hot={hot}></operate>
      )
    },
    renderCellFormatTime (rowdata, indexData) {
      return (
        <span>{moment(rowdata[indexData]).format('YYYY-MM-DD')}</span>
      )
    },
    renderCellImgFormat () {
      return (
        <img style={{ height: '40px', width: '40px' }} src={require('./../assets/yt.jpeg')}/>
      )
    },
    renderHeader (col, hot) {
      return (
        <span title={'自定义表头'}>自定义表头</span>
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
