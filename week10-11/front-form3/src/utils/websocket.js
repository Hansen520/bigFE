import store from '@/store'

class WebsocketClient {
  constructor (config = {}){
    const defaultConfig = {
      url: 'localhost',
      port: '3001',
      protocol: 'ws',
      timeInterval: 5 * 1000// 断线重连时间
    }
    const finalConfig = { ...defaultConfig, ...config }
    this.ws = {}
    this.port = finalConfig.port
    this.url = finalConfig.url
    this.protocol = finalConfig.protocol,
    this.handle = null
    this.timeInterval = finalConfig.timeInterval
  }

  init(){
    this.ws = new WebSocket(`${this.protocol}://${this.url}:${this.port}`)
    // 考虑作用域，所有采用箭头函数
    this.ws.onopen = () => this.onOpen()
    this.ws.onmessage = (msg) => this.onMessage(msg)
    this.ws.onclose = () => this.onClose()
    this.ws.onerror = () => this.onError()
  }

  send(msg){
    this.ws.send(msg)
  }

  onOpen(){
    this.send(JSON.stringify({
      event: 'auth',
      message: `Bearer `+ store.state.token
    }))
  }

  onMessage(event){
    // 当用户进入聊天室则不接收消息
    if(this.isShow){
      return
    }
    // 接收服务器发送过来的消息
    var obj = JSON.parse(event.data)
    switch(obj.event){
      case 'noauth':
        // 鉴权失败
        // 路由跳转到 /login 重新获取token
        break;
      case 'heartbeat':
        // 因为心跳是一直都在的,只要有心跳在就可以在里面写断线重连的逻辑
        this.checkServer()
        this.ws.send(JSON.stringify({
          event: 'heartbeat',
          message: 'pong'
        }))
        break;
      default:
        // 进行数据的存储(这个忙来的太及时了)
        // message({ commit }, msg)
        store.dispatch(obj.event, obj)
    }
  }
  onClose(){
    // 当连接主动断开时触发close事件
    console.log('close:' + this.ws.readyState)
    console.log('已关闭websocket')
    this.ws.close()
  }
  onError(){
    // 当连接失败时候，触发error事件
    console.log('error:' + this.ws.readyState)
    console.log('websocket连接失败！')
    setTimeout(() => {
      this.init()
    }, 1000)
  }

  // 断线重连
  checkServer(){
    clearTimeout(this.handle)
    this.handle = setTimeout(() => {
      this.onClose()
      this.onError()
      // 设置1ms的时延，调试在服务器测未及时响应时，客户端的反应
    }, this.timeInterval + 1000);
  }
}

export default WebsocketClient