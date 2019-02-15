import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
// import 'element-ui/lib/theme-chalk/index.css'
// 引入全局控制css样式
import './assets/css/global.css'
// 引入需要的字体文件
import './assets/fonts/iconfont.css'
// 使用完整ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false
// 配置axios的baseURL也就是请求后会自动拼接上这一段地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 修改Vue的prototype使this.$http.xxx = this.axios.xxx
Vue.prototype.$http = axios
// 设置axios拦截器,在发送请求前携带必要的信息
axios.interceptors.request.use(function(config) {
  // 给axios通过拦截器设置Authorization的token信息，以便可以正常向服务器发起请求获得相关数据
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App)
})
