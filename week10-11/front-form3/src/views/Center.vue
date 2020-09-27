<template>
  <div>
    <div class="layui-container fly-marginTop fly-user-main">
      <ul class="layui-nav layui-nav-tree" lay-filter="test">
        <li class="layui-nav-item" v-for="(item, index) in lists" :key="'center'+ index">
          <router-link href="javascript:;" :to="{name: item.link}" :active-class="item.activeClass">
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
export default {
  name: 'center',
  data () {
    return {
      lists: [{
        name: '我的主页',
        icon: 'layui-icon-home',
        link: 'index'
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
        name: '我的消息',
        icon: 'layui-icon-notice',
        link: 'mypost',
        activeClass: 'layui-this'
      },
      {
        name: '我的帖子',
        icon: 'layui-icon-form',
        link: 'msg'
      },
      {
        name: '其他消息',
        icon: 'layui-icon-list',
        link: 'others'
      }]
    }
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
