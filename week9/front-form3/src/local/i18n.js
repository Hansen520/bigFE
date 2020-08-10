import Vue from 'vue'
import VueI18n from 'vue-i18n'

import zh from 'vee-validate/dist/locale/zh_CN.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh_CN',
  messages: {
    zh_CN: {
      fields: {
        email1: '邮箱',
        password: '密码',
        repassword: '确认密码',
        username: '账号',
        confirmation: '确认密码',
        name: '昵称',
        isNumber: '',
        code: '验证码',
        title: '标题',
        catalog: '分类',  
      },
      validation: {
        ...zh.messages,
        // 自定义的方式
        required: '*请输入{_field_}',
        // 第一个email与上面fields里的email对应也和login.vue里面的email名字对应
        email1: {
          email: '请输入正确的{_field_}！',
          required: '请输入{_field_}'
        },
        name: {
          min: (field, {length}) => {
            return `请在${field}里面至少输入${length}个字符`
          }
        },
        password: {
          repassword: '两次输入不一致'
        }
      }
    }
  }
})

export { i18n }