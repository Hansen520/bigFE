import axios from '@/libs/request'
import qs from 'qs'

// 获取用户列表
const getUserList = (params) => {
  return axios.get('/admin/users?' + qs.stringify(params))
}

// 更新用户信息
const updateUserById = (data) => axios.post('/admin/update-user', data)

// 删除用户
// const deleteUserById = (id) => axios.get('/admin/delete-user?id=' + id)

// 检查用户名字
const checkUsername = (username) => axios.get('/admin/checkname?username=' + username)

// 新增用户
const addUser = (data) => axios.post('/admin/add-user', data)

// 批量删除用户功能, 传递的是要删除的数组对象
const deleteUserById = (ids) => axios.post('/admin/delete-user', { ids })

// 设置用户权限(角色，vip的设置)
const updateUserBatchById = (data) => axios.post('/admin/update-user-settings', data)

export {
  getUserList,
  updateUserById,
  deleteUserById,
  checkUsername,
  addUser,
  updateUserBatchById
}
