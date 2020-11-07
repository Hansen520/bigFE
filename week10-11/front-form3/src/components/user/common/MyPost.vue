<template>
  <div>
    <div class="overflow">
      <table class="layui-table" cellspacing="0" cellpadding="0" border="0">
        <thead>
          <tr>
            <th>
              <div class="layui-table-cell pl0">
                <span>帖子标题</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>状态</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>结帖</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>发表时间</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>数据</span>
              </div>
            </th>
            <th class="min-cell">
              <div class="layui-table-cell">
                <span>操作</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center" v-for="(item, index) in list" :key="'mypost' + index">
            <td class="text-left">
              <router-link
                class="link"
                :to="{name: 'detail', params: {tid: item._id}}"
              >{{item.title}}</router-link>
            </td>
            <td>{{item.status === '0' ? '打开': '关闭'}}</td>
            <td :class="{'success': item.isEnd !=='0'}">{{item.isEnd === '0'? '未结': '已结贴'}}</td>
            <td>{{item.created | moment}}</td>
            <td>{{item.reads}}阅/{{item.answer}}答</td>
            <td>
              <div
                  class="layui-btn layui-btn-xs"
                  :class="{'layui-btn-disabled': item.isEnd === '1'}"
                  @click="editPost(item)"
                >编辑</div>
              <div class="layui-btn layui-btn-xs layui-btn-danger" @click="deletePost(item)">删除</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <imooc-page
      v-show="total > 1"
      :total="total"
      :current="current"
      :align="'left'"
      :hasTotal="true"
      :hasSelect="true"
      @changeCurrent="handleChange"
    ></imooc-page>
  </div>
</template>

<script>
import { getPostListByUid, deletePostByUid } from '@/api/user'
import Pagination from '@/components/modules/pagination'
export default {
  name: 'my-post',
  components: {
    'imooc-page': Pagination
  },
  data(){
    return {
      // 初始化数据
      list: [],
      total: 0,
      current: 0,
      page: 0,
      limit: 10
    }
  },
  mounted () {
    this.getPostList()
  },
  methods: {
    // 获取帖子列表
    getPostList(){
      getPostListByUid({
        page: this.current,
        limit: this.limit
      }).then((res)=>{
        if(res.code === 200){
          this.list = res.data
          this.total = res.total
        }
      })
    },
    // 删除帖子
    deletePost(item){
      this.$confirm('确定删除么?', () => {
        if(item.isEnd !== '0'){
          this.$pop('shake', '帖子已经结帖，无法删除了')
          return
        }
        deletePostByUid({
          tid: item._id
        }).then((res) => {
          if(res.code === 200){
            this.$pop('', '删除成功！')
            this.list.splice(this.list.indexOf(item), 1)
          } else {
            this.$pop('shake', res.msg)
          }
        })
      }, () => {})
    },
    // 编辑帖子
    editPost(item){
      if(item.isEnd === '1'){
        this.$pop('shake', '帖子已经结帖，无法继续编辑')
      }else {
        this.$router.push({
          name: 'edit',
          params: {
            tid: item._id,
            page: item
          }
        })
      }
    },
    // 分页
    handleChange (val) {
      this.current = val
      this.getPostList()
    },
  }
}

</script>

<style lang="scss" scoped>
.overflow{
  overflow-y: auto;
}
.min-cell {
  min-width: 80px;
}
.link{
  color: #14adee;
  font-weight: 600;
  font-family: '宋体';
}
.layui-table-header {
  th {
    text-align: center;
    &:first-child {
      text-align: left;
    }
  }
}
</style>
