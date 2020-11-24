<template>
  <div>
    <Card>
      <tables
        ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
        <!-- 使用插槽 -->
        <template v-slot:table-header>
          <Button @click="handleAddUser" class="search-btn" type="primary">
            <Icon type="md-person-add" />&nbsp;&nbsp;新增用户
          </Button>
        </template>
      </tables>
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
          <Button style="margin: 10px 0" type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>导出表格
          </Button>
        </Col>
        <Col>
          <Page
            :total="total"
            :current="page"
            :page-size="limit"
            :page-size-opts="pageArr"
            show-elevator
            show-sizer
            show-total
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </Col>
      </Row>
    </Card>
    <EditModel
      :isShow="showEdit"
      :item="currentItem"
      @editEvent="handleItemEdit"
      @changeEvent="handleEditChangeEvent"
    ></EditModel>
    <AddModel
      :isShow="showAdd"
      @editEvent="handleItemAdd"
      @changeEvent="handleAddChangeEvent"
    ></AddModel>
    <BatchSetModel
      :isShow="showSet"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSetModel>
  </div>
</template>

<script>
// 获取用户列表，通过id更新用户，更具id删除用户
import {
  getUserList,
  updateUserById,
  deleteUserById,
  addUser,
  updateUserBatchById
} from '@/api/admin'
import Tables from '_c/tables'
import EditModel from './edit'
import AddModel from './add'
import BatchSetModel from './batchSet'
import dayjs from 'dayjs'
export default {
  name: 'user_management',
  components: {
    Tables,
    AddModel,
    EditModel,
    BatchSetModel
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      showEdit: false,
      showAdd: false,
      showSet: false,
      currentIndex: 0,
      currentItem: {},
      // 需要搜索的值
      option: {},
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '用户昵称',
          key: 'name',
          minWidth: 150,
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 160,
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 160,
          // params就是后台传递来的数据
          render: (h, params) => {
            return h('div', [h('span', params.row.roles.join(','))])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          minWidth: 80,
          hidden: true
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === '0' ? '否' : '是')
            ])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '是否是VIP',
          key: 'isVip',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [h('span', params.row.isVip === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          fixed: 'right',
          width: 100,
          align: 'center',
          hidden: true
        }
      ],
      pageArr: [6, 10, 20, 30, 50, 100],
      tableData: [],
      // 批量选择
      selection: []
    }
  },
  mounted() {
    this._getList()
  },
  methods: {
    // 批量进行删除
    handleDeleteBatch() {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据哦~')
        return
      }
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定要删除用户吗?',
        content: `删除${msg}个用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deleteUserById(arr).then((res) => {
            // 整体过滤掉数据(能在前端整理数据则不要请求接口了)
            this.tableData = this.tableData.filter(
              // 棒， 留下没有过滤掉的数组项
              (item) => !arr.includes(item._id)
            )
            this.$Message.success('删除成功了！')
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 批量进行设置
    handleItemSet(settings) {
      // console.log(settings)
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定修改用户吗?',
        content: `修改${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          // arr为选择的值的所有_id，setting为需要设置的值
          updateUserBatchById({ ids: arr, settings }).then((res) => {
            this.tableData = this.tableData.map((item) => {
              if (arr.includes(item._id)) {
                for (let keys of Object.keys(settings)) {
                  // 就是对原来的数据进行重新赋值，就是前端对数据重新更新
                  item[keys] = settings[keys]
                }
              }
            })
          })
          this.$Message.success('操作成功！')
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 模态框设置事件
    handleSetChangeEvent(value) {
      this.showSet = value
    },
    // 模态框添加事件
    handleAddChangeEvent(value) {
      this.showAdd = value
    },
    // 模态框编辑事件
    handleEditChangeEvent(value) {
      this.showEdit = value
    },

    // 模态框编辑成功事件
    handleItemEdit(item) {
      updateUserById(item).then((res) => {
        if (res.code === 200) {
          console.log('更新成功了')
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    // 添加用户
    handleAddUser() {
      this.showAdd = true
    },
    // 设置模态框
    handleSetBatch() {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据哦~')
        return
      }
      this.showSet = true
    },
    // 模态框添加成功事件
    handleItemAdd(item) {
      addUser(item).then((res) => {
        if (res.code === 200) {
          this.$Message.success('更新成功！')
          this.tableData.splice(0, 0, res.data)
        }
      })
    },
    // 单行编辑
    handleRowEdit(row, index) {
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    // 单行移除
    handleRowRemove(row, index) {
      this.$Modal.confirm({
        title: '确定删除当前用户吗？',
        content: `删除第${index + 1}条数据，用户名为："${row.name}"的用户吗`,
        // 成功后调用后台接口
        onOk: () => {
          deleteUserById(row._id).then((res) => {
            this.tableData.splice(index, 1)
            this.$Message.success('删除成功了！')
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 需要搜索的值
    handleSearch(value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      if (
        typeof this.option.search !== 'undefined' &&
        value.search !== this.option.search &&
        this.option === {}
      ) {
        // 从第1页开始，就是搜索选项发生跳转的时候
        this.page = 1
        // 搜索的选项和值
      }
      this.option = value
      // console.log(this.option)
      this._getList()
    },
    // 改变当前页
    onPageChange(page) {
      this.page = page
      // this._getList()
    },
    // 改变页面大小
    onPageSizeChange(size) {
      this.limit = size
      this._getList()
    },
    // 导出excel
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    // 选择数据
    handleSelect(selection) {
      this.selection = selection
      console.log(this.selection)
    },
    _getList() {
      getUserList({
        page: this.page - 1,
        limit: this.limit,
        option: this.option
      }).then((res) => {
        this.total = res.total
        this.tableData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scope>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
