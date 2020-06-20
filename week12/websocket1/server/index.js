const WebSocket = require('ws')
// 定义全局人数量
// let num = 0;
// 多房间人数计数
let group = {}
const wss = new WebSocket.Server({port: 3000})
// 相当于onconnection
wss.on('connection', function connection (ws) {
  console.log('one client is connected');
  // 接收客户端的消息,相当于onmessage
  ws.on('message', function(msg){
    const msgObj = JSON.parse(msg);
    // 对每次的发送绑定客户端name属性
    if(msgObj.event === 'enter') {
      // 给ws添加name自定义属性，msgObj.name是前端send的
      ws.name = msgObj.name;
      // 前台发来的roomId房间号
      ws.roomId = msgObj.roomId
      // 当有人进入时候，人数+ 1
      // num = num + 1;
      if (typeof group[ws.roomId] === 'undefined') {
        group[ws.roomId] = 1;
      } else {
        group[ws.roomId] ++;
      }
    }
    // 主动发送消息给客户端
    // ws.send('server:'+ msg)
    // 广播消息,就是往所有客户端传递消息
    wss.clients.forEach((client) => {
      // 判断非自己的客户端，就是不要发给自己
      console.log(ws)
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
        client.send(JSON.stringify(msgObj))
      }
    })
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

