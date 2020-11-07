import axios from '@/utils/request'
import qs from 'qs'
import store from '@/store'

/**
 * 获取文章中的评论列表
*/
const getComments = (params) => {
  const token = store.state.token
  let headers = {}
  if(token !== ''){
    headers = {
      headers: {
        // 因为get接口是没有token 的，所以为了让handed的判断为1加上的
      'Authorization': 'Bearer ' + store.state.token
      }
      
    }
  }
  return axios.get('/public/comments?'+qs.stringify(params))
}

/**
 * 添加评论
*/
const addComment = (data) => axios.post('/comments/reply', {...data})

/**
 * 更新评论
*/
const updateComment = (data) => axios.post('/comments/update', { ...data })

/**
 * 采纳最佳评论
*/
const setCommentBest = (params) => axios.post('/comments/accept?' + qs.stringify(params))

/**
 * 设置点赞
*/
const setHands = (params) => axios.get('/comments/hands?' + qs.stringify(params))
export {
  getComments,
  addComment,
  updateComment,
  setCommentBest,
  setHands
}