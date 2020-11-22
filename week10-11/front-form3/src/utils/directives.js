import { escapeHtml } from '@/utils/escapeHtml'
import store from '@/store'
export default {
  // 文本编译，就是对表情的编译
  'richtext': {
    // 只进行一次
    bind: function(el, binding, vnode){
      el.innerHTML = escapeHtml(binding.value)
    },
    // 可以进行多次
    componentUpdated: function(el, binding, vnode){
      el.innerHTML = escapeHtml(binding.value)
    }
  },
  // 组件级权限控制
  'hasRole': {
    inserted: function (el, binding, vnode) {
      let roles = store.state.userInfo.roles || ['user']
      console.log(roles)
      console.log(binding.value)
      if (!roles.includes(binding.value)) {
        el.parentNode.removeChild(el)
      }
    }
  },
  // 有无权限
  'hasPermission': {
    inserted: function (el, binding, vnode) {
      let types = vnode.context.$route.meta.types
      let values = binding.value
      let flag = true
      console.log(types)
      console.log(values)
      for (let v of values) {
        if (!types.includes(v)) {
          flag = false
        }
      }
      if (!flag) {
        el.parentNode.removeChild(el)
      }
    }
  }
}
