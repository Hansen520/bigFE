import axios from '@/libs/request'
import { getToken } from '../libs/util'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}
// 获取token
export const getUserInfo = () => {
  return axios.get('/public/info', {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}
