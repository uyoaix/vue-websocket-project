import Vue from 'vue'
//import App from './App.vue'
import App from './SockDemoJs.vue'
import './plugins/element.js'
import { Button, Input } from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Input.name, Input);


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
