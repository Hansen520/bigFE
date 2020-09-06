import axios from '@/utils/request'

// 获取验证码，sid为唯一标识
const getCode = (sid) => {
  console.log(sid)
  return axios.get('/public/getChapcha', {
    params: {
      sid: sid
    }
  })
}
// 找回密码，option为用户信息
const forget = (option) => {
  return axios.post('/login/forget', {
    ...option
  })
}
// 登入接口， loginInfo为登入信息
const login = (loginInfo) => {
  return axios.post('/login/login', {
    ...loginInfo
  })
}

// 注册接口, regInfo为注册信息
const reg = (regInfo) => {
  return axios.post('/login/reg', {
    ...regInfo
  })
}

export { forget, getCode, login, reg }
