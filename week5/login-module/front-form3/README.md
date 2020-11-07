### 完成的作业代码
>> 说明，本人采用vee-validate@3的版本进行校验！

- main.js公共代码
```javascript
// ValidationProvider因为三个文件都用到，所以用到全局了
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import './local/validate'

Vue.config.productionTip = false
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3000' : 'http://your.domain.com'
```

- src/local/validate.js 校验代码
```javascript
// 信息定制化
import { localize, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import zh from 'vee-validate/dist/locale/zh_CN'

// extend('email', {
//   validate (value, length) {
//     return value.length >= length
//   },
//   message: '请输入正确的邮箱'
// })
// extend('min', min)
extend('required', required)
// extend('length', {
//   validate (value) {
//     return value.length >= 4
//   },
//   message: '请输入4位{_field_}'
// })
extend('username', {
  validate: (value) => {
    return value.length === 6
  },
  message: '*昵称不符合长度'
})
extend('password', {
  validate: (value) => {
    // 要符合return的条件才可以，否则返回message的信息
    return value.length >= 6
  },
  message: '*不符合最小长度要求'
})
extend('repassword', {
  params: ['target'],
  validate (value, { target }) {
    // console.log(value, target)
    return value === target
  },
  message: '*输入密码不一致,请重新输入'
})
extend('code', {
  validate (value) {
    return value.length === 4
  },
  message: '*请输入4位有效验证码'
})
// extend('min', {
//   ...min,
//   message: '{_field_}不符合最小长度'
// })

// extend('name', {
//   validate: value => {
//     return !(/^\d+/).test(value)
//   },
//   message: '不能以纯数字为名称'
// })

extend('email', {
  ...email,
  message: '*请输入正确的邮箱格式'
})

extend('username', {
  validate: (value) => {
    return value.length >= 8
  },
  message: '*昵称不符合最小长度要求'
})

// 中文包扩展
localize('zh_CN', {
  // 对所有的required都这样子
  messages: {
    ...zh.messages,
    required: '*请输入{_field_}'
  },
  // 与validation-provider中的name对应
  // key为name, value为对应的中文field名称进行重写
  names: {
    // input中相同
    email: '邮箱',
    password: '密码',
    repassword: '确认密码',
    name: '昵称',
    username: '昵称',
    code: '验证码',
    title: '标题',
    catalog: '分类'
  }
  // 针对不同的name，定义不同的message消息
  // fields: {
  //   // catalog: {
  //   //   is_not: '请选择{_field}'
  //   // },
  //   email: {
  //     email: '请输入正确的{_field_}',
  //     required: '请输入{_field_}'
  //   },
  //   name: {
  //     min: (field, { length }) => {
  //       return `请在${field}输入至少${length}个字符`
  //     }
  //   },
  //   password: {
  //     confirmed: (field, { target }) => {
  //       return `两次输入的${field}不一致`
  //     }
  //   }
  // }
})
```

- src/api/getChapcha api接口调用
```javascript
import axios from 'axios'

const getCode = async () => {
  let result = ''
  try {
    result = await axios.get('/getChapcha')
    if (result.status === 200) {
      return result.data
    }
  } catch (e) {
    console.log(e)
  }
  return result
}

export { getCode }
```

- Forget.vue
```javascript
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
        <ValidationProvider rules="required|code" v-slot="{ errors }">
          <div class="layui-input-inline">
            <input type="text" id="L_vercode" name="code" v-model="code" placeholder="输入验证码" autocomplete="off" class="layui-input">
          </div>
          <div class="layui-form-mid error">
            <span>{{errors[0]}}</span>
          </div>
          <div class="layui-form-mid svg">
            <span v-html="svg" @click="_getCode()"></span>
          </div>
        </ValidationProvider>
      </div>
      <div class="layui-form-item">
        <button class="layui-btn" alert="1" lay-filter="*" lay-submit>提交</button>
      </div>
    </form>
  </div>
</div>
  </div>
</div>
</template>

<script>
import { getCode } from '@/api/getChapcha'
export default {
  name: 'forget',
  data () {
    return {
      email: '',
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
```

- Login.vue
```javascript
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
        <ValidationProvider rules="required|code" v-slot="{ errors }">
          <div class="layui-input-inline">
            <input type="text" id="L_vercode" name="code" v-model="code" placeholder="输入验证码" autocomplete="off" class="layui-input">
          </div>
          <div class="layui-form-mid error">
            <span>{{errors[0]}}</span>
          </div>
          <div class="layui-form-mid svg">
            <span v-html="svg" @click="_getCode()"></span>
          </div>
        </ValidationProvider>
      </div>
      <div class="layui-form-item">
        <button class="layui-btn" alert="1" lay-filter="*" lay-submit>提交</button>
      </div>
    </form>
  </div>
</div>
  </div>
</div>
</template>

<script>
import { getCode } from '@/api/getChapcha'
export default {
  name: 'forget',
  data () {
    return {
      email: '',
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
```
- Reg.vue
```javascript
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
                <ValidationProvider rules="required|email" v-slot="{ errors }">
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
                  <ValidationProvider rules="required|password" vid="password" v-slot="{ errors }">
                    <div class="layui-input-inline">
                      <input type="password" name="password" v-model="password" placeholder="请输入密码" autocomplete="off" class="layui-input">
                    </div>
                    <div class="layui-form-mid error">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
                <div class="layui-form-item">
                  <label for="L_repass" class="layui-form-label">确认密码</label>
                  <ValidationProvider rules="required|repassword:@password" v-slot="{ errors }">
                    <div class="layui-input-inline">
                      <input type="password" name="repassword" v-model="repassword" placeholder="请确认密码" autocomplete="off" class="layui-input">
                    </div>
                    <div class="layui-form-mid error">{{ errors[0] }}</div>
                  </ValidationProvider>
                </div>
                </ValidationObserver>
              <div class="layui-form-item">
                <label for="L_vercode" class="layui-form-label">验证码</label>
                <ValidationProvider rules="required|code"  v-slot="{ errors }">
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
import { getCode } from '@/api/getChapcha'
export default {
  name: 'reg',
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

```

### 总结
采用了vee-validate@3的方式进行了重新验证，里面有很多重复的东西可以写生一个组件进行调用(比如验证码图片，还有表单验证)，通过本章学习可以让我在未来进行的验证功能有一个掌握！
