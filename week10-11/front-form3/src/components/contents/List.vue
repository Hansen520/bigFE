<template>
  <div>
    <div class="fly-panel" style="margin-bottom: 0;">
      <div class="fly-panel-title fly-filter">
        <a :class="{'layui-this': status==='' && tag === ''}" @click.prevent="search()">综合</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this': status==='0'}" @click.prevent="search(0)">未结</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this': status==='1'}" @click.prevent="search(1)">已结</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this': status==='' && tag === '精华'}" @click.prevent="search(2)">精华</a>
        <span class="fly-filter-right layui-hide-xs">
          <a :class="{'layui-this': sort === 'created'}" @click.prevent="search(3)">按最新</a>
          <span class="fly-mid"></span>
          <a :class="{'layui-this': sort === 'answer'}" @click.prevent="search(4)">按热议</a>
        </span>
      </div>
      <list-item :lists="lists" :isEnd="isEnd" @nextpage = "nextPage()"></list-item>
    </div>
</div>
</template>

<script>
import { getList } from '@/api/content'
import ListItem from './ListItem'
export default {
  name: 'list',
  components: {
    ListItem
  },
  data () {
    return {
      isEnd: false,
      isRepeat: false,
      current: '',
      status: '',
      tag: '',
      sort: 'created',
      page: 0,
      limit: 4,
      catalog: '',
      lists: []
    }
  },
  mounted () {
    let catalog = this.$route.params['catalog']
    if (typeof catalog !== 'undefined' && catalog !== '') {
      this.catalog = catalog
    }
    this._getLists();
  },
  watch: {
    current(newval, oldval){
      // console.log('current:' + oldval+ ',' + newval)
      this.init()
    },
    // 因为可以监听到路由新旧变化所以才这么做
    '$route'(newval, oldval){
      let catalog = this.$route.params['catalog']
      // let catalog = newval.params['catalog']
      // console.log(newval, oldval)
      if (typeof catalog !== 'undefined' && catalog !== '') {
        // 就是把新的catalog传递
        this.catalog = catalog
      }
      this.init()
    }
  },
  methods: {
    init(){
      this.page = 0
      this.lists = []
      this.isEnd = false
      this._getLists()
    },
    _getLists () {
      // 加锁，防止多次请求接口
      if(this.isRepeat) return
      // 看是否到末尾，如果到了则没有点击更多
      if (this.isEnd) return
      this.isRepeat = true
      let options = {
        catalog: this.catalog,
        isTop: this.isTop,
        limit: this.limit,
        sort: this.sort,
        tag: this.tag,
        page: this.page,
        status: this.status
      }
      getList(options).then((res) => {
        // 加入一个请求锁，防止用户多次点击，等待数据返回后，再打开，good(因为用户有时候网络并不是很好，也是一个性能优化点)
        this.isRepeat = false
        // 交互，临时接口链接 http://url.cn/5ayaGGs
        // 对于异常的判断, res.code 非200， 我们给用户一个提示
        // 判断是否lists长度为0，如果为0可以直接赋值
        // 如果lists长度不为0，后面请求的数据加入到lists里面来
        if (res.code === 200) {
          // 判断res.data的长度(他是一次次请求的)，如果小于20条，则是最后页(因为即使是刚好20条，到了下一页也是会成为0条，那么逻辑还是符合要求的)
          if(res.data.length < this.limit) {
            this.isEnd = true
          }
          if (this.lists.length === 0) {
            this.lists = res.data
          } else {
            // 如果有新的数据则进行合并
            this.lists = this.lists.concat(res.data)
          }
        }
        
      }).catch((err) => {
        this.isRepeat = false
        if (err) {
          this.$alert(err.message)
        }
      })
    },
    nextPage(){
      // page++也是用作后台的skip+limit
      this.page ++;
      this._getLists();
    },
    search(val){
      if(typeof val === 'undefined' && this.current === '') {
        return
      }
      this.current = val
      switch (val) {
        // 未结帖
        case 0:
          this.status = '0'
          this.tag = ''
          break
        // 已结帖
        case 1:
          this.status = '1'
          this.tag = ''
          break
        // 查询“精华”标签
        case 2:
          this.status = ''
          this.tag = '精华'
          break
        // 按照时间去查询
        case 3:
          this.sort = 'created'
          break;
        // 按照评论数去查询
        case 4:
          this.sort = 'answer'
          break; 
        // 综合查询
        default:
          this.status = ''
          this.tag = ''
          this.current = ''
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
