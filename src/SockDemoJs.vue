<template>
  <div id="app">

    <el-row type="flex" justify="center" :gutter="10">
      <el-button @click="connectWebSocket">Connect websocket</el-button>
    </el-row>
    
    <el-row type="flex" justify="center" :gutter="20">
      <el-col :span="10"><el-button @click="subscribeMessage">Subscribe public message</el-button></el-col>
      <el-row type="flex" justify="right" :gutter="10">
      <el-col :span="10"><el-input v-model="inputMsg" placeholder="send message"/></el-col>
      <el-col :span="5"><el-button @click="sendMessage">send message</el-button></el-col>
    </el-row>
    </el-row>


    <el-row type="flex" justify="center" :gutter="20">
      <el-col :span="10" justify="left"><el-button @click="subscribeUserMessage">Subscribe no login user queue</el-button></el-col>
      <el-row type="flex" justify="right" :gutter="5">
      <el-button  @click="sayHelloToAnonymous">sayHelloToAnonymous</el-button>    
    </el-row>
    </el-row>

    <el-row type="flex" justify="center" :gutter="20">
  
      <el-col :span="10" justify="left"><el-button @click="subscribeLoginUserMessage">Subscribe login user queue</el-button></el-col>
      <el-row type="flex" justify="center" :gutter="10">
      <el-button  @click="userInfo">Userinfo</el-button>    
    </el-row>
    </el-row>


  
    <el-row type="flex" justify="center" :gutter="20">
      <el-button justify="left" @click="testSubscribeMessage">testSubscribeMessage</el-button>    
    </el-row>
    
    
    <el-row type="flex" justify="center" :gutter="20">
      <el-button justify="left" @click="closeWebSocket">Disconnect websocket</el-button>
    </el-row>

  </div>
</template>




<script>
  

import SockJS from 'sockjs-client';  
import  Stomp from 'stompjs';

export default {
  name: 'Websocket',
  data() {

    return {
        lockReconnect: false, 
        maxReconnect: 5, 
        stompClient: null,
        topicDest:'',
        userTopicDest: '',
        loginUserTopicDest: '',
        topicSub: '', 
        inputMsg: '',
        baseUrl: 'http://127.0.0.1:8082',
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTExNzIwMTUsInVzZXJfbmFtZSI6IjEiLCJqdGkiOiI4Y2JlNjBlMi05NjI0LTQ1YmQtOWJjZS0wZjk5ZDRkNGViNmUiLCJjbGllbnRfaWQiOiJ0ZXN0LWNsaWVudC1pZCIsInNjb3BlIjpbImFsbCJdfQ.jNWNuw3EXlm8nFPnmoJEZ0aWmpxfBM9j_CI-Pw2Ds64'
      }
    },
    
    methods: {

        connectWebSocket() {

          if(this.stompClient == null || !this.stompClient.connected){
            let socket = new SockJS(this.baseUrl+'/sockJs');
            this.stompClient = Stomp.over(socket);
            
            // var headers = {
            //     'client-id':'my-client-id',
            //     'Authorization': this.token
            // };

            this.stompClient.connect({}, function (frame) {
              console.log('Connected: ' + frame)
              //this.subscribe()
            });
          }

          

        },

        onTopicMessage(e) {
            let data = JSON.parse(e.body)
            console.log('get response', data)
        },

        subscribeMessage(){

            this.stompClient.subscribe("/topic/greetings", function (e) {
              let data = JSON.parse(e.body)
              console.log('public message response', data)

            });
        },

        subscribeUserMessage(){

            this.stompClient.subscribe("/user/queue/sayHello", function (e) {
              let data = JSON.parse(e.body)
              console.log('p2p message respnse', data)

            });
        },

        subscribeLoginUserMessage(){

          var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            };

            this.stompClient.subscribe("/user/queue/userInfo", function (e) {
              let data = JSON.parse(e.body)
              console.log('login user p2p message response', data)

            }, headers);
        },

        testSubscribeMessage(){

          

            this.stompClient.subscribe("/user/testSubscribeMessage", function (e) {
              let data = JSON.parse(e.body)
              console.log('login user p2p message response', data)

            });
        },

        unSubscribeMessage(){
            this.topicSub.unsubscribe();
        },

        sendMessage(){
          let data = {msg: this.inputMsg }
          // var headers = {
          //     'client-id':'my-client-id',
          //     'Authorization': this.token
          // };
          this.stompClient.send("/app/greeting", {}, JSON.stringify(data));
          
        },


        
        
        sayHelloToAnonymous(){
          let data = {}
          // var headers = {
          //     'client-id':'my-client-id',
          //     'Authorization': this.token
          // };
          this.stompClient.send("/app/user/sayHello", {}, JSON.stringify(data));

        },
        userInfo(){
          let data = {}
          var headers = {
                'client-id':'my-client-id',
                'Authorization': this.token
            }

          this.stompClient.send("/app/user/info", headers, JSON.stringify(data));
        },

        closeWebSocket() {
          if (this.stompClient.connected) {
            this.stompClient.disconnect();
          }
          console.log("Disconnected");

        },

      reconnect() {
        if (this.lockReconnect || this.maxReconnect <= 0) {
          return
        }
        setTimeout(() => {
          this.connectWebSocket()
        }, 30 * 1000)
      }
    }
    
  }


</script>
