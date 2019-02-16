<template>
  <div id="login-container">
    <div id="login-box">
      <div id="login-logo">
        <img src="../assets/img/下载.jpg" alt>
      </div>
      <!-- element-ui表单控件 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm">
        <el-form-item prop="username">
          <el-input autofocus @keyup.enter.native="login" v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :offset="15">
            <el-button @click="login" type="primary">登录</el-button>
            <el-button @click="resetForm" type="info">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 定义需要使用的数据
      // loginForm 收集登录表单的全部表单域信息
      // 方便开发,默认写上用户们密码
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 定义表单域的验证
      loginFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '密码最少6位'
          },
          {
            max: 16,
            message: '密码最多16位'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      // 通过$refs获取表单元素，调用validate方法进行验证
      // 没有问题valid返回true,有问题则返回false
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          // 这里的loginForm是一个对象里面是key:value
          const { data: res } = await this.$http.post('login', this.loginForm)
          // 如果请求失败则弹出信息框
          if (res.meta.status !== 200) {
            // 错误则重置表单并弹出错误信息
            this.resetForm()
            return this.$message({
              message: '用户名或密码错误!',
              type: 'error',
              duration: 1000
            })
          }
          // 请求成功则本地存储token,这是一个标识，代表登录成功
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
        return false
      })
    },
    resetForm() {
      // 重置Form表单,调用resetFields方法
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: rgb(32, 88, 145);
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 6px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #login-logo {
      width: 130px;
      height: 130px;
      border: 2px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      margin-left: -65px;
      margin-top: -65px;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 20px;
      box-sizing: border-box;
      i {
        font-size: 20px;
      }
    }
  }
}
</style>
