export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 请求权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get(`rights/list`)
      if (res.meta.status !== 200) {
        return this.$message({
          dduration: 1000,
          type: 'error',
          message: res.meta.msg
        })
      }
      // 请求成功,更新数据
      this.rightsList = res.data
    }
  }
}
