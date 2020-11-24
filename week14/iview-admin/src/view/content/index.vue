<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      />
      <Row type="flex" justfy="space-between" align="middle">
        <div class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
          <Button style="margin: 10px 0" type="primary" @click="exportExcel"
            >导出为Excel文件</Button
          >
        </div>
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
        ></Page>
      </Row>
    </Card>
    <EditModel
      :isShow="showEdit"
      :item="currentItem"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></EditModel>
    <BatchSetModel
      :isShow="showSet"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSetModel>
  </div>
</template>

<script>
import Tables from '_c/tables'
import {
  getList,
  deletePostById,
  updatePostById,
  updatePostBatchById
} from '@/api/content'
import EditModel from './editModel'
import BatchSetModel from './batchSet'
import dayjs from 'dayjs'
export default {
  name: 'content_management',
  components: {
    Tables,
    EditModel,
    BatchSetModel
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      showEdit: false,
      showSet: false,
      // 放搜索时候选项的值
      option: {},
      // 设置当前页的索引值
      currentIndex: 0,
      currentItem: {},
      pageArr: [10, 20, 30, 50, 100],
      columns: [
        {
          type: 'selection',
          width: 60,
          hidden: true,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 400,
          search: {
            type: 'input'
          }
        },
        {
          title: '创建时间',
          key: 'created',
          width: 200,
          align: 'center',
          // 采用iview独有的渲染方式
          render: (h, params) => {
            // 就是在当前标签里创建日期，params.row就是从数据库里获取的信息
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '作者',
          key: 'user',
          width: 120,
          align: 'center',
          // 方法二：使用 render 方法结构化数据
          render: (h, params) => {
            return h('div', [h('span', params.row.uid.name)])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '分类',
          key: 'catalog',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const catalog = params.row.catalog
            let result = ''
            switch (catalog) {
              case 'ask':
                result = '提问'
                break
              case 'advise':
                result = '建议'
                break
              case 'discuss':
                result = '交流'
                break
              case 'share':
                result = '分享'
                break
              case 'logs':
                result = '动态'
                break
              case 'notice':
                result = '公告'
                break
              default:
                result = '全部'
            }
            return h('div', [h('span', result)])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '提问',
                value: 'ask'
              },
              {
                key: '建议',
                value: 'advice'
              },
              {
                key: '交流',
                value: 'discuss'
              },
              {
                key: '分享',
                value: 'share'
              },
              {
                key: '动态',
                value: 'logs'
              },
              {
                key: '公共',
                value: 'notice'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 100,
          align: 'center',
          // 隐藏
          hidden: true
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.tags.map((o) => o.name).join(','))
            ])
          },
          search: {
            type: 'input'
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isEnd === '0' ? '否' : '是')])
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
          title: '阅读记数',
          key: 'reads',
          width: 100,
          hidden: true,
          align: 'center'
        },
        {
          title: '回答记数',
          key: 'answer',
          width: 100,
          hidden: true,
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
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
          title: '是否置顶',
          key: 'isTop',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  color: '#19be6b',
                  type: params.row.isTop === '1' ? 'md-checkmark' : '',
                  size: 20
                }
              })
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
          title: '设置',
          slot: 'action',
          key: 'settings',
          fixed: 'right',
          hidden: true,
          width: 160,
          align: 'center'
        }
      ],
      // 数据的集合
      tableData: [],
      // 批量选择
      selection: []
    }
  },
  mounted() {
    this._getList()
  },
  methods: {
    // 批量删除文章
    handleDeleteBatch() {
      if (this.selection.length === 0) {
        this.$Message.info('请选择要删除的批量数据哟！')
        return
      }
      const msg = this.selection.map((o) => o.title).join(',')
      this.$Modal.confirm({
        title: '确定要删除这些篇文章么?',
        content: `删除${msg}的文章`,
        onOk: () => {
          const ids = this.selection.map((o) => o._id)
          deletePostById(ids).then((res) => {
            this.tableData = this.tableData.filter(
              (item) => !ids.includes(item._id)
            )
            this.$Message.success('删除文章成功了！')
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 批量设置文章
    handleSetBatch() {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据哦~')
        return
      }
      this.showSet = true
    },
    // 模态框进行设置事件
    handleItemSet(settings) {
      const msg = this.selection.map((o) => o.title).join()
      this.$Modal.confirm({
        title: '确定对这些文章进行操作么?',
        content: `修改${msg}的文章么`,
        onOk: () => {
          let arr = this.selection.map((o) => o._id)
          updatePostBatchById({ ids: arr, settings }).then((res) => {
            this.tableData = this.tableData.map((item) => {
              // 需要好好琢磨
              if (arr.includes(item._id)) {
                for (let keys of Object.keys(settings)) {
                  item[keys] = settings[keys]
                }
              }
            })
          })
        }
      })
    },
    // 模态框设置显示事件
    handleSetChangeEvent(value) {
      this.showSet = value
    },
    // 是否显示编辑模态框
    handleChangeEvent(value) {
      this.showEdit = value
    },
    // 单行编辑
    handleItemEdit(item) {
      updatePostById(item).then((res) => {
        if (res.code === 200) {
          console.log('更新成功了')
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    // 单行编辑
    handleRowEdit(row, index) {
      console.log(index, row)
      this.showEdit = true
      console.log(this.showEdit)
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    // 单行移除
    handleRowRemove(row, index) {
      console.log(row, index)
      this.$Modal.confirm({
        title: '确定删除文章么?',
        content: `删除第${index + 1}条数据，文章标题："${row.title}"的文章吗`,
        onOk: () => {
          deletePostById(row._id)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.info('成功删除！')
                // 过滤掉页面数据
                this.tableData = this.tableData.filter(
                  (item) => item._id !== row._id
                )
              }
            })
            .catch((err) => {
              this.$Message.info('删除失败！原因：' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    onPageChange(page) {
      // 改变当前页数
      this.page = page
      this._getList()
    },
    onPageSizeChange(size) {
      this.limit = size
      this._getList()
    },
    // 批量选择
    handleSelect(item) {
      this.selection = item
      // console.log(this.selection)
    },
    // 搜索的值
    handleSearch(value) {
      if (
        typeof this.option.search !== 'undefined' &&
        value.search !== this.option.search &&
        this.option === {}
      ) {
        // 从第1页开始，就是搜索选项发生跳转的时候
        this.page = 1
        // 搜索的选项和值
      }
      // 传给接口的
      this.option = value
      // console.log(this.option)
      this._getList()
    },
    // 渲染列表
    _getList() {
      // 从0开始
      getList({
        page: this.page - 1,
        limit: this.limit,
        option: this.option
      }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
