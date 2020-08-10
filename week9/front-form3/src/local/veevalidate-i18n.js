import { extend, configure } from 'vee-validate'
import { required, email, min, max, length, confirmed } from 'vee-validate/dist/rules'
import { i18n } from './i18n'

configure({
  defaultMessage: (field, values) => {
    values._field_ = i18n.t(`fields.${field}`)
    return i18n.t(`validation.${values._rule_}`, values)
  }
})

extend('required', required)
extend('min', min)
extend('max', max)
extend('email', email)
extend('length', length)
extend('confirmed', confirmed)

extend('name', {
  validate: value => {
    return !(/^\d+/).test(value)
  },
  message: '不能以纯数字为昵称'
})

extend('password', {
  params: ['target'],
  validate (value, {target}) {
    if (value === target) return true
  }
})