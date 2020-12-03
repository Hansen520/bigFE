<template>
  <div>
    <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col" @on-select="handleSelect">
        <!-- 选项 -->
        <template v-for="(item, index) in columns">
          <!-- item.hidden为不显示这一项，但是索引值还是在的 -->
          <Option v-if="!item.hidden" :value="index" :key="`search-col-${item.key}`">
            {{ item.title }}
          </Option>
        </template>
      </Select>
      <!-- <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/> -->
      <!-- 这里是根据上边选项的变化而变化的 -->
      <Search :item="chooseItem" @changeEvent="handleSearchInput"></Search>
      <Button @click="handleSearch" class="search-btn" type="primary">
        <Icon type="my-search" />&nbsp;&nbsp;搜索
      </Button>
      <slot name="table-header"> </slot>
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>

      <template slot-scope="{ row, index }" slot="action">
        <Icon type="md-build" size="22" style="margin-right: 5px" @click.stop="editRow(row, index)"></Icon>
        <Icon type="md-trash" size="22" @click.stop="removeRow(row, index)"></Icon>
      </template>
    </Table>
    <!-- <div v-if="searchable && searchPlace === 'bottom'" class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
    </div> -->
    <a id="hrefToExportTable" style="display: none; width: 0px; height: 0px"></a>
  </div>
</template>

<script>
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import Search from './search'
import './index.less'
export default {
  name: 'Tables',
  components: {
    Search
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default() {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      chooseItem: {
        type: 'input'
      },
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: ''
    }
  },
  methods: {
    // 点击搜索时候传出去的值
    handleSearch() {
      this.$emit('searchEvent', {
        item: this.columns[this.searchKey].key,
        search: this.searchValue
      })
    },
    // 需要搜索的值
    handleSearchInput(item) {
      // console.log(item)
      if (this.chooseItem.type === 'input') {
        // 取得要的input值
        this.searchValue = item.target.value
      } else {
        this.searchValue = item
      }
    },
    // 选中后index的值然後進行切換
    handleSelect(index) {
      const idx = index.value
      // console.log('索引值'+idx)
      // 保留思考
      this.chooseItem = this.columns[idx].search
      // console.log(this.chooseItem)
    },
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            input: (val) => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle(item) {
      let options = item.options || []
      let insideBtns = []
      options.forEach((item) => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h(
          'div',
          btns.map((item) => item(h, params, this))
        )
      }
      return item
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        return res
      })
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key !== 'handle' ? this.columns[0].key : this.columns.length > 1 ? this.columns[0].key : ''
    },
    handleClear(e) {
      if (e.target.value === '') this.insideTableData = this.value
    },

    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow() {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
    },
    // 编辑和删除
    editRow(row, index) {
      this.$emit('on-row-edit', row, index)
    },
    removeRow(row, index) {
      this.$emit('on-row-remove', row, index)
    }
  },
  watch: {
    columns(columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value(val) {
      this.handleTableData()
      // if (this.searchable) this.handleSearch()
    }
  },
  mounted() {
    this.handleColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData()
  }
}
</script>
