import Vue from 'vue'
import Router from 'vue-router'
// 导入需要的组件
import Login from '@/components/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/Welcome'
import UserList from '@/components/users/UserList'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Cat from '@/components/cat/Cat'
import Params from '@/components/params/Params'
import Goods from '@/components/goods/Goods'
import GoodsAdd from '@/components/goods/GoodsAdd'
import Report from '@/components/report/Report'
import Order from '@/components/order/Order'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // 为组件注册对应的路由
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/Welcome',
      children: [
        { path: '/Welcome', component: Welcome },
        { path: '/users', component: UserList },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cat },
        { path: '/params', component: Params },
        { path: '/goods', component: Goods },
        { path: '/goodsadd', component: GoodsAdd },
        { path: '/reports', component: Report },
        { path: '/orders', component: Order }
      ]
    }
  ]
})

// 路由导航守卫,在所有路由请求开始时拦截
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 获取sessionstorage中的token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有说明没有登录,则跳回登录页面
  if (!tokenStr) {
    // return this.a.push('/login')
    return next('/login')
  }
  // 登陆了则放行
  next()
})

export default router
