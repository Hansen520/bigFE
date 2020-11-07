<template>
  <div class="layui-container">
  <imooc-panel></imooc-panel>
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md8 content detail">
      <div class="fly-panel detail-box">
        <h1>{{page.title}}</h1>
        <div class="fly-detail-info">
    
        <span
          class="layui-badge layui-bg-green fly-detail-column"
          v-if="page.catalog === 'share'"
        >分享</span>
        <span
          class="layui-badge layui-bg-green fly-detail-column"
          v-else-if="page.catalog === 'ask'"
        >提问</span>
        <span
          class="layui-badge layui-bg-green fly-detail-column"
          v-else-if="page.catalog === 'advise'"
        >建议</span>
        <span
          class="layui-badge layui-bg-green fly-detail-column"
          v-else-if="page.catalog === 'logs'"
        >动态</span>
        <span
          class="layui-badge layui-bg-green fly-detail-column"
          v-else-if="page.catalog === 'discuss'"
        >交流</span>
        <span
          class="layui-badge layui-bg-green fly-detail-column"
          v-else-if="page.catalog === 'notice'"
        >公告</span>

          <span class="layui-badge" style="background-color: #999;" v-if="page.isEnd === '0'">未结</span>
          <span class="layui-badge" style="background-color: #5FB878;" v-else>已结</span>
          <span
            class="layui-badge"
            :class="tag.class"
            v-for="(tag,index) in page.tags"
            :key="'tags' + index"
          >{{tag.name}}</span>

          <div class="fly-admin-box" data-id="123">
            <span
      
                  class="layui-btn layui-btn-xs jie-admin"
                  type="del"
                >删除</span>

                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="stick"
                  rank="1"
                  v-if="page.isTop === '0'"
                >置顶</span>
                <span
                  class="layui-btn layui-btn-xs jie-admin"
                  type="set"
                  field="stick"
                  rank="0"
                  style="background-color:#ccc;"
                  v-else
                >取消置顶</span>
          </div>
          <span class="fly-list-nums">
            <a href="#comment"><i class="iconfont" title="评论数">&#xe60c;</i>{{page.answer}}</a>
            <i class="iconfont" title="阅读数">&#xe60b;</i> {{page.reads}}
          </span>
        </div>
        <!-- 收藏、作者信息 -->
        <div class="detail-about">
          <a class="fly-avatar" href="../user/home.html">
            <img :src="page.uid ? page.uid.pic: '/img/tim0g.jpg'" />
          </a>
          <div class="fly-detail-user">
            <a href="../user/home.html" class="fly-link">
              <cite>{{ page.uid? page.uid.name: 'hh1' }}</cite>
              <i class="iconfont icon-renzheng" title="认证信息："></i>
              <i
                  class="layui-badge fly-badge-vip mr1"
                  v-if="page.uid && page.uid.isVip !== '0'? page.uid.isVip : false"
                >VIP{{page.uid.isVip}}</i>
            </a>
            <span>{{page.created | moment}}</span>
          </div>
          <div class="detail-hits">
            <span style="padding-right: 10px; color: #FF7200">悬赏：{{page.fav}}</span>
          </div>
        </div>
        
        <div class="layui-btn-container fly-detail-admin pt1">
          <router-link
            class="layui-btn layui-btn-sm jie-admin"
            :to="{name: 'edit', params: {tid: tid, page: page}}"
            v-show="page.isEnd === '0' && page.uid._id === user._id"
          >编辑</router-link>
          <a
            class="layui-btn layui-btn-sm jie-admin-collect"
            :class="{'layui-btn-primary': page.isFav}"
            @click.prevent="setCollect()"
          >{{page.isFav ? '取消收藏':'收藏'}}</a>
        </div>
        <div class="detail-body photos" v-html="content"></div>
      </div>

      <div class="fly-panel detail-box" id="flyReply">
        <fieldset class="layui-elem-field layui-field-title" style="text-align: center;">
          <legend>回帖</legend>
        </fieldset>

        <ul class="jieda" id="jieda">
          <li
            class="jieda-daan"
            v-for="(item, index) in comments"
            :key="'comments' + index"
          >
            <div class="detail-about detail-about-reply">
              <a class="fly-avatar" href="">
                <img :src="item.cuid ? item.cuid.pic : '/img/tim0g.jpg'" alt=" " />
              </a>
              <div class="fly-detail-user">
                <router-link
                  class="fly-link"
                  :to="{}"
                >
                  <cite>{{item.cuid? item.cuid.name :'imooc'}}</cite>
                  <i
                    class="layui-badge fly-badge-vip"
                    v-if="item.cuid && item.cuid.isVip !== '0'? item.cuid.isVip : false"
                  >VIP{{item.cuid.isVip}}</i>
                </router-link>
                <span v-if="index === 0">(楼主)</span>
              </div>

              <div class="detail-hits">
                <span>{{item.created | moment}}</span>
              </div>

              <i
                class="iconfont icon-caina"
                title="最佳答案"
                v-show="item.isBest === '1'"
              ></i>
            </div>
            <div class="detail-body jieda-body photos" v-richtext="item.content"></div>
            <div class="jieda-reply">
              <span
                class="jieda-zan"
                :class="{'zanok': item.handed === '1'}"
                @click="hands(item)"
              >
                <i class="iconfont icon-zan"></i>
                <em>{{item.hands}}</em>
              </span>
              <span type="reply" @click="reply(item)">
                <i class="iconfont icon-svgmoban53"></i>
                回复
              </span>
              <div class="jieda-admin">
                <!-- item为整条数据的值 -->
                <span
                  v-show="page.isEnd === '0' && item.cuid._id === user._id"
                  @click="editComment(item)"
                >编辑</span>
                <!-- <span type="del">删除</span> -->
                <span
                  class="jieda-accept"
                  v-show="page.isEnd === '0' && item.cuid._id === user._id"
                  @click="setBest(item)"
                >采纳</span>
              </div>
            </div>
          </li>

          <!-- 无数据时 -->
          <li class="fly-none">消灭零回复</li>
        </ul>

        <imooc-page
          v-show="total > 0"
          align="center"
          :current="current"
          :size="size"
          :showType="'icon'"
          :hasSelect="true"
          :hasTotal="true"
          @changeCurrent="handleChange"
          @changeLimit="handleLimit"
          :total="total"
        ></imooc-page>
        <div class="layui-form layui-form-pane">
          <form action="/jie/reply/" method="post">
           <validation-observer ref="observer" v-slot="{ validate }">
                <imooc-edit @changeContent="addContent" :initContent="editInfo.content"></imooc-edit>
                <div class="layui-form-item">
                  <validation-provider
                    name="code"
                    ref="codefield"
                    rules="required|length:4"
                    v-slot="{errors}"
                  >
                    <div class="layui-row">
                      <label for="L_vercode" class="layui-form-label">验证码</label>
                      <div class="layui-input-inline">
                        <input
                          type="text"
                          name="code"
                          v-model="code"
                          placeholder="请输入验证码"
                          autocomplete="off"
                          class="layui-input"
                        />
                      </div>
                      <div class>
                        <span class="svg" style="color: #c00;" @click="_getCode()" v-html="svg"></span>
                      </div>
                    </div>
                    <div class="layui-form-mid">
                      <span style="color: #c00;">{{errors[0]}}</span>
                    </div>
                  </validation-provider>
                </div>
                <div class="layui-form-item">
                  <button class="layui-btn" type="button" @click="validate().then(submit)">提交回复</button>
                </div>
              </validation-observer>
          </form>
        </div>
      </div>
    </div>
    <div class="layui-col-md4">
      <imooc-hotlist></imooc-hotlist>
      <imooc-ads></imooc-ads>
      <imooc-links></imooc-links>
    </div>
  </div>
