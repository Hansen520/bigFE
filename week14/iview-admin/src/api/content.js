import axios from '@/libs/request'
import qs from 'qs'

// 前台获取文章列表接口
const getList = (options) => {
  return axios.get('/public/list?' + qs.stringify(options))
}

// 删除文章
// const deletePostById = (id) => {
//   return axios.get('/content/delete?tid=' + id)
// }
const deletePostById = (ids) => {
  return axios.post('/content/delete-post', { ids })
}

// 更新文章信息
const updatePostById = (data) => {
  return axios.post('/content/update-id', data)
}

/**
 * 下面是内容管理-标签管理的部分
*/
const getTags = (options) => {
  return axios.get('/admin/get-tags?' + qs.stringify(options))
}
const addTag = (data) => {
  return axios.post('/admin/add-tag', data)
}
const removeTag = (id) => {
  return axios.get('/admin/remove-tag?ptid=' + id)
}
const updateTag = (data) => {
  return axios.post('/admin/edit-tag?', data)
}
// 对后台文章做批量设置
const updatePostBatchById = (data) => {
  return axios.post('/content/update-post-settings', data)
}

export {
  getList,
  deletePostById,
  updatePostById,
  getTags,
  addTag,
  removeTag,
  updateTag,
  updatePostBatchById
}
