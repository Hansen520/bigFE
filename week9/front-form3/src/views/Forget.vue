<template>
<div class="layui-container fly-marginTop">
  <div class="fly-panel fly-panel-user" pad20>
  <div class="layui-tab layui-tab-brief" lay-filter="user">
    <ul class="layui-tab-title">
      <li class="layui-this">
        <router-link :to="{name: 'login'}">忘记密码</router-link>
      </li>
      <li>
        找回密码
      </li>
    </ul>
  <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
    <validation-observer ref="observer" v-slot="{ validate }">
      <div class="layui-tab-item layui-show">
        <div class="layui-form layui-form-pane">
          <form method="post">
            <div class="layui-form-item">
              <label for="L_email" class="layui-form-label">邮箱</label>
              <ValidationProvider rules="required|email" v-slot="{ errors }">
                <div class="layui-input-inline">
                  <input type="text" id="L_email" name="email" v-model="email" autocomplete="off" placeholder="请输入您的邮箱噢！" class="layui-input">
                </div>
                <div class="layui-form-mid error">
                  <span>{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </div>
            <div class="layui-form-item">
              <label for="L_vercode" class="layui-form-label">验证码</label>
              <ValidationProvider rules="required|length:4" v-slot="{ errors }">
                <div class="layui-input-inline">
                  <input type="text" id="L_vercode" name="code" v-model="code" placeholder="输入验证码" autocomplete="off" class="layui-input">
                </div>
                <div class="layui-form-mid error">
                  <span>{{errors[0]}}</span>
                </div>
                <div class="layui-form-mid svg">
                  <span v-html="svg" @click="_getCode()" class="svg"></span>
                </div>
              </ValidationProvider>
            </div>
            <div class="layui-form-item">
              <button type="button" class="layui-btn" @click="validate().then(_submit)" alert="1" lay-filter="*" lay-submit>提交</button>
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
import { getCode, forget } from '@/api/login'
import { ValidationProvider,ValidationObserver } from 'vee-validate'
import uuid from 'uuid/dist/v4'
export default {
  name: 'forget',
  data () {
    return {
      email: '',
      code: '',
      svg: ''
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  mounted () {
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
          console.log(res)
        }
      })
    },
    async _submit () {
      forget({
        email: this.email,
        code: this.code
      }).then((res) => {
        console.log(res)
        if (res.code === 200) {
          alert('发送邮件成功')
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
