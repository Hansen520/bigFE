import Vue from 'vue'
import VueI18n from 'vue-i18n'

import zh from 'vee-validate/dist/locale/zh_CN.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh_CN',
  messages: {
    zh_CN: {
      fields: {
        email: '邮箱',
        password: '密码',
        repassword: '确认密码',
        name: '昵称',
        username: '用户名',
        code987654321: '验证码',
        title: '标题',
        catalog: '分类'
      },
      validation: {
        ...zh.messages,
        required: '请输入{_field_}',
        // 自定义的方式
        email: '请输入正确的{_field_}!!!',
        repassword: {
          confirmed: (field, { target }) => {
            return `两次输入的${field}不一致`
          }
        }
      }
    }
  }
})

export { i18n }