<template>
  <div>
    <tables
      ref="tables"
      searchable
      search-place="top"
      :columns="columns"
      v-model="localData"
      @on-row-edit="handleRowEdit"
      @on-row-remove="handleRowRemove"
      @on-selection-change="handleSelect"
      @searchEvent="handleSearch"
    >
      <template v-slot:table-header>
        <Button
          @click="handleAdd"
          class="search-btn"
          type="primary"
          v-if="isEdit"
        >
          <Icon type="md-person-add" />&nbsp;&nbsp;添加
        </Button>
      </template>
    </tables>
    <Row type="flex" justify="space-between" align="middle" v-if="isEdit">
      <Col class="ctrls">
        <Button @click="handleDeleteBatch()">批量删除</Button>
        <Button @click="handleSetBatch()">批量设置</Button>
      </Col>
      <Col>
        <Page
          :total="total"
          :current="page"
          :page-size="limit"
          page-elevator
          show-sizer
          show-total
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        ></Page>
      </Col>
    </Row>
    <AddModel
      :isEdit="showEdit"
      :isShow="showModel"
      :item="selectItem"
      @editEvent="handleItem"
      @changeEvent="handleChangeEvent"
    ></AddModel>
    <BatchSet
      :isShow="showSet"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>
  </div>
</template>

<script>
import Tables from '_c/tables'
import AddModel from './operations/add'
import BatchSet from './operations/set'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    localData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Tables,
    AddModel,
    BatchSet
  },
  data() {
    return {
      // 是否出现模态框
      showModel: false,
      // 是否可以编辑(通过这个来判断组件是编辑还是添加资源)
      showEdit: false,
      // 是否可以批量设置
      showSet: false,
      // 选择的复选框
      selection: [],
      // 选中的当行数据
      selectItem: {},
      // 用于判断当前是哪一行(可以用来编辑)
      current: 0,
      total: 0,
      page: 1,
      limit: 10,
      pageArr: [10, 20, 30, 50, 100],
      showAdd: false
      // localData: []
    }
  },
  computed: {},
  methods: {
    // 行编辑
    handleRowEdit(item, index) {
      if (!this.isEdit) {
        this.$Message.error('非编辑状态，无法进行修改！')
        return false
      }
      this.selectItem = item
      // 知道自己在编辑哪一行
      this.current = index
      // 跳出的模态框处于编辑状态
      this.showEdit = true
      // 显示模态框
      this.showModel = true
    },
    // 单行移除
    handleRowRemove(row, index) {
      if (!this.isEdit) {
        this.$Message.error('非编辑状态，删除操作失败！')
        return false
      }
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${row.name}的名称，请求路径${row.path}资源？`,
        onOk: () => {
          this.localData.splice(index, 1)
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 选择行表格数据
    handleSelect(item) {
      this.selection = item
    },
    // 搜索
    handleSearch() {},
    // 批量删除
    handleDeleteBatch() {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确定删除当前数据吗？',
        content: `删除${msg}的数据`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)
          console.log('前', this.localData)
          this.localData = this.localData.filter((item) => {
            return !arr.includes(item.name)
          })
          console.log('后', this.localData)
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 批量设置
    handleSetBatch() {
      // 批量进行设置
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
    },
    // 批量设置模态框
    handleItemSet(settings) {
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确定设置吗？',
        content: `修改${msg}的资源吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)
          // this.tableData.splice(index, 1)
          this.localData.map((item, index) => {
            const tmp = { ...item }
            if (arr.includes(tmp.name)) {
              for (var keys of Object.keys(settings)) {
                tmp[keys] = settings[keys]
              }
              this.$set(this.localData, index, tmp)
            }
          })
          this.$Message.success('批量设置成功！')
          //  this._getList()
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 点击页码
    onPageChange(page) {
      this.page = page
    },
    // 页面条数变化
    onPageSizeChange(size) {
      this.limit = size
    },
    // 出现添加的模态框
    handleAdd() {
      this.showModel = true
    },

    // 添加与编辑表单项
    // 逻辑梳理: 通过选项知道自己在哪一行，然后对该行进行数据的添加与编辑
    handleItem(item) {
      if (this.showEdit) {
        // 编辑状态
        console.log()
        this.localData.splice(this.current, 1, item)
        this.showEdit = false
      } else {
        // 添加状态
        this.localData.push(item)
      }
      // 表单数据
      this.$emit('on-change', this.localData)
    },
    // 批量设置模态框(成功后关闭)
    handleSetChangeEvent(value) {
      this.showSet = value
    },
    // 模态框出来的填写的数据(成功后关闭模态框)
    handleChangeEvent(val) {
      this.showModel = val
    }
  }
}
</script>

<style lang="scss" scoped>
.imooc-page {
  margin-top: 20px;
}
</style>
