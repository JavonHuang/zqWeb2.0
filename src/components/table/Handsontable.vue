<template>
  <div class="hs-handsontable">
    <div id="example" class="handsontable">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Handsontable from 'handsontable'
export default {
  watch: {
    $slots: {
      handler: function (newVal, oldVal) {
        const that = this
        if (newVal.default) {
          const columnList = []
          const hscolumnListMap = {}
          newVal.default.forEach((item, index) => {
            if (item.componentOptions.propsData.renderCellFormat) {
              columnList.push({
                ...item.componentOptions.propsData,
                renderer: (instance, td, row, col, prop, value, cellProperties) => {
                  return that.renderCellFormat(instance, td, row, col, prop, value, cellProperties, item)
                }
              })
            } else {
              columnList.push({
                ...item.componentOptions.propsData
              })
            }
            hscolumnListMap[index] = item.componentOptions.propsData.title
          })
          that.hscolumnList = columnList
          that.hscolumnListMap = hscolumnListMap
          that.nestedHeadersColumnName = columnList.map(item => item.title)
          that.initDom()
        }
      },
      immediate: true
    }
  },
  props: {
    width: {
      type: String,
      default: '100%'
      // 表格size
    },
    height: {
      type: String,
      default: '100%'
      // 表格size
    },
    rowHeights: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: 30
      // 表格行高
    },
    colWidths: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | Array,
      default: 30
      // 列宽，数组可以指定列宽
    },
    stretchH: {
      type: String,
      default: 'all'
      // 平分列宽自适应 none|last|all
    },
    className: {
      type: Array,
      default: () => {
        return ['htCenter', 'htMiddle']
      }
      // 对齐样式Horizontal: htLeft, htCenter, htRight, htJustify,Vertical: htTop, htMiddle, htBottom
    },
    rowHeaders: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Boolean | Function,
      default: true
    },
    fixedRowsTop: {
      type: Number,
      default: 0
      // 行数 //固定顶部多少行不能垂直滚动
    },
    fixedColumnsLeft: {
      type: Number,
      default: 0
      // 列数 //固定左侧多少列不能水平滚动
    },
    contextMenu: {
      type: Boolean,
      default: true
      // 右键菜单
    }
  },
  data () {
    return {
      hot: null,
      hotDom: null,
      hscolumnList: [],
      hscolumnListMap: {},
      nestedHeadersColumnName: []
    }
  },
  created () {
  },
  mounted () {
    this.initDom()
  },
  methods: {
    initDom () {
      const that = this
      if (!that.$el) {
        return false
      }
      if (that.hot) {
        that.hot.render()
        return false
      }
      that.hot = new Handsontable(that.$el.firstChild, {
        language: 'zh-CN', // 设置语言
        data: [],
        ...that.$props,
        colHeaders: that.colHeaders,
        columns: that.hscolumnList,
        currentRowClassName: 'currentSelRow',
        search: true,
        licenseKey: 'non-commercial-and-evaluation',
        nestedHeaders: null,
        // nestedHeaders: [
        // ['A', { label: 'B', colspan: 5 }, 'C89'],
        // ['D', { label: 'E', colspan: 2 }, { label: 'F', colspan: 3 }, 'G'],
        // that.nestedHeadersColumnName
        // ['H', { label: 'I', colspan: 2 }, { label: 'J', colspan: 2 }, { label: 'K', colspan: 2 }, { label: 'L', colspan: 2 }, 'M'],
        // ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W']
        // ]
        comments: true,
        cell: [
          { row: 1, col: 1, comment: { value: 'Some comment' } },
          { row: 2, col: 2, comment: { value: 'More comments' } }
        ]
      })
      console.log(that.hot)
    },
    renderCellFormat (instance, td, row, col, prop, value, cellProperties, item) {
      const that = this
      const rowData = instance.getSourceDataAtRow(row)
      if (item.componentOptions.propsData.renderCellFormat) {
        const deidom = document.createElement('div')
        Handsontable.dom.empty(td)
        that.className.forEach(clName => {
          td.classList.add(clName)
        })
        td.appendChild(deidom)
        const VNode = item.componentOptions.propsData.renderCellFormat(rowData, row, item.componentOptions.propsData.data, that.hot)
        new Vue({
          render: function (createElement) {
            return createElement(
              'div',
              [VNode]
            )
          }
        }).$mount(deidom)
      }
      return td
    },
    colHeaders (col) {
      const that = this
      if (!that.hscolumnListMap[col]) {
        const domId = `${that.hscolumnList[col].data}_${col}`
        setTimeout(() => {
          new Vue({
            render: function (createElement) {
              return createElement(
                'div',
                [that.hscolumnList[col].renderHeader()]
              )
            }
          }).$mount(`#${domId}`)
        })
        return `<div id="${domId}"></div>`
      }
      return false
    },
    // 更新表格数据
    setDataAtCell (rowIndex, cellIndex, value, source = null) {
      const that = this
      that.hot.setDataAtCell(rowIndex, cellIndex, value, source)
    }
  }
}
</script>

<style lang="scss" scoped>
.hs-handsontable{
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #ccc;
  ::v-deep
  .handsontable{
    th:first-child{
      border-left:none;
    }
    thead tr:first-child th{
      border-top:none;
    }
    table tbody tr:hover{
      background: #f7f7f7;
      th,td{
        background: #f7f7f7;
      }
    }
    table tbody tr{
      td.currentSelRow{
        background-color: #dcdcdc;
      }
    }
  }
  .pagination{
    border:none;
    border-top: 1px solid #ccc;
  }
}
</style>
