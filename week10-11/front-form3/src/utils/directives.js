import { escapeHtml } from '@/utils/escapeHtml'
// import store from '@/store'
export default {
  'richtext': {
    // 只进行一次
    bind: function(el, binding, vnode){
      el.innerHTML = escapeHtml(binding.value)
    },
    // 可以进行多次
    componentUpdated: function(el, binding, vnode){
      el.innerHTML = escapeHtml(binding.value)
    }
  }
}