import axios from 'axios'
// import store from '@/store'
import publicConfig from '@/config'
import errorHandle from './errorHandle'
import { getToken } from './util'
// import { Spin } from 'view-design'

const CancelToken = axios.CancelToken
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger'))
//     store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.pending = {}
  }
  // 获取axios的基本配置
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-type': 'application/json;charrset=utf-8'
      },
      timeout: 10000
    }
    return config
  }
  // destroy (url) {
  //   delete this.queue[url]
  //   if (!Object.keys(this.queue).length) {
  //     // Spin.hide()
  //   }
  // }
  // 取消重复的请求(这里有待理解)
  removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('取消重复请求')
    }
    delete this.pending[key]
  }
  // 设定拦截器
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      let isPublic = false
      publicConfig.publicPath.map((path) => {
        isPublic = isPublic || path.test(config.url)
      })
      // const token = store.state.token
      const token = getToken()
      if (!isPublic && token) {
        config.headers.Authorization = 'Bearer ' + token
      }
      const key = config.url + '&' + config.method
      this.removePending(key, true)
      config.cancelToken = new CancelToken((c) => {
        this.pending[key] = c
      })
      // if (!Object.keys(this.queue).length) {
      //   // Spin.show() // 不建议开启，因为界面不友好
      // }
      // this.queue[url] = true
      return config
    }, error => {
      errorHandle(error)
      return Promise.reject(error)
    })
    // 响应拦截器
    instance.interceptors.response.use(res => {
      const key = res.config.url + '&' + res.config.method
      this.removePending(key)
      if (res.status === 200) {
        return Promise.resolve(res.data)
      } else {
        return Promise.reject(res)
      }
      // this.destroy(url)
      // const { data, status } = res
      // return { data, status }
    }, error => {
      errorHandle(error)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    // options = Object.assign(this.getInsideConfig(), options)
    // this.interceptors(instance, options.url)
    // return instance(options)
    const newOptions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)
    return instance(newOptions)
  }

  // get请求
  get (url, config) {
    const options = Object.assign(
      {
        method: 'get',
        url: url
      },
      config
    )
    return this.request(options)
  }
  // post请求
  post (url, data) {
    return this.request({
      method: 'post',
      url: url,
      data: data
    })
  }
}
export default HttpRequest
