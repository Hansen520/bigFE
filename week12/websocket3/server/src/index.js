const WebSocket = require('ws')
// 间隔多长时间发送心跳请求
const timeInterval = 30000

const { getValue, setValue, existKey } = require('./config/RedisConfig')
// 定义全局人数量
// let num = 0;
// 多房间人数计数
let group = {}

// const run = async () => {
//   setValue('imooc', '你好')
//   const result = await getValue('imooc')
//   console.log(result)
// }
// run()

const prefix = 'imooc-'
const wss = new WebSocket.Server({port: 3000})

// const server = http.createServer()
// 用来解析前端发来的数据
// const jwt = require('jsonwebtoken')



// 相当于onconnection
wss.on('connection', function connection (ws) {
  // 初始的心跳连接状态
  ws.isAlive = true

  console.log('one client is connected');
  // 接收客户端的消息,相当于onmessage
  // console.log(wss.clients)
  ws.on('message', async function(msg){
    const msgObj = JSON.parse(msg);
    const roomid = prefix + (msgObj.roomId ? msgObj.roomId : ws.roomId)
    // 对每次的发送绑定客户端name属性
    if(msgObj.event === 'enter') {
      // 给ws添加name自定义属性，msgObj.name是前端send的
      ws.name = msgObj.name;
      // 前台发来的roomId房间号
      ws.roomId = msgObj.roomId;
      ws.uid = msgObj.uid
      // 判断redis里是否有对应的roomid的键值
      const result = await existKey(roomid)
      // 如果没有键值
      if(result === 0){
        // 初始化一个房间数据
        setValue(roomid, ws.uid)
      } else {
        // 已经存在该房间
        const arrStr = await getValue(roomid)
        let arr = arrStr.split(',')
        if(arr.indexOf(ws.uid) === -1){
          // 那么后续用户输入同一个房间则进入同一家(再加一个用户)
          setValue(roomid, arrStr + ',' + ws.uid)
        }
      }
      if (typeof group[ws.roomId] === 'undefined') {
        group[ws.roomId] = 1;
      } else {
        group[ws.roomId] ++;
      }
    }

    // 心跳检测,来自客服端的发送
    // if (msgObj.event === 'heartbeatToServer' && msgObj.message === 'pong') {
    //   ws.isAlive = true
    //   return
    // }

    // 鉴权*
    // if (msgObj.event === 'auth') {
    //   jwt.verify(msgObj.message, 'secret', (err, decode) => {
    //     if (err) {
    //       // 发送鉴权失败的提示
    //       ws.send(JSON.stringify({
    //         event: 'noauth',
    //         message: 'please auth again'
    //       }))
    //       // websocket返回前台鉴权失败消息
    //       console.log('auth error')
    //       return
    //     } else {
    //       // 鉴权通过
    //       console.log(decode);
    //       ws.isAuth = true
    //       return
    //     }
    //   })
    //   return
    // }
    // // 拦截非鉴权的请求
    // if (!ws.isAuth) {
    //   return
    // }
    // 主动发送消息给客户端
    // ws.send('server:'+ msg)
    // 广播消息,就是往所有客户端传递消息
    const arrStr = await getValue(roomid)
    let users = arrStr.split(',')
    console.log(users)
    wss.clients.forEach( async (client) => {
      // 判断非自己的客户端，就是不要发给自己
      // console.log(ws, ':', client);
      // ws !== client && //避免自己给自己发消息，就是客户端不一样时候
      // client当前客户端传过来的roomId与前端send过来的roomId如果一样才执行下面语句
      if(client.readyState === WebSocket.OPEN && client.roomId === ws.roomId){
        // 返回客户端name
        // console.log(WebSocket.OPEN)// 为后端状态码1
        msgObj.clientName = ws.name;
        // 获取在线人数
        // msgObj.num = wss.clients.size;
        // msgObj.num = num;// 这样子就可以直接返回前端num，不用上面这一条了
        msgObj.num = group[ws.roomId];
        client.send(JSON.stringify(msgObj));

        // 缓存代码开始
        // 排队已经发送了消息返回了客户端->在线
        if(users.indexOf(client.uid !== -1)){
          users.splice(users.indexOf(client.uid), 1)
        }
        // 消息缓存信息：去redis中的读取uid数据
        let result = await existKey(ws.uid)
        if(result !== 0){
          // 存在未发送的离线消息数据
          let tmpArr = await getValue(ws.uid)
          let tmpObj = JSON.parse(tmpArr)
          let uid = ws.uid
          if(tmpObj.length > 0){
            let i = []
            // 遍历该用户的离线缓存数据
            // 判断用户的房间id是否与当前一致
            tmpObj.forEach((item) => {
              if(item.roomId === client.roomId && uid === client.uid){
                // 消息展示给前端
                client.send(JSON.stringify(item))
                i.push(item)
              }
            })
            // 删除已经发送的缓存消息的数据(就是离线用户登入后已经看到这条消息了)
            if(i.length > 0){
              i.forEach((item)=>{
                // 一条条删
                tmpObj.splice(item, 1)
              })
            }
            // 否则存入缓存数据
            // setValue(ws.uid, JSON.stringify(tmpObj))
          }
        }
      }
    })
    // 断开了与服务端连接的用户的id，并且其他的客户端发送了消息
    if(users.length > 0 && msgObj.event === 'message'){
      users.forEach(async function(item){
        const result = await existKey(item)
        if(result !== 0){
          // 说明已经存在其他房间该用户的离线消息数据
          // 就是该用户退出后的房间里面的离线数据
          let userData = await getValue(item)
          let msgs = JSON.parse(userData)
          msgs.push({
            roomId: ws.roomId,
            ...msgObj
          })
          setValue(item, JSON.stringify(msgs))
        }else{
          // 说明先前这个用户一直在线，并且无离线消息数据
          setValue(item, JSON.stringify([{
            roomId: ws.roomId,
            ...msgObj
          }]))
        }
      })
    }
  })

  // 当ws客户端断开链接的时候
  ws.on('close', function(){
    // 如果是一个特定用户
    if(ws.name){
      // num = num - 1;
      group[ws.roomId] --;
    }
    let msgObj = {}
    // 广播消息,就是往所有客户端传递消息
    wss.clients.forEach((client) => {
      // 判断非自己的客户端，就是不要发给自己
      // ws !== client && //避免自己给自己发消息，就是客户端不一样时候
      if(client.readyState === WebSocket.OPEN && client.roomId === ws.roomId){
        // 返回客户端name
        msgObj.clientName = ws.name;
        // 获取在线人数
        msgObj.event = 'out';
        // msgObj.num = num;// 这样子就可以直接返回前端num，不用上面这一条了
        msgObj.num = group[ws.roomId];
        client.send(JSON.stringify(msgObj))
      }
    })
  })
})

