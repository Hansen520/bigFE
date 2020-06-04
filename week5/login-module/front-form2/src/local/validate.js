// 信息定制化
import { localize, extend } from 'vee-validate'
import { required, email, min, length, confirmed, max } from 'vee-validate/dist/rules'
import zh from 'vee-validate/dist/locale/zh_CN'

extend('email', email)
extend('min', min)
extend('required', required)
extend('length', length)
extend('confirmed', confirmed)
extend('max', max)
// extend('is_not', is_not)

extend('name', {
  validate: value => {
    return !(/^\d+/).test(value)
  },
  message: '不能以纯数字为名称'
})

// 中文包扩展
localize('zh_CN', {
  messages: {
    ...zh.messages,
    required: '请输入{_field_}'
  },
  // 与validation-provider中的name对应
  // key为name, value为对应的中文field名称
  names: {
    // input中相同
    email: '邮箱',
    password: '密码',
    repassword: '确认密码',
    name: '昵称',
    username: '账号',
    code: '验证码',
    title: '标题',
    catalog: '分类'
  },
  // 针对不同的name，定义不同的message消息
  fields: {
    // catalog: {
    //   is_not: '请选择{_field}'
    // },
    email: {
      email: '请输入正确的{_field_}',
      required: '请输入{_field_}'
    },
    name: {
      min: (field, { length }) => {
        return `请在${field}输入至少${length}个字符`
      }
    },
    password: {
      confirmed: (field, { target }) => {
        return `两次输入的${field}不一致`
      }
    }
  }
})
