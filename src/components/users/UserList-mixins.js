export default {
  data() {
    return {
      // 用户列表信息
      userList: [],
      // 分页参数信息
      queryInfo: {
        // 查询信息
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 3,
        // 总条数
        total: 0
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '请求用户列表失败!',
          type: 'error',
          duration: 1000
        })
      }
      // 请求成功
      this.userList = res.data.users
      // 获取数据总数
      this.queryInfo.total = res.data.total
    },
    // 分页相关逻辑
    // 每页数据大小变化触发的回调
    handleSizeChange(newSize) {
      // 改变默认的pagesize
      this.queryInfo.pagesize = newSize
      // 重新请求数据
      this.getUserList()
    },
    //  页码发生变化触发的回调
    handleCurrentChange(newPage) {
      // 改变默认的pagenum
      this.queryInfo.pagenum = newPage
      // 重新请求数据
      this.getUserList()
    },
    // 用户状态发生改变触发的回调
    async changeState(uid, type) {
      const { data: res } = await this.$http.put(`users/${uid}/state/${type}`)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '修改用户状态失败!',
          duration: 1000,
          type: 'error'
        })
      }
      // 请求成功
      this.$message({
        message: res.meta.msg,
        duration: 1000,
        type: 'success'
      })
      // 刷新页面
      this.getUserList()
    }
  }
}
