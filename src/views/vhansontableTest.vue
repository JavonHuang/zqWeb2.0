<template>
  <div>
    <el-button v-on:click="handelGetData()" size="small">获取数据</el-button>
    <pageVHandsontable
      ref="page"
      :url="'/gzList/getGzList'"
      :nestedHeaders="nestedHeaders"
      :manualColumnResize="true"
      :default-sort="{data:'CLOSE_PRICE',sort:'asc'}"
      :fixedRowsBottom="1"
      :countFixedRowsBottom="true"
      :fixedColumnsLeft="0"
      :columnsFooter="columnsFooter"
      v-on:selection-change="selectionChange"
      >
      <VhTableColumn type="selection"></VhTableColumn>
      <VhTableColumn type="text" data="SECURITY_NAME" :readOnly="false" title="代码名" width="200" :show-overflow-tooltip="true">
        <template slot="editors" slot-scope="slotProps">
          <myselect :slotProps="slotProps"></myselect>
        </template>
      </VhTableColumn>
      <VhTableColumn type="text" data="CLOSE_PRICE" :sortable="true" title="收价" width="200">
        <template slot="editors" slot-scope="slotProps">
          <vhInput :slotProps="slotProps"></vhInput>
        </template>
      </VhTableColumn>
      <VhTableColumn type="text" data="CHANGE_RATE" :sortable="true" :readOnly="true" title="波动" width="200"></VhTableColumn>
      <VhTableColumn type="text" data="TRADE_DATE" :sortable="true" width="200" title="日期">
        <template slot="editors" slot-scope="slotProps">
          <vhdate :slotProps="slotProps"></vhdate>
        </template>
        <template slot="header" slot-scope="slotProps">
          <div>
            <div>{{slotProps.columns.title}}</div>
          </div>
        </template>
        <template slot="headerTips" slot-scope="slotProps">
          <div>
            <el-tooltip class="item" effect="dark" :content="slotProps.columns.title" placement="top">
                <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="slotProps">
          <div>
            <div>{{ dateF(slotProps.rowData.TRADE_DATE,slotProps)}}</div>
          </div>
        </template>
        
      </VhTableColumn>
      <VhTableColumn type="text" data="A_SHARES_RATIO" :readOnly="true" title="占比" width="180" :formatter="(rowData,prop,value,rowIndex)=>{return value +'%'}"></VhTableColumn>
      <VhTableColumn type="text" data="HOLD_SHARES" :readOnly="true" title="数量" width="180" :show-overflow-tooltip="true"></VhTableColumn>
      <VhTableColumn type="text" data="HOLD_MARKET_CAP" :readOnly="true" title="规模" width="180"></VhTableColumn>  
      <VhTableColumn title="操作" :width="1000">
        <template slot-scope="slotProps">
          <div>
            <el-button v-on:click="handelClick(slotProps)" type="text" size="small">查看</el-button>
          </div>
        </template>
      </VhTableColumn>
    </pageVHandsontable>
  </div>
</template>

<script>
import moment from 'moment'
import pageVHandsontable from './../components/handsontable/pageVHandsontable'
import VhTableColumn from './../components/handsontable/vh-table-column'
import myselect from './hansonEditor/vhSelect'
import vhInput from './hansonEditor/vhInput'
import vhdate from './hansonEditor/vhdate'
export default {
  components:{
    pageVHandsontable,
    VhTableColumn,
    myselect,
    vhInput,
    vhdate
  },
  data(){
    return{
      nestedHeaders:['A', { label: this.test(), colspan: 2 },'测试',{ label: '合并表头', colspan: 2 },{ label: '合并第二', colspan: 2 }],
      columnsFooter:{},
    }
  },
  mounted(){
    setTimeout(()=>{
      this.columnsFooter = {
        SECURITY_CODE:'877979',
        CLOSE_PRICE:'合计测试12',
        CHANGE_RATE:'213',
        A_SHARES_RATIO:'7878'
      }
    })
  },
  methods:{
    dateF(e,slotProps){
      return moment(e).format('YYYY-MM-DD')
    },
    onColumnsSort(e){
      console.log(e)
    },
    selectionChange(e){
      console.log(e)
    },
    handelClick(e){
      console.log(e)
    },
    test(){
      return '879898'
    },
    changew(){
      alert('9898')
    },
    handelGetData(){
      console.log(this.$refs.page.getData())
    }
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>
.editorsSel{
  &.el-select{
    height: 100%;
    width: 100%;
    ::v-deep
    .el-input{
      height: 100%;
      .el-input__inner{
        height: 100%;
        width: 100%;
        padding: 0 8px;
        border: none;
        line-height:1;
        box-sizing: border-box;
      }
      .el-input__suffix{
        .el-input__icon{
          line-height:1;
        }
      }
    }
  }
}
</style>