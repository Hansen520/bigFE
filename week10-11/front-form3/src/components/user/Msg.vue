<template>
  <div class="fly-panel fly-panel-user" pad20>
	  <div class="layui-tab layui-tab-brief" lay-filter="user" id="LAY_msg" style="margin-top: 15px;">
	    <button
        class="layui-btn layui-btn-danger"
        id="LAY_delallmsg"
        @click="clearAll()"
      >清空全部消息</button>
	    <div  id="LAY_minemsg" style="margin-top: 10px;">
        <!--<div class="fly-none">您暂时没有最新消息</div>-->
        <ul class="mine-msg">
          <li v-for="(item, index) in lists" :key="'comments'+index">
            <blockquote class="layui-elem-quote">
              <a href="/jump?username=Absolutely" target="_blank">
                <cite></cite>
                <cite>{{item.cuid.name}}</cite>
              </a>
              <a href="/jump?username=Absolutely" target="_blank">
                <cite></cite>
                <cite>{{item.title}}</cite>
              </a>
            </blockquote>
             <div v-richtext="item.content"></div>
             <p>
               <span>{{item.created | moment}}</span>
               <a
                 href="javascript:;"
                 class="layui-btn layui-btn-small layui-btn-danger fly-delete"
                 @click="clear(item)"
               >已阅</a>
             </p>
          </li>
        </ul>
        <imooc-page
          v-show="total > 0"
          :total="total"
          :current="page"
          :align="'left'"
          :hasTotal="true"
          :hasSelect="true"
          @changeCurrent="handleChange"
        ></imooc-page>
      </div>
	  </div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { getMsg, setMsg } from '@/api/user'
import Pagination from '@/components/modules/pagination'
export default {
  name: 'user-msg',
  components: {
    'imooc-page': Pagination
  },
  data(){
    return {
      lists: [],
      page: 0,
      limit: 10,
      total: 0
    }
  },
  mounted () {
    this.getMsgAll()
  },
  computed: mapState({
    // 我们可以单独对消息计数进行处理
    num: state => state.num.message ? state.num.message : 0
  }),
  methods: {
    // 清空所有已读消息
    clearAll(){
      setMsg().then((res) => {
        if(res.code === 200){
          // 清空所有消息
          this.lists = []
          this.$store.commit('setMessage', {message: 0})
          this.total = 0
          this.$pop('', '已全部阅读')
        }
      })
    },
    // 清除单条消息
    clear(item){
      setMsg({id: item._id}).then((res)=>{
        if(res.code === 200){
          // 设置特定消息已读
          this.getMsgAll()
          this.$store.commit('setMessage', {message: this.num - 1})
          this.$pop('', '已阅读')
        }
      })
    },
    // 获取全部消息
    getMsgAll(){
      getMsg({
        page: this.page,
        limit: this.limit
      }).then((res)=>{
        console.log(res)
        if(res.code === 200){
          this.lists = res.data
          this.total = res.total
        }
      })
    },
    handleChange (val) {
      this.page = val
      this.getMsgAll()
    }
  }
}

</script>

<style>

</style>
