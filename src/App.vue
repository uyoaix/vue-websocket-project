<template>
  <div id="app">

    <el-row type="flex" justify="center" :gutter="10">
      <el-button @click="connectWebSocket">连接websocket</el-button>
    </el-row>
    <el-row type="flex" justify="center" :gutter="10">
      <el-button @click="closeWebSocket">断开websocket</el-button>
    </el-row>
    
    <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="4"><el-input v-model="inputMsg" placeholder="发送消息"/></el-col>
      <el-col :span="2"><el-button @click="sendMessage">发送消息</el-button></el-col>
    </el-row>
    


  </div>
</template>

<script>


  const heartCheck = {
    timeout: 60 * 1000,
    timer: null,
    serverTimer: null,
    reset() {
      this.timer && clearTimeout(this.timer)
      this.serverTimer && clearTimeout(this.serverTimer)
    },
    start(ws) {
      this.reset()
      this.timer = setTimeout(() => {
        // console.log('发送心跳,后端收到后，返回一个心跳消息')
        // onmessage拿到返回的心跳就说明连接正常
        let data = { type: 'HEARTBEAT' , msg: "PING" }
        ws.send(JSON.stringify(data))
        this.serverTimer = setTimeout(() => {
          // 如果超过一定时间还没响应(响应后触发重置)，说明后端断开了
          ws.close()
        }, this.timeout)
      }, this.timeout)
    }
  }

  export default {
    name: 'Websocket',
    data() {

      return {

        wsuri: 'ws://127.0.0.1:8080/lottery/public', // ws wss
        lockReconnect: false, // 连接失败不进行重连
        maxReconnect: 5, // 最大重连次数，若连接失败
        socket: null,
        inputMsg: null
      }
    },
    mounted() {
      //this.initWebSocket()
    },
    methods: {

        // websocket连接
        connectWebSocket() {

          try {
            if ('WebSocket' in window) {
              this.socket = new WebSocket(this.wsuri)
            } else {
              console.log('您的浏览器不支持websocket')
            }

          } catch (e) {
            console.log(e)
            this.reconnect()
          }

          this.socket.onopen = this.websocketonopen
          this.socket.onerror = this.websocketonerror
          this.socket.onmessage = this.websocketonmessage
          this.socket.onclose = this.websocketclose

        },
        // 发送消息
        sendMessage(){
          let data = { type: 'TEAM' , msg: this.inputMsg }
          this.socket.send(JSON.stringify(data))
          //this.socket.send(msg);
        },
        // 关闭websocket
        closeWebSocket() {
          console.log('关闭连接')
          this.socket.close();
        },

      // 重连
      reconnect() {
        console.log('尝试重连')
        if (this.lockReconnect || this.maxReconnect <= 0) {
          return
        }
        setTimeout(() => {
          // this.maxReconnect-- // 不做限制 连不上一直重连
          this.connectWebSocket()
        }, 30 * 1000)
      },
      websocketonopen() {
        console.log('WebSocket连接成功', this.socket.readyState)
        heartCheck.start(this.socket)
        // this.socket.send('发送数据')
      },
      websocketonerror(e) {
        console.log('WebSocket连接发生错误', e)
        this.reconnect()
      },
      websocketonmessage(e) {
        // console.log(e)
        let data = JSON.parse(e.data)
        console.log('得到响应', data)
        console.log('可以渲染网页数据...')
        // 消息获取成功，重置心跳
        heartCheck.start(this.socket)
      },
      websocketclose(e) {
        console.log('connection closed (' + e.code + ')')
        //this.reconnect()
      }
      // websocketsend() {
      //   let data = { id: 'a1b2c3' }
      //   this.socket.send(JSON.stringify(data))
      // }
    },
    destroyed() {
      this.socket.close()
    }
  }


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
