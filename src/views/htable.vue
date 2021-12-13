<template>
<div class="mymain">
  <div class="tablemain">
    <pageHandsontable :mergeCellsKey="['SECURITY_CODE','CLOSE_PRICE','CHANGE_RATE']" rowHeights="50" :url="'/gzList/getGzList'">
      <HsTableColumn type="seletextction" :readOnly="false" title="选择" width="120">
      </HsTableColumn>
      <HsTableColumn type="text" data="SECURITY_CODE" :readOnly="false" title="代码" width="120">
        <template slot="header" slot-scope="slotProps">
          <div>
            <div>{{slotProps.columns.title}}</div>
          </div>
        </template>
        <template slot-scope="slotProps">
          <div>
            <div>{{slotProps.rowData.SECURITY_CODE}}</div>
          </div>
        </template>
      </HsTableColumn>
      <HsTableColumn type="text" data="CLOSE_PRICE" :readOnly="true" title="收价" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="CHANGE_RATE" :readOnly="true" title="波动" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="TRADE_DATE" :readOnly="true" width="120" title="日期">
        <template slot="header" slot-scope="slotProps">
          <div>
            <div>{{slotProps.columns.title}}</div>
          </div>
        </template>
        <template slot-scope="slotProps">
          <div>
            <div>{{renderCellFormatTime(slotProps.rowData,slotProps.column.data)}}</div>
          </div>
        </template>
      </HsTableColumn>
      <HsTableColumn type="text" data="A_SHARES_RATIO" :readOnly="true" title="占比" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_SHARES" :readOnly="true" title="数量" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_MARKET_CAP" :readOnly="true" title="规模" width="180"></HsTableColumn>
      <HsTableColumn type="text" data="HOLD_MARKET_CAP" :readOnly="true" title="图片" width="180">
        <template slot-scope="slotProps">
          <div>
            <img :trr="slotProps.rowData.SECURITY_CODE" style="height:40px; width: '40px'" :src="require('./../assets/yt.jpeg')"/>
          </div>
        </template>
      </HsTableColumn>
      <!-- <HsTableColumn type="text" data="HOLD_MARKET_CAP_1" :readOnly="true" title="操作" width="200">
        <template slot-scope="slotProps">
          <div>
            <el-button v-on:click="handelClick(slotProps)" type="text" size="small">查看</el-button>
          </div>
        </template>
      </HsTableColumn> -->
    </pageHandsontable>
  </div>
</div>
</template>

<script>
import pageHandsontable from '../components/table/pageHandsontable.vue'
import HsTableColumn from '../components/table/hs-table-column'
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
      numles:0,
      tet:0
    }
  },
  mounted () {
    setTimeout(()=>{
      this.numles=3
    },5000)
  },
  methods: {
    handelClick (e) {
      console.log(e)
    },
    renderCellFormatTime (rowdata, indexData) {
      return moment(rowdata[indexData]).format('YYYY-MM-DD')
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
