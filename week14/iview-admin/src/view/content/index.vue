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
      />
      <Row type="flex" justfy="space-between" align="middle">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel"
          >导出为Excel文件</Button
        >
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
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getList, deletePostById, updatePostById } from '@/api/content'
import EditModel from './editModel'
import dayjs from 'dayjs'
export default {
  name: 'content_management',
  components: {
    Tables,
    EditModel
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      showEdit: false,
      // 设置当前页的索引值
      currentIndex: 0,
      currentItem: {},
      pageArr: [10, 20, 30, 50, 100],
      tableData: [],
      columns: [
        {
          title: '标题',
          key: 'title',
          minWidth: 400
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
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 100,
          align: 'center'
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.tags.map(o => o.name).join(','))
            ])
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.isEnd === '0' ? '否' : '是')
            ])
          }
        },
        {
          title: '阅读记数',
          key: 'reads',
          width: 100,
          align: 'center'
        },
        {
          title: '回答记数',
          key: 'answer',
          width: 100,
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
          }
        },
        {
          title: '设置',
          slot: 'action',
          key: 'settings',
          fixed: 'right',
          width: 160,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    handleChangeEvent (value) {
      // 关闭模态框
      this.showEdit = value
    },
    handleItemEdit (item) {
      updatePostById(item).then(res => {
        if (res.code === 200) {
          console.log('更新成功了')
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    handleRowEdit (row, index) {
      console.log(index, row)
      this.showEdit = true
      console.log(this.showEdit)
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    handleRowRemove (row, index) {
      console.log(row, index)
      this.$Modal.confirm({
        title: '确定删除文章么?',
        content: `删除第${index + 1}条数据，文章标题："${row.title}"的文章吗`,
        onOk: () => {
          deletePostById(row._id)
            .then(res => {
              if (res.code === 200) {
                this.$Message.info('成功删除！')
                // 过滤掉页面数据
                this.tableData = this.tableData.filter(
                  item => item._id !== row._id
                )
              }
            })
            .catch(err => {
              this.$Message.info('删除失败！原因：' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },

    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    onPageChange (page) {
      // 改变当前页数
      this.page = page
      this._gitList()
    },
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    _gitList () {
      // 从0开始
      getList({ page: this.page - 1, limit: this.limit }).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  },
  mounted () {
    this._gitList()
  }
}
</script>

<style></style>
