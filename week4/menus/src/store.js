import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: []
  },
  mutations: {
    setList (state, value){
      state.list = value
      console.log(value)
    }
  }
})