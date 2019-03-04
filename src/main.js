import Vue from 'vue'
import App from './App'
import router from './router'
// import ElementUI from 'element-ui'
import axios from 'axios'
// 给当前项目引入tree型的树状表格
import ZKTable from 'vue-table-with-tree-grid'
// import 'element-ui/lib/theme-chalk/index.css'
// 导入nprogress的js包和css样式
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// import lodash from 'lodash'
// 引入全局控制css样式
import './assets/css/global.css'
// 引入需要的字体文件
import './assets/fonts/iconfont.css'
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message,
  Carousel,
  CarouselItem
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
// 导入vue-moment更改时间格式
Vue.use(require('vue-moment'))
// 使用完整ElementUI
// Vue.use(ElementUI)
// 使用树状表格
Vue.use(ZKTable)
Vue.component('zk-table', ZKTable)
// 阻止启动生产消息
Vue.config.productionTip = false
// 配置axios的baseURL也就是请求后会自动拼接上这一段地址
axios.defaults.baseURL = 'http://127.0.0.1:8765/api/private/v1/'
// 修改Vue的prototype使this.$http.xxx = this.axios.xxx
Vue.prototype.$http = axios
// 设置axios拦截器,在发送请求前携带必要的信息
axios.interceptors.request.use(function(config) {
  // 给axios通过拦截器设置Authorization的token信息，以便可以正常向服务器发起请求获得相关数据
  // 配置的信息以请求头的方式存在
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 设置nprogress进度条效果
  NProgress.start()
  return config
})
// 设置axios响应拦截器,设置进度条效果
axios.interceptors.response.use(function(response) {
  // 设置nprogress进度条效果
  NProgress.done()
  return response
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App)
})
