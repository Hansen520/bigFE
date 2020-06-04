- 本周作业
local/index.js
``` javascript
import { Validator } from 'vee-validate'

const dictionary = {
  // 对中文部分自定义修改
  'zh-CN': {
    messages: {
      // field是对应input的name属性的attributes信息，length为属性值，如min: 4中的4
      required: field => '*请输入' + field,
      email: () => '*请输入正确的邮箱格式',
      min: () => '*不符合最小长度要求',
      length: (field, length) => '*' + field + '最小长度为' + length
    },
    attributes: {
      email: '邮箱',
      password: '密码',
      name: '账号',
      code: '验证码'
    }
  }
}
// 更新
Validator.localize(dictionary)

```

app.vue
``` javascript
<template>
  <div id="app">
    <div class="layui-container">
      <form class="layui-form layui-form-pane" action="">
      <div class="layui-form-item">
        <label class="layui-form-label">输入框</label>
        <div class="layui-input-inline">
          <input type="text" v-model.trim="name"  v-validate="'required|email'" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
        </div>
        <div class="error layui-form-mid">{{errors.first('name')}}</div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">密码框</label>
        <div class="layui-input-inline">
          <input type="password" v-model.trim="password" v-validate="'required|min:6|alpha_dash'" name="password" required  lay-verify="required" placeholder="请输入密码" autocomplete="off" class="layui-input">
        </div>
        <div class="error layui-form-mid">{{ errors.first('password')}}</div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">验证码</label>
        <div class="layui-input-inline">
          <input type="text" v-model.trim="code" v-validate="'required|length:4'" name="code" lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-mid svg" v-html="svg" @click="getCaptcha"></div>
        <div class="error layui-form-mid">{{errors.first('code')}}</div>
      </div>
      <div class="layui-form-item">
        <div class="layui-input-block">
          <button class="layui-btn" lay-submit lay-filter="formDemo" @click="checkForm">点击登入</button>
          <a href="" class="imooc-link">找回密码</a>
        </div>
      </div>
    </form>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data () {
    return {
      svg: '',
      name: '',
      password: '',
      code: '',
      errorMsg: []
    }
  },
  mounted () {
    this.getCaptcha()
  },
  methods: {
    getCaptcha () {
      axios.get('http://localhost:3000/getChapcha').then((res) => {
        if (res.status === 200) {
          const obj = res.data
          if (obj.code === 200) {
            this.svg = obj.data
          }
        }
      })
    },
    checkForm () {
      this.errorMsg = []
      if (!this.name) {
        this.errorMsg.push('登入名不能为空！')
      }
      if (!this.password) {
        this.errorMsg.push('密码不得为空！')
      }
      if (!this.code) {
        this.errorMsg.push('验证码不得为空！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped代表只在当前页面生效
#app{
  margin: 20px;
}
input{
  width: 190px;
}
// input:valid {
//   border-color: green;
// }
.error {
  color: red;
}
.imooc-link{
  margin-left: 20px;
}
.svg{
  position: relative;
  top: -19px;
  left: -6px;
}

</style>
```

main.js关键代码
``` javascript
import VeeValidate, { Validator } from 'vee-validate'
// method2 to zh-cn
import './local/index'
Vue.use(VeeValidate)
// 实例化Validator对象
const validator = new Validator()
// 通过自定义利用中文格式
validator.localize('zh-CN')
```
