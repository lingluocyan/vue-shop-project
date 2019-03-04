export default {
  data() {
    return {
      // 订单列表数据
      orderList: [],
      // 物流信息
      wuliuList: [],
      // 物流对话框是否显示
      wuliuDialogVisible: false,
      // 获取订单列表条件对象,也是分页数据
      queryInfo: {
        query: '', // 搜索名称
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示数量
      },
      // 订单总数
      total: 0
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get(`orders`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          duration: 1000,
          message: res.meta.msg
        })
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 查看订单物流
    async showWuliuDialog() {
      // axios调用接口获得物流信息
      const { data: res } = await this.$http.get('kuaidi/81337523816')

      if (res.meta.status !== 200) {
        return this.$message({
          message: '获得物流列表失败！',
          type: 'error',
          duration: 1000
        })
      }

      this.wuliuList = res.data
      this.wuliuDialogVisible = true
    },
    // 页码改变触发回调
    handleSizeChange(value) {
      this.queryInfo.pagesize = value
      this.getOrderList()
    },
    // 每页尺寸变化触发回调
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value
      this.getOrderList()
    }
  }
  // 过滤器,转换时间的格式
  // filters: {
  //   dateFormate(val) {
  //     moment(val).format('YYYY-MM-DD HH-mm-ss')
  //   }
  // }
}