</div>
</template>

<script>
import { getDetail } from '@/api/content'
import { getComments,addComment,updateComment,setCommentBest,setHands } from '@/api/comments'
import { addCollect } from '@/api/user'
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import Links from '@/components/sidebar/Links'
import Panel from '@/components/Panel'
import Editor from '../modules/editor/Index'
import CodeMix from '@/mixin/code'
import { escapeHtml } from '@/utils/escapeHtml'
import Pagination from '@/components/modules/pagination'
import { scrollToElem } from '@/utils/common'

export default {
  name: 'Detail',
  mixins: [CodeMix],
  props: ['tid'],
  data () {
    return {
      // total根据接口数据大小定义
      total: 0,
      size: 10,
      current: 0,
      // 页面信息
      page: {},
      comments: [],
      editInfo: {
        content: '',
        code: '',
        sid: ''
      }
    }
  },
  components: {
    'imooc-hotlist': HotList,
    'imooc-ads': Ads,
    'imooc-links': Links,
    'imooc-panel': Panel,
    'imooc-edit': Editor,
    'imooc-page': Pagination
  },
  watch: {
    // 点击热议后，文章内容进行个切换
    tid(newval, oldVal){
      // 文章详情
      this.getPostDetail()
      // 评论列表
      this.getCommentsList()
    }
  },
  mounted () {
    // 文章详情
    this.getPostDetail()
    // 评论列表
    this.getCommentsList()
  },
  computed: {
    content(){
      if(typeof this.page.content === 'undefined'){
        return ''
      }
      if(this.page.content.trim() === ''){
        return ''
      }
      return escapeHtml(this.page.content)
    },
    user () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    async submit(){
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }
      // 用户未登入
      const isLogin = this.$store.state.isLogin
      if(!isLogin){
        this.$pop('shake', '请先登入')
        return
      }
      const user = this.$store.state.userInfo
      // 数据扩充
      this.editInfo.code = this.code
      this.editInfo.sid = this.$store.state.sid
      this.editInfo.tid = this.tid
      // 获取评论用户的信息: 图片、昵称、vip
      const cuid = {
        _id: user._id,
        pic: user.pic,
        name: user.name,
        isVip: user.isVip
      }
      // 用这里去判断是编辑评论还是用下面的添加评论(说明文本框里是有内容的)
      if(typeof this.editInfo.cid !== 'undefined' && this.editInfo.cid !== ''){
        const obj = {...this.editInfo}
        delete obj['item']// 不需要这项内容
        // 判断用户是否修改了内容
        if(this.editInfo.content === this.editInfo.item.content){
          this.$pop('shake', '哈哈，好像没有编辑任何内容哟！')
          return
        }

        // 更新评论i
        updateComment(obj).then((res) => {
          if(res.code === 200){
            // 神奇
            const temp = this.editInfo.item
            temp.content = this.editInfo.content
            this.$pop('', '更新评论成功')
            this.code = ''
            this.editInfo.content = ''
            // 方法一，只用更新特定的一条的content created， 数组必用$set
            // 方法二，更新整个数组中的这一条
            this.comments.splice(this.comments.indexOf(this.editInfo.item), 1, temp)
          }
        })
        return
      }
      // 添加评论
      addComment(this.editInfo).then((res) =>{
        if(res.code === 200){
          this.$pop('', '发表评论成功')
          // 成功发表评论，清空回复内容吧
          this.code = ''
          this.editInfo.content = ''
          // 添加新的评论道评论列表
          res.data.cuid = cuid
          this.comments.push(res.data)
          // 清空表单
          requestAnimationFrame(() => {
            this.$refs.observer &&  this.$refs.observer.reset()
          })
          // 同时刷新验证码(通过迷信混入)
          this._getCode()
        } else {
          this.$alert(res.msg)
        }
      })
    },
    
    // 本人编辑评论
    editComment(item){
      this.editInfo.content = item.content
      // 滚动到文本框对应位置
      scrollToElem('.layui-input-block', 500, -60)
      document.getElementById('edit').focus()
      // 数据双向绑定，确定需要去编辑的记录
      // cid也是此条评论的id
      this.editInfo.cid = item._id
      this.editInfo.item = item
    },
    // 本人采纳评论
    setBest(item){
      this.$confirm('您确定采用这个为最佳答案么?', () => {
        // 发送采纳最佳答案请求
        setCommentBest({
          cid: item._id,
          tid: this.tid
        }).then((res)=>{
          if(res.code === 200){
            this.$pop('', '设置最佳答案成了')
            item.isBest = '1'
            this.page.isEnd = '1'
          }
        })
      }, ()=>{})
    },
    // 评论回复功能
    reply(item){
      // 插入@ + name 到 content
      // 滚动页面到输入框
      // focus 输入框
      const reg = /^@[\S]+/g
      if(this.editInfo.content){
        if(reg.test(this.editInfo.content)){
          // 如果前面已经@别人了，如果再点击可以进行替换
          this.editInfo.content = this.editInfo.content.replace(
            reg, `@${item.cuid.name} `
          )
        }else{
          // 如果没有@别人,只是已经输入内容了
          if(this.editInfo.content !== ''){
            // 非空的情况
            this.editInfo.content = `@${item.cuid.name} ${this.editInfo.content}`
          }
        }
      } else {
        // 评论框为空,点击回复时候
         this.editInfo.content = '@' + item.cuid.name + ' '
      }
      // 动态滚动到输入框的位置，并且进行focus
      scrollToElem('.layui-input-block', 500, -65)
      document.getElementById('edit').focus()
    },
    // 收藏
    setCollect(){
      const isLogin = this.$store.state.isLogin
      if(isLogin){
        const collect = {
          tid: this.tid,
          title: this.page.title,
          isFav: this.page.isFav ? 1 : 0
        }
        addCollect(collect).then((res)=>{
          if(res.code === 200){
            this.page.isFav = !this.page.isFav
            this.$pop('', this.page.isFav ? '设置收藏成功' : '取消收藏成功')
          }
        })
      }else{
        this.$pop('shake', '要先登入才能收藏哟！')
      }
    },
    // 调整当前值
    handleChange(val){
      this.current = val
      this.getCommentsList()
    },
    // 设置页面大小
    handleLimit(val){
      this.size = val
      // 改变
      this.getCommentsList()
    },
    // 添加文本框内容
    addContent(val){
      this.editInfo.content = val
    },
    // 获取文章详情(重要接口)
    getPostDetail () {
      getDetail(this.tid).then((res) => {
        if (res.code === 200) {
          this.page = res.data
          console.log(this.page)
        }
      })
    },
    // 获取评论列表
    getCommentsList () {
      getComments({
        tid: this.tid,
        // 最重要的还是传递这两个值
        page: this.current,
        limit: this.size
      }).then((res) => {
        if (res.code === 200) {
          this.comments = res.data
          this.total = res.total
        }
      })
    },
    // 点赞开发
    hands(item){
      setHands({cid: item._id}).then((res)=>{
        if(res.code === 200){
          this.$pop('', '点赞成功')
          // 该用户已经为此条评论点过赞了
          item.handed = '1'
          // 点赞数量+1
          item.hands += 1
        }else{
          this.$pop('shake', res.msg)
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.fly-detail-admin {
  text-align: right;
  border-top: 1px dotted #eaeaea;
  background: #f8f8f8;
}

.fly-detail-info {
  span {
    margin-right: 5px;
  }
}

.fly-admin-box {
  margin-left: 0;
}

.jieda-body {
  margin: 25px 0 20px !important;
}
</style>
