<template>
  <div>
    <div>
      <el-form ref="form" :inline="true" :label-suffix="':'" :model="formInline" class="demo-form-inline">
        <el-form-item label="证券代码">
          <el-input v-model="formInline.SECURITY_CODE" placeholder="证券代码"></el-input>
        </el-form-item>
        <el-form-item label="证券名">
          <el-input v-model="formInline.SECURITY_NAME" placeholder="证券名"></el-input>
        </el-form-item>
        <el-form-item label="交易所">
          <el-select clearable v-model="formInline.ZQ_TYPE" placeholder="请选择交易所">
            <el-option label="上证" value="sh"></el-option>
            <el-option label="深证" value="sz"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="reSet">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="row-block">
      <el-button type="primary" v-on:click="newVisible=true">新增</el-button>
    </div>
    <jtable ref="jtable" :query="formInline" :url="'/zqList/getZqList'">
      <el-table-column prop="SECURITY_NAME" label="证券名" width="180" sortable></el-table-column>
      <el-table-column v-for="item in testnum" :key="item" prop="SECURITY_CODE" label="证券代码" width="180"></el-table-column>
      <el-table-column prop="ZQ_TYPE" label="证券所" width="180" :formatter="(row, column, cellValue, index)=>{ return cellValue=='sh'?'上证':'深证' }">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </jtable>
    <el-dialog
      title="新增证券"
      :visible.sync="newVisible"
      width="600px">
      <el-form ref="newzqFrom" :inline="true" :rules="newRules" :label-suffix="':'" :model="newForm" class="demo-form-inline">
        <el-form-item label="证券代码" prop="SECURITY_CODE">
          <el-input v-model="newForm.SECURITY_CODE" placeholder="证券代码"></el-input>
        </el-form-item>
        <el-form-item label="证券名" prop="SECURITY_NAME">
          <el-input v-model="newForm.SECURITY_NAME" placeholder="证券名"></el-input>
        </el-form-item>
        <el-form-item label="交易所" prop="ZQ_TYPE">
          <el-select v-model="newForm.ZQ_TYPE" placeholder="请选择交易所">
            <el-option label="上证" value="sh"></el-option>
            <el-option label="深证" value="sz"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddZq">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jtable from './../../components/table/pageTable.vue'
export default {
  components: {
    jtable
  },
  data () {
    return {
      testnum:0,
      formInline: {
        SECURITY_NAME: '',
        SECURITY_CODE: '',
        ZQ_TYPE: ''
      },
      newForm: {
        SECURITY_NAME: '',
        SECURITY_CODE: '',
        ZQ_TYPE: 'sh'
      },
      newRules: {
        SECURITY_CODE: [
          { required: true, message: '请输入证券代码', trigger: 'blur' }
        ],
        SECURITY_NAME: [
          { required: true, message: '请输入证券名', trigger: 'blur' }
        ],
        ZQ_TYPE: [
          { required: true, message: '请选择证券所', trigger: 'change' }
        ]
      },
      newVisible: false
    }
  },
  mounted () {
    // this.getZqList()
    setTimeout(()=>{
      this.testnum = 5
    },5000)
  },
  methods: {
    onSubmit () {
      const that = this
      that.$refs.jtable.getDataSource()
    },
    reSet () {
      this.formInline = {
        SECURITY_NAME: '',
        SECURITY_CODE: '',
        ZQ_TYPE: ''
      }
    },
    AddZq () {
      const that = this
      that.$refs.newzqFrom.validate((valid) => {
        if (valid) {
          that.$axios.post('/zqList/addZq', that.newForm, false, true).then(res => {
            if (res.data.code === '200') {
              that.onSubmit()
              that.newVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    handleDel (row) {
      const that = this
      that.$axios.post('/zqList/delZq', { SECURITY_CODE: row.SECURITY_CODE }, false, true).then(res => {
        if (res.data.code === '200') {
          that.onSubmit()
        }
      })
    },
    handleEdit () {

    }
  }
}
</script>

<style>

</style>
