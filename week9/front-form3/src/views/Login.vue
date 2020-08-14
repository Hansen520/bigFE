<template>
  <div class="layui-container fly-marginTop">
    <!-- <alert :msg="确定" :isShow="true"></alert> -->
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li class="layui-this">登入</li>
          <li>
            <router-link :to="{name: 'reg'}">注册</router-link>
          </li>
        </ul>
        <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
          <validation-observer ref="observer" v-slot="{ validate }">
            <div class="layui-tab-item layui-show">
              <div class="layui-form layui-form-pane">
                <form method="post">
                  <div class="layui-form-item">
                    <label for="L_username" class="layui-form-label">用户名</label>
                    <ValidationProvider rules="required|email" name="email" v-slot="{ errors }">
                      <div class="layui-input-inline">
                        <input
                          type="text"
                          name="email"
                          placeholder="请输入用户名"
                          autocomplete="off"
                          v-model.trim="username"
                          class="layui-input"
                        >
                      </div>
                      <div class="layui-form-mid">
                        <span style="color: #c00">{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="layui-form-item">
                    <label for="L_pass" class="layui-form-label">密码</label>
                    <ValidationProvider rules="required|min:6" v-slot="{ errors }">
                    <div class="layui-input-inline">
                      <input
                        type="password"
                        name="password"
                        placeholder="请输入密码"
                        autocomplete="off"
                        v-model.trim="password"
                        required
                        class="layui-input"
                      >
                    </div>
                    <div class="layui-form-mid">
                      <span style="color: #c00">{{ errors[0] }}</span>
                    </div>
                    </ValidationProvider>
                  </div>
                  <div class="layui-form-item">
                    <label for="L_vercode" class="layui-form-label">验证码</label>
                    <ValidationProvider name="code" ref="codefield" rules="required|length:4" v-slot="{ errors }">
                      <div class="layui-input-inline">
                        <input
                          type="text"
                          name="code"
                          placeholder="请输入验证码"
                          autocomplete="off"
                          v-model.trim="code"
                          class="layui-input"
                        >
                      </div>
                      <div class="layui-form-mid">
                        <span style="color: #c00;">{{ errors[0] }}</span>
                      </div>
                      <div class="layui-form-mid">
                        <span @click="_getCode()" v-html="svg" class="svg"></span>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="layui-form-item">
                    <button class="layui-btn" type="button" @click="validate().then(submit)" lay-filter="*" lay-submit>立即登录</button>
                    <span style="padding-left:20px;">
                      <router-link :to="{name: 'forget'}">忘记密码？</router-link>
                    </span>
                  </div>
                  <div class="layui-form-item fly-form-app">
                    <span>或者使用社交账号登入</span>
                    <a href="" onclick="layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})" class="iconfont icon-qq" title="QQ登入"></a>
                    <a href="" onclick="layer.msg('正在通过微博登入', {icon:16, shade: 0.1, time:0})" class="iconfont icon-weibo" title="微博登入"></a>
                  </div>
                </form>
              </div>
            </div>
          </validation-observer>  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { getCode, login } from '@/api/login'
import uuid from 'uuid/dist/v4'

// import Alert from '@/components/modules/alert/Alert'

export default {
  name: 'login',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      username: '',
      password: '',
      code: '',
      svg: ''
    }
  },
  mounted () {
    // 自定义弹窗
    window.vue = this
    let sid = ''
    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid')
    } else {
      sid = uuid()
      localStorage.setItem('sid', sid)
    }
    this.$store.commit('setSid', sid)
    this._getCode()

  },
  methods: {
    _getCode () {
      let sid = this.$store.state.sid
      // sid作为query传递给后台
      getCode(sid).then((res) => {
        if (res.code === 200) {
          this.svg = res.data
        }
      })
    },
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }
      login({
        username: this.username,
        password: this.password,
        code: this.code,
        sid: this.$store.state.sid
      }).then((res)=>{
        if(res.code === 200) {
          this.username = ''
          this.password = ''
          this.code = ''
          requestAnimationFrame(() => {
            // 清空表单
            this.$refs.observer.reset() // 整个表单进行重置的操作
          })
          console.log(res)
        } else if(res.code = 401) {
          // 验证错误为服务器传回来的错误,后面必需以数组的方式
          this.$refs.codefield.setErrors([res.msg])
        }
      }).catch((err)=>{
        const data = err.response.data
        if (data.code === 500) {
          this.$alert('用户名和密码验证失败了，请检查噢~')
        } else {
          this.$alert('服务器错误')
        }
      })
    }
  }
}

</script>

<style>
.svg{
  position: relative;
  top: -20px;
}
</style>
