<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../../assets/img/logo.png" alt>
        <span @click="gohome">后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">注销</el-button>
    </el-header>
    <el-container>
      <!-- :collapse代表左侧菜单收起或者展开 -->
      <!-- unique-opened是否只保持一个子菜单的展开 -->
      <!-- item.id+''  把数字隐式转为字符串类型 -->
      <!-- router是否使用 vue-router 的模式启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
      <!-- :collapse-transition代表左侧菜单收起展开是否有动画 -->
      <el-aside :width="menushow?'65px':'200px'">
        <el-menu
          :collapse="menushow?true:false"
          :collapse-transition="false"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :router="true"
          :style="menushow?'65px':'200px'"
        >
          <!-- 点击该图标控制导航栏收缩 -->
          <div
            class="toggle_bar"
            @click="menushow=!menushow"
            :style="menushow?'width:65px':'width:200px'"
          >|||</div>
          <el-submenu
            :index="item.id+''"
            :style="menushow ? 'width:65px':'width:200px'"
            v-for="(item,index) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont'+' '+iconList[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="'/'+item.path">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 数据列表
      menuList: [],
      // 图标列表
      iconList: [
        'icon-users',
        'icon-tijikongjian',
        'icon-shangpin',
        'icon-danju',
        'icon-baobiao'
      ],
      // 控制左侧导航栏是否显示
      menushow: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 回到首页
    gohome() {
      this.$router.push('/home')
    },
    // 退出登录
    logout() {
      // 提示确认是否退出防止误触
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 确认退出
        .then(() => {
          // 销毁token
          window.sessionStorage.removeItem('token')
          // 跳转到登录页面
          this.$router.push('/login')
        })
    },
    // 获取左侧列表数据
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        this.$message.error({
          message: '获取左侧列表数据失败啦!',
          type: 'error',
          duration: '1000'
        })
      }
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    padding-right: 20px;
    #logo-box {
      display: flex;
      color: white;
      font-size: 22px;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle_bar {
      height: 25px;
      background-color: rgb(74, 80, 100);
      text-align: center;
      letter-spacing: 0.1em;
      color: #fff;
      font-size: 12px;
      line-height: 25px;
      user-select: none;
      cursor: pointer;
    }
  }
}
</style>
