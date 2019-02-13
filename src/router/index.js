import Vue from 'vue'
import Router from 'vue-router'
// 导入需要的组件
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  // 为组件注册对应的路由
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

// 路由导航守卫,在所有路由请求开始时拦截
router.beforeEach((to, from, next) => {
  console.log(this)
  if (to.path === '/login') {
    return next()
  }
  // 获取sessionstorage中的token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有说明没有登录,则跳回登录页面
  if (!tokenStr) {
    return this.a.push('/login')
  }
  // 登陆了则放行
  next()
})

export default router
