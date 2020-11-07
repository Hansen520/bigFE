/* eslint camelcase: 0 */
// 信息定制化
import { extend, localize } from 'vee-validate'
import { required, email, min, max, length, confirmed, is_not } from 'vee-validate/dist/rules'

import zh from 'vee-validate/dist/locale/zh_CN.json'

extend('required', required)
extend('min', min)
extend('max', max)
extend('email', email)
extend('length', length)
extend('confirmed', confirmed)
extend('is_not', is_not)
extend('name', {
  validate: value => {
    return !(/^\d+/).test(value)
  },
  message: '不能以纯数字为昵称'
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
    email: '邮箱',
    oldpassword: '旧密码',
    password: '密码',
    repassword: '确认密码',
    name: '昵称',
    username: '用户名',
    code: '验证码',
    title: '标题',
    catalog: '分类'
  },
  // 针对不同的name，定义不同的message消息
  fields: {
    catalog: {
      is_not: '*请选择{_field_}'
    },

    email: {
      email: '请输入正确的{_field_}！',
      required: '请输入{_field_}'
    },
    name: {
      min: (field, {length}) => {
        return `请在${field}里面至少输入${length}个字符`
      }
    },
    // 对应校验
    password: {
      confirmed: (field, { target }) => {
        return `两次输入的${field}不一致！`
      }
    }
  }
})
