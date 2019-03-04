export default {
  data() {
    return {
      // 编辑商品表单对象
      editForm: {
        goods_name: '',
        goods_price: '',
        goods_number: ''
      },
      // 分类列表数据(必须)
      goods_cat: '1,2,3',
      // 商品列表数据
      goodsList: [],
      // 编辑表单是否显示
      editDialogVisible: false,
      // 获取订单列表条件对象
      queryInfo: {
        // 查询条件
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 总商品数量
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          duration: 1000,
          message: res.meta.msg
        })
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 页码改变触发回调
    handleSizeChange(value) {
      this.queryInfo.pagesize = value
      this.getGoodsList()
    },
    // 每页尺寸变化触发回调
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value
      this.getGoodsList()
    },
    // 清空输入框时显示第一页的内容
    search() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('goodsadd')
    },
    // 删除商品
    async delGoods(id) {
      // 确认删除
      const cfm = await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message({
            duration: 1000,
            message: res.meta.msg,
            type: 'error'
          })
        }
        // 成功刷新页面并提示
        this.getGoodsList()
        this.$message({
          duration: 1000,
          message: res.meta.msg,
          type: 'success'
        })
      }
    },
    // 编辑商品相关
    // 展示编辑表单填充所需数据
    async showEditDialog(info) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`goods/${info.goods_id}`)
      if (res.meta.status !== 200) {
        return this.$message({
          duration: 1000,
          message: res.meta.msg,
          type: 'error'
        })
      }
      // 成功,填充editForm
      this.editForm = res.data
    },
    async editGoods() {
      const { data: res } = await this.$http.put(
        `goods/${this.editForm.goods_id}`,
        this.editForm
        // goods_name: this.editForm.goods_name,
        // goods_price: this.editForm.goods_price,
        // goods_number: this.editForm.goods_number,
        // goods_weight: this.editForm.goods_weight,
        // goods_cat: this.goods_cat
      )
      if (res.meta.status !== 200) {
        return this.$message({
          duration: 1000,
          message: res.meta.msg,
          type: 'error'
        })
      }
      // 成功,提示并刷新页面关闭弹层
      this.editDialogVisible = false
      this.$message({
        duration: 1000,
        message: res.meta.msg,
        type: 'success'
      })
      this.getGoodsList()
    },
    // 弹层关闭前的回调
    editDialogbeforeClose(done) {
      this.$refs.editFormRef.resetFields()
      done()
    },
    // 点击取消也就是关闭的回调
    editDialogClose() {
      // 对话框关闭
      this.editDialogVisible = false
      // 清空对话框
      this.$refs.editFormRef.resetFields()
    }
  }
}
