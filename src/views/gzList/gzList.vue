<template>
  <div>
    <div>
      <el-form ref="form" :inline="true" :label-suffix="':'" :model="formInfo" class="demo-form-inline">
        <el-form-item label="证券">
          <el-select clearable v-model="formInfo.SECURITY_CODE" placeholder="请选择证券">
            <el-option v-for="item in zqList" :label="item.SECURITY_NAME" :value="item.SECURITY_CODE" :key="item.SECURITY_CODE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="formInfo.TRADE_DATE"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="synchrodata">更新</el-button>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <jtable ref="jtable" :query="{SECURITY_CODE:formInfo.SECURITY_CODE}" :url="'/gzList/getGzList'" :default-sort="{order:'descending',prop:'TRADE_DATE'}">
      <el-table-column prop="TRADE_DATE" label="交易日期" width="120" sortable :formatter="timeF"></el-table-column>
      <el-table-column prop="SECURITY_CODE" label="证券代码" width="120"></el-table-column>
      <el-table-column prop="CLOSE_PRICE" label="当日收盘价" min-width="180"></el-table-column>
      <el-table-column prop="CHANGE_RATE" label="涨幅" min-width="180"></el-table-column>
      <el-table-column prop="A_SHARES_RATIO" label="A股占比" min-width="180"></el-table-column>
      <el-table-column prop="HOLD_SHARES" label="持股数量" min-width="180"></el-table-column>
      <el-table-column prop="HOLD_MARKET_CAP" label="当日市值(亿)" min-width="180"></el-table-column>
    </jtable>
  </div>
</template>

<script>
import moment from 'moment'
import jtable from './../../components/table/pageTable.vue'
export default {
  components: {
    jtable
  },
  data () {
    return {
      formInfo: {
        TRADE_DATE: null,
        SECURITY_CODE: null,
        pageSize: 50
      },
      zqList: []
    }
  },
  mounted () {
    this.getZqListAll()
  },
  methods: {
    timeF (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    getZqListAll () {
      const that = this
      that.$axios.post('/zqList/getZqListAll', null, false, true).then(res => {
        if (res.data.code === '200') {
          that.zqList = res.data.data
        }
      })
    },
    synchrodata () {
      const that = this
      that.$axios.post('/gzList/synchrodata', that.formInfo, false, true).then(res => {
        if (res.data.code === '200') {
        }
      })
    },
    onSubmit () {
      const that = this
      that.$refs.jtable.getDataSource()
    }
  }
}
</script>

<style>

</style>
