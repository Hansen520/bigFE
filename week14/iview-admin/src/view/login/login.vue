<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    // options为登入信息
    handleSubmit (options) {
      // 返回的是promise
      this.handleLogin(options).then(res => {
        if (res) {
          // 跳转工作
          this.$router.push({
            name: this.$config.homeName
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
