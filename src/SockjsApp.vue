<template>
  <div id="app">

    <el-row type="flex" justify="center" :gutter="10">
      <el-button @click="connectWebSocket">连接websocket</el-button>
    </el-row>
    
   <!--  <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="4"><el-input v-model="topicDest" placeholder="输入订阅地址: /topic/greetings"/></el-col>
      <el-col :span="2"><el-button @click="subscribeMessage">订阅公共消息</el-button></el-col>
    </el-row> -->


    <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="4"><el-input v-model="userTopicDest" placeholder="输入订阅地址: /user/topic/greetings"/></el-col>
      <el-col :span="2"><el-button @click="subscribeUserMessage">订阅点对点消息</el-button></el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="4"><el-input v-model="loginUserTopicDest" placeholder="输入订阅地址: /user/topic/greetings"/></el-col>
      <el-col :span="2"><el-button @click="subscribeLoginUserMessage">订阅登录用户点对点消息</el-button></el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="unSubscribeMessage">取消点对点消息订阅</el-button>    
    </el-row>

    <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="4"><el-input v-model="inputMsg" placeholder="发送消息"/></el-col>
      <el-col :span="2"><el-button @click="sendMessage">发送消息</el-button></el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="favouriteLeagues">我的最爱</el-button>    
    </el-row>
    <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="teamInfo">队伍信息</el-button>    
    </el-row>
    <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="userInfo">用户信息</el-button>    
    </el-row>
    
    <el-row type="flex" justify="center" :gutter="10">
      <el-button @click="closeWebSocket">断开websocket</el-button>
    </el-row>

  </div>
</template>




<script>


  // const heartCheck = {
  //   timeout: 60 * 1000,
  //   timer: null,
  //   serverTimer: null,
  //   reset() {
  //     this.timer && clearTimeout(this.timer)
  //     this.serverTimer && clearTimeout(this.serverTimer)
  //   },
  //   start(ws) {
  //     this.reset()
  //     this.timer = setTimeout(() => {
  //       // console.log('发送心跳,后端收到后，返回一个心跳消息')
  //       // onmessage拿到返回的心跳就说明连接正常
  //       let data = { type: 'HEARTBEAT' , msg: "PING" }
  //       ws.send(JSON.stringify(data))
  //       this.serverTimer = setTimeout(() => {
  //         // 如果超过一定时间还没响应(响应后触发重置)，说明后端断开了
  //         ws.close()
  //       }, this.timeout)
  //     }, this.timeout)
  //   }
  // }

// 安装并引入相关模块
import SockJS from 'sockjs-client';  
import  Stomp from 'stompjs';

export default {
  name: 'Websocket',
  data() {

    return {
        lockReconnect: false, // 连接失败不进行重连
        maxReconnect: 5, // 最大重连次数，若连接失败
        stompClient: null,
        topicDest:'',
        userTopicDest: '',
        loginUserTopicDest: '',
        topicSub: '', // 订阅对象
        inputMsg: '',
        baseUrl: 'http://172.16.0.147:8080/lottery',
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODk4MTY4MzIsImlhdCI6MTU4OTc3MzYzMiwidXNlcl9uYW1lIjoiMTAwMDAwMDQ4IiwianRpIjoiMWFmZTM4MmEtYTJmYy00MTMwLWE3OTMtYmVhNGIyNjY5NGFmIiwiY2xpZW50X2lkIjoid3d3Iiwic2NvcGUiOlsidWkiXX0.fQu5YINvWzNPEACKdRWx1ztZDiVrhYMf0imWowmv-zc'
      }
    },
    
    methods: {

        // websocket连接
        connectWebSocket() {


          if(this.stompClient == null || !this.stompClient.connected){
            console.log(JSON.parse(this.stompClient))
            let socket = new SockJS(this.baseUrl+'/ws-endpoint')
            this.stompClient = Stomp.over(socket)
            
            // var headers = {
            //     'client-id':'my-client-id',
            //     'Authorization': this.token
            // };

            this.stompClient.connect({}, connectCallback(frame), errorCallback);

          }

          

        },
        // 连接成功回调
        connectCallback(frame){
          console.log('Connected: ' + frame)

          // 订阅公共消息
          this.stompClient.subscribe("/topic/greetings", function(e){
            let data = JSON.parse(e.body)
            console.log('【/topic/greetings】公共消息响应', data)
          })

          // 订阅未登录点对点消息
          this.stompClient.subscribe("/user/queue/greetings", function(e){
            let data = JSON.parse(e.body)
            console.log('【/queue/greetings】未登录点对点消息响应', data)
          })

        },


        // 登录用户订阅点对点消息
        subscribeLoginUserMessage(){

          var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            };

            this.stompClient.subscribe(this.loginUserTopicDest, function (e) {
              let data = JSON.parse(e.body)
              console.log('登录用户点对点消息响应', data)

            }, headers);
        },
        // 发送消息
        sendMessage(){
          let data = {msg: this.inputMsg }
          // var headers = {
          //     'client-id':'my-client-id',
          //     'Authorization': this.token
          // };
          this.stompClient.send("/app/greeting", {}, JSON.stringify(data));
          
        },
        favouriteLeagues(){
          // var headers = {
          //     'client-id':'my-client-id',
          //     'Authorization': this.token
          // };     
          this.stompClient.send("/app/user/favourite_leagues?lang=zh-Hans", {}, {});

        },
        teamInfo(){
          let data = {}
          
          this.stompClient.send("/app/teams/info/1", {}, JSON.stringify(data));

        },
        userInfo(){
          let data = {}
          var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            }

          this.stompClient.send("/app/user/info", headers, JSON.stringify(data));
        },

        // 关闭websocket
        closeWebSocket() {
          if (this.stompClient.connected) {
            this.stompClient.disconnect();
          }
          console.log("Disconnected");

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
      }
    }
    // ,
    // destroyed() {
    //   this.stompClient.disconnect();
    // }
  }


</script>
