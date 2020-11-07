<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li>
            <router-link to="/login">登录</router-link>
          </li>
          <li class="layui-this">
            <router-link to="/forget">重置密码</router-link>
          </li>
        </ul>
        <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
          <validation-observer ref="observer" v-slot="{validate}">
            <div class="layui-tab-item layui-show">
              <div class="layui-form layui-form-pane">
                <form>
                  <div class="layui-form-item">
                    <validation-provider
                      name="password"
                      rules="required|min:6|max:16|confirmed:confirmation"
                      v-slot="{ errors }"
                    >
           
                        <label for="L_phone" class="layui-form-label">新密码</label>
                        <div class="layui-input-inline">
                          <input
                            type="password"
                            id="L_phone"
                            name="phone"
                            v-model="password"
                            class="layui-input"
                          />
                        </div>
                      <div class="layui-form-mid">
                        <div class="layui-form-mid layui-word-aux">6到16个字符</div>
                        <div style="color: #c00">{{ errors[0] }}</div>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <validation-provider
                      v-slot="{ errors }"
                      vid="confirmation"
                      name="repassword"
                      rules="required|min:6|max:16"
                    >
                      <label for="L_imagecode1" class="layui-form-label">确认密码</label>
                      <div class="layui-input-inline">
                        <input
                          type="password"
                          name="repassword"
                          v-model="repassword"
                          class="layui-input"
                        />
                      </div>
                      <div class="layui-form-mid">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>

                  <div class="layui-form-item">
                    <validation-provider
                      name="code"
                      ref="codefield"
                      rules="required|length:4"
                      v-slot="{errors}"
                    >
                    <label for="L_vercode" class="layui-form-label">验证码</label>
                    <div class="layui-input-inline">
                      <input
                        type="text"
                        v-model="code"
                        placeholder="请输入验证码"
                        autocomplete="off"
                        class="layui-input"
                      />
                    </div>
                    <div
                      class="layui-form-mid svg"
                      v-html="svg"
                      @click="_getCode()"
                      id="img"
                      style="padding: 0 !important;width: 150px;"
                    ></div>
                    <div class="layui-form-mid">
                      <span style="color: #c00;">{{errors[0]}}</span>
                    </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <button class="layui-btn" type="button" @click="validate().then(submit)">提交</button>
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
import { getCode, reset } from '@/api/login'
import uuid from 'uuid/dist/v4'
import { getParam } from '@/utils/common'
export default {
  name: 'reset',
  data () {
    return {
      key: '',
      password: '',
      repassword: '',
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
    if(localStorage.getItem(sid)){
      sid = localStorage.getItem('sid')
    } else {
      sid = uuid()
      localStorage.setItem('sid', sid)
    }
    this.$store.commit('setSid', sid)
    this.key = getParam('key')
    this._getCode()
  },
  methods: {
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        // ABORT!!
        return
      }
      reset({
        key: this.key,
        password: this.password,
        sid: this.$store.state.sid,
        code: this.code
      }).then((res)=>{
        if(res.code === 200){
          this.$alert('密码修改成功')
          setTimeout(()=>{
            // 跳转到登入界面，让用户登入
            this.$router.push('/login')
          }, 1000)
        }
      })
    },
    _getCode(){
      let sid = this.$store.state.sid
      console.log(sid)
      // sid作为query传递给后台
      getCode(sid).then((res) => {
        if (res.code === 200) {
          this.svg = res.data
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.error{
  color: red;
  padding-left: 5px;
}
.svg{
  position: relative;
  top: -18px;
}
.layui-form-mid{
  width: 200px;
  font-size: 12px;
  line-height: 8px;
  padding: 5px 0px !important;
}
</style>