import {
  getUserInfo
  // logout,
  // getMessage,
  // getContentByMsgId,
  // hasRead,
  // removeReaded,
  // restoreTrash,
  // getUnreadCount
} from '@/api/user'
import { login } from '@/api/login'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar(state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      console.log(token)
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setMessageCount(state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList(state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList(state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore(state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg(state, { from, to, msg_id }) {
      const index = state[from].findIndex((_) => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: (state) => state.messageUnreadList.length,
    messageReadedCount: (state) => state.messageReadedList.length,
    messageTrashCount: (state) => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin({ commit }, loginInfo) {
      // userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          ...loginInfo
        })
          .then((res) => {
            const data = res.data.data
            console.log(res.data.token)
            commit('setToken', res.data.token)
            commit('setAvatar', data.pic)
            commit('setUserName', data.name)
            commit('setUserId', data._id)
            commit('setAccess', data.roles)
            commit('setHasGetInfo', true)
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token)
            .then((res) => {
              const data = res.data
              // 这里不能重复设置token
              commit('setAvatar', data.pic)
              commit('setUserName', data.name)
              commit('setUserId', data._id)
              commit('setAccess', data.roles)
              commit('setHasGetInfo', true)
              resolve(data)
            })
            .catch((err) => {
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount({ state, commit }) {
      // getUnreadCount().then((res) => {
      //   const { data } = res
      //   commit('setMessageCount', data)
      // })
    }
  }
}
