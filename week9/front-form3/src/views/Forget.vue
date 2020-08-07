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
        <div class="layui-tab-item layui-show">
          <div class="layui-form layui-form-pane">
            <form method="post">
              <div class="layui-form-item">
                <label for="L_email" class="layui-form-label">邮箱</label>
                <ValidationProvider rules="required|email" name="email" v-slot="{ errors }">
                  <div class="layui-input-inline">
                    <input type="text" id="L_email" name="email" v-model="email" autocomplete="off" placeholder="请输入邮箱" class="layui-input">
                  </div>
                  <div class="layui-form-mid error">{{ errors[0] }}</div>
                </ValidationProvider>
              </div>
              <div class="layui-form-item">
                <label for="L_username" class="layui-form-label">昵称</label>
                <ValidationProvider rules="required|username" v-slot="{ errors }">
                  <div class="layui-input-inline">
                    <input type="text" id="L_username" name="username" v-model="username" autocomplete="off" placeholder="请输入用户名" class="layui-input">
                  </div>
                  <div class="layui-form-mid error">{{ errors[0] }}</div>
                </ValidationProvider>
              </div>
              <ValidationObserver>
                <div class="layui-form-item">
                  <label for="L_pass" class="layui-form-label">密码</label>
                  <ValidationProvider rules="required|password" v-slot="{ errors }">
                    <div class="layui-input-inline">
                      <input type="password" name="password" v-model="password" placeholder="请输入密码" autocomplete="off" class="layui-input">
                    </div>
                    <div class="layui-form-mid error">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
                <div class="layui-form-item">
                  <label for="L_repass" class="layui-form-label">确认密码</label>
                  <ValidationProvider rules="required" name="repassword" v-slot="{ errors }">
                    <div class="layui-input-inline">
                      <input type="password" name="repassword" v-model="repassword" placeholder="请确认密码" autocomplete="off" class="layui-input">
                    </div>
                    <div class="layui-form-mid error">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
                </ValidationObserver>
              <div class="layui-form-item">
                <label for="L_vercode" class="layui-form-label">验证码</label>
                <ValidationProvider rules="required|length:4" name="code"  v-slot="{ errors }">
                <div class="layui-input-inline">
                  <input type="text" name="code" v-model="code" placeholder="请输入验证码" autocomplete="off" class="layui-input">
                </div>
                <div class="layui-form-mid error">
                  <span>{{ errors[0] }}</span>
                </div>
                <div class="layui-form-mid svg">
                  <span v-html="svg" @click="_getCode"></span>
                </div>
                </ValidationProvider>
              </div>
              <div class="layui-form-item">
                <button class="layui-btn" lay-filter="*" lay-submit>立即注册</button>
              </div>
              <div class="layui-form-item fly-form-app">
                <span>或者直接使用社交账号快捷注册</span>
                <a href="/app/qq" onclick="layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})" class="iconfont icon-qq" title="QQ登入"></a>
                <a href="/app/weibo/" onclick="layer.msg('正在通过微博登入', {icon:16, shade: 0.1, time:0})" class="iconfont icon-weibo" title="微博登入"></a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { getCode } from '@/api/getChapcha'
export default {
  name: 'reg',
  components: {
    ValidationProvider
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
    this._getCode()
  },
  methods: {
    _getCode () {
      getCode().then((res) => {
        // console.log(res)
        if (res.code === 200) {
          this.svg = res.data
        }
      })
    }
  }
}

</script>

<style>
.error{
  color: red;
}
.svg{
  position: relative;
  top: -18px;
}
</style>
