// import axios from 'axios'
// import axios from '@/utils/axios'
import axios from '@/utils/request'

// axios.request({
// method: 'get',
// url: '/get'
// })
const getCode = () => {
  return axios.get('/getCaptcha')
}
// 封装axios后使用
const forget = (option) => {
  return axios.post('/forget', {
    ...option
  })
}

// const forget = async (option) => {
//   let result = ''
//   try {
//     result = await axios.post('/forget', {
//       ...option
//     })
//     if (result.status === 200) {
//       return result.data
//     }
//   } catch (e) {
//     console.log(e)
//   }
//   return result
// }

export { forget, getCode }
