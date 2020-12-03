import axios from 'axios'

// 获取验证码接口
const getCode = (sid) => {
  return axios.get('/public/getChapcha', {
    params: {
      sid: sid
    }
  })
}

// 找回密码接口
const forget = (option) => {
  return axios.post('/forget', {
    ...option
  })
}

// 登入接口
const login = (option) => {
  return axios.post('/login/login', {
    ...option
  })
}

// 注册接口
const reg = (regInfo) => {
  return axios.post('/login/reg', {
    ...regInfo
  })
}

// 重置密码接口
const reset = (info) =>
  axios.post('/login/reset', {
    ...info
  })

export { getCode, forget, login, reg, reset }