// 鉴权相关
// server.on('upgrade', function upgrade(request, socket, head) {
//   console.log('TCL', request.headers)
//   // This function is not defined on purpose. Implement it with your own logic.
//   // authenticate(request, (err, client) => {
//   //   if (err || !client) {
//   //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//   //     socket.destroy();
//   //     return;
//   //   }
 
//     wss.handleUpgrade(request, socket, head, function done(ws) {
//       wss.emit('connection', ws, request);
//     });
//   // });
// });
 
// server.listen(3000);

// 心跳检测，就是定时发送请求(这里用不到吧)
// setInterval(() => {
//   // 对每个客户端都操作
//   wss.clients.forEach((ws) => {
//     // 无心跳 并且有房间号
//     if (!ws.isAlive && ws.roomId) {
//       // 当且仅当有一个房间离线就减1
//       group[ws.roomId] --
//       delete ws[roomId]
//       // 服务端连接异常时候终止掉,用close是只关闭本窗体,而用terminate是关闭整个程序,包括所有窗体.
//       return ws.terminate()
//     }
//     // 主动发送心跳检测请求
//     ws.isAlive = false
//     // 发送给客户端ping
//     ws.send(JSON.stringify({
//       event: 'heartbeatToClient',
//       message: 'ping',
//       num: group[ws.roomId]
//     }))
//   })
// }, timeInterval)