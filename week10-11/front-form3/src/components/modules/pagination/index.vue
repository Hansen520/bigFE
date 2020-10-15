<template>
  <div
    class="d-flex"
    :class="{'flex-center': align==='center', 'flex-start': align==='left', 'flex-end': align==='right'}"
  >
    <div class="layui-box layui-laypage layui-laypage-default">
      <a
        href="javascript:;"
        class="layui-laypage-prev"
        :class="{'layui-disabled': current === 0}"
        v-show="showEnd"
        @click.prevent="home()"
      >
        <i class="layui-icon layui-icon-prev" v-if="showType === 'icon'"></i>
        <template v-else>首页</template>
      </a>
      <a :class="{'layui-disabled': current===0}" @click.prevent="prev()">
        <i class="layui-icon layui-icon-left" v-if="showType === 'icon'"></i>
        <template v-else>上一页</template>
      </a>
      <!-- 是否显示... -->
      <!-- 4出现... -->
      <a
        href="javascript:;"
        v-if="pages.length > 5 && (current + 1 - 2) > 1"
        class="layui-disabled"
      >...</a>
      <template v-for="(item, index) in pages">
        <!-- (current < 2 && item <= dist) || (current > pages.length - dist + 1 && item > pages.length - dist),就是为了保持内容居中 -->
        <a
          href="javascript:;"
          :key="'page' + index"
          v-if="(item >= (current + 1 - 2) && item <= (current + 1 + 2)) || (current < 2 && item <= dist) || (current > pages.length - dist + 1 && item > pages.length - dist)"
          @click="changeIndex(index)"
          :class="[current === index ? theme : '', current === index ? 'active': '']"
        >{{item}}</a>
      </template>
      <a
        href="javascript:;"
        v-if="pages.length > 5 && (current + 1 + 2) < pages.length"
        class="layui-disabled"
      >...</a>
      <a :class="{'layui-disabled': current === pages.length - 1}" @click.prevent="next()">
        <i class="layui-icon layui-icon-right" v-if="showType === 'icon'"></i>
        <template v-else>下一页</template>
      </a>
      <a
        href="javascript:;"
        class="layui-laypage-next"
        v-show="showEnd"
        :class="{'layui-disabled': current === pages.length - 1}"
        @click.prevent="end()"
      >
        <i class="layui-icon layui-icon-next" v-if="showType === 'icon'"></i>
        <template v-else>尾页</template>
      </a>
    </div>
    <div class="total" v-if="hasTotal">
      到第
      <input type="text" class="imooc-input text-center" @keyup.enter="jumpTo">
      页 / 共{{totalPages}}页
    </div>
    <!-- 下面是选择的页面大小 -->
    <div v-if="hasSelect">
      <div
        class="layui-unselect layui-form-select"
        :class="{'layui-form-selected': isSelect}"
        @click="changeFav()"
      >
          <div class="layui-select-title">
            <input
              type="text"
              placeholder="请选择"
              readonly
              v-model="options[optIndex]"
              class="layui-input layui-unselect"
            >
            <i class="layui-edge"></i>
          </div>
          <dl class="layui-anim layui-anim-upbit">
            <dd
              v-for="(item, index) in options"
              :key="'catalog' + index"
              @click="chooseFav(item, index)"
              :class="{'layui-this': index === optIndex}"
            >
              {{item}}
            </dd>
          </dl>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'pagination-index',
  props: {
    align: {
      type: String,
      default: 'center'
    },
    // 判断是否为》>这种icon类型，如果不是则显示 文字 尾页 下一页
    showType: {
      type: String,
      default: 'icon'
    },
    // 是否显示首尾跳转按钮
    showEnd: {
      type: Boolean,
      default: true
    },
    // 设置导航条的主题色
    theme: {
      type: String,
      default: 'layui-bg-green'
    },
    // 是否显示页面总数
    hasTotal: {
      type: Boolean,
      default: false
    },
    // 是否可以选择页面大小
    hasSelect: {
      type: Boolean,
      default: false
    },
    // 总数,根据前面传入
    total: {
      type: Number,
      default: 10
    },
    // 当前页
    current: {
      type: Number,
      default: 0
    },
    // 页面大小显示条数
    size: {
      type: Number,
      default: 11
    },
    // 显示的最大页码个数
    dist: {
      type: Number,
      default: 5
    }
  },
  watch: {
    total(newval, old){
      this.initPages()
    }
  },
  data () {
    return {
      // layui框架选择判断
      isSelect: false,
      optIndex: 0,
      // 供选择的页面大小
      options: [10, 11, 20, 25, 30],
      // 导航条显示的1，2，3，4，5
      pages: [],
      // 页面大小
      limit: 10
    }
  },
  computed: {
    // 页面总数(根据接口数据的变化而变化)
    totalPages(){
      // 全部的条数除以每页的限制条数就是页数
      return Math.ceil(this.total / this.limit)
    }
  },

  mounted () {
    // 每页限制
    this.limit = this.size
    // 初始化页数
    this.initPages()
    // uniq为去重, sortBy为排序，concat为两个数组连接
    this.options = _.uniq(_.sortBy(_.concat(this.options, this.size)))
    // 选择合适的页面大小，返回数组索引
    this.optIndex = this.options.indexOf(this.size)
  },
  methods: {
    initPages(){
      const len = this.totalPages
      // _.range 返回数组
      this.pages = _.range(1, len + 1)
    },
    // 跳到首页
    home(){
      this.$emit('changeCurrent', 0)
    },
    // 跳到尾页
    end(){
      this.$emit('changeCurrent', this.pages.length - 1)
    },
    // 上一页
    prev(){
      let cur = 0
      if(this.current - 1 < 0){
        cur = 0
      } else {
        cur = this.current - 1
      }
      this.$emit('changeCurrent', cur)
    },
    // 下一页
    next(){
      let cur = 0
      if(this.current + 1 > this.pages.length){
        cur = this.pages.length
      } else {
        cur = this.current + 1
      }
      this.$emit('changeCurrent', cur)
    },
    // 避免重复点击相同的页码造成重复请求同一个接口
    changeIndex(val){
      if(val !== this.current){
        this.$emit('changeCurrent', val)
      }
    },
    // 页码跳页
    jumpTo(event){
      const result = event.target.value
      let cur = this.current
      if(result > this.totalPages || result < 0){
        this.$pop('shake', '请输入正确的页码呀~')
      } else {
        cur = result -1
      }
      if(cur !== this.current){
        this.$emit('changeCurrent', cur)
      }
    },
    // 选择每页的大小
    chooseFav(item, index){
      if(this.optIndex !== index){
        // 页面limit发生变化后，调整current值(就是说变化限制页数调整当前页)
        this.$emit('changeCurrent', Math.floor(this.limit * this.current / this.options[index]))
        // 选择调整的页数
        this.$emit('changeLimit', this.options[index])
      }
      this.optIndex = index
      this.limit = this.options[this.optIndex]
      this.initPages()
    },
    // layerUI框架，是否被选中
    changeFav(){
      this.isSelect = !this.isSelect
    }
  }
}

</script>

<style lang="scss" scoped>
.layui-laypage {
  a {
    margin-left: -1px !important;
    // &:first-child {
    //   border-right: 0;
    // }
    // &:last-child {
    //   border-left: 0;
    // }
    &.active {
      border-radius: 2px;
      position: relative;
      z-index: 100;
    }
  }
  .layui-bg-green {
    border-color: #009688;
  }
}
.total {
  color: rgba(51, 51, 51, 1);
  margin-left: 20px;
  position: relative;
  top: -2px;
}
.imooc-input {
  width: 30px;
  padding: 0 5px;
  height: 24px;
  line-height: 24px;
}

.layui-input {
  height: 28px;
  line-height: 28px;
}

.layui-input {
  height: 30px;
  line-height: 30px;
}

.layui-form-select {
  width: 80px;
  position: relative;
  top: -2.5px;
  margin-left: 10px;
}
</style>
