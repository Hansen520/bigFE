<template>
  <div>
    <div class="layui-container fly-marginTop fly-user-main">
      <ul class="layui-nav layui-nav-tree" lay-filter="test">
        <li class="layui-nav-item" v-for="(item, index) in lists" :key="'center'+ index">
          <router-link href="javascript:;" :to="{name: item.link, params: {uid: uid}}" :active-class="item.activeClass">
            <i class="layui-icon" :class="item.icon">
              {{item.name}}
            </i>
          </router-link>
        </li>
      </ul>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'center',
  data () {
    return {
      lists: [{
        name: '我的主页',
        icon: 'layui-icon-home',
        link: 'home'
      },
      {
        name: '用户中心',
        icon: 'layui-icon-friends',
        link: 'center'
      },
      {
        name: '基本设置',
        icon: 'layui-icon-set',
        link: 'info',
        activeClass: 'layui-this'
      },
      {
        name: '我的帖子',
        icon: 'layui-icon-form',
        link: 'mypost'
      },
      {
        name: '我的消息',
        icon: 'layui-icon-notice',
        link: 'msg',
        activeClass: 'layui-this'
      },

      {
        name: '其他消息',
        icon: 'layui-icon-list',
        link: 'others'
      }]
    }
  },
  computed: {
    ...mapGetters(['uid'])
  }
}

</script>

<style lang="scss" scoped>
.iconfont{
  margin-right: 10px;
}
.fly-user-main>.layui-nav .layui-icon{
  font-size: 14px;
}
</style>
