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
