// 信息定制化
import { extend, localize } from 'vee-validate'
import { required, email, min, length, confirmed } from 'vee-validate/dist/rules'

import zh from 'vee-validate/dist/locale/zh_CN.json'

extend('required', required)
extend('min', min)
extend('email', email)
extend('length', length)
extend('confirmed', confirmed)

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
    email: '邮箱',
    password: '密码',
    repassword: '确认密码',
    name: '昵称',
    username: '昵称',
    code: '验证码',
    title: '标题',
    catalog: '分类'
  },
  // 针对不同的name，定义不同的message消息
  fields: {
    email: {
      email: '请输入正确的{_field_}',
      required: '请输入{_field_}'
    },
    name: {
      min: (field, { length }) => {
        return `请在${field}输入至少${length}个字符`
      }
    },
    code: {
      length: (field, { length }) => {
        return `请输入${length}位${field}`
      }
    },
    password: {
      confirmed: (field, { target }) => {
        return `两次输入的${field}不一致`
      }
    }
  }
})
