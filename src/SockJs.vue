<template>
  <div id="app">

    <el-row type="flex" justify="center" :gutter="10">
      <el-button @click="connectWebSocket">连接websocket</el-button>
    </el-row>
    
    <el-row type="flex" justify="center" :gutter="6">
     <!--  <el-col :span="4"><el-input v-model="topicDest" placeholder="输入订阅地址: /topic/greetings"/></el-col> -->
      <el-col :span="2"><el-button @click="subscribeMessage">订阅公共消息</el-button></el-col>
    </el-row>


    <el-row type="flex" justify="center" :gutter="10">
      <el-col :span="5"><el-button @click="subscribeCategoriesMatches">订阅全部比赛列表</el-button></el-col>
      <el-row type="flex" justify="center" :gutter="5">
      <el-button  @click="categoriesMatchesCount">全部比赛列表</el-button>    
    </el-row>
    </el-row>

    <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="2"><el-button @click="subscribeFavouriteOperation">订阅我的最爱操作消息</el-button></el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="2"><el-button @click="subscribeFavouriteList">订阅我的最爱列表消息</el-button></el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="6">
      <el-col :span="4"><el-input v-model="inputMsg" placeholder="发送消息"/></el-col>
      <el-col :span="2"><el-button @click="sendMessage">发送消息</el-button></el-col>
    </el-row>

    
    <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="collectFavourite">收藏联赛</el-button>    
    </el-row>

    <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="removeFavourite">移除收藏</el-button>    
    </el-row>
    <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="favouriteList">收藏列表</el-button>    
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
        baseUrl: 'http://api.devbitgame.com/lottery',
        localBaseUrl: 'http://localhost:8080/lottery',
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA2OTYzNzEsImlhdCI6MTU5MDY1MzE3MSwidXNlcl9uYW1lIjoiNCIsImp0aSI6IjU1NDI5OWQ4LTVmZjQtNDY5Ny04OTljLWYxYTZlZjg3MDEzOSIsImNsaWVudF9pZCI6Ind3dyIsInNjb3BlIjpbInVpIl19.xIZYCmhWTE65UyQZtHnDJkp3q8j8u3hlL1Ci1kxaL3M'
      }
    },
    
    methods: {

        // websocket连接
        connectWebSocket() {

          if(this.stompClient == null || !this.stompClient.connected){
            let socket = new SockJS(this.baseUrl+'/ws-endpoint');
            this.stompClient = Stomp.over(socket);
            
            var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            };

            this.stompClient.connect({}, function (frame) {
              console.log('Connected: ' + frame)
              //this.subscribe()
            },headers);
          }

          

        },

        onTopicMessage(e) {
            let data = JSON.parse(e.body)
            console.log('得到响应', data)
        },

        // 订阅公共消息
        subscribeMessage(){

            this.stompClient.subscribe("/topic/greetings", function (e) {
              let data = JSON.parse(e.body)
              console.log('公共消息响应', data)

            });
        },

        subscribeCategoriesMatches(){
          let data = {'lang':'zh-Hans'}
            this.stompClient.subscribe("/topic/categories_matches_count", function (e) {
              let data = JSON.parse(e.body)
              console.log('全部比赛返回消息：', data)

            }, data);
        },

        subscribeFavouriteOperation(){

          var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            };

            this.stompClient.subscribe("/user/queue/favourite_leagues/operation", function (e) {
              let data = JSON.parse(e.body)
              console.log('我的最爱添加、移除消息返回：', data)

            }, headers);
        },

        subscribeFavouriteList(){
            var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            };

            this.stompClient.subscribe("/user/queue/favourite_leagues/list", function (e) {
              let data = JSON.parse(e.body)
              console.log('我的最爱列表消息返回：', data)

            }, headers);
        }, 

        // 取消订阅
        unSubscribeMessage(){
            this.topicSub.unsubscribe();
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
          var headers = {
              'client-id':'my-client-id',
              'Authorization': this.token
          };     
          this.stompClient.send("/app/user/favourite_leagues?lang=zh-Hans", headers, {});

        },
        categoriesMatchesCount(){
          let data = {'lang':'zh-Hans'}
          // var headers = {
          //     'client-id':'my-client-id',
          //     'Authorization': this.token
          // };
          this.stompClient.send("/topic/categories_matches_count", {}, JSON.stringify(data));

        },

        collectFavourite(){
          let data = {'categoryId': 205,'leagueId': 2}
          var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            }

          this.stompClient.send("/lottery/user/favourite_leagues/collect", headers, JSON.stringify(data));
        },

        removeFavourite(){
          var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            }

          this.stompClient.send("/lottery/user/favourite_leagues/1", headers);
        },

        favouriteList(){
          let data = {'lang':'zh-Hans'}
            var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            }

          this.stompClient.send("/lottery/user/favourite_leagues/list",headers, JSON.stringify(data))
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
