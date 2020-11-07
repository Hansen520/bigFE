<template>
  <div>
    <div class="panel">
      <div class="layui-container">
        <ul>
          <router-link tag="li" to="/" class="layui-hide-xs">
            <a href="">首页</a>
          </router-link>
          <router-link v-for="(item, index) in lists" :key='"panel" + index' tag="li" :to="item.path">
            <a href="">{{item.name}}</a>
            <span class="layui-badge-dot" v-if="item.isNew"></span>
          </router-link>
       
          <li><span class="line layui-hide-xs"></span></li>
          <!-- 用户登入后显示 -->
          <template v-if="isLogin">
            <li class="layui-hide-xs layui-hide-sm">
              <a>我发表的贴</a>
            </li>
            <li class="layui-hide-xs layui-hide-sm"><a href="">我收藏的帖</a></li>
          </template>
        </ul>
        <div class="right layui-hide-xs">
          <span class="layui-icon layui-icon-search"></span>
          <router-link :to="{'name': 'add'}" class="layui-btn">发表新帖</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'panel',
  data () {
    return {
      lists: [
        {
          name: '提问',
          path: '/index/ask'
        },
        {
          name: '分享',
          path: '/index/share',
          isNew: true
        },
        {
          name: '讨论',
          path: '/index/discuss'
        },
        {
          name: '建议',
          path: '/index/advise'
        },
        {
          name: '公告',
          path: '/index/notice'
        },
        {
          name: '动态',
          path: '/index/logs'
        }
      ],
      isLogin: this.$store.state.isLogin
    }
  }
}

</script>

<style lang="scss" scoped>
@media (max-width: 768px){
  // 最大宽度，小于<768
  .panel{
    height: auto !important;
  }
  ul{
    li{
      width: 33.3%;
    }
  }
}
.panel{
  position: relative;
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
}
ul {
  li {
    display: inline-block;
    &.layui-this a{
      color: #009688;
    }
    a{
      padding: 0 20px;
    }
  }
  .line {
    display: inline-block;
    height: 10px;
    width: 1px;
    background: #e2e2e2;
    vertical-align: middle;
    margin: 0 20px;
  }
}
.right{
  position: absolute;
  right: 0;
  top: 0;
  .layui-icon-search{
    margin-right: 10px;
    font-size: 20px;
    &:hover{
      color: #5fb878;
      cursor: pointer;
    }
  }
}

</style>
