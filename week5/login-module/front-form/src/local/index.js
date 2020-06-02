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
