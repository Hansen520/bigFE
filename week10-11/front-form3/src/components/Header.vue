<template>
  <div class="fly-header layui-bg-black">
  <div class="layui-container">
    <a class="fly-logo" href="/">
      <img src="../assets/logo.png" alt="layui">
    </a>
    <ul class="layui-nav fly-nav layui-hide-xs">
      <li class="layui-nav-item layui-this">
        <router-link to="/1212">登入</router-link>
      </li>
      <li class="layui-nav-item">
        <router-link to="/4234">框架</router-link>
      </li>
      <li class="layui-nav-item">
        <router-link to="/434">结构</router-link>
      </li>
    </ul>

    <ul class="layui-nav fly-nav-user">
      <template v-if="!isShow">
        <!-- 未登入的状态 -->
        <li class="layui-nav-item">
          <router-link :to="{name: 'login'}">登入</router-link>
        </li>
        <li class="layui-nav-item">
          <router-link :to="{name: 'reg'}">注册</router-link>
        </li>
        <li class="layui-nav-item layui-hide-xs">
          <a href="" onclick="layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})" title="QQ登入" class="iconfont icon-qq"></a>
        </li>
        <li class="layui-nav-item layui-hide-xs">
          <a href="" onclick="layer.msg('正在通过微博登入', {icon:16, shade: 0.1, time:0})" title="微博登入" class="iconfont icon-weibo"></a>
        </li>
      </template>
      <!-- 登入后的状态 -->
      <template v-else>
        <li class="layui-nav-item" @mouseover="show()" @mouseleave="hide()">
          <a class="fly-nav-avatar" href="javascript:;">
            <cite class="layui-hide-xs">{{userInfo.name}}</cite>
            <!-- <i class="iconfont icon-renzheng layui-hide-xs" title="认证信息：layui 作者"></i> -->
            <i class="layui-badge fly-badge-vip layui-hide-xs" v-show="userInfo.isVip !== '0'">VIP{{userInfo.isVip}}</i>
            <img :src="userInfo.pic">
          </a>
          <dl class="layui-nav-child layui-anim layui-anim-upbit" :class="{'layui-show': isHover}">
            <dd>
              <router-link :to="{name: 'info'}" tag="a">
                <i class="layui-icon">&#xe620;</i>基本设置
              </router-link>
            </dd>
            <dd>
              <router-link :to="{name: 'mypost'}" tag="a">
                <i class="iconfont icon-tongzhi" style="top: 4px;"></i>我的消息
              </router-link>
            <dd>
              <router-link :to="{name: 'index'}"><i class="layui-icon" style="margin-left: 2px; font-size: 22px;">&#xe68e;</i>我的主页</router-link>
            </dd>
            <hr style="margin: 5px 0;">
            <dd><a href="javscript:void(0)" @click="loginout()" style="text-align: center;">退出</a></dd>
          </dl>
      </li>
      </template>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      isHover: false,
      hoverCtrl: {}
    }
  },
  computed: {
     isShow(){
      return this.$store.state.isLogin
    },
    userInfo(){
      return this.$store.state.userInfo || {
        name: '',
        pic: '',
        isVip: 0
      }
    }   
  },
  methods: {
    // 当用户鼠标移入时候显示菜单,哈哈，定时器还能这么玩
    show(){
      console.log('show')
      clearTimeout(this.hoverCtrl)
      this.hoverCtrl = setTimeout(()=>{
        this.isHover = true
      }, 200)
    },
    // 当用户移除时候隐藏菜单
    hide(){
      console.log('hide')
      clearTimeout(this.hoverCtrl)
      this.hoverCtrl =setTimeout(()=>{
        this.isHover = false
      }, 500)
    },
    // 退出登入
    loginout(){
      let user = this.$store.state.userInfo
      this.$confirm('确认要退出么?', ()=>{
        // 清空所有信息
        localStorage.clear()
        this.$store.commit('setToken', '')
        this.$store.commit('setUserInfo', '')
        this.$store.commit('setIsLogin', false)// 登入
        this.$router.push({name: 'index'}, ()=>{})
      })
    }
  }
}

</script>

<style>
  .fly-logo{
    left: -15px !important;
    top: -10px !important;
    margin-left: 15px;
  }
</style>
