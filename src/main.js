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
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App)
})
