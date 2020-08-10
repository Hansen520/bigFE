<template>
  <div class="layui-container fly-marginTop">

  <div class="fly-panel fly-panel-user" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="user">
      <ul class="layui-tab-title">
        <li>
          <router-link :to="{name: 'login'}">登入</router-link>
        </li>
        <li class="layui-this">注册</li>
      </ul>
      <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
        <validation-observer ref="observer" v-slot="{ validate }">
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <form method="post">
                <div class="layui-form-item">
                  <label for="L_email" class="layui-form-label">邮箱</label>
                  <ValidationProvider rules="required|email" name="email" v-slot="{ errors }">
                    <div class="layui-input-inline">
                      <input type="text" id="L_email" name="email" v-model="email" autocomplete="off" placeholder="请输入邮箱" class="layui-input">
                    </div>
                    <div class="layui-form-mid">
                      <div class="layui-word-aux">将会成为您唯一的登入名</div>
                      <div class="error">{{ errors[0] }}</div>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="layui-form-item">
                  <label for="L_username" class="layui-form-label">昵称</label>
                  <ValidationProvider rules="required|min:4|name" name="name" v-slot="{ errors }">
                    <div class="layui-input-inline">
                      <input type="text" id="L_username" name="username" v-model="username" autocomplete="off" placeholder="请输入用户名" class="layui-input">
                    </div>
                    <div class="layui-form-mid">
                      <div class="error">{{ errors[0] }}</div>
                    </div>
                  </ValidationProvider>
                </div>
                <ValidationObserver>
                  <div class="layui-form-item">
                    <label for="L_pass" class="layui-form-label">密码</label>
                    <ValidationProvider rules="required|min:6|max:16|confirmed:confirmation" name="password" v-slot="{ errors }">
                      <div class="layui-input-inline">
                        <input type="password" name="password" v-model="password" placeholder="请输入密码" autocomplete="off" class="layui-input">
                      </div>
                      <div class="layui-form-mid">
                        <div class="layui-word-aux">6到16个字符</div>
                        <div class="error">{{ errors[0] }}</div>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="layui-form-item">
                    <label for="L_repass" class="layui-form-label">确认密码</label>
                    <ValidationProvider rules="required" name="confirmation">
                      <div class="layui-input-inline">
                        <input type="password" name="repassword" v-model="repassword" placeholder="请确认密码" autocomplete="off" class="layui-input">
                      </div>
                      <!-- <div class="layui-form-mid">
                        <div class="error">{{ errors[0] }}</div>
                      </div> -->
                    </ValidationProvider>
                  </div>
                  </ValidationObserver>
                <div class="layui-form-item">
                  <label for="L_vercode" class="layui-form-label">验证码</label>
                  <ValidationProvider rules="required|length:4" name="code"  v-slot="{ errors }">
                  <div class="layui-input-inline">
                    <input type="text" name="code" v-model="code" placeholder="请输入验证码" autocomplete="off" class="layui-input">
                  </div>
                  <div class="layui-form-mid">
                    <span class="error">{{ errors[0] }}</span>
                  </div>
                  <div class="layui-form-mid svg">
                    <span v-html="svg" @click="_getCode()" class="svg"></span>
                  </div>
                  </ValidationProvider>
                </div>
                <div class="layui-form-item">
                  <button class="layui-btn" type="button" @click="validate().then(_submit)" lay-filter="*" lay-submit>立即注册</button>
                </div>
                <div class="layui-form-item fly-form-app">
                  <span>或者直接使用社交账号快捷注册</span>
                  <a href="/app/qq" onclick="layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})" class="iconfont icon-qq" title="QQ登入"></a>
                  <a href="/app/weibo/" onclick="layer.msg('正在通过微博登入', {icon:16, shade: 0.1, time:0})" class="iconfont icon-weibo" title="微博登入"></a>
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
import { getCode, reg } from '@/api/login'
import uuid from 'uuid/dist/v4'
export default {
  name: 'reg',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      email: '',
      username: '',
      password: '',
      repassword: '',
      code: '',
      svg: ''
    }
  },
  mounted () {
    let sid = ''
    if(localStorage.getItem('sid')){
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
      getCode().then((res) => {
        if (res.code === 200) {
          this.svg = res.data
          console.log(res)
        }
      })
    },
    async _submit () {
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        // ABORT
        return;
      }
      reg({
        username: this.username,
        name: this.name,
        password: this.password,
        code: this.code,
        sid: this.$store.state.sid
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
        }
      });
    }
  }
}

</script>

<style>
.error{
  color: red;
  padding-left: 5px;
}
.svg{
  position: relative;
  top: -18px;
}
.layui-form-mid{
  font-size: 12px;
  line-height: 14px;
  padding: 5px 0 !important;
}
</style>
